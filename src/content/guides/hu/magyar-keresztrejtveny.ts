import type { Guide } from '../../types'

export const magyarKeresztrejtveny: Guide = {
  key: 'language-hu',
  slug: 'magyar-keresztrejtveny',
  title: 'Magyar keresztrejtvény online: ékezetes betűk, kettős betűk és igazi magyar meghatározások',
  shortTitle: 'Magyar keresztrejtvény online',
  metaTitle: 'Magyar keresztrejtvény online – igazi magyar szavakkal',
  description:
    'Magyar keresztrejtvény online, magyarul írt meghatározásokkal: így kerülnek a rácsba az ékezetes és a kettős betűk, és ezért nem fordítás a rejtvény.',
  searchTerms: [
    'magyar keresztrejtvény online',
    'magyar keresztrejtvény',
    'keresztrejtvény magyarul',
    'online keresztrejtvény ingyen',
    'magyar rejtvény online',
    'magyar keresztrejtveny online',
    'keresztrejtvény online magyar',
    'hungarian crossword',
    'hungarian crossword online',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Egy jó magyar keresztrejtvény online is olyan legyen, mint amit a rejtvényújságokból ismersz: igazi magyar szavak, magyaros észjárású meghatározások, és minden ékezet a helyén. Itt minden szót és minden meghatározást egyenesen magyarul írnak, nem angolból fordítva, a rács pedig betűről betűre a magyar ábécét követi.',
    'Ebben az útmutatóban végigvesszük, mi a különleges a magyar nyelvben a rejtvényfejtő szemével – az ékezetes magánhangzók, a kettős betűk, a gépelés a képernyő-billentyűzeten –, mit érdemes tudni a magyar rejtvényhagyományról, miért nem működik a lefordított meghatározás, és hogyan kezdj hozzá.',
  ],
  sections: [
    {
      id: 'ekezetes-maganhangzok',
      heading: 'Az ékezetes magánhangzók: mindegyik külön betű',
      blocks: [
        {
          kind: 'p',
          text: 'A magyarban tizennégy magánhangzó van: a, á, e, é, i, í, o, ó, ö, ő, u, ú, ü, ű. A rácsban mindegyik külön betű, és mindegyik egy mezőt foglal el. Az ékezet tehát nem díszítés: az ellenőrzés csak a pontosan beírt betűt fogadja el, így az a helyére írt á, vagy az ö helyére írt ő hibának számít.',
        },
        {
          kind: 'p',
          text: 'Ez a magyar rejtvény egyik szépsége. Egy apró vonás egészen más szót ad – kor és kór, tör és tőr, kerek és kerék –, és a keresztező szavak döntik el, melyik a helyes.',
        },
      ],
    },
    {
      id: 'kettos-betuk',
      heading: 'Kettős betűk: hány mezőt foglal a cs?',
      blocks: [
        {
          kind: 'p',
          text: 'A magyar ábécében a cs, a dz, a gy, a ly, a ny, a sz, a ty és a zs egy-egy betűnek számít, a dzs pedig hármas betű. A rácsban viszont minden leírt jel külön mezőbe kerül: a cs két mezőt foglal el, a dzs hármat. A szó hossza tehát a leírt betűk száma, nem az ábécé szerinti betűké.',
        },
        {
          kind: 'list',
          items: [
            'A **csikó** öt mezőt foglal el: c, s, i, k, ó.',
            'A **gyöngy** hat mező: g, y, ö, n, g, y.',
            'A **dzsungel** nyolc mező, mert a dzs három jelből áll.',
            'Az **asszony** hét mező: a hosszú ssz-ből csak az s kettőződik, és a rácsban minden betű külön mezőt kap.',
          ],
        },
        {
          kind: 'clues',
          items: [
            { clue: 'A ló kicsinye', answer: 'csikó' },
            { clue: 'Kagylóban terem', answer: 'gyöngy' },
            { clue: 'Sűrű trópusi erdő', answer: 'dzsungel' },
            { clue: 'Férjes nő', answer: 'asszony' },
            { clue: 'Apró nyílás, például a sajtban', answer: 'lyuk' },
          ],
        },
        {
          kind: 'tip',
          text: 'Ha a meghatározás mellett betűszám áll, mindig a leírt betűket számold. A csikó öt betű, nem négy.',
        },
      ],
    },
    {
      id: 'gepeles',
      heading: 'Így írod be az ékezetes betűket',
      blocks: [
        {
          kind: 'p',
          text: 'Telefonon és tableten a rejtvény saját billentyűzete jelenik meg a rács alatt. A megszokott betűsorok alatt egy külön sorban ott az összes ékezetes magánhangzó: á, é, í, ó, ö, ő, ú, ü, ű. Nem kell hosszan nyomva tartanod egy gombot, és nem kell menüben keresgélned. Számítógépen a saját billentyűzetedet használod, ahol az ékezetes betűknek megvan a maguk helye.',
        },
        {
          kind: 'tip',
          text: 'Kapcsold be a beállításokban az „Ellenőrzés gépelés közben” opciót, ha azonnal látni szeretnéd, ha egy betű hibás. Remek módja annak, hogy rögzüljön, hol rövid és hol hosszú egy magánhangzó.',
        },
      ],
    },
    {
      id: 'hagyomany',
      heading: 'A magyar rejtvényhagyomány',
      blocks: [
        {
          kind: 'p',
          text: 'Az első keresztrejtvényt Arthur Wynne közölte 1913-ban a New York World című lapban, de a magyar olvasók hamar a magukénak érezték a műfajt. Nálunk különösen erős a rejtvényújság-kultúra: a Füles évtizedek óta az egyik legismertebb magyar rejtvénylap, és az újságosoknál ma is egész polcnyi rejtvényújság sorakozik.',
        },
        {
          kind: 'list',
          items: [
            '**A poén**: a klasszikus magyar rejtvény egyik jellegzetessége, hogy a megfejtés egy vicc csattanója vagy egy idézet, amelyet a kijelölt sorokban kell összerakni.',
            '**A beküldés**: sok lapban a megfejtést be lehet küldeni, és a helyes megfejtők között nyereményeket sorsolnak ki.',
            '**A skandináv**: a nyilas, rácsba írt meghatározású rejtvény, más néven svédrejtvény, nálunk is a legnépszerűbb formák közé tartozik. Erről külön útmutatónk szól: [skandináv rejtvény](/guides/skandinav-rejtveny).',
          ],
        },
        {
          kind: 'p',
          text: 'Itt nincs elrejtett poén: minden megfejtés önálló szó, és mindegyiknek saját meghatározása van. A fejtés öröme viszont ugyanaz. A klasszikus, számozott formát a [keresztrejtvények](/crossword) között, a nyilasat a [skandinávok](/scanword) között találod.',
        },
      ],
    },
    {
      id: 'nem-forditas',
      heading: 'Miért nem jó a lefordított meghatározás?',
      blocks: [
        {
          kind: 'p',
          text: 'A lefordított meghatározás szinte mindig döcög. A szójáték elveszik, a kulturális utalás érthetetlenné válik, és a toldalékok sem illenek a megfejtéshez – a magyarban pedig, ahol egy szóhoz annyi rag és képző kapcsolódhat, ez különösen feltűnő. Ezért itt minden szót és meghatározást egyenesen magyarul ír egy MI-modell, a kód pedig ellenőrzi, hogy a szó magyar betűkből áll, és belefér a rácsba. Amelyik szó nem felel meg, azt elveti, sosem foltozza.',
        },
        {
          kind: 'compare',
          weak: 'Hagyományos meleg étel húsból (6 betű)',
          strong: 'Bográcsban rotyog, paprikás leves (6 betű)',
        },
        {
          kind: 'p',
          text: 'Az első meghatározás bármelyik nyelvből fordítódhatott volna, a másodikat olyasvalaki írta, aki tudja, mi a gulyás. Ugyanez igaz a [helyi kultúra](/topics/local-culture) témára, amely magyarul a Balatonról, a pálinkáról, a busójárásról, nagy költőinkről és a vasárnapi ebédről szól.',
        },
      ],
    },
    {
      id: 'kezdes',
      heading: 'Így kezdj hozzá',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Válassz formát: számozott keresztrejtvény vagy nyilas skandináv.',
            'Válassz témát, méretet – kis, közepes vagy nagy – és nehézséget: könnyű, közepes vagy nehéz.',
            'Fejtsd a böngészőben, küldd el a linket egy ismerősnek, vagy mentsd PDF-be megfejtéssel együtt.',
          ],
        },
        {
          kind: 'p',
          text: 'Minden eszköz megjegyzi a már mutatott szavakat, így ugyanaz a megfejtés sosem jön vissza. Ha más nyelven fejtenél, állítsd át az oldal nyelvét a menüben: harminchárom nyelv közül választhatsz, mindegyiknek saját szavai és meghatározásai vannak.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Egy mezőt foglal a cs vagy kettőt?',
      answer:
        'Kettőt. A rácsban minden leírt betű külön mező, így a cs, a gy, a ny, a sz és a zs két mezőt, a dzs hármat foglal el.',
    },
    {
      question: 'Hibának számít, ha a helyett á-t írok?',
      answer:
        'Igen. Az ellenőrzés az a és az á, az o, az ó, az ö és az ő, valamint az u, az ú, az ü és az ű között is különbséget tesz, mert ezek külön betűk.',
    },
    {
      question: 'Ki írja a meghatározásokat?',
      answer:
        'Egy MI-modell, a Google Gemini írja őket egyenesen magyarul, a rácsot és az ellenőrzést pedig a kód végzi. Ha hibás meghatározást találsz, jelentsd a rejtvény menüjéből: átnézzük, és kivonjuk.',
    },
    {
      question: 'Jó a magyar keresztrejtvény a magyart tanulóknak?',
      answer:
        'Igen. Kezdj kis mérettel és könnyű szinttel, ahol gyakori szavak és egyenes meghatározások vannak. A rejtvény jó gyakorlás a szókincshez és az ékezetek helyes használatához.',
    },
    {
      question: 'Mennyibe kerül?',
      answer:
        'Havonta az első rejtvényed ingyenes, fiók nélkül. Utána egyszeri kreditcsomagot vehetsz, előfizetés nélkül, egy megosztott rejtvény megnyitása pedig mindig ingyenes. Részletek a [kreditek oldalán](/credits).',
    },
  ],
  related: ['scanword', 'solve', 'teachers'],
}
