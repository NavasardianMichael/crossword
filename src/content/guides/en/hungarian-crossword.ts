import type { Guide } from '../../types'

export const hungarianCrossword: Guide = {
  key: 'language-hu',
  slug: 'hungarian-crossword',
  title: 'Hungarian crossword puzzles online: keresztrejtvény with native Hungarian clues',
  shortTitle: 'Hungarian crosswords',
  metaTitle: 'Hungarian Crossword Puzzles Online (Keresztrejtvény)',
  description:
    'Play a Hungarian crossword online: keresztrejtvény and skandináv rejtvény with clues written in Hungarian and every accent kept. For learners and families.',
  searchTerms: [
    'hungarian crossword',
    'hungarian crossword puzzle',
    'crossword in hungarian',
    'hungarian crossword online',
    'keresztrejtvény',
    'keresztrejtveny online',
    'skandináv rejtvény',
    'skandinav rejtveny',
    'hungarian crossword for learners',
    'magyar keresztrejtvény',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Hungarian crossword is one of the most enjoyable ways to spend time with the language: every answer is a real Hungarian word, every clue is written the way a Hungarian puzzle setter would phrase it, and the accents on á, é, ő and ű count. This page explains what makes crosswords in Hungarian different, how this site handles the letters, and how to make your first keresztrejtvény in a couple of minutes.',
    'In Hungary the crossword is an everyday habit rather than a niche hobby. Newsstands carry puzzle weeklies such as Füles, and the arrow variety, the **skandináv rejtvény**, is at least as popular as the classic grid. Whether you remember a grandparent filling one in at the kitchen table, or you are learning Hungarian and want practice that does not feel like homework, a crossword is a good place to start.',
  ],
  sections: [
    {
      id: 'letters-and-accents',
      heading: 'How Hungarian letters fit in the grid',
      blocks: [
        {
          kind: 'p',
          text: 'Hungarian spelling leans on its accents, and so does the grid. The long vowels á, é, í, ó and ú, the umlauted ö and ü, and the long ő and ű are all letters in their own right: **a** and **á** are different letters, and so are **o**, **ó**, **ö** and **ő**. Answers are checked with their accents, so “kör” (circle) and “kor” (age) are two different words, exactly as they are in print.',
        },
        {
          kind: 'list',
          items: [
            '**One written character, one square.** The Hungarian alphabet counts cs, gy, ly, ny, sz, ty, zs and dzs as single letters, but in the grid each character they are written with takes a square of its own: “szó” (word) fills three squares and “gyümölcs” (fruit) fills eight.',
            '**Accents are typed, not guessed.** On a phone or tablet, the on-screen keyboard is QWERTY with an extra row for á, é, í, ó, ö, ő, ú, ü and ű, so a long vowel is one tap away.',
            '**Rare letters stay rare.** Q, w, x and y belong to the alphabet, but w turns up only in borrowed words such as “watt”, and y mostly as part of gy, ly, ny and ty.',
          ],
        },
        {
          kind: 'tip',
          text: 'When a crossing refuses to fit, check the length of the vowel first. An answer that needs ő will not accept ö, and most early mistakes in a Hungarian grid are exactly that.',
        },
      ],
    },
    {
      id: 'hungarian-puzzle-tradition',
      heading: 'Keresztrejtvény and skandináv rejtvény: the Hungarian tradition',
      blocks: [
        {
          kind: 'p',
          text: 'A classic Hungarian crossword, the **keresztrejtvény**, has numbered squares and two lists of definitions, **vízszintes** (across) and **függőleges** (down). The clue itself is called a **meghatározás**, a definition, and that is what Hungarian setters write: a short, exact description of the answer rather than a pun. Many printed puzzles also hide a phrase, the **megfejtés**, spelled out in marked squares, which readers send in for a prize draw.',
        },
        {
          kind: 'p',
          text: 'The **skandináv rejtvény** puts the definitions inside the grid, each in its own box with an arrow pointing to where the answer runs. It reads quickly, needs no clue list, and suits a phone screen well. Both shapes are here: a [classic crossword](/crossword) with across and down lists, and a [scanword](/scanword), which is the same idea as the skandináv rejtvény.',
        },
      ],
    },
    {
      id: 'native-clues',
      heading: 'Why the clues are written in Hungarian, not translated',
      blocks: [
        {
          kind: 'p',
          text: 'A translated crossword rarely works. Hungarian builds meaning with suffixes, so a clue carried over from English often points to a word form that is not the answer, and a fact that is famous in one country can be unknown in another. Here every word and clue is written natively in Hungarian by an AI model (Google Gemini), never translated from English. Code, not the model, then builds the grid, checks every answer against the Hungarian alphabet and its length in squares, and drops anything that does not fit rather than patching it.',
        },
        {
          kind: 'compare',
          weak: 'Translated: “A fruit” for “alma”, which fits a dozen answers of the same length.',
          strong: 'Native: “Gyümölcs, amit ősszel szednek a fáról” (a fruit picked from the tree in autumn), which points to one.',
        },
        {
          kind: 'p',
          text: 'Answers are mostly nouns in their dictionary form, the way a Hungarian setter would choose them, so the grid teaches words you will actually meet. Each device also remembers the words it has already shown, and a new puzzle never repeats one of them.',
        },
      ],
    },
    {
      id: 'who-its-for',
      heading: 'Who plays Hungarian crosswords here',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Learners of Hungarian.** A small, easy grid with everyday words is gentle reading practice, and the crossing letters help you spell long vowels correctly without looking anything up.',
            '**Hungarians abroad and their families.** A puzzle in Hungarian is a small, regular way to keep the language alive at home, and a shared link lets a grandparent and a grandchild solve the same grid in different cities.',
            '**Teachers of Hungarian.** Print a puzzle as a PDF with a separate answers page and use it as a warm-up; our guide on [crosswords for teachers](/guides/crosswords-for-teachers) has more ideas for class.',
            '**Everyday solvers.** If you simply like a keresztrejtvény with your coffee, a medium skandináv on a phone takes about as long as a short commute.',
          ],
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to make your first Hungarian crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Use the buttons at the end of this page, or switch the site’s language to Magyar in the language menu. The whole site then runs in Hungarian: menus, words and clues.',
            'Choose **Keresztrejtvény** for a classic grid or **Skandináv rejtvény** for arrows inside the grid.',
            'Pick a topic. **Mindennapi szavak** (everyday words) is the friendliest start; **Helyi kultúra**, the [local culture](/topics/local-culture) topic, draws on Hungarian places, food and traditions.',
            'Choose a size and a difficulty: Kis (small, 9×9) and Könnyű (easy) for a first try, Közepes or Nagy when you want a longer solve, and Nehéz for rarer words.',
            'Play in the browser, check a letter or a word when you are unsure, and come back later: your progress is saved on the device.',
          ],
        },
        {
          kind: 'p',
          text: 'Your first puzzle each month is free, with no account needed. After that there are one-time credit packs, with no subscription, and opening a puzzle someone shared with you is always free; see [credits](/credits). For a closer look at each step, read [how to make a crossword](/guides/how-to-make-a-crossword), and if you also like Romanian, the [Romanian crossword](/guides/romanian-crossword) page covers ă, ș and ț.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Can I solve a Hungarian crossword without typing accents?',
      answer:
        'No, the accents are part of the word: á and a are different letters, and so are ő and ö. On a phone or tablet the on-screen keyboard has a key for each accented vowel. On a computer, switch your keyboard to the Hungarian layout.',
    },
    {
      question: 'Do cs, sz and gy take one square or two?',
      answer:
        'Two. Every written character takes its own square, so cs, sz and gy each fill two squares, and dzs fills three. The accented vowels are always one square.',
    },
    {
      question: 'Is a Hungarian crossword good for learning the language?',
      answer:
        'Yes, once you can read simple sentences. Start with a small, easy grid on everyday words: the definitions are short, the crossings confirm your spelling, and you can reveal a letter when you are stuck.',
    },
    {
      question: 'Are the clues translated from English?',
      answer:
        'No. Every word and clue is written natively in Hungarian, in the style of a Hungarian meghatározás. Code then checks each answer and drops any that does not fit.',
    },
    {
      question: 'Is it free to play?',
      answer:
        'Your first puzzle each month is free, no account needed. After that you can buy credits once, with no subscription. A puzzle someone shares with you is always free to open.',
    },
  ],
  related: ['make', 'language-ro', 'language-cs'],
}
