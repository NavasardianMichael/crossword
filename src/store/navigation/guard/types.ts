export type LeaveGuardState = {
  /** Every active guard by its owner's id. The page is guarded while any exist. */
  guards: Record<string, true>
  /** The open "leave this puzzle?" question; `resolve` gets the player's answer. */
  question: { resolve: (leave: boolean) => void } | null
  /** The player agreed to leave: let the navigation through without asking again. */
  leaving: boolean
}

export type LeaveGuardActions = {
  setGuard: (id: string, active: boolean) => void
  /** Resolves true at once while nothing is guarded, otherwise once the player answers. */
  ask: () => Promise<boolean>
  answer: (leave: boolean) => void
}
