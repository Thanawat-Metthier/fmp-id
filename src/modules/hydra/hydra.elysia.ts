import { Elysia } from 'elysia';
import { HydraHandler } from './hydra.handler';
import { CallbackQuery } from './hydra.model';

export const hydraRoutes = new Elysia({ name: 'id.hydra.routes' })
  .get(
    '/callback',
    async ({ query: { code } }) => {
      const result = await HydraHandler.handleCallback(code);
      // TODO: Exchange code with Hydra token endpoint → create said session
      return result;
    },
    { query: CallbackQuery },
  );
