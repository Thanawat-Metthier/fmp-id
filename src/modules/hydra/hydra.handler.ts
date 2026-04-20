import config from '@/config/config';
import { log } from '@/libs/logger.lib';
import { Cookie, status } from 'elysia';
import { HydraService } from './hydra.service';


// ─── HydraHandler ────────────────────────────────────────────────────────────────

export abstract class HydraHandler {

  static async handleCallback(code: string, ssid: Cookie<unknown>, domain: string): Promise<void> {
    try {
      if (!code) {
        throw status(400, 'Invalid code');
      }

      // Exchange authorization code for tokens
      const oauthResponse = await HydraService.exchangeCodeForToken(code);
      console.log('oauthResponse', oauthResponse)
      // Store tokens in Redis and get session ID
      const sessionId = await HydraService.createSessionId();
      await HydraService.createSession(sessionId, oauthResponse);

      // Set the session cookie
      ssid.set({
        value: sessionId,
        domain,
        httpOnly: true,
        secure: config.isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
        path: '/',
      });
    } catch (error) {
      log.error('HydraHandler.handleCallback', error);
      throw error;
    }
  }

  /**
   * Handles the consent challenge from Hydra.
   * Auto-accepts consent and returns the redirect_to URL.
   */
  static async handleConsent(consentChallenge: string): Promise<string> {
    try {
      const redirectTo = await HydraService.acceptConsentChallenge(consentChallenge);
      return redirectTo;
    } catch (error) {
      log.error('HydraHandler.handleConsent', error);
      throw error;
    }
  }

}
