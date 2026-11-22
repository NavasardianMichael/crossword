import type { Guide } from '../../types'

export const russianCrossword: Guide = {
  key: 'language-ru',
  slug: 'russian-crossword',
  title: 'Russian crossword puzzles online: krossvord and skanvord, with clues written in Russian',
  shortTitle: 'Russian crossword',
  metaTitle: 'Russian Crossword Puzzles Online, in Cyrillic',
  description:
    'Play a Russian crossword or scanword online, with clues written natively in Russian, an on-screen Cyrillic keyboard and ё typed as е. For learners too.',
  searchTerms: [
    'russian crossword',
    'russian crossword puzzle',
    'crossword in russian',
    'russian crossword online',
    'russian crossword for learners',
    'russian scanword',
    'krossvord',
    'skanvord',
    'кроссворд на русском',
    'сканворд онлайн',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Russian crossword is a small, satisfying test of how well you really know the language. Russian has a long love affair with word puzzles: generations grew up with the «кроссворд» (krossvord) on the back page of a newspaper and the «сканворд» (skanvord) magazines sold at every kiosk and railway station. If you are learning Russian, grew up speaking it at home, or simply want a puzzle in your first language while living abroad, this is a good place to start.',
    'Every puzzle on this site is made in Russian from scratch: the words and clues are written natively in Russian, never translated from English, and code checks each answer against the Russian alphabet before it reaches the grid. The buttons at the end of this page open the Russian version of the site, where everything, menus included, is in Russian.',
  ],
  sections: [
    {
      id: 'cyrillic-in-the-grid',
      heading: 'The Cyrillic alphabet in a crossword grid',
      blocks: [
        {
          kind: 'p',
          text: 'Russian uses a Cyrillic alphabet of 33 letters, and in a crossword each of them fills one square. A few letters behave in ways worth knowing before you start, because they follow the habits of Russian crossword makers rather than strict dictionary spelling.',
        },
        {
          kind: 'list',
          items: [
            '**ё is written as е.** Russian crosswords have long treated ё and е as the same letter, and so does this site: «ёж» (hedgehog) fills two squares as ЕЖ, and «берёза» (birch) is spelled БЕРЕЗА. You type е and the answer counts as correct.',
            '**й is not и.** The short й is a letter of its own, and a word like «чай» (tea) needs it in the last square.',
            '**ъ and ь take a square each.** The hard and soft signs make no sound of their own, but they are letters, so «соль» (salt) fills four squares, not three.',
            '**Stress marks are left out.** Learners’ textbooks often mark stress, as in вода́; the grid never does.',
          ],
        },
        {
          kind: 'p',
          text: 'Answers follow the classic Russian convention: one common noun in the nominative singular, such as «лес» (forest) or «самовар». A word that has no singular, like «ножницы» (scissors), may appear in the plural. Proper names, such as rivers, cities and fairy-tale heroes, are kept for the geography and culture topics.',
        },
      ],
    },
    {
      id: 'typing-russian',
      heading: 'Typing Russian without a Russian keyboard',
      blocks: [
        {
          kind: 'p',
          text: 'On a phone or a tablet, an on-screen Russian keyboard appears under the grid in the familiar ЙЦУКЕН layout. It has no ё key, because the grid writes it as е anyway, so there is one less thing to hunt for.',
        },
        {
          kind: 'p',
          text: 'On a computer with a Russian layout installed, just type. If your keyboard is still on English, you can type anyway: the site reads each key by its position on a Russian keyboard, so Q gives й, W gives ц, E gives у, and so on along the rows. Anyone who has used a Russian typewriter layout will find it natural, and learners pick it up within a puzzle or two.',
        },
        {
          kind: 'tip',
          text: 'Learning the ЙЦУКЕН layout? Turn on “check as I type” in the puzzle menu: a wrong letter is marked as soon as you type it, so you learn the keys and the spelling at the same time.',
        },
      ],
    },
    {
      id: 'krossvord-and-skanvord',
      heading: 'Krossvord and skanvord: two Russian traditions',
      blocks: [
        {
          kind: 'p',
          text: 'The **кроссворд** is the classic shape: numbered squares and two lists of clues, По горизонтали (across) and По вертикали (down). The **сканворд** puts every clue inside the grid, with an arrow pointing to the answer. The English word scanword itself comes from Russian, where this Scandinavian-style puzzle became one of the most popular pastimes on trains and summer porches.',
        },
        {
          kind: 'p',
          text: 'Russian clues have a style of their own. Alongside plain definitions they love a periphrasis or a familiar image: «Царь зверей» (king of beasts) for «лев», a line from a fable, or a proverb with a gap. These are exactly the turns of phrase a translated puzzle loses, and exactly what a learner benefits from meeting in context.',
        },
        {
          kind: 'list',
          items: [
            'Choose a [crossword](/crossword) to read all the clues first or to print the puzzle.',
            'Choose a [scanword](/scanword) for a quick game on a phone, with the clue right beside the squares. The guide to [scanwords and arrowwords](/guides/scanword-arrowword-puzzles) explains how to read the arrows.',
          ],
        },
      ],
    },
    {
      id: 'for-learners',
      heading: 'Russian crosswords for learners and heritage speakers',
      blocks: [
        {
          kind: 'p',
          text: 'For a learner, a Russian crossword is reading practice with a goal. Each clue is a short sentence in real Russian, and each answer has to be spelled letter by letter, which quietly drills the cases, the soft sign and the letters that look Latin but are not, like В, Н and Р.',
        },
        {
          kind: 'list',
          items: [
            '**Beginners:** a small 9×9 grid on easy has about 8 to 14 everyday words with plain definitions.',
            '**Intermediate learners:** a medium grid on medium difficulty brings in idioms and less common words.',
            '**Heritage speakers** who speak fluently but read slowly: the scanword is ideal, because every clue is short and sits next to its answer.',
            '**Teachers:** print the puzzle as a PDF with a separate answer page, or share a link with the class.',
          ],
        },
        {
          kind: 'p',
          text: 'The [local culture](/topics/local-culture) topic, called Культура и традиции on the Russian site, draws on Russian traditions, food, literature and places, from words like «самовар» to «масленица». Each device remembers the words it has seen, so new puzzles never repeat an answer.',
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to start a Russian crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Open the Russian site with the buttons at the end of this page, or choose Русский in the language menu. The puzzle is always in the language the site is in.',
            'Pick Кроссворд or Сканворд, then a topic, a size and a difficulty.',
            'Create the puzzle and start typing. Check or reveal a letter, a word or the whole grid whenever you are stuck.',
          ],
        },
        {
          kind: 'p',
          text: 'Progress is saved on the device, and the site can be installed as an app that keeps opened puzzles working offline. For a full walk through the options, read [how to make a crossword](/guides/how-to-make-a-crossword). If Russian is one of several languages in your family, the [Ukrainian crossword](/guides/ukrainian-crossword) and [Armenian crossword](/guides/armenian-crossword) guides explain their own alphabets.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Can I do a Russian crossword online?',
      answer:
        'Yes. Switch the site to Russian and every puzzle is made in Russian, with Russian words, clues and menus. It runs in the browser on a phone or a computer.',
    },
    {
      question: 'How do I type ё in a Russian crossword?',
      answer:
        'You do not need to. As in most Russian crosswords, ё is written as е, so «ёлка» goes into the grid as ЕЛКА and typing е is correct.',
    },
    {
      question: 'Can I type Russian with an English keyboard?',
      answer:
        'Yes. On a computer, the site maps each key to the letter in the same place on a Russian ЙЦУКЕН keyboard, so Q gives й and A gives ф. On a phone, an on-screen Russian keyboard appears.',
    },
    {
      question: 'Is a Russian crossword good for learning Russian?',
      answer:
        'It is good practice for reading and spelling. Start with a small, easy grid, use check as you type, and move up to medium once easy feels comfortable.',
    },
    {
      question: 'Is it free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that there are one-time credit packs, no subscription, and opening a shared puzzle is always free. Details are on the [credits page](/credits).',
    },
  ],
  related: ['make', 'language-hy', 'language-pl'],
}
