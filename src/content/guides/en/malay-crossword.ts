import type { Guide } from '../../types'

export const malayCrossword: Guide = {
  key: 'language-ms',
  slug: 'malay-crossword',
  title: 'Malay crossword puzzles online: teka silang kata in Malaysian Malay',
  shortTitle: 'Malay crosswords',
  metaTitle: 'Malay Crossword Puzzles Online (Teka Silang Kata)',
  description:
    'Play a Malay crossword online: teka silang kata with words and clues written natively in Malaysian Malay, not Indonesian. For students, learners and families.',
  searchTerms: [
    'malay crossword',
    'malay crossword puzzle',
    'crossword in malay',
    'bahasa melayu crossword',
    'teka silang kata',
    'teka silang kata online',
    'silang kata bahasa melayu',
    'malay crossword for students',
    'malaysian crossword',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Malay crossword is a relaxed way to spend time with Bahasa Melayu: the alphabet is plain Latin, the spelling is regular, and the clues are written the way a Malaysian puzzle setter would write them. This page explains what is special about crosswords in Malay, how the site treats words, and how to make your first **teka silang kata** in a few minutes.',
    'Malaysians grow up with crosswords in newspapers, school workbooks and Bahasa Melayu lessons, where a silang kata is a classic way to revise vocabulary. Whether you are a student, an adult learning Malay, or part of a Malaysian family abroad, a crossword on your phone is practice that feels like a game.',
  ],
  sections: [
    {
      id: 'malay-words-in-the-grid',
      heading: 'How Malay words fit the grid',
      blocks: [
        {
          kind: 'p',
          text: 'Malay uses the 26 letters of the Latin alphabet with no accents, so every square holds a plain a to z, and words are spelled much as they sound. A few rules decide which words make good answers:',
        },
        {
          kind: 'list',
          items: [
            '**One letter per square.** Pairs such as ng, ny and sy take two squares: “bunga” (flower) fills five.',
            '**One word, no hyphen.** Reduplicated words such as “rama-rama” (butterfly) are written with a hyphen, so they are not answers; single words such as “basikal” (bicycle) or “pawagam” (cinema) are.',
            '**Malaysian, not Indonesian.** The words follow Malaysian spelling and usage: “tingkap” rather than jendela for a window, “kerusi” rather than kursi for a chair, “epal” rather than apel for an apple.',
          ],
        },
        {
          kind: 'tip',
          text: 'Any keyboard works: on a phone the on-screen keyboard is plain QWERTY, and on a computer you simply type.',
        },
      ],
    },
    {
      id: 'silang-kata-tradition',
      heading: 'Melintang and menegak: how Malay crosswords read',
      blocks: [
        {
          kind: 'p',
          text: 'A classic Malay crossword has numbered squares and two lists of clues, **melintang** (across) and **menegak** (down). The clues, called **petunjuk**, are usually short definitions or a familiar everyday picture, which suits both students and casual solvers. On this site that shape is the [classic crossword](/crossword).',
        },
        {
          kind: 'p',
          text: 'The arrow version, which the site’s Malay menus call **teka petak**, puts each clue in a box inside the grid with an arrow pointing to its answer. It is the [scanword](/scanword), and it is the quickest shape to play on a phone.',
        },
      ],
    },
    {
      id: 'native-clues',
      heading: 'Why native Malay clues matter',
      blocks: [
        {
          kind: 'p',
          text: 'A crossword translated from English, or borrowed from Indonesian, feels off to a Malaysian reader: the clue is stiff, the answer is not the everyday word, and the spelling may be wrong. Here every word and clue is written natively in Malaysian Malay by an AI model (Google Gemini), never translated. Code, not the model, then builds the grid, checks every answer against the alphabet and its length in squares, and drops anything invalid rather than patching it.',
        },
        {
          kind: 'compare',
          weak: 'Translated: “Vehicle” for “basikal”, which fits many answers.',
          strong: 'Native: “Kenderaan roda dua yang dikayuh dengan kaki” (a two-wheeled vehicle you pedal), which points to one.',
        },
        {
          kind: 'p',
          text: 'Each device remembers the words it has already shown, so new puzzles never repeat them. The [local culture](/topics/local-culture) topic draws on Malaysian places, food, festivals and customs, from satay to the kampung.',
        },
      ],
    },
    {
      id: 'who-its-for',
      heading: 'Who plays Malay crosswords here',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Students.** A crossword on the week’s vocabulary is an easy revision habit, and a small, easy grid takes ten to fifteen minutes.',
            '**Adults learning Malay.** If you live or work in Malaysia, everyday words such as tingkap, kerusi and pawagam are exactly what you need, and the crossings help you spell them.',
            '**Malaysian families abroad.** A shared link gives everyone the same puzzle, free and without an account.',
            '**Teachers.** Print a puzzle as a PDF with a separate answers page; our guide on [crosswords for teachers](/guides/crosswords-for-teachers) has more ideas for class.',
          ],
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to make your first Malay crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Use the buttons at the end of this page, or choose Bahasa Melayu in the language menu. Menus, words and clues all switch to Malay.',
            'Choose **Teka silang kata** for a classic grid or **Teka petak** for clues inside the grid.',
            'Pick a topic, such as **Perkataan harian** (everyday words), a size, Kecil (9×9), Sederhana (13×13) or Besar (15×15), and a difficulty: Mudah, Sederhana or Sukar.',
            'Solve in the browser. Check a letter, a word or the whole grid, reveal a letter when stuck, and come back later: progress is saved on the device.',
          ],
        },
        {
          kind: 'p',
          text: 'Your first puzzle each month is free, no account needed; after that, one-time credit packs, no subscription, and a shared puzzle is always free to open ([credits](/credits)). For the Indonesian version, with its own words and spelling, see the [Indonesian crossword](/guides/indonesian-crossword) page.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Is it Malaysian Malay or Indonesian?',
      answer:
        'Malaysian Malay, with Malaysian spelling and vocabulary. Indonesian has its own version: switch the site’s language to Bahasa Indonesia.',
    },
    {
      question: 'What are melintang and menegak?',
      answer: 'They are the Malay words for across and down, the two lists of clues in a classic crossword.',
    },
    {
      question: 'Is it suitable for school students?',
      answer:
        'Yes. A small, easy puzzle on everyday words suits younger students, and a teacher can print it as a PDF with a separate answers page.',
    },
    {
      question: 'Why are words like rama-rama never answers?',
      answer: 'An answer must be one unbroken word, and reduplicated words are written with a hyphen. Single words fill the grid instead.',
    },
    {
      question: 'Is it free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that you can buy credits once, with no subscription. A shared puzzle is always free to open.',
    },
  ],
  related: ['make', 'language-id', 'language-fil'],
}
