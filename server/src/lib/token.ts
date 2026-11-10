import { createHash, randomBytes } from 'node:crypto'

/** Single-use tokens that travel in a URL. Stored hashed, so a database read is not a working link. */
export const mintUrlToken = (): string => randomBytes(32).toString('hex')

export const hashUrlToken = (token: string): string => createHash('sha256').update(token).digest('hex')
