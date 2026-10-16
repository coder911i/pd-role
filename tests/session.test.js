import test from 'node:test'
import assert from 'node:assert/strict'
import { readSession, setSession } from '../api/lib/session.js'

test('session cookie is signed and can be verified', () => {
  process.env.SESSION_SECRET = 'test-secret-that-is-long-enough'
  const headers = {}
  const res = { setHeader: (key, value) => { headers[key] = value } }
  const id = setSession(res, 'session-test-id')
  assert.equal(id, 'session-test-id')
  const cookie = headers['Set-Cookie'].split(';')[0]
  const req = { headers: { cookie } }
  assert.equal(readSession(req), 'session-test-id')
})

test('session cookie rejects a forged signature', () => {
  process.env.SESSION_SECRET = 'test-secret-that-is-long-enough'
  assert.equal(readSession({ headers: { cookie: 'gcc_session=attacker.forged' } }), null)
})

test('session cookie rejects a missing cookie', () => {
  assert.equal(readSession({ headers: {} }), null)
})
