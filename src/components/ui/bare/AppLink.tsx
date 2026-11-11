import type { ComponentProps } from 'react'
import { Link } from '@i18n/navigation'
import { buttonClassName, type ButtonSize, type ButtonVariant } from './buttonClassName'
import { LinkPending } from './LinkPending'

/**
 * The single internal-anchor primitive: locale-prefixed via `@i18n/navigation`. While the page
 * it opens is loading, `LinkPending` shows the page-top progress bar.
 */
export type AppLinkProps = ComponentProps<typeof Link>

export const AppLink = ({ children, ...rest }: AppLinkProps) => (
  <Link {...rest}>
    {children}
    <LinkPending />
  </Link>
)

export type ButtonLinkProps = AppLinkProps & {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  wrap?: boolean
}

/** A link that looks like a `Button` — for navigation, never for actions. Server-safe. */
export const ButtonLink = ({ variant, size, fullWidth, wrap, className, ...rest }: ButtonLinkProps) => (
  <AppLink className={buttonClassName({ variant, size, fullWidth, wrap, className: className as string | undefined })} {...rest} />
)
