import { describe, expect, it } from 'vitest'
import { LOCALES } from '@constants/puzzle'
import { SHARE_ORDER, SHARE_TARGETS, shareTargetUrl, withShareSource } from '@helpers/share'

const payload = {
  url: 'https://crossword.example/hy/p/Ab3dE5gH9k',
  text: 'Կկարողանա՞ս լուծել այս խաչբառը՝ «Կենդանիներ» թեմայով։ Сможешь? & 100%',
  title: 'Try this puzzle!',
}

describe('share targets', () => {
  it.each(SHARE_TARGETS)('%s builds a well-formed link that carries the puzzle URL', (target) => {
    const href = shareTargetUrl(target, payload)
    expect(() => new URL(href)).not.toThrow()
    expect(decodeURIComponent(href)).toContain('/hy/p/Ab3dE5gH9k')
  })

  it('encodes Armenian, Cyrillic and reserved characters instead of breaking the query', () => {
    for (const target of SHARE_TARGETS) {
      const href = shareTargetUrl(target, payload)
      expect(href).not.toMatch(/[Ѐ-ӿ԰-֏ ]/)
      // `&` and `%` in the text must not start a new parameter or escape.
      expect(href).not.toContain('& 100%')
    }
  })

  it('round-trips the invitation text', () => {
    const telegram = new URL(shareTargetUrl('telegram', payload))
    expect(telegram.searchParams.get('text')).toBe(payload.text)
    const whatsapp = new URL(shareTargetUrl('whatsapp', payload))
    expect(whatsapp.searchParams.get('text')).toContain(payload.text)
  })

  it('tags app links with their source, and leaves the puzzle path alone', () => {
    const tagged = new URL(withShareSource(payload.url, 'vk'))
    expect(tagged.pathname).toBe('/hy/p/Ab3dE5gH9k')
    expect(tagged.searchParams.get('utm_source')).toBe('vk')
    expect(tagged.searchParams.get('utm_medium')).toBe('share')
  })

  it('puts the email subject and link in the mail draft', () => {
    const href = shareTargetUrl('email', payload)
    expect(href.startsWith('mailto:?subject=')).toBe(true)
    expect(decodeURIComponent(href)).toContain(payload.title)
    expect(decodeURIComponent(href)).toContain('utm_source=email')
  })

  it.each(LOCALES)('offers every target exactly once in %s', (locale) => {
    expect([...SHARE_ORDER[locale]].sort()).toEqual([...SHARE_TARGETS].sort())
  })
})
