import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export function RequireServiceSecret(req: Request, res: Response, next: NextFunction) {
  const secret = req.headers['x-service-secret'];
  if (secret !== config.SERVICE_SECRET) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  next();
}
