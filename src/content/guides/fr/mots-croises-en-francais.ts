import type { Guide } from '../../types'

export const motsCroisesEnFrancais: Guide = {
  key: 'language-fr',
  slug: 'mots-croises-en-francais',
  title: 'Mots croisés en français  accents, Œ et la tradition des grilles',
  shortTitle: 'Mots croisés en français',
  metaTitle: 'Mots croisés en français  accents, Œ et tradition',
  description:
    'Les mots croisés en français ont leurs règles  grille sans accents ni cédille, un Œ dans une seule case et une longue tradition, du journal aux mots fléchés.',
  searchTerms: [
    'mots croisés en français',
    'mots croisés français en ligne',
    'grille de mots croisés en français',
    'accents dans les mots croisés',
    'mots croises francais',
    'mots croisés œ',
    'histoire des mots croisés en France',
    'mots croisés langue française',
    'french crossword',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Les mots croisés en français ne sont pas des mots croisés anglais traduits. La langue a ses accents, sa cédille, ses ligatures, ses terminaisons et ses jeux de mots, et les grilles françaises ont pris au fil du temps des habitudes bien à elles. Quiconque a rempli une grille dans le journal du dimanche sait qu’on n’y écrit pas ÉTÉ mais ETE.',
    'Ce guide explique ce qui rend les grilles en français particulières  comment s’écrivent les lettres accentuées et le Œ, d’où vient la tradition des mots croisés en France, et pourquoi des définitions pensées directement en français font toute la différence.',
  ],
  sections: [
    {
      id: 'accents-et-cedille',
      heading: 'Accents et cédille  la grille s’écrit sans',
      blocks: [
        {
          kind: 'p',
          text: 'Dans les mots croisés français, chaque case reçoit une majuscule sans signe  É, È, Ê et Ë deviennent E, À et Â deviennent A, Î et Ï deviennent I, Ô devient O, Ù, Û et Ü deviennent U, et Ç devient C. Nos grilles suivent la même convention. FORÊT s’écrit FORET, FRANÇAIS s’écrit FRANCAIS, et le E final de CAFÉ croise sans problème le E de n’importe quel autre mot.',
        },
        {
          kind: 'p',
          text: 'Pour le joueur, c’est une bonne nouvelle  on compte les lettres de base, sans se demander si l’accent prend une place. Sur ordinateur, vous pouvez taper é ou ç comme d’habitude, la case affiche E ou C. Sur téléphone, le clavier de la grille est un AZERTY sans touches accentuées, puisqu’il n’en a pas besoin.',
        },
        {
          kind: 'tip',
          text: 'Attention aux définitions qui semblent livrer la réponse  sans les accents, MÈRE et MER ne font plus qu’un. Une bonne grille évite donc de définir MER avec le mot « mère .',
        },
      ],
    },
    {
      id: 'oe-et-ae',
      heading: 'Le Œ dans une seule case, le Æ en deux',
      blocks: [
        {
          kind: 'p',
          text: 'Le français a deux lettres soudées, le œ et le æ. Ici, le **Œ** est traité comme une lettre à part entière  il occupe une seule case et il a sa propre touche sur le clavier de la grille, à côté du N. CŒUR tient donc en quatre cases (C, Œ, U, R), ŒUF en trois, SŒUR et NŒUD en quatre. Beaucoup de grilles sur papier décomposent la ligature en O et E  gardez en tête qu’ici, un mot en œ compte une case de moins.',
        },
        {
          kind: 'p',
          text: 'Le **Æ**, lui, ne se rencontre que dans quelques mots savants venus du latin, comme cæcum. Il s’écrit A et E, dans deux cases, et n’a pas de touche à lui.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Il bat dans la poitrine', answer: 'cœur' },
            { clue: 'Le poussin en sort', answer: 'œuf' },
            { clue: 'Fille des mêmes parents', answer: 'sœur' },
            { clue: 'On le fait à ses lacets', answer: 'nœud' },
            { clue: 'Saison des grandes vacances', answer: 'été' },
          ],
        },
      ],
    },
    {
      id: 'tradition-francaise',
      heading: 'Une tradition française des mots croisés',
      blocks: [
        {
          kind: 'p',
          text: 'Les premiers mots croisés sont parus en 1913 dans le New York World, sous la plume d’Arthur Wynne. La mode traverse l’Atlantique et gagne la presse française dans les années 1920. Depuis, la grille quotidienne fait partie du journal  Le Monde publie la sienne, comme bien d’autres titres nationaux et régionaux.',
        },
        {
          kind: 'p',
          text: 'La France a donné au jeu un vocabulaire et des auteurs. Celui qui compose une grille est un **verbicruciste**, celui qui la résout un **cruciverbiste**. Des verbicrucistes comme Michel Laclos ou Robert Scipion ont fait de la définition un art de l’esprit, tout en sous-entendus et en doubles sens, et l’écrivain Georges Perec, l’auteur de La Vie mode d’emploi, a composé des grilles pour l’hebdomadaire Le Point.',
        },
        {
          kind: 'list',
          items: [
            '**Les mots croisés** à la française  une grille carrée, des cases noires, et des définitions numérotées en chiffres romains dans un sens et en chiffres arabes dans l’autre, selon les journaux.',
            '**Les [mots fléchés](/guides/mots-fleches)**  les définitions dans la grille, des flèches vers les réponses. Ce sont eux qui remplissent les magazines de jeux.',
            '**Les cousins**  mots mêlés à entourer, mots casés à placer, mots codés à déchiffrer. Ce sont d’autres jeux, sans définitions à trouver.',
          ],
        },
      ],
    },
    {
      id: 'definitions-ecrites-en-francais',
      heading: 'Pourquoi des définitions écrites directement en français',
      blocks: [
        {
          kind: 'p',
          text: 'Une définition traduite se reconnaît tout de suite  elle sonne faux, elle pense en anglais, elle mène à un mot qui ne vient pas naturellement. Ici, les mots et les définitions de chaque grille sont écrits directement en français par l’intelligence artificielle, Gemini de Google, avec des consignes pensées pour la langue. Le code vérifie ensuite chaque mot lettre par lettre, mesure sa longueur en cases et écarte tout ce qui cloche, sans jamais le corriger à la main.',
        },
        {
          kind: 'list',
          items: [
            'Des mots du dictionnaire, en français standard, compréhensibles en France comme en Belgique, en Suisse, au Québec ou en Afrique francophone.',
            'Pas de sigles, d’abréviations ni de mots de deux lettres  vous ne verrez pas une énième note de musique pour boucher un coin.',
            'Une définition de la même nature que la réponse, accordée en genre et en nombre, qui ne contient ni la réponse ni un mot de sa famille.',
            'Des noms propres seulement dans les thèmes Géographie et [Culture francophone](/topics/local-culture), qui parle des régions, des plats, des chansons et des traditions du monde francophone.',
          ],
        },
        {
          kind: 'compare',
          weak: 'Patate de canapé',
          strong: 'Il ne quitte guère ses chaussons',
        },
        {
          kind: 'p',
          text: 'La première définition est un calque de l’anglais que personne ne dit en français  la seconde mène tout droit à PANTOUFLARD, un mot que seul un francophone aurait l’idée de chercher.',
        },
      ],
    },
    {
      id: 'commencer',
      heading: 'Commencer une grille de mots croisés en français',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Choisissez le format  [mots croisés](/crossword) avec leurs listes Horizontal et Vertical, ou [mots fléchés](/scanword) avec les définitions dans la grille.',
            'Choisissez un thème parmi les douze, la taille (petite, moyenne ou grande) et la difficulté (Facile, Moyen ou Difficile).',
            'Résolvez en ligne, sur téléphone ou sur ordinateur. Vos lettres sont enregistrées sur l’appareil.',
            'Partagez la grille par un lien, ou enregistrez-la en PDF pour l’imprimer avec ses réponses.',
          ],
        },
        {
          kind: 'p',
          text: 'Chaque appareil retient les mots qu’il a déjà montrés, si bien qu’une nouvelle grille ne répète jamais une réponse vue. Pour le détail de la création, lisez notre guide pour [créer des mots croisés](/guides/creer-des-mots-croises).',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Faut-il mettre les accents dans les mots croisés ',
      answer:
        'Non. Comme dans les grilles des journaux, on écrit en majuscules sans accents ni cédille  ÉTÉ devient ETE, GARÇON devient GARCON. Si vous tapez une lettre accentuée, la case affiche la lettre de base.',
    },
    {
      question: 'Combien de cases pour un mot avec Œ ',
      answer:
        'Le Œ occupe une seule case. CŒUR compte quatre cases, ŒUF trois. Sur téléphone, le Œ a sa propre touche sur le clavier de la grille.',
    },
    {
      question: 'Quelle différence entre un verbicruciste et un cruciverbiste ',
      answer:
        'Le verbicruciste compose les grilles et écrit les définitions  le cruciverbiste les résout. Ici, le verbicruciste est une intelligence artificielle encadrée par du code, et le cruciverbiste, c’est vous.',
    },
    {
      question: 'Les grilles conviennent-elles aux francophones hors de France ',
      answer:
        'Oui. Les mots sont choisis dans le français commun, compris dans toute la francophonie, et le thème Culture francophone ne se limite pas à la France.',
    },
    {
      question: 'Peut-on faire des mots croisés dans une autre langue ',
      answer:
        'Oui, dans trente-trois langues. Changez la langue du site depuis le menu des langues, en haut ou en bas de la page  les mots, les définitions et les menus passent tous dans cette langue.',
    },
    {
      question: 'Les mots croisés en français sont-ils gratuits ',
      answer:
        'Votre première grille de chaque mois est gratuite, sans compte. Ensuite, des packs de crédits s’achètent en une fois, sans abonnement  ouvrir une grille partagée est toujours gratuit. Tout est expliqué sur la [page des crédits](/credits).',
    },
  ],
  related: ['make', 'solve', 'scanword', 'teachers'],
}
