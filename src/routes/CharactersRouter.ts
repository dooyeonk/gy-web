import { Router } from 'express';
import { z } from 'zod';
import { RequirePlayerJWT } from '../middleware';
import { CharacterService } from '../services';

const CreateSchema = z.object({
  name: z.string().min(1).max(30),
});

export const CharactersRouter = Router();

CharactersRouter.use(RequirePlayerJWT);

CharactersRouter.post('/', async (req, res) => {
  const result = CreateSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.issues });
    return;
  }
  const character = await CharacterService.create(req.accountId, result.data.name);
  if (!character) {
    res.status(409).json({ error: 'Character limit reached' });
    return;
  }
  res.status(201).json({ characterId: character.id });
});

CharactersRouter.get('/', async (req, res) => {
  const characters = await CharacterService.list(req.accountId);
  res.json(characters);
});
