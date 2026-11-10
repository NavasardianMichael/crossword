import type { Locale as AntdLocale } from 'antd/es/locale'
import type { Locale } from './config'

type Loader = () => Promise<{ default: AntdLocale }>

/**
 * antd's own copy (empty states, pagination) per locale. Loaded on the server in the root
 * layout and passed down, so only the active language's bundle ships. Filipino and Swahili
 * have no antd locale; the components fall back to English while our own copy stays native.
 */
const ANTD_LOCALE_LOADERS: Record<Locale, Loader> = {
  en: () => import('antd/locale/en_US'),
  ru: () => import('antd/locale/ru_RU'),
  hy: () => import('antd/locale/hy_AM'),
  es: () => import('antd/locale/es_ES'),
  pt: () => import('antd/locale/pt_BR'),
  fr: () => import('antd/locale/fr_FR'),
  de: () => import('antd/locale/de_DE'),
  id: () => import('antd/locale/id_ID'),
  mr: () => import('antd/locale/mr_IN'),
  it: () => import('antd/locale/it_IT'),
  pl: () => import('antd/locale/pl_PL'),
  vi: () => import('antd/locale/vi_VN'),
  uk: () => import('antd/locale/uk_UA'),
  ar: () => import('antd/locale/ar_EG'),
  hi: () => import('antd/locale/hi_IN'),
  ko: () => import('antd/locale/ko_KR'),
  bn: () => import('antd/locale/bn_BD'),
  ja: () => import('antd/locale/ja_JP'),
  zh: () => import('antd/locale/zh_CN'),
  fa: () => import('antd/locale/fa_IR'),
  nl: () => import('antd/locale/nl_NL'),
  ro: () => import('antd/locale/ro_RO'),
  el: () => import('antd/locale/el_GR'),
  cs: () => import('antd/locale/cs_CZ'),
  sv: () => import('antd/locale/sv_SE'),
  hu: () => import('antd/locale/hu_HU'),
  he: () => import('antd/locale/he_IL'),
  fil: () => import('antd/locale/en_US'),
  ms: () => import('antd/locale/ms_MY'),
  ur: () => import('antd/locale/ur_PK'),
  th: () => import('antd/locale/th_TH'),
  ta: () => import('antd/locale/ta_IN'),
  sw: () => import('antd/locale/en_US'),
}

export const getAntdLocale = async (locale: Locale): Promise<AntdLocale> => (await ANTD_LOCALE_LOADERS[locale]()).default
