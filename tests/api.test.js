import test from 'node:test'
import assert from 'node:assert/strict'
import directory from '../api/directory.js'
import health from '../api/health.js'
import saved from '../api/saved.js'

function response() {
  return {
    headers: {},
    statusCode: 200,
    body: null,
    setHeader(key, value) { this.headers[key] = value },
    status(code) { this.statusCode = code; return this },
    json(value) { this.body = value; return this }
  }
}

test('directory returns records and demo-data metadata', () => {
  const res = response()
  directory({ method: 'GET', query: {} }, res)
  assert.equal(res.statusCode, 200)
  assert.ok(Array.isArray(res.body.data))
  assert.equal(res.body.meta.demo, true)
  assert.equal(res.body.total, res.body.data.length)
})

test('directory filters by city and rejects unsupported methods', () => {
  const filtered = response()
  directory({ method: 'GET', query: { city: 'Hyderabad' } }, filtered)
  assert.ok(filtered.body.data.length > 0)
  assert.ok(filtered.body.data.every(company => company.city === 'Hyderabad'))

  const rejected = response()
  directory({ method: 'POST', query: {} }, rejected)
  assert.equal(rejected.statusCode, 405)
  assert.equal(rejected.headers.Allow, 'GET')
})

test('health endpoint reports readiness without exposing secrets', () => {
  const res = response()
  health({ method: 'GET' }, res)
  assert.equal(res.statusCode, 200)
  assert.equal(res.body.ok, true)
  assert.equal(typeof res.body.aiConfigured, 'boolean')
  assert.equal('apiKey' in res.body, false)
})

test('saved API requires a valid session before database access', async () => {
  const res = response()
  await saved({ method: 'GET', headers: {} }, res)
  assert.equal(res.statusCode, 401)
})
