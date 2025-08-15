import * as dotenv from 'dotenv';
dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Переменная окружения ${name} не задана`);
  }
  return value;
}

export const PORT = getEnv('PORT');

export const DB_HOST = getEnv('DB_HOST');
export const DB_PORT = getEnv('DB_PORT');
export const DB_USER = getEnv('DB_USER');
export const DB_PASSWORD = getEnv('DB_PASSWORD');
export const DB_DATABASE = getEnv('DB_DATABASE');
export const PATH_LOGS = '/var/log/my_logs';

export const MAKE_KEY = getEnv('MAKE_KEY');