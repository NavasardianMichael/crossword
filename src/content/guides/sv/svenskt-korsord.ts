import type { Guide } from '../../types'

export const svensktKorsord: Guide = {
  key: 'scanword',
  slug: 'svenskt-korsord',
  title: 'Svenskt korsord: så fungerar korsordet med ledtrådarna i rutorna',
  shortTitle: 'Svenskt korsord med pilar',
  metaTitle: 'Svenskt korsord – så löser du korsordet med pilar',
  description:
    'Det svenska korsordet har ledtrådarna i rutorna och pilar mot svaren. Så läser du pilarna, så skiljer det sig från amerikanska korsord och så löser du online.',
  searchTerms: [
    'svenskt korsord',
    'svenskt korsord online',
    'korsord med pilar',
    'bildkorsord',
    'rutkorsord',
    'korsord ledtrådar i rutorna',
    'svenskt korsord gratis',
    'svenska korsord pilar',
    'schwedenrätsel',
    'arrowword',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Ett svenskt korsord är det som de flesta i Sverige menar när de bara säger korsord: ledtrådarna står i små rutor inne i själva rutnätet, och en pil visar var svaret börjar och åt vilket håll det går. Formen är så förknippad med Sverige att den kallas Schwedenrätsel i Tyskland och svédrejtvény i Ungern – den svenska gåtan.',
    'Här på sidan heter formen **rutkorsord**, för att skilja den från korsordet med numrerade ledtrådar. Den här guiden förklarar hur ett svenskt korsord är uppbyggt, hur du läser pilarna, vad som skiljer det från ett amerikanskt korsord och varför det är som gjort för att lösas i mobilen.',
  ],
  sections: [
    {
      id: 'vad-ar-ett-svenskt-korsord',
      heading: 'Vad är ett svenskt korsord?',
      blocks: [
        {
          kind: 'p',
          text: 'I ett svenskt korsord används nästan varje ruta. Några rutor är ledtrådsrutor med en kort text och en pil, nästan alla andra är vita rutor för bokstäverna. Det finns inga listor bredvid rutnätet: allt du behöver står i själva rutnätet, och en färgad ruta utan text är bara dekoration.',
        },
        {
          kind: 'p',
          text: 'I tidningar och korsordstidningar har det svenska korsordet ofta en bild mitt i rutnätet, och då kallas det gärna **bildkorsord**. Bilden kan vara dekoration eller ge svaret på något av orden. Här består rutnätet bara av ledtrådar och bokstäver, så du kan lösa det på vilken skärm som helst.',
        },
        {
          kind: 'list',
          items: [
            '**Ledtrådsrutor** är färgade och rymmer en eller två korta ledtrådar.',
            '**Pilarna** visar var svaret börjar och om det går åt höger eller nedåt.',
            '**Vita rutor** håller en bokstav var, och varje bokstav ingår oftast i två ord.',
          ],
        },
      ],
    },
    {
      id: 'las-pilarna',
      heading: 'Så läser du pilarna',
      blocks: [
        {
          kind: 'p',
          text: 'Pilen är korsordets vägvisare. Den pekar från ledtrådsrutan mot den första bokstaven i svaret och visar riktningen. Svaret fortsätter sedan i den riktningen tills det tar stopp vid kanten eller nästa ledtrådsruta.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'En pil åt höger betyder att svaret börjar i rutan till höger och läses vågrätt.',
            'En pil nedåt betyder att svaret börjar i rutan under och läses lodrätt.',
            'Står det två ledtrådar i samma ruta pekar den övre oftast åt höger och den undre nedåt.',
            'En böjd pil visar att svaret börjar bredvid eller under ledtrådsrutan och sedan svänger av. Det händer när det inte finns plats för ledtråden precis före svaret.',
          ],
        },
        {
          kind: 'tip',
          text: 'Tryck på en ledtrådsruta eller en bokstavsruta, så syns hela ledtråden i listen ovanför rutnätet. Det är lättare att läsa än den lilla texten i rutan, särskilt på en telefon.',
        },
      ],
    },
    {
      id: 'skillnad-mot-amerikanskt-korsord',
      heading: 'Skillnaden mot ett amerikanskt korsord',
      blocks: [
        {
          kind: 'p',
          text: 'Det amerikanska korsordet, som ibland också kallas engelskt korsord, har numrerade rutor och två listor med ledtrådar bredvid rutnätet: vågrätt och lodrätt. Det var den formen som Arthur Wynne publicerade i tidningen New York World 1913, och det räknas som världens första korsord. Det svenska korsordet bygger på samma idé – ord som korsar varandra – men läses på ett helt annat sätt.',
        },
        {
          kind: 'list',
          items: [
            '**Var ledtrådarna står**: i rutnätet i det svenska korsordet, i listor bredvid i det amerikanska.',
            '**Hur långa de är**: i ett svenskt korsord måste ledtråden rymmas i en ruta, så den är högst några ord. I ett amerikanskt kan den vara en hel mening.',
            '**Hur du hittar ordet**: pilen visar vägen i det svenska, numret i det amerikanska.',
            '**Hur du läser**: det svenska korsordet löser du där du står, det amerikanska ofta genom att först läsa listorna.',
          ],
        },
        {
          kind: 'p',
          text: 'Båda formerna finns här. Gillar du listor och numrerade ledtrådar väljer du [korsord](/crossword), vill du ha det svenska korsordet väljer du [rutkorsord](/scanword).',
        },
      ],
    },
    {
      id: 'korta-ledtradar',
      heading: 'Korta ledtrådar, kluriga svar',
      blocks: [
        {
          kind: 'p',
          text: 'Eftersom ledtråden ska rymmas i en liten ruta är den sällan mer än ett par ord. Det gör det svenska korsordet snabbt att läsa, men också lite lurigt: ett enda ord som ledtråd kan ofta betyda flera saker, och det är korsningarna som avgör vilket svar som är rätt. Lär dig tänka i synonymer, så går det fort.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Stor ö i Östersjön', answer: 'gotland' },
            { clue: 'Gul i gräsmattan', answer: 'maskros' },
            { clue: 'Fikabröd', answer: 'bulle' },
            { clue: 'Inte varm, inte kall', answer: 'ljum' },
            { clue: 'Blått skogsbär', answer: 'blåbär' },
          ],
        },
      ],
    },
    {
      id: 'i-mobilen',
      heading: 'Varför det svenska korsordet passar i mobilen',
      blocks: [
        {
          kind: 'p',
          text: 'På en liten skärm är det svenska korsordet nästan oslagbart. Ledtråden sitter precis där du skriver, så du slipper bläddra mellan rutnätet och en lång lista. Ett tryck väljer ordet, tangentbordet med å, ä och ö ligger under rutnätet, och du kan nypa för att zooma in på en hörna.',
        },
        {
          kind: 'list',
          items: [
            '**Liten**: 8×10 rutor, lagom till en kaffe eller en kort bussresa.',
            '**Mellan**: 10×13 rutor, för en längre stund i soffan.',
            '**Stor**: 13×17 rutor, för dig som vill ha ett riktigt söndagskryss.',
          ],
        },
        {
          kind: 'p',
          text: 'Halvlösta korsord sparas på enheten, och installerar du sidan som en app fungerar korsord du redan har öppnat även offline.',
        },
      ],
    },
    {
      id: 'kom-igang',
      heading: 'Kom igång med ditt första svenska korsord',
      blocks: [
        {
          kind: 'p',
          text: 'Öppna [rutkorsorden](/scanword), välj ett ämne, en storlek och en svårighetsgrad, och tryck på skapa. Orden och ledtrådarna skrivs direkt på svenska av AI, och koden kontrollerar varje ord innan det hamnar i rutnätet. Vill du veta mer om hur det går till finns guiden om att [göra korsord online](/guides/gora-korsord), och fastnar du har vi [tips för att lösa korsord](/guides/losa-korsord-tips).',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Är rutkorsord och svenskt korsord samma sak?',
      answer:
        'Ja. Rutkorsord är det namn formen har på sidan: ett korsord med ledtrådarna i rutorna och pilar mot svaren, alltså det svenska korsordet.',
    },
    {
      question: 'Vad är ett bildkorsord?',
      answer:
        'Ett svenskt korsord med en bild i rutnätet, så som det ofta ser ut i tidningar. Här har rutnätet ingen bild, bara ledtrådar och bokstäver.',
    },
    {
      question: 'Varför böjer sig vissa pilar?',
      answer:
        'När det inte finns plats för ledtråden precis före svaret ligger den ovanför eller bredvid första bokstaven, och pilen böjs för att visa åt vilket håll svaret går.',
    },
    {
      question: 'Kan jag skriva ut ett svenskt korsord?',
      answer:
        'Ja. Välj Spara som PDF i korsordet, i färg eller svartvitt, och lägg till facit på en egen sida om du vill.',
    },
    {
      question: 'Är svenska korsord svårare än amerikanska?',
      answer:
        'Inte nödvändigtvis. Ledtrådarna är kortare och kan därför vara mer tvetydiga, men korsningarna hjälper mer eftersom nästan varje ruta används. Svårighetsgraden väljer du själv: lätt, medel eller svår.',
    },
  ],
  related: ['solve', 'make', 'language-sv'],
}
