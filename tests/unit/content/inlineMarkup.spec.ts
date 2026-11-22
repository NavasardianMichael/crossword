import { describe, expect, it } from 'vitest'
import { inlineLinks, parseInline, plainText } from '@helpers/inlineMarkup'

describe('inline markup', () => {
  const text = 'Make a [crossword](/crossword) or a **scanword**, then [share](/guides/how-to-make-a-crossword).'

  it('splits text into plain runs, links and bold', () => {
    expect(parseInline(text)).toEqual([
      { type: 'text', value: 'Make a ' },
      { type: 'link', label: 'crossword', href: '/crossword' },
      { type: 'text', value: ' or a ' },
      { type: 'bold', value: 'scanword' },
      { type: 'text', value: ', then ' },
      { type: 'link', label: 'share', href: '/guides/how-to-make-a-crossword' },
      { type: 'text', value: '.' },
    ])
  })

  it('reads as plain text with the marks removed', () => {
    expect(plainText(text)).toBe('Make a crossword or a scanword, then share.')
  })

  it('lists every link target', () => {
    expect(inlineLinks(text)).toEqual(['/crossword', '/guides/how-to-make-a-crossword'])
  })

  it('leaves Armenian text and lone brackets alone', () => {
    expect(parseInline('Խաչբառ [առանց հղման]։')).toEqual([{ type: 'text', value: 'Խաչբառ [առանց հղման]։' }])
  })
})
