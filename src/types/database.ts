import type { schema as coreSchema } from '../db/schema/core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import type { PgTransaction } from 'drizzle-orm/pg-core';

type CoreSchema = typeof coreSchema;

export type PgTx = PgTransaction<NodePgQueryResultHKT, CoreSchema, ExtractTablesWithRelations<CoreSchema>>;
