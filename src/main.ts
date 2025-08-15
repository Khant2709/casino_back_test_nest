import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import cors from 'cors';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';

import { startMysql } from '@config/mysql';
import { PATH_LOGS, PORT } from '@constants/envData';

// Пути до логов для CORS и rate-limit
const CORS_LOG_PATH = path.join(PATH_LOGS, 'cors_blocked.log');
const RATE_LIMIT_LOG_PATH = path.join(PATH_LOGS, 'ratelimit_blocked.log');

async function bootstrap() {
  // 1. Подключение к базе данных (до запуска сервера)
  try {
    await startMysql();
  } catch (err) {
    console.error('🛑 Остановка запуска: не удалось подключиться к базе данных');
    process.exit(1); // Прерываем запуск сервера
  }

  // 2. Создание Nest-приложения (на базе Express)
  const app = await NestFactory.create(AppModule);

  // 3. Получаем raw-инстанс Express для настройки middleware напрямую
  const expressApp = app.getHttpAdapter().getInstance();

  // 4. Доверяем заголовкам прокси (нужно, если сервер работает за Nginx / Cloudflare и т.д.)
  expressApp.set('trust proxy', 1);

  // 5. Устанавливаем безопасные HTTP-заголовки
  expressApp.use(helmet());

  // 6. Ограничиваем размер JSON и urlencoded тел (безопасность + защита от DoS)
  expressApp.use(express.json({ limit: '1mb' }));
  expressApp.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // 7. CORS-логика: логируем заблокированные домены
  const allowedOrigins = [
    'https://clubnika-casino725.online',
    'https://www.clubnika-casino725.online',
  ];

  expressApp.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && !allowedOrigins.includes(origin)) {
      const ip = req?.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const ua = req.headers['user-agent'] || 'unknown';
      const logMessage = `[${new Date().toISOString()}] Blocked CORS request\nOrigin: ${origin}\nIP: ${ip}\nUser-Agent: ${ua}\nURL: ${req.originalUrl}\n\n`;

      console.warn(logMessage);
      fs.appendFile(CORS_LOG_PATH, logMessage, () => {});
    }
    next();
  });

  // 8. Устанавливаем CORS (с поддержкой credentials)
  expressApp.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    }),
  );

  // 9. Ограничение количества запросов с одного IP (защита от спама/атаки)
  expressApp.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 минут
      max: 100, // максимум 100 запросов за это время
      handler: (req, res) => {
        const ip = req?.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        const logMessage = `[${new Date().toISOString()}] Rate limit exceeded\nIP: ${ip}\nURL: ${req.originalUrl}\n\n`;
        fs.appendFile(RATE_LIMIT_LOG_PATH, logMessage, () => {});
        console.log(`[RATE LIMIT BLOCKED] IP: ${ip}, URL: ${req.originalUrl}`);
        res.status(429).json({ message: 'Слишком много запросов. Повторите позже.' });
      },
    }),
  );

  // 10. Замедление частых запросов (после 50 — добавляется задержка)
  expressApp.use(
    slowDown({
      windowMs: 15 * 60 * 1000,
      delayAfter: 50,
      delayMs: () => 500, // каждые следующие запросы задерживаются на 0.5 сек
    }),
  );

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // удаляет лишние поля, которых нет в DTO
    forbidNonWhitelisted: true, // выдаёт ошибку, если пришли лишние поля
    transform: false, // приводит типы (например, строки в числа)
  }));

  // 11. Запуск сервера на указанном порту
  await app.listen(PORT);
  console.log(`🚀 Сервер запущен на порту: ${PORT}`);
}

bootstrap();
