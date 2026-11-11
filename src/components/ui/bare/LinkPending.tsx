'use client'

// The one place `next/link` is read directly: `useLinkStatus` reports the enclosing `Link`'s navigation.
import { useLinkStatus } from 'next/link'
import { useNavigationPending } from '@hooks/useNavigationPending'

/** Rendered inside every `AppLink`: feeds its pending navigation to the page-top progress bar. */
export const LinkPending = () => {
  const { pending } = useLinkStatus()
  useNavigationPending(pending)
  return null
}
