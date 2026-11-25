'use client'

import { type MouseEvent, useEffect, useRef, useTransition } from 'react'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { confirmLeave } from '@hooks/useLeaveGuard'
import { useNavigationPending } from '@hooks/useNavigationPending'
import { setLocale } from '@i18n/actions'
import { type Locale, LOCALE_LABELS, LOCALES } from '@i18n/config'
import { Link, usePathname, useRouter } from '@i18n/navigation'
import { cn } from '@helpers/cn'
import { buttonClassName } from '@components/ui/bare/buttonClassName'
import { Spinner } from '@components/ui/Spinner'

const closeMenu = (details: HTMLDetailsElement | null, refocus = false) => {
  if (!details?.open) return
  details.open = false
  if (refocus) details.querySelector('summary')?.focus()
}

/**
 * Every language is shown by its own name (an endonym, with `lang`), so someone who cannot read
 * the current UI can still find theirs. The menu scrolls. Switching keeps the page and its
 * query. A puzzle page keeps its own language's grid — the interface around it changes.
 *
 * A native `<details>` of real links, so it opens and switches before the page has hydrated
 * (seconds on a slow phone, when an antd `Dropdown` ignored every tap). Once hydrated, a click
 * asks before leaving an unfinished game, saves the choice and keeps the query.
 */
export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const [isPending, startTransition] = useTransition()
  // Its own transition (the locale cookie, then the route), so it reports to the progress bar itself.
  useNavigationPending(isPending)
  const locale = useLocale()
  const t = useTranslations('Common')
  const router = useRouter()
  const pathname = usePathname()
  const detailsRef = useRef<HTMLDetailsElement>(null)

  // Always listening, reading `open` off the element: a click right after opening is not raced.
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!detailsRef.current?.contains(event.target as Node)) closeMenu(detailsRef.current)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu(detailsRef.current, true)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const choose = async (event: MouseEvent<HTMLAnchorElement>, next: Locale) => {
    // A new tab or window gets the plain link.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    closeMenu(detailsRef.current)
    if (next === locale || !(await confirmLeave())) return
    startTransition(async () => {
      await setLocale(next)
      // Read at click time rather than via useSearchParams, which would need a Suspense boundary.
      router.replace(`${pathname}${window.location.search}`, { locale: next })
    })
  }

  return (
    <details ref={detailsRef} className='group relative'>
      <summary
        aria-label={t('chooseLanguage')}
        aria-busy={isPending || undefined}
        className={cn(
          buttonClassName({ variant: 'outline', size: 'sm' }),
          'h-11 cursor-pointer list-none gap-1 px-2.5 xl:gap-1.5 xl:px-3 [&::-webkit-details-marker]:hidden',
          className
        )}
      >
        {isPending ? <Spinner size='sm' /> : <Globe aria-hidden className='size-5' />}
        <span className='hidden uppercase sm:inline'>{locale}</span>
        <ChevronDown aria-hidden className='size-4 transition-transform group-open:rotate-180' />
      </summary>
      <ul className='absolute end-0 top-full z-50 mt-2 max-h-[70vh] w-max overflow-y-auto rounded-panel border border-line-subtle bg-cream-50 p-1 shadow-lift'>
        {LOCALES.map((each) => (
          <li key={each}>
            <Link
              href={pathname}
              locale={each}
              lang={each}
              hrefLang={each}
              aria-current={each === locale ? 'true' : undefined}
              onClick={(event) => void choose(event, each)}
              className={cn(
                'flex min-h-11 min-w-40 items-center justify-between gap-3 rounded-control px-3 font-semibold text-ink-900 no-underline hover:bg-cream-200',
                each === locale && 'bg-coral-100/60 text-coral-600 hover:bg-coral-100'
              )}
            >
              {LOCALE_LABELS[each]}
              {each === locale && <Check aria-hidden className='size-4' />}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  )
}
