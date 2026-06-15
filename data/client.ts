import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_aVw18bKnZrdC@ep-snowy-leaf-atbdgkfj.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require'
const sql = neon(databaseUrl)
export const db = drizzle(sql, { schema })
export type DB = typeof db
