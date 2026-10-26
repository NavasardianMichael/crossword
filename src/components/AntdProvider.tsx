'use client'

import type { ReactNode } from 'react'
import { App as AntApp, ConfigProvider } from 'antd'
import type { Locale as AntdLocale } from 'antd/es/locale'
import type { Direction } from '@i18n/config'
import { antdTheme } from '@styles/theme'

export type AntdProviderProps = {
  /** antd's own component copy, resolved on the server — see `@i18n/antdLocale`. */
  antdLocale: AntdLocale
  direction: Direction
  children: ReactNode
}

/**
 * The antd context for the whole app. `App component={false}` renders no wrapper element,
 * yet enables `App.useApp()` — the themed, locale-aware `message` the Toaster bridges to.
 */
export const AntdProvider = ({ antdLocale, direction, children }: AntdProviderProps) => (
  // No click wave: the chunky buttons press down instead.
  <ConfigProvider direction={direction} locale={antdLocale} theme={antdTheme} wave={{ disabled: true }}>
    <AntApp component={false}>{children}</AntApp>
  </ConfigProvider>
)
