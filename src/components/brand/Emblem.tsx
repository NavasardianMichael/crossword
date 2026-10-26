import { emblemSvg } from '@helpers/brand'

/** The emblem inline, so it renders with the HTML and needs no extra request. */
export const Emblem = ({ className }: { className?: string }) => (
  <span
    aria-hidden
    className={className}
    style={{ display: 'inline-block' }}
    // The markup is our own constant, built from tokens — no user input reaches it.
    dangerouslySetInnerHTML={{ __html: emblemSvg().replace('<svg ', '<svg width="100%" height="100%" ') }}
  />
)
