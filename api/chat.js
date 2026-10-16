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

  let liveContext = 'No current news articles were retrieved. Do not invent current market facts.'
  try {
    const newsUrl = new URL('https://api.gdeltproject.org/api/v2/doc/doc')
    newsUrl.searchParams.set('query', '("global capability center" OR "global capability centre" OR "India GCC" OR "GCC India" OR "global in-house center" OR "global in-house centre")')
    newsUrl.searchParams.set('mode', 'artlist')
    newsUrl.searchParams.set('format', 'json')
    newsUrl.searchParams.set('maxrecords', '8')
    newsUrl.searchParams.set('timespan', '7d')
    newsUrl.searchParams.set('sort', 'datedesc')
    const newsResponse = await fetch(newsUrl, { signal: AbortSignal.timeout(8000) })
    if (newsResponse.ok) {
      const newsPayload = await newsResponse.json()
      const articles = Array.isArray(newsPayload.articles) ? newsPayload.articles : []
      if (articles.length) {
        liveContext = articles.slice(0, 8).map((article, index) =>
          `${index + 1}. ${String(article.title || 'Untitled').slice(0, 240)} | publisher: ${article.domain || 'unknown'} | date: ${article.seendate || 'unknown'} | URL: ${article.url || 'unavailable'}`
        ).join('\\n')
      }
    }
  } catch {
    // The analyst can still answer general questions, but must not invent current facts.
  }

  const systemPrompt = `You are GCC Intel, an expert research analyst and strategy consultant focused on Global Capability Centres (GCCs) in India. Turn every answer into a polished, informative, decision-ready mini-report rather than a shallow chatbot reply.\n\nWRITING AND ANALYSIS RULES:\n- Start with a direct answer or executive takeaway, then explain the reasoning in clear sections.\n- Give substantive detail: define important terms, explain why findings matter, compare trade-offs, and include practical implications or next steps when relevant.\n- For comparisons, use a readable table where it helps, assess each dimension consistently, and finish with a conditional recommendation tied to the user's priorities.\n- For research questions, distinguish confirmed facts, reported claims, estimates, and unknowns. Cite available source URLs in plain text beside the claims they support.\n- Use current news evidence below when relevant, but do not treat news mentions as a census, hiring total, salary benchmark, or growth rate. A reference company list is not a verified census of current GCC footprints.\n- If evidence is incomplete, do not stop at ‘no data available’. Explain what can reasonably be concluded, what remains uncertain, how that uncertainty affects the decision, and which specific primary sources or measurements would resolve it.\n- Never invent statistics, dates, sources, citations, company facts, salaries, policy incentives, or market claims. Do not imply you searched sources that were not actually retrieved.\n- Keep the answer detailed but relevant: use headings, concise paragraphs, bullets, and tables as appropriate. Avoid repetition and generic filler. End with key takeaways or concrete next steps when useful.\n- Match the user's language when clear; otherwise use professional, plain English.\n\nThe dashboard's city talent, cost, and momentum scores have been removed because no trustworthy live source is connected for those metrics. Be transparent about this limitation while still giving the most useful analysis supported by the available evidence.\n\nCURRENT NEWS EVIDENCE (GDELT DOC 2.0, last 7 days):\n${liveContext}`

  try {
    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.35,
        max_tokens: 1400
      }),
      signal: AbortSignal.timeout(25000)
    })

    const payload = await upstream.json().catch(() => ({}))
    if (!upstream.ok) {
      const providerMessage = typeof payload.error?.message === 'string' ? payload.error.message.slice(0, 240) : 'No provider error details returned.'
      console.error('Groq request failed:', upstream.status, providerMessage)
      const hint = upstream.status === 401 ? 'Check that GROQ_API_KEY is valid and current.' : upstream.status === 403 ? 'The key or account may not have access to this model.' : upstream.status === 404 ? 'Check the GROQ_MODEL name.' : upstream.status === 429 ? 'Groq rate limit or quota reached; check your Groq console.' : 'Check the Groq key, model, and provider status.'
      return res.status(502).json({ error: `Groq returned HTTP ${upstream.status}. ${hint} Provider detail: ${providerMessage}` })
    }

    const answer = payload.choices?.[0]?.message?.content?.trim()
    if (!answer) return res.status(502).json({ error: 'The AI provider returned an empty response. Please try again.' })
    return res.status(200).json({ answer, model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b' })
  } catch (error) {
    console.error('GCC Intel chat error:', error?.name || 'UnknownError')
    return res.status(504).json({ error: 'The AI request timed out or could not connect. Please try again.' })
  }
}