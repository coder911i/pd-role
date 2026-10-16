export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }
  return res.status(200).json({
    ok: true,
    service: 'gcc-intel-api',
    aiConfigured: Boolean(process.env.GROQ_API_KEY),
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    sessionConfigured: Boolean(process.env.SESSION_SECRET),
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    timestamp: new Date().toISOString()
  })
}