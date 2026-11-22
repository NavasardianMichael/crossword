/** Packages that ship no types: only what the PDF builder (`helpers/puzzle/pdf.ts`) calls. */

declare module 'bidi-js' {
  import type { Bidi } from '@helpers/puzzle/pdfText'

  const bidiFactory: () => Bidi
  export default bidiFactory
}

declare module 'regenerator-runtime' {
  const runtime: unknown
  export default runtime
}
