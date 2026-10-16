const GDELT_URL = 'https://api.gdeltproject.org/api/v2/doc/doc'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900')
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const query = '("global capability center" OR "global capability centre" OR "India GCC" OR "GCC India" OR "global in-house center" OR "global in-house centre")'
  const url = new URL(GDELT_URL)
  url.searchParams.set('query', query)
  url.searchParams.set('mode', 'artlist')
  url.searchParams.set('format', 'json')
  url.searchParams.set('maxrecords', '30')
  url.searchParams.set('timespan', '7d')
  url.searchParams.set('sort', 'datedesc')

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'GCC-Intel/1.0 (live public-news research)' },
      signal: AbortSignal.timeout(12000)
    })
    if (!response.ok) throw new Error('News provider returned HTTP ' + response.status)
    const payload = await response.json()
    const articles = Array.isArray(payload.articles) ? payload.articles : []
    const data = articles
      .filter(item => item.title && item.url)
      .map((item, index) => ({
        id: item.url,
        title: String(item.title).slice(0, 300),
        url: item.url,
        domain: item.domain || new URL(item.url).hostname.replace(/^www\./, ''),
        publishedAt: item.seendate || null,
        sourceCountry: item.sourcecountry || null,
        language: item.language || null,
        rank: index + 1
      }))

    return res.status(200).json({
      data,
      total: data.length,
      meta: {
        provider: 'GDELT DOC 2.0',
        live: true,
        query,
        timespan: '7d',
        fetchedAt: new Date().toISOString(),
        note: 'Live news coverage, not a census of all GCCs or a verified company footprint database.'
      }
    })
  } catch (error) {
    return res.status(502).json({
      error: 'Live news feed is temporarily unavailable',
      detail: process.env.NODE_ENV === 'development' ? String(error.message || error) : undefined,
      meta: { provider: 'GDELT DOC 2.0', live: false, fetchedAt: new Date().toISOString() }
    })
  }
}
