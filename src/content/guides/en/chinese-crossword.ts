import type { Guide } from '../../types'

export const chineseCrossword: Guide = {
  key: 'language-zh',
  slug: 'chinese-crossword',
  title: 'Chinese crossword puzzles online: 填字游戏 with one character per square',
  shortTitle: 'Chinese crosswords',
  metaTitle: 'Chinese Crossword Puzzles Online (填字游戏)',
  description:
    'Play a Chinese crossword online: one Chinese character per square, words and clues written natively in simplified Chinese. For learners and teachers.',
  searchTerms: [
    'chinese crossword',
    'chinese crossword puzzle',
    'crossword in chinese',
    'chinese character crossword',
    'mandarin crossword',
    'simplified chinese crossword',
    'chinese crossword for learners',
    '填字游戏',
    '中文填字',
    'tianzi youxi',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Chinese crossword turns the usual idea of a crossword around. Instead of letters, each square holds a whole Chinese character, and words cross where they share one. This page explains how a Chinese crossword, a **填字游戏** (tiánzì yóuxì, “fill in the characters game”), works, how the site handles typing characters, and how to make your first one in a few minutes.',
    'Word games built on characters have a long history in China, from riddles to idiom puzzles, and the crossword fits right in. For learners of Mandarin, it is a playful way to see how characters combine into words. For heritage speakers, it is a reason to read a little Chinese every day.',
  ],
  sections: [
    {
      id: 'characters-in-the-grid',
      heading: 'One character per square: how Chinese fits the grid',
      blocks: [
        {
          kind: 'p',
          text: 'Every square holds one Chinese character, and a word’s length is its number of characters. Most answers are two-character words, the backbone of modern Chinese: “大象” (dàxiàng, elephant), “春天” (chūntiān, spring), “足球” (zúqiú, football). Two words cross where they share a character, so “今天” (jīntiān, today) and “天空” (tiānkōng, sky) can meet on 天.',
        },
        {
          kind: 'list',
          items: [
            '**Simplified characters.** The puzzles use simplified Chinese and mainland vocabulary, as written in mainland China.',
            '**No pinyin in the grid.** Answers are characters only, with no pinyin, letters, digits or spaces. The clues are written in Chinese too.',
            '**Characters, not strokes.** You never fill in a radical or half a character: a square is complete or empty.',
          ],
        },
        {
          kind: 'tip',
          text: 'On a phone, the on-screen keyboard offers a starter set of very common characters, such as 人, 水, 山 and 天. For everything else, type with your usual pinyin or handwriting input: the puzzle accepts any Chinese character.',
        },
      ],
    },
    {
      id: 'chinese-puzzle-tradition',
      heading: 'How Chinese crosswords read: across, down and arrows',
      blocks: [
        {
          kind: 'p',
          text: 'A classic Chinese crossword has numbered squares and two lists of clues, **横向** (héngxiàng, across) and **纵向** (zòngxiàng, down). Because a crossing shares a whole character, solving feels a little like a chain: one word you know gives you the first or last character of the next. On this site that shape is the [classic crossword](/crossword).',
        },
        {
          kind: 'p',
          text: 'The arrow version, **箭头填字** in the site’s Chinese menus, puts each clue in a box inside the grid with an arrow pointing to its answer. It is the [scanword](/scanword), and it is especially comfortable on a phone. Fans of **成语** (chéngyǔ, four-character idioms) will recognize the same pleasure as idiom-chain puzzles, though here the answers are everyday words.',
        },
      ],
    },
    {
      id: 'native-clues',
      heading: 'Why native Chinese clues matter',
      blocks: [
        {
          kind: 'p',
          text: 'A crossword cannot be translated into Chinese: the words change, their lengths change, and an English clue turned into Chinese sounds like a textbook. Here every word and clue is written natively in Chinese by an AI model (Google Gemini). Code, not the model, then builds the grid, checks that every answer is made of Chinese characters and fits its squares, and drops anything invalid rather than repairing it.',
        },
        {
          kind: 'compare',
          weak: 'Translated: “Animal” for “大象”, which fits any two-character animal.',
          strong: 'Native: “陆地上鼻子最长的动物” (the land animal with the longest nose), which points to one.',
        },
        {
          kind: 'p',
          text: 'Each device remembers the words it has already shown, so new puzzles never repeat them. The [local culture](/topics/local-culture) topic draws on Chinese places, food, festivals and customs.',
        },
      ],
    },
    {
      id: 'for-learners',
      heading: 'Chinese crosswords for learners, heritage speakers and teachers',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Learners of Mandarin.** A small, easy grid shows how the same character turns up in different words, which is one of the fastest ways to grow vocabulary. When a clue is hard, the crossing characters help.',
            '**Heritage speakers.** If you speak Chinese at home but read less than you would like, a crossword is short, daily reading with a goal.',
            '**Teachers.** Print a puzzle as a PDF with a separate answers page; a 9×9 grid makes a good vocabulary review at the end of a unit.',
            '**Native speakers.** A medium arrow puzzle fits a commute, and no word ever repeats.',
          ],
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to make your first Chinese crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Use the buttons at the end of this page, or choose 中文 in the language menu. Menus, words and clues all switch to Chinese.',
            'Choose **填字** for a classic grid or **箭头填字** for clues inside the grid.',
            'Pick a topic, such as **日常词语** (everyday words), a size, 小, 中 or 大, and a difficulty: 容易, 中等 or 较难.',
            'Solve in the browser. Check a square, a word or the whole grid, reveal a character when you are stuck, and come back later: progress is saved on the device.',
          ],
        },
        {
          kind: 'p',
          text: 'Your first puzzle each month is free, no account needed; after that, one-time credit packs, no subscription, and a shared puzzle is always free to open ([credits](/credits)). Read [how to make a crossword](/guides/how-to-make-a-crossword) for every option in detail, or compare with the [Japanese crossword](/guides/japanese-crossword), which counts kana instead of characters.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'How does a crossword work in Chinese?',
      answer:
        'Each square holds one Chinese character. Words cross where they share a character, so 今天 and 天空 can meet on 天. Most answers are two-character words.',
    },
    {
      question: 'Simplified or traditional characters?',
      answer: 'Simplified characters, with the vocabulary used in mainland China.',
    },
    {
      question: 'How do I type Chinese characters in the grid?',
      answer:
        'Use your device’s pinyin or handwriting input; the puzzle accepts any Chinese character. On a phone, the on-screen keys also offer a starter set of common characters.',
    },
    {
      question: 'Is a Chinese crossword good for learners?',
      answer:
        'Yes, once you know a few hundred characters. Start with a small, easy puzzle on everyday words; the crossings and the reveal tool help when a clue is beyond your level.',
    },
    {
      question: 'Is it free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that you can buy credits once, with no subscription. A shared puzzle is always free to open.',
    },
  ],
  related: ['teachers', 'language-ja', 'language-ko'],
}
