import type { Guide } from '../../types'

export const crucigramasEnEspanol: Guide = {
  key: 'language-es',
  slug: 'crucigramas-en-espanol',
  title: 'Crucigramas en español: la ñ, las tildes y por qué importan las definiciones nativas',
  shortTitle: 'Crucigramas en español',
  metaTitle: 'Crucigramas en español online: la ñ y las tildes',
  description:
    'Crucigramas en español online, escritos en español y no traducidos: cómo se tratan la ñ y las tildes, la tradición de los pasatiempos y cómo empezar a jugar.',
  searchTerms: [
    'crucigramas en español',
    'crucigramas en español online',
    'crucigramas online gratis',
    'crucigrama en castellano',
    'crucigramas con ñ',
    'crucigramas en español para imprimir',
    'spanish crossword',
    'crossword in spanish',
    'crusigramas en español',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Los crucigramas en español tienen sus propias reglas, aunque casi nadie las ponga por escrito: la ñ ocupa su casilla, las tildes no se escriben y una buena definición juega con las palabras como solo se juega en español. Un crucigrama traducido del inglés se nota a la legua; uno pensado en español, también, pero para bien.',
    'En esta guía repasamos qué tiene de especial el español en un crucigrama, cómo se escriben las letras en la cuadrícula de Crucigramas IA, un poco de la tradición de los pasatiempos en nuestro idioma y por qué es importante que las definiciones se escriban directamente en español.',
  ],
  sections: [
    {
      id: 'letras',
      heading: 'La ñ, las tildes y la diéresis en la cuadrícula',
      blocks: [
        {
          kind: 'p',
          text: 'La regla de los crucigramas en español es la de toda la vida, la misma que en los periódicos: las tildes no se escriben y la ñ sí. Cada casilla lleva una letra mayúscula sin acento.',
        },
        {
          kind: 'list',
          items: [
            '**La ñ es una letra propia** y ocupa su propia casilla. NIÑO tiene cuatro casillas, y en la casilla de la ñ solo vale la Ñ, nunca la N.',
            '**Las tildes no se escriben**: CAMIÓN va en la cuadrícula como CAMION, y ÁRBOL como ARBOL. La palabra mide lo mismo, con o sin acento.',
            '**La diéresis tampoco**: PINGÜINO se escribe PINGUINO.',
            '**Ch, ll y rr son dos letras**: cada una ocupa su casilla. CALLE tiene cinco casillas y PERRO, también cinco.',
          ],
        },
        {
          kind: 'tip',
          text: 'Si escribes con tu propio teclado y pulsas á o é, no pasa nada: la letra entra sin acento. Y la ñ nunca se confunde con la n.',
        },
      ],
    },
    {
      id: 'teclado',
      heading: 'Cómo escribir en el móvil: el teclado con ñ',
      blocks: [
        {
          kind: 'p',
          text: 'En el móvil o en la tableta, al tocar una casilla aparece un teclado propio del sitio, en lugar del teclado del sistema, para que la cuadrícula quede siempre a la vista. Es un teclado español: la Ñ está en la fila central, justo después de la L, como en los teclados de España. No hay teclas con tilde porque no hacen falta.',
        },
        {
          kind: 'p',
          text: 'En el ordenador puedes escribir con el teclado físico. Si tu teclado no tiene ñ, puedes usar el método habitual de tu sistema para escribirla; las letras con tilde se convierten solas en la letra sin acento.',
        },
      ],
    },
    {
      id: 'tradicion',
      heading: 'La tradición de los crucigramas en español',
      blocks: [
        {
          kind: 'p',
          text: 'El crucigrama nació en 1913 en el periódico estadounidense New York World, obra de Arthur Wynne, y pronto cruzó el Atlántico. En español se le llamó crucigrama, de cruz y del griego grama, letra, y desde entonces es un fijo de la sección de pasatiempos de periódicos y revistas a ambos lados del océano.',
        },
        {
          kind: 'p',
          text: 'En España, los cuadernillos de quiosco reúnen una familia entera de juegos de palabras: el crucigrama clásico, el [autodefinido](/guides/autodefinidos) con las definiciones dentro de la cuadrícula, el crucigrama blanco, la sopa de letras y los jeroglíficos. El autodefinido es, para muchos, el pasatiempo de las vacaciones por excelencia.',
        },
        {
          kind: 'p',
          text: 'En Crucigramas IA puedes jugar los dos formatos más conocidos: el [crucigrama clásico](/crossword), con sus definiciones en horizontal y vertical, y el [autodefinido](/scanword), con sus flechas.',
        },
      ],
    },
    {
      id: 'definiciones-nativas',
      heading: 'Por qué las definiciones deben escribirse en español',
      blocks: [
        {
          kind: 'p',
          text: 'Traducir un crucigrama casi nunca funciona. Las palabras cambian de longitud al pasar de un idioma a otro: house tiene cinco letras y casa, cuatro, así que la cuadrícula deja de encajar. Y una definición con gracia en inglés suele perderla en español, porque el doble sentido depende de la lengua.',
        },
        {
          kind: 'p',
          text: 'Por eso en este sitio las palabras y las definiciones las escribe un modelo de IA directamente en español, como lo haría un autor de crucigramas hispanohablante, con palabras de la norma común a España y América Latina que se entienden a los dos lados del Atlántico. Después, el código comprueba cada palabra con el alfabeto español y cuenta sus casillas, con la ñ como una casilla propia y las tildes fuera, y descarta cualquier palabra o definición que no cumpla las reglas.',
        },
        {
          kind: 'compare',
          weak: 'Una definición traducida de un refrán inglés: «Fruta que, una al día, aleja al médico» (manzana).',
          strong: 'Una definición pensada en español: «La de la discordia» (manzana).',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Doce meses', answer: 'año' },
            { clue: 'Ave zancuda que anida en los campanarios', answer: 'cigüeña' },
            { clue: 'Se pone en la mesa para no mancharla', answer: 'mantel' },
            { clue: 'Elevación del terreno más alta que una colina', answer: 'montaña' },
            { clue: 'Plato frío de tomate que se toma en verano', answer: 'gazpacho' },
          ],
        },
      ],
    },
    {
      id: 'cultura-hispana',
      heading: 'El tema de cultura hispana',
      blocks: [
        {
          kind: 'p',
          text: 'Entre los doce temas hay uno pensado para hispanohablantes: [cultura hispana](/topics/local-culture). Sus respuestas giran en torno a las tradiciones, los lugares, las personas y la comida del mundo hispanohablante. Es el tema ideal para un crucigrama de sobremesa con la familia o para quien aprende español y quiere algo más que vocabulario.',
        },
      ],
    },
    {
      id: 'como-empezar',
      heading: 'Cómo empezar a jugar en español',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Comprueba que el sitio está en español: el idioma del crucigrama es el del sitio. Si no lo está, cámbialo en el menú de idioma del encabezado o del pie de página.',
            'Elige crucigrama clásico o autodefinido, un tema, un tamaño y una dificultad.',
            'Pulsa crear y empieza a escribir. Las letras se guardan solas en tu dispositivo.',
          ],
        },
        {
          kind: 'p',
          text: 'Si es tu primera vez, la guía [cómo resolver crucigramas](/guides/como-resolver-crucigramas) te da los trucos básicos.',
        },
      ],
    },
  ],
  faq: [
    {
      question: '¿Los crucigramas en español llevan tildes?',
      answer:
        'No. Como en los crucigramas de periódico, las letras van sin tilde y sin diéresis: CAMIÓN se escribe CAMION. La ñ, en cambio, sí se escribe y ocupa su propia casilla.',
    },
    {
      question: '¿La ñ cuenta como una letra distinta de la n?',
      answer:
        'Sí. Es una letra del alfabeto español y tiene su propia casilla y su propia tecla en el teclado del sitio. En una casilla de ñ no vale una n.',
    },
    {
      question: '¿Las definiciones están traducidas del inglés?',
      answer:
        'No. Las palabras y las definiciones se escriben directamente en español. Nada se traduce, y el código descarta lo que no cumple las reglas del español.',
    },
    {
      question: '¿Puedo hacer crucigramas en otros idiomas?',
      answer:
        'Sí, en treinta y tres. Cambia el idioma del sitio en el menú de idioma y los crucigramas, las definiciones y los menús pasan a ese idioma.',
    },
    {
      question: '¿Cuánto cuesta?',
      answer:
        'Tu primer crucigrama de cada mes es gratis, sin cuenta. Después hay paquetes de créditos de pago único, sin suscripción, y abrir un crucigrama compartido es siempre gratis. Los detalles, en [créditos](/credits).',
    },
  ],
  related: ['solve', 'scanword', 'teachers'],
}
