import { drizzle } from 'drizzle-orm/postgres-js';
import { Logger } from 'drizzle-orm/logger';
import postgres from 'postgres';
import * as schema from './schema';
import { logger } from '../lib/logger';

class DrizzleLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    logger.info(`DRIZZLEQuery: ${query} \n Params: ${params}`);
  }
}

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient, { schema, logger: new DrizzleLogger() });
