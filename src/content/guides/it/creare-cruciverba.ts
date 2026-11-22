import type { Guide } from '../../types'

export const creareCruciverba: Guide = {
  key: 'make',
  slug: 'creare-cruciverba',
  title: 'Creare un cruciverba online: la guida passo per passo',
  shortTitle: 'Creare un cruciverba',
  metaTitle: 'Creare un cruciverba online: guida passo per passo',
  description:
    'Come creare un cruciverba online in pochi minuti: scegli formato, tema e difficoltà, poi gioca, condividi un link o stampa lo schema in PDF con le soluzioni.',
  searchTerms: [
    'creare un cruciverba',
    'crea cruciverba online',
    'generatore di cruciverba',
    'come fare un cruciverba',
    'creare cruciverba gratis',
    'fare un cruciverba personalizzato',
    'cruciverba da stampare',
    'creare schema svedese',
    'crea cruciverba',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Creare un cruciverba a mano è un rompicapo prima ancora di diventare un gioco. Bisogna trovare parole che si incastrino senza lasciare buchi, poi scrivere per ognuna una definizione onesta, né banale né impossibile. Gli autori di enigmistica ci passano ore con matita e gomma. Un generatore di cruciverba fa l’incastro al posto tuo e ti lascia la parte che conta davvero: decidere di che cosa parla lo schema e per chi è pensato.',
    'In questa guida vediamo come creare un cruciverba online dalla prima scelta allo schema finito, da risolvere sul telefono, mandare a un amico o stampare per la classe. E vediamo anche che cosa rende buona una definizione, così puoi giudicare uno schema prima di farlo girare.',
  ],
  sections: [
    {
      id: 'scegli-il-formato',
      heading: 'Primo passo: cruciverba classico o schema svedese?',
      blocks: [
        {
          kind: 'p',
          text: 'Chi è cresciuto sfogliando le riviste di enigmistica li conosce entrambi. Il **cruciverba** ha le caselle numerate e due elenchi di definizioni accanto alla griglia, Orizzontali e Verticali. Lo **schema svedese** mette ogni definizione dentro la griglia, in una casella colorata, con una freccia che indica dove comincia la soluzione e in che direzione corre. Le parole e il modo di ragionare sono gli stessi; cambia solo come si legge.',
        },
        {
          kind: 'list',
          items: [
            'Scegli il [cruciverba](/crossword) per stampare, per la scuola, o se ti piace leggere tutte le definizioni prima di cominciare.',
            'Scegli lo [schema svedese](/scanword) per una partita veloce sul telefono: la definizione sta proprio dove scrivi, senza saltare tra griglia ed elenco.',
          ],
        },
        {
          kind: 'tip',
          text: 'Non sai quale scegliere? Comincia con un cruciverba piccolo. Si risolve in dieci-quindici minuti: la durata giusta per una prima prova o per aprire una lezione.',
        },
      ],
    },
    {
      id: 'scegli-il-tema',
      heading: 'Secondo passo: il tema',
      blocks: [
        {
          kind: 'p',
          text: 'Il tema dà carattere allo schema. Un cruciverba in cui ogni soluzione è un animale, un piatto o uno sport sembra fatto su misura, e chi lo risolve si diverte a cogliere il filo conduttore. I temi misti vanno bene per allenarsi tutti i giorni, quando si cerca varietà più che un argomento.',
        },
        {
          kind: 'p',
          text: 'Hai dodici [temi](/topics) tra cui scegliere, tra cui animali, cibo e bevande, geografia, scienza e [cultura locale](/topics/local-culture), che pesca da tradizioni, luoghi, piatti e personaggi dell’Italia.',
        },
      ],
    },
    {
      id: 'dimensioni-e-difficolta',
      heading: 'Terzo passo: dimensioni e difficoltà',
      blocks: [
        {
          kind: 'p',
          text: 'Le dimensioni decidono quanto dura la partita, la difficoltà decide quanto sono dure le definizioni. Sono due scelte separate apposta: uno schema piccolo e difficile è un lampo di ingegno, uno grande e facile è mezz’ora rilassante con il caffè.',
        },
        {
          kind: 'list',
          items: [
            '**Piccolo**: una griglia 9×9 con circa 8-14 parole. Perfetto per bambini, principianti e una pausa di cinque minuti.',
            '**Medio**: 13×13 e 16-24 parole. La misura di tutti i giorni per la maggior parte dei solutori.',
            '**Grande**: 15×15 e fino a 34 parole, per una domenica pomeriggio sul divano.',
          ],
        },
        {
          kind: 'p',
          text: 'Con **Facile** trovi parole comuni e definizioni dirette. Con **Difficile** le parole sono più rare e le definizioni giocano su cultura, senso figurato e significati meno ovvi. **Medio** sta nel mezzo e va bene per quasi tutti gli adulti.',
        },
        {
          kind: 'p',
          text: 'Una nota sulla forma: il cruciverba della rivista è un quadrato pieno, in cui quasi ogni casella bianca appartiene a due parole, separate da poche caselle nere. Qui la griglia è libera: le parole si incrociano dove condividono una lettera e il resto resta vuoto. In cambio niente sigle, niente «iniziali di» e niente parole di due lettere messe lì solo per chiudere un angolo.',
        },
      ],
    },
    {
      id: 'cosa-fa-l-ia',
      heading: 'Quarto passo: l’intelligenza artificiale scrive parole e definizioni',
      blocks: [
        {
          kind: 'p',
          text: 'Quando premi Crea il mio schema, le parole e le definizioni vengono scritte direttamente in italiano da un modello di intelligenza artificiale, Gemini di Google, per il tema e il livello che hai scelto. Niente è tradotto dall’inglese. Poi è il codice, non il modello, a costruire la griglia, a controllare ogni parola lettera per lettera e casella per casella, e a scartare tutto ciò che non torna. Una definizione che contiene la propria soluzione, o una parola scritta male, viene eliminata, mai rattoppata.',
        },
        {
          kind: 'p',
          text: 'Il tuo dispositivo ricorda anche le parole che ti ha già mostrato, quindi uno schema nuovo non ti ripropone mai una soluzione già vista. Sembra un dettaglio, ma dopo qualche partita sono proprio le parole ripetute a far sembrare tutto già visto.',
        },
      ],
    },
    {
      id: 'una-buona-definizione',
      heading: 'Quinto passo: riconoscere una buona definizione',
      blocks: [
        {
          kind: 'p',
          text: 'Che tu usi un generatore o scriva i tuoi schemi a matita, conviene sapere com’è fatta una buona definizione. Porta a una sola risposta giusta, usa parole che il solutore conosce e non contiene la soluzione né una parola della stessa radice.',
        },
        {
          kind: 'compare',
          weak: 'Un animale domestico (5 lettere)',
          strong: 'Fa le fusa sul divano (5 lettere)',
        },
        {
          kind: 'p',
          text: 'La prima definizione va bene per il cane, il gatto, il pollo e mezza fattoria; la seconda porta solo al gatto. Il numero di lettere aiuta, ma deve confermare una risposta, non essere l’unico modo per trovarla.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Passaggio sospeso che scavalca un corso d’acqua', answer: 'ponte' },
            { clue: 'Piccolo ferro che fa scattare la serratura', answer: 'chiave' },
            { clue: 'Riparo pieghevole da aprire sotto l’acqua', answer: 'ombrello' },
            { clue: 'Lastra che rimanda il volto di chi guarda', answer: 'specchio' },
            { clue: 'Impasto lievitato che esce caldo dal forno', answer: 'pane' },
          ],
        },
        {
          kind: 'tip',
          text: 'Una definizione ti sembra sbagliata o scorretta? Segnalala dal menu dello schema. Le definizioni segnalate vengono controllate e ritirate, così il prossimo giocatore non ci inciampa.',
        },
      ],
    },
    {
      id: 'gioca-condividi-stampa',
      heading: 'Sesto passo: gioca, condividi o stampa',
      blocks: [
        {
          kind: 'p',
          text: 'Il tuo schema si apre subito nel browser, sul telefono come sul computer. Sui touchscreen compare sotto la griglia una tastiera dedicata, così lo schema resta sempre in vista. Puoi controllare una lettera, una parola o tutto lo schema, rivelare una soluzione quando ti blocchi e tornarci più tardi: le lettere restano salvate sul dispositivo.',
        },
        {
          kind: 'list',
          items: [
            '**Condividi un link**: il tuo amico riceve la stessa griglia e le stesse definizioni, gratis e senza registrazione.',
            '**Salva in PDF**: a colori o in bianco e nero, con o senza una pagina a parte con le soluzioni. Comodo per la classe, una festa o un viaggio senza campo.',
            '**Gioca offline**: installa il sito come un’app, e gli schemi che hai già aperto funzionano anche senza connessione.',
          ],
        },
      ],
    },
    {
      id: 'idee',
      heading: 'Idee: un cruciverba per la classe, una festa o un regalo',
      blocks: [
        {
          kind: 'list',
          items: [
            '**In classe**: uno schema piccolo sul tema della settimana per cominciare la lezione con calma. Stampane uno per coppia e lascia che discutano le soluzioni.',
            '**A una cena di famiglia o a un compleanno**: manda il link nel gruppo e guarda chi finisce per primo.',
            '**Per chi studia una lingua**: passa il sito alla lingua che stai imparando. Parole e definizioni sono scritte direttamente in quella lingua, e lo schema diventa un ripasso di lessico.',
            '**In treno**: uno schema svedese medio dura quanto un tragitto da pendolare, e non serve la penna.',
          ],
        },
        {
          kind: 'p',
          text: 'Per usare gli schemi con gli studenti leggi la guida ai [cruciverba per bambini e per la scuola](/guides/cruciverba-per-bambini). Se invece stai dall’altra parte della griglia, i nostri consigli su [come risolvere un cruciverba](/guides/come-risolvere-cruciverba) ti aiutano a sbloccarti.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Il generatore di cruciverba è gratis?',
      answer:
        'Il primo schema di ogni mese è gratis, senza account e senza registrazione. Dopo puoi acquistare crediti una tantum, senza abbonamento. Aprire uno schema che qualcuno ti ha condiviso è sempre gratis. Tutti i dettagli sono nella [pagina dei crediti](/credits).',
    },
    {
      question: 'Posso inserire parole e definizioni mie?',
      answer:
        'Per ora no. Le parole e le definizioni vengono scritte per il tema e la difficoltà che scegli, poi controllate dal codice. Tu scegli formato, tema, dimensioni e difficoltà.',
    },
    {
      question: 'Posso stampare il cruciverba?',
      answer:
        'Sì. Apri lo schema, scegli Salva in PDF e decidi tra a colori e bianco e nero. Puoi aggiungere una pagina separata con le soluzioni.',
    },
    {
      question: 'Come si scrivono le lettere accentate?',
      answer:
        'Come sulle riviste: senza accento. Città diventa CITTA, caffè diventa CAFFE. Se scrivi una vocale accentata, la casella mostra la vocale semplice. Ne parliamo nella guida ai [cruciverba in italiano](/guides/cruciverba-in-italiano).',
    },
    {
      question: 'In quali lingue posso creare un cruciverba?',
      answer:
        'In trentatré, dall’italiano, dall’inglese e dallo spagnolo fino all’armeno, al giapponese e allo swahili. Ogni lingua ha parole e definizioni proprie, scritte direttamente e non tradotte, e i menu del sito cambiano insieme a lei.',
    },
    {
      question: 'Le stesse parole torneranno?',
      answer: 'No. Ogni dispositivo ricorda le parole che ha mostrato, e ogni schema nuovo le lascia fuori.',
    },
  ],
  related: ['solve', 'scanword', 'teachers', 'language-it'],
}
