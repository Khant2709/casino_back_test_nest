import { Request, Response, NextFunction } from 'express';
import { logSuspiciousSlug } from '@utils/suspiciousLogger';

export const normalizeDomain = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let host = req.hostname.toLowerCase();
  if (host.startsWith('www.')) {
    host = host.slice(4);
  }
  req.domain = host;
  next();
};

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
      res
        .status(400)
        .json({ status: 400, message: `Невалидный или слишком длинный параметр "${paramName}".` });
      return;
    }

    next();
  };
};
