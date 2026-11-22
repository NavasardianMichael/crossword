import type { Guide } from '../../types'

export const howToMakeACrossword: Guide = {
  key: 'make',
  slug: 'how-to-make-a-crossword',
  title: 'How to make a crossword puzzle online: a step-by-step guide',
  shortTitle: 'How to make a crossword',
  metaTitle: 'How to Make a Crossword Puzzle Online, Step by Step',
  description:
    'Make a crossword online in minutes: choose a format, a topic and a difficulty, check the clues, then share a link or print a PDF. Tips for classes and parties.',
  searchTerms: [
    'how to make a crossword',
    'crossword maker',
    'crossword puzzle maker',
    'make your own crossword',
    'create a crossword online',
    'crossword generator',
    'free crossword maker',
    'printable crossword maker',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Making a crossword by hand takes longer than most people expect. Finding words that cross cleanly is a puzzle in itself, and writing a fair clue for every one of them is a second puzzle on top. A generator does the fitting for you, so your time goes where it matters: choosing what the puzzle is about and who it is for.',
    'This guide walks through making a crossword online, from the first choice to a finished grid you can play on a phone, send to a friend or print for a class. It also covers what makes a crossword good, so you can tell a strong puzzle from a weak one before anyone else sees it.',
  ],
  sections: [
    {
      id: 'choose-a-format',
      heading: 'Step 1: Choose a classic crossword or a scanword',
      blocks: [
        {
          kind: 'p',
          text: 'There are two common shapes of word puzzle. A **classic crossword** has numbered squares and two lists of clues beside the grid, Across and Down. A **scanword**, also called an arrowword, puts every clue inside the grid itself, with a small arrow pointing to the answer. Both use the same words and the same skills; they just read differently.',
        },
        {
          kind: 'list',
          items: [
            'Pick a [classic crossword](/crossword) for printing, for classrooms and for anyone who likes to read all the clues first.',
            'Pick a [scanword](/scanword) for a quick game on a phone: the clue is right where you type, so there is no jumping between the grid and a list.',
          ],
        },
        {
          kind: 'tip',
          text: 'Not sure? Start with a small classic crossword. It takes ten to fifteen minutes to solve, which is the right length for a first try or a warm-up in class.',
        },
      ],
    },
    {
      id: 'choose-a-topic',
      heading: 'Step 2: Choose a topic',
      blocks: [
        {
          kind: 'p',
          text: 'A topic gives a crossword its character. A puzzle where every answer is an animal, a dish or a piece of sports gear feels made for someone, and solvers enjoy spotting the theme. Mixed topics are good for general practice, when you want variety rather than a theme.',
        },
        {
          kind: 'p',
          text: 'There are twelve [topics](/topics) to choose from, including [animals](/topics/animals), [food and drink](/topics/food), [geography](/topics/geography), [science](/topics/science) and [local culture](/topics/local-culture), which leans on the traditions, places and people of the language you are playing in.',
        },
      ],
    },
    {
      id: 'choose-size-and-difficulty',
      heading: 'Step 3: Choose the size and the difficulty',
      blocks: [
        {
          kind: 'p',
          text: 'Size decides how long the puzzle takes; difficulty decides how hard each clue is. They are separate on purpose: a small hard puzzle is a quick brain teaser, while a large easy one is a relaxed half hour with a cup of tea.',
        },
        {
          kind: 'list',
          items: [
            '**Small**: a 9×9 grid with roughly 8 to 14 words. Good for children, beginners and a five-minute break.',
            '**Medium**: a 13×13 grid with 16 to 24 words. The everyday size for most solvers.',
            '**Large**: a 15×15 grid with up to 34 words, the size of a newspaper crossword.',
          ],
        },
        {
          kind: 'p',
          text: '**Easy** clues use common words and direct definitions. **Hard** clues use rarer words and lean on knowledge, wordplay and less obvious meanings. Medium sits in between and suits most adults.',
        },
      ],
    },
    {
      id: 'what-the-ai-does',
      heading: 'Step 4: Let the AI write the words and clues',
      blocks: [
        {
          kind: 'p',
          text: 'Once you press create, the words and clues are written by an AI model for your language and topic. Code, not the model, then builds the grid, checks every word against the alphabet and its length in squares, and throws out anything that does not fit. A clue that gives away its own answer, or a word with a typo, is dropped rather than patched.',
        },
        {
          kind: 'p',
          text: 'Each device also remembers the words it has already shown you, so a new puzzle never repeats an answer you have seen before. That matters more than it sounds: after a few puzzles, repeated words are the first thing that makes a crossword feel stale.',
        },
      ],
    },
    {
      id: 'check-the-clues',
      heading: 'Step 5: Check what makes a clue good',
      blocks: [
        {
          kind: 'p',
          text: 'Whether you make puzzles with a generator or by hand, it helps to know what a good clue looks like. A good clue has exactly one fair answer, uses words the solver knows, and does not contain the answer or a word from the same root.',
        },
        {
          kind: 'compare',
          weak: 'A large animal (8 letters)',
          strong: 'Grey giant with a trunk (8 letters)',
        },
        {
          kind: 'p',
          text: 'The first clue fits dozens of animals; the second points to one. Length in letters helps, but it should confirm an answer, not be the only way to find it.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Grey giant with a trunk', answer: 'elephant' },
            { clue: 'Breakfast drink made from beans', answer: 'coffee' },
            { clue: 'Capital of Japan', answer: 'tokyo' },
            { clue: 'Its needle always points north', answer: 'compass' },
          ],
        },
        {
          kind: 'tip',
          text: 'If a clue looks wrong or unfair, report it from the puzzle menu. Reported clues are reviewed and retired, so the next person does not meet them.',
        },
      ],
    },
    {
      id: 'share-or-print',
      heading: 'Step 6: Play, share or print',
      blocks: [
        {
          kind: 'p',
          text: 'Your crossword opens straight away in the browser, on a phone or a computer. On a touch screen, a built-in keyboard appears so the grid stays in view. You can check a letter, a word or the whole grid, reveal an answer when you are stuck, and leave and come back later: your letters are saved on the device.',
        },
        {
          kind: 'list',
          items: [
            '**Share a link**: a friend gets the very same grid and clues, free and without signing up.',
            '**Save as a PDF**: in color or black and white, with or without an answer page. Handy for a class, a party or a long trip without signal.',
            '**Play offline**: install the site as an app, and puzzles you have opened keep working without a connection.',
          ],
        },
      ],
    },
    {
      id: 'ideas',
      heading: 'Ideas: crosswords for a class, a party or a gift',
      blocks: [
        {
          kind: 'list',
          items: [
            '**In class**: a small puzzle on the week’s topic makes a calm start to a lesson. Print one copy per pair and let them argue over the answers.',
            '**At a party or a family dinner**: share a link in the group chat and see who finishes first.',
            '**For a language learner**: switch the site to the language being learned. The words and clues are written natively in that language, so the puzzle doubles as vocabulary practice.',
            '**On a commute**: a medium scanword fits a twenty-minute ride and needs no paper.',
          ],
        },
        {
          kind: 'p',
          text: 'For more on using puzzles with students, see [crosswords for teachers](/guides/crosswords-for-teachers). If you are on the other side of the grid, our guide on [how to solve crosswords](/guides/how-to-solve-crosswords) has tips for getting unstuck.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Is the crossword maker free?',
      answer:
        'Your first puzzle each month is free, with no account and no sign-up. After that you can buy credits once, with no subscription. Opening a puzzle someone shared with you is always free. The details are on the [credits page](/credits).',
    },
    {
      question: 'Can I type in my own words and clues?',
      answer:
        'Not at the moment. The words and clues are written for your topic and difficulty, then checked by code. What you choose is the format, the topic, the size and the difficulty.',
    },
    {
      question: 'Can I print the crossword?',
      answer: 'Yes. Open the puzzle, choose Save as PDF, and pick color or black and white. You can add a separate page with the answers.',
    },
    {
      question: 'Which languages can I make a crossword in?',
      answer:
        'Thirty-three, from English, Spanish and German to Armenian, Japanese and Swahili. Each language has its own words and clues, written natively rather than translated, and the site’s menus switch with it.',
    },
    {
      question: 'Will the same words come up again?',
      answer: 'No. Each device remembers the words it has shown, and every new puzzle leaves them out.',
    },
  ],
  related: ['solve', 'scanword', 'teachers'],
}
