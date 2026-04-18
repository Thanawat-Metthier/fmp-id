import { Ci } from '@/db/schema/core/ci';
import { log } from '@/libs/logger.lib';
import { PgTx } from '@/types/database';
import { FindCiParams } from './ci.model';
import { CiRepository } from './ci.repository';

export abstract class CiService {
  /**
   * find all ci
   */
  static async findAll(params: FindCiParams, tx?: PgTx): Promise<Ci[]> {
    try {
      return await CiRepository.findAll(params, tx);
    } catch (error) {
      log.error('CiService.findAll', error);
      throw error;
    }
  }

  /**
   * find one ci
   */
  static async findOne(params: FindCiParams, tx?: PgTx): Promise<Ci | undefined> {
    try {
      return await CiRepository.findOne(params, tx);
    } catch (error) {
      log.error('CiService.findOne', error);
      throw error;
    }
  }
}
