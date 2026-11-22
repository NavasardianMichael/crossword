import type { Guide } from '../../types'

export const svenskaKorsord: Guide = {
  key: 'language-sv',
  slug: 'svenska-korsord',
  title: 'Svenska korsord online: å, ä och ö, äkta svenska ledtrådar och en lång tradition',
  shortTitle: 'Svenska korsord online',
  metaTitle: 'Svenska korsord online – skrivna på riktig svenska',
  description:
    'Svenska korsord online, skrivna direkt på svenska: så hanteras å, ä och ö i rutnätet, varför ledtrådarna inte är översatta och hur du kommer i gång.',
  searchTerms: [
    'svenska korsord online',
    'korsord på svenska',
    'svenska korsord gratis',
    'korsord online svenska',
    'svenska korsord',
    'svenska kryss online',
    'korsord åäö',
    'svenska korsord online gratis',
    'swedish crossword',
    'swedish crossword online',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Svenska korsord online ska kännas som de svenska korsord du redan känner: riktiga svenska ord, ledtrådar med svensk humor och å, ä och ö precis där de hör hemma. Här skrivs varje ord och varje ledtråd direkt på svenska, inte översatta från engelska, och rutnätet följer det svenska alfabetet bokstav för bokstav.',
    'I den här guiden går vi igenom vad som är speciellt med svenska för den som löser korsord – de tre extra bokstäverna, hur du skriver dem på tangentbordet, den svenska korsordstraditionen och varför en översatt ledtråd sällan håller – och hur du kommer i gång.',
  ],
  sections: [
    {
      id: 'a-a-o',
      heading: 'Å, ä och ö: tre bokstäver med egna rutor',
      blocks: [
        {
          kind: 'p',
          text: 'Det svenska alfabetet har 29 bokstäver, och å, ä och ö kommer sist, efter z. De är inga a och o med prickar eller ring, utan egna bokstäver, och i rutnätet tar var och en upp en egen ruta, precis som alla andra bokstäver. Ett ord räknas alltså i bokstäver: ”björn” har fem rutor och ”åsna” fyra.',
        },
        {
          kind: 'p',
          text: 'Det betyder också att prickarna räknas. När du kontrollerar ett ord måste varje bokstav vara exakt rätt, så ”far” godtas inte när svaret är ”får”. Det är en del av det roliga med svenska korsord: små skillnader ger helt olika ord, och korsningarna avgör vilket som gäller.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Pappa', answer: 'far' },
            { clue: 'Ger ull och bräker', answer: 'får' },
            { clue: 'Förälskad', answer: 'kär' },
            { clue: 'Stort kärl, till exempel för vin', answer: 'kar' },
            { clue: 'Ö med alvar och väderkvarnar', answer: 'öland' },
          ],
        },
      ],
    },
    {
      id: 'skriva-pa-tangentbordet',
      heading: 'Så skriver du å, ä och ö',
      blocks: [
        {
          kind: 'p',
          text: 'På en mobil eller surfplatta visas korsordets eget tangentbord under rutnätet. Det har de vanliga bokstavsraderna och en extra rad med å, ä och ö, så du behöver aldrig hålla inne en tangent eller leta i ett menyfönster. På datorn skriver du med ditt vanliga tangentbord, där å, ä och ö har sina egna tangenter.',
        },
        {
          kind: 'tip',
          text: 'Slå på ”Kontrollera medan jag skriver” i inställningarna om du vill se direkt när en bokstav är fel. Det är ett bra sätt att lära sig var å, ä och ö hör hemma.',
        },
      ],
    },
    {
      id: 'svensk-tradition',
      heading: 'En svensk korsordstradition',
      blocks: [
        {
          kind: 'p',
          text: 'Världens första korsord publicerades 1913 i New York World av Arthur Wynne, men Sverige har gjort formen till sin egen. Korsordet med ledtrådarna i rutorna och pilar mot svaren är så förknippat med Sverige att det kallas Schwedenrätsel i Tyskland – den svenska gåtan. Här heter den formen [rutkorsord](/scanword), och det klassiska med numrerade ledtrådar heter [korsord](/crossword).',
        },
        {
          kind: 'list',
          items: [
            '**Söndagskrysset**: för många hör ett korsord i helgens tidning till lika självklart som frukosten.',
            '**Korsordstidningarna**: hela tidningar med korsord, ofta med tävlingar där man skickar in lösningen och kan vinna priser.',
            '**Melodikrysset**: radioprogrammet där svaren handlar om musik, en lördagstradition för generationer av svenskar.',
            '**Bildkorsordet**: det svenska korsordet med en bild i rutnätet. Mer om det i guiden om [svenskt korsord](/guides/svenskt-korsord).',
          ],
        },
      ],
    },
    {
      id: 'inte-oversatt',
      heading: 'Varför ledtrådarna inte ska vara översatta',
      blocks: [
        {
          kind: 'p',
          text: 'En översatt ledtråd låter nästan alltid fel. Ordlekar försvinner, kulturella referenser blir obegripliga, och svaret har plötsligt fel längd för rutorna. Därför skrivs varje ord och varje ledtråd här direkt på svenska av en AI-modell, och koden kontrollerar att ordet består av svenska bokstäver och passar i rutnätet. Ett ord som inte håller kastas, det lappas aldrig ihop.',
        },
        {
          kind: 'compare',
          weak: 'Paus med en varm dryck (4 bokstäver)',
          strong: 'Kaffe och bulle, gärna klockan tre (4 bokstäver)',
        },
        {
          kind: 'p',
          text: 'Den första ledtråden kunde vara översatt från vilket språk som helst. Den andra är skriven av någon som vet vad fika är. Samma sak gäller ämnet [lokal kultur](/topics/local-culture), som på svenska handlar om midsommar, allemansrätten, Lucia, fjällen och de svenska klassikerna på julbordet.',
        },
      ],
    },
    {
      id: 'kom-igang',
      heading: 'Kom i gång med svenska korsord',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Välj form: rutkorsord med pilar eller korsord med numrerade ledtrådar.',
            'Välj ett ämne, en storlek – liten, mellan eller stor – och en svårighetsgrad: lätt, medel eller svår.',
            'Lös i webbläsaren, dela länken med en vän eller spara korsordet som PDF med facit.',
          ],
        },
        {
          kind: 'p',
          text: 'Varje enhet minns orden den redan har visat, så du får aldrig samma svar två gånger. Vill du lösa korsord på ett annat språk byter du sidans språk i menyn – det finns 33 språk, och vart och ett har sina egna ord och ledtrådar. Behöver du tips för att komma vidare finns guiden om att [lösa korsord](/guides/losa-korsord-tips).',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Räknas å, ä och ö som egna rutor?',
      answer: 'Ja. Varje bokstav tar en ruta, och å, ä och ö är egna bokstäver precis som i alfabetet.',
    },
    {
      question: 'Blir det fel om jag skriver a i stället för å?',
      answer:
        'Ja, när du kontrollerar räknas a och å som olika bokstäver, liksom a och ä och o och ö. Det är samma regel som i svenska korsord på papper.',
    },
    {
      question: 'Är det människor eller AI som skriver ledtrådarna?',
      answer:
        'En AI-modell, Google Gemini, skriver orden och ledtrådarna direkt på svenska. Koden bygger rutnätet och kontrollerar varje ord. Ser du en ledtråd som är fel kan du rapportera den från menyn i korsordet, så granskas den och tas bort.',
    },
    {
      question: 'Passar svenska korsord för den som lär sig svenska?',
      answer:
        'Ja. Börja med liten storlek och lätt nivå, där ledtrådarna använder vanliga ord. Korsorden blir ett bra sätt att öva ordförråd och stavning med å, ä och ö.',
    },
    {
      question: 'Kostar det något att lösa svenska korsord?',
      answer:
        'Ditt första korsord varje månad är gratis, utan konto. Därefter finns krediter som engångsköp, utan prenumeration, och att öppna ett delat korsord är alltid gratis. Läs mer på sidan om [krediter](/credits).',
    },
  ],
  related: ['scanword', 'solve', 'teachers'],
}
