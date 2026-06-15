import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '@/data/schema'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const rawUrl = process.env.DATABASE_URL || ''
  let redactedUrl = rawUrl
  try {
    const parsed = new URL(rawUrl)
    if (parsed.password) {
      parsed.password = '****'
    }
    redactedUrl = parsed.toString()
  } catch (e) {
    redactedUrl = rawUrl ? 'parse error' : 'not set'
  }

  const results: any = {
    databaseUrl: redactedUrl,
    envKeys: Object.keys(process.env).filter(k => k.includes('DB') || k.includes('DATABASE') || k.includes('NEON')),
  }

  try {
    if (!rawUrl) {
      throw new Error('DATABASE_URL environment variable is empty or not defined.')
    }
    const client = neon(rawUrl)
    const db = drizzle(client, { schema })
    
    // 1. Try simple query
    const start = Date.now()
    const select1 = await db.execute(sql`SELECT 1 as val`)
    results.select1 = {
      success: true,
      timeMs: Date.now() - start,
      data: select1
    }

    // 2. Query tables list
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    results.tables = tables

  } catch (err: any) {
    results.error = {
      message: err.message,
      stack: err.stack,
    }
  }

  return NextResponse.json(results)
}
