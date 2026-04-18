import config from "@/config/config";
import { log } from "@/libs/logger.lib";
import crypto from "node:crypto";

export abstract class HydraService {
  /**
   * Generates the Hydra OAuth2 authorization URL for a member login.
   * @param ws The workspace slug
   */
  static async getHydraLoginUrl(ws: string): Promise<string> {
    try {
      // ดึงค่าจาก config ที่เราตั้งค่าไว้ในโปรเจกต์ใหม่
      const clientId = config.hydra.clientId;
      const redirectUri = config.hydra.redirectUri;
      const hydraPublicEndpoint = config.hydra.publicUrl;

      const scope = "openid+offline";
      const responsType = "code";
      const state = `member_${crypto.randomUUID()}`;

      // สร้าง URL สำหรับ Hydra
      let memberOauthUrl = `${hydraPublicEndpoint}/oauth2/auth?user_type=membera&ws=${ws}&audience=&client_id=${clientId}&max_age=0&redirect_uri=${redirectUri}&response_type=${responsType}&scope=${scope}&state=${state}`;

      // หมายเหตุ: ส่วนของ code_challenge จะต้องส่งมาจาก Client (mobile/spa) 
      // แต่ในเบื้องต้นเราใช้ค่าพื้นฐานจาก config ก่อน

      log.info(`Generating Hydra URL for workspace: ${ws}`);
      return memberOauthUrl;
    } catch (error) {
      log.error("HydraService.getHydraLoginUrl", error);
      throw error;
    }
  }
}
