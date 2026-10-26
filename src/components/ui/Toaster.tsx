'use client'

import { useEffect } from 'react'
import { App as AntApp } from 'antd'
import { useToastStoreBase } from '@store/toast/store'

const TOAST_SECONDS = 4.5

/**
 * Bridges the toast store to antd's `message`, so stores and helpers keep calling the plain
 * `toast()` function while the UI is antd's themed, stacked notice. Each toast is shown once
 * and then removed from the store.
 */
export const Toaster = () => {
  const { message } = AntApp.useApp()

  useEffect(() => {
    const show = () => {
      const { toasts, dismissToast } = useToastStoreBase.getState()
      for (const toast of toasts) {
        message.open({ key: toast.id, type: toast.tone, content: toast.message, duration: TOAST_SECONDS })
        dismissToast(toast.id)
      }
    }
    show()
    return useToastStoreBase.subscribe(show)
  }, [message])

  return null
}
