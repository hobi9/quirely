import type { Logger } from 'drizzle-orm/logger';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { logger } from '../lib/logger';
import * as schema from './schema';

class DrizzleLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    logger.info(`Query: ${query} \n Params: ${params}`);
  }
}

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient, { schema, logger: new DrizzleLogger() });
