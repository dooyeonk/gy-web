import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

interface PlayerPayload {
  accountId: number;
  steamId: string;
}

export function RequirePlayerJWT(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as PlayerPayload;
    req.accountId = payload.accountId;
    req.steamId = payload.steamId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
