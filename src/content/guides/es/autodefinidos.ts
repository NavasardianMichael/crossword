import type { Guide } from '../../types'

export const autodefinidos: Guide = {
  key: 'scanword',
  slug: 'autodefinidos',
  title: 'Autodefinidos: qué son, cómo se leen las flechas y cómo resolverlos online',
  shortTitle: 'Qué es un autodefinido',
  metaTitle: 'Autodefinidos online: qué son y cómo resolverlos',
  description:
    'Qué es un autodefinido, cómo se leen sus flechas y en qué se diferencia del crucigrama clásico. Trucos para resolver autodefinidos online en el móvil.',
  searchTerms: [
    'autodefinidos',
    'autodefinidos online',
    'qué es un autodefinido',
    'crucigrama autodefinido',
    'autodefinidos gratis',
    'crucigrama de flechas',
    'cómo resolver autodefinidos',
    'autodefinidos para imprimir',
    'autodefinido facil',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Los autodefinidos son crucigramas que llevan las definiciones dentro de la propia cuadrícula. No hay listas de horizontales y verticales al margen: cada definición ocupa una casilla y una pequeña flecha indica en qué dirección va la respuesta. En España es uno de los pasatiempos más populares de quiosco, junto a la sopa de letras y el crucigrama de siempre.',
    'En esta guía te contamos qué es exactamente un autodefinido, cómo se leen las flechas, en qué se diferencia de un crucigrama clásico y por qué es el formato más cómodo para jugar en el móvil. Con unos cuantos trucos, el primero te durará menos de lo que crees.',
  ],
  sections: [
    {
      id: 'que-es',
      heading: 'Qué es un autodefinido',
      blocks: [
        {
          kind: 'p',
          text: 'Un **autodefinido** es un crucigrama sin casillas numeradas en el que las definiciones se escriben en casillas de la cuadrícula, normalmente sombreadas. De cada una sale una flecha que señala la casilla donde empieza la respuesta y la dirección en que se escribe: hacia la derecha o hacia abajo. El nombre lo dice todo: el crucigrama se define a sí mismo.',
        },
        {
          kind: 'p',
          text: 'El nombre «autodefinido» es el habitual en España. En América Latina el mismo pasatiempo no tiene un nombre tan fijo y se ve como crucigrama autodefinido, crucigrama de flechas o, sencillamente, crucigrama. Fuera del español tiene muchos nombres: en inglés se llama arrowword, en alemán Schwedenrätsel (literalmente, crucigrama sueco) y en ruso skanvord.',
        },
        {
          kind: 'tip',
          text: 'En las revistas de pasatiempos es frecuente que una misma casilla lleve dos definiciones separadas por una raya, cada una con su flecha. Lee siempre la flecha que corresponde a cada mitad.',
        },
      ],
    },
    {
      id: 'flechas',
      heading: 'Cómo se leen las flechas',
      blocks: [
        {
          kind: 'p',
          text: 'La flecha es lo único que hay que aprender. Indica dos cosas: en qué casilla empieza la respuesta y hacia dónde sigue. Una flecha recta hacia la derecha significa que la respuesta empieza en la casilla de al lado y continúa en horizontal. Una flecha hacia abajo, que empieza justo debajo y continúa en vertical.',
        },
        {
          kind: 'list',
          items: [
            '**Flecha recta**: la respuesta sale en la misma dirección que apunta la flecha.',
            '**Flecha en ángulo**: la respuesta empieza en la casilla vecina pero gira, por ejemplo baja primero y luego avanza hacia la derecha. Fíjate en el último tramo de la flecha: esa es la dirección de la palabra.',
            '**La respuesta termina** donde aparece otra casilla de definición, una casilla negra o el borde de la cuadrícula. Así sabes cuántas letras tiene sin necesidad de un número.',
          ],
        },
      ],
    },
    {
      id: 'diferencias',
      heading: 'Autodefinido o crucigrama clásico: diferencias',
      blocks: [
        {
          kind: 'p',
          text: 'Los dos usan las mismas palabras y las mismas habilidades, pero se juegan de manera distinta. En el [crucigrama clásico](/crossword) hay que buscar la definición en una lista, con su número, y volver a la cuadrícula. En el [autodefinido](/scanword) la definición está pegada a la respuesta.',
        },
        {
          kind: 'list',
          items: [
            '**Definiciones**: en el clásico, en dos listas (horizontal y vertical); en el autodefinido, dentro de la cuadrícula.',
            '**Densidad**: en el autodefinido de revista casi no quedan casillas negras vacías; casi todo es letra o definición, así que hay muchos cruces.',
            '**Definiciones más cortas**: como deben caber en una casilla, suelen ser breves y directas.',
            '**Ritmo**: el autodefinido se resuelve de un tirón, saltando de una definición a la vecina; el clásico invita a leer primero todas las definiciones.',
          ],
        },
        {
          kind: 'p',
          text: 'No hay que confundirlo con el crucigrama blanco, otro clásico de los pasatiempos españoles, en el que es quien resuelve el que debe colocar las casillas negras. Ese es otro juego.',
        },
      ],
    },
    {
      id: 'en-el-movil',
      heading: 'Por qué el autodefinido es perfecto para el móvil',
      blocks: [
        {
          kind: 'p',
          text: 'En una pantalla pequeña, ir y venir entre una lista de definiciones y la cuadrícula cansa. En el autodefinido no hace falta: lees la definición, tocas la casilla de al lado y escribes. Por eso es el formato ideal para una pausa del café o un trayecto en metro.',
        },
        {
          kind: 'list',
          items: [
            'Los tamaños son **pequeño** (8×10), **mediano** (10×13) y **grande** (13×17), pensados para caber bien en la pantalla.',
            'En pantallas táctiles aparece un teclado propio con la ñ, sin que el teclado del sistema tape la cuadrícula.',
            'Puedes usar el zoom, comprobar o revelar letras y palabras, y tu avance se guarda solo.',
            'Si instalas el sitio como aplicación, los autodefinidos que ya abriste funcionan sin conexión.',
          ],
        },
      ],
    },
    {
      id: 'trucos',
      heading: 'Trucos para resolver autodefinidos',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Empieza por las definiciones más cortas: suelen llevar a palabras de tres o cuatro letras que desbloquean mucho.',
            'Aprovecha la densidad: cada letra que escribes forma parte de dos palabras, así que comprueba siempre el cruce.',
            'Cuenta las casillas hasta la siguiente definición antes de pensar la respuesta.',
            'Si una zona no sale, pasa a la contigua y vuelve después con más letras.',
          ],
        },
        {
          kind: 'p',
          text: 'Las definiciones del autodefinido van al grano. Practica con estas, del estilo que vas a encontrar:',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Rey de la selva', answer: 'león' },
            { clue: 'Lo da la vaca', answer: 'leche' },
            { clue: 'Mes de las flores', answer: 'mayo' },
            { clue: 'Hermano del padre', answer: 'tío' },
            { clue: 'Ave que anuncia el amanecer', answer: 'gallo' },
            { clue: 'Se usa para cortar', answer: 'tijeras' },
          ],
        },
        {
          kind: 'p',
          text: 'Para estrategias generales que sirven en cualquier formato, lee [cómo resolver crucigramas](/guides/como-resolver-crucigramas).',
        },
      ],
    },
  ],
  faq: [
    {
      question: '¿Por qué se llama autodefinido?',
      answer:
        'Porque las definiciones están dentro del propio crucigrama, en casillas de la cuadrícula, en lugar de en una lista aparte. El crucigrama se define a sí mismo.',
    },
    {
      question: '¿Es más fácil un autodefinido que un crucigrama?',
      answer:
        'Suele resultar más rápido, porque la definición está al lado de la respuesta y las definiciones son cortas. Pero la dificultad depende sobre todo del nivel: hay autodefinidos fáciles, de dificultad media y difíciles.',
    },
    {
      question: '¿Cómo sé cuántas letras tiene la respuesta?',
      answer:
        'Cuenta las casillas desde la flecha hasta la siguiente casilla de definición, una casilla negra o el borde. No hace falta que aparezca el número de letras.',
    },
    {
      question: '¿Puedo imprimir un autodefinido?',
      answer:
        'Sí. Abre el autodefinido, elige «Guardar como PDF» y escoge el aspecto; si quieres, añade una página aparte con las respuestas.',
    },
    {
      question: '¿Los autodefinidos son gratis?',
      answer:
        'Tu primer crucigrama o autodefinido de cada mes es gratis, sin cuenta. Después hay paquetes de créditos de pago único, sin suscripción, y abrir uno que te han compartido es siempre gratis. Más información en [créditos](/credits).',
    },
  ],
  related: ['solve', 'make', 'language-es'],
}
