import test from 'node:test'
import assert from 'node:assert/strict'
import { getCompanyArticleUrl, getCompanyDomain, getCompanyLogoUrl, getCompanyFallbackLogoUrl, getPublisherDomain, getPublisherLogoUrl } from '../src/lib/companyLinks.js'

const microsoft = {
  name: 'Microsoft',
  source: 'https://news.microsoft.com/'
}

test('company logo URL uses the mapped official domain', () => {
  assert.equal(getCompanyDomain(microsoft), 'microsoft.com')
  assert.equal(getCompanyLogoUrl(microsoft), 'https://cdn.simpleicons.org/microsoft')
})

test('unknown company domains fall back to the official source host', () => {
  assert.equal(getCompanyDomain({ name: 'Example Co', source: 'https://www.example.com/news' }), 'example.com')
})

test('matching live news article takes priority over the official news landing page', () => {
  const signals = [
    { title: 'New research at Microsoft', url: 'https://publisher.example/microsoft-story' },
    { title: 'Microsoft expands cloud services', url: 'https://publisher.example/cloud-story' }
  ]
  assert.equal(getCompanyArticleUrl(microsoft, signals), 'https://publisher.example/microsoft-story')
})

test('company without a matching article safely falls back to its official source', () => {
  assert.equal(getCompanyArticleUrl(microsoft, [{ title: 'Google launches a new product', url: 'https://publisher.example/google' }]), microsoft.source)
})

test('company article matching is case-insensitive and handles multi-word names', () => {
  const company = { name: 'JPMorgan Chase', source: 'https://www.jpmorganchase.com/newsroom' }
  assert.equal(getCompanyArticleUrl(company, [{ title: 'JPMORGAN CHASE announces results', url: 'https://publisher.example/jpm' }]), 'https://publisher.example/jpm')
})

test('known publishers resolve to their own brand domain', () => {
  assert.equal(getPublisherDomain({ domain: 'ANI News', url: 'https://news.google.com/rss/articles/example' }), 'aninews.in')
  assert.equal(getPublisherLogoUrl({ domain: 'ANI News', url: 'https://news.google.com/rss/articles/example' }), 'https://www.google.com/s2/favicons?domain=aninews.in&sz=128')
})

test('publisher domains that are already hostnames are normalized', () => {
  assert.equal(getPublisherDomain({ domain: 'www.hrtoday.in', url: 'https://news.google.com/rss/articles/example' }), 'hrtoday.in')
})

test('company logo fallback always uses that company domain', () => {
  assert.equal(getCompanyFallbackLogoUrl(microsoft), 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128')
})

test('unmapped brands use their own source domain rather than another company logo', () => {
  const example = { name: 'Example Co', source: 'https://www.example.com/news' }
  assert.equal(getCompanyLogoUrl(example), 'https://www.google.com/s2/favicons?domain=example.com&sz=128')
})
