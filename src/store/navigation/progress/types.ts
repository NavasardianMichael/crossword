export type NavigationProgressState = {
  /** Every navigation still loading, by the id of the link or router that started it. */
  pending: Record<string, true>
}

export type NavigationProgressActions = {
  setPending: (id: string, pending: boolean) => void
}
