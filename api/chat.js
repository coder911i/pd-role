export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Best-effort per-instance abuse guard. Use a shared store (e.g. Redis/Upstash)
  // for durable rate limiting across serverless instances.
  const now = Date.now()
  const forwarded = req.headers['x-forwarded-for']
  const ip = String(Array.isArray(forwarded) ? forwarded[0] : forwarded || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  const store = globalThis.__gccIntelRateLimit || (globalThis.__gccIntelRateLimit = new Map())
  const bucket = store.get(ip) || { count: 0, resetAt: now + 10 * 60 * 1000 }
  if (now > bucket.resetAt) { bucket.count = 0; bucket.resetAt = now + 10 * 60 * 1000 }
  bucket.count += 1
  store.set(ip, bucket)
  if (bucket.count > 20) {
    res.setHeader('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)))
    return res.status(429).json({ error: 'Too many requests. Please wait a few minutes and try again.' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'Groq is not configured. Add GROQ_API_KEY in the Vercel project environment variables.' })
  }

  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : ''
  if (!question) return res.status(400).json({ error: 'Please provide a question.' })
  if (question.length > 1500) return res.status(413).json({ error: 'Question is too long. Keep it under 1,500 characters.' })

  const systemPrompt = `You are GCC Intel, a research copilot for Global Capability Centres (GCCs) in India. Be concise, structured, and explicit about uncertainty. The app's dashboard metrics and city scores are illustrative demo values, not verified market data. Never present those placeholders as facts. When asked for current company footprints, hiring, salaries, costs, or market growth, state that current primary sources must be checked unless source material is provided in the conversation. Do not fabricate citations, numbers, or sources. Help users structure research, compare hypotheses, and produce practical shortlists. If the user asks for a decision, explain assumptions and what should be verified.`

  try {
    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.35,
        max_tokens: 700
      }),
      signal: AbortSignal.timeout(25000)
    })

    const payload = await upstream.json().catch(() => ({}))
    if (!upstream.ok) {
      console.error('Groq request failed:', upstream.status)
      return res.status(502).json({ error: 'The AI provider could not complete this request. Check the server-side Groq configuration and try again.' })
    }

    const answer = payload.choices?.[0]?.message?.content?.trim()
    if (!answer) return res.status(502).json({ error: 'The AI provider returned an empty response. Please try again.' })
    return res.status(200).json({ answer, model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile' })
  } catch (error) {
    console.error('GCC Intel chat error:', error?.name || 'UnknownError')
    return res.status(504).json({ error: 'The AI request timed out or could not connect. Please try again.' })
  }
}