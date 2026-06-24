declare global {
  namespace Express {
    interface Request {
      accountId: number;
      steamId: string;
    }
  }
}
export {};
