export * from './connection';

import { PgTx } from '../types/database';
import { db_reader, db_writer } from './connection';

export async function getDb(type: 'query' | 'mutation', tx?: PgTx) {
  if (tx) {
    return tx;
  }
  if (type === 'mutation') {
    return db_writer;
  }

  // Without replication lag Redis checks for now
  return db_reader;
}

export async function withTransaction<T>(callback: (tx: PgTx) => Promise<T>): Promise<T> {
  return await db_writer.transaction(async (tx) => {
    return await callback(tx as PgTx);
  });
}
