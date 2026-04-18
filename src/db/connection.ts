import { config } from '../config/config';
import { schema as coreSchema } from './schema/core';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const writerPool = new Pool({
  host: config.db.core.writerHost,
  port: config.db.core.writerPort,
  database: config.db.core.writerName,
  user: config.db.core.writerUser,
  password: config.db.core.writerPass,
  max: config.db.core.maxConnections,
  ssl: false,
});

const readerPool = new Pool({
  host: config.db.core.readerHost,
  port: config.db.core.readerPort,
  database: config.db.core.readerName,
  user: config.db.core.readerUser,
  password: config.db.core.readerPass,
  max: config.db.core.maxConnections,
  ssl: false,
});

export const db_writer = drizzle(writerPool, {
  schema: coreSchema,
  logger: config.isDevelopment,
});

export const db_reader = drizzle(readerPool, {
  schema: coreSchema,
  logger: config.isDevelopment,
});

export type DbWriter = typeof db_writer;
export type DbReader = typeof db_reader;
