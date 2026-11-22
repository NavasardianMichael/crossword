import type { Guide } from '../../types'

export const persianCrossword: Guide = {
  key: 'language-fa',
  slug: 'persian-crossword',
  title: 'Persian crossword puzzles online: play a Farsi jadval in your browser',
  shortTitle: 'Persian (Farsi) crosswords',
  metaTitle: 'Persian Crossword Online: Farsi Jadval Puzzles',
  description:
    'Play a Persian crossword online: a Farsi jadval with right-to-left grids and clues written natively in Persian. Tips for learners and heritage speakers.',
  searchTerms: [
    'persian crossword',
    'farsi crossword',
    'persian crossword puzzle online',
    'crossword in farsi',
    'farsi crossword for learners',
    'jadval farsi',
    'jadval kalamat motaghate',
    'جدول کلمات متقاطع',
    'جدول فارسی',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Persian crossword is a جدول کلمات متقاطع (jadval-e kalamāt-e motaqāteʿ), “table of crossing words”, and almost everyone simply calls it a جدول (jadval). In Iran it is a household habit: a jadval in the newspaper, a puzzle book on a long journey, a grid passed around the family after lunch. If you search for a Farsi crossword, this is the puzzle you mean.',
    'This guide explains how a Persian crossword works online, what happens to the letters Persian shares with Arabic, and how learners and heritage speakers can use a jadval to keep their Persian alive. The button at the end of the page opens the Persian version of the site, where the words, the clues and the menus are all in Persian.',
  ],
  sections: [
    {
      id: 'right-to-left',
      heading: 'A jadval that runs from right to left',
      blocks: [
        {
          kind: 'p',
          text: 'In the Persian version, the grid is laid out right to left, the same way the page is. An Across answer begins at the right end of its row of squares and continues leftward; Down answers run from top to bottom as always. In a scanword, the little arrows that lead from a clue to its answer are mirrored too.',
        },
        {
          kind: 'p',
          text: 'Every square holds a single letter, drawn on its own rather than joined to its neighbors. So کتاب (ketāb, “book”) takes four squares, ک ت ا ب, and خانه (khāne, “house”) takes four as well, خ ا ن ه. Reading a word letter by letter like this is surprisingly good practice for anyone still getting used to Persian script.',
        },
      ],
    },
    {
      id: 'persian-letters',
      heading: 'The 32 letters, and what Persian does differently from Arabic',
      blocks: [
        {
          kind: 'p',
          text: 'A Persian grid uses the 32 letters of the Persian alphabet, including the four that Arabic does not have: پ (pe), چ (che), ژ (zhe) and گ (gāf). The answers are written as Iranians write them every day, and code makes sure of a few details before a word reaches the grid.',
        },
        {
          kind: 'list',
          items: [
            '**Persian ی and ک, never Arabic ي and ك.** If a word arrives with the Arabic forms, or you type them on an Arabic keyboard, they become ی and ک.',
            '**No vowel marks.** Zabar, zir, pish, tashdid and tanvin are never written, exactly as in a printed jadval.',
            '**Every alef is a plain ا.** آ is entered as ا, so آب (āb, “water”) fills two squares, ا and ب. Hamza on a seat folds into the seat letter as well.',
            '**ة is written ه.** The few words that keep a tāʾ marbūṭa in Arabic spelling are entered with a plain ه.',
            '**No half-space.** The zero-width non-joiner Persian uses inside words is simply dropped, so a word is one unbroken run of squares.',
          ],
        },
        {
          kind: 'tip',
          text: 'Remember the آ rule when you solve: if an answer obviously starts with آ, type ا. If you type آ out of habit, it goes in as ا, so you never lose a word over it.',
        },
      ],
    },
    {
      id: 'typing-persian',
      heading: 'Typing Persian on a phone or a computer',
      blocks: [
        {
          kind: 'p',
          text: 'On a touch screen, a Persian keyboard appears under the grid with the 32 letters in alphabetical order, from ا, ب, پ, ت to و, ه and ی. Nothing hides the puzzle, and learners find each letter where the alphabet puts it.',
        },
        {
          kind: 'p',
          text: 'On a computer, switch your system keyboard to Persian and type normally. If your keyboard is still in English, the keys stand in by position for the letters of the on-screen layout, which works in a pinch even if it is not the familiar Persian layout.',
        },
      ],
    },
    {
      id: 'learners-and-diaspora',
      heading: 'A jadval for learners, heritage speakers and the diaspora',
      blocks: [
        {
          kind: 'p',
          text: 'Many people who search for a Persian crossword in English grew up speaking Persian at home, in Los Angeles, Toronto, London or Hamburg, but read it slowly. A jadval is a kind way back: the words are familiar, the clues are short, and every finished grid is proof that your reading is getting faster.',
        },
        {
          kind: 'list',
          items: [
            '**Learners** can start with a small, easy grid on the Everyday words topic, where answers are common nouns such as گل (gol, “flower”) and پدر (pedar, “father”).',
            '**Heritage speakers** can step up to medium puzzles and the Local culture topic, which draws on Iran’s own cities, food, poets and festivals, from Nowruz to Yalda.',
            '**Parents** can share a puzzle link with a child and solve it together over a video call, each on their own screen.',
            '**Teachers** of Persian can share one link with a whole class; the [crosswords for teachers](/guides/crosswords-for-teachers) guide has lesson ideas.',
          ],
        },
        {
          kind: 'p',
          text: 'The clues are written natively in Persian, in the short definitional voice of an Iranian jadval, not translated from English. Dari speakers in Afghanistan use the same script, so the grid will look familiar to them too, though the words and clues are written for Iranian readers.',
        },
      ],
    },
    {
      id: 'start',
      heading: 'How to start a Persian crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Press the button at the end of this page, or choose فارسی in the language menu. The whole site switches to Persian.',
            'Pick a classic crossword or a scanword, then a topic, a size and a difficulty. Small and easy is the right first step for learners.',
            'Solve in the browser. You can check a letter, a word or the whole grid, reveal a letter, and come back later: progress is saved on the device.',
            'Share the link with a friend, who gets the same jadval free and without signing up.',
          ],
        },
        {
          kind: 'p',
          text: '[How to make a crossword](/guides/how-to-make-a-crossword) explains each choice in more detail. Persian shares its script with Arabic and Urdu, and the [Arabic crossword](/guides/arabic-crossword) and [Urdu crossword](/guides/urdu-crossword) pages show how each language treats the letters differently.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'What is a Persian crossword called?',
      answer:
        'Its full name is جدول کلمات متقاطع (jadval-e kalamāt-e motaqāteʿ), “table of crossing words”, but in everyday Persian people just say جدول (jadval).',
    },
    {
      question: 'Do I type آ or ا?',
      answer:
        'Type ا. In the grid every alef is a plain ا, so آب (āb, “water”) is written ا ب. If you type آ anyway, it is accepted as ا.',
    },
    {
      question: 'What if my keyboard types the Arabic ي and ك?',
      answer:
        'It does not matter. Arabic ي and ك are turned into Persian ی and ک as you type, so an Arabic keyboard layout works fine.',
    },
    {
      question: 'Will I see the same words again?',
      answer:
        'No. Your device remembers the words it has shown you, and each new puzzle leaves them out, so a learner keeps meeting new vocabulary.',
    },
    {
      question: 'How much does a Persian crossword cost?',
      answer:
        'Your first puzzle each month is free, no account needed. After that there are one-time credit packs with no subscription, and a puzzle someone shares with you is always free to open. Details are on the [credits page](/credits).',
    },
  ],
  related: ['make', 'teachers', 'language-ar', 'language-ur'],
}
