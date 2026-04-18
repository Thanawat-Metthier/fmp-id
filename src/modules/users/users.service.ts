import { log } from '@/libs/logger.lib';
import { PgTx } from '@/types/database';
import { FindUserParams, User } from './users.model';
import { UserRepository } from './users.repository';

export abstract class UserService {
  /**
   * find all users
   */
  static async findAll(params: FindUserParams, tx?: PgTx): Promise<User[]> {
    try {
      return await UserRepository.findAll(params, tx);
    } catch (error) {
      log.error('UserService.findAll', error);
      throw error;
    }
  }

  /**
   * find one user
   */
  static async findOne(params: FindUserParams, tx?: PgTx): Promise<User | undefined> {
    try {
      console.log('UserService.findOne', params);
      return await UserRepository.findOne(params, tx);
    } catch (error) {
      log.error('UserService.findOne', error);
      throw error;
    }
  }
}
