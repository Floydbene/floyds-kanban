import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';
import * as relations from './relations.js';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(import.meta.dirname, '../../../../.env') });

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, { max: 10 });

export const db = drizzle(client, {
  schema: { ...schema, ...relations },
});

export type Database = typeof db;
