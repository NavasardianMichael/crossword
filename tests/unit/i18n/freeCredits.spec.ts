import { describe, expect, it } from 'vitest'
import { FREE_MONTHLY_CREDITS } from '../../../src/constants/puzzle'
import en from '../../../src/messages/en.json'

// The long-form copy writes the monthly free credits out as a number (no placeholders there),
// so changing FREE_MONTHLY_CREDITS must come with new copy — docs/BILLING.md, "Changing prices".
describe('free credits in the copy', () => {
  const amount = String(FREE_MONTHLY_CREDITS)
  const [, isItFree, needAccount, howMuch] = en.Faq.groups[0]!.items

  it.each([
    ['Home.faq1Answer', en.Home.faq1Answer],
    ['Credits.subtitle', en.Credits.subtitle],
    ['Seo.creditsDescription', en.Seo.creditsDescription],
    ['Terms free credits', en.Terms.sections[1]!.paragraphs[0]!],
    ['FAQ: is it free', isItFree!.answer],
    ['FAQ: do I need an account', needAccount!.answer],
    ['FAQ: how much', howMuch!.answer],
  ])('%s names the monthly free credits', (_, text) => {
    expect(text).toContain(amount)
  })
})
