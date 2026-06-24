import { db } from '../db';
import { MAX_CHARACTERS_PER_ACCOUNT } from '../constants';

export class CharacterService {
  static async create(accountId: number, name: string) {
    const count = await db.character.count({
      where: { accountId, deletedAt: null },
    });

    if (count >= MAX_CHARACTERS_PER_ACCOUNT) return null;

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
