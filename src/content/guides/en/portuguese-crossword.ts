import type { Guide } from '../../types'

export const portugueseCrossword: Guide = {
  key: 'language-pt',
  slug: 'portuguese-crossword',
  title: 'Portuguese crossword puzzles online: palavras cruzadas written in Brazilian Portuguese',
  shortTitle: 'Portuguese crossword',
  metaTitle: 'Portuguese Crossword Puzzles Online (Palavras Cruzadas)',
  description:
    'Play a Portuguese crossword online: palavras cruzadas with clues written natively in Brazilian Portuguese, accents and ç left out as in print.',
  searchTerms: [
    'portuguese crossword',
    'portuguese crossword puzzle',
    'crossword in portuguese',
    'portuguese crossword online',
    'brazilian portuguese crossword',
    'portuguese crossword for learners',
    'palavras cruzadas',
    'palavras cruzadas online',
    'palavras cruzadas diretas',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Portuguese crossword, the **palavras cruzadas**, is a favorite pastime across Brazil, where puzzle magazines fill the newsstands and the format with clues printed inside the grid, palavras cruzadas diretas, is many people’s first puzzle. If you are learning Portuguese, grew up speaking it in a Brazilian or Portuguese family abroad, or just want a puzzle in your own language, this guide is for you.',
    'Every puzzle on this site is made in Portuguese from scratch: the words and clues are written natively in Brazilian Portuguese, never translated from English, and code checks every answer before it reaches the grid. The buttons at the end of this page open the Portuguese version of the site, where the words, clues and menus are all in Portuguese.',
  ],
  sections: [
    {
      id: 'portuguese-letters',
      heading: 'Accents, tildes and ç in a Portuguese grid',
      blocks: [
        {
          kind: 'p',
          text: 'Portuguese has more accent marks than most European languages: the acute, the circumflex, the tilde, the grave and the cedilla. Crosswords leave them all out. Grid letters are printed as plain capitals, so the crossing words can share a square without any argument over marks.',
        },
        {
          kind: 'list',
          items: [
            '**Accents and tildes fold to plain letters.** «coração» (heart) goes in as CORACAO, «avó» (grandmother) as AVO and «ônibus» (bus) as ONIBUS.',
            '**ç is written c.** «maçã» (apple) fills four squares: M, A, C, A.',
            '**One word per answer.** No spaces, hyphens or apostrophes, so a hyphenated word like «beija-flor» (hummingbird) stays out of the grid.',
          ],
        },
        {
          kind: 'tip',
          text: 'Because marks never count, you can type plain letters on any keyboard, and a phone shows a simple on-screen keyboard below the grid. If you do type ã or ç out of habit, it is accepted as the plain letter.',
        },
      ],
    },
    {
      id: 'brazilian-portuguese',
      heading: 'Brazilian Portuguese, and what that means for Portugal',
      blocks: [
        {
          kind: 'p',
          text: 'The words and clues follow the Portuguese of Brazil. Most vocabulary is shared, but a few everyday words differ: the grid says «ônibus», not «autocarro», for a bus, and «trem», not «comboio», for a train. Solvers from Portugal, Angola or Mozambique will understand nearly every clue and enjoy spotting the Brazilian turns of phrase; learners of European Portuguese should simply expect some Brazilian words.',
        },
        {
          kind: 'p',
          text: 'Among the twelve topics, [local culture](/topics/local-culture) is called Cultura brasileira on the Portuguese site: Brazilian food, festivals, music and places, with words like «feijoada», «samba» or «carnaval». Proper names, such as rivers and states, are kept for this topic and for geography.',
        },
      ],
    },
    {
      id: 'palavras-cruzadas-and-autodefinido',
      heading: 'Palavras cruzadas and the clue-in-the-grid format',
      blocks: [
        {
          kind: 'p',
          text: 'The classic **palavras cruzadas** grid has numbered squares and two lists of clues, Horizontais and Verticais. The clue-in-the-grid format, known in Brazil as palavras cruzadas diretas, puts each clue inside a square with an arrow pointing to the answer. On this site the two are called Palavras cruzadas and Autodefinido.',
        },
        {
          kind: 'p',
          text: 'A good Portuguese clue points to one answer only. Compare these two for «gato» (cat):',
        },
        {
          kind: 'compare',
          weak: 'Animal doméstico (a pet)',
          strong: 'Bichano que mia (a kitty that meows)',
        },
        {
          kind: 'list',
          items: [
            'Choose a [crossword](/crossword) to read every clue first or to print the puzzle.',
            'Choose a [scanword](/scanword) for a quick game on a phone, with the clue right beside its squares.',
          ],
        },
      ],
    },
    {
      id: 'portuguese-for-learners',
      heading: 'Portuguese crosswords for learners',
      blocks: [
        {
          kind: 'p',
          text: 'Folded accents are a gift for learners: you can concentrate on recalling the word and its letters, and leave the accent rules for later. Clues are written in natural Brazilian Portuguese, so every puzzle is also reading practice with a purpose.',
        },
        {
          kind: 'list',
          items: [
            '**Beginners:** a small grid on easy, about 8 to 14 everyday words like «casa» (house), «praia» (beach) or «pão» (bread).',
            '**Intermediate learners:** a medium grid on medium difficulty brings idioms and less common words.',
            '**Heritage speakers:** if you speak Portuguese at home but seldom write it, the grid makes you spell every word.',
            '**Teachers:** save the puzzle as a PDF with a separate answer page, or share a link with the class.',
          ],
        },
        {
          kind: 'p',
          text: 'Each device remembers the words it has shown, so a new puzzle never repeats an answer you have already met.',
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to start a Portuguese crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Open the Portuguese site with the buttons at the end of this page, or choose Português in the language menu. The puzzle is always in the language the site is in.',
            'Pick Palavras cruzadas or Autodefinido, then a topic, a size and a difficulty.',
            'Create the puzzle and start typing. Check or reveal a letter, a word or the whole grid when you get stuck.',
          ],
        },
        {
          kind: 'p',
          text: 'Progress is saved on the device, and the site can be installed as an app that keeps opened puzzles working offline. For every option, read [how to make a crossword](/guides/how-to-make-a-crossword), and for a close neighbor, the [Spanish crossword guide](/guides/spanish-crossword).',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Can I do palavras cruzadas online?',
      answer:
        'Yes. Switch the site to Portuguese and every puzzle is made in Portuguese, with Portuguese words, clues and menus. It runs in the browser on a phone or a computer.',
    },
    {
      question: 'Is it Brazilian or European Portuguese?',
      answer:
        'Brazilian Portuguese. Speakers from Portugal and Africa understand nearly every clue, but a few words follow Brazilian use, such as «ônibus» and «trem».',
    },
    {
      question: 'Do Portuguese crosswords use accents?',
      answer: 'No. Accents, tildes and the cedilla are left out of the grid, so «coração» is CORACAO and «maçã» is MACA.',
    },
    {
      question: 'Are Portuguese crosswords good for learners?',
      answer:
        'Yes, for vocabulary and reading. Start with a small grid on easy, use check as you type, and move up to medium when it feels comfortable.',
    },
    {
      question: 'Is it free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that there are one-time credit packs, no subscription, and opening a shared puzzle is always free. Details are on the [credits page](/credits).',
    },
  ],
  related: ['make', 'language-es'],
}
