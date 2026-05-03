import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../drizzle/schema'

const globalForDb = globalThis as unknown as {
  pool?: Pool
  db?: ReturnType<typeof drizzle>
}

function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }
  return new Pool({ connectionString: process.env.DATABASE_URL })
}

export const pool = globalForDb.pool ?? getPool()
if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool
}

export const db = globalForDb.db ?? drizzle(pool, { schema })
if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db
}

export type AppDb = typeof db

export * from '../drizzle/schema'
