import { db } from '../db';
import { type Prisma } from '../generated/prisma/client';

export class SaveService {
  static async load(characterId: number) {
    return db.character.findFirst({
      where: { id: characterId, deletedAt: null },
      select: { level: true, xp: true, data: true, saveVersion: true },
    });
  }

  static async put(
    characterId: number,
    level: number,
    xp: number,
    gameData: Prisma.InputJsonValue,
    expectedVersion: number,
  ) {
    const character = await db.character.findFirst({
      where: { id: characterId, deletedAt: null },
      select: { saveVersion: true },
    });

    if (!character) return { notFound: true as const };
    if (character.saveVersion !== expectedVersion) return { conflict: true as const };

    const updated = await db.character.update({
      where: { id: characterId },
      data: { level, xp, data: gameData, saveVersion: { increment: 1 } },
      select: { saveVersion: true },
    });

    return { saveVersion: updated.saveVersion };
  }
}
