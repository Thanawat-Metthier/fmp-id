import html from '@elysiajs/html';
import { Elysia, redirect } from 'elysia';
import { renderLogin } from './login-ui';
import { LoginHandler } from './login.handler';
import { CustomerParams, LoginBody, LoginQuery, PathParams, WorkspaceParams } from './login.model';

export const loginRoutes = new Elysia({ name: 'module.login' })
  // ─── Root (GET /) ─────────────────────────────────────────────────────────────
  .get('/', async ({ cookie, redirect, query }) => {
    const redirectLoginUrl = await LoginHandler.handleRootLogin(cookie);
    const queryString = query.login_challenge ? `&login_challenge=${query.login_challenge}` : '';

    return redirect(`${redirectLoginUrl}${queryString}`);
  }, { query: LoginQuery })
  .use(html())
  .get('/login', async ({ cookie, query: { login_challenge } }) => {

    if (!login_challenge) {
      return redirect(`/`);
    }

    const ci = await LoginHandler.handleLogin(cookie);
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
  .get(
    '/ws/:workspace',
    async ({ params: { workspace }, query, cookie, redirect }) => {
      const redirectLoginUrl = await LoginHandler.handleWorkspaceLogin(workspace, cookie); // id_workspace
      const queryString = query.login_challenge ? `&login_challenge=${query.login_challenge}` : '';

      return redirect(`${redirectLoginUrl}${queryString}`);
    },
    { params: WorkspaceParams, query: LoginQuery },
  )
  .get(
    '/cs/:workspace/:customer',
    async ({ params: { workspace, customer }, query, cookie, redirect }) => {
      const redirectLoginUrl = await LoginHandler.handleCustomerLogin(workspace, customer, cookie);
      const queryString = query.login_challenge ? `&login_challenge=${query.login_challenge}` : '';

      return redirect(`${redirectLoginUrl}${queryString}`);
    },
    { params: CustomerParams, query: LoginQuery },
  )
  .get(
    '/:path',
    async ({ params: { path }, query, redirect }) => {
      const redirectLoginUrl = await LoginHandler.handlePathLogin(path);
      const queryString = query.login_challenge ? `?login_challenge=${query.login_challenge}` : '';

      return redirect(`${redirectLoginUrl}${queryString}`);
    },
    { params: PathParams, query: LoginQuery },
  );
