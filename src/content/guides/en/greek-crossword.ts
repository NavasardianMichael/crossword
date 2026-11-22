import type { Guide } from '../../types'

export const greekCrossword: Guide = {
  key: 'language-el',
  slug: 'greek-crossword',
  title: 'Greek crossword puzzles online: σταυρόλεξο with clues written in Greek',
  shortTitle: 'Greek crosswords',
  metaTitle: 'Greek Crossword Puzzles Online (Σταυρόλεξο)',
  description:
    'Play a Greek crossword online: σταυρόλεξο and arrow puzzles with words and clues written in Greek, in capitals without accents. For learners and families.',
  searchTerms: [
    'greek crossword',
    'greek crossword puzzle',
    'crossword in greek',
    'greek crossword online',
    'modern greek crossword',
    'σταυρόλεξο',
    'σταυρόλεξα online',
    'stavrolexo',
    'stavrolexa online',
    'greek crossword for learners',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Greek crossword, a **σταυρόλεξο** (stavrólexo), is a natural partner for the Greek alphabet: twenty-four letters, a grid of capitals, and clues that reward both vocabulary and general knowledge. This page explains how crosswords work in modern Greek, what the site does with accents and the final sigma, and how to make your first one in a few minutes.',
    'Crosswords have long been part of Greek newspapers, magazines and holiday puzzle books, and the arrow variety, usually called a **σκανδιναβικό** (Scandinavian), is a favorite for quick solving. Whether you are learning Greek, keeping it up in a family abroad, or teaching it in a community school, a σταυρόλεξο is practice that does not feel like a lesson.',
  ],
  sections: [
    {
      id: 'greek-letters',
      heading: 'Greek letters in the grid: no accents, one sigma',
      blocks: [
        {
          kind: 'p',
          text: 'Greek crosswords are written in capital letters, and in Greek typography capitals written as a whole word carry no accent marks. The grid follows that convention, which makes Greek friendlier to solve than it first looks:',
        },
        {
          kind: 'list',
          items: [
            '**The tonos is dropped.** “σπίτι” (house) is entered as ΣΠΙΤΙ and “μήλο” (apple) as ΜΗΛΟ. You never have to remember where the stress falls to fill a square.',
            '**The diaeresis is dropped too.** ϊ and ϋ become plain Ι and Υ.',
            '**There is one sigma.** The final ς and the ordinary σ are the same letter in the grid, Σ, so “σκύλος” (dog) is ΣΚΥΛΟΣ in six squares.',
            '**One letter, one square.** Combinations such as ου, μπ or ντ are written with two letters and take two squares: “θάλασσα” (sea) fills seven.',
          ],
        },
        {
          kind: 'tip',
          text: 'On a phone, the on-screen keyboard shows the Greek letters in the usual rows, starting ε, ρ, τ, υ. On a computer still set to English, the keys type Greek letters anyway, following that on-screen layout.',
        },
      ],
    },
    {
      id: 'stavrolexo-tradition',
      heading: 'Σταυρόλεξο and σκανδιναβικό: the Greek way to play',
      blocks: [
        {
          kind: 'p',
          text: 'A classic σταυρόλεξο has numbered squares and two lists of clues, **Οριζόντια** (across) and **Κάθετα** (down). Greek clues are usually short definitions, with a fair share of mythology, geography and history on harder puzzles: a culture with this much of it tends to put it in the grid.',
        },
        {
          kind: 'p',
          text: 'The **σκανδιναβικό** places every clue inside the grid, in a box with an arrow pointing to its answer. There is no list to scan, which makes it the quickest shape on a phone. Here you can make a [classic crossword](/crossword) or a [scanword](/scanword), which is the same idea as the σκανδιναβικό.',
        },
      ],
    },
    {
      id: 'native-clues',
      heading: 'Why native Greek clues matter',
      blocks: [
        {
          kind: 'p',
          text: 'A crossword translated from English reads like a translation: the clue is clumsy, the answer is not the word a Greek speaker would choose, and the references come from somewhere else. Here every word and clue is written natively in Greek by an AI model (Google Gemini), never translated. Code, not the model, then builds the grid, checks each answer against the Greek alphabet and its length in squares, and drops anything invalid rather than repairing it.',
        },
        {
          kind: 'compare',
          weak: 'Translated: “Building” for “ναός”, which fits a hundred answers.',
          strong: 'Native: “Κτίριο για τη λατρεία των θεών” (a building for the worship of the gods), which points to one.',
        },
        {
          kind: 'p',
          text: 'Answers are mostly nouns in the nominative singular, the form you would find in a dictionary. Each device remembers the words it has already shown, so new puzzles never repeat them, and the [local culture](/topics/local-culture) topic draws on Greek places, food, festivals and myths.',
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
            '**Learners of modern Greek.** Because accents are dropped in the grid, you can focus on spelling the letters: η, ι, υ, ει and οι sound alike, and the crossings tell you which one a word uses.',
            '**Greek families abroad.** A shared link gives everyone the same σταυρόλεξο, free and without signing up, so grandparents and grandchildren can solve together from different countries.',
            '**Teachers of Greek.** Print a puzzle as a PDF with a separate answers page and use it as a vocabulary warm-up.',
            '**Keen solvers.** A large, hard puzzle with rarer words, and no word repeated from one puzzle to the next.',
          ],
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to make your first Greek crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Use the buttons at the end of this page, or choose Ελληνικά in the language menu. Menus, words and clues all switch to Greek.',
            'Choose **Σταυρόλεξο** for a classic grid or **Σκανδιναβικό** for clues inside the grid.',
            'Pick a topic, such as **Καθημερινές λέξεις** (everyday words) for a gentle start.',
            'Choose a size, Μικρό (9×9), Μεσαίο (13×13) or Μεγάλο (15×15), and a difficulty: Εύκολο, Μέτριο or Δύσκολο.',
            'Solve in the browser, check a letter or a word when unsure, and come back later: progress is saved on the device.',
          ],
        },
        {
          kind: 'p',
          text: 'Your first puzzle each month is free, no account needed; after that, one-time credit packs with no subscription, and opening a shared puzzle is always free ([credits](/credits)). For a step-by-step walk through every option, read [how to make a crossword](/guides/how-to-make-a-crossword).',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Do Greek crosswords use accents?',
      answer:
        'No. Like most Greek puzzles, the grid is written in capitals without the tonos or the diaeresis, so ά is simply Α and ϊ is Ι.',
    },
    {
      question: 'What happens to the final sigma ς?',
      answer: 'It is written as an ordinary Σ, the same letter as σ inside a word. ΣΚΥΛΟΣ ends with the same Σ it starts with.',
    },
    {
      question: 'Can I type Greek on an English keyboard?',
      answer:
        'Yes. On a phone the on-screen keyboard is Greek. On a computer set to English, the keys still type Greek letters, following the on-screen layout.',
    },
    {
      question: 'Is a Greek crossword good for learning Greek?',
      answer:
        'Yes, once you can read the alphabet. Start with a small, easy puzzle on everyday words: the clues are short, and the crossings show you which of the many ways to write the sound “i” a word uses.',
    },
    {
      question: 'Is it ancient or modern Greek?',
      answer:
        'Modern Greek. The words and clues are the everyday language of Greece today, though mythology and history appear as clue material, especially on the local culture topic.',
    },
  ],
  related: ['make', 'language-hy', 'language-ro'],
}
