import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './src/db/schema/core/*.ts',
  out: './drizzle/core',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.CORE_DB_WRITER_HOST ?? 'localhost',
    port: Number(process.env.CORE_DB_WRITER_PORT ?? 5432),
    database: process.env.CORE_DB_WRITER_NAME ?? 'fmp_id',
    user: process.env.CORE_DB_WRITER_USER ?? 'postgres',
    password: process.env.CORE_DB_WRITER_PASSWORD ?? 'postgres',
    ssl: false,
  },
});
