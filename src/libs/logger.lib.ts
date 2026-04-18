/**
 * Lightweight logger for fmp-id.
 * Uses console by default; swap to pino when @bogeychan/elysia-logger is added.
 */
export const log = {
  info: (message: string, context?: object) =>
    console.info(`[INFO] ${message}`, context ?? ''),
  warn: (message: string, context?: object) =>
    console.warn(`[WARN] ${message}`, context ?? ''),
  error: (message: string, error: unknown, context?: object) =>
    console.error(`[ERROR] ${message}`, error, context ?? ''),
  debug: (message: string, context?: object) =>
    console.debug(`[DEBUG] ${message}`, context ?? ''),
};
