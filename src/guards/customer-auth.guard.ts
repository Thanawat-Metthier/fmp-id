import config from '@/config/config';
import { authGuard } from '@/guards/auth.guard';
import { Cookie, redirect } from 'elysia';

export const customerAuthGuard = async ({ cookie }: { cookie: Record<string, Cookie<unknown>> }) => {
  const sessionData = await authGuard(cookie);
  if (!sessionData) return;

  // Check role
  const roleCode = sessionData.user?.userType;
  if (roleCode !== 'C') return;

  // Session is fully valid, redirect to the frontend.
  const frontendUrl = config.frontendCallbackUrl.replace('/callback', '');
  return redirect(frontendUrl, 302);
};
