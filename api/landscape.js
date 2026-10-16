const SOURCE_URL = 'https://www.prnewswire.com/in/news-releases/india-s-gccs-are-increasingly-leading-the-ai-mandate-for-global-enterprises-driving-global-value-creation-nasscom--zinnov-report-302817463.html'
const CITY_SOURCE_URL = 'https://zinnov.com/centers-of-excellence/5-reasons-why-bengaluru-is-top-choice-for-your-next-gcc-setup-blog/'

export default function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  return res.status(200).json({
    dataType: 'published-industry-estimates',
    metrics: [
      { label: 'GCCs in India', value: '2,117', detail: 'FY26 estimate', numericValue: 2117 },
      { label: 'GCC units', value: '3,728', detail: 'Across India', numericValue: 3728 },
      { label: 'Professionals', value: '2.36M', detail: 'Installed talent', numericValue: 2360000 },
      { label: 'Market revenue', value: '$98.4B', detail: 'FY26 estimate', numericValue: 98.4 }
    ],
    capabilityMetrics: [
      { label: 'GCCs with AI/ML capabilities', value: '1,200+' },
      { label: 'Dedicated Centres of Excellence', value: '250+' },
      { label: 'AI professionals', value: '250,000+' }
    ],
    cityUnits: [
      { city: 'Bengaluru', units: 320, label: 'Global 2000 GCC units' },
      { city: 'Hyderabad', units: 165, label: 'Global 2000 GCC units' },
      { city: 'NCR', units: 165, label: 'Global 2000 GCC units' },
      { city: 'Mumbai', units: 165, label: 'Global 2000 GCC units' },
      { city: 'Pune', units: 150, label: 'Global 2000 GCC units' },
      { city: 'Chennai', units: 130, label: 'Global 2000 GCC units' }
    ],
    sourceLabel: 'NASSCOM–Zinnov · India GCC Landscape Report 2026',
    sourceUrl: SOURCE_URL,
    citySourceUrl: CITY_SOURCE_URL,
    publishedAt: 'Published 3 Jul 2026',
    methodology: 'Published industry estimates, not a live counter. City-unit figures are the Global 2000 GCC-unit subset, not all GCCs in each city.',
    updatedAt: '2026-07-03T11:27:00+05:30'
  })
}
