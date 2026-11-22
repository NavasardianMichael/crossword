import { parseInline } from '@helpers/inlineMarkup'
import { AppLink } from '@components/ui/bare/AppLink'

/**
 * Text with `[label](/path)` links and `**bold**` (`helpers/inlineMarkup`). Site paths are
 * locale-free and become links in the page's own language; the content tests allow no others.
 */
export const RichText = ({ text }: { text: string }) =>
  parseInline(text).map((token, index) => {
    if (token.type === 'bold') return <strong key={index}>{token.value}</strong>
    if (token.type === 'link') {
      return (
        <AppLink key={index} href={token.href} className='font-semibold text-link underline decoration-2 underline-offset-2 hover:text-coral-700'>
          {token.label}
        </AppLink>
      )
    }
    return token.value
  })
