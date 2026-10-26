import { APIResponse } from '@interfaces/api'

/** The default processor: the envelope's `value`, unchanged. */
export const unwrapValue = <T>(response: APIResponse<T>): T => response.value
