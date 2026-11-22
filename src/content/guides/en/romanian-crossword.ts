import type { Guide } from '../../types'

export const romanianCrossword: Guide = {
  key: 'language-ro',
  slug: 'romanian-crossword',
  title: 'Romanian crossword puzzles online: rebus and integrame with native clues',
  shortTitle: 'Romanian crosswords',
  metaTitle: 'Romanian Crossword Puzzles Online (Rebus, Integrame)',
  description:
    'Play a Romanian crossword online: rebus and arrow-style integrame with words and clues written in Romanian, keeping ă, â, î, ș and ț. For learners and fans.',
  searchTerms: [
    'romanian crossword',
    'romanian crossword puzzle',
    'crossword in romanian',
    'romanian crossword online',
    'rebus online',
    'integrame online',
    'cuvinte încrucișate',
    'cuvinte incrucisate online',
    'rebus scandinav',
    'romanian crossword for learners',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Romanian crossword is a small daily dose of the language: real Romanian words, clues written the way a Romanian setter would write them, and the diacritics that give Romanian its character. This page explains what is special about crosswords in Romanian, how the site handles ă, â, î, ș and ț, and how to make your first puzzle in a few minutes.',
    'In Romania a crossword is usually just called a **rebus**, and the person who loves them a rebusist. The arrow variety, where the definitions sit inside the grid, is known as an **integramă** or a **rebus scandinav**, and both fill puzzle magazines across the country. If you are learning Romanian, keeping the language alive in a family abroad, or simply miss the rebus from home, this is a good way in.',
  ],
  sections: [
    {
      id: 'romanian-letters',
      heading: 'Romanian diacritics in the grid',
      blocks: [
        {
          kind: 'p',
          text: 'The grid uses the 31 letters of the Romanian alphabet, one letter per square. The five letters with diacritics are letters in their own right, not decorated versions of others, so an answer is only correct when they are right:',
        },
        {
          kind: 'list',
          items: [
            '**ă**, as in “casă” (house) and “măr” (apple).',
            '**â** and **î**, the same sound written two ways: â inside a word, as in “câine” (dog), and î at the start or end, as in “înger” (angel). In the grid they are two different letters.',
            '**ș** and **ț**, as in “șarpe” (snake) and “țară” (country), written with a comma below.',
          ],
        },
        {
          kind: 'p',
          text: 'Older fonts and keyboards often produce ş and ţ with a cedilla instead of a comma. The site accepts those and turns them into the correct ș and ț, so you never lose a square to an encoding quirk.',
        },
        {
          kind: 'tip',
          text: 'On a phone, the on-screen keyboard is QWERTY with an extra row for ă, â, î, ș and ț. If a crossing will not fit, look at the â/î pair first: it is the easiest place to slip.',
        },
      ],
    },
    {
      id: 'rebus-and-integrame',
      heading: 'Rebus, careu and integramă: how Romanians play',
      blocks: [
        {
          kind: 'p',
          text: 'A classic Romanian rebus is a **careu**, a square grid with numbered rows and columns, solved **orizontal** (across) and **vertical** (down). Each clue is a **definiție**: a short, exact description of the answer, sometimes with a playful twist on harder puzzles.',
        },
        {
          kind: 'p',
          text: 'An **integramă** hides every definition inside the grid, in a box with an arrow pointing to its answer. You read and write in the same place, which is why it is so comfortable on a phone. On this site the first shape is the [classic crossword](/crossword), with across and down lists, and the second is the [scanword](/scanword), which works just like an integramă.',
        },
      ],
    },
    {
      id: 'native-clues',
      heading: 'Why the clues are written in Romanian, not translated',
      blocks: [
        {
          kind: 'p',
          text: 'Translated crosswords tend to feel foreign in every sense: the clue sounds stiff, the answer is not the word a Romanian would pick, and the cultural references point somewhere else. Here every word and clue is written natively in Romanian by an AI model (Google Gemini), never translated from English. Code, not the model, then builds the grid, checks each answer against the Romanian alphabet and its length in squares, and drops anything invalid instead of patching it.',
        },
        {
          kind: 'compare',
          weak: 'Translated: “Sweet bread” for “cozonac”, which could be a dozen things.',
          strong: 'Native: “Aluat dulce, împletit, de sărbătoare” (a sweet, braided dough for the holidays), which a Romanian solver recognizes at once.',
        },
        {
          kind: 'p',
          text: 'Answers are mostly nouns in their dictionary form, singular unless the word lives only in the plural, like “sarmale”. Every device remembers the words it has shown, so new puzzles never repeat them, and the [local culture](/topics/local-culture) topic draws on Romanian places, dishes, customs and holidays.',
        },
      ],
    },
    {
      id: 'who-its-for',
      heading: 'Who plays Romanian crosswords here',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Learners of Romanian.** If you already speak Italian, Spanish or French, many words will look familiar, and the crossings teach you where the diacritics go.',
            '**Romanians and Moldovans abroad.** A rebus in Romanian is an easy family ritual, and a shared link gives everyone the same grid, free and without an account.',
            '**Teachers.** Print a puzzle as a PDF with a separate page of answers; it makes a calm start or end to a lesson.',
            '**Rebusiști.** A large, hard puzzle with rarer words, and no repeats from one puzzle to the next.',
          ],
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to make your first Romanian crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Use the buttons at the end of this page, or pick Română in the language menu. Menus, words and clues all switch to Romanian.',
            'Choose **Cuvinte încrucișate** for a classic grid or **Rebus scandinav** for definitions inside the grid.',
            'Pick a topic, such as **Cuvinte de zi cu zi** (everyday words) for a first try.',
            'Choose a size, Mic (9×9), Mediu (13×13) or Mare (15×15), and a difficulty: Ușor, Mediu or Greu.',
            'Solve in the browser, check a letter or a word when unsure, and come back later: your progress is saved on the device.',
          ],
        },
        {
          kind: 'p',
          text: 'Your first puzzle each month is free, no account needed. After that there are one-time credit packs, with no subscription, and a shared puzzle is always free to open; the [credits](/credits) page has the details. For Hungarian, which also keeps all its accents, see the [Hungarian crossword](/guides/hungarian-crossword) page.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Do I have to type ă, â, î, ș and ț?',
      answer:
        'Yes. They are separate letters of the Romanian alphabet, and each takes one square. On a phone they have their own keys on the on-screen keyboard; on a computer, use a Romanian keyboard layout.',
    },
    {
      question: 'What is the difference between a rebus and an integramă?',
      answer:
        'A rebus usually means a classic crossword with numbered rows and columns. An integramă puts the definitions inside the grid with arrows, like a scanword. You can make both here.',
    },
    {
      question: 'Is a Romanian crossword good for learning Romanian?',
      answer:
        'Yes. Start small and easy, on everyday words. The definitions are short, the crossings confirm your spelling, and you can reveal a letter when you are stuck.',
    },
    {
      question: 'Are the clues translated?',
      answer:
        'No. Every word and definition is written natively in Romanian, then checked by code. Invalid words are dropped, never patched.',
    },
    {
      question: 'Can I print a Romanian crossword for a class?',
      answer:
        'Yes. Save it as a PDF, in color or black and white, with an optional separate answers page.',
    },
  ],
  related: ['make', 'language-hu', 'language-it'],
}
