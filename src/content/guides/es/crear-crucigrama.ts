import type { Guide } from '../../types'

export const crearCrucigrama: Guide = {
  key: 'make',
  slug: 'crear-crucigrama',
  title: 'Cómo crear un crucigrama online: guía paso a paso con generador',
  shortTitle: 'Cómo crear un crucigrama',
  metaTitle: 'Crear un crucigrama online: guía paso a paso',
  description:
    'Crea un crucigrama online en pocos minutos: elige formato, tema y dificultad, juega en el móvil, comparte un enlace o imprímelo en PDF con las respuestas.',
  searchTerms: [
    'crear crucigrama',
    'hacer un crucigrama online',
    'generador de crucigramas',
    'como hacer un crucigrama',
    'crear crucigrama gratis',
    'crucigrama personalizado',
    'hacer crucigramas para imprimir',
    'creador de crucigramas',
    'generador de autodefinidos',
    'crusigrama online',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Crear un crucigrama a mano lleva bastante más tiempo del que parece. Encajar palabras que se crucen bien ya es un pasatiempo en sí mismo, y escribir para cada una una definición justa, ni demasiado obvia ni imposible, es un segundo pasatiempo encima del primero. Un generador de crucigramas se encarga de la parte mecánica para que tú te dediques a lo importante: de qué va el crucigrama y para quién es.',
    'En esta guía verás, paso a paso, cómo hacer un crucigrama online en Crucigramas IA: desde la primera elección hasta una cuadrícula terminada que puedes resolver en el móvil, mandar a un amigo o imprimir para clase. Y, de paso, qué distingue un buen crucigrama de uno flojo, algo útil incluso si los sigues haciendo con lápiz y papel cuadriculado.',
  ],
  sections: [
    {
      id: 'formato',
      heading: 'Paso 1: crucigrama clásico o autodefinido',
      blocks: [
        {
          kind: 'p',
          text: 'Lo primero es decidir qué tipo de pasatiempo quieres. En el **crucigrama clásico** las casillas van numeradas y las definiciones esperan fuera de la cuadrícula, en dos listas: horizontal y vertical. En el **autodefinido** cada definición está dentro de la propia cuadrícula, con una flecha que señala dónde empieza la respuesta. Las palabras y las habilidades son las mismas; lo que cambia es la manera de leerlo.',
        },
        {
          kind: 'list',
          items: [
            'Elige el [crucigrama clásico](/crossword) si lo vas a imprimir, si es para una clase o si te gusta leer todas las definiciones antes de empezar.',
            'Elige el [autodefinido](/scanword) para una partida rápida en el teléfono: la definición está justo al lado de donde escribes, sin saltar entre la cuadrícula y una lista.',
          ],
        },
        {
          kind: 'tip',
          text: '¿No lo tienes claro? Empieza por un crucigrama clásico pequeño y fácil. Se resuelve en unos diez minutos: perfecto para una primera prueba o para calentar motores al principio de una clase.',
        },
      ],
    },
    {
      id: 'tema',
      heading: 'Paso 2: elige el tema',
      blocks: [
        {
          kind: 'p',
          text: 'El tema le da personalidad al crucigrama. Cuando todas las respuestas son animales, platos o cosas del deporte, el pasatiempo parece hecho a medida, y adivinar resulta más divertido porque el propio tema orienta la búsqueda. Los temas mezclados van bien para practicar sin más, cuando lo que buscas es variedad.',
        },
        {
          kind: 'p',
          text: 'Hay doce [temas](/topics) para elegir, entre ellos animales, [comida y bebida](/topics/food), geografía, ciencia, historia y [cultura hispana](/topics/local-culture), que gira en torno a las tradiciones, los lugares, los platos y las figuras del mundo hispanohablante, de Cádiz a Buenos Aires.',
        },
      ],
    },
    {
      id: 'tamano-y-dificultad',
      heading: 'Paso 3: tamaño y dificultad',
      blocks: [
        {
          kind: 'p',
          text: 'El tamaño decide cuánto dura el crucigrama; la dificultad, lo complicada que es cada definición. Van por separado a propósito: un crucigrama pequeño y difícil es un acertijo rápido, mientras que uno grande y fácil es media hora tranquila con un café.',
        },
        {
          kind: 'list',
          items: [
            '**Pequeño**: cuadrícula de 9×9 con unas 8 a 14 palabras. Ideal para niños, principiantes y una pausa de cinco minutos.',
            '**Mediano**: 13×13 con 16 a 24 palabras. El tamaño de diario para la mayoría.',
            '**Grande**: 15×15 con hasta 34 palabras, como el crucigrama del periódico del domingo.',
          ],
        },
        {
          kind: 'p',
          text: 'Las definiciones **fáciles** usan palabras corrientes y van directas al grano. Las **difíciles** recurren a palabras menos frecuentes, a la cultura general y a sentidos menos evidentes. La dificultad **media** queda entre las dos y es la que mejor encaja a la mayoría de los adultos. En el autodefinido los tamaños son 8×10, 10×13 y 13×17.',
        },
      ],
    },
    {
      id: 'que-hace-la-ia',
      heading: 'Paso 4: la IA escribe las palabras y las definiciones',
      blocks: [
        {
          kind: 'p',
          text: 'Al pulsar crear, un modelo de IA escribe las palabras y las definiciones directamente en español y sobre el tema que elegiste: nada se traduce del inglés. Después es el código, no el modelo, el que construye la cuadrícula, comprueba cada palabra con el alfabeto y su longitud en casillas, y descarta todo lo que no encaja. Una definición que delata su propia respuesta o una palabra con una errata se eliminan, no se remiendan.',
        },
        {
          kind: 'p',
          text: 'Además, cada dispositivo recuerda las palabras que ya te ha mostrado, así que un crucigrama nuevo nunca repite una respuesta que ya viste. Parece un detalle, pero tras unos cuantos crucigramas las palabras repetidas son lo primero que vuelve aburrido un pasatiempo.',
        },
      ],
    },
    {
      id: 'buenas-definiciones',
      heading: 'Paso 5: qué hace buena a una definición',
      blocks: [
        {
          kind: 'p',
          text: 'Hagas los crucigramas con un generador o a mano, conviene saber reconocer una buena definición. Tiene una sola respuesta razonable, usa palabras que quien resuelve conoce y no contiene la respuesta ni una palabra de la misma familia.',
        },
        {
          kind: 'compare',
          weak: 'Animal grande (8 letras)',
          strong: 'Gigante gris con trompa (8 letras)',
        },
        {
          kind: 'p',
          text: 'La primera definición vale para decenas de animales; la segunda apunta a uno solo. El número de letras ayuda, pero debería confirmar la respuesta, no ser la única forma de encontrarla.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Gigante gris con trompa', answer: 'elefante' },
            { clue: 'Se toma solo, cortado o con leche', answer: 'café' },
            { clue: 'Capital de Perú', answer: 'lima' },
            { clue: 'Su aguja siempre señala el norte', answer: 'brújula' },
            { clue: 'Arroz valenciano que se sirve en la sartén', answer: 'paella' },
          ],
        },
        {
          kind: 'tip',
          text: 'Si una definición te parece incorrecta o injusta, usa «Informar de una definición» en el menú del crucigrama. Las definiciones señaladas se revisan y se retiran, para que la próxima persona no se tope con ellas.',
        },
      ],
    },
    {
      id: 'jugar-compartir-imprimir',
      heading: 'Paso 6: juega, comparte o imprime',
      blocks: [
        {
          kind: 'p',
          text: 'Tu crucigrama se abre al momento en el navegador, en el móvil o en el ordenador. En una pantalla táctil aparece un teclado propio, con la ñ incluida, para que la cuadrícula no quede tapada. Puedes comprobar una letra, una palabra o todo el crucigrama, revelar una respuesta cuando te atasques, y dejarlo a medias para seguir más tarde: tus letras se guardan en el dispositivo.',
        },
        {
          kind: 'list',
          items: [
            '**Compartir un enlace**: tu amigo recibe exactamente la misma cuadrícula y las mismas definiciones, gratis y sin registrarse.',
            '**Guardar como PDF**: con el aspecto predeterminado, de colores o en blanco y negro, con o sin una página aparte de respuestas. Muy práctico para clase, una reunión familiar o un viaje sin cobertura.',
            '**Jugar sin conexión**: instala el sitio como aplicación y los crucigramas que ya abriste seguirán funcionando sin internet.',
          ],
        },
      ],
    },
    {
      id: 'ideas',
      heading: 'Ideas: crucigramas para clase, fiestas o como regalo',
      blocks: [
        {
          kind: 'list',
          items: [
            '**En clase**: un crucigrama pequeño sobre el tema de la semana es un comienzo tranquilo. Imprime una copia por pareja y deja que discutan las respuestas.',
            '**En una fiesta o una comida familiar**: comparte el enlace en el grupo de WhatsApp y a ver quién termina primero.',
            '**Para quien aprende otro idioma**: cambia el idioma del sitio. Las palabras y las definiciones se escriben de forma nativa en ese idioma, así que el crucigrama sirve también para repasar vocabulario.',
            '**En el transporte**: un autodefinido mediano dura lo que un trayecto de veinte minutos y no necesita papel.',
          ],
        },
        {
          kind: 'p',
          text: 'Si quieres usar crucigramas con alumnos, echa un vistazo a [crucigramas para niños y para clase](/guides/crucigramas-para-ninos). Y si estás al otro lado de la cuadrícula, la guía [cómo resolver crucigramas](/guides/como-resolver-crucigramas) tiene trucos para desatascarte.',
        },
      ],
    },
  ],
  faq: [
    {
      question: '¿El generador de crucigramas es gratis?',
      answer:
        'Tu primer crucigrama de cada mes es gratis, sin cuenta ni registro. Después puedes comprar paquetes de créditos con un pago único, sin suscripción. Abrir un crucigrama que alguien te compartió es siempre gratis. Tienes los detalles en la [página de créditos](/credits).',
    },
    {
      question: '¿Puedo escribir mis propias palabras y definiciones?',
      answer:
        'Por ahora no. Las palabras y las definiciones se escriben para el tema y la dificultad que eliges, y el código las revisa. Lo que tú decides es el formato, el tema, el tamaño y la dificultad.',
    },
    {
      question: '¿Cómo imprimo el crucigrama con las respuestas?',
      answer:
        'Abre el crucigrama, elige «Guardar como PDF» y marca «Añadir las respuestas»: la cuadrícula resuelta sale en una página aparte. Puedes elegir entre el aspecto predeterminado, de colores o en blanco y negro.',
    },
    {
      question: '¿En qué idiomas puedo crear un crucigrama?',
      answer:
        'En treinta y tres, del español, el portugués y el inglés al armenio, el japonés o el suajili. Cada idioma tiene sus propias palabras y definiciones, escritas de forma nativa y no traducidas, y los menús del sitio cambian con él.',
    },
    {
      question: '¿Se repiten las palabras de un crucigrama a otro?',
      answer: 'No. Cada dispositivo recuerda las palabras que ya mostró, y cada crucigrama nuevo las deja fuera.',
    },
  ],
  related: ['solve', 'scanword', 'teachers'],
}
