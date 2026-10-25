'use client'

import { useTransition } from 'react'
import { Dropdown } from 'antd'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { setLocale } from '@i18n/actions'
import { isLocale, type Locale, LOCALE_LABELS, LOCALES } from '@i18n/config'
import { usePathname, useRouter } from '@i18n/navigation'
import { cn } from '@helpers/cn'
import { Button } from '@components/ui/Button'

/**
 * Three languages fit a menu. Each is shown by its own name (an endonym, with `lang`), so
 * someone who cannot read the current UI can still find theirs. Switching keeps the page and
 * its query. Puzzles are written per language, so a puzzle page keeps its own language's
 * grid — the interface around it changes.
 */
export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()
  const t = useTranslations('Common')
  const router = useRouter()
  const pathname = usePathname()

  const choose = (next: Locale) => {
    if (next === locale) return
    startTransition(async () => {
      await setLocale(next)
      // Read at click time rather than via useSearchParams, which would need a Suspense boundary.
      router.replace(`${pathname}${window.location.search}`, { locale: next })
    })
  }

  return (
    <Dropdown
      trigger={['click']}
      placement='bottomRight'
      menu={{
        selectable: true,
        selectedKeys: [locale],
        onClick: ({ key }) => isLocale(key) && choose(key),
        items: LOCALES.map((each) => ({
          key: each,
          label: (
            <span lang={each} className='flex min-h-9 min-w-36 items-center justify-between gap-3 font-semibold'>
              {LOCALE_LABELS[each]}
              {each === locale && <Check aria-hidden className='size-4' />}
            </span>
          ),
        })),
      }}
    >
      <Button
        variant='outline'
        size='sm'
        aria-label={t('chooseLanguage')}
        loading={isPending}
        className={cn('h-11 gap-1.5 px-3', className)}
      >
        <Globe aria-hidden className='size-5' />
        <span className='hidden uppercase sm:inline'>{locale}</span>
        <ChevronDown aria-hidden className='size-4' />
      </Button>
    </Dropdown>
  )
}
