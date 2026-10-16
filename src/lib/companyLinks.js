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
