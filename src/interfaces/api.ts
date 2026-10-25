type EndpointPaths = {
  payload?: unknown
  response?: unknown
  processed?: unknown
}

/** One operation: what goes in, what the API answers, what the app keeps. */
export type Endpoint<T extends EndpointPaths> = {
  payload: T['payload']
  response: T['response']
  processed: T['processed']
  api: (args: T['payload']) => Promise<T['processed']>
  processor: (args: APIResponse<T['response']>) => T['processed']
}

export type AppError = { code: number; message: string }

/** The server's envelope — `server/src/lib/api-response.ts`. */
export type APIResponse<T> = {
  value: T
  error: AppError | null
}
