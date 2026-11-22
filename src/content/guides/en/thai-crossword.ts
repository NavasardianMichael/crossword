import type { Guide } from '../../types'

export const thaiCrossword: Guide = {
  key: 'language-th',
  slug: 'thai-crossword',
  title: 'Thai crossword puzzles online: play a crossword written in Thai',
  shortTitle: 'Thai crosswords',
  metaTitle: 'Thai Crossword Puzzles Online, Written in Thai',
  description:
    'Play a Thai crossword online, where tone marks and vowels above or below a letter share its square. Clues written natively in Thai, for every level.',
  searchTerms: [
    'thai crossword',
    'thai crossword puzzle',
    'thai crossword online',
    'crossword in thai',
    'thai crossword for learners',
    'thai word puzzle',
    'ปริศนาอักษรไขว้',
    'อักษรไขว้',
    'pritsana akson khwai',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'In Thai, a crossword is a ปริศนาอักษรไขว้ (pritsanā aksǒn khwǎi), a “crossed-letter riddle”, and it is a favorite of Thai puzzle magazines and newspaper puzzle corners. Thai script poses a fun question for any crossword: tone marks and some vowels sit above or below a consonant, while others stand before or after it. What goes into one square?',
    'This guide explains how a Thai crossword works on this site, which marks share a square, how to type them on the on-screen keyboard, and how learners, heritage speakers and teachers can use Thai crosswords. The button at the end of the page opens the Thai version of the site, where every word, clue and menu is in Thai.',
  ],
  sections: [
    {
      id: 'thai-squares',
      heading: 'What fits in one square of a Thai grid',
      blocks: [
        {
          kind: 'p',
          text: 'A square holds a consonant together with everything stacked on it: a vowel written above or below it, such as ิ, ี, ุ or ู, a tone mark such as ่ or ้, and signs like ็, ์ and ำ. Vowels written in their own space, before or after the consonant, take a square of their own: the leading vowels เ, แ, โ, ใ and ไ, and the following vowels ะ and า.',
        },
        {
          kind: 'list',
          items: [
            'แมว (maeo, “cat”) fills three squares: แ, ม and ว.',
            'ไก่ (kài, “chicken”) fills two: ไ and ก่, the tone mark staying with its consonant.',
            'บ้าน (bâan, “house”) fills three: บ้, า and น.',
            'ช้าง (cháang, “elephant”) fills three: ช้, า and ง.',
            'ปลา (plaa, “fish”) fills three: ป, ล and า.',
          ],
        },
        {
          kind: 'p',
          text: 'Answers are at least two squares long. A word that fits in one square, like น้ำ (náam, “water”), where น, the tone mark and ำ all share a square, will not be an answer on its own, though it can appear inside a longer word.',
        },
        {
          kind: 'tip',
          text: 'When you count an answer, count what sits on the line, not what floats above or below it. Every leading vowel and every า or ะ needs its own square.',
        },
      ],
    },
    {
      id: 'typing-thai',
      heading: 'Typing Thai on the on-screen keyboard',
      blocks: [
        {
          kind: 'p',
          text: 'On a phone or tablet, a Thai keyboard opens under the grid. The consonants come first, from ก ข to อ ฮ in the order of the Thai alphabet, followed by the vowels that take their own square: ะ, า, เ, แ, โ, ใ and ไ. The last row holds the marks that join a square: the vowels above and below a consonant, the tone marks ่ ้ ๊ ๋, and ็, ์, ํ and ำ.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Type in the order Thai is written: a leading vowel comes first. For แมว, tap แ, then ม, then ว.',
            'A tone mark or an upper or lower vowel joins the square you just filled: for บ้าน, tap บ, then ้, then า and น.',
            'If a vowel and a tone mark both sit on one consonant, tap the vowel first and the tone mark second, as on any Thai keyboard.',
          ],
        },
        {
          kind: 'p',
          text: 'On a computer, switch your system keyboard to Thai (Kedmanee is the usual layout) and type as you normally do; marks join the consonant before them. If it is still in English, the keys stand in by position for the letters of the on-screen keyboard, which helps in a pinch.',
        },
      ],
    },
    {
      id: 'thai-clues',
      heading: 'Clues written in Thai, not translated',
      blocks: [
        {
          kind: 'p',
          text: 'The words are everyday Thai, and the clues are written natively in Thai, as short definitions in the voice of a Thai puzzle page rather than English clues run through a translator. Code, not the model, builds the grid and checks every answer: one Thai word, Thai script only, and a length in squares that fits its slot. Anything else is dropped.',
        },
        {
          kind: 'p',
          text: 'Your device also remembers every word it has shown you, so a new puzzle never repeats one. The Local culture topic draws on Thailand’s own places, food, festivals and history, from Songkran to Loy Krathong.',
        },
      ],
    },
    {
      id: 'who-thai',
      heading: 'Who Thai crosswords are for',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Learners of Thai**, especially once you can read the alphabet but still read slowly. A small, easy grid on the Everyday words or Food & drink topic turns reading practice into a game, and placing tone marks in the right square sharpens your spelling.',
            '**Heritage speakers and Thai families abroad**, who speak Thai at home and want children to read it too.',
            '**Expats in Thailand**, who see Thai script every day and want to read more of it.',
            '**Teachers of Thai**, who can share one link with a class so every student opens the same grid. Our [crosswords for teachers](/guides/crosswords-for-teachers) guide has ideas.',
            '**Native speakers**, who can step up to medium and hard grids.',
          ],
        },
      ],
    },
    {
      id: 'start-thai',
      heading: 'How to start a Thai crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Press the button at the end of this page, or choose ไทย in the language menu. The site switches to Thai.',
            'Choose a classic crossword or a [scanword](/guides/scanword-arrowword-puzzles), then a topic, a size and a difficulty.',
            'Solve in the browser, checking or revealing a letter or a word when you are stuck. Your progress is saved on the device.',
            'Share the link: the person who opens it gets the same grid, free and without signing up.',
          ],
        },
        {
          kind: 'p',
          text: 'Each option is explained in [how to make a crossword](/guides/how-to-make-a-crossword). The [Tamil crossword](/guides/tamil-crossword) page shows another script where vowel signs share a square with their consonant.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'What is a crossword called in Thai?',
      answer: 'ปริศนาอักษรไขว้ (pritsanā aksǒn khwǎi), a “crossed-letter riddle”, often shortened to อักษรไขว้.',
    },
    {
      question: 'Do tone marks get their own square?',
      answer:
        'No. A tone mark shares a square with its consonant, as do vowels written above or below it. Vowels written before or after a consonant, such as เ, แ, ไ and า, take their own square.',
    },
    {
      question: 'In what order do I type แ and ม?',
      answer: 'In the order you write them: แ first, then ม. The leading vowel fills its own square.',
    },
    {
      question: 'Is the Thai crossword free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that there are one-time credit packs with no subscription, and opening a shared puzzle is always free. See the [credits page](/credits).',
    },
  ],
  related: ['make', 'teachers', 'language-ta'],
}
