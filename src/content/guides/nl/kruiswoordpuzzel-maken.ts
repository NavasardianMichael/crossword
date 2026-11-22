import type { Guide } from '../../types'

export const kruiswoordpuzzelMaken: Guide = {
  key: 'make',
  slug: 'kruiswoordpuzzel-maken',
  title: 'Kruiswoordpuzzel maken: zo maak je online in een paar minuten je eigen puzzel',
  shortTitle: 'Kruiswoordpuzzel maken',
  metaTitle: 'Kruiswoordpuzzel maken: online, stap voor stap',
  description:
    'Een kruiswoordpuzzel maken in een paar minuten: kies vorm, onderwerp en niveau, los hem online op, deel een link of print een pdf met antwoorden.',
  searchTerms: [
    'kruiswoordpuzzel maken',
    'kruiswoordraadsel maken',
    'kruiswoordraadsel maken online',
    'kruiswoordpuzzel maken online gratis',
    'kruiswoordpuzzel generator',
    'zelf een kruiswoordpuzzel maken',
    'kruiswoordpuzzel maken om te printen',
    'kruiswoord puzzel maken',
    'kruiswoordpuzzle maken',
    'crossword maker nederlands',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Wie ooit zelf een kruiswoordpuzzel wilde maken, weet hoe snel dat uit de hand loopt. De woorden moeten netjes kruisen, er mag geen vakje overblijven en bij elk woord hoort een omschrijving die eerlijk is zonder alles weg te geven. Met pen en ruitjespapier ben je zo een avond verder. Een generator neemt het passen en meten van je over, zodat jij je kunt richten op wat ertoe doet: waar gaat de puzzel over, en voor wie is hij?',
    'In deze gids lopen we stap voor stap door hoe je online een kruiswoordpuzzel maakt, van de eerste keuze tot een kant-en-klaar raster dat je op je telefoon oplost, naar vrienden stuurt of voor de klas print. Onderweg lees je ook waar je een goede omschrijving aan herkent.',
  ],
  sections: [
    {
      id: 'vorm-kiezen',
      heading: 'Stap 1: Kruiswoord of Zweedse puzzel?',
      blocks: [
        {
          kind: 'p',
          text: 'Eerst kies je een vorm. Het **klassieke kruiswoord** heeft genummerde vakjes en twee lijsten met hints naast het raster: horizontaal en verticaal. Bij een **Zweedse puzzel** staan de hints in het raster zelf, met een pijltje dat aanwijst waar het antwoord komt. Je lost ze met dezelfde woorden en hetzelfde denkwerk op, ze lezen alleen anders.',
        },
        {
          kind: 'list',
          items: [
            'Kies een [kruiswoord](/crossword) als je wilt printen, als je met een klas werkt of als je graag eerst alle hints doorleest.',
            'Kies een [Zweedse puzzel](/scanword) voor een snel potje op je telefoon: de hint staat precies waar je typt, dus je hoeft niet heen en weer tussen raster en lijst.',
          ],
        },
        {
          kind: 'tip',
          text: 'Twijfel je? Begin met een klein klassiek kruiswoord. Daar ben je tien tot vijftien minuten mee bezig, precies goed voor een eerste poging of als opwarmertje in de les.',
        },
      ],
    },
    {
      id: 'onderwerp-kiezen',
      heading: 'Stap 2: Kies een onderwerp',
      blocks: [
        {
          kind: 'p',
          text: 'Een onderwerp geeft de puzzel karakter. Als elk antwoord een dier, een gerecht of iets uit de sportwereld is, voelt de puzzel alsof hij voor iemand gemaakt is, en het thema ontdekken is al de helft van het plezier. Een mix van onderwerpen is juist fijn om te oefenen, als je afwisseling zoekt.',
        },
        {
          kind: 'p',
          text: 'Er zijn twaalf [onderwerpen](/topics), waaronder [dieren](/topics/animals), eten en drinken, aardrijkskunde, geschiedenis en [eigen cultuur](/topics/local-culture): tradities, feesten en bekende plekken uit de Nederlandstalige wereld. Denk aan Sinterklaas, Koningsdag of de stroopwafel. Dat laatste onderwerp doet het altijd goed op verjaardagen.',
        },
      ],
    },
    {
      id: 'grootte-en-niveau',
      heading: 'Stap 3: Kies de grootte en het niveau',
      blocks: [
        {
          kind: 'p',
          text: 'De grootte bepaalt hoe lang je bezig bent, het niveau hoe pittig elke hint is. Die twee staan bewust los van elkaar: een kleine moeilijke puzzel is een snelle hersenkraker, een grote makkelijke een ontspannen halfuurtje met een kop koffie.',
        },
        {
          kind: 'list',
          items: [
            '**Klein**: een raster van 9×9 met zo’n 8 tot 14 woorden. Goed voor kinderen, beginners en een korte pauze.',
            '**Middel**: 13×13 met 16 tot 24 woorden. De dagelijkse maat voor de meeste puzzelaars.',
            '**Groot**: 15×15 met 22 tot 34 woorden, zo groot als de puzzel in de zaterdagkrant.',
          ],
        },
        {
          kind: 'p',
          text: 'Bij **Makkelijk** zijn de hints rechtstreekse omschrijvingen van bekende woorden. **Moeilijk** gebruikt zeldzamere woorden, vraagt meer algemene kennis en speelt soms met dubbele betekenissen. **Gemiddeld** zit daartussen en past bij de meeste volwassenen. De Zweedse puzzel heeft ook drie maten: 8×10, 10×13 en 13×17.',
        },
      ],
    },
    {
      id: 'wat-de-ai-doet',
      heading: 'Stap 4: De AI schrijft de woorden en hints',
      blocks: [
        {
          kind: 'p',
          text: 'Zodra je op maken drukt, schrijft een AI-model de woorden en hints, rechtstreeks in het Nederlands en bij jouw onderwerp, niet vertaald uit het Engels. Daarna neemt de code het over: die bouwt het raster, controleert elk woord tegen het Nederlandse alfabet en telt de lengte in vakjes. Wat niet klopt, gaat eruit. Een hint die zijn eigen antwoord verraadt of een woord met een typefout wordt weggegooid, niet opgelapt.',
        },
        {
          kind: 'p',
          text: 'Je apparaat onthoudt bovendien elk woord dat het je al heeft laten zien, en laat dat weg in nieuwe puzzels. Dat klinkt als een detail, maar wie vaak puzzelt, ziet herhalingen meteen, en niets maakt een puzzel sneller saai.',
        },
        {
          kind: 'tip',
          text: 'De IJ krijgt, zoals in veel Nederlandse puzzels, één vakje. IJS telt dus twee vakjes. Accenten vallen weg: café staat als CAFE in het raster.',
        },
      ],
    },
    {
      id: 'goede-hints',
      heading: 'Stap 5: Waar herken je een goede hint aan?',
      blocks: [
        {
          kind: 'p',
          text: 'Of je nu een generator gebruikt of alles met de hand doet: het helpt om te weten hoe een goede omschrijving eruitziet. Hij heeft precies één eerlijk antwoord, gebruikt woorden die de puzzelaar kent en bevat het antwoord niet zelf, ook geen woord met dezelfde stam.',
        },
        {
          kind: 'compare',
          weak: 'Groot dier (7 letters)',
          strong: 'Grijze reus met een slurf (7 letters)',
        },
        {
          kind: 'p',
          text: 'Op de eerste hint passen tientallen dieren, de tweede wijst er maar één aan. Het aantal letters helpt om een antwoord te bevestigen, maar mag nooit de enige weg ernaartoe zijn. Een paar voorbeelden van hoe goede hints klinken:',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Grijze reus met een slurf', answer: 'olifant' },
            { clue: 'Hoofdstad van Nederland', answer: 'Amsterdam' },
            { clue: 'Ronde koek met stroop ertussen', answer: 'stroopwafel' },
            { clue: 'De naald wijst altijd naar het noorden', answer: 'kompas' },
            { clue: 'Groen beestje dat kwaakt', answer: 'kikker' },
          ],
        },
        {
          kind: 'tip',
          text: 'Lijkt een hint fout of oneerlijk? Meld hem via het menu van de puzzel. Gemelde hints worden bekeken en uit de roulatie gehaald, zodat de volgende puzzelaar er niet over struikelt.',
        },
      ],
    },
    {
      id: 'spelen-delen-printen',
      heading: 'Stap 6: Spelen, delen of printen',
      blocks: [
        {
          kind: 'p',
          text: 'Je puzzel opent meteen in de browser, op je telefoon of computer. Op een touchscreen verschijnt een eigen toetsenbord met een IJ-toets, zodat het raster in beeld blijft. Je kunt een letter, een woord of de hele puzzel controleren, een antwoord tonen als je vastzit, en stoppen wanneer je wilt: je letters blijven op het apparaat bewaard.',
        },
        {
          kind: 'list',
          items: [
            '**Deel een link**: een vriend krijgt precies hetzelfde raster met dezelfde hints, gratis en zonder account.',
            '**Opslaan als pdf**: standaard, kleurrijk of zwart-wit, eventueel met een aparte pagina met de antwoorden. Handig voor de klas, een feestje of een treinreis zonder bereik.',
            '**Offline spelen**: installeer de site als app, dan kun je puzzels die je al hebt geopend ook zonder verbinding afmaken.',
          ],
        },
      ],
    },
    {
      id: 'ideeen',
      heading: 'Ideeën: een kruiswoordpuzzel voor de klas, een feest of een cadeau',
      blocks: [
        {
          kind: 'list',
          items: [
            '**In de klas**: een kleine puzzel over het thema van de week is een rustige start van de les. Print er één per tweetal en laat ze overleggen over de antwoorden.',
            '**Op een verjaardag of familiedag**: zet de link in de groepsapp en kijk wie het eerst klaar is.',
            '**Voor wie een taal leert**: zet de site in de taal die je leert. Woorden en hints zijn rechtstreeks in die taal geschreven, dus de puzzel is meteen woordenschatoefening.',
            '**Onderweg**: een middelgrote Zweedse puzzel past mooi in een treinrit van twintig minuten en je hebt geen pen nodig.',
          ],
        },
        {
          kind: 'p',
          text: 'Meer over puzzels in het onderwijs lees je in [kruiswoordpuzzels voor kinderen en de klas](/guides/kruiswoordpuzzel-voor-kinderen). En los je liever op dan dat je maakt, dan helpen onze [tips voor het oplossen van kruiswoordpuzzels](/guides/kruiswoordpuzzel-oplossen-tips) je verder.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Is kruiswoordpuzzels maken gratis?',
      answer:
        'Je eerste puzzel van elke maand is gratis, zonder account. Daarna kun je eenmalig credits kopen, er is geen abonnement. Een puzzel openen die iemand met je heeft gedeeld, is altijd gratis. Alle details staan op de pagina [credits](/credits).',
    },
    {
      question: 'Kan ik mijn eigen woorden en hints invoeren?',
      answer:
        'Op dit moment niet. De woorden en hints worden geschreven bij jouw onderwerp en niveau en daarna door de code gecontroleerd. Jij kiest de vorm, het onderwerp, de grootte en het niveau.',
    },
    {
      question: 'Kan ik de kruiswoordpuzzel printen?',
      answer:
        'Ja. Open de puzzel, kies “Opslaan als pdf” en kies standaard, kleurrijk of zwart-wit. Met “Antwoorden toevoegen” komt het opgeloste raster op een eigen pagina.',
    },
    {
      question: 'Werkt het ook op mijn telefoon?',
      answer:
        'Ja, de puzzel draait gewoon in de browser. Op telefoon en tablet verschijnt een toetsenbord onder het raster, met een aparte toets voor de IJ. Je kunt de site ook als app installeren.',
    },
    {
      question: 'In welke talen kan ik een kruiswoordpuzzel maken?',
      answer:
        'In drieëndertig, van Nederlands, Engels en Duits tot Armeens, Japans en Swahili. Elke taal heeft eigen woorden en hints, in die taal geschreven en niet vertaald. Je wisselt van taal via het taalmenu boven- of onderaan de pagina.',
    },
    {
      question: 'Komen dezelfde woorden terug?',
      answer: 'Nee. Je apparaat onthoudt de woorden die het je heeft laten zien, en elke nieuwe puzzel laat ze weg.',
    },
  ],
  related: ['solve', 'scanword', 'teachers'],
}
