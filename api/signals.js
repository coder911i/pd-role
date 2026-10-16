const GDELT_URL = 'https://api.gdeltproject.org/api/v2/doc/doc'

const SEARCHES = [
  '("global capability center" OR "global capability centre" OR "India GCC" OR "GCC India" OR "global in-house center" OR "global in-house centre")',
  '("global capability centre" OR "global capability center") India'
]

function decodeXml(value = '') {
  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

async function fetchGdelt(query) {
  const url = new URL(GDELT_URL)
  url.searchParams.set('query', query)
  url.searchParams.set('mode', 'artlist')
  url.searchParams.set('format', 'json')
  url.searchParams.set('maxrecords', '30')
  url.searchParams.set('timespan', '7d')
  url.searchParams.set('sort', 'datedesc')
  const response = await fetch(url, {
    headers: { 'User-Agent': 'GCC-Intel/1.2 (live public-news research)' },
    signal: AbortSignal.timeout(9000)
  })
  if (!response.ok) throw new Error('GDELT HTTP ' + response.status)
  const payload = await response.json()
  return (Array.isArray(payload.articles) ? payload.articles : [])
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
}

async function fetchGoogleNewsRss(query) {
  const url = new URL('https://news.google.com/rss/search')
  url.searchParams.set('q', query)
  url.searchParams.set('hl', 'en-IN')
  url.searchParams.set('gl', 'IN')
  url.searchParams.set('ceid', 'IN:en')
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GCC-Intel/1.2)' },
    signal: AbortSignal.timeout(9000)
  })
  if (!response.ok) throw new Error('Google News RSS HTTP ' + response.status)
  const xml = await response.text()
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(match => {
    const block = match[1]
    const read = tag => decodeXml(block.match(new RegExp('<' + tag + '(?:\\s[^>]*)?>([\\s\\S]*?)<\\/' + tag + '>', 'i'))?.[1] || '')
    const title = read('title').trim()
    const link = read('link').trim()
    const publishedAt = read('pubDate') || null
    const source = read('source')
    if (!title || !link) return null
    let domain = ''
    try { domain = source || new URL(link).hostname.replace(/^www\./, '') } catch { domain = source || 'Google News' }
    return { id: link, title: title.slice(0, 300), url: link, domain, publishedAt, rank: 0 }
  }).filter(Boolean)
  return items
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300')
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Query both live public-news sources; use RSS if GDELT is empty or unreachable.
  const gdeltJobs = Promise.all(SEARCHES.map(fetchGdelt))
    .then(groups => groups.flat())
    .then(items => [...new Map(items.map(item => [item.url, item])).values()])
  const rssJobs = Promise.all([
    fetchGoogleNewsRss('"global capability center" India'),
    fetchGoogleNewsRss('"global capability centre" India GCC')
  ]).then(groups => groups.flat())
    .then(items => [...new Map(items.map(item => [item.url, item])).values()])

  try {
    const data = await Promise.any([
      gdeltJobs.then(items => {
        if (!items.length) throw new Error('GDELT returned no articles')
        return { data: items, provider: 'GDELT DOC 2.0' }
      }),
      rssJobs.then(items => {
        if (!items.length) throw new Error('Google News RSS returned no articles')
        return { data: items, provider: 'Google News RSS' }
      })
    ])
    return res.status(200).json({
      data: data.data.slice(0, 30),
      total: data.data.length,
      meta: {
        provider: data.provider,
        live: true,
        timespan: '7d',
        fetchedAt: new Date().toISOString(),
        note: 'Live public-news coverage, not a verified census of GCCs, hiring totals, or company footprint data.'
      }
    })
  } catch {
    return res.status(502).json({
      error: 'Live news providers are temporarily unreachable',
      meta: { provider: 'GDELT + Google News RSS', live: false, fetchedAt: new Date().toISOString() }
    })
  }
}
