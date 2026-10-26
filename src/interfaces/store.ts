export type StateCommonProps = {
  isPending: boolean
  /** The raw error; components turn it into translated copy via `ErrorAlert`. */
  error: unknown
}
