import type { Locale } from '@constants/puzzle'

/**
 * Sharing a puzzle link to an app: each target's public "share intent" URL, which opens the
 * app (or its web composer) with the link and text filled in. No SDKs, no tracking pixels.
 *
 * App links carry `utm_source=<target>` so analytics can tell which app a visit came from —
 * a message app opens links with no referrer. The copied link stays clean.
 */
export const SHARE_TARGETS = ['whatsapp', 'telegram', 'vk', 'facebook', 'x', 'email'] as const
export type ShareTarget = (typeof SHARE_TARGETS)[number]

/** Most-used first: Telegram and VK lead where people speak Russian and Armenian. */
export const SHARE_ORDER: Record<Locale, readonly ShareTarget[]> = {
  en: ['whatsapp', 'x', 'facebook', 'telegram', 'email', 'vk'],
  ru: ['telegram', 'whatsapp', 'vk', 'email', 'facebook', 'x'],
  hy: ['telegram', 'whatsapp', 'facebook', 'vk', 'email', 'x'],
}

/** Brand names stay as the brands write them; email is a word, so it is translated (`Play.shareDialog.email`). */
export const SHARE_BRAND_NAMES: Record<Exclude<ShareTarget, 'email'>, string> = {
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  vk: 'VK',
  facebook: 'Facebook',
  x: 'X',
}

export type SharePayload = {
  /** The puzzle's absolute URL. */
  url: string
  /** One line inviting the friend in. */
  text: string
  /** The email subject. */
  title: string
}

export const withShareSource = (url: string, target: ShareTarget): string => {
  const tagged = new URL(url)
  tagged.searchParams.set('utm_source', target)
  tagged.searchParams.set('utm_medium', 'share')
  return tagged.toString()
}

export const shareTargetUrl = (target: ShareTarget, { url, text, title }: SharePayload): string => {
  const link = withShareSource(url, target)
  const encode = encodeURIComponent
  switch (target) {
    case 'whatsapp':
      return `https://wa.me/?text=${encode(`${text} ${link}`)}`
    case 'telegram':
      return `https://t.me/share/url?url=${encode(link)}&text=${encode(text)}`
    case 'vk':
      return `https://vk.com/share.php?url=${encode(link)}&title=${encode(text)}`
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encode(link)}`
    case 'x':
      return `https://x.com/intent/post?text=${encode(text)}&url=${encode(link)}`
    case 'email':
      return `mailto:?subject=${encode(title)}&body=${encode(`${text}\n\n${link}`)}`
  }
}
