import type { ComponentProps } from 'react'
import { Link } from '@i18n/navigation'
import { buttonClassName, type ButtonSize, type ButtonVariant } from './buttonClassName'

/** The single internal-anchor primitive: locale-prefixed via `@i18n/navigation`. */
export type AppLinkProps = ComponentProps<typeof Link>

export const AppLink = (props: AppLinkProps) => <Link {...props} />

export type ButtonLinkProps = AppLinkProps & { variant?: ButtonVariant; size?: ButtonSize; fullWidth?: boolean }

/** A link that looks like a `Button` — for navigation, never for actions. Server-safe. */
export const ButtonLink = ({ variant, size, fullWidth, className, ...rest }: ButtonLinkProps) => (
  <Link className={buttonClassName({ variant, size, fullWidth, className: className as string | undefined })} {...rest} />
)
