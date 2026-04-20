import { getDb } from '@/db';
import { users } from '@/db/schema/core';
import { log } from '@/libs/logger.lib';
import { PgTx } from '@/types/database';
import { and, desc, eq, getTableName, inArray, isNull, SQL } from 'drizzle-orm';
import { FindUserParams, User } from './users.model';

export abstract class UserRepository {
  private static readonly TABLE_KEY = getTableName(users);

  private static async getQueryDb(tx?: PgTx) {
    return await getDb('query', tx);
  }

  private static buildWhereClause(params: FindUserParams): SQL<unknown> | undefined {
    const filters: SQL<unknown>[] = [];

    if (params?.id !== undefined) {
      filters.push(eq(users.id, params.id as number));
    }
    if (params?.ids && params.ids.length > 0) {
      filters.push(inArray(users.id, params.ids));
    }
    if (params?.workspace) {
      filters.push(eq(users.workspace, params.workspace));
    }
    if (params?.customer !== undefined) {
      if (params.customer === null) {
        filters.push(isNull(users.customer));
      } else {
        filters.push(eq(users.customer, params.customer));
      }
    }

    if (params?.username) {
      filters.push(eq(users.username, params.username));
    }

    if (params?.userType) {
      filters.push(eq(users.userType, params.userType));
    }

    if (params?.isActive !== undefined && params?.isActive !== null) {
      filters.push(eq(users.isActive, params.isActive));
    }

    return filters.length > 0 ? and(...filters) : undefined;
  }

  /**
   * find all users
   */
  static async findAll(params: FindUserParams, tx?: PgTx): Promise<User[]> {
    try {
      const db = await this.getQueryDb(tx);
      const whereClause = this.buildWhereClause(params);

      const result = await db
        .select()
        .from(users)
        .where(whereClause)
        .orderBy(desc(users.createdAt));

      return result as User[];
    } catch (error) {
      log.error('UserRepository.findAll', error);
      throw error;
    }
  }

  /**
   * find one user
   */
  static async findOne(params: FindUserParams, tx?: PgTx): Promise<User | undefined> {
    try {
      const db = await this.getQueryDb(tx);
      const whereClause = this.buildWhereClause(params);

      console.log('UserRepository.findOne', whereClause);

      const [result] = await db
        .select()
        .from(users)
        .where(whereClause)
        .limit(1);

      return result as User | undefined;
    } catch (error) {
      log.error('UserRepository.findOne', error);
      throw error;
    }
  }
}
