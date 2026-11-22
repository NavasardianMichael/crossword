import type { Guide } from '../../types'

export const dutchCrossword: Guide = {
  key: 'language-nl',
  slug: 'dutch-crossword',
  title: 'Dutch crossword puzzles online: kruiswoordpuzzels and Zweedse puzzels written in Dutch',
  shortTitle: 'Dutch crossword',
  metaTitle: 'Dutch Crossword Puzzles Online (Kruiswoordpuzzel)',
  description:
    'Play a Dutch crossword online: kruiswoordpuzzels and Zweedse puzzels with clues written natively in Dutch, and IJ in one square, as Dutch puzzles have it.',
  searchTerms: [
    'dutch crossword',
    'dutch crossword puzzle',
    'crossword in dutch',
    'dutch crossword online',
    'dutch crossword for learners',
    'kruiswoordpuzzel',
    'kruiswoordpuzzel online',
    'zweedse puzzel',
    'kruiswoordraadsel',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Dutch crossword, the **kruiswoordpuzzel**, is a household staple in the Netherlands and Flanders, from the Saturday newspaper to the thick puzzle books sold at every supermarket checkout. Dutch puzzlers have their own habits, most famously that the letters IJ share a single square, and their own favorite format, the **Zweedse puzzel**, with the clues printed inside the grid.',
    'Every puzzle on this site is made in Dutch from scratch: the words and clues are written natively in Dutch, never translated from English, and code checks every answer before it reaches the grid. The buttons at the end of this page open the Dutch version of the site, where the words, clues and menus are all in Dutch.',
  ],
  sections: [
    {
      id: 'ij-in-one-square',
      heading: 'IJ in one square, and other Dutch letters',
      blocks: [
        {
          kind: 'p',
          text: 'In Dutch, ij is treated almost as a letter of its own: it is capitalized as a pair, as in IJsland, and in Dutch crosswords it traditionally fills a single square. This site follows that rule, which changes how long words are.',
        },
        {
          kind: 'list',
          items: [
            '**ij is one square.** «ijs» (ice) fills two squares, IJ and S, and «bijl» (axe) fills three: B, IJ, L.',
            '**Typing ij is easy.** On a phone, the on-screen keyboard has an ij key. On any keyboard, type i and then j, and the two join in the same square.',
            '**Accents fold.** Dutch uses few accents, and the grid drops them: «café» goes in as CAFE and «reünie» (reunion) as REUNIE.',
            '**One word per answer.** Dutch writes compounds as one word, so «fietspad» (bike path) is a perfectly good answer, while anything with a space or a hyphen is not.',
          ],
        },
        {
          kind: 'tip',
          text: 'When a word does not fit, count IJ as one square. Learners from other languages almost always count it as two at first, and the length suddenly makes sense once they stop.',
        },
      ],
    },
    {
      id: 'kruiswoord-and-zweedse-puzzel',
      heading: 'Kruiswoordpuzzel, Zweedse puzzel and the cryptogram',
      blocks: [
        {
          kind: 'p',
          text: 'The classic **kruiswoordpuzzel** has numbered squares and two lists of clues, Horizontaal and Verticaal. The **Zweedse puzzel** puts each clue in a square of the grid, with an arrow pointing to the answer, and it fills most Dutch puzzle books. Dutch newspapers are also known for the **cryptogram**, where every clue is a pun or a play on words; that one is a specialty of human setters and is not something this site makes.',
        },
        {
          kind: 'p',
          text: 'On this site the two formats are called Kruiswoord and Zweedse puzzel. A good Dutch clue leaves only one answer, as this pair for «molen» (windmill) shows:',
        },
        {
          kind: 'compare',
          weak: 'Gebouw (a building)',
          strong: 'Wieken draaien op de wind (sails turning in the wind)',
        },
        {
          kind: 'list',
          items: [
            'Choose a [crossword](/crossword) to read every clue first or to print the puzzle.',
            'Choose a [scanword](/scanword), the Zweedse puzzel, for a quick game on a phone.',
          ],
        },
      ],
    },
    {
      id: 'dutch-for-learners',
      heading: 'Dutch crosswords for learners',
      blocks: [
        {
          kind: 'p',
          text: 'Many people learn Dutch as adults, after moving to the Netherlands or Belgium for work, study or love, and the inburgering (civic integration) exams ask for plenty of everyday vocabulary. A crossword turns that vocabulary into a game: the clues are written in everyday Dutch, the answers are mostly singular nouns, and you have to spell each one, which fixes the tricky vowel pairs like ui, eu and ou in your memory.',
        },
        {
          kind: 'list',
          items: [
            '**Beginners:** a small grid on easy, about 8 to 14 everyday words like «huis» (house), «brood» (bread) or «fiets» (bike).',
            '**Intermediate learners:** a medium grid on medium difficulty brings compounds and idioms.',
            '**Heritage speakers:** if you grew up with Dutch or Flemish at home abroad, the grid gently trains your spelling.',
            '**Teachers:** save the puzzle as a PDF with an answer page, or share a link with the class. The [guide for teachers](/guides/crosswords-for-teachers) has more ideas.',
          ],
        },
        {
          kind: 'p',
          text: 'Each device remembers the words it has shown, so every new puzzle brings fresh vocabulary instead of repeating the same answers.',
        },
      ],
    },
    {
      id: 'dutch-culture',
      heading: 'A crossword about Dutch culture',
      blocks: [
        {
          kind: 'p',
          text: 'Among the twelve topics, [local culture](/topics/local-culture), called Eigen cultuur on the Dutch site, is about the culture of the puzzle’s language: Dutch food, holidays, traditions and places, with words like «stroopwafel», «tulp» (tulip) or «sinterklaas». Proper names, such as rivers, provinces and cities, are kept for this topic and for geography.',
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to start a Dutch crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Open the Dutch site with the buttons at the end of this page, or choose Nederlands in the language menu. The puzzle is always in the language the site is in.',
            'Pick Kruiswoord or Zweedse puzzel, then a topic, a size and a difficulty.',
            'Create the puzzle and start typing. Check or reveal a letter, a word or the whole grid when you get stuck.',
          ],
        },
        {
          kind: 'p',
          text: 'Progress is saved on the device, and the site can be installed as an app that keeps opened puzzles working offline. For every option, read [how to make a crossword](/guides/how-to-make-a-crossword). The [German crossword](/guides/german-crossword) and [Swedish crossword](/guides/swedish-crossword) guides cover two close neighbors.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Can I do a Dutch crossword online?',
      answer:
        'Yes. Switch the site to Dutch and every puzzle is made in Dutch, with Dutch words, clues and menus. It runs in the browser on a phone or a computer.',
    },
    {
      question: 'Is IJ one letter in a Dutch crossword?',
      answer:
        'Yes, here it is. IJ fills a single square, as in most Dutch puzzles, so «ijs» is two squares long. Type i and then j and they join in one square.',
    },
    {
      question: 'What is a Zweedse puzzel?',
      answer:
        'It is the Dutch name for an arrowword: the clues sit inside the grid, with arrows pointing to the answers. It is the scanword format on this site.',
    },
    {
      question: 'Is a Dutch crossword good for learning Dutch?',
      answer:
        'Yes, for vocabulary and spelling. Start with a small easy grid, turn on check as you type, and move up once it feels comfortable.',
    },
    {
      question: 'Is it free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that there are one-time credit packs, no subscription, and opening a shared puzzle is always free. See the [credits page](/credits).',
    },
  ],
  related: ['make', 'language-de', 'language-sv'],
}
