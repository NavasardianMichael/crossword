import type { Guide } from '../../types'

export const filipinoCrossword: Guide = {
  key: 'language-fil',
  slug: 'filipino-crossword',
  title: 'Filipino crossword puzzles online: krosword in Tagalog-based Filipino',
  shortTitle: 'Filipino crosswords',
  metaTitle: 'Filipino Crossword Puzzles Online (Tagalog Krosword)',
  description:
    'Play a Filipino crossword online: krosword with words and clues written natively in Filipino, Tagalog-based. For learners, families abroad and classes.',
  searchTerms: [
    'filipino crossword',
    'tagalog crossword',
    'filipino crossword puzzle',
    'crossword in tagalog',
    'crossword in filipino',
    'tagalog crossword online',
    'krosword tagalog',
    'krusigrama',
    'palaisipan',
    'filipino crossword for kids',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Filipino crossword, a **krosword** or **krusigrama**, is a fun way to read and think in Filipino: real Tagalog-based words, clues written the way a Filipino would say them, and none of the stiffness of a translation. This page explains what is special about crosswords in Filipino, how the site treats letters like ñ and ng, and how to make your first one in a few minutes.',
    'Filipinos love a **palaisipan**, a puzzle, and have a long tradition of **bugtong**, the folk riddles that children trade at home and in school. A crossword sits right next to them. Whether you are learning Tagalog, raising children abroad who you hope will read Filipino, or teaching the subject, this is a friendly place to begin.',
  ],
  sections: [
    {
      id: 'filipino-letters-in-the-grid',
      heading: 'How Filipino words fit the grid: ñ, ng and hyphens',
      blocks: [
        {
          kind: 'p',
          text: 'The modern Filipino alphabet has 28 letters, adding ñ and ng to the 26 Latin ones. In the grid, though, every square holds a plain letter from a to z, which keeps typing simple on any keyboard:',
        },
        {
          kind: 'list',
          items: [
            '**ng takes two squares,** one for n and one for g. “ilog” (river) fills four, and “alingawngaw” (echo) eleven.',
            '**ñ is written n,** so a word with ñ goes in with a plain n.',
            '**One word, no hyphen.** Words written with a hyphen, such as “pag-asa” (hope), are not answers; single words such as “mangga”, “tulay” (bridge) or “bugtong” are.',
            '**Filipino, not English.** The clues and answers are Filipino throughout; English loanwords are not left in the clue as a shortcut.',
          ],
        },
        {
          kind: 'tip',
          text: 'Any keyboard works: on a phone the on-screen keyboard is plain QWERTY, and on a computer you simply type.',
        },
      ],
    },
    {
      id: 'krosword-tradition',
      heading: 'Pahalang and pababa: how Filipino crosswords read',
      blocks: [
        {
          kind: 'p',
          text: 'A classic Filipino crossword has numbered squares and two lists of clues, **pahalang** (across) and **pababa** (down). Good Filipino clues read like a fair bugtong: a clear hint with exactly one answer. On this site that shape is the [classic crossword](/crossword).',
        },
        {
          kind: 'p',
          text: 'The [scanword](/scanword) puts each clue in a box inside the grid, with an arrow pointing to where its answer runs. It is quick to read and comfortable on a phone, so it suits a break at work or a ride on the jeepney.',
        },
      ],
    },
    {
      id: 'native-clues',
      heading: 'Why native Filipino clues matter',
      blocks: [
        {
          kind: 'p',
          text: 'A crossword translated from English shows it at once: the clues sound stiff and the answers are not the words people actually use. Here every word and clue is written natively in Filipino by an AI model (Google Gemini), never translated from English. Code, not the model, then builds the grid, checks every answer against the alphabet and its length in squares, and drops anything invalid rather than patching it.',
        },
        {
          kind: 'compare',
          weak: 'Translated: “Fruit” for “mangga”, which fits plenty of answers.',
          strong: 'Native: “Prutas na hinog at matamis sa puno” (a fruit that ripens sweet on the tree), which points to one.',
        },
        {
          kind: 'p',
          text: 'Each device remembers the words it has already shown, so new puzzles never repeat them. The [local culture](/topics/local-culture) topic draws on Philippine places, food, fiestas and folk tales.',
        },
      ],
    },
    {
      id: 'who-its-for',
      heading: 'Who plays Filipino crosswords here',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Learners of Tagalog and Filipino.** A small, easy grid on everyday words is gentle reading practice, and the spelling is regular enough to guess from sound.',
            '**Filipino families abroad.** Children who understand Filipino but rarely read it get a reason to, and a shared link gives the whole family the same puzzle, free and without an account.',
            '**Teachers of Filipino.** Print a puzzle as a PDF with a separate answers page for a vocabulary review; our guide on [crosswords for teachers](/guides/crosswords-for-teachers) has more classroom ideas.',
            '**Puzzle fans.** A large, hard krosword with rarer, deeper Filipino words.',
          ],
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to make your first Filipino crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Use the buttons at the end of this page, or choose Filipino in the language menu. Menus, words and clues all switch to Filipino.',
            'Choose **Krusigrama** for a classic grid or **Skanword** for clues inside the grid.',
            'Pick a topic, such as **Pang-araw-araw na salita** (everyday words), a size, Maliit (9×9), Katamtaman (13×13) or Malaki (15×15), and a difficulty: Madali, Katamtaman or Mahirap.',
            'Solve in the browser. Check a letter, a word or the whole grid, reveal a letter when stuck, and come back later: progress is saved on the device.',
          ],
        },
        {
          kind: 'p',
          text: 'Your first puzzle each month is free, no account needed; after that, one-time credit packs, no subscription, and a shared puzzle is always free to open ([credits](/credits)). For neighbors in the region, see the [Indonesian crossword](/guides/indonesian-crossword) and [Malay crossword](/guides/malay-crossword) pages.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Is it Tagalog or Filipino?',
      answer:
        'Filipino, the national language, which is based on Tagalog. If you search for a Tagalog crossword, this is the one: everyday Tagalog words, written in standard Filipino spelling.',
    },
    {
      question: 'How are ng and ñ handled?',
      answer: 'ng is written as two letters in two squares, and ñ is written as a plain n, so every square holds a letter from a to z.',
    },
    {
      question: 'Is it good for children learning Filipino?',
      answer:
        'Yes. A small, easy puzzle on everyday words suits young readers, and the reveal tool helps when a clue is new. Teachers and parents can print it with a separate answers page.',
    },
    {
      question: 'Are the clues translated from English?',
      answer: 'No. Every word and clue is written natively in Filipino, then checked by code. Invalid words are dropped, never patched.',
    },
    {
      question: 'Is it free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that you can buy credits once, with no subscription. A shared puzzle is always free to open.',
    },
  ],
  related: ['teachers', 'language-id', 'language-ms'],
}
