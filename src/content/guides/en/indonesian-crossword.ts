import type { Guide } from '../../types'

export const indonesianCrossword: Guide = {
  key: 'language-id',
  slug: 'indonesian-crossword',
  title: 'Indonesian crossword puzzles online: teka-teki silang (TTS) with native clues',
  shortTitle: 'Indonesian crosswords',
  metaTitle: 'Indonesian Crossword Puzzles Online (Teka-Teki Silang)',
  description:
    'Play an Indonesian crossword online: teka-teki silang (TTS) with words and clues written in Bahasa Indonesia, not Malay. For learners and TTS fans.',
  searchTerms: [
    'indonesian crossword',
    'indonesian crossword puzzle',
    'crossword in indonesian',
    'bahasa indonesia crossword',
    'teka teki silang',
    'teka-teki silang online',
    'tts online',
    'tts bahasa indonesia',
    'indonesian crossword for learners',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'An Indonesian crossword is one of the friendliest ways into Bahasa Indonesia: the alphabet is plain Latin, the spelling is regular, and the clues are written the way an Indonesian puzzle setter would write them. This page explains what is special about crosswords in Indonesian, how the site treats words, and how to make your first **teka-teki silang** in a few minutes.',
    'In Indonesia the crossword is simply **TTS**, short for teka-teki silang, and TTS booklets are a familiar sight at newsstands and on long bus and train journeys. Whether you are learning Indonesian, keeping it alive in a family abroad, or just want a TTS on your phone without a pencil, this is a good place to start.',
  ],
  sections: [
    {
      id: 'indonesian-words-in-the-grid',
      heading: 'How Indonesian words fit the grid',
      blocks: [
        {
          kind: 'p',
          text: 'Indonesian uses the 26 letters of the Latin alphabet with no accents, so every square holds a plain a to z. Spelling is close to how words sound, which makes Indonesian one of the easiest languages to solve as a learner. A few rules shape which words can be answers:',
        },
        {
          kind: 'list',
          items: [
            '**One letter per square.** Pairs such as ng, ny and sy take two squares: “nyanyi” (sing) fills six.',
            '**One word, no hyphen.** Reduplicated words like “kupu-kupu” (butterfly) or “gado-gado” need a hyphen, so they are not answers; single words such as “mercusuar” (lighthouse) or “gerhana” (eclipse) are.',
            '**Indonesian, not Malay.** The words are Bahasa Indonesia as used in Indonesia: “mobil” rather than kereta for a car, “kulkas” rather than peti sejuk for a fridge.',
          ],
        },
        {
          kind: 'tip',
          text: 'Any keyboard works: on a phone the on-screen keyboard is plain QWERTY, and on a computer you simply type. If an accented letter slips in from a loanword, the site reads it as the plain letter.',
        },
      ],
    },
    {
      id: 'tts-tradition',
      heading: 'Mendatar and menurun: how Indonesians play TTS',
      blocks: [
        {
          kind: 'p',
          text: 'A classic TTS has numbered squares and two lists of clues, **mendatar** (across) and **menurun** (down). Indonesian clues, called **pertanyaan** or petunjuk, tend to be short definitions or synonyms, and seasoned solvers know the favorite answers that turn up again and again in printed booklets. Here each device remembers the words it has shown, so nothing repeats. On this site the classic shape is the [classic crossword](/crossword).',
        },
        {
          kind: 'p',
          text: 'The arrow version, which the site’s Indonesian menus call **Silang Swedia**, puts each clue in a box inside the grid with an arrow pointing to its answer. It is the [scanword](/scanword), and it is the quickest shape on a phone.',
        },
      ],
    },
    {
      id: 'native-clues',
      heading: 'Why native Indonesian clues matter',
      blocks: [
        {
          kind: 'p',
          text: 'A TTS translated from English reads like a textbook exercise: stiff clues, answers that are not the word an Indonesian would use, and references from somewhere else. Here every word and clue is written natively in Indonesian by an AI model (Google Gemini), never translated. Code, not the model, then builds the grid, checks every answer against the alphabet and its length in squares, and drops anything invalid rather than patching it.',
        },
        {
          kind: 'compare',
          weak: 'Translated: “Building” for “mercusuar”, which fits a dozen answers.',
          strong: 'Native: “Menara yang menuntun kapal pada malam hari” (the tower that guides ships at night), which points to one.',
        },
        {
          kind: 'p',
          text: 'The [local culture](/topics/local-culture) topic draws on Indonesian islands, cities, dishes, crafts and traditions, which makes it a favorite with Indonesians abroad.',
        },
      ],
    },
    {
      id: 'who-its-for',
      heading: 'Who plays Indonesian crosswords here',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Learners of Indonesian.** Plain letters and regular spelling mean you can focus on vocabulary. A small, easy grid on everyday words is a good weekly habit alongside a course.',
            '**Indonesians abroad and their children.** A shared link gives the whole family the same TTS, free and without an account.',
            '**Teachers.** Print a puzzle as a PDF with a separate answers page; our guide on [crosswords for teachers](/guides/crosswords-for-teachers) has more classroom ideas.',
            '**TTS fans.** A large, hard puzzle with rarer words, on a phone instead of a booklet.',
          ],
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to make your first Indonesian crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Use the buttons at the end of this page, or choose Bahasa Indonesia in the language menu. Menus, words and clues all switch to Indonesian.',
            'Choose **Teka-teki silang** for a classic grid or **Silang Swedia** for clues inside the grid.',
            'Pick a topic, such as **Kata sehari-hari** (everyday words), a size, Kecil (9×9), Sedang (13×13) or Besar (15×15), and a difficulty: Mudah, Sedang or Sulit.',
            'Solve in the browser. Check a letter, a word or the whole grid, reveal a letter when stuck, and come back later: progress is saved on the device.',
          ],
        },
        {
          kind: 'p',
          text: 'Your first puzzle each month is free, no account needed; after that, one-time credit packs, no subscription, and a shared puzzle is always free to open ([credits](/credits)). Malay is a close cousin with its own vocabulary: see the [Malay crossword](/guides/malay-crossword) page for the Malaysian version.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'What does TTS mean?',
      answer: 'TTS stands for teka-teki silang, the Indonesian name for a crossword puzzle. Across is mendatar and down is menurun.',
    },
    {
      question: 'Is it Indonesian or Malay?',
      answer:
        'Indonesian. The words and clues are Bahasa Indonesia as used in Indonesia. Malaysian Malay has its own version: switch the site’s language to Bahasa Melayu.',
    },
    {
      question: 'Why are words like kupu-kupu never answers?',
      answer:
        'A crossword answer must be one unbroken word, and reduplicated words are written with a hyphen. Single words fill the grid instead.',
    },
    {
      question: 'Is an Indonesian crossword good for learners?',
      answer:
        'Yes. The alphabet has no accents and spelling follows sound, so a small, easy puzzle is approachable early on. The check and reveal tools help when a clue is new to you.',
    },
    {
      question: 'Is it free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that you can buy credits once, with no subscription. A shared puzzle is always free to open.',
    },
  ],
  related: ['make', 'language-ms', 'language-fil'],
}
