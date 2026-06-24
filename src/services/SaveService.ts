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
    const result = await db.character.updateMany({
      where: { id: characterId, deletedAt: null, saveVersion: expectedVersion },
      data: { level, xp, data: gameData, saveVersion: { increment: 1 } },
    });

    if (result.count === 0) {
      const exists = await db.character.findFirst({
        where: { id: characterId, deletedAt: null },
        select: { id: true },
      });
      if (!exists) return { notFound: true as const };
      return { conflict: true as const };
    }

    return { saveVersion: expectedVersion + 1 };
  }
}
