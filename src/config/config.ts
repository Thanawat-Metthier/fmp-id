import * as dotenv from 'dotenv';

dotenv.config();

interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;

  frontendCallbackUrl: string;
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };
  db: {
    core: {
      writerName: string;
      readerName: string;
      writerUser: string;
      writerPass: string;
      readerUser: string;
      readerPass: string;
      writerHost: string;
      writerPort: number;
      readerHost: string;
      readerPort: number;
      maxConnections: number;
    };
  };
  hydra: {
    adminUrl: string;
    publicUrl: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    rememberFor: number;
  };
}

function getOptionalEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

function getEnvAsNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    return defaultValue;
  }
  return parsed;
}

export const config: AppConfig = {
  port: getEnvAsNumber('PORT', 3000),
  nodeEnv: (getOptionalEnv('NODE_ENV', 'development') as AppConfig['nodeEnv']) || 'development',

  frontendCallbackUrl: getOptionalEnv('FRONTEND_CALLBACK_URL', 'http://localhost:5173/callback'),
  redis: {
    host: getOptionalEnv('REDIS_HOST', 'localhost'),
    port: getEnvAsNumber('REDIS_PORT', 6379),
    password: getOptionalEnv('REDIS_PASSWORD') || undefined,
    db: getEnvAsNumber('REDIS_DB', 0),
  },
  get isProduction() {
    return this.nodeEnv === 'production';
  },
  get isDevelopment() {
    return this.nodeEnv === 'development';
  },
  get isTest() {
    return this.nodeEnv === 'test';
  },
  db: {
    core: {
      writerName: getOptionalEnv('CORE_DB_WRITER_NAME', 'fmp_id'),
      readerName: getOptionalEnv('CORE_DB_READER_NAME', 'fmp_id'),
      writerUser: getOptionalEnv('CORE_DB_WRITER_USER', 'postgres'),
      writerPass: getOptionalEnv('CORE_DB_WRITER_PASSWORD', 'postgres'),
      readerUser: getOptionalEnv('CORE_DB_READER_USER', 'postgres'),
      readerPass: getOptionalEnv('CORE_DB_READER_PASSWORD', 'postgres'),
      writerHost: getOptionalEnv('CORE_DB_WRITER_HOST', 'localhost'),
      writerPort: getEnvAsNumber('CORE_DB_WRITER_PORT', 5432),
      readerHost: getOptionalEnv('CORE_DB_READER_HOST', 'localhost'),
      readerPort: getEnvAsNumber('CORE_DB_READER_PORT', 5432),
      maxConnections: getEnvAsNumber('CORE_DB_MAX_CONNECTIONS', 20),
    },
  },
  hydra: {
    adminUrl: getOptionalEnv('HYDRA_ADMIN_URL', 'http://localhost:4445'),
    publicUrl: getOptionalEnv('HYDRA_PUBLIC_URL', 'http://localhost:4444'),
    clientId: getOptionalEnv('HYDRA_CLIENT_ID', ''),
    clientSecret: getOptionalEnv('HYDRA_CLIENT_SECRET', ''),
    redirectUri: getOptionalEnv('HYDRA_REDIRECT_URI', 'http://localhost:3000/callback'),
    rememberFor: getEnvAsNumber('HYDRA_REMEMBER_FOR', 3600),
  },
};

export default config;
