import type { Guide } from '../../types'

export const frenchCrossword: Guide = {
  key: 'language-fr',
  slug: 'french-crossword',
  title: 'French crossword puzzles online: mots croisés and mots fléchés written in French',
  shortTitle: 'French crossword',
  metaTitle: 'French Crossword Puzzles Online (Mots Croisés)',
  description:
    'Play a French crossword online: mots croisés and mots fléchés with clues written natively in French, accents left out as in print. For learners too.',
  searchTerms: [
    'french crossword',
    'french crossword puzzle',
    'crossword in french',
    'french crossword online',
    'french crossword for learners',
    'mots croisés',
    'mots fléchés',
    'mots croises en ligne',
    'mot croisé',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A French crossword is a small daily ritual for millions of French speakers, and one of the most pleasant ways for a learner to live with the language. In French there are two classic forms: **mots croisés**, the numbered grid with definitions beside it, and **mots fléchés**, where the definitions sit inside the grid and arrows point to the answers. Someone who loves them is a cruciverbiste.',
    'Every puzzle on this site is made in French from scratch: the words and the definitions are written natively in French, never translated from English, and code checks every answer before it goes into the grid. The buttons at the end of this page open the French version of the site, where the words, the clues and the menus are all in French.',
  ],
  sections: [
    {
      id: 'french-letters',
      heading: 'Accents, cedillas and œ in a French grid',
      blocks: [
        {
          kind: 'p',
          text: 'French crosswords follow a habit that every francophone solver knows: accents and the cedilla are not written in the grid. Letters are printed as capitals, and capitals in a grid carry no accents, so «été» (summer) goes in as ETE, «forêt» as FORET and «français» as FRANCAIS. A crossing word can therefore share an E with an É without any argument.',
        },
        {
          kind: 'list',
          items: [
            '**Accented letters are plain letters.** é, è, ê, à, ù, î, ô and ç are all typed and checked as e, a, u, i, o and c.',
            '**œ is one square.** The joined letter in «cœur» (heart) and «œuf» (egg) is a letter of its own here, so «cœur» fills four squares: C, Œ, U, R.',
            '**No apostrophes or hyphens.** An answer is a single word, so expressions like «arc-en-ciel» stay out of the grid.',
          ],
        },
        {
          kind: 'tip',
          text: 'On a phone, the on-screen French keyboard uses the AZERTY layout, with a key of its own for œ on the bottom row. You never need to look for an accent, because the grid does not use them.',
        },
      ],
    },
    {
      id: 'mots-croises-and-mots-fleches',
      heading: 'Mots croisés and mots fléchés',
      blocks: [
        {
          kind: 'p',
          text: 'Traditional French **mots croisés** are known for their definitions: short, often witty, sometimes playing on a double meaning, with Horizontalement and Verticalement lists beside the grid. **Mots fléchés** are the relaxed, everyday cousin found in puzzle magazines: each definition sits in a grid square, an arrow shows which way the answer runs, and the clues are short enough to read at a glance.',
        },
        {
          kind: 'p',
          text: 'On this site the classic format is called Mots croisés and the scanword format Mots fléchés. A good French definition is precise rather than vague, as this pair for «chat» (cat) shows:',
        },
        {
          kind: 'compare',
          weak: 'Un animal (an animal)',
          strong: 'Il ronronne sur le canapé (it purrs on the sofa)',
        },
        {
          kind: 'list',
          items: [
            'Choose a [crossword](/crossword) to read every definition first or to print a grid for a class.',
            'Choose a [scanword](/scanword), the mots fléchés, for a quick game on a phone, with each clue right beside its squares.',
          ],
        },
      ],
    },
    {
      id: 'french-for-learners',
      heading: 'French crosswords for learners',
      blocks: [
        {
          kind: 'p',
          text: 'French spelling is famously full of silent letters, and a crossword is a gentle way to master it: you cannot write «oiseau» (bird) or «temps» (time) in the grid without knowing every letter, heard or not. At the same time, the folded accents let you focus on the letters themselves before worrying about which way the accent leans.',
        },
        {
          kind: 'list',
          items: [
            '**Beginners:** start with a small grid on easy, about 8 to 14 everyday words with plain definitions.',
            '**Intermediate learners:** a medium grid on medium difficulty brings idioms and less common words.',
            '**Heritage speakers and expatriates:** the mots fléchés format is quick and friendly for anyone who speaks well but reads French less often.',
            '**Teachers:** save the grid as a PDF with a separate answer page, in color or black and white. The [guide for teachers](/guides/crosswords-for-teachers) has more ideas.',
          ],
        },
        {
          kind: 'p',
          text: 'Each device remembers the words it has shown, so every new puzzle brings fresh vocabulary instead of repeating the easy answers.',
        },
      ],
    },
    {
      id: 'francophone-culture',
      heading: 'France and the French-speaking world',
      blocks: [
        {
          kind: 'p',
          text: 'There are twelve topics, and one of them, [local culture](/topics/local-culture), is about the culture of the puzzle’s language. On the French site it is Culture francophone, which reaches beyond France to the wider French-speaking world: its dishes, festivals, writers and places. Words like «baguette», «fromage» or «chanson» are the kind of thing to expect, and proper names such as rivers and regions are kept for this topic and for geography.',
        },
        {
          kind: 'p',
          text: 'The words follow the shared standard of French, so a solver in Paris, Brussels, Geneva or Montreal can finish the same grid. If a definition seems to work only in one country, report it from the puzzle menu and it will be reviewed.',
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to start a French crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Open the French site with the buttons at the end of this page, or choose Français in the language menu. The puzzle is always in the language the site is in.',
            'Pick Mots croisés or Mots fléchés, then a topic, a size and a difficulty.',
            'Create the puzzle and start typing. Check or reveal a letter, a word or the whole grid when you are stuck.',
          ],
        },
        {
          kind: 'p',
          text: 'Progress is saved on the device, and the site can be installed as an app that keeps opened puzzles working offline. For every option, see [how to make a crossword](/guides/how-to-make-a-crossword). For more Romance-language puzzles, read the [Italian crossword](/guides/italian-crossword) and [Spanish crossword](/guides/spanish-crossword) guides.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Can I do French crosswords online?',
      answer:
        'Yes. Switch the site to French and every puzzle is made in French, with French words, definitions and menus. It runs in the browser on a phone or a computer.',
    },
    {
      question: 'Do French crosswords use accents?',
      answer:
        'No. As in printed French crosswords, accents and the cedilla are left out of the grid, so «été» is ETE. Only œ is kept as a letter of its own, one square wide.',
    },
    {
      question: 'What is the difference between mots croisés and mots fléchés?',
      answer:
        'Mots croisés have numbered squares and lists of definitions beside the grid. Mots fléchés put each definition inside the grid, with an arrow pointing to the answer, which makes them quicker to read on a phone.',
    },
    {
      question: 'Are French crosswords good for learning French?',
      answer:
        'Yes, for vocabulary and especially for spelling, since every silent letter needs its square. Start small and easy, and move up when it feels comfortable.',
    },
    {
      question: 'Is it free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that there are one-time credit packs, no subscription, and opening a shared puzzle is always free. Details are on the [credits page](/credits).',
    },
  ],
  related: ['make', 'language-it', 'language-es'],
}
