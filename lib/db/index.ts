import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// For development, use a simple mock database if no connection string
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/mock';

let client: postgres.Sql;
let db: ReturnType<typeof drizzle>;

try {
  // Disable prefetch as it is not supported for "Transaction" pool mode
  client = postgres(connectionString, { prepare: false });
  db = drizzle(client, { schema });
} catch (error) {
  console.warn('Database connection failed, using mock client');
  // Create a mock client for development
  client = {} as postgres.Sql;
  db = {} as ReturnType<typeof drizzle>;
}

export { db };
export * from './schema';
