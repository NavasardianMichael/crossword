import type { Guide } from '../../types'

export const koreanCrossword: Guide = {
  key: 'language-ko',
  slug: 'korean-crossword',
  title: 'Korean crossword puzzles online: 십자말풀이 with one Hangul syllable per square',
  shortTitle: 'Korean crosswords',
  metaTitle: 'Korean Crossword Puzzles Online in Hangul',
  description:
    'Play a Korean crossword online: one Hangul syllable per square, typed letter by letter, with clues written natively in Korean. For learners and teachers.',
  searchTerms: [
    'korean crossword',
    'korean crossword puzzle',
    'crossword in korean',
    'korean crossword online',
    'hangul crossword',
    'korean crossword for learners',
    '십자말풀이',
    '가로세로 낱말퀴즈',
    '크로스워드',
    'sipjamal puri',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Korean crossword fills its grid with whole syllables. Hangul builds each syllable as a block of letters, and in a Korean crossword one block takes one square, so a word’s length is the number of syllables you hear. This page explains how a Korean crossword, a **십자말풀이** (sipjamal puri), works, how typing a syllable into a square feels, and how to make your first one.',
    'Many Koreans know crosswords as **가로세로 낱말 퀴즈**, the across-and-down word quiz printed in newspapers and magazines. For learners of Korean, whether they started with dramas, music or a class, a crossword is a cheerful way to practice reading Hangul and to collect vocabulary that sticks.',
  ],
  sections: [
    {
      id: 'syllables-in-the-grid',
      heading: 'One syllable block per square',
      blocks: [
        {
          kind: 'p',
          text: 'Each square holds one complete Hangul syllable. “사람” (saram, person) takes two squares, “학교” (hakgyo, school) two, and “고양이” (goyangi, cat) three. Single letters (jamo) never stand alone as an answer: a square is always a full syllable such as 가, 간 or 강.',
        },
        {
          kind: 'list',
          items: [
            '**Type letters, get syllables.** On the on-screen keyboard you tap jamo just as on a Korean phone: ㄱ then ㅏ builds 가 in the same square, and ㄴ after that makes 간.',
            '**The final consonant moves when it should.** If you type a vowel after 간, the ㄴ slides into the next square and you get 가 and 나, exactly as Korean keyboards behave.',
            '**Compound vowels and double consonants are there.** ㅘ, ㅝ and ㅢ have their own keys, or build from ㅗ + ㅏ and similar pairs, and the double consonants ㄲ, ㄸ, ㅃ, ㅆ and ㅉ have keys too.',
          ],
        },
        {
          kind: 'tip',
          text: 'On a computer, type with your usual Korean input method; the grid takes the syllables it composes. The clues are in Hangul and may include a Hanja character where a Korean setter would use one.',
        },
      ],
    },
    {
      id: 'korean-puzzle-tradition',
      heading: 'Garo and sero: how Korean crosswords read',
      blocks: [
        {
          kind: 'p',
          text: 'A classic Korean crossword has numbered squares and two lists of clues, **가로** (garo, across) and **세로** (sero, down). The clues, called **열쇠** (yeolsoe, keys) in many puzzles, are usually short, plain definitions rather than wordplay. On this site that is the [classic crossword](/crossword).',
        },
        {
          kind: 'p',
          text: 'The [scanword](/scanword) puts each clue in a box inside the grid, with an arrow showing where its answer runs. Because Korean words are short in syllables, a scanword grid feels dense and quick, and it is comfortable on a phone.',
        },
      ],
    },
    {
      id: 'native-clues',
      heading: 'Why native Korean clues matter',
      blocks: [
        {
          kind: 'p',
          text: 'A crossword translated from English does not survive the trip: Korean words have different lengths in syllables, and a translated clue sounds stiff. Here every word and clue is written natively in Korean by an AI model (Google Gemini). Code, not the model, then builds the grid, checks that each answer is made of complete Hangul syllables and fits its squares, and drops anything invalid rather than repairing it.',
        },
        {
          kind: 'compare',
          weak: 'Translated: “Place” for “학교” (school), which fits countless answers.',
          strong: 'Native: “아이들이 글을 배우러 가는 곳” (the place children go to learn to read and write), which points to one.',
        },
        {
          kind: 'p',
          text: 'The words are everyday South Korean vocabulary, and each device remembers the words it has already shown, so new puzzles never repeat them. The [local culture](/topics/local-culture) topic draws on Korean places, food, holidays and customs.',
        },
      ],
    },
    {
      id: 'for-learners',
      heading: 'Korean crosswords for learners, families and teachers',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Learners of Korean.** Once you can read Hangul, a small, easy grid is real reading practice, and typing syllables jamo by jamo trains your spelling at the same time.',
            '**Korean families abroad.** A shared link gives everyone the same grid and clues, free and without signing up, so children and grandparents can solve together.',
            '**Teachers of Korean.** Print a puzzle as a PDF with a separate answers page for a vocabulary warm-up; the guide on [crosswords for teachers](/guides/crosswords-for-teachers) has more ideas for class.',
            '**Native speakers.** A medium scanword fits a subway ride, and no word ever repeats.',
          ],
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to make your first Korean crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Use the buttons at the end of this page, or choose 한국어 in the language menu. Menus, words and clues all switch to Korean.',
            'Choose **크로스워드** for a classic grid or **스캔워드** for clues inside the grid.',
            'Pick a topic, such as **일상 낱말** (everyday words), a size, 작게, 중간 or 크게, and a difficulty: 쉬움, 보통 or 어려움.',
            'Solve in the browser. Check a square, a word or the whole grid, reveal a syllable when you are stuck, and come back later: progress is saved on the device.',
          ],
        },
        {
          kind: 'p',
          text: 'Your first puzzle each month is free, no account needed; after that, one-time credit packs, no subscription, and a shared puzzle is always free to open ([credits](/credits)). If you also study Japanese, the [Japanese crossword](/guides/japanese-crossword) page shows how kana fill a grid.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Does each square hold a letter or a syllable?',
      answer:
        'A syllable. Each square holds one complete Hangul block, so 고양이 takes three squares. You still type it letter by letter, and the letters join into the block as you go.',
    },
    {
      question: 'How do I type Korean in the crossword?',
      answer:
        'On a phone, use the on-screen jamo keyboard: ㄱ then ㅏ makes 가 in one square. On a computer, use your Korean input method.',
    },
    {
      question: 'What is 십자말풀이?',
      answer:
        'It is a Korean word for a crossword puzzle. Many people also call it 가로세로 낱말 퀴즈, after the across (가로) and down (세로) clue lists.',
    },
    {
      question: 'Is a Korean crossword good for beginners?',
      answer:
        'If you can read Hangul, yes. Start with a small, easy puzzle on everyday words; the crossings and the reveal tool help when a clue is beyond your level.',
    },
    {
      question: 'Is it free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that you can buy credits once, with no subscription. A shared puzzle is always free to open.',
    },
  ],
  related: ['teachers', 'language-ja', 'language-zh'],
}
