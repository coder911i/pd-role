import { neon } from '@neondatabase/serverless'

let sqlClient
export function getSql() {
  if (!process.env.DATABASE_URL) return null
  if (!sqlClient) sqlClient = neon(process.env.DATABASE_URL)
  return sqlClient
}

export async function ensureSchema(sql) {
  await sql`CREATE TABLE IF NOT EXISTS saved_companies (
    session_id TEXT NOT NULL,
    company_id TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_city TEXT NOT NULL DEFAULT '',
    company_sector TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (session_id, company_id)
  )`
  await sql`CREATE TABLE IF NOT EXISTS research_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    body TEXT NOT NULL,
    model TEXT NOT NULL DEFAULT 'demo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`
}
