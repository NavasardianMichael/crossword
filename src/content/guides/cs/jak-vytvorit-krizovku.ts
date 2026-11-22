import type { Guide } from '../../types'

export const jakVytvoritKrizovku: Guide = {
  key: 'make',
  slug: 'jak-vytvorit-krizovku',
  title: 'Jak vytvořit křížovku online: generátor křížovek a návod krok za krokem',
  shortTitle: 'Jak vytvořit křížovku',
  metaTitle: 'Jak vytvořit křížovku online: návod krok za krokem',
  description:
    'Jak vytvořit křížovku online za pár minut: zvolte typ, téma a obtížnost, zkontrolujte legendy a pak pošlete odkaz nebo vytiskněte PDF. Tipy pro školu i oslavu.',
  searchTerms: [
    'jak vytvořit křížovku',
    'generátor křížovek',
    'křížovka online',
    'vytvořit křížovku online',
    'jak udělat křížovku',
    'tvorba křížovky',
    'vlastní křížovka',
    'křížovka k tisku',
    'jak vytvorit krizovku',
    'generator krizovek',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Jak vytvořit křížovku, která se dá opravdu vyluštit? Ručně to zabere víc času, než by člověk čekal. Najít slova, která se pěkně kříží, je samo o sobě hlavolam, a k tomu je potřeba ke každému napsat férovou legendu. Generátor křížovek online za vás poskládá mřížku, takže se můžete soustředit na to podstatné: o čem křížovka bude a pro koho.',
    'V tomhle návodu projdeme krok za krokem, jak vytvořit křížovku online – od první volby po hotovou mřížku, kterou vyluštíte na telefonu, pošlete kamarádům nebo vytisknete pro třídu. Poradíme také, podle čeho poznat dobrou legendu, abyste slabou křížovku odhalili dřív, než ji uvidí někdo další.',
  ],
  sections: [
    {
      id: 'typ-krizovky',
      heading: 'Krok 1: klasická křížovka, nebo skandinávka?',
      blocks: [
        {
          kind: 'p',
          text: 'Na výběr jsou dva typy. **Klasická křížovka** má očíslovaná políčka a vedle mřížky dva sloupce legend – vodorovně a svisle. **Skandinávka** má legendy přímo v mřížce a malá šipka ukazuje, kde začíná odpověď. Slova i dovednosti jsou stejné, jen se jinak čtou.',
        },
        {
          kind: 'list',
          items: [
            '[Klasickou křížovku](/crossword) volte pro tisk, do školy a pro luštitele, kteří si rádi nejdřív přečtou všechny legendy.',
            '[Skandinávku](/scanword) volte na rychlé luštění v telefonu: legenda je hned u políčka, kam píšete, takže nemusíte přeskakovat mezi mřížkou a seznamem.',
          ],
        },
        {
          kind: 'tip',
          text: 'Nevíte si rady? Začněte malou klasickou křížovkou. Vyluštíte ji zhruba za čtvrt hodiny, což je akorát na první pokus nebo na rozehřátí na začátku vyučovací hodiny.',
        },
      ],
    },
    {
      id: 'tema',
      heading: 'Krok 2: vyberte téma',
      blocks: [
        {
          kind: 'p',
          text: 'Téma dává křížovce charakter. Když jsou všechny odpovědi zvířata, jídla nebo sportovní náčiní, působí křížovka jako dělaná na míru a luštitele baví motiv odhalovat. Smíšená témata se hodí, když chcete pestrost místo jedné linky.',
        },
        {
          kind: 'p',
          text: 'K dispozici je dvanáct [témat](/topics), mimo jiné zvířata, jídlo a pití, zeměpis, historie, věda a [místní kultura](/topics/local-culture) – tedy české tradice, místa, lidé a kuchyně, od Karlova mostu po svíčkovou. Právě tohle téma se nejvíc blíží křížovkám z českých novin, protože legendy míří na to, co znáte z domova a ze školy.',
        },
      ],
    },
    {
      id: 'velikost-a-obtiznost',
      heading: 'Krok 3: velikost a obtížnost',
      blocks: [
        {
          kind: 'p',
          text: 'Velikost určuje, jak dlouho budete luštit, obtížnost zase, jak náročná bude každá legenda. Jsou to dvě samostatné volby a je to tak dobře: malá těžká křížovka je rychlý hlavolam ke kávě, velká lehká zase pohodová půlhodinka na gauči.',
        },
        {
          kind: 'list',
          items: [
            '**Malá**: mřížka 9×9 a zhruba 8 až 14 slov. Pro děti, začátečníky a pětiminutovou přestávku.',
            '**Střední**: 13×13 a 16 až 24 slov. Běžná velikost pro většinu luštitelů.',
            '**Velká**: 15×15 a 22 až 34 slov, tedy velikost poctivé novinové křížovky.',
          ],
        },
        {
          kind: 'p',
          text: 'Skandinávka má vlastní rozměry: 8×10, 10×13 a 13×17 políček. Na **lehké** obtížnosti vedou legendy přímo k běžným slovům. **Těžká** sahá po vzácnějších výrazech, znalostech a méně zjevných významech. **Střední** je mezi nimi a sedne většině dospělých.',
        },
      ],
    },
    {
      id: 'jak-pracuje-ai',
      heading: 'Krok 4: slova a legendy píše AI, hlídá je kód',
      blocks: [
        {
          kind: 'p',
          text: 'Jakmile volbu potvrdíte, slova a legendy napíše model umělé inteligence (Google Gemini) – rovnou česky a pro zvolené téma. Nic se nepřekládá z angličtiny. Potom nastupuje kód, ne model: poskládá mřížku, zkontroluje každé slovo proti české abecedě i jeho délku v políčkách a všechno, co nesedí, vyřadí. Legenda, která prozrazuje odpověď, nebo slovo s překlepem se neopravuje, prostě vypadne.',
        },
        {
          kind: 'p',
          text: 'Každé zařízení si navíc pamatuje slova, která jste už viděli, takže nová křížovka nezopakuje odpověď, kterou znáte. Na tom záleží víc, než se zdá: po pár křížovkách jsou to právě opakovaná slova, co luštění nejrychleji zevšední.',
        },
      ],
    },
    {
      id: 'dobra-legenda',
      heading: 'Krok 5: podle čeho poznat dobrou legendu',
      blocks: [
        {
          kind: 'p',
          text: 'Ať křížovku tvoříte v generátoru, nebo s tužkou na papíře, vyplatí se vědět, jak vypadá dobrá legenda. Má jednu férovou odpověď, používá slova, která luštitel zná, a neobsahuje samotnou odpověď ani slovo se stejným kořenem.',
        },
        {
          kind: 'compare',
          weak: 'Velké zvíře (4 písmena)',
          strong: 'Šedý obr s chobotem (4 písmena)',
        },
        {
          kind: 'p',
          text: 'První legendě odpovídají desítky zvířat, druhá ukazuje na jedno jediné. Počet písmen pomáhá, ale má odpověď potvrdit, ne být jedinou cestou k ní.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Šedý obr s chobotem', answer: 'slon' },
            { clue: 'Ranní nápoj z pražených zrn', answer: 'káva' },
            { clue: 'Hlavní město Česka', answer: 'praha' },
            { clue: 'Jeho střelka vždy míří na sever', answer: 'kompas' },
            { clue: 'Řeka, která protéká Prahou', answer: 'vltava' },
          ],
        },
        {
          kind: 'tip',
          text: 'Když vám legenda připadá chybná nebo nefér, nahlaste ji z nabídky křížovky volbou „Nahlásit legendu“. Nahlášené legendy procházíme a stahujeme, takže na ně další luštitel už nenarazí.',
        },
      ],
    },
    {
      id: 'lustit-sdilet-tisknout',
      heading: 'Krok 6: luštěte, sdílejte, nebo tiskněte',
      blocks: [
        {
          kind: 'p',
          text: 'Křížovka se otevře hned v prohlížeči, na telefonu i na počítači. Na dotykové obrazovce se pod mřížkou objeví vlastní klávesnice s českými písmeny, takže mřížka zůstane na očích. Můžete zkontrolovat písmeno, slovo nebo celou křížovku, odhalit odpověď, když se zaseknete, a vrátit se později: vaše písmena se ukládají v zařízení.',
        },
        {
          kind: 'list',
          items: [
            '**Sdílejte odkaz**: kamarád dostane tutéž mřížku a tytéž legendy, zdarma a bez registrace.',
            '**Uložte jako PDF**: ve výchozím vzhledu, barevně, nebo černobíle, s řešením na samostatné stránce, nebo bez něj. Hodí se do školy, na oslavu i na cestu bez signálu.',
            '**Luštěte offline**: nainstalujte si web jako aplikaci a už otevřené křížovky budou fungovat i bez připojení.',
          ],
        },
      ],
    },
    {
      id: 'napady',
      heading: 'Nápady: křížovka do školy, na oslavu i jako dárek',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Ve škole**: malá křížovka k tématu týdne je klidný začátek hodiny. Vytiskněte jednu na lavici a nechte dvojice, ať se o odpovědi přou.',
            '**Na narozeniny nebo rodinný oběd**: pošlete odkaz do skupinového chatu a uvidíte, kdo bude hotový první.',
            '**K výuce jazyka**: přepněte web do jazyka, který se učíte. Slova i legendy jsou psané rovnou v tom jazyce, takže křížovka je zároveň procvičování slovní zásoby.',
            '**Na cestě**: střední skandinávka vystačí na dvacet minut v tramvaji a nepotřebuje tužku.',
          ],
        },
        {
          kind: 'p',
          text: 'Víc o křížovkách ve výuce najdete v návodu [křížovky pro děti a do výuky](/guides/krizovky-pro-deti). A pokud jste spíš na druhé straně mřížky, poradí vám návod [jak luštit křížovky](/guides/jak-lustit-krizovky), co dělat, když se zaseknete.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Je generátor křížovek zdarma?',
      answer:
        'První křížovka každý měsíc je zdarma, bez účtu a bez registrace. Potom si můžete jednorázově koupit balíček kreditů – bez předplatného. Otevřít křížovku, kterou vám někdo poslal, je vždycky zdarma. Podrobnosti najdete na stránce [kreditů](/credits).',
    },
    {
      question: 'Můžu zadat vlastní slova a legendy?',
      answer:
        'Zatím ne. Slova a legendy vznikají pro zvolené téma a obtížnost a pak je kontroluje kód. Vy vybíráte typ křížovky, téma, velikost a obtížnost.',
    },
    {
      question: 'Dá se křížovka vytisknout?',
      answer:
        'Ano. Otevřete křížovku, zvolte „Uložit jako PDF“ a vyberte barevnou, nebo černobílou podobu. Můžete přidat řešení na samostatné stránce – to se hodí, když křížovky opravuje učitel.',
    },
    {
      question: 'V jakých jazycích můžu křížovku vytvořit?',
      answer:
        'Ve třiceti třech, od češtiny, polštiny a němčiny po arménštinu, japonštinu a svahilštinu. Každý jazyk má vlastní slova a legendy, psané rovnou v něm, ne přeložené. Pro křížovku v jiném jazyce přepněte jazyk webu v nabídce v záhlaví nebo v patičce.',
    },
    {
      question: 'Budou se slova opakovat?',
      answer: 'Ne. Každé zařízení si pamatuje slova, která už ukázalo, a každá nová křížovka je vynechá.',
    },
  ],
  related: ['solve', 'scanword', 'teachers'],
}
