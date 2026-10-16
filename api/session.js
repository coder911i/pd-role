import { readSession, setSession, clearSession } from './lib/session.js'

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method === 'GET') {
    try {
      const existing = readSession(req)
      const id = existing || setSession(res)
      return res.status(200).json({ ok: true, sessionReady: true, existing: Boolean(existing), sessionId: id })
    } catch {
      return res.status(503).json({ error: 'Session signing is not configured. Set SESSION_SECRET in the server environment.' })
    }
  }
  if (req.method === 'DELETE') {
    clearSession(res)
    return res.status(200).json({ ok: true })
  }
  res.setHeader('Allow', 'GET, DELETE')
  return res.status(405).json({ error: 'Method not allowed' })
}
