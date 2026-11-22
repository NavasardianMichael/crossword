import type { Guide } from '../../types'

export const goraKorsord: Guide = {
  key: 'make',
  slug: 'gora-korsord',
  title: 'Göra korsord online: så skapar du ett eget korsord steg för steg',
  shortTitle: 'Göra korsord online',
  metaTitle: 'Göra korsord online – skapa ett eget steg för steg',
  description:
    'Så gör du ett korsord online på några minuter: välj korsord eller rutkorsord, ämne och svårighetsgrad, och dela en länk eller skriv ut med facit.',
  searchTerms: [
    'göra korsord',
    'skapa korsord online',
    'korsordsgenerator',
    'göra eget korsord',
    'skapa eget korsord',
    'korsord generator',
    'gora korsord online',
    'korsordsmakare',
    'göra korsord själv',
    'crossword maker svenska',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Att göra korsord för hand är ett tålamodsprov. Orden ska haka i varandra utan att lämna hål, varje bokstav ska fungera åt två håll samtidigt, och när rutnätet äntligen går ihop återstår det svåraste: en rättvis ledtråd till varje ord. Med en korsordsgenerator slipper du pusslandet med rutorna och kan ägna dig åt det roliga – vad korsordet ska handla om och vem som ska lösa det.',
    'Här går vi igenom hur du skapar ett korsord online, från det första valet till ett färdigt rutnät som du kan lösa i mobilen, skicka till en vän eller skriva ut till klassen. På vägen får du också veta hur en bra ledtråd ser ut, så att du kan bedöma korsordet innan någon annan sätter pennan i det.',
  ],
  sections: [
    {
      id: 'valj-form',
      heading: 'Steg 1: Välj svenskt rutkorsord eller numrerat korsord',
      blocks: [
        {
          kind: 'p',
          text: 'I Sverige betyder ”korsord” för de flesta det man hittar i kvällstidningen och i korsordstidningarna: ledtrådarna står i små rutor inne i rutnätet, och en pil visar åt vilket håll svaret går. Här heter den formen **rutkorsord**. Den andra formen har numrerade rutor och två listor med ledtrådar, vågrätt och lodrätt. Den kallas ofta amerikanskt korsord, och i menyn heter den helt enkelt **korsord**.',
        },
        {
          kind: 'list',
          items: [
            'Välj ett [rutkorsord](/scanword) om du vill ha det svenska korsordet som du känner igen det. Ledtråden sitter precis där du skriver, vilket gör formen perfekt för mobilen.',
            'Välj ett [korsord med numrerade ledtrådar](/crossword) om det ska skrivas ut, användas i skolan eller lösas av någon som gillar att läsa igenom alla ledtrådar först.',
          ],
        },
        {
          kind: 'tip',
          text: 'Osäker? Börja med ett litet rutkorsord på lätt nivå. Det är lagom för ett första försök, en fikapaus eller en uppvärmning i klassrummet.',
        },
      ],
    },
    {
      id: 'valj-amne',
      heading: 'Steg 2: Välj vad korsordet ska handla om',
      blocks: [
        {
          kind: 'p',
          text: 'Ämnet ger korsordet personlighet. När varje svar är ett djur, en maträtt eller något från idrottens värld känns korsordet gjort för någon särskild, och den som löser får en extra kick när temat går upp. Vardagsord passar när du hellre vill ha variation än ett tema.',
        },
        {
          kind: 'p',
          text: 'Det finns tolv [ämnen](/topics) att välja mellan, från natur och djur till historia, vetenskap och sport. Ett av dem är [lokal kultur](/topics/local-culture), som på svenska handlar om våra egna traditioner, platser, personer och mat – midsommar, kräftskiva, fjällen och skärgården.',
        },
      ],
    },
    {
      id: 'storlek-och-svarighetsgrad',
      heading: 'Steg 3: Bestäm storlek och svårighetsgrad',
      blocks: [
        {
          kind: 'p',
          text: 'Storleken avgör hur länge korsordet räcker, svårighetsgraden hur kluriga ledtrådarna är. De väljs var för sig, och det är meningen: ett litet svårt korsord är en snabb hjärngympa, medan ett stort lätt passar en lugn söndagsförmiddag.',
        },
        {
          kind: 'list',
          items: [
            '**Liten**: ett numrerat korsord på 9×9 rutor med ungefär 8–14 ord, eller ett rutkorsord på 8×10 rutor. Bra för barn, nybörjare och korta pauser.',
            '**Mellan**: 13×13 rutor med 16–24 ord, eller ett rutkorsord på 10×13. Den storlek de flesta trivs bäst med till vardags.',
            '**Stor**: 15×15 rutor med upp till 34 ord, ungefär som ett tidningskorsord, eller ett rutkorsord på 13×17.',
          ],
        },
        {
          kind: 'p',
          text: '**Lätt** betyder vanliga ord och raka definitioner. **Svår** betyder ovanligare ord och ledtrådar som kräver allmänbildning, ordlekar eller en extra tankevända. **Medel** ligger däremellan och passar de flesta vuxna.',
        },
      ],
    },
    {
      id: 'vad-ai-gor',
      heading: 'Steg 4: AI:n skriver orden, koden bygger korsordet',
      blocks: [
        {
          kind: 'p',
          text: 'När du trycker på skapa skrivs orden och ledtrådarna av en AI-modell, Google Gemini, direkt på svenska. Ingenting översätts från engelska. Sedan tar koden över: den lägger ut rutnätet, kontrollerar varje ord mot det svenska alfabetet med å, ä och ö, räknar längden i rutor och sorterar bort allt som inte håller. En ledtråd som avslöjar sitt eget svar, eller ett ord med stavfel, kastas i stället för att lappas ihop.',
        },
        {
          kind: 'p',
          text: 'Varje enhet minns dessutom vilka ord den redan har visat, så ett nytt korsord upprepar aldrig ett svar du har sett. Den som löser korsord ofta vet hur mycket det betyder: det är de ständigt återkommande orden som får ett korsord att kännas slitet.',
        },
      ],
    },
    {
      id: 'bra-ledtradar',
      heading: 'Steg 5: Så känner du igen en bra ledtråd',
      blocks: [
        {
          kind: 'p',
          text: 'Oavsett om du gör korsord med en generator eller med penna och rutat papper lönar det sig att veta vad som gör en ledtråd bra. Den leder till ett enda rimligt svar, använder ord som den som löser förstår, och innehåller varken svaret självt eller ett ord med samma stam.',
        },
        {
          kind: 'compare',
          weak: 'Stort djur (3 bokstäver)',
          strong: 'Skogens konung, med skovelformade horn (3 bokstäver)',
        },
        {
          kind: 'p',
          text: 'Den första ledtråden kan betyda nästan vilket djur som helst, den andra pekar ut ett enda. Antalet bokstäver är en bra hjälp, men det ska bekräfta svaret, inte vara den enda vägen dit.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Skogens konung', answer: 'älg' },
            { clue: 'Reses och kläs med löv på midsommarafton', answer: 'majstång' },
            { clue: 'Sveriges största sjö', answer: 'vänern' },
            { clue: 'Bulle med grädde och mandelmassa', answer: 'semla' },
            { clue: 'Röda skaldjur på augustifesten', answer: 'kräftor' },
          ],
        },
        {
          kind: 'tip',
          text: 'Ser en ledtråd fel eller orättvis ut? Rapportera den från menyn i korsordet. Rapporterade ledtrådar granskas och plockas bort, så att nästa person slipper dem.',
        },
      ],
    },
    {
      id: 'losa-dela-skriva-ut',
      heading: 'Steg 6: Lös, dela eller skriv ut',
      blocks: [
        {
          kind: 'p',
          text: 'Korsordet öppnas direkt i webbläsaren, i mobilen eller på datorn. På en pekskärm dyker ett eget tangentbord upp, med å, ä och ö på en egen rad, så att rutnätet hela tiden syns. Du kan kontrollera en bokstav, ett ord eller hela korsordet, avslöja ett svar när du kör fast, och lämna korsordet för att fortsätta senare – bokstäverna sparas på enheten.',
        },
        {
          kind: 'list',
          items: [
            '**Dela en länk**: vännen får exakt samma rutnät och samma ledtrådar, gratis och utan konto.',
            '**Spara som PDF**: standard, färgstark eller svartvit, gärna med facit på en egen sida. Praktiskt inför lektionen, kalaset eller tågresan utan täckning.',
            '**Lös offline**: installera sidan som en app, så fungerar korsord du redan har öppnat även utan uppkoppling.',
          ],
        },
      ],
    },
    {
      id: 'ideer',
      heading: 'Idéer: korsord till skolan, kalaset eller som present',
      blocks: [
        {
          kind: 'list',
          items: [
            '**I skolan**: ett litet korsord om veckans tema ger en lugn start på lektionen. Skriv ut ett exemplar per par och låt eleverna resonera sig fram.',
            '**På kalaset eller släktmiddagen**: dela länken i gruppchatten och se vem som blir klar först.',
            '**Till 50-årsdagen**: ett korsord om lokal kultur eller favoritämnet blir ett roligt inslag mellan talen.',
            '**För den som lär sig ett språk**: byt sidans språk till det språk som ska övas. Orden och ledtrådarna skrivs direkt på det språket, så korsordet blir samtidigt glosträning.',
            '**På pendeltåget**: ett mellanstort rutkorsord räcker en bra bit och kräver varken papper eller penna.',
          ],
        },
        {
          kind: 'p',
          text: 'Ska du använda korsord med elever hittar du mer i guiden om [korsord för barn och skolan](/guides/korsord-for-barn). Sitter du själv på andra sidan rutnätet finns det [tips för att lösa korsord](/guides/losa-korsord-tips) när det tar stopp.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Är det gratis att göra korsord?',
      answer:
        'Ditt första korsord varje månad är gratis, utan konto och utan registrering. Därefter köper du krediter som engångsköp, utan prenumeration. Att öppna ett korsord som någon har delat med dig är alltid gratis. Mer om det på sidan om [krediter](/credits).',
    },
    {
      question: 'Kan jag skriva in egna ord och ledtrådar?',
      answer:
        'Inte i dagsläget. Orden och ledtrådarna skrivs utifrån ämnet och svårighetsgraden du väljer och kontrolleras sedan av koden. Det du bestämmer är formen, ämnet, storleken och svårighetsgraden.',
    },
    {
      question: 'Kan jag göra ett svenskt korsord med pilar?',
      answer:
        'Ja. Välj rutkorsord, så hamnar ledtrådarna i rutorna med pilar mot svaren, precis som i ett svenskt korsord i tidningen.',
    },
    {
      question: 'Kan jag skriva ut korsordet med facit?',
      answer:
        'Ja. Öppna korsordet, välj Spara som PDF och bocka i Lägg till facit. Facit hamnar på en egen sida, och du väljer själv mellan standard, färgstarkt och svartvitt.',
    },
    {
      question: 'Kommer samma ord tillbaka i nästa korsord?',
      answer: 'Nej. Varje enhet minns orden den har visat, och varje nytt korsord lämnar dem utanför.',
    },
  ],
  related: ['solve', 'scanword', 'teachers'],
}
