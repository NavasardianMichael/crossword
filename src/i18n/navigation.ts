import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/**
 * Locale-aware replacements for `next/link` and `next/navigation`. Use these, never the
 * originals, for internal destinations: they add the active locale prefix on the way out and
 * strip it on the way back, which keeps `ROUTES` free of locale segments.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
