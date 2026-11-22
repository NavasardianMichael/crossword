import type { Guide } from '../../types'

export const ceskeKrizovky: Guide = {
  key: 'language-cs',
  slug: 'ceske-krizovky',
  title: 'České křížovky online: háčky a čárky v mřížce, tradice luštění a legendy psané rovnou česky',
  shortTitle: 'České křížovky online',
  metaTitle: 'České křížovky online: háčky, čárky a tradice luštění',
  description:
    'České křížovky online: jak v mřížce fungují háčky a čárky, proč má ch dvě políčka, odkud se bere česká záliba v luštění a proč legendy nejsou přeložené.',
  searchTerms: [
    'české křížovky',
    'české křížovky online',
    'křížovky online česky',
    'křížovky s diakritikou',
    'luštění křížovek online',
    'ceske krizovky',
    'krizovky online',
    'czech crossword',
    'czech crossword online',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'České křížovky mají svou chuť. Česká abeceda je plná háčků a čárek, k tomu kroužek nad „ů“, a každé z těchto písmen zabírá v mřížce vlastní políčko. Přidejte bohaté skloňování, spoustu synonym a tradici, díky které zná luštění skoro každý – z novin, z čekárny u lékaře nebo z dovolené na chalupě.',
    'Tenhle návod vysvětluje, co je na českých křížovkách online zvláštního: jak zacházíme s diakritikou, proč „ch“ zabírá dvě políčka, jak psát háčky a čárky na telefonu i na počítači, odkud se berou legendy a jak začít, pokud chcete svou první českou křížovku vyluštit ještě dnes.',
  ],
  sections: [
    {
      id: 'hacky-a-carky',
      heading: 'Háčky, čárky a kroužek: každé písmeno má své políčko',
      blocks: [
        {
          kind: 'p',
          text: 'Česká abeceda je na diakritiku bohatá: á, č, ď, é, ě, í, ň, ó, ř, š, ť, ú, ů, ý a ž. V našich křížovkách je každé z těchto písmen samostatné a zabírá vlastní políčko. „A“ a „á“ jsou dvě různá písmena, stejně jako „u“, „ú“ a „ů“ nebo „e“, „é“ a „ě“. Když je odpovědí „řeka“, píšete do políček ř, e, k, a – obyčejné „r“ neprojde.',
        },
        {
          kind: 'p',
          text: 'Možná znáte tištěné křížovky, ve kterých se diakritika nerozlišuje a do políčka se píše jen holé písmeno. Tady je to jinak: háčky a čárky se počítají, takže křížovka zároveň procvičuje pravopis – včetně věčného dilematu mezi „ú“ a „ů“.',
        },
        {
          kind: 'compare',
          weak: 'Plaz (5 písmen)',
          strong: 'Pomalý plaz s krunýřem (5 písmen)',
        },
        {
          kind: 'p',
          text: 'Obě legendy mohou vést k „želvě“, ale jen druhá ji určí jednoznačně. Všimněte si také, že „želva“ začíná písmenem „ž“: kdo napíše „zelva“, má chybu – a pokazí i slovo, které ji kříží.',
        },
      ],
    },
    {
      id: 'ch-dve-policka',
      heading: 'Ch: jedno písmeno abecedy, ale dvě políčka',
      blocks: [
        {
          kind: 'p',
          text: 'V české abecedě je „ch“ samostatné písmeno – řadí se za „h“, a proto ve slovníku najdete „chléb“ až za „hvězdou“. V mřížce však zabírá dvě políčka, „c“ a „h“, stejně jako v tištěných křížovkách nebo při psaní na klávesnici. „Chata“ má proto v křížovce pět políček: c, h, a, t, a.',
        },
        {
          kind: 'tip',
          text: 'Vychází vám odpověď o políčko delší, než jste čekali? Zkontrolujte, jestli v ní není „ch“. Počítá se za dvě.',
        },
      ],
    },
    {
      id: 'psani-diakritiky',
      heading: 'Jak psát háčky a čárky na telefonu a na počítači',
      blocks: [
        {
          kind: 'p',
          text: 'Na dotykové obrazovce se pod mřížkou objeví klávesnice křížovky: tři řady v rozložení QWERTY a čtvrtá řada s českými písmeny – á, č, ď, é, ě, í, ň, ó, ř, š, ť, ú, ů, ý a ž. Jedno ťuknutí a písmeno je v políčku, bez podržování kláves a hledání háčků v systémové klávesnici.',
        },
        {
          kind: 'p',
          text: 'Na počítači píšete běžnou klávesnicí. Na české klávesnici máte ě, š, č, ř, ž, ý, á, í a é v horní řadě místo číslic, „ú“ hned vpravo od P a „ů“ vpravo od L. Méně častá ď, ť a ň napíšete mrtvou klávesou s háčkem a potom písmenem. Šipky posouvají kurzor mezi políčky a Enter skočí na další legendu.',
        },
      ],
    },
    {
      id: 'tradice-lusteni',
      heading: 'Česká tradice luštění',
      blocks: [
        {
          kind: 'p',
          text: 'Luštění má v Česku hluboké kořeny. Časopisy plné křížovek, skandinávek a osmisměrek leží v každé trafice, luští se ve vlaku, na chalupě i v čekárně a křížovka je stálicí víkendových novin. Kdo luští léta, přečte legendu napoprvé – i takovou, která by začátečníka zarazila.',
        },
        {
          kind: 'p',
          text: 'Typicky českým prvkem je **tajenka**: písmena z vyznačených políček se na konci složí do skrytého řešení, často vtipu nebo citátu. Česká křížovka má i své oblíbené krátké výplně – zkratky, chemické značky a citoslovce, které zkušený luštitel zná nazpaměť. Na tomhle webu najdete dva nejoblíbenější formáty: [klasickou křížovku](/crossword) a [skandinávku](/scanword), o které píšeme víc v návodu [co je skandinávka](/guides/skandinavka).',
        },
      ],
    },
    {
      id: 'legendy-cesky',
      heading: 'Legendy psané česky, ne přeložené',
      blocks: [
        {
          kind: 'p',
          text: 'Spousta křížovek na internetu jsou překlady z angličtiny a bohužel je to poznat: slova jsou podivně vybraná, legendy znějí strojeně a odpověď nemá vždycky tolik písmen, kolik by měla. Tady slova i legendy píše model umělé inteligence (Google Gemini) rovnou česky, s myšlenkou na českého luštitele. Překlad nevstupuje do hry v žádném kroku.',
        },
        {
          kind: 'p',
          text: 'Potom nastupuje kód: zkontroluje každé slovo proti české abecedě i jeho délku v políčkách, poskládá mřížku a vyřadí všechno, co nesedí. Slovo s překlepem nebo legenda, která prozrazuje odpověď, se neopravuje, prostě vypadne. Téma [Místní kultura](/topics/local-culture) pak přináší legendy o českých tradicích, místech, lidech a kuchyni.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Hovězí na smetanové omáčce s brusinkami a knedlíkem', answer: 'svíčková' },
            { clue: 'Západočeské město, kde se vaří slavný ležák', answer: 'plzeň' },
            { clue: 'Tekoucí voda mezi dvěma břehy', answer: 'řeka' },
            { clue: 'Malý dům na víkendy a prázdniny', answer: 'chata' },
            { clue: 'Kulaté kynuté pečivo s tvarohem nebo povidly', answer: 'koláč' },
          ],
        },
      ],
    },
    {
      id: 'jak-zacit',
      heading: 'Jak začít s českými křížovkami online',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Ujistěte se, že je web v češtině – jazyk přepnete v nabídce v záhlaví nebo v patičce.',
            'Vyberte typ: klasickou křížovku, nebo skandinávku.',
            'Zvolte téma, velikost a obtížnost. Na začátek je nejlepší malá mřížka na lehké obtížnosti.',
            'Luštěte v prohlížeči, a když se zaseknete, zkontrolujte písmeno nebo slovo, případně si jedno písmeno odhalte.',
          ],
        },
        {
          kind: 'p',
          text: 'První křížovka každý měsíc je zdarma a nepotřebuje účet. Potom si můžete koupit jednorázový balíček kreditů, bez předplatného – podrobnosti jsou na stránce [kreditů](/credits). Křížovky, které vám někdo pošle, otevřete vždycky zdarma. Každé zařízení si navíc pamatuje slova, která jste už viděli, takže další mřížky je nezopakují.',
        },
      ],
    },
    {
      id: 'pro-studenty-a-krajany',
      heading: 'České křížovky pro studenty češtiny a krajany',
      blocks: [
        {
          kind: 'p',
          text: 'Křížovka je dobrý trénink pro každého, kdo se češtinu učí nebo si ji chce po letech v zahraničí oprášit. Nutí k přesnému pravopisu, protože bez háčku písmeno nesedí se sousedním slovem, a seznamuje s každodenní slovní zásobou. Začněte tématem [Běžná slova](/topics/general) na lehké obtížnosti a malou mřížkou.',
        },
        {
          kind: 'p',
          text: 'Pokud češtinu učíte vy, ať ve škole, v krajanském spolku, nebo doma, křížovku vytisknete jako PDF i s řešením na samostatné stránce. Další nápady najdete v návodu [křížovky pro děti a do výuky](/guides/krizovky-pro-deti).',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Je v křížovce „a“ a „á“ totéž písmeno?',
      answer:
        'Není. Každé písmeno s háčkem, čárkou nebo kroužkem – á, č, ď, é, ě, í, ň, ó, ř, š, ť, ú, ů, ý a ž – je samostatné a má vlastní políčko. Napsat „a“ místo „á“ se počítá jako chyba.',
    },
    {
      question: 'Kolik políček zabírá „ch“?',
      answer: 'Dvě. Písmeno „ch“ se do mřížky píše jako „c“ a „h“, každé do vlastního políčka.',
    },
    {
      question: 'Jak napíšu háčky a čárky na telefonu?',
      answer:
        'Pod mřížkou se objeví klávesnice křížovky se zvláštní řadou českých písmen. Systémovou klávesnici nemusíte přepínat ani na ní nic podržovat.',
    },
    {
      question: 'Jsou legendy přeložené z angličtiny?',
      answer:
        'Ne. Slova i legendy vznikají rovnou česky a kód každé slovo zkontroluje proti české abecedě, než se dostane do mřížky.',
    },
    {
      question: 'Můžu luštit křížovky i v jiném jazyce?',
      answer:
        'Ano, ve třiceti třech jazycích. Přepněte jazyk webu v nabídce – slova, legendy i celá nabídka se pak změní na zvolený jazyk.',
    },
  ],
  related: ['solve', 'scanword', 'teachers'],
}
