import type { Guide } from '../../types'

export const ukrainianCrossword: Guide = {
  key: 'language-uk',
  slug: 'ukrainian-crossword',
  title: 'Ukrainian crossword puzzles online: кросворд and сканворд written in Ukrainian',
  shortTitle: 'Ukrainian crosswords',
  metaTitle: 'Ukrainian Crossword Puzzles Online, Native Clues',
  description:
    'Play a Ukrainian crossword online: кросворди and сканворди with words and clues written in Ukrainian, ґ, є, і and ї included. For learners and families.',
  searchTerms: [
    'ukrainian crossword',
    'ukrainian crossword puzzle',
    'crossword in ukrainian',
    'ukrainian crossword online',
    'кросворд українською',
    'кросворди онлайн',
    'сканворд українською',
    'krosvord ukrainskoiu',
    'ukrainian crossword for learners',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Ukrainian crossword gives you something a word list never can: real Ukrainian words, clues written the way a Ukrainian setter would write them, and the satisfaction of a filled grid. This page explains what is special about crosswords in Ukrainian, how the site handles letters such as ґ, є, і and ї, and how to make your first кросворд in a few minutes.',
    'Crosswords have long been a fixture of Ukrainian newspapers and puzzle booklets, and the arrow variety, the **сканворд** (skanvord), is just as familiar. Today many people are choosing to do more of their everyday reading in Ukrainian, while learners and families abroad look for practice that feels like play. A crossword sits neatly in both places.',
  ],
  sections: [
    {
      id: 'ukrainian-letters',
      heading: 'The Ukrainian alphabet in the grid',
      blocks: [
        {
          kind: 'p',
          text: 'The grid uses the 33 letters of the Ukrainian alphabet, one letter per square. Four of them are what make Ukrainian look like Ukrainian, and each is a letter of its own, never swapped for a neighbor:',
        },
        {
          kind: 'list',
          items: [
            '**ґ**, the hard g of “ґрунт” (soil), is separate from г.',
            '**є**, as in “єнот” (raccoon), is separate from е.',
            '**і** and **и** are two different letters: “місто” (city) has і, “риба” (fish) has и.',
            '**ї**, as in “їжак” (hedgehog), is separate from і.',
          ],
        },
        {
          kind: 'p',
          text: 'Letters that belong to Russian but not to Ukrainian, such as ы, э, ъ and ё, never appear. The apostrophe does not take a square of its own: it is simply left out of the grid, so “ім’я” (name) is entered as ІМЯ and takes three squares, and “м’ясо” (meat) takes four.',
        },
        {
          kind: 'tip',
          text: 'On a phone, the on-screen keyboard follows the familiar ЙЦУКЕН rows with ї, є and ґ on keys of their own. On a computer still set to English, the keys type Ukrainian letters anyway, following the on-screen layout, so you can play without changing your system keyboard.',
        },
      ],
    },
    {
      id: 'krosvord-and-skanvord',
      heading: 'Кросворд and сканворд: two familiar shapes',
      blocks: [
        {
          kind: 'p',
          text: 'A **кросворд** has numbered squares and two lists of clues, **по горизонталі** (across) and **по вертикалі** (down). A **сканворд** puts each clue in a box inside the grid, with an arrow showing which way the answer runs. Many Ukrainian solvers grew up with both: the classic grid for a long evening, the сканворд for a quick break.',
        },
        {
          kind: 'p',
          text: 'You can make either one here: a [classic crossword](/crossword) with across and down lists, or a [scanword](/scanword) with the clues in the grid. The scanword is especially comfortable on a phone, because the clue is right where you type.',
        },
      ],
    },
    {
      id: 'native-clues',
      heading: 'Why native Ukrainian clues matter',
      blocks: [
        {
          kind: 'p',
          text: 'A crossword translated from another language gives itself away quickly: clues that sound stiff, answers that are not the word a Ukrainian would use, and references nobody in Ukraine would recognize. Here every word and clue is written natively in Ukrainian by an AI model (Google Gemini), never translated. Code, not the model, then builds the grid, checks each answer against the Ukrainian alphabet and its length in squares, and drops anything invalid instead of repairing it.',
        },
        {
          kind: 'compare',
          weak: 'Translated: “Animal” for “їжак”, which fits any animal of the right length.',
          strong: 'Native: “Колючий лісовий звір, що згортається клубком” (a prickly forest animal that curls into a ball).',
        },
        {
          kind: 'p',
          text: 'Answers are mostly everyday nouns in their dictionary form. Each device remembers the words it has already shown, so a new puzzle never repeats one of them, and the [local culture](/topics/local-culture) topic leans on Ukrainian places, food, holidays and traditions.',
        },
      ],
    },
    {
      id: 'who-its-for',
      heading: 'Who it is for: learners, families abroad, teachers',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Learners of Ukrainian.** A small, easy grid builds vocabulary and spelling at the same time; crossings show you at once whether a word has і or и.',
            '**Ukrainians abroad and their children.** A shared link gives everyone the same grid and clues, free and without signing up, so a family in three countries can race through one puzzle.',
            '**Teachers.** Print a puzzle as a PDF, in color or black and white, with a separate answers page for yourself.',
            '**Native speakers.** A medium сканворд on a phone fits a coffee break, and the words never repeat.',
          ],
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to make your first Ukrainian crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Press one of the buttons at the end of this page, or choose Українська in the language menu. Menus, words and clues all switch to Ukrainian.',
            'Choose **Кросворд** for a classic grid or **Сканворд** for clues inside the grid.',
            'Pick a topic, such as **Слова на щодень** (everyday words) for a gentle start, and a size: Малий (9×9), Середній (13×13) or Великий (15×15).',
            'Set the difficulty to Легкий, Середній or Складний, and press create.',
            'Solve in the browser. Check a letter, a word or the whole grid, reveal a letter when you are stuck, and come back later: progress is saved on the device.',
          ],
        },
        {
          kind: 'p',
          text: 'Your first puzzle each month is free, no account needed; after that, one-time credit packs, no subscription, and opening a shared puzzle is always free ([credits](/credits)). The [how to make a crossword](/guides/how-to-make-a-crossword) guide walks through each choice in more detail.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Is there an online crossword in Ukrainian, not Russian?',
      answer:
        'Yes. The Ukrainian version writes its own words and clues in Ukrainian, uses only the Ukrainian alphabet, and is never a translation of the Russian one.',
    },
    {
      question: 'What happens to the apostrophe in words like ім’я?',
      answer:
        'It is left out of the grid, so ім’я is entered as ІМЯ in three squares. Every other letter, including ґ, є, і and ї, keeps its own square.',
    },
    {
      question: 'Can I type Ukrainian letters on an English keyboard?',
      answer:
        'Yes. On a phone the on-screen keyboard is Ukrainian. On a computer set to English, the keys still type Ukrainian letters, following the layout of the on-screen keyboard.',
    },
    {
      question: 'Is a Ukrainian crossword good for learners?',
      answer:
        'Yes. Start with a small, easy puzzle on everyday words. The clues are short, the crossings confirm your spelling, and the check and reveal tools keep you moving.',
    },
    {
      question: 'Can I print a Ukrainian crossword?',
      answer:
        'Yes. Save any puzzle as a PDF in color or black and white, with your letters if you like and a separate page of answers.',
    },
  ],
  related: ['make', 'language-ru', 'language-pl'],
}
