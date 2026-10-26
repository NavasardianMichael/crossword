/** Structured data for crawlers. `<` is escaped so a value can never close the script tag. */
export const JsonLd = ({ data }: { data: object }) => (
  <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
)
