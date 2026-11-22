import type { Guide } from '../../types'

export const keresztrejtvenyKeszites: Guide = {
  key: 'make',
  slug: 'keresztrejtveny-keszites',
  title: 'Keresztrejtvény készítés online: így készíts saját rejtvényt lépésről lépésre',
  shortTitle: 'Keresztrejtvény készítés online',
  metaTitle: 'Keresztrejtvény készítés online, lépésről lépésre',
  description:
    'Keresztrejtvény készítés pár perc alatt: válassz formát, témát és nehézséget, aztán küldd el linkkel, vagy nyomtasd ki PDF-ben, megfejtéssel együtt.',
  searchTerms: [
    'keresztrejtvény készítés',
    'keresztrejtvény készítő online',
    'keresztrejtvény készítő',
    'keresztrejtvény generátor',
    'saját keresztrejtvény készítése',
    'rejtvény készítés online',
    'keresztrejtveny keszites',
    'keresztrejtvény szerkesztő',
    'keresztrejtvény készítő ingyen',
    'crossword maker magyarul',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'A keresztrejtvény készítés kézzel sokkal tovább tart, mint gondolnád. A szavaknak hézag nélkül kell egymásba kapaszkodniuk, minden betűnek két irányban is meg kell állnia a helyét, és amikor végre összeáll a rács, jön a legnehezebb rész: minden szóhoz egy tisztességes, mégsem túl könnyű meghatározás. Egy keresztrejtvény-készítő leveszi a válladról a rács összerakását, így arra jut időd, ami igazán számít: miről szóljon a rejtvény, és kinek készül.',
    'Ez az útmutató végigvezet azon, hogyan készíts keresztrejtvényt online, az első választástól a kész rácsig, amelyet fejthetsz a telefonodon, elküldhetsz egy barátodnak, vagy kinyomtathatsz az osztálynak. Közben azt is megmutatjuk, miről ismerni fel a jó meghatározást, hogy még azelőtt megítélhesd a rejtvényt, mielőtt bárki más ceruzát fogna.',
  ],
  sections: [
    {
      id: 'forma',
      heading: '1. lépés: keresztrejtvény vagy skandináv?',
      blocks: [
        {
          kind: 'p',
          text: 'Két rejtvényforma közül választhatsz. A **klasszikus keresztrejtvényben** számozott mezők vannak, a meghatározások pedig két listában állnak a rács mellett: vízszintesen és függőlegesen. A **skandináv rejtvényben**, amelyet sokan svédrejtvénynek is hívnak, minden meghatározás magában a rácsban ül, és egy kis nyíl mutatja, merre fut a megfejtés.',
        },
        {
          kind: 'list',
          items: [
            'Válassz [keresztrejtvényt](/crossword), ha nyomtatni szeretnéd, ha iskolába viszed, vagy ha szereted előbb végigolvasni az összes meghatározást.',
            'Válassz [skandináv rejtvényt](/scanword) egy gyors játékhoz a telefonon: a meghatározás ott van, ahol írsz, nem kell a rács és a lista között ugrálni.',
          ],
        },
        {
          kind: 'tip',
          text: 'Nem tudod eldönteni? Kezdj egy kis méretű, könnyű keresztrejtvénnyel. Épp elég egy első próbához, egy kávészünethez vagy egy óra eleji bemelegítéshez.',
        },
      ],
    },
    {
      id: 'tema',
      heading: '2. lépés: miről szóljon a rejtvény?',
      blocks: [
        {
          kind: 'p',
          text: 'A téma adja meg a rejtvény jellegét. Ha minden megfejtés egy állat, egy étel vagy valami a sport világából, a rejtvény olyan, mintha valakinek személyesen készült volna, és a fejtő külön örül, amikor rájön a témára. A mindennapi szavak akkor jók, ha inkább változatosságot szeretnél, mint egységes témát.',
        },
        {
          kind: 'p',
          text: 'Tizenkét [téma](/topics) közül választhatsz, a természettől és az állatoktól a történelemig, a tudományig és a sportig. Az egyik a [helyi kultúra](/topics/local-culture), amely magyarul a hazai hagyományokról, tájakról, emberekről és ételekről szól – a Balatontól a pusztáig, a lángostól a kürtőskalácsig.',
        },
      ],
    },
    {
      id: 'meret-es-nehezseg',
      heading: '3. lépés: méret és nehézség',
      blocks: [
        {
          kind: 'p',
          text: 'A méret azt dönti el, meddig tart a rejtvény, a nehézség pedig azt, mennyire fogósak a meghatározások. A kettőt szándékosan külön választod: egy kicsi, de nehéz rejtvény gyors agytorna, egy nagy, könnyű pedig kellemes félóra egy bögre tea mellett.',
        },
        {
          kind: 'list',
          items: [
            '**Kis**: 9×9-es rács nagyjából 8–14 szóval, skandinávként 8×10-es. Gyerekeknek, kezdőknek és rövid szünetre.',
            '**Közepes**: 13×13-as rács 16–24 szóval, skandinávként 10×13-as. A legtöbb fejtő ezt szereti a mindennapokban.',
            '**Nagy**: 15×15-ös rács legfeljebb 34 szóval, akkora, mint egy újsági keresztrejtvény, skandinávként 13×17-es.',
          ],
        },
        {
          kind: 'p',
          text: 'A **könnyű** rejtvény gyakori szavakat és egyenes meghatározásokat használ. A **nehéz** ritkább szavakat, és olyan meghatározásokat, amelyekhez műveltség, szójáték vagy egy kis csavar kell. A **közepes** a kettő között van, és a legtöbb felnőttnek ez a jó választás.',
        },
      ],
    },
    {
      id: 'mesterseges-intelligencia',
      heading: '4. lépés: a szavakat az MI írja, a rácsot a kód rakja össze',
      blocks: [
        {
          kind: 'p',
          text: 'Amikor a készítés gombra nyomsz, a szavakat és a meghatározásokat egy mesterséges intelligencia, a Google Gemini írja, mégpedig egyenesen magyarul, nem angolból fordítva. Utána a kód veszi át a munkát: összerakja a rácsot, minden szót ellenőriz a magyar ábécé alapján, mezőben méri a hosszát, és kidob mindent, ami nem felel meg. Ha egy meghatározás elárulja a saját megfejtését, vagy egy szó el van írva, azt nem foltozza, hanem elveti.',
        },
        {
          kind: 'p',
          text: 'Minden eszköz megjegyzi azokat a szavakat is, amelyeket már mutatott neked, így egy új rejtvény sosem ismétel olyan megfejtést, amelyet már láttál. Ez többet ér, mint elsőre gondolnád: néhány rejtvény után épp a visszatérő szavaktól válik unalmassá a fejtés.',
        },
      ],
    },
    {
      id: 'jo-meghatarozas',
      heading: '5. lépés: miről ismered fel a jó meghatározást?',
      blocks: [
        {
          kind: 'p',
          text: 'Akár géppel, akár papíron és ceruzával készítesz keresztrejtvényt, érdemes tudni, milyen a jó meghatározás. Egyetlen tisztességes megfejtés illik rá, olyan szavakat használ, amelyeket a fejtő ismer, és nem tartalmazza sem magát a megfejtést, sem egy vele azonos tövű szót.',
        },
        {
          kind: 'compare',
          weak: 'Madár (5 betű)',
          strong: 'Kéményen fészkel, tavasszal érkezik (5 betű)',
        },
        {
          kind: 'p',
          text: 'Az első meghatározásra madarak tucatjai illenek, a második egyetlenegyre mutat. A betűszám segít, de arra való, hogy megerősítse a megfejtést, nem arra, hogy egyedül vezessen el hozzá.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Kéményen fészkel, tavasszal érkezik', answer: 'gólya' },
            { clue: 'Magyarország legnagyobb tava', answer: 'balaton' },
            { clue: 'Bográcsban főtt, paprikás leves', answer: 'gulyás' },
            { clue: 'Pörkölt mellé kerülő tojásos galuska', answer: 'nokedli' },
            { clue: 'Budapestet kettészelő folyó', answer: 'duna' },
          ],
        },
        {
          kind: 'tip',
          text: 'Hibásnak vagy igazságtalannak tűnik egy meghatározás? Jelentsd a rejtvény menüjéből. A jelentett meghatározásokat átnézzük és kivonjuk, hogy a következő fejtő már ne találkozzon velük.',
        },
      ],
    },
    {
      id: 'fejtes-megosztas-nyomtatas',
      heading: '6. lépés: fejtsd, oszd meg vagy nyomtasd ki',
      blocks: [
        {
          kind: 'p',
          text: 'A rejtvény azonnal megnyílik a böngészőben, telefonon vagy számítógépen. Érintőképernyőn saját billentyűzet jelenik meg az ékezetes betűkkel, így a rács végig látható marad. Ellenőrizhetsz egy betűt, egy szót vagy az egész rejtvényt, felfedhetsz egy megfejtést, ha elakadtál, és később is folytathatod: a betűid az eszközön maradnak.',
        },
        {
          kind: 'list',
          items: [
            '**Link megosztása**: az ismerősöd ugyanazt a rácsot és ugyanazokat a meghatározásokat kapja, ingyen és regisztráció nélkül.',
            '**Mentés PDF-ként**: alapértelmezett, színes vagy fekete-fehér kivitelben, kérésre külön oldalon a megfejtéssel. Jól jön órára, családi összejövetelre vagy egy térerő nélküli vonatútra.',
            '**Offline fejtés**: telepítsd az oldalt alkalmazásként, és a már megnyitott rejtvények internet nélkül is működnek.',
          ],
        },
      ],
    },
    {
      id: 'otletek',
      heading: 'Ötletek: rejtvény órára, bulira vagy ajándékba',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Az iskolában**: egy kis rejtvény a heti témából nyugodt kezdést ad az órának. Nyomtass páronként egy példányt, és hadd vitatkozzanak a megfejtéseken.',
            '**Születésnapra, családi ebédre**: küldd el a linket a családi csoportba, és nézd meg, ki végez elsőként.',
            '**Nyelvtanulóknak**: állítsd az oldal nyelvét a tanult nyelvre. A szavakat és a meghatározásokat azon a nyelven írja az MI, így a rejtvény egyben szókincsgyakorlat is.',
            '**Ingázáshoz**: egy közepes skandináv kitölt egy hosszabb buszutat, és nem kell hozzá se papír, se toll.',
          ],
        },
        {
          kind: 'p',
          text: 'Ha diákokkal használnád a rejtvényeket, nézd meg az útmutatót a [keresztrejtvényekről gyerekeknek és órára](/guides/keresztrejtveny-gyerekeknek). Ha pedig te ülsz a rács túloldalán, a [keresztrejtvény fejtés tippjei](/guides/keresztrejtveny-fejtes-tippek) segítenek továbblendülni.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Ingyenes a keresztrejtvény készítés?',
      answer:
        'Havonta az első rejtvényed ingyenes, fiók és regisztráció nélkül. Utána egyszeri kreditcsomagot vehetsz, előfizetés nélkül. Egy veled megosztott rejtvény megnyitása mindig ingyenes. A részleteket a [kreditek oldalán](/credits) találod.',
    },
    {
      question: 'Beírhatom a saját szavaimat és meghatározásaimat?',
      answer:
        'Jelenleg nem. A szavak és a meghatározások a választott témához és nehézséghez készülnek, és a kód ellenőrzi őket. Te a formát, a témát, a méretet és a nehézséget választod meg.',
    },
    {
      question: 'Kinyomtathatom a rejtvényt megfejtéssel együtt?',
      answer:
        'Igen. Nyisd meg a rejtvényt, válaszd a Mentés PDF-ként lehetőséget, és jelöld be a Megfejtés hozzáadása opciót. A kitöltött rács külön oldalra kerül, a kinézet lehet alapértelmezett, színes vagy fekete-fehér.',
    },
    {
      question: 'Milyen nyelveken készíthetek rejtvényt?',
      answer:
        'Harminchárom nyelven, a magyartól és az angoltól a németen át a japánig. Minden nyelvnek saját, azon a nyelven írt szavai és meghatározásai vannak. Másik nyelvhez állítsd át az oldal nyelvét a menüben.',
    },
    {
      question: 'Visszajönnek ugyanazok a szavak?',
      answer: 'Nem. Minden eszköz megjegyzi, milyen szavakat mutatott már, és minden új rejtvény kihagyja őket.',
    },
  ],
  related: ['solve', 'scanword', 'teachers'],
}
