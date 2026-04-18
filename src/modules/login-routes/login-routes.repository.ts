import { getDb } from '@/db';
import { LoginRoute, loginRoutes } from '@/db/schema/core';
import { log } from '@/libs/logger.lib';
import { PgTx } from '@/types/database';
import { and, desc, eq, getTableName, inArray, isNull, SQL } from 'drizzle-orm';
import { FindLoginRouteParams } from './login-routes.model';

export abstract class LoginRouteRepository {
  private static readonly TABLE_KEY = getTableName(loginRoutes);

  private static async getQueryDb(tx?: PgTx) {
    return await getDb('query', tx);
  }

  private static buildWhereClause(params: FindLoginRouteParams): SQL<unknown> | undefined {
    const filters: SQL<unknown>[] = [isNull(loginRoutes.deletedAt)];

    if (params?.id !== undefined) {
      filters.push(eq(loginRoutes.id, params.id));
    }
    if (params?.ids && params.ids.length > 0) {
      filters.push(inArray(loginRoutes.id, params.ids));
    }
    if (params?.path) {
      filters.push(eq(loginRoutes.path, params.path));
    }
    if (params?.workspace) {
      filters.push(eq(loginRoutes.workspace, params.workspace));
    }
    if (params?.customer) {
      filters.push(eq(loginRoutes.customer, params.customer));
    }
    if (params?.isActive !== undefined) {
      filters.push(eq(loginRoutes.isActive, params.isActive));
    }

    return filters.length > 0 ? and(...filters) : undefined;
  }

  /**
   * Find all login routes matching params
   */
  static async findAll(params: FindLoginRouteParams, tx?: PgTx): Promise<LoginRoute[]> {
    try {
      const db = await this.getQueryDb(tx);
      const whereClause = this.buildWhereClause(params);

      const result = await db
        .select()
        .from(loginRoutes)
        .where(whereClause)
        .orderBy(desc(loginRoutes.createdAt));

      return result as LoginRoute[];
    } catch (error) {
      log.error('LoginRouteRepository.findAll', error);
      throw error;
    }
  }

  /**
   * Find one login route matching params
   */
  static async findOne(params: FindLoginRouteParams, tx?: PgTx): Promise<LoginRoute | undefined> {
    try {
      const db = await this.getQueryDb(tx);
      const whereClause = this.buildWhereClause(params);

      const [result] = await db
        .select()
        .from(loginRoutes)
        .where(whereClause)
        .limit(1);

      return result as LoginRoute | undefined;
    } catch (error) {
      log.error('LoginRouteRepository.findOne', error);
      throw error;
    }
  }
}
