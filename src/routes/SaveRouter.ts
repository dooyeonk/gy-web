import { Router } from 'express';
import { z } from 'zod';
import { RequireServiceSecret } from '../middleware';
import { SaveService } from '../services';
import { type Prisma } from '../generated/prisma/client';

const PutSaveSchema = z.object({
  level: z.number().int().min(1),
  xp: z.number().int().min(0),
  data: z.unknown(),
  expectedVersion: z.number().int().min(0),
});

export const SaveRouter = Router();

SaveRouter.use(RequireServiceSecret);

SaveRouter.get('/characters/:id/save', async (req, res) => {
  const id = Number(req.params['id']);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const save = await SaveService.load(id);
  if (!save) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(save);
});

SaveRouter.put('/characters/:id/save', async (req, res) => {
  const id = Number(req.params['id']);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const result = PutSaveSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.issues });
    return;
  }
  const { level, xp, data, expectedVersion } = result.data;
  const outcome = await SaveService.put(id, level, xp, data as Prisma.InputJsonValue, expectedVersion);
  if ('notFound' in outcome) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  if ('conflict' in outcome) {
    res.status(409).json({ error: 'Save conflict: newer version already saved' });
    return;
  }
  res.json({ saveVersion: outcome.saveVersion });
});
