import { hash, verify } from '@node-rs/argon2'
import { randomBytes } from 'node:crypto'

/**
 * Password hashing and policy. This module imports nothing of its own, so the parameters
 * cannot be weakened from an env file.
 *
 * Argon2id, 64 MiB / 3 passes / 4 lanes — OWASP's stronger cited configuration. The async
 * hash runs on the libuv threadpool; the auth rate limiters exist so that stays bounded.
 */
export const ARGON2_OPTIONS = {
  // Argon2id. A numeric literal: the package's `Algorithm` is a const enum, which isolatedModules cannot import.
  algorithm: 2,
  memoryCost: 65_536,
  timeCost: 3,
  parallelism: 4,
  outputLen: 32,
} as const

const ARGON2_VERSION = 19

export const hashPassword = (plain: string): Promise<string> => hash(plain, ARGON2_OPTIONS)

/** `(stored, plain)`. A malformed stored hash reads as "wrong password", never a 500. */
export const verifyPassword = async (stored: string, plain: string): Promise<boolean> => {
  try {
    return await verify(stored, plain, ARGON2_OPTIONS)
  } catch {
    return false
  }
}

type PhcParams = {
  algorithm: string
  version: number
  memoryCost: number
  timeCost: number
  parallelism: number
}

/** Parses `$argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>`. */
export const parsePasswordHash = (stored: string): PhcParams | null => {
  const parts = stored.split('$')
  if (parts.length !== 6 || parts[0] !== '') return null

  const versionField = parts[2]
  const paramField = parts[3]
  if (!versionField?.startsWith('v=') || !paramField) return null

  const params = new Map(
    paramField.split(',').map((pair) => {
      const [key, value] = pair.split('=')
      return [key, Number(value)] as const
    })
  )

  const version = Number(versionField.slice(2))
  const memoryCost = params.get('m')
  const timeCost = params.get('t')
  const parallelism = params.get('p')

  if (
    !Number.isFinite(version) ||
    !Number.isFinite(memoryCost) ||
    !Number.isFinite(timeCost) ||
    !Number.isFinite(parallelism)
  ) {
    return null
  }

  return {
    algorithm: parts[1] ?? '',
    version,
    memoryCost: memoryCost as number,
    timeCost: timeCost as number,
    parallelism: parallelism as number,
  }
}

/** True when the stored hash is weaker than what we mint today. A stronger hash is never downgraded. */
export const needsRehash = (stored: string): boolean => {
  const parsed = parsePasswordHash(stored)
  if (!parsed) return true
  return (
    parsed.algorithm !== 'argon2id' ||
    parsed.version < ARGON2_VERSION ||
    parsed.memoryCost < ARGON2_OPTIONS.memoryCost ||
    parsed.timeCost < ARGON2_OPTIONS.timeCost ||
    parsed.parallelism < ARGON2_OPTIONS.parallelism
  )
}

let dummyHash: Promise<string> | null = null

/** Burns the same time as a real check when the email has no account, so timing reveals nothing. */
export const verifyDummyPassword = async (plain: string): Promise<false> => {
  dummyHash ??= hashPassword(randomBytes(32).toString('hex'))
  try {
    await verify(await dummyHash, plain, ARGON2_OPTIONS)
  } catch {
    /* Always false; the point is the elapsed time. */
  }
  return false
}

export const PASSWORD_POLICY = { min: 8, max: 128 } as const

export type PasswordCheck = { ok: true } | { ok: false; message: string }

export const validatePassword = (plain: unknown, ctx: { email?: string } = {}): PasswordCheck => {
  if (typeof plain !== 'string' || plain.length < PASSWORD_POLICY.min) {
    return { ok: false, message: `Password must be at least ${PASSWORD_POLICY.min} characters` }
  }
  if (plain.length > PASSWORD_POLICY.max) {
    return { ok: false, message: `Password must be at most ${PASSWORD_POLICY.max} characters` }
  }
  if (!/[a-zA-Z]/.test(plain) || !/[0-9]/.test(plain)) {
    return { ok: false, message: 'Password must contain at least one letter and one number' }
  }

  const localPart = ctx.email?.split('@')[0]?.toLowerCase()
  if (localPart && localPart.length >= 3 && plain.toLowerCase().includes(localPart)) {
    return { ok: false, message: 'Password must not contain your email address' }
  }

  return { ok: true }
}
