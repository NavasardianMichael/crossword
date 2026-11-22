import type { Guide } from '../../types'

export const tamilCrossword: Guide = {
  key: 'language-ta',
  slug: 'tamil-crossword',
  title: 'Tamil crossword puzzles online: play a kurukkezhuthu puthir in Tamil',
  shortTitle: 'Tamil crosswords',
  metaTitle: 'Tamil Crossword Online: Kurukkezhuthu Puthir',
  description:
    'Play a Tamil crossword online: a kurukkezhuthu puthir where each square holds one Tamil letter, with clues written natively in Tamil. For every level.',
  searchTerms: [
    'tamil crossword',
    'tamil crossword puzzle',
    'tamil crossword online',
    'crossword in tamil',
    'tamil crossword for kids',
    'kurukkezhuthu puthir',
    'kurukkeluthu puthir',
    'குறுக்கெழுத்துப் புதிர்',
    'தமிழ் குறுக்கெழுத்து',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Tamil crossword is a குறுக்கெழுத்துப் புதிர் (kuṟukkeḻuttup putir), literally a “cross-letter puzzle”, and Tamil weeklies and newspapers have printed them for generations. If you grew up in Chennai, Jaffna or Madurai, you have probably watched someone in the family fill one in with a pen.',
    'This guide explains how a Tamil crossword works on this site, why a square holds a whole Tamil letter, how to type uyirmei letters and the pulli on the on-screen keyboard, and who gets the most from it. The button at the end of the page opens the Tamil version of the site, with every word, clue and menu in Tamil.',
  ],
  sections: [
    {
      id: 'one-ezhuthu',
      heading: 'One square, one Tamil letter',
      blocks: [
        {
          kind: 'p',
          text: 'Tamil grammar counts letters (எழுத்து, ezhuthu) in a way that suits a crossword perfectly. A vowel-consonant letter (உயிர்மெய், uyirmei) like கா or கி is one letter, and a pure consonant with its dot (மெய், mei) like க் is one letter too. The grid follows exactly this count: each square holds one Tamil letter, vowel sign or pulli included.',
        },
        {
          kind: 'list',
          items: [
            'மரம் (maram, “tree”) fills three squares: ம, ர and ம்.',
            'வீடு (vīṭu, “house”) fills two: வீ and டு.',
            'அம்மா (ammā, “mother”) fills three: அ, ம் and மா.',
            'தமிழ் (Tamiḻ) fills three: த, மி and ழ்.',
            'நீர் (nīr, “water”) fills two: நீ and ர்.',
          ],
        },
        {
          kind: 'p',
          text: 'So a Tamil answer is as long as a Tamil reader would say it is. Answers are at least two squares long, which means a single letter such as பூ (pū, “flower”) will not appear on its own, though it may well show up inside a longer word.',
        },
      ],
    },
    {
      id: 'typing-tamil',
      heading: 'Typing Tamil on the on-screen keyboard',
      blocks: [
        {
          kind: 'p',
          text: 'On a phone or tablet, a Tamil keyboard opens below the grid. First come the twelve vowels அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ, then the eighteen consonants from க to ன, with the Grantha letters ஜ, ஷ, ஸ and ஹ. The last row holds the vowel signs ா ி ீ ு ூ ெ ே ை ொ ோ ௌ and the pulli ்.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Tap a consonant: it fills the current square.',
            'Tap a vowel sign and it joins the same square: க then ா gives கா.',
            'Tap the pulli ் for a pure consonant: ம then ் gives ம்.',
            'Signs drawn before or around a letter are still tapped after it: க then ெ gives கெ, and க then ொ gives கொ.',
          ],
        },
        {
          kind: 'tip',
          text: 'The commonest slip is tapping ெ or ை first because that is where it sits on the page. Always start with the consonant; “check as I type” will flag anything out of order.',
        },
        {
          kind: 'p',
          text: 'On a computer, switch your system keyboard to a Tamil layout, such as Tamil99 or a phonetic one, and type as usual; signs join the consonant before them.',
        },
      ],
    },
    {
      id: 'tamil-clues',
      heading: 'Clues written in Tamil, for Tamil Nadu and Sri Lanka',
      blocks: [
        {
          kind: 'p',
          text: 'The answers are everyday Tamil words familiar on both sides of the Palk Strait, and the clues are written natively in Tamil, as short definitions in the voice of a Tamil puzzle page. They are not English clues translated into Tamil, so they read naturally to a Tamil speaker.',
        },
        {
          kind: 'p',
          text: 'Code, not the model, builds the grid and checks every answer: a single Tamil word, Tamil script only, and a length in letters that fits its slot. Anything that fails is dropped. The Local culture topic draws on the Tamil world’s own places, food, festivals and literature, from Pongal to the Thirukkural.',
        },
      ],
    },
    {
      id: 'who-tamil',
      heading: 'Who plays Tamil crosswords online',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Children learning to read Tamil**, at home or in a weekend Tamil school. A small, easy grid on the Animals or Everyday words topic is a good first puzzle.',
            '**The Tamil diaspora**, in Singapore, Malaysia, Canada, Britain, the Gulf and beyond, who want the next generation to read the script, not only speak it.',
            '**Adult learners**, for whom short clues are friendlier reading practice than a whole article.',
            '**Teachers**, who can share one link with the class so every pupil opens the same grid. See [crosswords for teachers](/guides/crosswords-for-teachers) for ideas.',
            '**Seasoned solvers**, who can move on to medium and hard grids. A device never sees the same answer twice.',
          ],
        },
      ],
    },
    {
      id: 'start-tamil',
      heading: 'How to start a Tamil crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Press the button at the end of this page, or choose தமிழ் in the language menu. The site switches to Tamil.',
            'Choose a classic crossword or a scanword, then a topic, a size and a difficulty.',
            'Solve in the browser, checking or revealing a letter or a word when you need to; progress is saved on your device.',
            'Share the link: the person who opens it gets the same kurukkezhuthu puthir, free and without signing up.',
          ],
        },
        {
          kind: 'p',
          text: 'Each option is explained in [how to make a crossword](/guides/how-to-make-a-crossword). For another script where vowel signs share a square with their consonant, see the [Hindi crossword](/guides/hindi-crossword) or the [Thai crossword](/guides/thai-crossword).',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'What is a crossword called in Tamil?',
      answer: 'குறுக்கெழுத்துப் புதிர் (kuṟukkeḻuttup putir), a “cross-letter puzzle”, often shortened to குறுக்கெழுத்து.',
    },
    {
      question: 'Why is மரம் three squares long?',
      answer: 'Each square holds one Tamil letter, as Tamil grammar counts them: ம, ர and ம். The pulli stays in the same square as its consonant.',
    },
    {
      question: 'How do I type கொ or கை?',
      answer: 'Tap க first, then the vowel sign ொ or ை. The sign joins the same square, even though it is drawn on both sides of the letter or before it.',
    },
    {
      question: 'Can I type Tamil in English letters?',
      answer:
        'No. The grid takes Tamil script only. On a phone, the built-in Tamil keyboard has every letter and sign, so there is nothing to install.',
    },
  ],
  related: ['make', 'teachers', 'language-hi', 'language-th'],
}
