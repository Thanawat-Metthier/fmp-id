import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { renderNotFound } from './not-found-ui';

export const notFoundRoutes = new Elysia({ name: 'id.not-found.routes' })
  .use(html())
  .get('/not-found', () => renderNotFound());
