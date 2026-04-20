import { Elysia, redirect } from 'elysia';
import config from '@/config/config';
import { HydraHandler } from './hydra.handler';
import { CallbackQuery, ConsentQuery } from './hydra.model';

export const hydraRoutes = new Elysia({ name: 'id.hydra.routes' })
  .get(
    '/callback',
    async ({ query: { code }, cookie: { ssid }, redirect, request }) => {
      const domain = new URL(request.url).hostname;

      await HydraHandler.handleCallback(code, ssid, domain);

      return redirect(config.frontendCallbackUrl, 302);
    },
    { query: CallbackQuery },
  )
  .get(
    '/consent',
    async ({ query: { consent_challenge } }) => {
      const redirectTo = await HydraHandler.handleConsent(consent_challenge);
      return redirect(redirectTo);
    },
    { query: ConsentQuery },
  )
