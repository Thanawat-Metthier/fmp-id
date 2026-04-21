import { log } from '@/libs/logger.lib';
import { SessionData } from '@/modules/hydra/hydra.model';
import { SessionUtil } from '@/utils/session.util';
import { Cookie } from 'elysia';

// ─── AuthGuard ──────────────────────────────────────────────────────────────
// Validates session from cookie. Returns SessionData if valid, undefined otherwise.

export const authGuard = async (
  cookie: Record<string, Cookie<unknown>>,
): Promise<SessionData | undefined> => {

  const ssid = cookie['ssid'] as Cookie<string | undefined> | undefined;

  if (!ssid || !ssid.value) return;

  const sessionId = SessionUtil.extractSessionId(ssid.value);
  if (!sessionId) return;

  const sessionData = await SessionUtil.getSession(sessionId);
  if (!sessionData) return;

  if (sessionData.v !== 2) return;

  const isIdleExpired = await SessionUtil.isIdleExpired(sessionData);
  const isTokenExpired = await SessionUtil.isTokenExpired(sessionData);

  if (isIdleExpired || isTokenExpired) {
    log.info(`[AuthGuard] Session ${sessionId} expired. Deleting...`);
    await SessionUtil.deleteSession(sessionId);
    ssid.remove();
    return;
  }

  return sessionData;
};
