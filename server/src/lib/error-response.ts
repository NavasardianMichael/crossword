/**
 * What the API answers for a failure no route raised on purpose — anything that reaches
 * `errorHandler` other than an `HttpError`.
 *
 * Import-free so a unit test can reach it: library errors are recognised by `name` rather
 * than by `instanceof`, which would pull Prisma in.
 *
 * Production messages stay generic — the client shows translated copy chosen by status.
 * Outside production each message carries the original error's message.
 */
export type ErrorResponse = { status: number; code: number; message: string }

type ErrorLike = {
  name?: unknown
  code?: unknown
  type?: unknown
  status?: unknown
  statusCode?: unknown
  message?: unknown
}

const BODY_PARSER_MESSAGES: Record<string, string> = {
  'entity.parse.failed': 'Malformed JSON body',
  'entity.too.large': 'Request body too large',
  'encoding.unsupported': 'Unsupported request encoding',
  'charset.unsupported': 'Unsupported request charset',
}

const clientErrorStatus = (error: ErrorLike): number | undefined => {
  const status = typeof error.status === 'number' ? error.status : error.statusCode
  return typeof status === 'number' && status >= 400 && status < 500 ? status : undefined
}

export const resolveErrorResponse = (err: unknown, production: boolean): ErrorResponse => {
  const error = (err ?? {}) as ErrorLike
  const original = typeof error.message === 'string' ? error.message : String(err)
  const withDetail = (message: string): string => (production ? message : `${message}: ${original}`)

  if (error.name === 'PrismaClientKnownRequestError') {
    if (error.code === 'P2025') return { status: 404, code: 404, message: withDetail('Not found') }
    if (error.code === 'P2002' || error.code === 'P2003') {
      return { status: 409, code: 409, message: withDetail('Conflict') }
    }
  }

  if (error.name === 'PrismaClientValidationError') {
    return { status: 400, code: 400, message: withDetail('Invalid request') }
  }

  const clientStatus = clientErrorStatus(error)
  if (clientStatus) {
    const known = typeof error.type === 'string' ? BODY_PARSER_MESSAGES[error.type] : undefined
    return { status: clientStatus, code: clientStatus, message: known ?? withDetail('Bad request') }
  }

  return { status: 500, code: -1, message: withDetail('Internal server error') }
}
