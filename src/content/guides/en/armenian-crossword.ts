import type { Guide } from '../../types'

export const armenianCrossword: Guide = {
  key: 'language-hy',
  slug: 'armenian-crossword',
  title: 'Armenian crossword puzzles online: play a khachbar in Armenian, on a phone or on paper',
  shortTitle: 'Armenian crossword',
  metaTitle: 'Armenian Crossword Puzzles Online (Khachbar)',
  description:
    'Play an Armenian crossword online: native clues in Eastern Armenian, ու and և in one square each, an on-screen Armenian keyboard. For learners and the diaspora.',
  searchTerms: [
    'armenian crossword',
    'armenian crossword puzzle',
    'crossword in armenian',
    'armenian crossword online',
    'armenian crossword for learners',
    'hayeren khachbar',
    'khachbar',
    'xachbar',
    'հայերեն խաչբառ',
    'խաչբառ',
    'հայերեն սկանվորդ',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'An Armenian crossword is one of the gentlest ways to keep the language alive in your head. Maybe you grew up speaking Armenian at home but rarely read it, maybe you are learning it as an adult, or maybe you simply miss the «խաչբառ» (khachbar) your grandparents solved over coffee. Whatever brought you here, a grid of Armenian letters asks you to read, recall and spell, and it does so in ten relaxed minutes.',
    'This site makes crossword puzzles in Armenian from scratch. Every word and every clue is written natively in Armenian, never translated from English, and the grid follows the rules of the Armenian alphabet, including the letters that look like two characters but fill a single square. The buttons at the end of this page open the Armenian version of the site, where the menus, the words and the clues are all in Armenian.',
    'Below you will find what makes Armenian special in a crossword grid, how to type it on a phone or a laptop with an English keyboard, a little about Armenian puzzle culture, and a short path to your first puzzle.',
  ],
  sections: [
    {
      id: 'armenian-alphabet',
      heading: 'The Armenian alphabet, square by square',
      blocks: [
        {
          kind: 'p',
          text: 'The Armenian alphabet was created by Mesrop Mashtots in the early fifth century, traditionally dated to 405, with 36 letters. Two more, **օ** and **ֆ**, were added in the Middle Ages, which is why Armenians today learn an alphabet of 38 letters. The spelling reform of the twentieth century, still used in the Republic of Armenia, changed how a few sounds are written, and that matters in a crossword, where every square holds exactly one letter.',
        },
        {
          kind: 'p',
          text: 'The puzzles here are in **Eastern Armenian**, in the reformed spelling of the Republic of Armenia: «գյուղ» rather than the classical «գիւղ», «արև» rather than «արեւ». If you learned Western Armenian in a diaspora school, you will recognize most words, but expect Eastern spelling and now and then an Eastern word where you would say another.',
        },
        {
          kind: 'list',
          items: [
            '**ու is one square.** In reformed spelling ու is a letter of its own, so «տուն» (tun, house) fills three squares: տ, ու, ն. «ուղտ» (ught, camel) also fills three: ու, ղ, տ.',
            '**և is one square.** «արև» (arev, sun) fills three squares, and «Երևան» (Yerevan) fills five: Ե, ր, և, ա, ն.',
            '**ւ never stands alone.** Outside ու, the letter ւ belongs to classical spelling, so you will not meet it in an answer.',
            '**Every other letter is one square**, from ա to ֆ, including the ones learners often mix up, such as ռ and ր, or տ, թ and դ.',
          ],
        },
        {
          kind: 'tip',
          text: 'Grid letters are printed as capitals, but և has no capital form of its own: the classical capital is the pair ԵՒ. So և keeps its small shape in the grid, and Yerevan appears as ԵՐևԱՆ. It is not a typo; it is one square holding one letter.',
        },
      ],
    },
    {
      id: 'typing-armenian',
      heading: 'Typing Armenian on a phone or a laptop',
      blocks: [
        {
          kind: 'p',
          text: 'You do not need to install an Armenian keyboard to solve. On a phone or a tablet, an on-screen Armenian keyboard appears below the grid, laid out phonetically, with its own keys for **ու** and **և**. One tap fills one square, and your phone’s own keyboard stays out of the way so the whole grid remains in view.',
        },
        {
          kind: 'p',
          text: 'On a computer with an Armenian keyboard layout, type as you normally would. When you type ո and then ւ, the two join into ու in the same square, so you never have to think about it.',
        },
        {
          kind: 'p',
          text: 'If your computer keyboard is still set to English, the site reads your keys phonetically instead. A gives ա, S gives ս, D gives դ, K gives կ, and so on. W gives ո and U gives ւ, so W followed by U fills one square with ու. The number keys and the bracket keys cover the remaining letters, and the 7 key gives և.',
        },
        {
          kind: 'tip',
          text: 'Not sure about a letter? Turn on “check as I type” from the puzzle menu and wrong letters are marked the moment you enter them. It is a quick way to learn which of ռ or ր a word really takes.',
        },
      ],
    },
    {
      id: 'khachbar-and-skanvord',
      heading: 'Khachbar and skanvord: Armenian crossword traditions',
      blocks: [
        {
          kind: 'p',
          text: 'In Armenian, a crossword is «խաչբառ» (khachbar), built from խաչ (khach, cross) and բառ (bar, word), much like the English word. Many people type it in Latin letters, as hayeren khachbar or xachbar, when they search from a phone without Armenian letters. The puzzle with clues printed inside the grid and arrows pointing to the answers is called «սկանվորդ» (skanvord), a word Armenian took from Russian along with the format itself.',
        },
        {
          kind: 'p',
          text: 'Armenian clues have a flavor of their own. A good Armenian crossword leans on descriptive phrases and images rather than dry dictionary definitions: «Անապատի նավ» (ship of the desert) for «ուղտ» (camel), or «Գազանների արքան» (king of beasts) for «առյուծ» (lion). Because the clues here are written in Armenian from the start, you meet these turns of phrase as a native speaker would, which is exactly what a learner needs and what a translated puzzle can never give.',
        },
        {
          kind: 'list',
          items: [
            'Choose a [classic crossword](/crossword) if you like to read every clue first, or if you plan to print the puzzle. The Armenian site calls it Խաչբառ.',
            'Choose a [scanword](/scanword), Սկանվորդ on the Armenian site, for a quick game on a phone: each clue sits right next to the squares you are filling.',
          ],
        },
      ],
    },
    {
      id: 'armenian-culture-topic',
      heading: 'A crossword about Armenia itself',
      blocks: [
        {
          kind: 'p',
          text: 'There are twelve topics, from animals and food to science and sport. One of them, [local culture](/topics/local-culture), is about the culture of the puzzle’s own language. In Armenian it is called Ազգային մշակույթ, and it draws on Armenian traditions, places, dishes, music and history: the kind of words you would hear at a family table, at church on a holiday, or on a trip to Armenia.',
        },
        {
          kind: 'p',
          text: 'Proper names such as towns, rivers and mountains appear only in this topic and in geography, so a word like «Արարատ» can turn up there, while everyday topics stay with common nouns such as «լավաշ» (lavash) or «ծիրան» (tsiran, apricot). For heritage speakers, this topic is often the most rewarding: it is full of words you have heard all your life but may never have spelled.',
        },
      ],
    },
    {
      id: 'learners-and-diaspora',
      heading: 'For learners, heritage speakers and Armenians abroad',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Learners:** start with a small grid on easy. Easy clues use common words and plain definitions, so each clue is a short reading exercise with a reward at the end.',
            '**Heritage speakers who speak but rarely read:** a crossword makes you read every clue and spell every answer letter by letter. Within a few puzzles the difference between ռ and ր, or between տ, թ and դ, starts to feel natural.',
            '**Parents and Saturday-school teachers:** save the puzzle as a PDF, in color or black and white, with a separate page of answers, and hand it out in class. The [guide for teachers](/guides/crosswords-for-teachers) has more ideas.',
            '**Families spread across countries:** share a link in the family chat. Relatives in Yerevan, Los Angeles or Paris get the very same grid and clues, free and without signing up, and can see who finishes first.',
          ],
        },
        {
          kind: 'p',
          text: 'You will not see the same word twice. Each device remembers the words it has already shown you, and every new puzzle leaves them out, so practice keeps bringing new vocabulary instead of recycling the easy answers.',
        },
        {
          kind: 'tip',
          text: 'If a clue looks wrong, too obscure, or spelled in a way you think is mistaken, report it from the puzzle menu. Reported clues are reviewed and retired, so the next solver does not meet them.',
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to start your first Armenian crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Open the Armenian site with the buttons at the end of this page, or choose Հայերեն in the language menu in the header or footer. The puzzle is always in the language the site is in.',
            'Pick Խաչբառ (crossword) or Սկանվորդ (scanword).',
            'Pick a topic, a size (small, medium or large) and a difficulty (easy, medium or hard).',
            'Create the puzzle and start typing. Use check and reveal for a letter, a word or the whole grid whenever you get stuck.',
          ],
        },
        {
          kind: 'p',
          text: 'Your progress is saved on the device, so you can stop halfway and come back later. You can also install the site as an app, and puzzles you have already opened keep working without a connection, which is handy on a long flight to Yerevan. For a walk through every option, see [how to make a crossword](/guides/how-to-make-a-crossword), and if you also read Russian, the [Russian crossword guide](/guides/russian-crossword) covers its own quirks, such as ё.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Can I play a crossword in Armenian online?',
      answer:
        'Yes. Switch the site to Armenian and every puzzle is made in Armenian, with Armenian words, Armenian clues and Armenian menus. It works in the browser on a phone or a computer, with an on-screen Armenian keyboard on touch screens.',
    },
    {
      question: 'Is it Eastern or Western Armenian?',
      answer:
        'Eastern Armenian, in the reformed spelling used in the Republic of Armenia. Western Armenian speakers will understand most clues, but the spelling follows the Eastern standard, for example «գյուղ» rather than «գիւղ».',
    },
    {
      question: 'How do I type ու and և?',
      answer:
        'On a touch screen, ու and և each have their own key on the on-screen keyboard. On a computer, type ո and then ւ and they join in one square; with an English layout, that is W and then U. The 7 key gives և.',
    },
    {
      question: 'What does khachbar mean?',
      answer:
        '«Խաչբառ» (khachbar, also written xachbar) is the Armenian word for a crossword, from խաչ (cross) and բառ (word). The clue-in-the-grid version is called «սկանվորդ» (skanvord).',
    },
    {
      question: 'Is the Armenian crossword free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that there are one-time credit packs, with no subscription, and opening a puzzle someone shared with you is always free. See the [credits page](/credits).',
    },
    {
      question: 'Can I print an Armenian crossword for a class?',
      answer:
        'Yes. Open the puzzle, choose Save as PDF and pick color or black and white. You can add a separate page with the answers, which makes checking a class set quick.',
    },
  ],
  related: ['make', 'language-ru'],
}
