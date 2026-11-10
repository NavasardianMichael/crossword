'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { googleSignInUrl } from '@api/auth/main'
import { axiosInstance } from '@api/axiosInstance'
import type { APIResponse } from '@interfaces/api'
import { Button } from '@components/ui/Button'

let googleAvailable: Promise<boolean> | null = null

const isGoogleAvailable = (): Promise<boolean> => {
  googleAvailable ??= axiosInstance
    .get<APIResponse<{ google?: boolean }>>('/health')
    .then(({ data }) => Boolean(data.value?.google))
    .catch(() => false)
  return googleAvailable
}

/** A full navigation to the API, which runs Google's flow and comes back. Hidden when Google is off. */
export const GoogleButton = ({ returnTo }: { returnTo?: string }) => {
  const t = useTranslations('Auth')
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    let cancelled = false
    void isGoogleAvailable().then((value) => {
      if (!cancelled) setEnabled(value)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!enabled) return null

  return (
    <Button
      type='button'
      variant='outline'
      fullWidth
      onClick={() => {
        window.location.href = googleSignInUrl(returnTo)
      }}
    >
      {t('google')}
    </Button>
  )
}
