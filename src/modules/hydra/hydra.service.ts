import config from "@/config/config";
import { SelectUserSchema } from "@/db/schema/core";
import { log } from "@/libs/logger.lib";
import RedisService from "@/libs/redis.lib";
import { User } from "@/modules/users/users.model";
import { UserService } from "@/modules/users/users.service";
import { AcceptOAuth2LoginRequest, Configuration, OAuth2Api, OAuth2ApiAcceptOAuth2ConsentRequestRequest } from "@ory/hydra-client";
import { status } from "elysia";
import { jwtDecode } from "jwt-decode";
import crypto from "node:crypto";
import { IdTokenPayload, OAuthTokenResponse, SessionData } from "./hydra.model";

const oauth2 = new OAuth2Api(new Configuration({ basePath: config?.hydra?.adminUrl ?? '' }));
// const oauth2 = new OAuth2Api({
//   basePath: config?.hydra?.adminUrl ?? '',
//   isJsonMime: () => true,
// });

export abstract class HydraService {
  /**
   * Builds the Hydra OAuth2 authorization URL to initiate the login flow.
   * @param ws The workspace slug
   */
  static async buildAuthorizationUrl(ws?: string): Promise<string> {
    try {
      const clientId = config.hydra.clientId;
      const redirectUri = config.hydra.redirectUri;
      const hydraPublicEndpoint = config.hydra.publicUrl;

      const scope = "openid+offline";
      const responsType = "code";
      const state = `member_${crypto.randomUUID()}`;

      // สร้าง OAuth2 Authorization URL สำหรับ redirect ไปยัง Hydra
      let authorizationUrl = `${hydraPublicEndpoint}/oauth2/auth?user_type=membera&ws=${ws}&audience=&client_id=${clientId}&max_age=0&redirect_uri=${redirectUri}&response_type=${responsType}&scope=${scope}&state=${state}`;

      // หมายเหตุ: ส่วนของ code_challenge จะต้องส่งมาจาก Client (mobile/spa)
      // แต่ในเบื้องต้นเราใช้ค่าพื้นฐานจาก config ก่อน

      log.info(`HydraService.buildAuthorizationUrl for workspace: ${ws}`);
      return authorizationUrl;
    } catch (error) {
      log.error("HydraService.buildAuthorizationUrl", error);
      throw error;
    }
  }
  /**
   * Accepts the Hydra login challenge after user credentials are verified.
   * Returns the redirect_to URL from Hydra to continue the OAuth2 flow.
   * @param user The authenticated user
   * @param loginChallenge The login_challenge from Hydra
   */
  static async acceptLoginChallenge(user: User, loginChallenge: string): Promise<string> {
    try {
      // ✅ Step 1: GET — ดึงข้อมูล login request จาก Hydra
      const { data } = await oauth2.getOAuth2LoginRequest({
        loginChallenge,
      });

      // ✅ Step 2: ถ้า skip = true → user เคย login แล้ว ให้ accept โดยใช้ subject เดิม
      const subject = data.skip ? data.subject : String(user.id);
      const acceptOAuth2LoginRequest: AcceptOAuth2LoginRequest = {
        subject,
        remember: true,
        remember_for: config.hydra.rememberFor,
      }

      const { data: acceptData } = await oauth2.acceptOAuth2LoginRequest({
        loginChallenge,
        acceptOAuth2LoginRequest
      });

      return acceptData.redirect_to;
    } catch (error) {
      log.error("HydraService.acceptLoginChallenge", error);
      throw error;
    }
  }

  /**
   * Accepts the Hydra consent challenge.
   * Grants all requested scopes and returns the redirect_to URL.
   * @param consentChallenge The consent_challenge from Hydra
   */
  static async acceptConsentChallenge(consentChallenge: string): Promise<string> {
    try {
      // ✅ Step 1: GET — ดึงข้อมูล consent request จาก Hydra
      const { data } = await oauth2.getOAuth2ConsentRequest({
        consentChallenge,
      });

      // หมายเหตุ: ไม่ว่า skip หรือ client.skip_consent จะเป็น true หรือไม่
      // เราก็ auto-accept consent เสมอ เพราะ logic เหมือนกันทุกกรณี
      const acceptPayload: OAuth2ApiAcceptOAuth2ConsentRequestRequest = {
        consentChallenge,
        acceptOAuth2ConsentRequest: {
          grant_scope: data.requested_scope,
          grant_access_token_audience: data.requested_access_token_audience,
          remember: true,
          remember_for: config.hydra.rememberFor,
          session: {},
        },
      };

      const { data: acceptData } = await oauth2.acceptOAuth2ConsentRequest(acceptPayload);

      return acceptData.redirect_to;
    } catch (error) {
      log.error("HydraService.acceptConsentChallenge", error);
      throw error;
    }
  }

  // ─── Token & Session ─────────────────────────────────────────────────────────

  /**
   * Exchanges the authorization code for OAuth tokens via Hydra's public token endpoint.
   * Mirrors OryHydraService.exchangeCodeForToken from fmp-api-gateway.
   */
  static async exchangeCodeForToken(code: string): Promise<OAuthTokenResponse> {
    try {
      const { clientId, clientSecret, redirectUri, publicUrl } = config.hydra;

      if (!clientId || !clientSecret) {
        throw status(500, 'OAuth configuration missing');
      }

      // ✅ Use client_secret_basic (Basic Auth) — Hydra client requires credentials in Authorization header
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      });

      const response = await fetch(`${publicUrl}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basicAuth}`,
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        log.error('❌ [HydraService.exchangeCodeForToken] Token exchange failed', {
          status: response.status,
          data: errorData,
        });
        throw status(response.status, 'OAuth code exchange failed');
      }

      const data = await response.json();
      log.info('✅ [HydraService.exchangeCodeForToken] Token exchange successful');
      return data as OAuthTokenResponse;
    } catch (error) {
      log.error('HydraService.exchangeCodeForToken', error);
      throw error;
    }
  }

  /**
   * Generates a unique session ID.
   * Mirrors SessionService.createSessionId from fmp-api-gateway.
   */
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

  /**
   * Stores OAuth token response in Redis as the user's session.
   * Mirrors SessionService.createSession from fmp-api-gateway.
   */
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
      log.info('✅ [HydraService.createSession] Session stored', { sessionId });
    } catch (error) {
      log.error('HydraService.createSession', error);
      throw error;
    }
  }
}
