import { log } from '@/libs/logger.lib';
import { PgTx } from '@/types/database';
import { LoginRouteRepository } from './login-routes.repository';
import { FindLoginRouteParams } from './login-routes.model';

export abstract class LoginRouteService {
  /**
   * find all login routes
   */
  static async findAll(params: FindLoginRouteParams, tx?: PgTx) {
    try {
      return await LoginRouteRepository.findAll(params, tx);
    } catch (error) {
      log.error('LoginRouteService.findAll', error);
      throw error;
    }
  }

  /**
   * find one login route
   */
  static async findOne(params: FindLoginRouteParams, tx?: PgTx) {
    try {
      return await LoginRouteRepository.findOne(params, tx);
    } catch (error) {
      log.error('LoginRouteService.findOne', error);
      throw error;
    }
  }
}
