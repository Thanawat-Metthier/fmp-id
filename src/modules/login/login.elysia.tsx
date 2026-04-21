import { adminAuthGuard } from '@/guards/admin-auth.guard';
import { customerAuthGuard } from '@/guards/customer-auth.guard';
import { userAuthGuard } from '@/guards/user-auth.guard';
import html from '@elysiajs/html';
import { Elysia, redirect } from 'elysia';
import { renderLogin } from './login-ui';
import { LoginHandler } from './login.handler';
import { CustomerParams, LoginBody, LoginQuery, PathParams, WorkspaceParams } from './login.model';

export const loginRoutes = new Elysia({ name: 'module.login' })
  .use(html())
  // ─── Root (GET /) ─────────────────────────────────────────────────────────────
  .get('/', async ({ cookie, redirect, query }) => {
    const redirectLoginUrl = await LoginHandler.handleRootLogin(cookie);
    const queryString = query.login_challenge ? `&login_challenge=${query.login_challenge}` : '';

    return redirect(`${redirectLoginUrl}${queryString}`);
  }, { query: LoginQuery, beforeHandle: [adminAuthGuard] })
  // ─── Login Page ───────────────────────────────────────────────────────────────
  .get('/login', async ({ cookie, query: { login_challenge } }) => {

    if (!login_challenge) {
      return redirect(`/`);
    }

    const ci = await LoginHandler.handleLogin(cookie);
    console.log('ci', ci)
    return renderLogin(ci, undefined, login_challenge);
  }, { query: LoginQuery })
  .post('/login', async ({ body, cookie, query: { login_challenge } }) => {

    if (!login_challenge) {
      return redirect(`/`);
    }

    const response = await LoginHandler.handleSubmitLogin(body, login_challenge, cookie);

    if (!response.success) {
      const ci = await LoginHandler.handleLogin(cookie);
      return renderLogin(ci, response.message, login_challenge);
    }

    return redirect(response.redirectTo);
  }, { body: LoginBody, query: LoginQuery })
  // ─── Workspace Login (GET /ws/:workspace) ─────────────────────────────────────
  .get(
    '/ws/:workspace',
    async ({ params: { workspace }, query, cookie, redirect }) => {
      const redirectLoginUrl = await LoginHandler.handleWorkspaceLogin(workspace, cookie);
      const queryString = query.login_challenge ? `&login_challenge=${query.login_challenge}` : '';

      return redirect(`${redirectLoginUrl}${queryString}`);
    },
    { params: WorkspaceParams, query: LoginQuery, beforeHandle: [userAuthGuard] },
  )
  // ─── Customer Login (GET /cs/:workspace/:customer) ────────────────────────────
  .get(
    '/cs/:workspace/:customer',
    async ({ params: { workspace, customer }, query, cookie, redirect }) => {
      const redirectLoginUrl = await LoginHandler.handleCustomerLogin(workspace, customer, cookie);
      const queryString = query.login_challenge ? `&login_challenge=${query.login_challenge}` : '';

      return redirect(`${redirectLoginUrl}${queryString}`);
    },
    { params: CustomerParams, query: LoginQuery, beforeHandle: [customerAuthGuard] },
  )
  // ─── Path Login (GET /:path) ──────────────────────────────────────────────────
  .get(
    '/:path',
    async ({ params: { path }, query, redirect }) => {
      const redirectLoginUrl = await LoginHandler.handlePathLogin(path);
      const queryString = query.login_challenge ? `?login_challenge=${query.login_challenge}` : '';

      return redirect(`${redirectLoginUrl}${queryString}`);
    },
    { params: PathParams, query: LoginQuery },
  );
