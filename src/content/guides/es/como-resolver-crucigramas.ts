import type { Guide } from '../../types'

export const comoResolverCrucigramas: Guide = {
  key: 'solve',
  slug: 'como-resolver-crucigramas',
  title: 'Cómo resolver crucigramas: trucos y estrategias para no quedarte en blanco',
  shortTitle: 'Cómo resolver crucigramas',
  metaTitle: 'Cómo resolver crucigramas: trucos que funcionan',
  description:
    'Cómo resolver crucigramas paso a paso: por dónde empezar, cómo leer cada definición, qué hacer cuando te atascas y cómo pasar de fácil a difícil sin frustrarte.',
  searchTerms: [
    'cómo resolver crucigramas',
    'como resolver crucigramas',
    'trucos para crucigramas',
    'consejos para hacer crucigramas',
    'cómo se hace un crucigrama',
    'crucigramas fáciles',
    'crucigramas difíciles',
    'aprender a hacer crucigramas',
    'crusigramas',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Saber cómo resolver crucigramas no es cuestión de tener un diccionario en la cabeza. Quien termina el crucigrama del domingo sin sudar no conoce más palabras que tú: sabe por dónde empezar, cómo leer una definición y qué hacer cuando una esquina no sale. Son trucos que se aprenden, y esta guía los reúne.',
    'Sirven igual para el crucigrama clásico que para el autodefinido, en papel o en el móvil. Al final encontrarás unas cuantas definiciones de muestra para practicar y una forma sencilla de subir de nivel, de fácil a difícil, sin desanimarte por el camino.',
  ],
  sections: [
    {
      id: 'por-donde-empezar',
      heading: 'Por dónde empezar un crucigrama',
      blocks: [
        {
          kind: 'p',
          text: 'No hace falta ir en orden. Antes de escribir nada, recorre todas las definiciones y quédate con las que sabes seguro. Cada respuesta cierta te regala letras en las palabras que la cruzan, y esas letras valen más que cualquier corazonada.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Empieza por las definiciones cortas y concretas: capitales, animales, notas musicales, cosas de casa.',
            'Rellena después las palabras que ya tienen dos o tres letras cruzadas.',
            'Fíjate en la longitud: una palabra de tres letras y otra de nueve piden estrategias distintas.',
            'Deja las definiciones largas o con doble sentido para cuando la cuadrícula esté medio llena.',
          ],
        },
        {
          kind: 'tip',
          text: 'Si una respuesta no te convence del todo, escríbela igualmente y comprueba los cruces. Si las palabras que la atraviesan empiezan a tener sentido, ibas bien; si no, bórrala sin pena.',
        },
      ],
    },
    {
      id: 'leer-la-definicion',
      heading: 'Cómo leer una definición',
      blocks: [
        {
          kind: 'p',
          text: 'Una definición dice más de lo que parece. La forma gramatical es una pista: si la definición está en plural, la respuesta casi siempre también; si es un verbo en infinitivo, buscas un infinitivo; si es femenina, la respuesta suele serlo. Un adjetivo pide un adjetivo.',
        },
        {
          kind: 'list',
          items: [
            '**Definición directa**: un sinónimo o una descripción sencilla. «Perro pequeño y faldero» lleva a una raza concreta.',
            '**Definición de cultura general**: un lugar, un personaje, una obra. Aquí ayuda leer el tema del crucigrama.',
            '**Definición con doble sentido**: juega con otra acepción de la palabra. Si nada encaja, piensa en un significado menos obvio.',
            '**Palabras de crucigrama**: en los pasatiempos de periódico se repiten ríos cortos, notas musicales y palabras con muchas vocales, porque encajan bien. Reconocerlas ahorra mucho tiempo.',
          ],
        },
        {
          kind: 'compare',
          weak: 'Leer la definición «Que no tiene fin» y escribir lo primero que viene a la cabeza.',
          strong: 'Ver que pide un adjetivo, contar las letras y probar con «eterno», «infinito» o «perpetuo» según los cruces.',
        },
      ],
    },
    {
      id: 'cuando-te-atascas',
      heading: 'Qué hacer cuando te atascas',
      blocks: [
        {
          kind: 'p',
          text: 'Todo el mundo se atasca alguna vez. La clave es no quedarse mirando la misma casilla: cambia de zona, vuelve más tarde o pide una pequeña ayuda.',
        },
        {
          kind: 'list',
          items: [
            '**Cambia de esquina**: a menudo la solución llega desde una palabra cruzada que aún no habías mirado.',
            '**Di la definición en voz alta** o reescríbela con tus propias palabras; a veces el doble sentido salta solo.',
            '**Piensa en las letras que tienes**: con una A en la segunda y en la cuarta casilla de cinco no hay tantas palabras posibles. Prueba vocales en los huecos.',
            '**Descansa cinco minutos**: la cabeza sigue trabajando, y al volver la respuesta parece evidente.',
            '**Usa las herramientas con mesura**: comprueba una sola letra antes de revelar toda la palabra.',
          ],
        },
      ],
    },
    {
      id: 'herramientas',
      heading: 'Comprobar, revelar y otras ayudas en el móvil',
      blocks: [
        {
          kind: 'p',
          text: 'Al resolver en Crucigramas IA tienes varias ayudas a mano. Puedes **comprobar** una letra, una palabra o todo el crucigrama, y **revelar** una letra, una palabra o la cuadrícula completa si te rindes. «Borrar letras incorrectas» limpia de un golpe lo que estaba mal.',
        },
        {
          kind: 'list',
          items: [
            '**Comprobar mientras escribo** marca una letra incorrecta en cuanto la escribes: ideal para aprender, menos para presumir.',
            '**Saltar casillas llenas** hace que el cursor pase por encima de las letras que ya tienes.',
            'El **cronómetro** te deja medir tu progreso, y el **zoom** acerca la cuadrícula en pantallas pequeñas.',
            'Tu avance se guarda en el dispositivo: puedes cerrar la pestaña y seguir otro día.',
          ],
        },
        {
          kind: 'tip',
          text: 'Para mejorar de verdad, intenta terminar sin revelar nada y usa solo «Comprobar letra» cuando dudes. Al final del crucigrama verás cuántas comprobaciones y revelaciones usaste: una buena forma de medir el progreso.',
        },
      ],
    },
    {
      id: 'practica',
      heading: 'Practica con unas definiciones',
      blocks: [
        {
          kind: 'p',
          text: 'Prueba con estas definiciones antes de mirar la respuesta. Fíjate en la forma gramatical de cada una: te dice qué tipo de palabra buscas.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Mamífero que vuela de noche y duerme boca abajo', answer: 'murciélago' },
            { clue: 'Instrumento de seis cuerdas típico del flamenco', answer: 'guitarra' },
            { clue: 'Río que pasa por Sevilla', answer: 'guadalquivir' },
            { clue: 'Que no tiene fin', answer: 'eterno' },
            { clue: 'Ave que repite lo que oye', answer: 'loro' },
          ],
        },
      ],
    },
    {
      id: 'de-facil-a-dificil',
      heading: 'De fácil a difícil: cómo subir de nivel',
      blocks: [
        {
          kind: 'p',
          text: 'La manera más rápida de mejorar es jugar a menudo en un nivel que te cueste un poco, pero no demasiado. Empieza con crucigramas **pequeños** en dificultad **fácil**; cuando los termines sin ayudas, pasa a **media**, y después a cuadrículas **medianas** y **grandes**. El nivel **difícil** es para cuando las definiciones de media empiecen a parecerte obvias.',
        },
        {
          kind: 'p',
          text: 'Elegir un tema que conoces bien también ayuda al principio: si te gusta cocinar, un crucigrama de [comida y bebida](/topics/food) se resuelve con más soltura. Luego alterna temas para ampliar vocabulario. Como cada dispositivo recuerda las palabras vistas, nunca te tocará la misma respuesta dos veces, así que cada partida es práctica nueva. Las reglas completas están en [cómo jugar](/rules).',
        },
      ],
    },
  ],
  faq: [
    {
      question: '¿Hay algún truco para resolver crucigramas más rápido?',
      answer:
        'El más eficaz es empezar por las definiciones que sabes seguro y aprovechar los cruces. También ayuda fijarse en la forma de la definición: plural, verbo, femenino. Con práctica, reconocerás tipos de definiciones que se repiten.',
    },
    {
      question: '¿Es trampa usar la opción de revelar?',
      answer:
        'No: es una ayuda, y está para usarla. Si quieres medir tu progreso, prueba primero con «Comprobar letra», que da menos información que revelar la palabra entera.',
    },
    {
      question: '¿Hacer crucigramas es bueno para la memoria?',
      answer:
        'Resolver crucigramas pone a trabajar el vocabulario, la memoria y la concentración, y mucha gente los usa como gimnasia mental diaria. Lo importante es que sea un hábito agradable, no una obligación.',
    },
    {
      question: '¿Qué diferencia hay entre un crucigrama y un autodefinido?',
      answer:
        'En el crucigrama clásico las definiciones van en listas fuera de la cuadrícula; en el autodefinido, dentro, con flechas. Lo explicamos en la guía de [autodefinidos](/guides/autodefinidos).',
    },
    {
      question: '¿Puedo seguir un crucigrama más tarde?',
      answer:
        'Sí. Tus letras se guardan en el dispositivo, y los crucigramas sin terminar aparecen en «Mis crucigramas». Si quieres uno nuevo, puedes [crear un crucigrama](/guides/crear-crucigrama) en un par de minutos.',
    },
  ],
  related: ['make', 'scanword', 'language-es'],
}
