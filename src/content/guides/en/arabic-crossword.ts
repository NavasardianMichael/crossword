import type { Guide } from '../../types'

export const arabicCrossword: Guide = {
  key: 'language-ar',
  slug: 'arabic-crossword',
  title: 'Arabic crossword puzzles online: كلمات متقاطعة for learners and native speakers',
  shortTitle: 'Arabic crosswords',
  metaTitle: 'Arabic Crossword Puzzles Online, Written in Arabic',
  description:
    'Play an Arabic crossword online: right-to-left grids, clues written natively in Modern Standard Arabic, and an Arabic keyboard on your phone. For learners too.',
  searchTerms: [
    'arabic crossword',
    'arabic crossword puzzle',
    'arabic crossword online',
    'crossword in arabic',
    'arabic crossword for learners',
    'arabic crossword puzzle printable',
    'كلمات متقاطعة',
    'kalimat mutaqatia',
    'arabic word puzzle',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'An Arabic crossword is called كلمات متقاطعة (kalimāt mutaqāṭiʿa), literally “crossing words”, and it is one of the most familiar puzzles in the Arab world: a grid of squares, a list of definitions, and the quiet satisfaction of fitting the last word in. Playing one online is a little different from playing in English, because Arabic runs from right to left and its letters change shape as they join.',
    'This guide explains how Arabic crosswords work on this site, what happens to hamza, short vowels and the other details of Arabic spelling, and how learners, heritage speakers and teachers can get the most out of them. The button at the end of the page opens the Arabic version of the site, where every word, every clue and every menu is in Arabic.',
  ],
  sections: [
    {
      id: 'right-to-left-grid',
      heading: 'A grid that reads from right to left',
      blocks: [
        {
          kind: 'p',
          text: 'In the Arabic version, the whole grid is mirrored, just as an Arabic newspaper would print it. An Across answer starts at the right edge of its run of squares and continues to the left, and in a scanword the small arrows beside the clues point the Arabic way too. Down answers still run from top to bottom, so nothing changes there.',
        },
        {
          kind: 'p',
          text: 'Each square holds exactly one letter, and on its own a letter is drawn in its standalone form. So the word كتاب (kitāb, “book”) fills four squares, ك ت ا ب, and you read it by joining the letters in your head. After a few puzzles this becomes second nature, and it is excellent practice for recognizing letters whatever their position in a word.',
        },
        {
          kind: 'tip',
          text: 'If you are new to Arabic script, say each letter’s name as you type it. Linking the sound to the standalone shape is the fastest way to stop mixing up look-alikes such as ب, ت and ث.',
        },
      ],
    },
    {
      id: 'hamza-and-vowels',
      heading: 'Hamza, short vowels and the letters that count',
      blocks: [
        {
          kind: 'p',
          text: 'Arabic crosswords follow a few spelling conventions, and the site applies them in code before a word ever reaches the grid. The words are Modern Standard Arabic, the Arabic of books and newspapers, written without short-vowel marks, exactly as a printed crossword shows them.',
        },
        {
          kind: 'list',
          items: [
            '**Short vowels and other marks are left out.** Fatḥa, kasra, ḍamma, sukūn, tanwīn and shadda are never typed. A doubled consonant marked with shadda takes a single square, so مدرّسة (mudarrisa, “teacher”) is written مدرسة, five squares.',
            '**Every alef is a plain ا.** أ, إ, آ and ٱ are all entered as ا, so أسد (asad, “lion”) goes into the grid as اسد.',
            '**Hamza on a seat folds into the seat.** ؤ is written و and ئ is written ي. A hamza standing on its own, ء, keeps its own square, as at the end of سماء (samāʾ, “sky”).',
            '**Tāʾ marbūṭa and alef maqṣūra are letters of their own.** ة is not the same as ه, and ى is not the same as ي: مستشفى (mustashfā, “hospital”) ends in ى, and the check tool will tell you if you type ي instead.',
            '**The article ال is usually left off.** Answers are mostly common nouns without al-; the article stays only when it is part of a name, such as القاهرة (al-Qāhira, Cairo).',
          ],
        },
        {
          kind: 'p',
          text: 'Words that break these rules are dropped by code rather than patched, so an Arabic answer in the grid is always one word, in the 28 letters of the alphabet plus ة, ى and ء.',
        },
      ],
    },
    {
      id: 'typing-arabic',
      heading: 'Typing Arabic on a phone or a computer',
      blocks: [
        {
          kind: 'p',
          text: 'On a phone or tablet, the site shows its own Arabic keyboard under the grid, so your system keyboard never covers the puzzle. Its keys are in alphabetical order, from ا, ب, ت to و and ي, followed by ة, ى and ء. Learners often find this easier than a standard Arabic layout, because a letter is where the alphabet says it should be.',
        },
        {
          kind: 'p',
          text: 'On a computer, switch your system keyboard to Arabic and type as usual. If you type أ or إ out of habit, it is accepted as ا. If your keyboard is still set to English, the keys stand in for the letters of the on-screen layout by position, which is handy in a pinch, though a real Arabic layout is more comfortable for a whole puzzle.',
        },
      ],
    },
    {
      id: 'who-plays',
      heading: 'Who Arabic crosswords are for',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Learners of Arabic.** A small, easy crossword turns vocabulary review into a game. Because clues are written in Arabic, you also practice reading definitions, which is closer to real reading than a word list.',
            '**Heritage speakers.** Many people grew up speaking a dialect at home but read little Modern Standard Arabic. Crosswords are a gentle way to build reading speed with words you already half know.',
            '**Teachers and parents.** Share one link with a whole class: every student opens the same grid and clues, free and without signing up, on a phone or a school computer. Our guide on [crosswords for teachers](/guides/crosswords-for-teachers) has more ideas.',
            '**Native speakers.** Medium and hard puzzles lean on wider vocabulary, geography and culture, and nothing repeats: every new puzzle leaves out the words your device has already seen.',
          ],
        },
        {
          kind: 'p',
          text: 'The clues are not English clues run through a translator. They are written natively in Arabic, in the definitional style of an Arabic crossword, so they read naturally to a native eye. The Local culture topic leans on the Arab world’s own cities, food, traditions and history.',
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to start an Arabic crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Press the button at the end of this page, or choose العربية in the language menu in the header or footer. The whole site switches to Arabic.',
            'Choose a classic crossword or a scanword. If you are not sure which, our guide to [scanwords and arrowwords](/guides/scanword-arrowword-puzzles) explains the difference.',
            'Pick a topic, a size and a difficulty. Learners do best with a small grid at the easy level.',
            'Solve in the browser. Check a letter, a word or the whole grid, and reveal a letter when you are stuck. Your progress is saved on the device.',
            'Share a link with a friend or a study partner: they get the very same grid, free.',
          ],
        },
        {
          kind: 'tip',
          text: 'Turn on “check as I type” for your first few Arabic puzzles. It catches ي typed for ى, or ه for ة, the moment it happens, which teaches the difference faster than any rule.',
        },
        {
          kind: 'p',
          text: 'The steps are the same as for any puzzle on the site; [how to make a crossword](/guides/how-to-make-a-crossword) walks through each choice in more detail. If you also read Persian or Urdu, the [Persian crossword](/guides/persian-crossword) page explains how that script’s extra letters are handled.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Does the Arabic crossword grid really go from right to left?',
      answer:
        'Yes. In the Arabic version the grid is mirrored, so Across answers start on the right and run to the left, and scanword arrows point the Arabic way. Down answers run from top to bottom as usual.',
    },
    {
      question: 'Do I need to type hamza or short vowels?',
      answer:
        'No. Short vowels, shadda and tanwīn are never typed, and أ, إ and آ are all written as a plain ا. Hamza on a seat folds into the seat (ؤ to و, ئ to ي). Only a standalone ء has a square of its own.',
    },
    {
      question: 'Which Arabic is used: dialect or standard?',
      answer:
        'Modern Standard Arabic, the shared written language of newspapers and books across the Arab world. That makes the puzzles readable wherever you learned your Arabic.',
    },
    {
      question: 'Is the Arabic crossword free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that there are one-time credit packs, no subscription, and opening a puzzle someone shared with you is always free. See the [credits page](/credits).',
    },
    {
      question: 'Can I play Arabic crosswords offline?',
      answer:
        'Yes, once a puzzle is open. Install the site as an app from your browser, and puzzles you have already opened keep working without a connection, with your letters saved on the device.',
    },
  ],
  related: ['make', 'teachers', 'language-fa', 'language-he'],
}
