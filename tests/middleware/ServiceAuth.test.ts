import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { RequireServiceSecret } from '../../src/middleware/ServiceAuth';

vi.mock('../../src/config', () => ({
  config: { SERVICE_SECRET: 'test-service-secret' },
}));

function makeReq(headers: Record<string, string> = {}): Request {
  return { headers } as unknown as Request;
}

function makeRes() {
  const res = { status: vi.fn(), json: vi.fn() } as unknown as Response;
  (res.status as ReturnType<typeof vi.fn>).mockReturnValue(res);
  return res;
}

describe('RequireServiceSecret', () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
  });

  it('올바른 시크릿 → next 호출', () => {
    const req = makeReq({ 'x-service-secret': 'test-service-secret' });
    const res = makeRes();

    RequireServiceSecret(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('잘못된 시크릿 → 403', () => {
    const req = makeReq({ 'x-service-secret': 'wrong-secret' });
    const res = makeRes();

    RequireServiceSecret(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('시크릿 헤더 없음 → 403', () => {
    const req = makeReq();
    const res = makeRes();

    RequireServiceSecret(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
