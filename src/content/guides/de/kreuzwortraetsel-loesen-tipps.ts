import type { Guide } from '../../types'

export const kreuzwortraetselLoesenTipps: Guide = {
  key: 'solve',
  slug: 'kreuzwortraetsel-loesen-tipps',
  title: 'Kreuzworträtsel lösen: Tipps und Tricks, mit denen du schneller ans Ziel kommst',
  shortTitle: 'Tipps zum Kreuzworträtsel lösen',
  metaTitle: 'Kreuzworträtsel lösen: Tipps und Tricks für jedes Rätsel',
  description:
    'Kreuzworträtsel lösen leicht gemacht: Tipps für den Einstieg, Fragetypen erkennen, was hilft, wenn du festhängst, und wie du von Leicht zu Schwer kommst.',
  searchTerms: [
    'kreuzworträtsel lösen tipps',
    'kreuzworträtsel lösen',
    'kreuzworträtsel tricks',
    'wie löst man kreuzworträtsel',
    'kreuzworträtsel lösen lernen',
    'kreuzworträtsel für anfänger',
    'kreuzwortraetsel loesen',
    'kreuzworträtsel online lösen',
    'kreuzworträtsel hilfe',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Kreuzworträtsel lösen ist weniger eine Frage des Wissens als der Technik. Wer weiß, wo man anfängt, wie man Kreuzungen nutzt und was eine Frage eigentlich sagen will, kommt auch durch ein Rätsel, bei dem die Hälfte der Antworten zunächst ein Rätsel bleibt. Die gute Nachricht: Diese Technik lässt sich üben, und zwar schneller, als man denkt.',
    'Hier findest du die Tipps, die erfahrene Rätselfreunde meist gar nicht mehr bewusst anwenden, vom ersten Durchgang über die typischen Fragetypen bis zu den Momenten, in denen gar nichts mehr geht. Am Ende steht ein einfacher Plan, wie du dich vom leichten zum schweren Rätsel hocharbeitest.',
  ],
  sections: [
    {
      id: 'erster-durchgang',
      heading: 'Der erste Durchgang: Erst das Sichere eintragen',
      blocks: [
        {
          kind: 'p',
          text: 'Lies zu Beginn nicht jede Frage gründlich, sondern geh die Liste zügig durch und trag nur ein, was du sofort weißt. Kurze Wörter mit drei oder vier Buchstaben sind dabei Gold wert: Sie stehen oft an Kreuzungen und liefern Anfangsbuchstaben für längere Wörter.',
        },
        {
          kind: 'list',
          items: [
            'Fang mit Fragen an, die nach Fakten fragen: Hauptstädte, Flüsse, Tiere. Da gibt es kein Vielleicht.',
            'Lückentexte wie „Morgenstund hat … im Mund“ sind fast immer schnelle Punkte.',
            'Lass Fragen, bei denen du zögerst, zunächst leer. Ein falscher Buchstabe kostet später mehr Zeit als ein leeres Kästchen.',
          ],
        },
        {
          kind: 'tip',
          text: 'Im Schwedenrätsel gilt dasselbe: Arbeite dich vom Rand aus vor, wo die Fragen dicht beieinanderstehen, und lass dich von den Pfeilen leiten.',
        },
      ],
    },
    {
      id: 'kreuzungen-nutzen',
      heading: 'Kreuzungen nutzen: Jeder Buchstabe hilft zweimal',
      blocks: [
        {
          kind: 'p',
          text: 'Das Prinzip des Kreuzworträtsels ist zugleich sein bester Trick. Jeder Buchstabe gehört zu zwei Wörtern, waagerecht und senkrecht. Wenn ein Wort feststeckt, wechsle die Richtung: Oft löst eine Antwort quer dazu den Knoten.',
        },
        {
          kind: 'p',
          text: 'Achte auch auf die Form der Frage. Steht sie im Plural, ist die Antwort meist auch ein Plural, oft auf -en oder -er. Fragt sie mit einem Verb, wird die Antwort in derselben Form erwartet. Typische deutsche Endungen wie -ung, -heit, -keit oder -chen kann man manchmal schon eintragen, bevor man das ganze Wort kennt.',
        },
      ],
    },
    {
      id: 'fragetypen',
      heading: 'Welche Fragetypen gibt es?',
      blocks: [
        {
          kind: 'p',
          text: 'Nicht jede Frage funktioniert gleich. Wer den Typ erkennt, weiß, wonach er suchen muss.',
        },
        {
          kind: 'list',
          items: [
            '**Umschreibung**: die häufigste Form. „Gegenteil von warm“ führt zu KALT.',
            '**Synonym**: ein einziges Wort, das dieselbe Bedeutung hat wie die Antwort. „Gattin“ sucht FRAU.',
            '**Wissensfrage**: Geografie, Geschichte, Kunst. „Hauptstadt von Bayern“ ist MÜNCHEN.',
            '**Lückentext**: ein Sprichwort, ein Titel oder eine feste Wendung mit einer Lücke.',
            '**Um die Ecke gedacht**: Die Frage meint etwas anderes, als sie zuerst sagt. Solche Fragen tauchen vor allem bei Schwer auf und sind die Kür des Rätselns.',
          ],
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Gegenteil von warm', answer: 'kalt' },
            { clue: 'Hauptstadt von Bayern', answer: 'München' },
            { clue: 'Morgenstund hat … im Mund', answer: 'Gold' },
            { clue: 'Arbeitet mit Kelle und Mörtel', answer: 'Maurer' },
            { clue: 'Hat Zähne, beißt aber nie', answer: 'Kamm' },
          ],
        },
        {
          kind: 'compare',
          weak: 'Baum (5 Buchstaben)',
          strong: 'Baum mit weißer Rinde (5 Buchstaben)',
        },
        {
          kind: 'p',
          text: 'Bei der ersten Frage kommen Eiche, Linde und Esche in Betracht, bei der zweiten nur die Birke. Je knapper eine Frage ist, desto wichtiger werden die Kreuzungen.',
        },
      ],
    },
    {
      id: 'wenn-du-festhaengst',
      heading: 'Was tun, wenn nichts mehr geht?',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Pause machen.** Nach fünf Minuten Abstand sieht man eine Antwort oft sofort, die vorher unsichtbar war.',
            '**Die Frage anders lesen.** Ist „Bank“ ein Möbelstück oder ein Geldinstitut? Ist „Schloss“ ein Gebäude oder etwas an der Tür?',
            '**Das Alphabet durchgehen.** Wenn zwei oder drei Buchstaben stehen, probiere im Kopf die fehlenden Buchstaben der Reihe nach durch.',
            '**Den eigenen Eintrag anzweifeln.** Hängt ein ganzer Bereich fest, steckt oft ein falsches Wort darin.',
          ],
        },
        {
          kind: 'p',
          text: 'Und wenn auch das nicht hilft, ist Hilfe kein Schummeln. Beim Online-Lösen kannst du gezielt einen Buchstaben, ein Wort oder das ganze Rätsel **prüfen**: Falsche Buchstaben werden durchgestrichen, richtige festgehalten. **Aufdecken** trägt einen Buchstaben, ein Wort oder alles ein, aufgedeckte Felder bekommen ein kleines Fähnchen. Ein einziger aufgedeckter Buchstabe reicht oft, damit der Rest wieder ins Rollen kommt.',
        },
      ],
    },
    {
      id: 'werkzeuge',
      heading: 'Werkzeuge beim Online-Rätseln',
      blocks: [
        {
          kind: 'p',
          text: 'Wer ein Kreuzworträtsel online löst, hat ein paar Helfer, die auf Papier fehlen. Du findest sie im Menü des Rätsels und in den Einstellungen:',
        },
        {
          kind: 'list',
          items: [
            '„Beim Tippen prüfen“ markiert einen falschen Buchstaben, sobald er im Feld steht. Gut zum Lernen, für Ehrgeizige eher aus.',
            '„Gefüllte Felder überspringen“ lässt die Schreibmarke über Felder springen, die schon einen Buchstaben haben.',
            '„Falsche Buchstaben löschen“ räumt nach einer Prüfung auf, ohne die richtigen anzufassen.',
            'Der Timer zeigt, wie lange du brauchst, und mit dem Zoom behältst du auch ein großes Gitter auf dem Handy im Blick.',
          ],
        },
        {
          kind: 'tip',
          text: 'Du kannst jederzeit aufhören. Deine Buchstaben bleiben auf dem Gerät gespeichert, und angefangene Rätsel findest du unter „Meine Rätsel“ wieder.',
        },
      ],
    },
    {
      id: 'ueben',
      heading: 'So wirst du besser: von Leicht zu Schwer',
      blocks: [
        {
          kind: 'p',
          text: 'Am schnellsten lernt man mit Rätseln, die knapp unter der eigenen Grenze liegen. Ein Plan, der sich bewährt hat:',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Beginne mit **Klein** und **Leicht**, bis du ein Rätsel ohne Aufdecken schaffst.',
            'Wechsle zu **Mittel** bei der Größe, die Schwierigkeit bleibt Leicht. Jetzt trainierst du Ausdauer.',
            'Stell die Schwierigkeit auf **Mittel**. Die Fragen werden knapper und verlangen mehr Allgemeinwissen.',
            'Wage dich an **Schwer** und **Groß**. Hier zählt jede Kreuzung, und um die Ecke gedachte Fragen werden häufiger.',
          ],
        },
        {
          kind: 'p',
          text: 'Abwechslung hilft ebenfalls. Wer immer nur [Alltagswörter](/topics/general) löst, sollte es einmal mit [Geschichte](/topics/history) oder [Wissenschaft](/topics/science) versuchen. Und da sich dein Gerät jedes Wort merkt, das du schon hattest, begegnet dir in jedem neuen Rätsel neuer Wortschatz. Wie die Steuerung im Einzelnen funktioniert, steht in der [Spielanleitung](/rules).',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Wo fange ich bei einem Kreuzworträtsel am besten an?',
      answer:
        'Bei den Fragen, die du sicher weißt, und bei kurzen Wörtern. Sie liefern Buchstaben für die Kreuzungen. Lass unsichere Fragen erst einmal leer und komm später zurück.',
    },
    {
      question: 'Ist es Schummeln, eine Lösung aufzudecken?',
      answer:
        'Nein, solange es dir Spaß macht. Ein aufgedeckter Buchstabe bringt dich oft weiter, ohne das Rätsel zu verderben. Aufgedeckte Felder tragen ein kleines Fähnchen, so siehst du hinterher, wo du Hilfe hattest.',
    },
    {
      question: 'Wie werde ich beim Kreuzworträtsel schneller?',
      answer:
        'Durch regelmäßiges Üben, idealerweise täglich ein kleines Rätsel. Mit der Zeit erkennst du Fragetypen und typische Endungen sofort. Der Timer zeigt dir, wie du vorankommst.',
    },
    {
      question: 'Was bedeutet „um die Ecke gedacht“?',
      answer:
        'So nennt man Rätselfragen, die mit Doppeldeutigkeiten spielen: Die naheliegende Lesart führt in die Irre, die gesuchte Antwort steckt in einer zweiten Bedeutung. Solche Fragen begegnen dir vor allem in schweren Rätseln.',
    },
    {
      question: 'Wie schreibe ich Ä, Ö, Ü und ß ins Gitter?',
      answer:
        'Ä, Ö und Ü haben jeweils ein eigenes Kästchen und eigene Tasten auf der Bildschirmtastatur. ß wird als SS geschrieben und belegt damit zwei Kästchen.',
    },
  ],
  related: ['make', 'scanword', 'language-de'],
}
