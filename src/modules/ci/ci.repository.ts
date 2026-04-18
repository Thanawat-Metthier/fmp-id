import { getDb } from '@/db';
import { Ci, ci } from '@/db/schema/core';
import { log } from '@/libs/logger.lib';
import { PgTx } from '@/types/database';
import { and, desc, eq, getTableName, inArray, isNull, SQL } from 'drizzle-orm';
import { FindCiParams } from './ci.model';

export abstract class CiRepository {
  private static readonly TABLE_KEY = getTableName(ci);

  private static async getQueryDb(tx?: PgTx) {
    return await getDb('query', tx);
  }

  private static buildWhereClause(params: FindCiParams): SQL<unknown> | undefined {
    const filters: SQL<unknown>[] = [isNull(ci.deletedAt)];

    if (params?.id !== undefined) {
      filters.push(eq(ci.id, params.id as number));
    }
    if (params?.ids && params.ids.length > 0) {
      filters.push(inArray(ci.id, params.ids));
    }
    if (params?.workspace) {
      filters.push(eq(ci.workspace, params.workspace));
    }
    if (params?.customer !== undefined) {
      if (params.customer === null) {
        filters.push(isNull(ci.customer));
      } else {
        filters.push(eq(ci.customer, params.customer));
      }
    }
    return filters.length > 0 ? and(...filters) : undefined;
  }

  /**
   * find all ci
   */
  static async findAll(params: FindCiParams, tx?: PgTx): Promise<Ci[]> {
    try {
      const db = await this.getQueryDb(tx);
      const whereClause = this.buildWhereClause(params);

      const result = await db
        .select()
        .from(ci)
        .where(whereClause)
        .orderBy(desc(ci.createdAt));

      return result
    } catch (error) {
      log.error('CiRepository.findAll', error);
      throw error;
    }
  }

  /**
   * find one ci
   */
  static async findOne(params: FindCiParams, tx?: PgTx): Promise<Ci | undefined> {
    try {
      const db = await this.getQueryDb(tx);
      const whereClause = this.buildWhereClause(params);

      const [result] = await db
        .select()
        .from(ci)
        .where(whereClause)
        .limit(1);

      return result
    } catch (error) {
      log.error('CiRepository.findOne', error);
      throw error;
    }
  }

}
