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
      const rows = await sql`SELECT id, title, prompt, body, model, created_at FROM research_reports WHERE session_id = ${sessionId} ORDER BY created_at DESC LIMIT 50`
      return res.status(200).json({ data: rows, total: rows.length })
    }
    const id = typeof req.body?.id === 'string' ? req.body.id.trim() : ''
    if (req.method === 'DELETE') {
      if (!id || id.length > 80) return res.status(400).json({ error: 'A valid report id is required.' })
      const rows = await sql`DELETE FROM research_reports WHERE id = ${id}::uuid AND session_id = ${sessionId} RETURNING id`
      return res.status(200).json({ ok: true, removed: rows.length > 0 })
    }
    const title = typeof req.body?.title === 'string' ? req.body.title.trim().slice(0, 180) : ''
    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim().slice(0, 1500) : ''
    const body = typeof req.body?.body === 'string' ? req.body.body.trim().slice(0, 20000) : ''
    const model = typeof req.body?.model === 'string' ? req.body.model.trim().slice(0, 100) : 'demo'
    if (!title || !prompt || !body) return res.status(400).json({ error: 'Title, prompt, and report body are required.' })
    const rows = await sql`INSERT INTO research_reports (session_id, title, prompt, body, model) VALUES (${sessionId}, ${title}, ${prompt}, ${body}, ${model}) RETURNING id, title, prompt, body, model, created_at`
    return res.status(201).json({ data: rows[0] })
  } catch (error) {
    console.error('Reports API error:', error?.message || 'unknown')
    return res.status(500).json({ error: 'Could not access research reports right now.' })
  }
}
