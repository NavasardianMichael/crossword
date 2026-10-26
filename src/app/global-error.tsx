'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { CORAL, CREAM, INK } from '@styles/tokens'

/**
 * Replaces the root layout when it fails, so it brings its own `<html>` and inline styles —
 * the stylesheet or the message catalogue may be what failed. English only, by necessity.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang='en'>
      <body
        style={{
          margin: 0,
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
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', maxWidth: '32rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Something went wrong</h1>
          <p style={{ margin: 0, color: INK[700] }}>The puzzle hit an unexpected error. Please try again.</p>
          {error.digest && <p style={{ margin: 0, color: INK[700], fontSize: '0.75rem' }}>Reference: {error.digest}</p>}
          <button
            type='button'
            onClick={reset}
            style={{
              marginTop: '0.5rem',
              minHeight: '2.75rem',
              padding: '0 1.5rem',
              border: `2px solid ${INK[900]}`,
              borderRadius: '12px',
              background: CORAL[400],
              color: INK[900],
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
