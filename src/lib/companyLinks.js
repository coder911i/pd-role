const companyDomains = {
  Microsoft: 'microsoft.com',
  Google: 'google.com',
  Amazon: 'amazon.com',
  'JPMorgan Chase': 'jpmorganchase.com',
  'Walmart Global Tech': 'walmart.com',
  'Goldman Sachs': 'goldmansachs.com',
  Bosch: 'bosch.com',
  Siemens: 'siemens.com',
  Adobe: 'adobe.com',
  'American Express': 'americanexpress.com',
  Target: 'target.com',
  Ericsson: 'ericsson.com',
  NVIDIA: 'nvidia.com',
  'Wells Fargo': 'wellsfargo.com',
  Airbus: 'airbus.com',
  Uber: 'uber.com'
}

export function getCompanyDomain(company) {
  return companyDomains[company.name] || new URL(company.source).hostname.replace(/^www\./, '')
}

export function getCompanyLogoUrl(company) {
  const domain = getCompanyDomain(company)
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`
}

export function getCompanyArticleUrl(company, liveSignals = []) {
  const fullName = company.name.toLowerCase()
  const firstName = company.name.split(/\s/)[0].toLowerCase()
  const article = liveSignals.find(item => item.title?.toLowerCase().includes(fullName))
    || liveSignals.find(item => item.title?.toLowerCase().includes(firstName))
  return article?.url || company.source
}


const publisherDomains = {
  'ani news': 'aninews.in', 'ani': 'aninews.in', 'hrtoday.in': 'hrtoday.in',
  'the futurum group': 'futurumgroup.com', 'zinnov': 'zinnov.com',
  'india briefing': 'india-briefing.com', 'tata consultancy services': 'tcs.com',
  'tcs': 'tcs.com', 'business standard': 'business-standard.com',
  'economic times': 'economictimes.indiatimes.com', 'the economic times': 'economictimes.indiatimes.com',
  'mint': 'livemint.com', 'moneycontrol': 'moneycontrol.com', 'reuters': 'reuters.com',
  'bloomberg': 'bloomberg.com', 'yourstory': 'yourstory.com', 'the hindu': 'thehindu.com',
  'hindustan times': 'hindustantimes.com', 'times of india': 'timesofindia.indiatimes.com',
  'business today': 'businesstoday.in', 'ndtv profit': 'ndtvprofit.com', 'techcircle': 'techcircle.in'
}
export function getPublisherDomain(item) {
  const label = String(item.domain || '').trim().toLowerCase()
  if (publisherDomains[label]) return publisherDomains[label]
  if (label.includes('.')) {
    try { return new URL(label.startsWith('http') ? label : 'https://' + label).hostname.replace(/^www\./, '') } catch {}
  }
  try {
    const host = new URL(item.url).hostname.replace(/^www\./, '')
    if (!host.includes('news.google.com')) return host
  } catch {}
  return ''
}
export function getPublisherLogoUrl(item) {
  const domain = getPublisherDomain(item)
  return domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128` : ''
}
