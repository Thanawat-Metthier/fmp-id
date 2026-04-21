import config from '@/config/config';
import RedisService from '@/libs/redis.lib';
import crypto from 'node:crypto';
import { jwtDecode } from 'jwt-decode';
import { status } from 'elysia';
import { log } from '@/libs/logger.lib';
import { UserService } from '@/modules/users/users.service';

import type { SessionData, IdTokenPayload, OAuthTokenResponse } from '@/modules/hydra/hydra.model';

const prefixSessionId = 'session:ssid';
const prefixSessionIdForHeader = 'ssid_';

export abstract class SessionUtil {
  static async getSession(sessionId: string): Promise<SessionData | null> {
    const sessionData = await RedisService.get(sessionId);
    if (sessionData) {
      return sessionData as SessionData;
    }
    return null;
  }

  static async createSessionId(): Promise<string> {
    const prefix = 'session:ssid';
    const uuid = crypto.randomUUID();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(32));
    const random32 = Array.from(randomValues)
      .map((b) => chars.charAt(b % chars.length))
      .join('');

    const counter = await RedisService.increment('session_id_counter');
    const cyclingCounter = (counter % 100).toString().padStart(2, '0');

    return `${prefix}_${uuid}_${random32}_${cyclingCounter}`;
  }

  static async createSession(sessionId: string, oauthToken: OAuthTokenResponse): Promise<void> {
    try {

      if (!oauthToken?.id_token) {
        throw status(500, 'OAuth token missing');
      }
      const payload = jwtDecode<IdTokenPayload>(oauthToken.id_token);
      const userId = Number(payload.sub);
      const user = await UserService.findOne({ id: userId });

      if (!user) {
        throw status(404, 'User not found');
      }

      const now = Date.now();
      const sessionData: SessionData = {
        ...oauthToken,
        issued_at: now,
        last_activity: now,
        user,
        v: 2,
      };

      // 7 days TTL
      await RedisService.set(sessionId, sessionData, 60 * 60 * 24 * 7);
      log.info('✅ [SessionUtil.createSession] Session stored', { sessionId });
    } catch (error) {
      log.error('SessionUtil.createSession', error);
      throw error;
    }
  }

  static async isIdleExpired(sessionData: SessionData): Promise<boolean> {
    const now = Date.now();
    const idleTimeoutMs = config.authTokenIdleExpire * 60 * 1000;
    const idleLimit = sessionData.last_activity + idleTimeoutMs;
    return now >= idleLimit;
  }

  static async isTokenExpired(sessionData: SessionData): Promise<boolean> {
    const now = Date.now();
    const expiresAt = sessionData.issued_at + sessionData.expires_in * 1000;
    // Buffer of 60 seconds to prevent edge cases
    return now >= expiresAt - 60000;
  }

  static async deleteSession(sessionId: string): Promise<void> {
    await RedisService.delete(sessionId);
  }

  static extractSessionId(sessionIdStr: unknown): string | null {
    if (typeof sessionIdStr !== 'string') {
      return null;
    }

    if (sessionIdStr.startsWith(prefixSessionIdForHeader)) {
      return `session:${sessionIdStr}`;
    }

    if (sessionIdStr.startsWith(prefixSessionId)) {
      return sessionIdStr;
    }

    return null;
  }
}
