import type { Guide } from '../../types'

export const comeRisolvereCruciverba: Guide = {
  key: 'solve',
  slug: 'come-risolvere-cruciverba',
  title: 'Come risolvere un cruciverba: metodo e consigli per non bloccarsi',
  shortTitle: 'Come risolvere un cruciverba',
  metaTitle: 'Come risolvere un cruciverba: metodo e consigli',
  description:
    'Come risolvere un cruciverba senza bloccarsi: da dove partire, come leggere le definizioni, come sfruttare gli incroci e come passare da Facile a Difficile.',
  searchTerms: [
    'come risolvere un cruciverba',
    'consigli cruciverba',
    'come si fa un cruciverba',
    'trucchi per i cruciverba',
    'cruciverba per principianti',
    'come diventare bravi nei cruciverba',
    'come risolvere cruciverba difficili',
    'aiuto cruciverba',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Come si risolve un cruciverba quando ci si blocca già alla prima definizione? La buona notizia è che i cruciverbisti esperti non conoscono molte più parole di te. Hanno un metodo: sanno da dove attaccare lo schema, come leggere una definizione che nasconde un doppio senso e come lasciare lavorare gli incroci.',
    'Ecco quel metodo, un passo alla volta: in che ordine riempire la griglia, quali tipi di definizione riconoscere, che cosa fare quando non viene niente e come passare in poche settimane dagli schemi facili a quelli difficili senza scoraggiarsi.',
  ],
  sections: [
    {
      id: 'da-dove-partire',
      heading: 'Da dove partire',
      blocks: [
        {
          kind: 'p',
          text: 'Non leggere le definizioni in fila sperando di trovarle tutte al primo colpo. Fai prima un giro veloce dello schema e scrivi solo quello che ti salta agli occhi. Tre o quattro soluzioni sicure, sparse per la griglia, valgono più di una lunga serie di tentativi in un angolo.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Comincia dalle definizioni più dirette, tipo «Capitale della Francia» o «Il frutto del melo». Se lo sai, scrivilo senza esitare.',
            'Passa poi alle parole corte. Una parola di tre o quattro lettere ha pochi candidati, e ogni sua lettera ne apre un’altra.',
            'Riparti da ogni lettera inserita. Una soluzione orizzontale ti dà l’iniziale di diverse verticali: rileggi le loro definizioni con quell’indizio in mano.',
            'Lascia le parole lunghe per ultime. Con tre o quattro lettere già al loro posto, spesso si indovinano in un attimo.',
          ],
        },
        {
          kind: 'tip',
          text: 'Qui, toccando una casella si accende tutta la parola e la sua definizione compare nella barra in alto. Tocca di nuovo la stessa casella per passare da orizzontale a verticale, senza cercare negli elenchi.',
        },
      ],
    },
    {
      id: 'leggere-una-definizione',
      heading: 'Leggere una definizione da cruciverbista',
      blocks: [
        {
          kind: 'p',
          text: 'Nel cruciverba italiano vale una regola d’oro: la definizione concorda con la soluzione. Se la definizione è al femminile plurale, lo è anche la risposta. Se comincia con un verbo all’infinito, cerca un infinito. Questo semplice controllo elimina metà delle false piste.',
        },
        {
          kind: 'list',
          items: [
            '**La definizione diretta**: un sinonimo o una spiegazione da vocabolario. «Piccolo ferro che fa scattare la serratura» porta a CHIAVE.',
            '**La parafrasi**: si descrive la cosa senza nominarla. «Riparo pieghevole da aprire sotto l’acqua» per OMBRELLO.',
            '**Il contesto noto**: un luogo, un’opera, un personaggio, come «Città eterna» per ROMA. Queste definizioni compaiono soprattutto nei temi Geografia e Cultura locale.',
            '**L’indovinello onesto**: a livello Difficile una definizione può giocare su un secondo significato. Se il senso letterale non porta da nessuna parte, chiediti che cosa vogliono dire le parole in senso figurato.',
          ],
        },
        {
          kind: 'compare',
          weak: 'Leggere «Rimanda il volto» e pensare a un appuntamento rinviato',
          strong: 'Leggere «Lastra che rimanda il volto di chi guarda» fino in fondo e trovare SPECCHIO',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Stella che scalda e illumina il giorno', answer: 'sole' },
            { clue: 'Quattro mura sotto un tetto, dove si torna la sera', answer: 'casa' },
            { clue: 'Pagine rilegate da leggere la sera', answer: 'libro' },
            { clue: 'Quesito oscuro che chiede di essere sciolto', answer: 'enigma' },
            { clue: 'Groviglio di vicoli da cui è arduo uscire', answer: 'labirinto' },
          ],
        },
      ],
    },
    {
      id: 'contare-le-caselle',
      heading: 'Contare le caselle: niente accenti, niente apostrofi',
      blocks: [
        {
          kind: 'p',
          text: 'Come sulle riviste, lo schema si scrive in maiuscolo e senza accenti. CITTÀ diventa CITTA, PERCHÉ diventa PERCHE, CAFFÈ diventa CAFFE. Quando conti le lettere di una soluzione, conta quindi le lettere semplici: l’accento non occupa spazio e non cambia nulla negli incroci. La A finale di CITTA può incrociare benissimo la A di qualsiasi altra parola.',
        },
        {
          kind: 'p',
          text: 'Ogni soluzione è poi una parola sola: niente apostrofi, niente trattini, niente parole staccate. Se una definizione sembra chiedere «l’acqua» o «un’ape», la soluzione sarà comunque ACQUA o APE, senza articolo.',
        },
      ],
    },
    {
      id: 'quando-ti-blocchi',
      heading: 'Quando ti blocchi: le mosse giuste',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Cambia zona.** Un blocco si scioglie spesso grazie a un incrocio che arriva da un’altra parte dello schema.',
            '**Leggi la definizione ad alta voce.** Sentire la frase a volte fa venire in mente la parola che cercavi con gli occhi.',
            '**Prova le desinenze.** In italiano tanti nomi finiscono in -ZIONE, -MENTO, -TORE o -ISTA. Metti la fine probabile e guarda se gli incroci reggono.',
            '**Fai una pausa.** Tornare allo schema dopo dieci minuti significa vederlo con occhi nuovi. Le lettere restano salvate sul dispositivo, non perdi niente.',
          ],
        },
        {
          kind: 'p',
          text: 'E se proprio non viene, usa gli strumenti senza sensi di colpa. **Controlla** la lettera, la parola o lo schema: le lettere sbagliate vengono barrate e quelle giuste bloccate. **Rivela** una sola lettera: spesso basta a sbloccare un intero angolo senza rovinare il resto. Con «Controlla mentre scrivo», nelle impostazioni, ogni errore viene segnalato appena lo inserisci: ottimo per imparare, da spegnere quando vuoi metterti alla prova.',
        },
        {
          kind: 'tip',
          text: 'Meglio rivelare una lettera che una parola intera: è la spinta giusta che ti lascia il piacere di trovare il resto da solo.',
        },
      ],
    },
    {
      id: 'migliorare',
      heading: 'Migliorare: da Facile a Difficile',
      blocks: [
        {
          kind: 'p',
          text: 'Ai cruciverba si migliora come in qualsiasi sport: giocando spesso, a un livello un po’ sopra il proprio. Parti da schemi piccoli e facili finché non li chiudi senza aiuti, poi passa a Medio e agli schemi grandi. Difficile arriva per ultimo: parole più rare, definizioni più traverse.',
        },
        {
          kind: 'list',
          items: [
            'Meglio uno schema piccolo al giorno che uno grande al mese. Il lessico dei cruciverba torna in fretta quando ci si allena con costanza.',
            'Cronometrati se ti piacciono le sfide: il timer corre durante la partita, e battere il proprio tempo motiva.',
            'Cambia [tema](/topics) ogni tanto. Uno schema di [scienza](/topics/science) o di [storia](/topics/history) mette al lavoro altre zone della memoria.',
            'Prova anche lo [schema svedese](/guides/schema-svedese): le definizioni brevi allenano a indovinare in fretta.',
          ],
        },
        {
          kind: 'p',
          text: 'Visto che ogni dispositivo ricorda le parole già viste, non ritroverai mai due volte la stessa soluzione. Niente schemi imparati a memoria: ogni partita è un allenamento vero.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Qual è il consiglio migliore per iniziare con i cruciverba?',
      answer:
        'Partire in piccolo e in facile. Una griglia 9×9 a livello Facile si chiude in un quarto d’ora e insegna le abitudini giuste: prima le definizioni ovvie, poi le parole corte, le lunghe per ultime. Puoi [iniziarne una qui](/crossword).',
    },
    {
      question: 'Usare Controlla o Rivela è barare?',
      answer:
        'No, è imparare. Controlla mostra dove hai sbagliato, Rivela sblocca un angolo. Le lettere rivelate hanno una piccola bandierina, così sai sempre che cosa hai trovato da solo.',
    },
    {
      question: 'Bisogna scrivere gli accenti nel cruciverba?',
      answer:
        'No. Come sulla carta stampata, lo schema si scrive senza accenti: se digiti una vocale accentata, la casella mostra la vocale semplice. Le regole complete sono nella pagina [Come si gioca](/rules).',
    },
    {
      question: 'Come capisco se la soluzione è al plurale?',
      answer:
        'Guarda la definizione: concorda con la risposta. «Lo sono le rose e i tulipani» chiede un plurale, «La regina del giardino» un femminile singolare.',
    },
    {
      question: 'Quanto ci vuole per diventare bravi ai cruciverba?',
      answer:
        'Non c’è una regola, ma uno schema al giorno per qualche settimana cambia già molto. Si memorizzano le parole che tornano nelle definizioni e si impara a riconoscere i giri di frase.',
    },
  ],
  related: ['make', 'scanword', 'language-it'],
}
