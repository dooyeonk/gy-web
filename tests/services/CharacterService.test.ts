import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CharacterService } from '../../src/services/CharacterService';
import { db } from '../../src/db';

vi.mock('../../src/db', () => ({
  db: {
    character: {
      count: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock('../../src/constants', () => ({
  MAX_CHARACTERS_PER_ACCOUNT: 3,
}));

describe('CharacterService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('한도 미달 → 캐릭터 생성', async () => {
      vi.mocked(db.character.count).mockResolvedValue(1);
      vi.mocked(db.character.create).mockResolvedValue({ id: 10, name: '전사' } as any);

      const result = await CharacterService.create(1, '전사');

      expect(result).toEqual({ id: 10, name: '전사' });
      expect(db.character.create).toHaveBeenCalledWith({
        data: { accountId: 1, name: '전사' },
      });
    });

    it('한도 초과 → null 반환', async () => {
      vi.mocked(db.character.count).mockResolvedValue(3);

      const result = await CharacterService.create(1, '전사');

      expect(result).toBeNull();
      expect(db.character.create).not.toHaveBeenCalled();
    });
  });

  describe('list', () => {
    it('삭제되지 않은 캐릭터 목록 반환', async () => {
      const characters = [
        { id: 1, name: '전사', level: 5, xp: 100, updatedAt: new Date() },
      ];
      vi.mocked(db.character.findMany).mockResolvedValue(characters as any);

      const result = await CharacterService.list(1);

      expect(result).toEqual(characters);
      expect(db.character.findMany).toHaveBeenCalledWith({
        where: { accountId: 1, deletedAt: null },
        select: { id: true, name: true, level: true, xp: true, updatedAt: true },
      });
    });
  });
});
