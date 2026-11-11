'use client'

import { useTransition } from 'react'
import { Dropdown } from 'antd'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { confirmLeave } from '@hooks/useLeaveGuard'
import { setLocale } from '@i18n/actions'
import { isLocale, type Locale, LOCALE_LABELS, LOCALES } from '@i18n/config'
import { usePathname, useRouter } from '@i18n/navigation'
import { cn } from '@helpers/cn'
import { Button } from '@components/ui/Button'

/**
 * Every language is shown by its own name (an endonym, with `lang`), so someone who cannot read
 * the current UI can still find theirs. The menu scrolls. Switching keeps the page and its
 * query. A puzzle page keeps its own language's grid — the interface around it changes.
 */
export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()
  const t = useTranslations('Common')
  const router = useRouter()
  const pathname = usePathname()

  const choose = async (next: Locale) => {
    if (next === locale || !(await confirmLeave())) return
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
          className: 'max-h-[70vh] overflow-y-auto',
          selectable: true,
        selectedKeys: [locale],
        onClick: ({ key }) => isLocale(key) && void choose(key),
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
        className={cn('h-11 gap-1 px-2.5 xl:gap-1.5 xl:px-3', className)}
      >
        <Globe aria-hidden className='size-5' />
        <span className='hidden uppercase sm:inline'>{locale}</span>
        <ChevronDown aria-hidden className='size-4' />
      </Button>
    </Dropdown>
  )
}
