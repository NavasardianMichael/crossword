import type { Guide } from '../../types'

export const germanCrossword: Guide = {
  key: 'language-de',
  slug: 'german-crossword',
  title: 'German crossword puzzles online: Kreuzworträtsel and Schwedenrätsel written in German',
  shortTitle: 'German crossword',
  metaTitle: 'German Crossword Puzzles Online (Kreuzworträtsel)',
  description:
    'Play a German crossword online: Kreuzworträtsel and Schwedenrätsel with clues written natively in German, umlauts in one square, ß as ss. For learners too.',
  searchTerms: [
    'german crossword',
    'german crossword puzzle',
    'crossword in german',
    'german crossword online',
    'german crossword for learners',
    'kreuzworträtsel',
    'kreuzwortraetsel online',
    'schwedenrätsel',
    'kreuzworträtsel deutsch',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A German crossword is a natural companion for anyone learning German, and a familiar pleasure for anyone who grew up with it. German has a word for every kind of puzzle: the classic **Kreuzworträtsel**, the arrowword known as the **Schwedenrätsel** (Swedish puzzle), and whole magazines of both on every station newsstand.',
    'Every puzzle on this site is made in German from scratch: the words and clues are written natively in German, never translated from English, and code checks every answer against the German alphabet before it reaches the grid. The buttons at the end of this page open the German version of the site, where words, clues and menus are all in German.',
  ],
  sections: [
    {
      id: 'umlauts-and-eszett',
      heading: 'Umlauts, ß and long compound words',
      blocks: [
        {
          kind: 'p',
          text: 'German brings three questions to every crossword: what happens to the umlauts, what happens to ß, and what about those famously long words? Here is how this site answers them.',
        },
        {
          kind: 'list',
          items: [
            '**ä, ö and ü keep one square each.** Many printed German puzzles spell umlauts out as AE, OE and UE. Here they stay letters of their own, so «Bär» (bear) fills three squares: B, Ä, R.',
            '**ß is written ss.** Grid letters are capitals, and capital letters have traditionally written ß as SS, so «Straße» (street) goes in as STRASSE, seven squares. Swiss readers will feel at home, since Swiss German spells it that way anyway.',
            '**Other accents fold.** A borrowed word such as «Café» goes in as CAFE.',
            '**Compounds count if the dictionary has them.** «Haustür» (front door) is one word in German, so it is a fair answer; a phrase with a space or a hyphen is not.',
          ],
        },
        {
          kind: 'tip',
          text: 'On a phone, the on-screen German keyboard uses the QWERTZ layout, with ü, ö and ä at the ends of the rows, just where a German keyboard has them. You never need to type ß: two s keys do the job.',
        },
      ],
    },
    {
      id: 'kreuzwortraetsel-and-schwedenraetsel',
      heading: 'Kreuzworträtsel and Schwedenrätsel',
      blocks: [
        {
          kind: 'p',
          text: 'The **Kreuzworträtsel** is the classic grid with numbered squares and two lists of clues, Waagerecht (across) and Senkrecht (down). Weekly newspapers have made a sport of it; the clues in a hard German puzzle often take a sideways route to the answer. The **Schwedenrätsel** puts every clue inside the grid in a small box, with an arrow showing which way the answer runs. It is the format of most German puzzle magazines and the one people solve on the train.',
        },
        {
          kind: 'p',
          text: 'On this site the two are called Kreuzworträtsel and Schwedenrätsel. A good German clue points to exactly one answer, as this pair for «Igel» (hedgehog) shows:',
        },
        {
          kind: 'compare',
          weak: 'Tier im Garten (an animal in the garden)',
          strong: 'Stacheliger Schneckenjäger (a prickly snail hunter)',
        },
        {
          kind: 'list',
          items: [
            'Choose a [crossword](/crossword) to read all the clues first or to print the grid.',
            'Choose a [scanword](/scanword), the Schwedenrätsel, for a quick game on a phone. The [guide to scanwords and arrowwords](/guides/scanword-arrowword-puzzles) explains the arrows.',
          ],
        },
      ],
    },
    {
      id: 'german-for-learners',
      heading: 'German crosswords for learners',
      blocks: [
        {
          kind: 'p',
          text: 'German spelling is regular, which makes it friendly for crosswords: once you remember a word, you can usually write it. Clues are written in German, so every puzzle is also reading practice, and the answers are mostly nouns in the singular, the part of German vocabulary learners spend the most time on.',
        },
        {
          kind: 'list',
          items: [
            '**Beginners (A1–A2):** a small grid on easy, with about 8 to 14 everyday words like «Tisch» (table), «Apfel» (apple) or «Brot» (bread).',
            '**Intermediate (B1–B2):** a medium grid on medium difficulty brings compounds and idioms.',
            '**Heritage speakers:** if you speak German at home but rarely write it, the grid makes you spell every word, umlauts included.',
            '**Teachers:** save the grid as a PDF with an answer page, or share a link with the class.',
          ],
        },
        {
          kind: 'p',
          text: 'Each device remembers the words it has already shown, so every new puzzle brings new vocabulary instead of repeating the same ones.',
        },
      ],
    },
    {
      id: 'german-culture',
      heading: 'A crossword about German culture',
      blocks: [
        {
          kind: 'p',
          text: 'Among the twelve topics, [local culture](/topics/local-culture) is about the culture of the puzzle’s language. On the German site it is Deutsche Kultur: traditions, food, festivals, music and places, the kind of thing you meet at a Christmas market or on a walk through an old town, with words like «Brezel» (pretzel) or «Fachwerk» (half-timbering). Proper names such as rivers and cities appear only in this topic and in geography.',
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to start a German crossword',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Open the German site with the buttons at the end of this page, or choose Deutsch in the language menu. The puzzle is always in the language the site is in.',
            'Pick Kreuzworträtsel or Schwedenrätsel, then a topic, a size and a difficulty.',
            'Create the puzzle and start typing. Check or reveal a letter, a word or the whole grid when you get stuck.',
          ],
        },
        {
          kind: 'p',
          text: 'Progress is saved on the device, and you can install the site as an app that keeps opened puzzles working offline. For every option, read [how to make a crossword](/guides/how-to-make-a-crossword). The [Dutch crossword](/guides/dutch-crossword) and [Swedish crossword](/guides/swedish-crossword) guides cover the neighbors, including where the Schwedenrätsel got its name.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Can I do a German crossword online?',
      answer:
        'Yes. Switch the site to German and every puzzle is made in German, with German words, clues and menus. It runs in the browser on a phone or a computer.',
    },
    {
      question: 'How are umlauts written in the crossword?',
      answer:
        'Each umlaut keeps its own square: ä, ö and ü are letters of their own, not AE, OE and UE. On a phone, the on-screen keyboard has a key for each.',
    },
    {
      question: 'How do I type ß?',
      answer: 'You do not. The grid writes ß as ss, as capital letters traditionally do, so «Fuß» goes in as FUSS.',
    },
    {
      question: 'What is a Schwedenrätsel?',
      answer:
        'It is the German name for an arrowword: a crossword with the clues inside the grid and arrows pointing to the answers. It is the scanword format on this site.',
    },
    {
      question: 'Is it free?',
      answer:
        'Your first puzzle each month is free, no account needed. After that there are one-time credit packs, no subscription, and opening a shared puzzle is always free. See the [credits page](/credits).',
    },
  ],
  related: ['make', 'language-nl', 'language-sv'],
}
