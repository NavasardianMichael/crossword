import type { Locale as AntdLocale } from 'antd/es/locale'
import type { Locale } from './config'

type Loader = () => Promise<{ default: AntdLocale }>

/**
 * antd's own copy (empty states, pagination) per locale. Loaded on the server in the root
 * layout and passed down, so only the active language's bundle ships.
 */
const ANTD_LOCALE_LOADERS: Record<Locale, Loader> = {
  en: () => import('antd/locale/en_US'),
  ru: () => import('antd/locale/ru_RU'),
  hy: () => import('antd/locale/hy_AM'),
}

export const getAntdLocale = async (locale: Locale): Promise<AntdLocale> => (await ANTD_LOCALE_LOADERS[locale]()).default
