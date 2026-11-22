import type { Guide } from '../../types'

export const kreuzwortraetselAufDeutsch: Guide = {
  key: 'language-de',
  slug: 'kreuzwortraetsel-auf-deutsch',
  title: 'Kreuzworträtsel auf Deutsch: Umlaute, ß und die deutsche Rätseltradition',
  shortTitle: 'Kreuzworträtsel auf Deutsch',
  metaTitle: 'Kreuzworträtsel auf Deutsch online: Umlaute, ß, Tradition',
  description:
    'Kreuzworträtsel auf Deutsch online: wie Ä, Ö, Ü und ß ins Gitter kommen, was die deutsche Rätseltradition ausmacht und warum die Fragen nicht übersetzt sind.',
  searchTerms: [
    'kreuzworträtsel auf deutsch',
    'deutsche kreuzworträtsel online',
    'kreuzworträtsel deutsch',
    'deutsches kreuzworträtsel',
    'kreuzworträtsel umlaute',
    'kreuzworträtsel ß',
    'kreuzworträtsel deutsch lernen',
    'german crossword',
    'kreuzwortraetsel deutsch',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Ein Kreuzworträtsel auf Deutsch ist mehr als ein englisches Rätsel mit deutschen Wörtern. Die Sprache bringt eigene Buchstaben mit, eigene Wortbildung und eine lange Rätseltradition, vom Heft am Kiosk bis zur Rätselseite der Wochenendzeitung. Wer deutsche Kreuzworträtsel online lösen will, möchte genau das wiederfinden: Fragen, die nach Deutsch klingen, und ein Gitter, das mit Umlauten richtig umgeht.',
    'In diesem Ratgeber erfährst du, wie Ä, Ö, Ü und ß hier ins Gitter kommen, was deutsche Rätsel besonders macht, warum die Fragen direkt auf Deutsch geschrieben und nicht übersetzt sind und wie du am besten anfängst.',
  ],
  sections: [
    {
      id: 'umlaute-und-ss',
      heading: 'Ä, Ö, Ü und ß: Wie deutsche Buchstaben ins Gitter kommen',
      blocks: [
        {
          kind: 'p',
          text: 'Das Gitter kennt die 26 Buchstaben des Grundalphabets und dazu **Ä, Ö und Ü** als eigene Buchstaben. Jeder Umlaut belegt genau ein Kästchen: MÜNCHEN hat sieben Felder, nicht acht. In vielen gedruckten Rätselheften werden Umlaute dagegen als AE, OE und UE geschrieben. Hier bleibt das Ü ein Ü, so wie du das Wort auch sonst schreibst.',
        },
        {
          kind: 'p',
          text: 'Beim **ß** ist es umgekehrt. Es wird, wie in den meisten deutschen Rätseln, als **SS** geschrieben und belegt damit zwei Kästchen. Aus Straße wird STRASSE mit sieben Feldern, aus Fuß wird FUSS. Für Rätselfreunde aus der Schweiz ändert sich dadurch nichts, dort schreibt man ohnehin ss.',
        },
        {
          kind: 'list',
          items: [
            '**Ä, Ö, Ü**: eigene Buchstaben, je ein Kästchen.',
            '**ß**: wird SS, also zwei Kästchen.',
            '**Akzente in Fremdwörtern**: Aus Café wird CAFE, der Akzent fällt weg.',
            '**Groß und klein**: Im Gitter steht alles in Großbuchstaben. Ob Nomen oder Verb, verrät dir nur die Frage.',
          ],
        },
        {
          kind: 'tip',
          text: 'Auf dem Handy erscheint unter dem Gitter eine QWERTZ-Tastatur mit eigenen Tasten für Ü, Ö und Ä. Eine ß-Taste gibt es nicht: Du tippst einfach zweimal S. Am Computer schreibst du mit der normalen Tastatur, auch eine englische Belegung funktioniert.',
        },
      ],
    },
    {
      id: 'deutsche-raetseltradition',
      heading: 'Die deutsche Rätseltradition',
      blocks: [
        {
          kind: 'p',
          text: 'Das erste Kreuzworträtsel erschien 1913 in der New York World, erfunden von Arthur Wynne. In den 1920er-Jahren erreichte die Begeisterung auch Europa, und im deutschsprachigen Raum ist sie seitdem nicht mehr abgeklungen. Rätselhefte füllen ganze Regale am Kiosk, kaum eine Fernsehzeitschrift kommt ohne Rätselseite aus, und viele Zeitungen haben ihr eigenes Wochenendrätsel.',
        },
        {
          kind: 'list',
          items: [
            '**Das Schwedenrätsel** ist die wohl verbreitetste Form in deutschen Heften: Fragen im Gitter, Pfeile zur Antwort. Mehr dazu im Ratgeber [Schwedenrätsel](/guides/schwedenraetsel).',
            '**Das klassische Kreuzworträtsel** mit Fragen waagerecht und senkrecht ist die Form der Zeitungen und der großen Wochenendrätsel.',
            '**Um die Ecke gedacht** nennt man Rätsel, deren Fragen mit Doppeldeutigkeiten spielen. Sie gelten als Königsdisziplin.',
            '**Silbenrätsel** und andere Wortspiele gehören ebenfalls zum Repertoire vieler Rätselhefte.',
          ],
        },
        {
          kind: 'p',
          text: 'Zur Tradition gehört auch eine eigene Rätselsprache. Manche kurzen Wörter tauchen so oft auf, dass sie jeder erfahrene Rätsler kennt: der Papagei ARA, der Laufvogel EMU, die Wasserstelle OASE, der Baum ERLE. Ihre Buchstabenfolgen passen einfach besonders gut in Kreuzungen.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Südamerikanischer Papagei', answer: 'Ara' },
            { clue: 'Australischer Laufvogel', answer: 'Emu' },
            { clue: 'Wasserstelle in der Wüste', answer: 'Oase' },
            { clue: 'Baum am Bachufer', answer: 'Erle' },
            { clue: 'Schwung, Begeisterung', answer: 'Elan' },
            { clue: 'Weg mit Gehsteig und Fahrbahn', answer: 'Straße' },
          ],
        },
      ],
    },
    {
      id: 'deutsche-woerter-im-gitter',
      heading: 'Was deutsche Wörter im Gitter besonders macht',
      blocks: [
        {
          kind: 'p',
          text: 'Deutsch liebt zusammengesetzte Wörter. Das ist ein Geschenk für Rätselfreunde: Aus Haus und Tür wird HAUSTÜR, aus Apfel und Baum APFELBAUM, und schon bei den ersten Buchstaben ahnt man oft den Rest. Gleichzeitig muss jede Antwort ein einziges Wort sein, ohne Leerzeichen, Bindestrich oder Ziffer. Wortgruppen und Bindestrichwörter kommen deshalb nicht ins Gitter.',
        },
        {
          kind: 'p',
          text: 'Auch die Grammatik hilft beim Lösen. Fragt eine Frage im Plural, steht die Antwort meist im Plural. Typische Endungen wie -ung, -heit, -keit oder -chen lassen sich oft schon eintragen, bevor das Wort ganz feststeht. Weitere Tricks findest du in unseren [Tipps zum Kreuzworträtsel lösen](/guides/kreuzwortraetsel-loesen-tipps).',
        },
      ],
    },
    {
      id: 'warum-deutsche-fragen',
      heading: 'Warum die Fragen auf Deutsch geschrieben und nicht übersetzt sind',
      blocks: [
        {
          kind: 'p',
          text: 'Ein übersetztes Rätsel merkt man sofort. Die Fragen klingen steif, Redewendungen gehen verloren, und Antworten, die im Englischen kurz und rätseltauglich sind, werden im Deutschen lang und sperrig. Deshalb schreibt ein KI-Modell die Wörter und Fragen für jedes deutsche Rätsel direkt auf Deutsch, mit deutschen Sprichwörtern, Orten und Gerichten.',
        },
        {
          kind: 'compare',
          weak: 'Edles gelbes Metall (4 Buchstaben)',
          strong: 'Morgenstund hat … im Mund (4 Buchstaben)',
        },
        {
          kind: 'p',
          text: 'Die erste Frage ist richtig, aber blass, und sie ließe sich in jede Sprache übertragen. Die zweite lebt von einem Sprichwort, das hierzulande jedes Kind kennt und das keine Übersetzung hervorgebracht hätte. Nach dem Schreiben prüft Code, nicht das Modell, jedes Wort gegen das deutsche Alphabet und zählt seine Länge in Kästchen. Was nicht passt, wird verworfen statt repariert. Und weil sich dein Gerät jedes gezeigte Wort merkt, wiederholt sich keine Antwort.',
        },
        {
          kind: 'p',
          text: 'Wer es besonders heimatverbunden mag, wählt das Thema [Deutsche Kultur](/topics/local-culture) mit Festen, Bräuchen, Gerichten und Orten aus Deutschland.',
        },
      ],
    },
    {
      id: 'so-faengst-du-an',
      heading: 'So fängst du mit deutschen Kreuzworträtseln online an',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Achte darauf, dass die Seite auf Deutsch eingestellt ist. Die Rätselsprache ist immer die Sprache der Seite.',
            'Wähle ein [Kreuzworträtsel](/crossword) oder ein [Schwedenrätsel](/scanword).',
            'Such dir ein Thema aus oder lass die Themen mischen.',
            'Fang mit Klein und Leicht an und steigere dich, sobald es leicht von der Hand geht.',
          ],
        },
        {
          kind: 'p',
          text: 'Das Rätsel läuft im Browser auf Handy, Tablet und Computer. Du kannst Buchstaben, Wörter oder das ganze Rätsel prüfen, bei Bedarf aufdecken, als PDF speichern oder per Link mit Freunden teilen.',
        },
        {
          kind: 'tip',
          text: 'Du lernst Deutsch? Dann ist ein leichtes deutsches Kreuzworträtsel eine schöne Übung für Wortschatz und Rechtschreibung, gerade wegen der Umlaute und des ß.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Werden Umlaute im Kreuzworträtsel als AE, OE und UE geschrieben?',
      answer:
        'Hier nicht. Ä, Ö und Ü sind eigene Buchstaben und belegen jeweils ein Kästchen. Auf der Bildschirmtastatur haben sie eigene Tasten.',
    },
    {
      question: 'Wie schreibe ich ß im Kreuzworträtsel?',
      answer: 'Als SS, also in zwei Kästchen. Straße steht als STRASSE im Gitter. Auf der Tastatur tippst du einfach zweimal S.',
    },
    {
      question: 'Sind die deutschen Kreuzworträtsel aus dem Englischen übersetzt?',
      answer:
        'Nein. Wörter und Fragen werden direkt auf Deutsch geschrieben und danach vom Code geprüft. Übersetzte Fragen würden Redewendungen und Wortspiele verlieren.',
    },
    {
      question: 'Kann ich deutsche Kreuzworträtsel online kostenlos lösen?',
      answer:
        'Dein erstes Rätsel jeden Monat ist kostenlos, ohne Konto. Danach gibt es einmalige Guthabenpakete, kein Abo. Ein geteiltes Rätsel zu öffnen ist immer kostenlos. Mehr unter [Guthaben](/credits).',
    },
    {
      question: 'Eignen sich die Rätsel für Deutschlernende?',
      answer:
        'Ja, vor allem in der Schwierigkeit Leicht. Die Fragen sind dann direkte Umschreibungen geläufiger Wörter, und die Kreuzungen helfen bei der Rechtschreibung.',
    },
  ],
  related: ['scanword', 'solve', 'teachers'],
}
