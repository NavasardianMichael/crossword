import { getTranslations } from 'next-intl/server'
import { DEFAULT_LOCALE } from '@i18n/config'
import { localePath } from '@i18n/pathname'
import { ROUTES } from '@constants/routes'
import { CORAL, CREAM, INK } from '@styles/tokens'

/**
 * The 404 for URLs that match no route at all — they never reach `[lang]/not-found.tsx`.
 * It renders above the only root layout, so no stylesheet is loaded: styles are inline and
 * come from `tokens.ts`. The locale is not knowable here, so the copy is the default one.
 */
export default async function RootNotFound() {
  const t = await getTranslations({ locale: DEFAULT_LOCALE, namespace: 'Errors' })

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: CREAM[100],
        color: INK[900],
        fontFamily: 'system-ui, -apple-system, sans-serif',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', maxWidth: '32rem' }}>
        <p aria-hidden='true' style={{ margin: 0, fontSize: '4rem', fontWeight: 900, lineHeight: 1, color: CORAL[500] }}>
          404
        </p>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{t('notFoundTitle')}</h1>
        <p style={{ margin: 0, color: INK[700] }}>{t('notFoundBody')}</p>
        <a
          href={localePath(DEFAULT_LOCALE, ROUTES.home)}
          style={{
            marginTop: '0.5rem',
            display: 'inline-flex',
            minHeight: '2.75rem',
            alignItems: 'center',
            padding: '0 1.5rem',
            borderRadius: '12px',
            border: `2px solid ${INK[900]}`,
            background: CORAL[400],
            color: INK[900],
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          {t('goHome')}
        </a>
      </div>
    </div>
  )
}
