import { buildLlmsTxt } from '@helpers/llms'

/**
 * The site summary for AI assistants (llmstxt.org), built from the catalogues at build time.
 * `/llms.txt` has an extension, so the proxy never locale-prefixes it.
 */
export const dynamic = 'force-static'

export function GET(): Response {
  return new Response(buildLlmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
