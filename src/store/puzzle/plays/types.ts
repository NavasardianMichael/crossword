export type PlaysState = {
  /** When this device's games last reached the account (epoch ms); null until they have this session. */
  syncedAt: number | null
}

export type PlaysActions = {
  /** Reports every game received or played since the last report, now. Signed out, it does nothing. */
  sync: () => Promise<void>
  /** The same, a few seconds after the last call: progress is saved on every keystroke. */
  schedule: () => void
}
