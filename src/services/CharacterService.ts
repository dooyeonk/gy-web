import { db } from '../db';
import { config } from '../config';

export class CharacterService {
  static async create(accountId: number, name: string) {
    const count = await db.character.count({
      where: { accountId, deletedAt: null },
    });

    if (count >= config.MAX_CHARACTERS) return null;

    return db.character.create({
      data: { accountId, name },
    });
  }

  static async list(accountId: number) {
    return db.character.findMany({
      where: { accountId, deletedAt: null },
      select: { id: true, name: true, level: true, xp: true, updatedAt: true },
    });
  }
}
