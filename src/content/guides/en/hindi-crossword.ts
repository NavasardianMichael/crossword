import type { Guide } from '../../types'

export const hindiCrossword: Guide = {
  key: 'language-hi',
  slug: 'hindi-crossword',
  title: 'Hindi crossword puzzles online: play a varg paheli in Devanagari',
  shortTitle: 'Hindi crosswords',
  metaTitle: 'Hindi Crossword Puzzles Online: Varg Paheli',
  description:
    'Play a Hindi crossword online: a varg paheli in Devanagari where each square holds a whole akshar, with clues written natively in Hindi. For every level.',
  searchTerms: [
    'hindi crossword',
    'hindi crossword puzzle',
    'hindi crossword online',
    'crossword in hindi',
    'hindi crossword for kids',
    'varg paheli',
    'shabd paheli',
    'वर्ग पहेली',
    'हिंदी वर्ग पहेली',
    'hindi crossword puzzle with answers',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Hindi crossword is usually called a वर्ग पहेली (varg pahelī), a “square puzzle”, and it has been a fixture of Hindi newspapers and children’s magazines for generations. The idea is the one you know from English, with one big difference: Devanagari is not written letter by letter, so a Hindi grid has to decide what goes into a single square.',
    'This guide explains how a Hindi crossword works on this site, how vowel signs and conjuncts fit into the squares, how to type them on the on-screen keyboard, and how learners, families abroad and teachers can use a varg paheli. The button at the end of the page opens the Hindi version of the site, with every word, clue and menu in Hindi.',
  ],
  sections: [
    {
      id: 'one-akshar-per-square',
      heading: 'One square, one akshar',
      blocks: [
        {
          kind: 'p',
          text: 'In a Hindi grid, a square does not hold a bare letter. It holds a whole written syllable, an अक्षर (akshar): a consonant together with its vowel sign (मात्रा, mātrā), plus any dot or nasal mark on it. This is how Hindi speakers naturally count the pieces of a word, and it keeps the grid readable.',
        },
        {
          kind: 'list',
          items: [
            'पानी (pānī, “water”) fills two squares: पा and नी.',
            'किताब (kitāb, “book”) fills three: कि, ता and ब.',
            'हाथी (hāthī, “elephant”) fills two: हा and थी.',
            'भारत (Bhārat, “India”) fills three: भा, र and त.',
          ],
        },
        {
          kind: 'p',
          text: 'A conjunct consonant, joined with the virama (्), also stays together: क्ष in क्षमा (kshamā, “forgiveness”) is one square, and विद्यालय (vidyālay, “school”) fills four, वि, द्या, ल and य. So the length of a Hindi answer is counted in akshar, not in the Unicode characters underneath.',
        },
        {
          kind: 'tip',
          text: 'Before you type, say the word aloud and count its syllables on your fingers. In most Hindi words, that count is very close to the number of squares.',
        },
      ],
    },
    {
      id: 'typing-devanagari',
      heading: 'Typing Devanagari on the on-screen keyboard',
      blocks: [
        {
          kind: 'p',
          text: 'On a phone or tablet, a Hindi keyboard opens under the grid. The first rows hold the vowels and consonants in the order of the Hindi alphabet, from अ, आ, इ to स and ह. The last row holds the signs that complete a square: the mātrās ा ि ी ु ू ृ े ै ो ौ, the anusvāra ं, the chandrabindu ँ, the visarga ः, the nukta ़ and the virama ्.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Tap a consonant: it fills the current square.',
            'Tap a sign: it joins that same square instead of moving on. क then ि gives कि.',
            'For a conjunct, tap the first consonant, the virama ्, then the second consonant: क, ्, ष builds क्ष in one square.',
            'A nukta works the same way: ज then ़ gives ज़.',
          ],
        },
        {
          kind: 'p',
          text: 'On a computer, switch your system keyboard to a Hindi layout, such as InScript or a phonetic one, and type as usual; vowel signs join the letter before them. Signs typed in the wrong order are a common slip, and “check as I type” catches it at once.',
        },
      ],
    },
    {
      id: 'hindi-words-and-clues',
      heading: 'Real Hindi words and clues, not translations',
      blocks: [
        {
          kind: 'p',
          text: 'The words are everyday Hindi, as it is spoken and written in India, and the clues are written natively in Hindi, in the short definitional style of a newspaper varg paheli. They are not English clues translated word for word, which is why they read naturally to a Hindi speaker.',
        },
        {
          kind: 'p',
          text: 'Code, not the model, builds the grid and checks every answer: one word, only Devanagari, and a length in akshar that fits its slot. Anything else is dropped. Your device also remembers the words it has shown you, so a new puzzle never repeats one, which matters a lot if you play every day.',
        },
      ],
    },
    {
      id: 'who-hindi',
      heading: 'Who plays Hindi crosswords online',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Children learning to read Hindi**, at home or in school. A small, easy grid on the Animals or Everyday words topic is a game rather than a lesson.',
            '**Families abroad**, in the United States, Britain, the Gulf or anywhere else, who want their children to read the script and not only speak the language.',
            '**Adult learners**, who know some spoken Hindi or Urdu and are learning Devanagari. Reading short clues is gentler than reading an article.',
            '**Teachers**, who can share one link with a class so every pupil opens the same grid. Our guide on [crosswords for teachers](/guides/crosswords-for-teachers) has more ideas.',
            '**Native speakers**, who will enjoy medium and hard puzzles and the Local culture topic, about India’s own places, food, festivals and history.',
          ],
        },
      ],
    },
    {
      id: 'start-hindi',
      heading: 'How to start a Hindi crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Press the button at the end of this page, or choose हिन्दी in the language menu. The site switches to Hindi.',
            'Choose a classic crossword or a [scanword](/guides/scanword-arrowword-puzzles), then a topic, a size and a difficulty.',
            'Solve in the browser, checking or revealing a letter or a word when you are stuck. Your progress is saved on the device.',
            'Share the link: whoever opens it gets the same varg paheli, free and without signing up.',
          ],
        },
        {
          kind: 'p',
          text: 'Each option is explained in [how to make a crossword](/guides/how-to-make-a-crossword). The same akshar-per-square rule applies to the [Marathi crossword](/guides/marathi-crossword), and the [Urdu crossword](/guides/urdu-crossword) page shows the right-to-left script for a language very close to spoken Hindi.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'What is a crossword called in Hindi?',
      answer:
        'Most often वर्ग पहेली (varg pahelī), “square puzzle”. You will also hear शब्द पहेली (shabd pahelī), “word puzzle”, and plain क्रॉसवर्ड.',
    },
    {
      question: 'Why does पानी take only two squares?',
      answer:
        'Because each square holds a whole akshar, a consonant with its vowel sign. पानी is पा and नी, so it is two squares long.',
    },
    {
      question: 'How do I type a conjunct like क्ष?',
      answer:
        'Tap क, then the virama ्, then ष. They build up in the same square, so the whole conjunct takes one square.',
    },
    {
      question: 'Can I type Hindi in Latin letters?',
      answer:
        'No. The grid takes Devanagari only. On a phone, the built-in Hindi keyboard has every letter and sign you need, so you do not need to install anything.',
    },
    {
      question: 'Is the Hindi crossword free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that there are one-time credit packs with no subscription, and a shared puzzle is always free to open. See the [credits page](/credits).',
    },
  ],
  related: ['make', 'teachers', 'language-mr', 'language-ur'],
}
