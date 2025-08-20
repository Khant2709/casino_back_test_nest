import fs from 'fs';
import path from 'path';
import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { logSuspiciousSlug } from '@utils/suspiciousLogger';
import { CasinoService } from '@modules/casino/casino.service';
import { MAKE_KEY, PATH_LOGS } from '@constants/envData';

const LOG_PATH = path.join(PATH_LOGS, 'domain_blocked.log');

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

@Injectable()
export class DomainMiddleware implements NestMiddleware {
  constructor(private readonly casinoService: CasinoService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let host = req.hostname.toLowerCase();

    if (host.startsWith('www.')) {
      host = host.slice(4);
    }

    req.domain = host;

    const resultCasinoId = await this.casinoService.getCasinoId(host);
    // console.log('[CASINO ID ==== ] ', resultCasinoId);
    if (resultCasinoId?.status !== 200 || !resultCasinoId?.data?.[0]?.id) {
      const logMessage = `[DomainMiddleware] Неизвестный домен: ${host}`;
      fs.appendFile(LOG_PATH, logMessage + '\n', (err) => {
        if (err) console.error('Ошибка записи в лог:', err.message);
      });

      throw new NotFoundException('Казино не найдено');
    }
    // console.log('[CASINO ID  2 ==== ] ', resultCasinoId.data[0].id);
    req.casinoId = resultCasinoId.data[0].id;

    next();
  }
}

@Injectable()
export class CasinoIdMiddleware implements NestMiddleware {
  constructor(private readonly casinoService: CasinoService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let domain = String(req.body.domain || '').trim();
    domain = domain.toLowerCase();

    if (domain.startsWith('www.')) {
      domain = domain.slice(4);
    }

    if (!domain) throw new BadRequestException('Домен казино не передан');

    const resultCasinoId = await this.casinoService.getCasinoId(domain);
    if (resultCasinoId?.status !== 200 || !resultCasinoId?.data?.[0]?.id) {
      throw new NotFoundException('Казино не найдено');
    }
    req.casinoId = resultCasinoId.data[0].id;
    next();
  }
}

export const validateParam = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const value = req.params[paramName];

    if (
      !value?.trim() ||
      value.length > 100 ||
      !/^[a-zA-Z0-9_-]+$/.test(value)
    ) {
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      logSuspiciousSlug(String(ip), String(value));
      res.status(400).json({
        status: 400,
        message: `Невалидный или слишком длинный параметр "${paramName}".`,
      });
      return;
    }

    next();
  };
};

@Injectable()
export class MakeKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const clientSecret = request.headers['x-make-secret'];

    if (typeof clientSecret !== 'string' || clientSecret !== MAKE_KEY) {
      throw new ForbiddenException('Недопустимый ключ доступа');
    }

    return true;
  }
}

export function IsDateTimeString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateTimeString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          console.log(value);
          
          return (
            typeof value === 'string' &&
            /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)
          );
        },
      },
    });
  };
}
