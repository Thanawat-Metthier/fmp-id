import { log } from '@/libs/logger.lib';
import { LoginRouteService } from '@/modules/login-routes/login-routes.service';

import { CiObject } from '@/db/schema/core';
import { HydraService } from '@/modules/hydra/hydra.service';
import { LoginService } from '@/modules/login/login.service';
import { UserService } from '@/modules/users/users.service';
import { Cookie } from 'elysia';
import { LoginBody } from './login.model';
import { LoginCookieUtils } from './login.utils';

// ─── LoginHandler ────────────────────────────────────────────────────────────────

export abstract class LoginHandler {

  static async handleRootLogin(cookie: Record<string, Cookie<unknown>>) {
    try {

      LoginCookieUtils.remove(cookie);

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

      const hydraLoginUrl = await HydraService.getHydraLoginUrl(workspace);

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

      const hydraLoginUrl = await HydraService.getHydraLoginUrl(workspace);

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

  static async handleSubmitLogin(body: LoginBody, cookie: Record<string, Cookie<unknown>>): Promise<boolean> {
    try {

      const { workspace, customer } = LoginCookieUtils.get(cookie);
      const { username, password } = body;

      console.log('handleSubmitLogin')
      console.log('workspace', workspace)
      console.log('customer', customer)
      console.log('username', username)
      console.log('password', password)

      // 1. ค้นหา User จาก username และ workspace/customer โดยไม่ต้องใช้ password ในฟิลเตอร์
      const user = await UserService.findOne({ 
        workspace: workspace || null, 
        customer: customer || null, 
        username, 
        isActive: true 
      });

      console.log('user found:', user ? 'yes' : 'no')

      if (!user || !user.password) {
        return false;
      }

      // 2. ตรวจสอบรหัสผ่านด้วย bcrypt (Bun มี built-in bcrypt verification)
      const isMatch = await Bun.password.verify(password, user.password);
      
      console.log('password match:', isMatch)

      return isMatch;
    } catch (error) {
      log.error('LoginHandler.handleSubmitLogin', error);
      throw error;
    }
  }

}
