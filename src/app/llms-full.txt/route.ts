import { buildLlmsFullTxt } from '@helpers/llms'

/** `/llms.txt` plus the long-form copy — About, How to play and the FAQ — in every language. */
export const dynamic = 'force-static'

export function GET(): Response {
  return new Response(buildLlmsFullTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
