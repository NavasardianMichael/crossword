import type { Guide } from '../../types'

export const japaneseCrossword: Guide = {
  key: 'language-ja',
  slug: 'japanese-crossword',
  title: 'Japanese crossword puzzles online: クロスワード in hiragana, one kana per square',
  shortTitle: 'Japanese crosswords',
  metaTitle: 'Japanese Crossword Puzzles Online in Hiragana',
  description:
    'Play a Japanese crossword online: answers in hiragana, one kana per square, with clues written natively in Japanese. For learners, families and teachers.',
  searchTerms: [
    'japanese crossword',
    'japanese crossword puzzle',
    'crossword in japanese',
    'japanese crossword online',
    'hiragana crossword',
    'kana crossword',
    'japanese crossword for learners',
    'クロスワード',
    'クロスワードパズル',
    'kurosuwaado',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Japanese crossword works differently from an English one, and that is exactly what makes it fun. Answers are written in kana, one syllable per square, and the clues, called **カギ** (kagi, keys), are short Japanese definitions. This page explains how a Japanese crossword, a **クロスワード** (kurosuwādo), fits into a grid, what the site does with katakana and small kana, and how to make your first one.',
    'Crosswords sit comfortably in Japan’s rich puzzle-magazine culture, alongside number crosswords (ナンクロ) and **スケルトン** (skeleton) puzzles, where the words are given and you work out where they go. For learners of Japanese, a kana crossword is one of the friendliest ways to practice reading: every square is a sound you already know.',
  ],
  sections: [
    {
      id: 'kana-in-the-grid',
      heading: 'One kana per square: how Japanese fits the grid',
      blocks: [
        {
          kind: 'p',
          text: 'In a Japanese crossword each square holds one kana, so a word’s length is its number of kana, not letters. “ねこ” (neko, cat) takes two squares, “ともだち” (tomodachi, friend) four. Kanji never appear in the answers, although the clues use them as everyday Japanese does.',
        },
        {
          kind: 'list',
          items: [
            '**Answers are hiragana.** A word usually written in katakana is entered in hiragana: コーヒー (coffee) becomes こーひー in four squares.',
            '**The long-vowel mark ー is a square of its own,** as in こーひー.',
            '**Small kana keep their own square.** ゃ, ゅ, ょ and the small っ each take a square: “でんしゃ” (densha, train) fills four, and “きっぷ” (kippu, ticket) three. Many printed Japanese puzzles write small kana full-size; here they stay small.',
            '**Voiced kana are different letters.** が is not か and ぱ is not は, so the dakuten and handakuten marks matter.',
          ],
        },
        {
          kind: 'tip',
          text: 'On a phone, the on-screen keyboard is a kana table laid out in the familiar あいうえお rows, followed by the voiced kana, the small kana and ー. On a computer, type with your usual Japanese input method.',
        },
      ],
    },
    {
      id: 'japanese-puzzle-tradition',
      heading: 'Tate no kagi, yoko no kagi: how Japanese crosswords read',
      blocks: [
        {
          kind: 'p',
          text: 'A classic Japanese crossword has numbered squares and two lists of keys: **タテのカギ** (tate no kagi, down) and **ヨコのカギ** (yoko no kagi, across). The keys are usually plain, fair definitions rather than wordplay, which suits learners well. Here that is the [classic crossword](/crossword).',
        },
        {
          kind: 'p',
          text: 'The [scanword](/scanword) puts each clue in a box inside the grid, with an arrow pointing to its answer. It is quicker to read on a phone, because the clue is right next to the squares you are filling.',
        },
      ],
    },
    {
      id: 'native-clues',
      heading: 'Why native Japanese clues matter',
      blocks: [
        {
          kind: 'p',
          text: 'A crossword translated from English cannot work in Japanese: the word lengths change completely once they are counted in kana, and a translated clue sounds unnatural. Here every word and clue is written natively in Japanese by an AI model (Google Gemini). Code, not the model, then builds the grid, checks every answer against the kana set and its length in squares, and drops anything invalid rather than repairing it.',
        },
        {
          kind: 'compare',
          weak: 'Translated: “Liquid” for “みず” (water), which fits many answers.',
          strong: 'Native: “喉が渇いたとき飲む液体” (the liquid you drink when you are thirsty), which points to one.',
        },
        {
          kind: 'p',
          text: 'Answers are everyday nouns, and each device remembers the words it has shown, so new puzzles never repeat them. The [local culture](/topics/local-culture) topic draws on Japanese places, food, festivals and customs.',
        },
      ],
    },
    {
      id: 'for-learners',
      heading: 'A Japanese crossword for learners, families and teachers',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Learners of Japanese.** Once you can read kana and some common kanji, a small, easy grid is real reading practice. If a clue’s kanji stops you, the crossing answers often fill the gap.',
            '**Families with Japanese roots abroad.** A shared link gives everyone the same grid and keys, free and without signing up, so children and grandparents can solve together.',
            '**Teachers of Japanese.** Print a puzzle as a PDF with a separate answers page for a kana or vocabulary warm-up; our guide on [crosswords for teachers](/guides/crosswords-for-teachers) has more classroom ideas.',
            '**Native solvers.** A medium scanword fits a train ride, and no word ever repeats.',
          ],
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to make your first Japanese crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Use the buttons at the end of this page, or choose 日本語 in the language menu. The menus, words and clues all switch to Japanese.',
            'Choose **クロスワード** for a classic grid or **スキャンワード** for clues inside the grid.',
            'Pick a topic, such as **日常の言葉** (everyday words), a size, 小, 中 or 大, and a difficulty: 易しい, 普通 or 難しい.',
            'Solve in the browser. Check a square, a word or the whole grid, reveal a kana when you are stuck, and come back later: progress is saved on the device.',
          ],
        },
        {
          kind: 'p',
          text: 'Your first puzzle each month is free, no account needed; after that, one-time credit packs, no subscription, and a shared puzzle is always free to open ([credits](/credits)). If you also read Chinese or Korean, see the [Chinese crossword](/guides/chinese-crossword) and [Korean crossword](/guides/korean-crossword) pages.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Is this the “Japanese crossword” picture puzzle?',
      answer:
        'No. In many countries “Japanese crossword” means a nonogram, a logic puzzle where you shade squares to reveal a picture. This page is about word crosswords in the Japanese language.',
    },
    {
      question: 'Are the answers in kanji, hiragana or katakana?',
      answer:
        'Hiragana, one kana per square. Words usually written in katakana are entered in hiragana, and the long-vowel mark ー keeps its own square. Clues can use kanji.',
    },
    {
      question: 'Do small kana like ゃ and っ take a square?',
      answer: 'Yes. Each small kana is its own square, so でんしゃ takes four squares and きっぷ three.',
    },
    {
      question: 'Can a beginner in Japanese play?',
      answer:
        'If you can read hiragana and some basic kanji, yes. Start with a small, easy grid. The check and reveal tools help when a clue is beyond your level.',
    },
    {
      question: 'Is it free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that you can buy credits once, with no subscription. A puzzle someone shares with you is always free.',
    },
  ],
  related: ['teachers', 'language-zh', 'language-ko'],
}
