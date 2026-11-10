import type { Request, RequestHandler } from 'express'
import { config } from '../config.js'
import { fail } from '../lib/api-response.js'
import { prisma } from '../lib/prisma.js'
import { type SessionPayload, verifySession } from '../lib/session.js'

const readToken = (req: Request): string | undefined => req.cookies?.[config.cookieName] as string | undefined

/**
 * The one place a cookie becomes a trusted identity. The JWT proves we minted it;
 * `User.tokenVersion` is the database's veto. A request with no cookie never reaches the database.
 */
const authenticate = async (req: Request): Promise<SessionPayload | null> => {
  const token = readToken(req)
  if (!token) return null

  const session = verifySession(token)
  if (!session) return null

  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { tokenVersion: true } })
  if (!user || user.tokenVersion !== session.tokenVersion) return null
  return session
}

/** Mounted globally. A database blip continues anonymous rather than failing public routes. */
export const optionalAuth: RequestHandler = async (req, _res, next) => {
  try {
    const session = await authenticate(req)
    if (session) req.session = session
  } catch (error) {
    console.error('[auth] session lookup failed', error)
  }
  next()
}

export const requireAuth: RequestHandler = async (req, res, next) => {
  const session = await authenticate(req)
  if (!session) return fail(res, 'Unauthorized', 401, 401)
  req.session = session
  next()
}

export const sessionOf = (req: Request): SessionPayload => {
  if (!req.session) throw new Error('sessionOf called outside requireAuth')
  return req.session
}
