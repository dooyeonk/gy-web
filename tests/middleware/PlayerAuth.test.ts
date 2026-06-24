import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RequirePlayerJWT } from '../../src/middleware/PlayerAuth';

vi.mock('../../src/config', () => ({
  config: { JWT_SECRET: 'test-secret' },
}));

function makeReq(headers: Record<string, string> = {}): Request {
  return { headers } as unknown as Request;
}

function makeRes() {
  const res = { status: vi.fn(), json: vi.fn() } as unknown as Response;
  (res.status as ReturnType<typeof vi.fn>).mockReturnValue(res);
  return res;
}

describe('RequirePlayerJWT', () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
  });

  it('유효한 토큰 → accountId/steamId 세팅 후 next 호출', () => {
    const token = jwt.sign({ accountId: 1, steamId: 'dev_1' }, 'test-secret');
    const req = makeReq({ authorization: `Bearer ${token}` });
    const res = makeRes();

    RequirePlayerJWT(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.accountId).toBe(1);
    expect(req.steamId).toBe('dev_1');
  });

  it('Authorization 헤더 없음 → 401', () => {
    const req = makeReq();
    const res = makeRes();

    RequirePlayerJWT(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('잘못된 토큰 → 401', () => {
    const req = makeReq({ authorization: 'Bearer invalid.token' });
    const res = makeRes();

    RequirePlayerJWT(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('만료된 토큰 → 401', () => {
    const token = jwt.sign({ accountId: 1, steamId: 'dev_1' }, 'test-secret', { expiresIn: -1 });
    const req = makeReq({ authorization: `Bearer ${token}` });
    const res = makeRes();

    RequirePlayerJWT(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
