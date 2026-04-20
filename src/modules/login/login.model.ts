import { Static, t } from 'elysia';

// ─── Session / Cookie ──────────────────────────────────────────────────────────

export const SessionCookie = t.Object({
  said: t.Optional(t.String()),
  workspace: t.Optional(t.String()),
  customer: t.Optional(t.String()),
});

export type SessionCookie = Static<typeof SessionCookie>;

// ─── Params ────────────────────────────────────────────────────────────────────

export const WorkspaceParams = t.Object({
  workspace: t.String(),
});
export type WorkspaceParams = Static<typeof WorkspaceParams>;

export const CustomerParams = t.Object({
  workspace: t.String(),
  customer: t.String(),
});
export type CustomerParams = Static<typeof CustomerParams>;

export const PathParams = t.Object({
  path: t.String(),
});
export type PathParams = Static<typeof PathParams>;

export const LoginBody = t.Object({
  username: t.String(),
  password: t.String(),
});
export type LoginBody = Static<typeof LoginBody>;

export const LoginQuery = t.Object({
  login_challenge: t.Optional(t.String()),
});
export type LoginQuery = Static<typeof LoginQuery>;

export interface LoginResponse {
  success: boolean;
  redirectTo: string;
  message: string;
  error: unknown;
}