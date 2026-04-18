import { config } from '@/config/config';
import { appRoutes } from '@/modules';
import { html } from '@elysiajs/html';
import { Elysia } from 'elysia';

// ─── App Entry Point ──────────────────────────────────────────────────────────

const app = new Elysia()
  .use(html())
  .use(appRoutes)
  .listen(config.port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
