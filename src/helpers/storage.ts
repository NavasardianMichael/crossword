/**
 * localStorage that never throws. Private windows, blocked site data and quota errors all
 * degrade to "nothing stored" — the game must work without persistence.
 */
export const readJson = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export const writeJson = (key: string, value: unknown): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota or privacy mode: persistence is a convenience, never a requirement.
  }
}

export const removeKey = (key: string): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Same as above.
  }
}

/** RFC 4122 v4; `crypto.randomUUID` is missing on older iOS Safari. */
export const uuid = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0
    return (char === 'x' ? random : (random & 0x3) | 0x8).toString(16)
  })
}
