import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SaveService } from '../../src/services/SaveService';
import { db } from '../../src/db';

vi.mock('../../src/db', () => ({
  db: {
    character: {
      findFirst: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

describe('SaveService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('load', () => {
    it('캐릭터 세이브 데이터 반환', async () => {
      const save = { level: 5, xp: 100, data: { items: [1, 2] }, saveVersion: 3 };
      vi.mocked(db.character.findFirst).mockResolvedValue(save as any);

      const result = await SaveService.load(1);

      expect(result).toEqual(save);
    });

    it('없는 캐릭터 → null 반환', async () => {
      vi.mocked(db.character.findFirst).mockResolvedValue(null);

      const result = await SaveService.load(999);

      expect(result).toBeNull();
    });
  });

  describe('put', () => {
    it('버전 일치 → 원자적 업데이트 후 saveVersion 증가', async () => {
      vi.mocked(db.character.updateMany).mockResolvedValue({ count: 1 });

      const result = await SaveService.put(1, 5, 100, { items: [] }, 2);

      expect(result).toEqual({ saveVersion: 3 });
      expect(db.character.updateMany).toHaveBeenCalledWith({
        where: { id: 1, deletedAt: null, saveVersion: 2 },
        data: { level: 5, xp: 100, data: { items: [] }, saveVersion: { increment: 1 } },
      });
      expect(db.character.findFirst).not.toHaveBeenCalled();
    });

    it('버전 불일치 → conflict 반환', async () => {
      vi.mocked(db.character.updateMany).mockResolvedValue({ count: 0 });
      vi.mocked(db.character.findFirst).mockResolvedValue({ id: 1 } as any);

      const result = await SaveService.put(1, 5, 100, {}, 0);

      expect(result).toEqual({ conflict: true });
    });

    it('없는 캐릭터 → notFound 반환', async () => {
      vi.mocked(db.character.updateMany).mockResolvedValue({ count: 0 });
      vi.mocked(db.character.findFirst).mockResolvedValue(null);

      const result = await SaveService.put(999, 5, 100, {}, 0);

      expect(result).toEqual({ notFound: true });
    });
  });
});
