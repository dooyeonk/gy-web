import { Router } from 'express';
import { z } from 'zod';
import { AuthService } from '../services';

const LoginSchema = z.object({
  steamId: z.string().min(1),
  ticket: z.string().optional(),
});

export const AuthRouter = Router();

AuthRouter.post('/login', async (req, res) => {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.issues });
    return;
  }
  const data = await AuthService.loginOrRegister(result.data.steamId);
  res.json(data);
});
