import type { Guide } from '../../types'

export const howToSolveCrosswords: Guide = {
  key: 'solve',
  slug: 'how-to-solve-crosswords',
  title: 'How to solve crossword puzzles: tips and strategies that actually work',
  shortTitle: 'How to solve crosswords',
  metaTitle: 'How to Solve Crossword Puzzles: Tips for Beginners',
  description:
    'How to solve crossword puzzles: where to start, how to read a clue, what to do when you are stuck, and how to get better at crosswords with steady practice.',
  searchTerms: [
    'how to solve crossword puzzles',
    'how to solve crosswords',
    'crossword tips',
    'crossword strategies for beginners',
    'how to get better at crosswords',
    'crossword solving tips',
    'how to do a crossword',
    'crossword puzzle tips and tricks',
    'how to solve crossword clues',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Solving crossword puzzles is a skill, not a gift. Nobody looks at an empty grid and sees every answer at once: good solvers simply know where to start, how to read a clue for what it really asks, and what to do when a corner refuses to open. All of that can be learned, and most of it in a few weeks of casual play.',
    'This guide covers the strategies that help most, from the very first square to the last stubborn word. It is written for beginners, but the habits in it are the same ones experienced solvers lean on every day, so there is something here for you whether you have finished one crossword or a thousand.',
    'You can try each tip as you go: a small, easy [crossword](/crossword) takes about ten minutes and is the best practice ground there is.',
  ],
  sections: [
    {
      id: 'start-with-what-you-know',
      heading: 'Where to start: fill in what you know for sure',
      blocks: [
        {
          kind: 'p',
          text: 'The biggest beginner mistake is solving in order, 1 Across, then 2 Across, then 3, getting stuck on the first hard one and giving up. Instead, read through all the clues quickly and fill in only the answers you are certain of. It does not matter where they are in the grid. Every sure answer gives you free letters in the words that cross it.',
        },
        {
          kind: 'list',
          items: [
            '**Fill-in-the-blank clues** are usually the easiest in the puzzle, because a familiar phrase almost answers itself.',
            '**Short answers** of three or four letters have few possible fits, so a guess is easier to confirm.',
            '**Your own interests** come first: if you know sport, geography or cooking, go after those clues before the rest.',
            '**Plurals and verb endings** are often safe even before you know the word: if the clue is plural, the answer probably ends in S; if it is in the past tense, it may end in ED.',
          ],
        },
        {
          kind: 'tip',
          text: 'Write in a letter you are fairly sure of, even when the whole word is still a mystery. A single S at the end of a plural or an ING at the end of a verb is often enough to unlock the word that crosses it.',
        },
      ],
    },
    {
      id: 'read-the-clue',
      heading: 'How to read a crossword clue',
      blocks: [
        {
          kind: 'p',
          text: 'A clue and its answer always match in grammar. That one rule solves more clues than any amount of trivia. If the clue is a verb in the past tense, so is the answer. If the clue is plural, the answer is plural. If the clue is an adjective, you are looking for an adjective, not a noun.',
        },
        {
          kind: 'list',
          items: [
            '**Definition clues** are the most common: “Large body of salt water” means OCEAN or SEA, and the length tells you which.',
            '**Abbreviations in the clue** usually mean an abbreviation in the answer, and a clue that says “for short” asks for a shortened word.',
            '**A question mark** at the end warns you of wordplay: the obvious meaning is probably not the one the setter had in mind.',
            '**Less obvious meanings** are where harder puzzles hide their answers. “Bank” might be about money or about a river, and “Bark” might belong to a dog or a tree.',
          ],
        },
        {
          kind: 'compare',
          weak: 'Reading “Bat” and thinking only of the animal',
          strong: 'Reading “Bat” and asking: an animal, a piece of sports gear, or a verb, as in to bat an eyelid?',
        },
        {
          kind: 'p',
          text: 'When an answer will not come, read the clue again and try a different part of speech or a different meaning for its key word. Saying the clue out loud helps too: it is surprising how often a word you stared at for a minute sounds different once you hear it.',
        },
      ],
    },
    {
      id: 'use-the-crossings',
      heading: 'Let the crossing letters do the work',
      blocks: [
        {
          kind: 'p',
          text: 'Every letter you place belongs to two words, one across and one down. That is the whole trick of a crossword: once a few answers are in, the grid starts solving itself. A word you could not begin to guess from its clue becomes obvious when it reads _A_E_ and the clue is about a cake.',
        },
        {
          kind: 'list',
          items: [
            'Work outward from what you have filled in, rather than jumping to a distant empty corner.',
            'Try the common English endings on a half-finished word: ING, ED, ER, EST, LY, TION.',
            'Look at where the vowels fall. A gap between two consonants is often a vowel, and English rarely puts more than three consonants in a row.',
            'If two crossing words seem to need different letters in the same square, one of them is wrong. Go back to the one you were less sure of.',
          ],
        },
      ],
    },
    {
      id: 'when-you-are-stuck',
      heading: 'What to do when you are stuck',
      blocks: [
        {
          kind: 'p',
          text: 'Every solver gets stuck. The difference between a finished puzzle and an abandoned one is mostly what you do next. Here are the moves that work, roughly in the order to try them.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            '**Move to another part of the grid.** A fresh corner gives your mind a rest, and you often come back with the answer you were missing.',
            '**Doubt your surest answer nearby.** A wrong word blocks everything that crosses it, and it is usually the one you never questioned.',
            '**Take a break.** Put the puzzle down for ten minutes. Answers have a way of arriving while you are making tea.',
            '**Check a word.** Checking marks wrong letters with a red strike-through and locks the right ones, so you learn where the mistake is without being handed the answer.',
            '**Reveal a single letter.** One letter is often all a word needs, and it is far less of a spoiler than revealing the whole word.',
          ],
        },
        {
          kind: 'tip',
          text: 'Learning? Turn on “Check as I type” in the settings: a wrong letter is marked the moment it goes in, so you never build a corner on a mistake. When you feel confident, switch it off and check only at the end.',
        },
        {
          kind: 'p',
          text: 'Using these tools is not cheating. They are how you learn new words and spot the patterns setters use. A revealed letter carries a small flag, and the screen at the end shows how many checks and reveals you used, so you can watch the number fall as you improve.',
        },
      ],
    },
    {
      id: 'practice-clues',
      heading: 'Practice: try these clues',
      blocks: [
        {
          kind: 'p',
          text: 'Here are a few clues of the kinds you will meet most often. Read each one for its grammar and its possible meanings before you open the answer.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Large body of salt water', answer: 'ocean' },
            { clue: 'Ran very fast (past tense)', answer: 'sprinted' },
            { clue: 'Outer layer of a tree', answer: 'bark' },
            { clue: 'Cutting tools with two blades', answer: 'scissors' },
            { clue: 'River edge, or a place for savings', answer: 'bank' },
          ],
        },
      ],
    },
    {
      id: 'get-better',
      heading: 'How to get better at crosswords',
      blocks: [
        {
          kind: 'p',
          text: 'Getting better at crosswords comes from small, regular practice rather than marathon sessions. A puzzle a day, even a small one, builds the two things that matter: vocabulary and a feel for how clues are written.',
        },
        {
          kind: 'list',
          items: [
            '**Climb the difficulty slowly.** Start with easy puzzles until you finish them without reveals, then move to medium, then hard. Easy clues use common words and plain definitions; hard ones use rarer words and less obvious meanings.',
            '**Grow the grid with you.** A small 9×9 crossword has about 8 to 14 words; a medium 13×13 has 16 to 24; a large 15×15, the size of a newspaper crossword, has up to 34.',
            '**Play the topics you know least.** A run of puzzles on [science](/topics/science) or [history](/topics/history) fills gaps in your general knowledge quickly. All twelve are on the [topics](/topics) page.',
            '**Notice what fooled you.** When a reveal surprises you, reread the clue and work out how it pointed to the answer. That is how you start to think like a setter.',
            '**Solve with someone.** Share a link and a friend gets the very same grid. Two people know more words than one, and comparing times is half the fun.',
          ],
        },
        {
          kind: 'p',
          text: 'A good place to practice is a puzzle that does not repeat itself. Here each device remembers the words it has already shown you, and every new puzzle leaves them out, so you keep meeting new answers instead of memorizing old ones. If you want a change of pace, try an [arrowword (scanword)](/guides/scanword-arrowword-puzzles), where the clues sit inside the grid, or [make your own crossword](/guides/how-to-make-a-crossword) on a theme you love.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'What is the best way for a beginner to start solving crosswords?',
      answer:
        'Pick a small, easy puzzle and fill in only the answers you are sure of first, wherever they are. Then work outward from those letters. Leave the hard clues for last, when the crossing letters have done most of the work.',
    },
    {
      question: 'Is it cheating to check or reveal answers?',
      answer:
        'No. Checking and revealing are how most people learn. Try to check a word or reveal a single letter before revealing a whole answer, and reread the clue afterwards to see how it led there.',
    },
    {
      question: 'How long does it take to get good at crosswords?',
      answer:
        'It depends on how often you play, but regular solvers usually notice the difference within a few weeks. A small puzzle every day does more than one large puzzle a week.',
    },
    {
      question: 'Why do the same words keep showing up in crosswords?',
      answer:
        'Short words full of vowels are easy to fit into a grid, so many puzzles lean on the same ones. Here each device remembers the words it has seen, and new puzzles leave them out, so you will not meet the same answer twice.',
    },
    {
      question: 'Can I solve crosswords on my phone?',
      answer:
        'Yes. The puzzles play in the browser, and on a touch screen a built-in keyboard appears so the grid stays in view. The [how to play](/rules) page explains moving around the grid and switching between Across and Down.',
    },
    {
      question: 'Are the crosswords free?',
      answer:
        'Your first puzzle each month is free, with no account needed. After that there are one-time credit packs, with no subscription, and opening a puzzle a friend shared with you is always free. See the [credits page](/credits).',
    },
  ],
  related: ['make', 'scanword', 'teachers'],
}
