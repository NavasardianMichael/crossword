import type { Guide } from '../../types'

export const urduCrossword: Guide = {
  key: 'language-ur',
  slug: 'urdu-crossword',
  title: 'Urdu crossword puzzles online: play a crossword written in Urdu',
  shortTitle: 'Urdu crosswords',
  metaTitle: 'Urdu Crossword Puzzles Online, in Urdu Script',
  description:
    'Play an Urdu crossword online, with right-to-left grids, clues written natively in Urdu and an Urdu keyboard on your phone. For learners and families abroad.',
  searchTerms: [
    'urdu crossword',
    'urdu crossword puzzle',
    'urdu crossword online',
    'crossword in urdu',
    'urdu crossword for kids',
    'urdu word puzzle',
    'کراس ورڈ',
    'معمہ',
    'urdu muamma',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'An Urdu crossword fits Urdu words into a grid from right to left, in the same script you read in an Urdu newspaper. Urdu speakers often just call it a کراس ورڈ (crossword), while puzzle pages have long used معمہ (muʿammā), a word for a riddle or puzzle, for word games of this kind. Either way, the pleasure is the same: a short clue, a row of empty squares, and the moment the right word drops into place.',
    'This guide explains how an Urdu crossword works online, which letters get a square of their own, what happens to hamza and madda, and how learners and the Urdu-speaking diaspora can use crosswords to read more fluently. The button at the end of the page opens the Urdu version of the site, with every word, clue and menu in Urdu.',
  ],
  sections: [
    {
      id: 'urdu-grid',
      heading: 'How an Urdu grid reads',
      blocks: [
        {
          kind: 'p',
          text: 'The Urdu version of the site is laid out right to left, and so is the grid. An Across answer starts in the rightmost square and runs to the left; Down answers run from top to bottom. In a scanword, the arrows from each clue to its answer are mirrored as well.',
        },
        {
          kind: 'p',
          text: 'Each square holds a single letter, shown in its standalone form rather than in the flowing Nastaliq joins of handwritten Urdu. So کتاب (kitāb, “book”) takes four squares, ک ت ا ب, and چاند (chānd, “moon”) takes four, چ ا ن د. Reading letters one by one is slower at first, and very good training for anyone whose Urdu reading is rusty.',
        },
      ],
    },
    {
      id: 'urdu-letters',
      heading: 'Urdu’s own letters, and what counts as a square',
      blocks: [
        {
          kind: 'p',
          text: 'Urdu adds letters that Arabic and Persian do not have, and each one keeps its own square: ٹ (ṭe), ڈ (ḍāl) and ڑ (ṛe), the nasal ں (nūn ghunna), the round ہ (gol he), the two-eyed ھ (do-chashmī he) and the final ے (baṛī ye). A few conventions are applied in code before a word reaches the grid.',
        },
        {
          kind: 'list',
          items: [
            '**Aspirated sounds take two squares.** The ھ that marks aspiration is a letter of its own, so گھر (ghar, “house”) fills three squares, گ ھ ر.',
            '**ی and ے are different letters,** and so are ن and ں. The check tool treats them as different, just as Urdu spelling does.',
            '**No vowel marks.** Zabar, zer, pesh and tashdīd are never typed.',
            '**Madda and hamza on a seat fold away.** آ is entered as ا, and ئ is written as ی. Answers are chosen to avoid them, and if you type آ out of habit it simply goes in as ا.',
            '**Arabic forms become Urdu forms.** If an Arabic keyboard gives you ي, ك or ه, they turn into ی, ک and ہ.',
          ],
        },
        {
          kind: 'tip',
          text: 'When a word does not seem to fit, count its aspirates. A word like بھائی (bhāī, “brother”) needs a square for the ھ, so it is one square longer than it sounds.',
        },
      ],
    },
    {
      id: 'typing-urdu',
      heading: 'Typing Urdu on a phone or a computer',
      blocks: [
        {
          kind: 'p',
          text: 'On a touch screen, the site shows an Urdu keyboard under the grid with the letters in alphabetical order, from ا, ب, پ, ت, ٹ through to ی, ے and ء. You never have to hunt for ٹ or ڑ behind a long press, and your phone’s own keyboard never covers the puzzle.',
        },
        {
          kind: 'p',
          text: 'On a computer, switch your system keyboard to Urdu and type as usual. If it is still set to English, the keys stand in by position for the letters of the on-screen keyboard, which helps in a pinch.',
        },
      ],
    },
    {
      id: 'who-plays-urdu',
      heading: 'For learners, families abroad and Urdu speakers at home',
      blocks: [
        {
          kind: 'p',
          text: 'Many people who look for an Urdu crossword in English speak Urdu well but read it less often than they would like: second-generation families in Britain, the Gulf, Canada or the United States, or Hindi speakers who understand spoken Urdu and want to learn the script. Crosswords suit them well, because the vocabulary is familiar and the reading is in short, satisfying pieces.',
        },
        {
          kind: 'list',
          items: [
            '**Children and beginners**: a small, easy grid on the Everyday words or Animals topic, with answers like پانی (pānī, “water”) and کتاب.',
            '**Confident speakers**: medium grids on the Local culture topic, which draws on Pakistan’s own cities, food, poets and festivals.',
            '**Teachers and Saturday-school classes**: one shared link, and every pupil opens the same grid on a phone or tablet. See [crosswords for teachers](/guides/crosswords-for-teachers).',
          ],
        },
        {
          kind: 'p',
          text: 'The words and clues are written natively in Pakistani Urdu, not translated from English, so the clues sound the way an Urdu puzzle page would phrase them. Code checks every answer against the Urdu alphabet and the length of its slot, and drops what does not fit.',
        },
      ],
    },
    {
      id: 'start-urdu',
      heading: 'How to start an Urdu crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Press the button at the end of this page, or choose اردو in the language menu. The site switches to Urdu, right to left.',
            'Choose a classic crossword or a scanword, then a topic, a size and a difficulty.',
            'Solve on your phone or computer. Check a letter, a word or the whole grid, and reveal a letter when you are stuck; your progress is saved on the device.',
            'Send the link to a friend or a cousin: they get the same grid, free and without signing up.',
          ],
        },
        {
          kind: 'p',
          text: 'For a closer look at each option, read [how to make a crossword](/guides/how-to-make-a-crossword). Spoken Urdu and Hindi are close, and the [Hindi crossword](/guides/hindi-crossword) page shows how a Devanagari grid works; the [Persian crossword](/guides/persian-crossword) page covers the script Urdu shares with Persian.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'What is a crossword called in Urdu?',
      answer:
        'Most people simply say کراس ورڈ (crossword). Puzzle pages also use معمہ (muʿammā), a word for a riddle or puzzle, for word games like this.',
    },
    {
      question: 'Why does گھر take three squares?',
      answer:
        'Because the two-eyed ھ that marks aspiration is a letter of its own in the grid. گھر (ghar) is written گ ھ ر.',
    },
    {
      question: 'Do I type آ or ا?',
      answer:
        'Type ا. Madda is not used in the grid, and if you type آ it goes in as ا. In the same way, ئ is written as ی.',
    },
    {
      question: 'Can I play in Roman Urdu?',
      answer:
        'No. The answers are written in Urdu script, and the on-screen keyboard has the Urdu letters. That is part of the point: it is a gentle way to practice reading the script.',
    },
    {
      question: 'Is the Urdu crossword free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that there are one-time credit packs, no subscription, and opening a shared puzzle is always free. See the [credits page](/credits).',
    },
  ],
  related: ['make', 'teachers', 'language-hi', 'language-fa'],
}
