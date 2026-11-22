import type { Guide } from '../../types'

export const motsFleches: Guide = {
  key: 'scanword',
  slug: 'mots-fleches',
  title: 'Mots fléchés en ligne  comment ça marche et comment les résoudre',
  shortTitle: 'Les mots fléchés',
  metaTitle: 'Mots fléchés en ligne  règles et astuces',
  description:
    'Les mots fléchés en ligne  lire les flèches, comprendre les cases de définition, résoudre plus vite et voir ce qui les distingue des mots croisés classiques.',
  searchTerms: [
    'mots fléchés',
    'mots fléchés en ligne',
    'comment faire des mots fléchés',
    'mots fleches gratuit',
    'règles des mots fléchés',
    'mots fléchés sur téléphone',
    'mots croisés fléchés',
    'différence mots croisés mots fléchés',
    'mots fléchés faciles',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Les mots fléchés sont la grille préférée des Français en vacances, sur la table de la cuisine ou dans la salle d’attente. Le principe tient en une phrase  chaque définition est écrite dans une case de la grille, et une flèche indique où commence la réponse et dans quel sens elle s’écrit. Pas de liste à consulter, pas de numéros à chercher  on lit, on écrit, on enchaîne.',
    'Ce guide explique comment lire les flèches, comment s’y prendre pour résoudre des mots fléchés en ligne sans s’arrêter, et ce qui les sépare des mots croisés classiques. Vous verrez aussi pourquoi ce format est taillé pour le téléphone.',
  ],
  sections: [
    {
      id: 'definition',
      heading: 'Les mots fléchés, qu’est-ce que c’est ',
      blocks: [
        {
          kind: 'p',
          text: 'Les mots fléchés sont des mots croisés dont les définitions sont imprimées dans la grille elle-même. Le format vient de Scandinavie, d’où le nom de mots croisés suédois ou scandinaves qu’on lui donne parfois, et il est devenu un pilier des magazines de jeux en France. Les magazines classent d’ailleurs souvent leurs grilles par « force , de la plus douce à la plus corsée.',
        },
        {
          kind: 'p',
          text: 'Attention aux cousins qui portent un nom proche. Les **mots mêlés** sont des listes de mots cachés dans un tableau de lettres, à entourer. Les **mots casés** donnent la liste des réponses, qu’il faut placer dans la grille. Les mots fléchés, eux, demandent bien de trouver chaque mot à partir de sa définition, exactement comme les mots croisés.',
        },
      ],
    },
    {
      id: 'lire-les-fleches',
      heading: 'Comment lire les flèches',
      blocks: [
        {
          kind: 'p',
          text: 'Les cases teintées portent les définitions, les cases blanches attendent les lettres. Chaque définition a sa flèche, et c’est elle qui commande.',
        },
        {
          kind: 'list',
          items: [
            '**Flèche droite**  la réponse commence dans la case juste à droite et se lit vers la droite.',
            '**Flèche vers le bas**  la réponse commence juste en dessous et se lit de haut en bas.',
            '**Flèche coudée**  quand il n’y a pas de place juste avant la réponse, la définition se met au-dessus ou à côté de la première lettre, et la flèche se plie pour montrer le sens. Suivez le dernier trait de la flèche, c’est lui qui donne la direction.',
            '**Deux définitions dans une case**  celle du haut pointe en général vers la droite, celle du bas vers le bas.',
          ],
        },
        {
          kind: 'p',
          text: 'Les cases colorées qui ne portent ni lettre ni définition ne sont qu’un décor. Les lettres ne vont que dans les cases blanches.',
        },
        {
          kind: 'tip',
          text: 'Sur le site, touchez une case de définition ou n’importe quelle case de lettre  le mot s’allume et sa définition complète s’affiche dans la barre du haut, même si le texte de la case est minuscule.',
        },
      ],
    },
    {
      id: 'definitions-courtes',
      heading: 'Des définitions courtes, à deviner vite',
      blocks: [
        {
          kind: 'p',
          text: 'Une définition de mots fléchés doit tenir dans une case  trois mots au plus, souvent deux. Elle va donc droit au but, avec un synonyme, une image ou une fonction. C’est ce qui donne aux mots fléchés leur rythme rapide, et c’est aussi ce qui les rend parfois ambigus  avec si peu de mots, les croisements comptent encore plus.',
        },
        {
          kind: 'compare',
          weak: 'Lieu du désert avec de l’eau et des palmiers',
          strong: 'Havre du désert',
        },
        {
          kind: 'p',
          text: 'La première formule convient à une liste de mots croisés  la seconde est une vraie définition de mots fléchés, qui tient dans une case et laisse au joueur le plaisir de compléter l’image. Voici quelques exemples dans ce style ',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Havre du désert', answer: 'oasis' },
            { clue: 'Guide les navires', answer: 'phare' },
            { clue: 'Bloc de fer', answer: 'enclume' },
            { clue: 'Plat liquide', answer: 'soupe' },
            { clue: 'Creuse des galeries', answer: 'blaireau' },
          ],
        },
      ],
    },
    {
      id: 'comment-resoudre',
      heading: 'Comment faire des mots fléchés plus vite',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Balayez la grille et remplissez d’abord les définitions évidentes, où qu’elles soient. Dans les mots fléchés, elles sont souvent nombreuses sur la première ligne et la première colonne.',
            'Profitez de chaque lettre  elle appartient presque toujours à deux mots, un horizontal et un vertical.',
            'Quand une définition courte hésite entre plusieurs réponses, posez la plus probable au crayon dans votre tête, puis contrôlez-la avec un croisement avant de l’écrire.',
            'Ne cherchez pas d’accents  la grille s’écrit en majuscules sans accents ni cédille. Seul le Œ garde sa case.',
            'Bloqué  Vérifiez le mot, ou révélez une seule lettre pour relancer la machine.',
          ],
        },
      ],
    },
    {
      id: 'mots-croises-ou-mots-fleches',
      heading: 'Mots fléchés ou mots croisés  quelle différence ',
      blocks: [
        {
          kind: 'p',
          text: 'Les deux jeux demandent les mêmes connaissances et les mêmes réflexes. Ce qui change, c’est la manière de les lire.',
        },
        {
          kind: 'list',
          items: [
            'Dans les [mots croisés](/crossword), les définitions sont dans deux listes, Horizontal et Vertical, et renvoient à des numéros dans la grille. Elles peuvent être plus longues, plus littéraires, plus piégeuses.',
            'Dans les [mots fléchés](/scanword), la définition est collée à sa réponse. Elle est brève, le regard ne quitte jamais la grille, et l’on remplit plus vite.',
            'Les mots croisés se prêtent bien à l’impression et à la réflexion posée  les mots fléchés se jouent volontiers en quelques minutes volées.',
          ],
        },
        {
          kind: 'p',
          text: 'Pour la méthode côté mots croisés, lisez notre guide [comment résoudre des mots croisés](/guides/comment-resoudre-mots-croises).',
        },
      ],
    },
    {
      id: 'sur-telephone',
      heading: 'Pourquoi les mots fléchés sont faits pour le téléphone',
      blocks: [
        {
          kind: 'p',
          text: 'Sur un petit écran, chaque aller-retour entre une grille et une liste de définitions coûte du temps et de la patience. Les mots fléchés suppriment ce va-et-vient  la définition est là où l’on écrit. Le clavier AZERTY de la grille s’affiche en dessous, la définition complète reste dans la barre du haut, et l’on peut pincer pour zoomer.',
        },
        {
          kind: 'list',
          items: [
            'Trois tailles  petite (8×10), moyenne (10×13) et grande (13×17). La moyenne occupe bien un trajet en bus.',
            'Trois niveaux, Facile, Moyen et Difficile, et douze [thèmes](/topics), de la nature à la culture francophone.',
            'Vos lettres sont enregistrées sur l’appareil  vous pouvez fermer la grille et la finir plus tard.',
            'Installé comme une application, le site garde les grilles déjà ouvertes jouables hors ligne, dans le métro comme dans l’avion.',
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Les mots fléchés sont-ils plus faciles que les mots croisés ',
      answer:
        'Souvent, oui, parce que les définitions sont directes et toujours sous les yeux. Mais tout dépend du niveau  des mots fléchés en Difficile peuvent résister autant qu’une grille de mots croisés.',
    },
    {
      question: 'Pourquoi certaines flèches sont-elles pliées ',
      answer:
        'Quand la case juste avant la réponse est prise, ou qu’elle tomberait hors de la grille, la définition se place au-dessus ou à côté de la première lettre. La flèche se plie alors pour indiquer le sens de lecture.',
    },
    {
      question: 'Peut-on jouer aux mots fléchés gratuitement ',
      answer:
        'Votre première grille de chaque mois est gratuite, sans compte. Ensuite, des packs de crédits s’achètent en une fois, sans abonnement, et ouvrir une grille partagée par un ami est toujours gratuit. Voir la [page des crédits](/credits).',
    },
    {
      question: 'Peut-on imprimer des mots fléchés ',
      answer:
        'Oui, avec Enregistrer en PDF  en couleurs ou en noir et blanc, avec si vous voulez une page de réponses à part.',
    },
    {
      question: 'Les mots fléchés, c’est la même chose que les mots mêlés ',
      answer:
        'Non. Les mots mêlés sont des mots cachés dans un tableau de lettres, que l’on entoure. Les mots fléchés se résolvent avec des définitions, comme des mots croisés, mais celles-ci sont placées dans la grille.',
    },
  ],
  related: ['solve', 'make', 'language-fr'],
}
