import type { Guide } from '../../types'

export const spanishCrossword: Guide = {
  key: 'language-es',
  slug: 'spanish-crossword',
  title: 'Spanish crossword puzzles online: crucigramas and autodefinidos written in Spanish',
  shortTitle: 'Spanish crossword',
  metaTitle: 'Spanish Crossword Puzzles Online (Crucigramas)',
  description:
    'Play a Spanish crossword online: crucigramas and autodefinidos with clues written natively in Spanish, ñ in its own square. For learners and natives.',
  searchTerms: [
    'spanish crossword',
    'spanish crossword puzzle',
    'crossword in spanish',
    'spanish crossword online',
    'spanish crossword for learners',
    'crucigrama en español',
    'crucigramas online',
    'autodefinidos',
    'crusigrama',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Spanish crossword is one of the most enjoyable ways to grow your vocabulary, whether you are learning Spanish at school, keeping up the language you grew up speaking, or just want a puzzle in your own language. In Spanish it is called a «crucigrama», and the version with clues printed inside the grid is the «autodefinido», a fixture of puzzle magazines in Spain.',
    'Every puzzle here is made in Spanish from scratch: the words and clues are written natively for Spanish speakers, in the vocabulary shared by Spain and Latin America, never translated from English. The buttons at the end of this page open the Spanish version of the site, where the words, clues and menus are all in Spanish.',
  ],
  sections: [
    {
      id: 'spanish-letters',
      heading: 'Accents, ñ and the Spanish alphabet in the grid',
      blocks: [
        {
          kind: 'p',
          text: 'Spanish crosswords have a long-standing habit that surprises learners: written accents are left out of the grid. The answer «canción» (song) goes in as CANCION, and «café» as CAFE. The same goes for the diaeresis, so «pingüino» (penguin) is PINGUINO. Since every grid letter is printed as a capital, an accent mark would only get in the way of the crossing word.',
        },
        {
          kind: 'list',
          items: [
            '**ñ is its own letter.** It is not an n with a decoration, so it keeps its own square: «niño» is N, I, Ñ, O, and «piñata» needs the ñ in the third square.',
            '**ch, ll and rr take two squares.** The Real Academia Española stopped counting ch and ll as separate letters of the alphabet, and crosswords have always split them: «calle» (street) fills five squares.',
            '**Accented vowels are plain vowels.** If you type á, é, í, ó or ú, the grid accepts it as the plain letter, so you never lose a point to an accent.',
          ],
        },
        {
          kind: 'tip',
          text: 'On a phone, the on-screen Spanish keyboard has its own ñ key at the end of the middle row, just where a Spanish keyboard puts it. You never need to hunt for accents, because the grid does not use them.',
        },
      ],
    },
    {
      id: 'crucigrama-and-autodefinido',
      heading: 'Crucigrama and autodefinido: Spanish puzzle traditions',
      blocks: [
        {
          kind: 'p',
          text: 'Across the Spanish-speaking world, the **crucigrama** is the classic puzzle: a grid with numbered squares and lists of clues, Horizontales and Verticales. In some countries people also call it palabras cruzadas. The **autodefinido** is the arrowword version, where each clue sits in a shaded square of the grid with an arrow pointing to its answer. On this site the two are called Crucigrama and Autodefinido.',
        },
        {
          kind: 'p',
          text: 'Spanish clues tend to be direct definitions or a neat periphrasis, and a good one matches the answer’s part of speech: a noun is defined by a noun phrase, a verb by a verb. Here is the difference between a weak clue and a sharp one for «sol» (sun):',
        },
        {
          kind: 'compare',
          weak: 'Algo que brilla (something that shines)',
          strong: 'Astro rey (the king star, a classic Spanish periphrasis)',
        },
        {
          kind: 'list',
          items: [
            'Choose a [crossword](/crossword) to read all the clues first, or to print it for a class.',
            'Choose a [scanword](/scanword), the autodefinido, for a quick game on a phone with each clue right next to its squares.',
          ],
        },
      ],
    },
    {
      id: 'spanish-for-learners',
      heading: 'A Spanish crossword for learners',
      blocks: [
        {
          kind: 'p',
          text: 'Spanish is one of the most studied languages in the world, and crosswords suit it well: spelling is regular, so once you recall a word you can usually write it. The challenge is recall, and that is exactly what a crossword trains.',
        },
        {
          kind: 'list',
          items: [
            '**Beginners:** a small grid on easy, with about 8 to 14 everyday words and plain definitions in Spanish.',
            '**Intermediate:** a medium grid on medium difficulty, where idioms and periphrases begin to appear.',
            '**Heritage speakers:** if you speak Spanish at home but rarely write it, a crossword makes you spell every word, and the folded accents mean you can focus on the letters themselves.',
            '**Teachers:** save the puzzle as a PDF with a separate answer page, or share a link with the class. The [guide for teachers](/guides/crosswords-for-teachers) has lesson ideas.',
          ],
        },
        {
          kind: 'p',
          text: 'Example words show the range: «perro» (dog), «mesa» (table), «manzana» (apple), «montaña» (mountain). Each device remembers the words it has shown, so new puzzles keep bringing new vocabulary rather than repeating the easy ones.',
        },
      ],
    },
    {
      id: 'hispanic-culture',
      heading: 'Spain, Latin America and the culture topic',
      blocks: [
        {
          kind: 'p',
          text: 'There are twelve topics, and one of them, [local culture](/topics/local-culture), is about the culture of the puzzle’s language. On the Spanish site it is Cultura hispana, drawing on the traditions, dishes, music and places of Spain and Latin America, from flamenco to the tango. Proper names such as countries, rivers and cities are kept for this topic and for geography.',
        },
        {
          kind: 'p',
          text: 'The words are chosen from the standard shared across the Spanish-speaking world, so a solver in Mexico City, Madrid or Buenos Aires can finish the same grid. If you notice a clue that only makes sense in one country, report it from the puzzle menu and it will be reviewed.',
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to start a Spanish crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Open the Spanish site with the buttons at the end of this page, or choose Español in the language menu. The puzzle is always in the language the site is in.',
            'Pick Crucigrama or Autodefinido, then a topic, a size and a difficulty.',
            'Create the puzzle and start typing. Check or reveal a letter, a word or the whole grid when you get stuck.',
          ],
        },
        {
          kind: 'p',
          text: 'Your progress is saved on the device, and you can install the site as an app to keep opened puzzles working offline. For every option explained, see [how to make a crossword](/guides/how-to-make-a-crossword); for another Romance language with its own habits, read the [Portuguese crossword guide](/guides/portuguese-crossword).',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Can I do a crossword in Spanish online?',
      answer:
        'Yes. Switch the site to Spanish and every puzzle is made in Spanish: words, clues and menus. It works in the browser on a phone or a computer.',
    },
    {
      question: 'Do Spanish crosswords use accents?',
      answer:
        'No. Like most Spanish crosswords, the grid leaves out written accents and the diaeresis, so «canción» is CANCION. The ñ is different: it is a letter of its own and keeps its own square.',
    },
    {
      question: 'What is an autodefinido?',
      answer:
        'It is the Spanish name for an arrowword: a crossword with the clues written inside the grid, each with an arrow pointing to its answer. It is the scanword format on this site.',
    },
    {
      question: 'Are Spanish crosswords good for learning Spanish?',
      answer:
        'Yes, especially for vocabulary and spelling. Start with a small grid on easy, turn on check as you type, and move up when it feels comfortable.',
    },
    {
      question: 'Is it free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that there are one-time credit packs, no subscription, and opening a shared puzzle is always free. See the [credits page](/credits).',
    },
  ],
  related: ['make', 'language-pt', 'language-it'],
}
