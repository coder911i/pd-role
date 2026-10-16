import { getSql, ensureSchema } from './lib/db.js'
import { readSession } from './lib/session.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST, DELETE')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const sessionId = readSession(req)
  if (!sessionId) return res.status(401).json({ error: 'Session missing. Call GET /api/session first.' })
  const sql = getSql()
  if (!sql) return res.status(503).json({ error: 'Persistence is not configured. Add DATABASE_URL in Vercel.' })
  try {
    await ensureSchema(sql)
    if (req.method === 'GET') {
      const rows = await sql`SELECT company_id AS id, company_name AS name, company_city AS city, company_sector AS sector, created_at FROM saved_companies WHERE session_id = ${sessionId} ORDER BY created_at DESC`
      return res.status(200).json({ data: rows, total: rows.length })
    }
    const body = req.body || {}
    const id = typeof body.id === 'string' ? body.id.trim().slice(0, 100) : ''
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 160) : ''
    if (!id || !name) return res.status(400).json({ error: 'Company id and name are required.' })
    if (req.method === 'POST') {
      const city = typeof body.city === 'string' ? body.city.trim().slice(0, 100) : ''
      const sector = typeof body.sector === 'string' ? body.sector.trim().slice(0, 100) : ''
      const rows = await sql`INSERT INTO saved_companies (session_id, company_id, company_name, company_city, company_sector) VALUES (${sessionId}, ${id}, ${name}, ${city}, ${sector}) ON CONFLICT (session_id, company_id) DO UPDATE SET company_name = EXCLUDED.company_name, company_city = EXCLUDED.company_city, company_sector = EXCLUDED.company_sector RETURNING company_id AS id, company_name AS name, company_city AS city, company_sector AS sector, created_at`
      return res.status(200).json({ data: rows[0] })
    }
    const rows = await sql`DELETE FROM saved_companies WHERE session_id = ${sessionId} AND company_id = ${id} RETURNING company_id AS id`
    return res.status(200).json({ ok: true, removed: rows.length > 0 })
  } catch (error) {
    console.error('Saved companies API error:', error?.message || 'unknown')
    return res.status(500).json({ error: 'Could not access saved companies right now.' })
  }
}
