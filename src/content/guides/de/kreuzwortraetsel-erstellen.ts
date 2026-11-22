import type { Guide } from '../../types'

export const kreuzwortraetselErstellen: Guide = {
  key: 'make',
  slug: 'kreuzwortraetsel-erstellen',
  title: 'Kreuzworträtsel erstellen: So machst du in wenigen Minuten dein eigenes Rätsel online',
  shortTitle: 'Kreuzworträtsel erstellen',
  metaTitle: 'Kreuzworträtsel erstellen: Generator, Schritt für Schritt',
  description:
    'Kreuzworträtsel erstellen in wenigen Minuten: Format, Thema und Schwierigkeit wählen, online lösen, per Link teilen oder als PDF mit Lösung drucken.',
  searchTerms: [
    'kreuzworträtsel erstellen',
    'kreuzworträtsel generator',
    'kreuzworträtsel selbst machen',
    'kreuzworträtsel selber erstellen',
    'kreuzworträtsel online erstellen',
    'kreuzworträtsel erstellen kostenlos',
    'kreuzworträtsel zum ausdrucken erstellen',
    'kreuzwortraetsel erstellen',
    'kreutzworträtsel erstellen',
    'crossword maker deutsch',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Wer schon einmal ein Kreuzworträtsel erstellen wollte, kennt das Problem: Die Wörter müssen sich sauber kreuzen, kein Kästchen darf übrig bleiben, und zu jedem Wort braucht es eine Frage, die fair ist und trotzdem nicht alles verrät. Von Hand dauert das schnell einen ganzen Abend. Ein Kreuzworträtsel-Generator nimmt dir das Puzzeln am Gitter ab, damit du dich um das Wesentliche kümmern kannst: Worum soll es gehen, und wer soll es lösen?',
    'In diesem Ratgeber gehen wir Schritt für Schritt durch, wie du online ein Kreuzworträtsel machst, vom ersten Klick bis zum fertigen Gitter, das du auf dem Handy löst, an Freunde schickst oder für die Klasse ausdruckst. Dazu gibt es ein paar Hinweise, woran man eine gute Rätselfrage erkennt.',
  ],
  sections: [
    {
      id: 'format-waehlen',
      heading: 'Schritt 1: Kreuzworträtsel oder Schwedenrätsel?',
      blocks: [
        {
          kind: 'p',
          text: 'Zuerst entscheidest du dich für eine Form. Das **klassische Kreuzworträtsel** hat nummerierte Kästchen und zwei Fragenlisten neben dem Gitter, waagerecht und senkrecht. Beim **Schwedenrätsel** stehen die Fragen direkt im Gitter, und ein kleiner Pfeil zeigt, wo die Antwort hineingehört. Gelöst wird beides mit denselben Wörtern und demselben Kopf, es liest sich nur anders.',
        },
        {
          kind: 'list',
          items: [
            'Nimm ein [Kreuzworträtsel](/crossword), wenn du drucken willst, wenn du mit einer Klasse arbeitest oder wenn du gern erst alle Fragen überfliegst.',
            'Nimm ein [Schwedenrätsel](/scanword) für zwischendurch auf dem Handy: Die Frage steht genau dort, wo du schreibst, du musst also nicht zwischen Gitter und Liste hin- und herspringen.',
          ],
        },
        {
          kind: 'tip',
          text: 'Unschlüssig? Fang mit einem kleinen klassischen Kreuzworträtsel an. Es dauert zehn bis fünfzehn Minuten und ist damit genau richtig für einen ersten Versuch oder als Einstieg in eine Unterrichtsstunde.',
        },
      ],
    },
    {
      id: 'thema-waehlen',
      heading: 'Schritt 2: Ein Thema aussuchen',
      blocks: [
        {
          kind: 'p',
          text: 'Erst das Thema gibt einem Rätsel Charakter. Wenn alle Antworten Tiere, Gerichte oder Sportgeräte sind, merkt man dem Rätsel an, dass es für jemanden gemacht ist, und das Erkennen des roten Fadens macht schon die halbe Freude aus. Gemischte Rätsel ohne Thema eignen sich dagegen gut zum Üben, wenn du Abwechslung willst.',
        },
        {
          kind: 'p',
          text: 'Zur Wahl stehen zwölf [Themen](/topics), darunter [Tiere](/topics/animals), Essen und Trinken, Geografie, Geschichte und [Deutsche Kultur](/topics/local-culture) mit Festen, Bräuchen, Gerichten und Orten aus Deutschland. Gerade das letzte Thema ist beliebt für Familienfeiern, weil jeder etwas beitragen kann.',
        },
      ],
    },
    {
      id: 'groesse-und-schwierigkeit',
      heading: 'Schritt 3: Größe und Schwierigkeit festlegen',
      blocks: [
        {
          kind: 'p',
          text: 'Die Größe bestimmt, wie lange das Rätsel dauert, die Schwierigkeit, wie knifflig jede einzelne Frage ist. Beides lässt sich getrennt einstellen, und das hat einen Grund: Ein kleines schweres Rätsel ist eine schnelle Kopfnuss, ein großes leichtes eine entspannte halbe Stunde mit einer Tasse Kaffee.',
        },
        {
          kind: 'list',
          items: [
            '**Klein**: ein Gitter mit 9×9 Feldern und etwa 8 bis 14 Wörtern. Gut für Kinder, Einsteiger und die kurze Pause.',
            '**Mittel**: 13×13 Felder mit 16 bis 24 Wörtern. Die Alltagsgröße für die meisten Rätselfreunde.',
            '**Groß**: 15×15 Felder mit 22 bis 34 Wörtern, so groß wie das Kreuzworträtsel in der Wochenendzeitung.',
          ],
        },
        {
          kind: 'p',
          text: 'Bei **Leicht** sind die Fragen direkte Umschreibungen geläufiger Wörter. **Schwer** greift zu selteneren Wörtern, verlangt Allgemeinwissen und spielt auch mal mit Doppeldeutigkeiten. **Mittel** liegt dazwischen und passt den meisten Erwachsenen. Das Schwedenrätsel gibt es übrigens ebenfalls in drei Größen: 8×10, 10×13 und 13×17 Felder.',
        },
      ],
    },
    {
      id: 'was-die-ki-macht',
      heading: 'Schritt 4: Die KI schreibt Wörter und Fragen',
      blocks: [
        {
          kind: 'p',
          text: 'Sobald du auf Erstellen tippst, schreibt ein KI-Modell die Wörter und Fragen, und zwar direkt auf Deutsch und zu deinem Thema, nicht aus dem Englischen übersetzt. Danach übernimmt der Code: Er baut das Gitter, prüft jedes Wort gegen das deutsche Alphabet und zählt seine Länge in Kästchen. Was nicht passt, fliegt raus. Eine Frage, die ihre eigene Antwort verrät, oder ein Wort mit Tippfehler wird verworfen, nicht zurechtgebogen.',
        },
        {
          kind: 'p',
          text: 'Außerdem merkt sich dein Gerät jedes Wort, das es dir schon gezeigt hat, und lässt es in neuen Rätseln weg. Das klingt nach einer Kleinigkeit, ist aber entscheidend: Wer regelmäßig rätselt, erkennt Wiederholungen sofort, und nichts macht ein Rätsel schneller langweilig.',
        },
        {
          kind: 'tip',
          text: 'Ä, Ö und Ü bekommen im Gitter jeweils ein eigenes Kästchen. ß wird wie in den meisten Rätselheften als SS geschrieben, Straße steht also als STRASSE im Gitter.',
        },
      ],
    },
    {
      id: 'gute-fragen',
      heading: 'Schritt 5: Woran du eine gute Rätselfrage erkennst',
      blocks: [
        {
          kind: 'p',
          text: 'Ob mit Generator oder von Hand: Es hilft zu wissen, wie eine gute Frage aussieht. Sie hat genau eine faire Antwort, verwendet Wörter, die der Rätselnde kennt, und enthält weder die Antwort selbst noch ein Wort vom selben Stamm.',
        },
        {
          kind: 'compare',
          weak: 'Großes Tier (7 Buchstaben)',
          strong: 'Grauer Riese mit Rüssel (7 Buchstaben)',
        },
        {
          kind: 'p',
          text: 'Auf die erste Frage passen Dutzende Tiere, die zweite führt zu genau einem. Die Buchstabenzahl hilft beim Bestätigen, sie sollte aber nie der einzige Weg zur Lösung sein. Hier ein paar Beispiele, wie gute Fragen klingen:',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Grauer Riese mit Rüssel', answer: 'Elefant' },
            { clue: 'Hauptstadt von Österreich', answer: 'Wien' },
            { clue: 'Würziges Weihnachtsgebäck, berühmt aus Nürnberg', answer: 'Lebkuchen' },
            { clue: 'Seine Nadel zeigt immer nach Norden', answer: 'Kompass' },
            { clue: 'Grüner Quaker am Teich', answer: 'Frosch' },
          ],
        },
        {
          kind: 'tip',
          text: 'Kommt dir eine Frage falsch oder unfair vor, melde sie über das Menü des Rätsels. Gemeldete Fragen werden geprüft und aussortiert, damit die nächste Person nicht darüber stolpert.',
        },
      ],
    },
    {
      id: 'loesen-teilen-drucken',
      heading: 'Schritt 6: Lösen, teilen oder ausdrucken',
      blocks: [
        {
          kind: 'p',
          text: 'Dein Kreuzworträtsel öffnet sich sofort im Browser, auf dem Handy wie am Computer. Auf dem Touchscreen erscheint eine eigene Tastatur mit Ä, Ö und Ü, damit das Gitter sichtbar bleibt. Du kannst einen Buchstaben, ein Wort oder das ganze Rätsel prüfen, eine Antwort aufdecken, wenn du festhängst, und jederzeit unterbrechen: Deine Buchstaben bleiben auf dem Gerät gespeichert.',
        },
        {
          kind: 'list',
          items: [
            '**Link teilen**: Wer den Link öffnet, bekommt genau dasselbe Gitter mit denselben Fragen, kostenlos und ohne Anmeldung.',
            '**Als PDF speichern**: im Standardlook, bunt oder in Schwarz-Weiß, auf Wunsch mit einer eigenen Seite für die Lösungen. Praktisch für die Schule, den Geburtstag oder die Zugfahrt ohne Netz.',
            '**Offline spielen**: Installiere die Seite als App, dann lassen sich Rätsel, die du schon geöffnet hast, auch ohne Verbindung weiterlösen.',
          ],
        },
      ],
    },
    {
      id: 'ideen',
      heading: 'Ideen: Kreuzworträtsel für Schule, Feier und Geschenk',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Im Unterricht**: Ein kleines Rätsel zum Thema der Woche ist ein ruhiger Stundenbeginn. Druck ein Blatt pro Zweiergruppe aus und lass die beiden über die Antworten diskutieren.',
            '**Beim Geburtstag oder Familienfest**: Schick den Link in die Familiengruppe und schau, wer zuerst fertig ist.',
            '**Zum Sprachenlernen**: Stell die Seite auf die Sprache um, die du lernst. Wörter und Fragen sind dort direkt in dieser Sprache geschrieben, das Rätsel wird so zum Vokabeltraining.',
            '**Auf dem Arbeitsweg**: Ein mittleres Schwedenrätsel passt gut in zwanzig Minuten Bahnfahrt und braucht keinen Stift.',
          ],
        },
        {
          kind: 'p',
          text: 'Mehr zum Einsatz in der Schule findest du im Ratgeber [Kreuzworträtsel für Schüler](/guides/kreuzwortraetsel-fuer-schueler). Und wenn du selbst lieber rätselst als erstellst, helfen dir unsere [Tipps zum Kreuzworträtsel lösen](/guides/kreuzwortraetsel-loesen-tipps) weiter.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Ist der Kreuzworträtsel-Generator kostenlos?',
      answer:
        'Dein erstes Rätsel jeden Monat ist kostenlos, ohne Konto und ohne Anmeldung. Danach kannst du einmalig Guthaben kaufen, ein Abo gibt es nicht. Ein Rätsel zu öffnen, das dir jemand geschickt hat, ist immer kostenlos. Alles Weitere steht auf der Seite [Guthaben](/credits).',
    },
    {
      question: 'Kann ich eigene Wörter und Fragen eingeben?',
      answer:
        'Im Moment nicht. Wörter und Fragen werden passend zu deinem Thema und deiner Schwierigkeit geschrieben und anschließend vom Code geprüft. Du bestimmst Format, Thema, Größe und Schwierigkeit.',
    },
    {
      question: 'Kann ich das Kreuzworträtsel ausdrucken?',
      answer:
        'Ja. Öffne das Rätsel, wähle „Als PDF speichern“ und entscheide dich für Standard, bunt oder Schwarz-Weiß. Mit „Lösungen anhängen“ kommt das gelöste Gitter auf eine eigene Seite.',
    },
    {
      question: 'Funktioniert das auch auf dem Handy?',
      answer:
        'Ja, das Rätsel läuft direkt im Browser. Auf Handy und Tablet erscheint eine Tastatur unter dem Gitter, auf der Ä, Ö und Ü eigene Tasten haben. Wer mag, installiert die Seite als App.',
    },
    {
      question: 'In welchen Sprachen kann ich ein Kreuzworträtsel erstellen?',
      answer:
        'In dreiunddreißig, von Deutsch, Englisch und Niederländisch bis Armenisch, Japanisch und Suaheli. Jede Sprache hat eigene Wörter und Fragen, die in ihr geschrieben und nicht übersetzt sind. Die Sprache stellst du im Sprachmenü oben oder unten auf der Seite um.',
    },
    {
      question: 'Kommen dieselben Wörter noch einmal?',
      answer: 'Nein. Dein Gerät merkt sich die Wörter, die es dir gezeigt hat, und jedes neue Rätsel lässt sie weg.',
    },
  ],
  related: ['solve', 'scanword', 'teachers'],
}
