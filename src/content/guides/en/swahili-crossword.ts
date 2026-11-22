import type { Guide } from '../../types'

export const swahiliCrossword: Guide = {
  key: 'language-sw',
  slug: 'swahili-crossword',
  title: 'Swahili crossword puzzles online: play a chemshabongo in Kiswahili',
  shortTitle: 'Swahili crosswords',
  metaTitle: 'Swahili Crossword Puzzles Online: Chemshabongo',
  description:
    'Play a Swahili crossword online: a chemshabongo with clues written natively in Kiswahili, how the grid handles ch and ny, and tips for learners.',
  searchTerms: [
    'swahili crossword',
    'swahili crossword puzzle',
    'swahili crossword online',
    'crossword in swahili',
    'kiswahili crossword',
    'swahili crossword for learners',
    'chemshabongo',
    'chemsha bongo',
    'chemshabongo ya kiswahili',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'In Kiswahili, a crossword is a chemshabongo, from chemsha (“boil”) and bongo (“brain”): a puzzle that makes your brain boil. East African newspapers and school magazines have long carried them, and the name has stuck for word puzzles of every kind.',
    'This guide explains how a Swahili crossword works on this site, what happens to sounds written with two letters, why a few words never appear, and how learners, teachers and Swahili speakers abroad can use a chemshabongo. The button at the end of the page opens the Swahili version of the site, where every word, clue and menu is in Kiswahili.',
  ],
  sections: [
    {
      id: 'latin-letters',
      heading: 'A Latin alphabet, one letter per square',
      blocks: [
        {
          kind: 'p',
          text: 'Kiswahili is written in the Latin alphabet, so a Swahili grid looks like an English one: one letter per square, typed on a familiar QWERTY keyboard. The on-screen keyboard on a phone is the same QWERTY layout, and on a computer you can type straight away, with no special layout to install.',
        },
        {
          kind: 'p',
          text: 'Sounds written with two letters stay two letters in the grid. The ch of chakula (“food”), the sh of shule (“school”), the ny of nyumba (“house”), and dh, th and gh all take one square per letter. So chakula is seven squares long, c-h-a-k-u-l-a, exactly as it is spelled.',
        },
        {
          kind: 'tip',
          text: 'When a crossing gives you an h, think of the digraphs first: ch, sh, th, dh and gh. In Kiswahili, an h after a consonant is very often one of them.',
        },
      ],
    },
    {
      id: 'swahili-words',
      heading: 'What Swahili answers look like',
      blocks: [
        {
          kind: 'p',
          text: 'The answers are standard East African Kiswahili, as written in Kenya and Tanzania, and nouns keep their class prefix: mtoto (“child”), not toto; kitabu (“book”), not tabu. That is good news for learners, because the prefix is often the first clue to the word.',
        },
        {
          kind: 'list',
          items: [
            '**Noun classes help you guess.** m- and wa- often mean people (mtoto, watoto), ki- and vi- often mean things (kitabu, vitabu). If a clue is about a person and the first square is m, you are probably on the right track.',
            '**Words with an apostrophe are left out.** A square holds letters only, so words written with ng’, such as ng’ombe (“cow”), never appear as answers.',
            '**One word, no hyphen.** Answers are single words; phrases and English loans where Kiswahili has its own word are avoided.',
            '**Accents do not matter.** If you type an accented vowel, it goes in as the plain letter.',
          ],
        },
        {
          kind: 'p',
          text: 'Kiswahili has borrowed many words from Arabic, such as kitabu from كتاب (kitāb) and safari from سفر (safar). If you also play in Arabic, the [Arabic crossword](/guides/arabic-crossword) page shows how differently those words look in their original script.',
        },
      ],
    },
    {
      id: 'native-clues',
      heading: 'Clues written in Kiswahili, not translated',
      blocks: [
        {
          kind: 'p',
          text: 'Every clue is written natively in Kiswahili, as a short definition in the style of an East African chemshabongo, not an English clue translated word for word. Code, not the model, builds the grid and checks that every answer is one word in the a–z alphabet and fits the length of its slot; anything else is dropped rather than patched.',
        },
        {
          kind: 'p',
          text: 'The twelve topics include animals, food and drink, geography and Local culture, which in the Swahili version draws on East Africa’s own places, food, music and history, from Kilimanjaro to the Swahili coast.',
        },
      ],
    },
    {
      id: 'who-swahili',
      heading: 'Who a Swahili crossword is for',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Learners of Kiswahili**, at university, in a language course or before a trip to East Africa. A small, easy grid on the Animals or Everyday words topic, with answers like simba (“lion”), maji (“water”) and rafiki (“friend”), is vocabulary practice that feels like play.',
            '**Heritage speakers** in Britain, the United States, the Gulf and beyond, who speak Kiswahili at home and want to read and spell it with confidence.',
            '**Teachers**, in East Africa or abroad. Share one link and every student opens the same grid, or print it as a PDF with a separate answers page. See [crosswords for teachers](/guides/crosswords-for-teachers).',
            '**Native speakers**, who can step up to medium and hard grids. Nothing repeats: each device leaves out the words it has already seen.',
          ],
        },
      ],
    },
    {
      id: 'start-swahili',
      heading: 'How to start a Swahili crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Press the button at the end of this page, or choose Kiswahili in the language menu. The whole site switches to Kiswahili.',
            'Choose a classic crossword or a [scanword](/guides/scanword-arrowword-puzzles), then a topic, a size and a difficulty.',
            'Solve in the browser, checking or revealing a letter, a word or the whole grid when you need to. Progress is saved on the device.',
            'Share the link with a friend, who gets the same chemshabongo free and without signing up, or save it as a PDF, in color or black and white.',
          ],
        },
        {
          kind: 'p',
          text: 'Every option is explained in [how to make a crossword](/guides/how-to-make-a-crossword), and the [credits page](/credits) explains what is free.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'What is a crossword called in Swahili?',
      answer: 'A chemshabongo, from chemsha (“boil”) and bongo (“brain”). It is also written as two words, chemsha bongo.',
    },
    {
      question: 'Do ch, sh and ny take one square or two?',
      answer: 'Two. Each letter has its own square, so chakula is seven squares and nyumba is six.',
    },
    {
      question: 'Why do I never see ng’ombe in a puzzle?',
      answer:
        'Because a square can only hold a letter, and ng’ombe is written with an apostrophe. Words like it are left out, and other words are chosen instead.',
    },
    {
      question: 'Can I print a Swahili crossword for my class?',
      answer:
        'Yes. Save the puzzle as a PDF, in color or black and white, and add a separate answers page if you like. Students can also play the same puzzle on their phones from a shared link.',
    },
    {
      question: 'Is the Swahili crossword free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that there are one-time credit packs, no subscription, and opening a shared puzzle is always free.',
    },
  ],
  related: ['make', 'teachers', 'language-ar'],
}
