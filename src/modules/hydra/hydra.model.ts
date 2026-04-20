import { t, Static } from 'elysia';
import { SelectUserSchema } from "@/db/schema/core";

export const CallbackQuery = t.Object({
  code: t.String(),
});
export type CallbackQuery = Static<typeof CallbackQuery>;

export const ConsentQuery = t.Object({
  consent_challenge: t.String(),
});
export type ConsentQuery = Static<typeof ConsentQuery>;

export type SessionData = OAuthTokenResponse & {
  issued_at: number;
  last_activity: number;
  user: SelectUserSchema;
  selected_user?: string;
  selected_customer?: string;

  v?: number;
};

export type IdTokenPayload = {
  at_hash: string;
  aud: string[];
  auth_time: number;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  rat: number;
  sid: string;
  sub: string;
};

export type OAuthTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  id_token?: string;
};
