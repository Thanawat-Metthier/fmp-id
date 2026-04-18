import { log } from '@/libs/logger.lib';


// ─── LoginHandler ────────────────────────────────────────────────────────────────

export abstract class HydraHandler {

  static async handleCallback(code: string) {
    try {
      return code;
    } catch (error) {
      log.error('HydraHandler.handleCallback', error);
      throw error;
    }
  }

}
