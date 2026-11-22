import type { Guide } from '../../types'

export const vietnameseCrossword: Guide = {
  key: 'language-vi',
  slug: 'vietnamese-crossword',
  title: 'Vietnamese crossword puzzles online: ô chữ with every tone mark kept',
  shortTitle: 'Vietnamese crosswords',
  metaTitle: 'Vietnamese Crossword Puzzles Online (Ô Chữ)',
  description:
    'Play a Vietnamese crossword online: ô chữ with words and clues written in Vietnamese and every tone mark kept. For learners, families and teachers.',
  searchTerms: [
    'vietnamese crossword',
    'vietnamese crossword puzzle',
    'crossword in vietnamese',
    'vietnamese crossword online',
    'ô chữ',
    'o chu online',
    'giải ô chữ',
    'tro choi o chu',
    'vietnamese crossword for learners',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Vietnamese crossword is easy to get wrong: many word puzzles strip the tones and leave you guessing which word was meant. Here an **ô chữ** keeps every mark, so “mạ”, “má” and “mà” stay three different words, as they are in real Vietnamese. This page explains how Vietnamese fits a crossword grid, how to type the tones, and how to make your first ô chữ in a few minutes.',
    'Many Vietnamese people first met the ô chữ at school, where a teacher draws rows of empty squares, the answers in the rows (**hàng ngang**) are found one by one, and a highlighted column spells out a hidden keyword (**từ khóa**). The crossword here is the full version of that game, and it suits learners, families abroad and anyone who simply enjoys words.',
  ],
  sections: [
    {
      id: 'tones-in-the-grid',
      heading: 'Tone marks and letters: how Vietnamese fills the grid',
      blocks: [
        {
          kind: 'p',
          text: 'Each square holds one letter, with all its marks. A vowel carrying a tone, such as ế, ậ or ữ, is one square, not a letter plus a mark. So “tiếng” (language, sound) takes five squares: t, i, ế, n, g. A wrong tone is a wrong letter, and the check tool will say so.',
        },
        {
          kind: 'list',
          items: [
            '**Every tone counts.** a, à, ả, ã, á and ạ are six different letters in the grid, and so are their ă and â cousins.',
            '**đ is its own letter,** separate from d: “đường” (road) and “dương” (as in “đại dương”, ocean) never cross on the same square.',
            '**Pairs such as ng, nh, ch, th, tr and ph take two squares,** one for each written letter: “nhà” (house) fills three.',
            '**An answer is one written word.** Because Vietnamese writes each syllable apart, most answers are a single syllable, like “nhà”, “cơm” (cooked rice) or “nắng” (sunshine). Phrases with a space, such as “Hà Nội”, are not answers.',
          ],
        },
        {
          kind: 'tip',
          text: 'On a phone, the on-screen keyboard has a key for every letter of the Vietnamese alphabet in every tone, laid out in alphabetical order. You tap ế directly; there is no second step for the tone.',
        },
      ],
    },
    {
      id: 'o-chu-tradition',
      heading: 'Ô chữ and ô chữ mũi tên: two shapes of the same game',
      blocks: [
        {
          kind: 'p',
          text: 'A classic ô chữ has numbered squares and two lists of clues, across (**hàng ngang**) and down (**hàng dọc**). Vietnamese clues are usually short definitions or a familiar everyday scene, and because the answers are short, a grid fills quickly and crossings come thick and fast. Here that shape is the [classic crossword](/crossword).',
        },
        {
          kind: 'p',
          text: 'The **ô chữ mũi tên** (arrow crossword) puts each clue in a box inside the grid, with an arrow pointing to its answer. It is the [scanword](/scanword), and it is the easiest shape to solve on a phone.',
        },
      ],
    },
    {
      id: 'native-clues',
      heading: 'Why native Vietnamese clues matter',
      blocks: [
        {
          kind: 'p',
          text: 'A crossword translated from English breaks in Vietnamese: word lengths change, tones disappear, and the clues read like a dictionary. Here every word and clue is written natively in Vietnamese by an AI model (Google Gemini), never translated. Code, not the model, then builds the grid, checks every answer letter by letter against the Vietnamese alphabet, tones included, and drops anything invalid rather than repairing it.',
        },
        {
          kind: 'compare',
          weak: 'Translated: “Hat” for “nón”, which could be several words.',
          strong: 'Native: “Mũ lá đội khi ra đồng” (the leaf hat worn out in the rice fields), which every Vietnamese reader recognizes.',
        },
        {
          kind: 'p',
          text: 'Each device remembers the words it has already shown, so new puzzles never repeat them. The [local culture](/topics/local-culture) topic draws on Vietnamese places, dishes, festivals and customs.',
        },
      ],
    },
    {
      id: 'who-its-for',
      heading: 'Who plays Vietnamese crosswords here',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Learners of Vietnamese.** Tones are the hardest part of the language for many learners, and a crossword makes you write each one. The crossings tell you at once whether a word is má or mà.',
            '**Vietnamese families abroad.** Children who speak Vietnamese at home but rarely write it get a reason to spell with tones, and a shared link lets the whole family solve the same grid for free.',
            '**Teachers.** Print a puzzle as a PDF, in color or black and white, with a separate answers page for yourself.',
            '**Native speakers.** A medium arrow crossword fits a coffee break, and the words never repeat.',
          ],
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to make your first Vietnamese crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Use the buttons at the end of this page, or choose Tiếng Việt in the language menu. Menus, words and clues all switch to Vietnamese.',
            'Choose **Ô chữ** for a classic grid or **Ô chữ mũi tên** for clues inside the grid.',
            'Pick a topic, such as **Chữ đời thường** (everyday words), a size, Nhỏ, Vừa or Lớn, and a difficulty: Dễ, Vừa or Khó.',
            'Solve in the browser. Check a letter, a word or the whole grid, reveal a letter when you are stuck, and come back later: progress is saved on the device.',
          ],
        },
        {
          kind: 'p',
          text: 'Your first puzzle each month is free, no account needed; after that, one-time credit packs, no subscription, and a shared puzzle is always free to open ([credits](/credits)). For each choice in more detail, read [how to make a crossword](/guides/how-to-make-a-crossword); for a neighbor in Southeast Asia, see the [Indonesian crossword](/guides/indonesian-crossword).',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Does the Vietnamese crossword keep the tone marks?',
      answer:
        'Yes. Every tone and every vowel mark is kept, and a letter with its tone is one square. á and à are different letters, so a wrong tone counts as a wrong letter.',
    },
    {
      question: 'How do I type tones on the crossword keyboard?',
      answer:
        'On the on-screen keyboard every letter has a key in every tone, so you tap ế or ữ directly, with no extra step.',
    },
    {
      question: 'Why are most answers one syllable?',
      answer:
        'Vietnamese writes each syllable as a separate word, and a crossword answer cannot contain a space. So answers are single written words such as nhà, cơm or đường.',
    },
    {
      question: 'Is it good for learning Vietnamese?',
      answer:
        'Yes, especially for tones. Start with a small, easy puzzle on everyday words; the crossings confirm each letter and the reveal tool helps when you are stuck.',
    },
    {
      question: 'Is it free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that you can buy credits once, with no subscription. Opening a shared puzzle is always free.',
    },
  ],
  related: ['make', 'language-th', 'language-id'],
}
