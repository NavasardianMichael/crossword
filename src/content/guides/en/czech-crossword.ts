import type { Guide } from '../../types'

export const czechCrossword: Guide = {
  key: 'language-cs',
  slug: 'czech-crossword',
  title: 'Czech crossword puzzles online: křížovky and skandinávky written in Czech, háčky included',
  shortTitle: 'Czech crossword',
  metaTitle: 'Czech Crossword Puzzles Online (Křížovky)',
  description:
    'Play a Czech crossword online: křížovky and skandinávky with clues written natively in Czech, where č, ř, ů and every other Czech letter keep their own squares.',
  searchTerms: [
    'czech crossword',
    'czech crossword puzzle',
    'crossword in czech',
    'czech crossword online',
    'czech crossword for learners',
    'křížovka',
    'křížovky online',
    'krizovky',
    'skandinávka',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Czech crossword, the **křížovka**, is a fixture of Czech life: weekend newspapers, thick puzzle magazines at the trafika, and the long tradition of the **tajenka**, the hidden solution phrase that a finished grid spells out. Czechs also love the **skandinávka**, the arrowword with clues inside the grid, and the osmisměrka, a word search that runs in eight directions.',
    'Every puzzle on this site is made in Czech from scratch: the words and clues are written natively in Czech, never translated from English, and code checks every answer against the Czech alphabet before it reaches the grid. The buttons at the end of this page open the Czech version of the site, where words, clues and menus are all in Czech.',
  ],
  sections: [
    {
      id: 'czech-letters',
      heading: 'Háčky, čárky and the kroužek: Czech letters in the grid',
      blocks: [
        {
          kind: 'p',
          text: 'Czech writes its sounds with diacritics: the háček (č, ď, ě, ň, ř, š, ť, ž), the čárka that lengthens a vowel (á, é, í, ó, ú, ý) and the little ring, the kroužek, on ů. They change meaning, not just pronunciation: «byt» is a flat, «být» means to be, and «rada» (advice) is not «ráda» (glad). So in this grid every one of them is kept, and each fills a square of its own.',
        },
        {
          kind: 'list',
          items: [
            '**Every diacritic counts.** «řeka» (river) starts with Ř, and typing R there is a wrong letter.',
            '**ú and ů are different letters.** Both are a long u, but «ů» appears inside words like «dům» (house) and «ú» mostly at the start, as in «úterý» (Tuesday).',
            '**ch takes two squares.** Czech counts ch as one letter of the alphabet, but on this site it is written with two, so «chléb» (bread) fills five squares: C, H, L, É, B.',
            '**Answers are nouns** in the nominative singular, such as «jablko» (apple) or «kladivo» (hammer).',
          ],
        },
        {
          kind: 'tip',
          text: 'On a phone, the on-screen keyboard is QWERTY with an extra row for á, č, ď, é, ě, í, ň, ó, ř, š, ť, ú, ů, ý and ž. On a computer with a Czech layout, the most common ones sit on the number row, as usual.',
        },
      ],
    },
    {
      id: 'krizovka-and-skandinavka',
      heading: 'Křížovka, skandinávka and the tajenka',
      blocks: [
        {
          kind: 'p',
          text: 'The classic **křížovka** has numbered squares and two lists of clues, Vodorovně (across) and Svisle (down). The **skandinávka** puts every clue, called a legenda, inside the grid, with an arrow pointing to the answer. Czech puzzles very often build toward a **tajenka**, a joke or a saying hidden in marked squares, so that the last few letters feel like a punch line.',
        },
        {
          kind: 'p',
          text: 'On this site the two formats are called Křížovka and Skandinávka; tajenky are a joy of hand-made puzzles and are not part of these grids. A good Czech clue points to one answer, as this pair for «kapr» (carp) shows:',
        },
        {
          kind: 'compare',
          weak: 'Ryba (a fish)',
          strong: 'Vánoční ryba z rybníka (the Christmas fish from the pond)',
        },
        {
          kind: 'list',
          items: [
            'Choose a [crossword](/crossword) to read every clue first or to print the puzzle.',
            'Choose a [scanword](/scanword), the skandinávka, for a quick game on a phone with each clue beside its squares.',
          ],
        },
      ],
    },
    {
      id: 'czech-for-learners',
      heading: 'Czech crosswords for learners and heritage speakers',
      blocks: [
        {
          kind: 'p',
          text: 'Czech has a reputation as a hard language, but its spelling is reassuringly regular: once you hear a word clearly, you can usually write it. The real challenge is remembering where the háčky and čárky go, and a crossword is a friendly way to train exactly that, because a missing mark is a wrong letter the crossing word will catch.',
        },
        {
          kind: 'list',
          items: [
            '**Beginners:** a small grid on easy, about 8 to 14 everyday words like «pes» (dog), «voda» (water) or «stůl» (table).',
            '**Intermediate learners:** a medium grid on medium difficulty brings idioms and less common words.',
            '**Heritage speakers:** if you grew up with Czech at home abroad, the grid makes you spell every diacritic.',
            '**Teachers:** save the puzzle as a PDF with a separate answer page, or share a link with the class. The [guide for teachers](/guides/crosswords-for-teachers) has more ideas.',
          ],
        },
        {
          kind: 'p',
          text: 'Each device remembers the words it has shown, so every new puzzle brings fresh vocabulary instead of repeating the same answers.',
        },
      ],
    },
    {
      id: 'czech-culture',
      heading: 'A křížovka about Czech culture',
      blocks: [
        {
          kind: 'p',
          text: 'Among the twelve topics, [local culture](/topics/local-culture), Místní kultura on the Czech site, draws on Czech traditions, food, holidays and places: words like «knedlík» (dumpling), «koleda» (carol) or «chalupa» (country cottage). Proper names, such as rivers, mountains and towns, are kept for this topic and for geography.',
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to start a Czech crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Open the Czech site with the buttons at the end of this page, or choose Čeština in the language menu. The puzzle is always in the language the site is in.',
            'Pick Křížovka or Skandinávka, then a topic, a size and a difficulty.',
            'Create the puzzle and start typing. Check or reveal a letter, a word or the whole grid when you get stuck.',
          ],
        },
        {
          kind: 'p',
          text: 'Progress is saved on the device, and the site can be installed as an app that keeps opened puzzles working offline. For every option, read [how to make a crossword](/guides/how-to-make-a-crossword). The [Polish crossword](/guides/polish-crossword) guide covers a close Slavic neighbor with its own diacritics.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Can I do a Czech crossword online?',
      answer:
        'Yes. Switch the site to Czech and every puzzle is made in Czech, with Czech words, clues and menus. It runs in the browser on a phone or a computer.',
    },
    {
      question: 'Do Czech crosswords keep háčky and čárky?',
      answer:
        'Yes. Every diacritic is kept, and each letter with one fills its own square: č is not c, and ů is not u. Type them exactly as Czech spelling has them.',
    },
    {
      question: 'Is ch one square or two?',
      answer: 'Two on this site: c and h. So «chata» (cottage) is five squares long, even though Czech counts ch as one letter.',
    },
    {
      question: 'What is a skandinávka?',
      answer:
        'It is the Czech name for an arrowword: the clues sit inside the grid, with arrows pointing to the answers. It is the scanword format on this site.',
    },
    {
      question: 'Is it free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that there are one-time credit packs, no subscription, and opening a shared puzzle is always free. Details are on the [credits page](/credits).',
    },
  ],
  related: ['make', 'language-pl'],
}
