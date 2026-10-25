'use client'

import { Collapse } from 'antd'
import { ChevronDown } from 'lucide-react'

export type FaqItem = { question: string; answer: string }

/**
 * antd's `Collapse`. `forceRender` puts every answer in the server HTML (hidden until
 * opened), so crawlers read the whole FAQ, matching the FAQPage JSON-LD beside it.
 */
export const FaqAccordion = ({ items }: { items: FaqItem[] }) => (
  <Collapse
    bordered={false}
    expandIconPlacement='end'
    expandIcon={({ isActive }) => (
      <ChevronDown aria-hidden className={`size-5 text-coral-500 transition-transform ${isActive ? 'rotate-180' : ''}`} />
    )}
    className='panel mx-auto max-w-3xl overflow-hidden'
    items={items.map(({ question, answer }) => ({
      key: question,
      forceRender: true,
      label: <span className='font-semibold text-ink-900'>{question}</span>,
      children: <p className='text-ink-700'>{answer}</p>,
    }))}
  />
)
