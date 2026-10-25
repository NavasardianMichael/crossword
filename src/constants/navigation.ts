import { ROUTES } from './routes'

/** Header navigation. `labelKey` is under `Nav`. */
export const PRIMARY_NAV = [
  { labelKey: 'crossword', href: ROUTES.crossword },
  { labelKey: 'scanword', href: ROUTES.scanword },
  { labelKey: 'topics', href: ROUTES.topics },
  { labelKey: 'history', href: ROUTES.history },
] as const

/** Extra links in the mobile menu and the footer. */
export const SECONDARY_NAV = [
  { labelKey: 'rules', href: ROUTES.rules },
  { labelKey: 'faq', href: ROUTES.faq },
] as const

export const LEGAL_NAV = [
  { labelKey: 'about', href: ROUTES.about },
  { labelKey: 'privacy', href: ROUTES.privacy },
  { labelKey: 'terms', href: ROUTES.terms },
] as const
