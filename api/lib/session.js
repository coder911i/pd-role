import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

const COOKIE = 'gcc_session'
const MAX_AGE = 60 * 60 * 24 * 30

function signature(id) {
  const secret = process.env.SESSION_SECRET
  if (!secret && process.env.NODE_ENV === 'production') throw new Error('SESSION_SECRET must be configured in production')
  return createHmac('sha256', secret || 'development-only-change-me').update(id).digest('hex')
}

export function readSession(req) {
  const raw = String(req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith(COOKIE + '='))
  if (!raw) return null
  const token = decodeURIComponent(raw.slice(COOKIE.length + 1))
  const splitAt = token.lastIndexOf('.')
  if (splitAt < 1) return null
  const id = token.slice(0, splitAt)
  const supplied = token.slice(splitAt + 1)
  const expected = signature(id)
  const a = Buffer.from(supplied)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  return id
}

export function setSession(res, id = randomBytes(24).toString('hex')) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${COOKIE}=${encodeURIComponent(id + '.' + signature(id))}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`)
  return id
}

export function clearSession(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`)
}
