const companies = [
  { id: 'microsoft', name: 'Microsoft', sector: 'Technology', city: 'Hyderabad', signal: 'AI & cloud engineering', size: 'Large', source: 'https://news.microsoft.com/' },
  { id: 'google', name: 'Google', sector: 'Technology', city: 'Bengaluru', signal: 'Product & AI research', size: 'Large', source: 'https://blog.google/intl/en-in/' },
  { id: 'amazon', name: 'Amazon', sector: 'Technology', city: 'Hyderabad', signal: 'Cloud & operations', size: 'Large', source: 'https://www.aboutamazon.in/news' },
  { id: 'jpmorgan', name: 'JPMorgan Chase', sector: 'Financial services', city: 'Mumbai', signal: 'Global technology & risk', size: 'Large', source: 'https://www.jpmorganchase.com/newsroom' },
  { id: 'walmart', name: 'Walmart Global Tech', sector: 'Retail technology', city: 'Bengaluru', signal: 'Supply chain & commerce', size: 'Large', source: 'https://tech.walmart.com/' },
  { id: 'goldman', name: 'Goldman Sachs', sector: 'Financial services', city: 'Bengaluru', signal: 'Engineering & analytics', size: 'Large', source: 'https://www.goldmansachs.com/our-firm/locations' },
  { id: 'bosch', name: 'Bosch', sector: 'Engineering', city: 'Bengaluru', signal: 'Mobility & R&D', size: 'Large', source: 'https://www.bosch.in/' },
  { id: 'siemens', name: 'Siemens', sector: 'Engineering', city: 'Pune', signal: 'Digital industries', size: 'Large', source: 'https://www.siemens.com/in/en.html' },
  { id: 'adobe', name: 'Adobe', sector: 'Technology', city: 'Noida', signal: 'Product engineering', size: 'Large', source: 'https://blog.adobe.com/en/publish' },
  { id: 'amex', name: 'American Express', sector: 'Financial services', city: 'Gurugram', signal: 'Payments & data', size: 'Large', source: 'https://www.americanexpress.com/en-us/newsroom/' },
  { id: 'target', name: 'Target', sector: 'Retail technology', city: 'Bengaluru', signal: 'Digital commerce', size: 'Large', source: 'https://corporate.target.com/press' },
  { id: 'ericsson', name: 'Ericsson', sector: 'Telecommunications', city: 'Noida', signal: 'Networks & software', size: 'Large', source: 'https://www.ericsson.com/en/press-releases' },
  { id: 'nvidia', name: 'NVIDIA', sector: 'Technology', city: 'Pune', signal: 'AI ecosystem', size: 'Growing', source: 'https://nvidianews.nvidia.com/' },
  { id: 'wells-fargo', name: 'Wells Fargo', sector: 'Financial services', city: 'Hyderabad', signal: 'Enterprise technology', size: 'Large', source: 'https://newsroom.wf.com/' },
  { id: 'airbus', name: 'Airbus', sector: 'Engineering', city: 'Bengaluru', signal: 'Aerospace engineering', size: 'Growing', source: 'https://www.airbus.com/en/newsroom' },
  { id: 'uber', name: 'Uber', sector: 'Technology', city: 'Hyderabad', signal: 'Platform engineering', size: 'Growing', source: 'https://www.uber.com/newsroom/' }
]

export default function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const q = String(req.query?.q || '').slice(0, 100).toLowerCase()
  const city = String(req.query?.city || '').slice(0, 60)
  const sector = String(req.query?.sector || '').slice(0, 80)
  const results = companies.filter(c =>
    (!q || [c.name, c.sector, c.city, c.signal].some(v => v.toLowerCase().includes(q))) &&
    (!city || city === 'All cities' || c.city === city) &&
    (!sector || sector === 'All sectors' || c.sector === sector)
  )
  return res.status(200).json({
    data: results,
    total: results.length,
    meta: { demo: true, note: 'Prototype directory; verify current footprint and activity from linked primary sources.' }
  })
}