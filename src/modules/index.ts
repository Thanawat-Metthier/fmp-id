// Aggregation of all routes for fmp-id.
// Import individual route instances from modules and compose them here.

import { hydraRoutes } from '@/modules/hydra/hydra.elysia';
import { loginRoutes } from '@/modules/login/login.elysia';
import { notFoundRoutes } from '@/modules/not-found/not-found.elysia';
import Elysia from 'elysia';

export const appRoutes = new Elysia()
  .use(notFoundRoutes)
  .use(hydraRoutes)
  .use(loginRoutes); // loginRoutes now contains root, workspace, customer, and path wildcards
