import { log } from '@/libs/logger.lib';
import { LoginRouteService } from '@/modules/login-routes/login-routes.service';

import { CiObject } from '@/db/schema/core';
import { HydraService } from '@/modules/hydra/hydra.service';
import { LoginService } from '@/modules/login/login.service';
import { FindUserParams } from '@/modules/users/users.model';
import { UserService } from '@/modules/users/users.service';
import { Cookie } from 'elysia';
import { LoginBody, LoginResponse } from './login.model';
import { LoginCookieUtils } from './login.utils';

// ─── LoginHandler ────────────────────────────────────────────────────────────────

export abstract class LoginHandler {

  static async handleRootLogin(cookie: Record<string, Cookie<unknown>>): Promise<string> {
    try {

      LoginCookieUtils.remove(cookie);


      const hydraLoginUrl = await HydraService.buildAuthorizationUrl();

      return hydraLoginUrl;

    } catch (error) {
      log.error('LoginHandler.handleRootLogin', error);
      throw error;
    }
  }
  static async handleLogin(cookie: Record<string, Cookie<unknown>>): Promise<CiObject | undefined> {
    try {
      const { workspace, customer } = LoginCookieUtils.get(cookie);
      const ciData = await LoginService.getLoginCi(workspace, customer);

      return ciData?.ci;
    } catch (error) {
      log.error('LoginHandler.handleLogin', error);
      throw error;
    }
  }
  static async handleWorkspaceLogin(workspace: string, cookie: Record<string, Cookie<unknown>>): Promise<string> {
    try {

      const user = await UserService.findOne({ workspace, customer: null, isActive: true })
      if (!user) {
        return '/not-found';
      }

      LoginCookieUtils.set(cookie, user.workspace, user.customer);

      const hydraLoginUrl = await HydraService.buildAuthorizationUrl(workspace);

      return hydraLoginUrl;
    } catch (error) {
      log.error('LoginHandler.handleWorkspaceLogin', error);
      throw error;
    }
  }

  static async handleCustomerLogin(workspace: string, customer: string, cookie: Record<string, Cookie<unknown>>): Promise<string> {
    try {

      const user = await UserService.findOne({ workspace, customer, isActive: true })

      if (!user) {
        return '/not-found';
      }

      LoginCookieUtils.set(cookie, user.workspace, user.customer);

      const hydraLoginUrl = await HydraService.buildAuthorizationUrl(workspace);

      return hydraLoginUrl;
    } catch (error) {
      log.error('LoginHandler.handleCustomerLogin', error);
      throw error;
    }
  }

  static async handlePathLogin(path: string): Promise<string> {
    try {

      const loginRouter = await LoginRouteService.findOne({ path, isActive: true })

      if (!loginRouter) return '/not-found';

      if (loginRouter.customer) {
        return `/cs/${loginRouter.workspace}/${loginRouter.customer}`;
      }

      if (loginRouter.workspace) {
        return `/ws/${loginRouter.workspace}`;
      }

      return '/';
    } catch (error) {
      log.error('LoginHandler.handlePath', error);
      throw error;
    }
  }

  static async handleSubmitLogin(body: LoginBody, loginChallenge: string, cookie: Record<string, Cookie<unknown>>): Promise<LoginResponse> {
    try {

      const response: LoginResponse = {
        success: true,
        redirectTo: '',
        message: 'success',
        error: undefined
      }

      const { workspace, customer } = LoginCookieUtils.get(cookie);
      const { username, password } = body;

      const userFilter: FindUserParams = {
        username,
        isActive: true
      }

      const isRoleAdmin = !workspace && !customer;
      const isRoleUser = workspace && !customer;
      const isRoleCustomer = workspace && customer;

      if (isRoleAdmin) {
        userFilter.userType = "A";
      }
      if (isRoleUser) {
        userFilter.userType = "U";
        userFilter.workspace = workspace;
        userFilter.customer = null;
      }
      if (isRoleCustomer) {
        userFilter.userType = "C";
        userFilter.workspace = workspace;
        userFilter.customer = customer;
      }

      const user = await UserService.findOne(userFilter);

      if (!user) {
        response.success = false;
        response.message = "Username หรือ Password ไม่ถูกต้อง";
        response.error = "user not found";
        return response;
      }

      const isMatch = await Bun.password.verify(password, user?.password ?? '');

      if (!isMatch) {
        response.success = false;
        response.message = "Username หรือ Password ไม่ถูกต้อง";
        response.error = "password not match";
        return response;
      }

      const redirectTo = await HydraService.acceptLoginChallenge(user, loginChallenge);
      response.redirectTo = redirectTo;
      return response;
    } catch (error) {
      log.error('LoginHandler.handleSubmitLogin', error);
      throw error;
    }
  }

}
