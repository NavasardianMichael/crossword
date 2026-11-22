import type { Guide } from '../../types'

export const scanwordArrowwordPuzzles: Guide = {
  key: 'scanword',
  slug: 'scanword-arrowword-puzzles',
  title: 'Arrowword puzzles explained: what a scanword is and how to solve one',
  shortTitle: 'Arrowwords and scanwords',
  metaTitle: 'Arrowword Puzzles: What a Scanword Is and How to Solve',
  description:
    'What is an arrowword? Learn how this Swedish-style crossword works, how to read its arrows, and how to solve an arrow word puzzle (a scanword) on your phone.',
  searchTerms: [
    'arrowword',
    'arrow word puzzle',
    'arrowwords online',
    'swedish crossword',
    'swedish style crossword',
    'scanword',
    'scanword puzzle',
    'arrow crossword',
    'arroword',
    'how to solve arrowwords',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'An arrowword is a crossword with no clue list. Every clue is printed inside the grid itself, in a shaded square, and a small arrow shows where its answer begins and which way it runs. You read a clue, follow the arrow and type, without ever looking away from the grid.',
    'The format goes by many names. In English it is usually an arrowword or arrow word puzzle, sometimes a Swedish-style or Scandinavian crossword. Across much of Europe it is the most popular word puzzle of all, and in Russian and several other languages it is known as a scanword, from “Scandinavian crossword”. That is the name this site uses: a [scanword](/scanword) here is exactly what English puzzle magazines call an arrowword.',
    'This guide explains how an arrowword works, how to read its arrows, how it differs from a classic crossword, and how to solve one quickly, on paper or on a phone.',
  ],
  sections: [
    {
      id: 'what-is-an-arrowword',
      heading: 'What is an arrowword (scanword)?',
      blocks: [
        {
          kind: 'p',
          text: 'In a classic crossword, the grid holds only white squares and black blocks, and the clues sit in two numbered lists beside it, Across and Down. An arrowword does away with the lists. The squares that would be black in a crossword hold the clues instead, so the grid itself carries everything you need.',
        },
        {
          kind: 'p',
          text: 'Because the clues have to fit inside a single square, they are short: often one to four words, such as “Bee product” or “Opposite of west”. That makes arrowwords quick to read and easy to dip in and out of, which is why they fill so many puzzle magazines and why the Germans call theirs a Schwedenrätsel, a Swedish puzzle.',
        },
        {
          kind: 'tip',
          text: 'Searching for “arrow word”, “arroword” or “Swedish crossword”? They are all the same format. On this site you will find it under the name scanword.',
        },
      ],
    },
    {
      id: 'reading-the-arrows',
      heading: 'How to read the arrows',
      blocks: [
        {
          kind: 'p',
          text: 'The arrows are the only rule you need to learn. Each one starts in a clue square and points to the first letter of its answer.',
        },
        {
          kind: 'list',
          items: [
            '**A straight arrow pointing right** means the answer starts in the next square and runs across.',
            '**A straight arrow pointing down** means the answer starts in the square below and runs down.',
            '**A bent arrow** leaves the clue square in one direction and then turns. A clue sitting above an across answer points down, then right; a clue to the left of a down answer points right, then down.',
            '**Two clues in one square** are common, one above the other. Each has its own arrow, usually one running across and one running down.',
          ],
        },
        {
          kind: 'p',
          text: 'On screen, you can tap a clue square to jump straight to its answer, and tap it again to switch to its second clue. The current clue is also shown in the bar above the grid, so you always know which word you are typing. The [how to play](/rules) page covers the rest of the controls.',
        },
      ],
    },
    {
      id: 'arrowword-vs-crossword',
      heading: 'Arrowword vs crossword: what is the difference?',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Where the clues are:** inside the grid in an arrowword, in Across and Down lists in a classic crossword.',
            '**How long the clues are:** a few words in an arrowword, often a full phrase or sentence in a crossword.',
            '**The shape of the grid:** an arrowword is usually a solid rectangle packed with clue squares; a crossword is usually square, with black blocks between the words.',
            '**The feel of solving:** an arrowword is fast and steady, one short clue after another. A crossword invites you to read the clues first and plan your way in.',
          ],
        },
        {
          kind: 'p',
          text: 'The skills are the same in both: knowing words, reading a clue for its exact meaning, and letting crossing letters confirm a guess. If you enjoy one, you will almost certainly enjoy the other. Our guide on [how to solve crosswords](/guides/how-to-solve-crosswords) goes deeper into those shared strategies.',
        },
      ],
    },
    {
      id: 'how-to-solve-an-arrowword',
      heading: 'How to solve an arrowword, step by step',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            '**Scan the grid for the easy ones.** Short clues with an obvious answer, like a word’s opposite or a famous capital, are the way in. Fill them first, wherever they are.',
            '**Follow the arrow before you type.** It is easy to put a correct word in the wrong place by misreading a bent arrow. Check where the answer starts.',
            '**Use the crossings.** Every word you write in gives letters to the words that cross it. A five-letter answer with two letters already in place is far easier than an empty one.',
            '**Read short clues more than one way.** With so few words, a clue like “Bark” could mean a sound, a tree’s skin or an old word for a boat. The crossing letters tell you which.',
            '**Check or reveal when you need to.** Checking a word marks the wrong letters and locks the right ones; revealing a single letter is often enough to finish a stubborn corner.',
          ],
        },
        {
          kind: 'compare',
          weak: 'Animal',
          strong: 'Striped African horse',
        },
        {
          kind: 'p',
          text: 'A good arrowword clue is short but never vague. “Animal” could be hundreds of words; “Striped African horse” fits only one, even though it is barely longer. Here are a few clues in the arrowword style to practice on.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Striped African horse', answer: 'zebra' },
            { clue: 'Bee product', answer: 'honey' },
            { clue: 'Opposite of west', answer: 'east' },
            { clue: 'Frozen water', answer: 'ice' },
            { clue: 'Capital of Italy', answer: 'rome' },
          ],
        },
      ],
    },
    {
      id: 'arrowwords-on-a-phone',
      heading: 'Why arrowwords are perfect for a phone',
      blocks: [
        {
          kind: 'p',
          text: 'On a small screen, a classic crossword makes you jump between the grid and a long clue list. An arrowword does not: the clue is right next to the answer, so the whole puzzle fits in view. With the built-in keyboard on a touch screen, the grid stays visible while you type, and you can zoom in on a busy corner.',
        },
        {
          kind: 'list',
          items: [
            '**Small**: an 8×10 grid, a quick game for a coffee break.',
            '**Medium**: a 10×13 grid, about right for a commute.',
            '**Large**: a 13×17 grid, for a long, relaxed session.',
          ],
        },
        {
          kind: 'p',
          text: 'Every scanword here comes in easy, medium or hard and in twelve [topics](/topics), and your progress is saved on the device, so you can stop at one station and carry on at the next. Puzzles you have opened keep working offline once the site is installed as an app. When you are ready, [play a scanword](/scanword) now.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Is an arrowword the same as a scanword?',
      answer:
        'Yes. Arrowword is the usual English name, while scanword comes from “Scandinavian crossword” and is the common name in Russian and several other languages. This site uses scanword for the format.',
    },
    {
      question: 'Why is it called a Swedish crossword?',
      answer:
        'The format is closely linked with Scandinavia, where it has long been the favorite kind of crossword. Several languages name it after Sweden or Scandinavia, as German does with Schwedenrätsel.',
    },
    {
      question: 'Are arrowwords easier than crosswords?',
      answer:
        'They usually feel quicker, because the clues are short and sit right beside the answers. Difficulty depends on the words and clues, though: a hard arrowword can be tougher than an easy crossword.',
    },
    {
      question: 'Can I print an arrowword?',
      answer:
        'Yes. Open the puzzle and choose Save as PDF, in the default look, colorful, or black and white. You can add a separate page with the answers.',
    },
    {
      question: 'Is it free to play?',
      answer:
        'Your first puzzle each month is free, with no account needed. After that there are one-time credit packs, with no subscription, and a puzzle someone shares with you is always free to open. The [credits page](/credits) has the details.',
    },
  ],
  related: ['solve', 'make', 'teachers'],
}
