import type { Guide } from '../../types'

export const hebrewCrossword: Guide = {
  key: 'language-he',
  slug: 'hebrew-crossword',
  title: 'Hebrew crossword puzzles online: play a tashbetz written in Hebrew',
  shortTitle: 'Hebrew crosswords',
  metaTitle: 'Hebrew Crossword Puzzles Online: Play a Tashbetz',
  description:
    'Play a Hebrew crossword online: a tashbetz with right-to-left grids, final letters and clues written natively in Hebrew. For learners and native speakers.',
  searchTerms: [
    'hebrew crossword',
    'hebrew crossword puzzle',
    'hebrew crossword online',
    'crossword in hebrew',
    'hebrew crossword for beginners',
    'tashbetz',
    'tashbets online',
    'תשבץ',
    'תשבץ אונליין',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A Hebrew crossword is a תשבץ (tashbetz), and in Israel it is part of the weekend: newspapers print several, from quick definition grids to the famous תשבץ היגיון (tashbetz higayon), the “logic crossword” whose clues are built on wordplay. If you are looking for a Hebrew crossword puzzle online, a tashbetz is what you are after.',
    'This guide explains how a Hebrew crossword works on this site: why the grid runs from right to left, what happens to niqqud, and why the final letters ך ם ן ף ץ matter. The button at the end of the page opens the Hebrew version of the site, where every word, clue and menu is in Hebrew.',
  ],
  sections: [
    {
      id: 'grid-direction',
      heading: 'A grid that reads right to left',
      blocks: [
        {
          kind: 'p',
          text: 'In the Hebrew version, the grid is mirrored along with the page. An Across answer starts in the rightmost square of its run and continues to the left, the way Hebrew is written; Down answers go from top to bottom as in any crossword. In a scanword, the arrows beside each clue point the Hebrew way too.',
        },
        {
          kind: 'p',
          text: 'One square holds one letter, so שלום (shalom, “peace”) fills four squares, ש ל ו ם, and ספר (sefer, “book”) fills three. Because Hebrew letters do not join, a Hebrew grid looks much like a printed tashbetz in an Israeli paper.',
        },
      ],
    },
    {
      id: 'final-letters-and-niqqud',
      heading: 'Final letters, niqqud and spelling',
      blocks: [
        {
          kind: 'p',
          text: 'Two details of Hebrew spelling shape every tashbetz, and the site handles both in code.',
        },
        {
          kind: 'list',
          items: [
            '**Final letters are letters of their own.** ך, ם, ן, ף and ץ have their own keys and their own place in the grid. A word ends in its final form: מים (mayim, “water”) ends in ם, not מ, and ארץ (eretz, “land”) ends in ץ. If you type the ordinary form at the end of a word, the check tool counts it as wrong.',
            '**No niqqud.** Vowel points and cantillation marks are never typed and never shown, so כֶּלֶב (kelev, “dog”) goes into the grid as כלב, three squares. Answers are written as everyday Hebrew text is, without points.',
            '**No geresh or gershayim.** The apostrophe-like ׳ and the double ״ are left out, so a grid holds letters only.',
            '**One word, usually a singular noun.** Answers are single words, without a hyphen or a space; a word that only lives in the plural stays plural.',
          ],
        },
        {
          kind: 'tip',
          text: 'Before you check a word, glance at its last square. If that letter has a final form, the final form belongs there. It is a small habit that saves many wrong checks.',
        },
      ],
    },
    {
      id: 'typing-hebrew',
      heading: 'Typing Hebrew on the on-screen keyboard',
      blocks: [
        {
          kind: 'p',
          text: 'On a phone or a tablet, a Hebrew keyboard appears under the grid. Its three rows keep the letter order of the familiar Israeli layout, starting ק ר א ט ו ן ם פ on the top row, with the final letters among them rather than hidden behind a long press. Your phone’s own keyboard stays closed, so the grid is never covered.',
        },
        {
          kind: 'p',
          text: 'On a computer, switch your system keyboard to Hebrew and type as usual. Any niqqud your keyboard adds is ignored, so you can type quickly without worrying about points.',
        },
      ],
    },
    {
      id: 'who-its-for',
      heading: 'Hebrew crosswords for learners, students and Israelis abroad',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Ulpan students and adult learners.** A small, easy grid on the Everyday words topic turns new vocabulary into something you use. Clues are in Hebrew, so you read real sentences without niqqud, which is the step most learners find hardest.',
            '**Hebrew school and day-school pupils.** A short tashbetz at the start of a lesson is a calm warm-up; the teacher shares one link and every student opens the same grid. See [crosswords for teachers](/guides/crosswords-for-teachers) for lesson ideas.',
            '**Israelis abroad and their children.** A weekly tashbetz keeps the language alive at home, and a shared link lets grandparents in Israel solve the very same grid.',
            '**Native speakers.** Medium and hard puzzles draw on wider vocabulary, geography and the Local culture topic, which is about Israel’s own places, food, holidays and history.',
          ],
        },
        {
          kind: 'p',
          text: 'The clues are written natively in Hebrew in the voice of an Israeli definition crossword, never translated from English. Code checks that each answer is one word in the 27 letter forms of the Hebrew alphabet and that its length fits the grid, and drops anything that does not.',
        },
      ],
    },
    {
      id: 'get-started',
      heading: 'How to start a Hebrew crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Press the button at the end of this page, or pick עברית in the language menu. The site switches to Hebrew and to a right-to-left layout.',
            'Choose a classic crossword or a [scanword](/guides/scanword-arrowword-puzzles), then a topic, a size and a difficulty.',
            'Solve in the browser, checking or revealing letters when you need to. Progress is saved on your device, and puzzles you have opened keep working offline once the site is installed as an app.',
            'Share the link: the person you send it to gets the same tashbetz, free and without signing up.',
          ],
        },
        {
          kind: 'p',
          text: 'Every option is explained step by step in [how to make a crossword](/guides/how-to-make-a-crossword). Hebrew and Arabic are close relatives, and the [Arabic crossword](/guides/arabic-crossword) page shows how a right-to-left language with joining letters fits the same kind of grid.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'What is a crossword called in Hebrew?',
      answer:
        'A תשבץ (tashbetz). The wordplay variety beloved in Israeli weekend papers is the תשבץ היגיון (tashbetz higayon), the “logic crossword”.',
    },
    {
      question: 'Do I need to type the final letters?',
      answer:
        'Yes. ך, ם, ן, ף and ץ are separate letters on the keyboard and in the grid, and a word that ends in one of them must end in it: מים, not מימ.',
    },
    {
      question: 'Is there niqqud in the grid or the clues?',
      answer:
        'No. Answers and clues are written without vowel points, as everyday Hebrew is. Any niqqud you type is simply ignored.',
    },
    {
      question: 'Is it good for learning Hebrew?',
      answer:
        'Yes, from about the point where you can read simple words without niqqud. Start small and easy, turn on “check as I type”, and reveal a letter rather than a whole word when you are stuck.',
    },
  ],
  related: ['make', 'teachers', 'language-ar'],
}
