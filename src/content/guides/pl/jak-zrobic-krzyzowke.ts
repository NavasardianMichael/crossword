import type { Guide } from '../../types'

export const jakZrobicKrzyzowke: Guide = {
  key: 'make',
  slug: 'jak-zrobic-krzyzowke',
  title: 'Jak zrobić krzyżówkę online: generator krzyżówek krok po kroku',
  shortTitle: 'Jak zrobić krzyżówkę',
  metaTitle: 'Jak zrobić krzyżówkę online: generator krok po kroku',
  description:
    'Jak zrobić krzyżówkę online w kilka minut: wybierz rodzaj, temat i poziom, sprawdź hasła, a potem wyślij link albo wydrukuj PDF. Porady na lekcję i imprezę.',
  searchTerms: [
    'jak zrobić krzyżówkę',
    'generator krzyżówek',
    'krzyżówka online',
    'jak zrobić krzyżówkę online',
    'kreator krzyżówek',
    'jak ułożyć krzyżówkę',
    'stwórz własną krzyżówkę',
    'krzyżówka do druku',
    'jak zrobic krzyzowke',
    'generator krzyzowek',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Jak zrobić krzyżówkę, którą naprawdę da się rozwiązać? Ręcznie zajmuje to więcej czasu, niż się wydaje. Znalezienie słów, które ładnie się krzyżują, to łamigłówka sama w sobie, a potem trzeba jeszcze do każdego napisać uczciwe hasło. Generator krzyżówek online zdejmuje z ciebie układanie diagramu, więc możesz się skupić na tym, co najważniejsze: o czym ma być krzyżówka i dla kogo.',
    'W tym poradniku krok po kroku pokazujemy, jak zrobić krzyżówkę online – od pierwszego wyboru do gotowego diagramu, który rozwiążesz na telefonie, wyślesz znajomym albo wydrukujesz dla klasy. Podpowiadamy też, po czym poznać dobre hasło, żeby słabą krzyżówkę odróżnić od dobrej, zanim zobaczy ją ktokolwiek inny.',
  ],
  sections: [
    {
      id: 'rodzaj-krzyzowki',
      heading: 'Krok 1: krzyżówka klasyczna czy szwedzka?',
      blocks: [
        {
          kind: 'p',
          text: 'Do wyboru są dwa rodzaje. **Klasyczna krzyżówka** ma ponumerowane kratki i dwie listy haseł obok diagramu: poziomo i pionowo. **Krzyżówka szwedzka**, nazywana też panoramiczną, ma hasła wpisane prosto w diagram, a mała strzałka pokazuje, gdzie zaczyna się odpowiedź. Słowa i umiejętności są te same, inaczej tylko się je czyta.',
        },
        {
          kind: 'list',
          items: [
            'Po [klasyczną krzyżówkę](/crossword) sięgnij do druku, na lekcję i dla tych, którzy lubią najpierw przeczytać wszystkie hasła.',
            'Po [krzyżówkę szwedzką](/scanword) sięgnij na szybką grę w telefonie: hasło stoi tuż obok miejsca, w którym piszesz, więc nie trzeba skakać między diagramem a listą.',
          ],
        },
        {
          kind: 'tip',
          text: 'Nie wiesz, od czego zacząć? Weź małą klasyczną krzyżówkę. Rozwiązuje się ją w kwadrans, w sam raz na pierwszy raz albo na rozgrzewkę przed lekcją.',
        },
      ],
    },
    {
      id: 'temat',
      heading: 'Krok 2: wybierz temat',
      blocks: [
        {
          kind: 'p',
          text: 'Temat nadaje krzyżówce charakter. Kiedy wszystkie odpowiedzi to zwierzęta, potrawy albo sprzęt sportowy, krzyżówka wydaje się zrobiona dla kogoś konkretnego, a rozwiązujący z przyjemnością wyłapują motyw przewodni. Tematy mieszane sprawdzają się wtedy, gdy liczy się różnorodność, a nie jeden wątek.',
        },
        {
          kind: 'p',
          text: 'Do wyboru jest dwanaście [tematów](/topics): między innymi zwierzęta, jedzenie i picie, geografia, historia, nauka i [kultura lokalna](/topics/local-culture), czyli polskie tradycje, miejsca, potrawy i ludzie – od Wawelu po pierogi. Ten ostatni temat najbardziej przypomina krzyżówki z polskiej gazety, bo hasła odwołują się do tego, co znamy z domu i ze szkoły.',
        },
      ],
    },
    {
      id: 'rozmiar-i-poziom',
      heading: 'Krok 3: rozmiar i poziom trudności',
      blocks: [
        {
          kind: 'p',
          text: 'Rozmiar decyduje o tym, jak długo potrwa rozwiązywanie, a poziom – jak trudne będzie każde hasło. To dwie osobne decyzje i dobrze, że tak jest: mała, trudna krzyżówka to szybka łamigłówka do kawy, a duża i łatwa – spokojne pół godziny na kanapie.',
        },
        {
          kind: 'list',
          items: [
            '**Mały**: diagram 9×9, mniej więcej od 8 do 14 słów. Dobry dla dzieci, początkujących i na pięciominutową przerwę.',
            '**Średni**: 13×13, od 16 do 24 słów. Codzienny rozmiar dla większości rozwiązujących.',
            '**Duży**: 15×15, od 22 do 34 słów – tyle, ile w porządnej gazetowej krzyżówce.',
          ],
        },
        {
          kind: 'p',
          text: 'Krzyżówka szwedzka ma własne wymiary: 8×10, 10×13 i 13×17 kratek. Na poziomie **łatwym** hasła prowadzą prosto do popularnych słów. Na **trudnym** pojawiają się rzadsze wyrazy, wiedza i mniej oczywiste znaczenia. **Średni** leży pośrodku i pasuje większości dorosłych.',
        },
      ],
    },
    {
      id: 'jak-pracuje-ai',
      heading: 'Krok 4: słowa i hasła pisze AI, a pilnuje ich kod',
      blocks: [
        {
          kind: 'p',
          text: 'Gdy zatwierdzisz wybór, słowa i hasła pisze model AI (Google Gemini) – od razu po polsku i dla wybranego tematu. Nic nie jest tłumaczone z angielskiego. Potem do pracy rusza kod, a nie model: układa diagram, sprawdza każde słowo z polskim alfabetem i jego długość w kratkach, a wszystko, co nie pasuje, odrzuca. Hasło, które zdradza odpowiedź, albo słowo z literówką nie jest łatane, tylko wylatuje.',
        },
        {
          kind: 'p',
          text: 'Każde urządzenie pamięta też słowa, które już widziałeś, więc nowa krzyżówka nie powtórzy odpowiedzi, którą znasz. To ważniejsze, niż się wydaje: po kilku diagramach właśnie powtórki najszybciej odbierają zabawie świeżość.',
        },
      ],
    },
    {
      id: 'dobre-haslo',
      heading: 'Krok 5: po czym poznać dobre hasło',
      blocks: [
        {
          kind: 'p',
          text: 'Niezależnie od tego, czy robisz krzyżówkę w generatorze, czy ołówkiem na kartce, warto wiedzieć, jak wygląda dobre hasło. Ma jedną uczciwą odpowiedź, używa słów znanych rozwiązującemu i nie zawiera samej odpowiedzi ani wyrazu o tym samym rdzeniu.',
        },
        {
          kind: 'compare',
          weak: 'Duże zwierzę (4 litery)',
          strong: 'Szary olbrzym z trąbą (4 litery)',
        },
        {
          kind: 'p',
          text: 'Pierwsze hasło pasuje do kilkunastu zwierząt, drugie wskazuje jedno. Liczba liter pomaga, ale powinna potwierdzać odpowiedź, a nie być jedyną drogą do niej. Zwróć też uwagę, że „słoń” ma cztery kratki: „ł” i „ń” to pełnoprawne litery, każda w swojej kratce.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Szary olbrzym z trąbą', answer: 'słoń' },
            { clue: 'Poranny napój z palonych ziaren', answer: 'kawa' },
            { clue: 'Stolica Polski nad Wisłą', answer: 'warszawa' },
            { clue: 'Jej igła zawsze wskazuje północ', answer: 'busola' },
            { clue: 'Krakowskie pieczywo w kształcie pierścienia, z makiem lub solą', answer: 'obwarzanek' },
          ],
        },
        {
          kind: 'tip',
          text: 'Jeśli jakieś hasło wydaje ci się błędne albo nieuczciwe, zgłoś je z menu krzyżówki opcją „Zgłoś hasło”. Zgłoszone hasła są sprawdzane i wycofywane, więc następna osoba już na nie nie trafi.',
        },
      ],
    },
    {
      id: 'graj-udostepnij-drukuj',
      heading: 'Krok 6: graj, udostępnij albo wydrukuj',
      blocks: [
        {
          kind: 'p',
          text: 'Krzyżówka otwiera się od razu w przeglądarce, na telefonie i na komputerze. Na ekranie dotykowym pojawia się wbudowana klawiatura z polskimi literami, a diagram zostaje na widoku. Możesz sprawdzić literę, słowo albo cały diagram, odkryć odpowiedź, gdy utkniesz, i wrócić później: twoje litery zapisują się na urządzeniu.',
        },
        {
          kind: 'list',
          items: [
            '**Udostępnij link**: znajomy dostaje dokładnie ten sam diagram i te same hasła, za darmo i bez rejestracji.',
            '**Zapisz jako PDF**: w wersji domyślnej, kolorowej albo czarno-białej, z odpowiedziami na osobnej stronie lub bez nich. Przyda się w klasie, na imprezie i w podróży bez zasięgu.',
            '**Graj offline**: zainstaluj stronę jak aplikację, a otwarte już krzyżówki będą działać bez internetu.',
          ],
        },
      ],
    },
    {
      id: 'pomysly',
      heading: 'Pomysły: krzyżówka na lekcję, na imieniny albo w prezencie',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Na lekcji**: mała krzyżówka na temat z bieżącego tygodnia to spokojny początek zajęć. Wydrukuj jedną kartkę na ławkę i pozwól parom spierać się o odpowiedzi.',
            '**Na imieninach albo przy rodzinnym obiedzie**: wrzuć link na grupowy czat i zobacz, kto skończy pierwszy.',
            '**Do nauki języka**: przełącz stronę na język, którego się uczysz. Słowa i hasła są pisane od razu w tym języku, więc krzyżówka staje się ćwiczeniem ze słownictwa.',
            '**W drodze**: średnia krzyżówka szwedzka wypełni dwadzieścia minut w tramwaju i nie wymaga długopisu.',
          ],
        },
        {
          kind: 'p',
          text: 'Więcej o krzyżówkach w szkole przeczytasz w poradniku [krzyżówki dla dzieci i na lekcję](/guides/krzyzowki-dla-dzieci). A jeśli wolisz rozwiązywać, niż układać, zajrzyj do tekstu o tym, [jak rozwiązywać krzyżówki](/guides/jak-rozwiazywac-krzyzowki) i nie utykać na trudnych hasłach.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Czy generator krzyżówek jest darmowy?',
      answer:
        'Pierwsza krzyżówka w każdym miesiącu jest za darmo, bez konta i bez rejestracji. Potem możesz jednorazowo kupić pakiet kredytów – bez abonamentu. Otwarcie krzyżówki, którą ktoś ci udostępnił, jest zawsze darmowe. Szczegóły znajdziesz na stronie [kredytów](/credits).',
    },
    {
      question: 'Czy mogę wpisać własne słowa i hasła?',
      answer:
        'Na razie nie. Słowa i hasła powstają dla wybranego tematu i poziomu, a potem sprawdza je kod. Ty decydujesz o rodzaju krzyżówki, temacie, rozmiarze i poziomie trudności.',
    },
    {
      question: 'Czy krzyżówkę da się wydrukować?',
      answer:
        'Tak. Otwórz krzyżówkę, wybierz „Zapisz jako PDF” i zdecyduj, czy ma być kolorowa, czy czarno-biała. Możesz dodać odpowiedzi na osobnej stronie – przydaje się, gdy krzyżówkę sprawdza nauczyciel.',
    },
    {
      question: 'W jakich językach mogę zrobić krzyżówkę?',
      answer:
        'W trzydziestu trzech, od polskiego, czeskiego i niemieckiego po ormiański, japoński i suahili. Każdy język ma własne słowa i hasła, pisane od razu w nim, a nie tłumaczone. Żeby zrobić krzyżówkę w innym języku, przełącz język strony w menu w nagłówku albo w stopce.',
    },
    {
      question: 'Czy te same słowa się powtórzą?',
      answer: 'Nie. Każde urządzenie pamięta słowa, które już pokazało, i każda nowa krzyżówka je pomija.',
    },
  ],
  related: ['solve', 'scanword', 'teachers'],
}
