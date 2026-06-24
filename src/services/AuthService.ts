import { db } from '../db';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export class AuthService {
  static async loginOrRegister(steamId: string) {
    // TODO: 실제 Steam 티켓 검증
    const account = await db.account.upsert({
      where: { steamId },
      update: {},
      create: { steamId },
    });

    const token = jwt.sign(
      { accountId: account.id, steamId: account.steamId },
      config.JWT_SECRET,
      { expiresIn: '7d' },
    );

    return { token, accountId: account.id };
  }
}
