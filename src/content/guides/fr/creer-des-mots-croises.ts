import type { Guide } from '../../types'

export const creerDesMotsCroises: Guide = {
  key: 'make',
  slug: 'creer-des-mots-croises',
  title: 'Créer des mots croisés en ligne  le guide pas à pas',
  shortTitle: 'Créer des mots croisés',
  metaTitle: 'Créer des mots croisés en ligne, pas à pas',
  description:
    'Créer des mots croisés en ligne en quelques minutes  choisissez le format, le thème et la difficulté, puis jouez, partagez un lien ou imprimez en PDF.',
  searchTerms: [
    'créer des mots croisés',
    'générateur de mots croisés',
    'faire des mots croisés en ligne',
    'créer une grille de mots croisés',
    'fabriquer des mots croisés',
    'créer mots fléchés',
    'generateur mots croises gratuit',
    'mots croisés personnalisés',
    'créer des mots croisés à imprimer',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Créer des mots croisés à la main, c’est un travail de patience. Il faut trouver des mots qui se croisent proprement, puis écrire pour chacun une définition juste, ni trop facile ni impossible. Les verbicrucistes y passent des heures. Un générateur de mots croisés se charge de l’assemblage, et vous gardez l’essentiel  décider de quoi parle la grille et pour qui elle est faite.',
    'Ce guide vous accompagne du premier choix jusqu’à la grille terminée, que l’on peut résoudre sur un téléphone, envoyer à un ami ou imprimer pour une classe. Vous y verrez aussi ce qui distingue une bonne définition d’une mauvaise, pour juger une grille avant de la faire circuler.',
  ],
  sections: [
    {
      id: 'choisir-le-format',
      heading: 'Étape 1  mots croisés ou mots fléchés ',
      blocks: [
        {
          kind: 'p',
          text: 'En français, on distingue deux grands formats. Les **mots croisés** ont des cases numérotées et deux listes de définitions à côté de la grille, Horizontal et Vertical. Les **mots fléchés** placent chaque définition dans la grille elle-même, avec une petite flèche qui indique où commence la réponse et dans quel sens elle court. Le vocabulaire et les réflexes sont les mêmes  seule la lecture change.',
        },
        {
          kind: 'list',
          items: [
            'Choisissez des [mots croisés](/crossword) pour imprimer, pour la classe, ou si vous aimez lire toutes les définitions avant de commencer.',
            'Choisissez des [mots fléchés](/scanword) pour une partie rapide sur téléphone  la définition est là où vous écrivez, sans aller-retour entre la grille et une liste.',
          ],
        },
        {
          kind: 'tip',
          text: 'Vous hésitez  Commencez par une petite grille de mots croisés. Elle se résout en dix à quinze minutes, la bonne durée pour un premier essai ou pour ouvrir un cours.',
        },
      ],
    },
    {
      id: 'choisir-le-theme',
      heading: 'Étape 2  choisir un thème',
      blocks: [
        {
          kind: 'p',
          text: 'Le thème donne son caractère à une grille. Quand toutes les réponses parlent d’animaux, de cuisine ou de sport, on sent que la grille a été pensée pour quelqu’un, et l’on prend plaisir à deviner le fil conducteur. Un mélange de thèmes convient mieux à l’entraînement quotidien, quand on cherche la variété plutôt qu’un sujet.',
        },
        {
          kind: 'p',
          text: 'Vous avez douze [thèmes](/topics) au choix, parmi lesquels les animaux, la cuisine, la géographie, les sciences et la [culture francophone](/topics/local-culture)  chansons, régions, plats, écrivains et traditions du monde qui parle français.',
        },
      ],
    },
    {
      id: 'taille-et-difficulte',
      heading: 'Étape 3  régler la taille et la difficulté',
      blocks: [
        {
          kind: 'p',
          text: 'La taille décide de la durée de la partie, la difficulté décide de la dureté de chaque définition. Les deux réglages sont indépendants exprès  une petite grille difficile est un casse-tête express, une grande grille facile est une demi-heure tranquille avec un café.',
        },
        {
          kind: 'list',
          items: [
            '**Petite**  une grille de 9×9 avec environ 8 à 14 mots. Idéale pour les enfants, les débutants et une pause de cinq minutes.',
            '**Moyenne**  13×13 et 16 à 24 mots. Le format de tous les jours pour la plupart des joueurs.',
            '**Grande**  15×15 et jusqu’à 34 mots, de quoi occuper un dimanche après-midi.',
          ],
        },
        {
          kind: 'p',
          text: 'En **Facile**, les mots sont courants et les définitions directes. En **Difficile**, les mots sont plus rares et les définitions jouent sur le savoir, le sens figuré et les acceptions moins évidentes. **Moyen** se situe entre les deux et convient à la plupart des adultes.',
        },
        {
          kind: 'p',
          text: 'Un mot sur la forme de la grille  les mots croisés du journal sont des carrés pleins où presque chaque case blanche appartient à deux mots, séparés par quelques cases noires. Ici, la grille est libre  les mots se croisent là où ils partagent une lettre, et le reste du carré reste vide. On y gagne des définitions toujours franches, sans les mots de deux lettres ni les abréviations qu’il faut caser pour boucher un coin.',
        },
      ],
    },
    {
      id: 'ce-que-fait-l-ia',
      heading: 'Étape 4  l’intelligence artificielle écrit les mots et les définitions',
      blocks: [
        {
          kind: 'p',
          text: 'Quand vous appuyez sur Créer ma grille, les mots et les définitions sont écrits directement en français par un modèle d’intelligence artificielle, Gemini de Google, pour le thème et le niveau choisis. Rien n’est traduit de l’anglais. Ensuite, c’est le code, et non le modèle, qui construit la grille, vérifie chaque mot lettre par lettre et case par case, et écarte tout ce qui ne convient pas. Une définition qui contient sa propre réponse, ou un mot mal orthographié, est supprimé, jamais rafistolé.',
        },
        {
          kind: 'p',
          text: 'Votre appareil retient aussi les mots qu’il vous a déjà montrés  une nouvelle grille ne vous redonne jamais une réponse déjà vue. C’est plus important qu’il n’y paraît. Au bout de quelques grilles, ce sont les mots qui reviennent qui donnent l’impression de tourner en rond.',
        },
      ],
    },
    {
      id: 'bonne-definition',
      heading: 'Étape 5  reconnaître une bonne définition',
      blocks: [
        {
          kind: 'p',
          text: 'Que vous utilisiez un générateur ou que vous écriviez vos grilles au crayon, il est utile de savoir à quoi ressemble une bonne définition. Elle mène à une seule réponse juste, emploie des mots que le joueur connaît, et ne contient ni la réponse ni un mot de la même famille.',
        },
        {
          kind: 'compare',
          weak: 'Animal de la ferme (6 lettres)',
          strong: 'Elle pond, glousse et picore dans la cour (5 lettres)',
        },
        {
          kind: 'p',
          text: 'La première définition laisse le choix entre le mouton, le cochon et bien d’autres  la seconde ne mène qu’à la poule. Le nombre de lettres aide, mais il doit confirmer une réponse, pas être le seul moyen de la trouver.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Tour qui guide les navires la nuit', answer: 'phare' },
            { clue: 'Bloc de fer que frappe le forgeron', answer: 'enclume' },
            { clue: 'Fruit croquant du verger', answer: 'pomme' },
            { clue: 'Moment où la Lune cache le Soleil', answer: 'éclipse' },
            { clue: 'Il bat dans la poitrine', answer: 'cœur' },
          ],
        },
        {
          kind: 'tip',
          text: 'Une définition vous paraît fausse ou injuste  Signalez-la depuis le menu de la grille. Les définitions signalées sont relues et retirées, pour que le joueur suivant ne tombe pas dessus.',
        },
      ],
    },
    {
      id: 'jouer-partager-imprimer',
      heading: 'Étape 6  jouer, partager ou imprimer',
      blocks: [
        {
          kind: 'p',
          text: 'Votre grille s’ouvre tout de suite dans le navigateur, sur téléphone comme sur ordinateur. Sur un écran tactile, un clavier AZERTY s’affiche sous la grille pour qu’elle reste visible. Vous pouvez vérifier une lettre, un mot ou toute la grille, révéler une réponse quand vous séchez, puis revenir plus tard  vos lettres restent enregistrées sur l’appareil.',
        },
        {
          kind: 'list',
          items: [
            '**Partager un lien**  votre ami reçoit exactement la même grille et les mêmes définitions, gratuitement et sans inscription.',
            '**Enregistrer en PDF**  en couleurs ou en noir et blanc, avec ou sans une page de réponses à part. Pratique pour une classe, une fête ou un long trajet sans réseau.',
            '**Jouer hors ligne**  installez le site comme une application, et les grilles déjà ouvertes continuent de fonctionner sans connexion.',
          ],
        },
      ],
    },
    {
      id: 'idees',
      heading: 'Des idées pour la classe, une fête ou un cadeau',
      blocks: [
        {
          kind: 'list',
          items: [
            '**En classe**  une petite grille sur le thème de la semaine pour commencer le cours dans le calme. Imprimez-en une par binôme et laissez-les débattre des réponses.',
            '**À un anniversaire ou un repas de famille**  envoyez le lien dans le groupe de discussion et voyez qui finit le premier.',
            '**Pour apprendre une langue**  passez le site dans la langue étudiée. Les mots et les définitions y sont écrits directement, et la grille devient une révision de vocabulaire.',
            '**Dans le train ou le métro**  des mots fléchés de taille moyenne occupent un trajet de vingt minutes, sans papier ni crayon.',
          ],
        },
        {
          kind: 'p',
          text: 'Pour utiliser les grilles avec des élèves, lisez notre guide des [mots croisés pour enfants et pour la classe](/guides/mots-croises-pour-enfants). Et si vous êtes de l’autre côté de la grille, nos [astuces pour résoudre des mots croisés](/guides/comment-resoudre-mots-croises) vous aideront à vous débloquer.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Le générateur de mots croisés est-il gratuit ',
      answer:
        'Votre première grille de chaque mois est gratuite, sans compte et sans inscription. Ensuite, vous pouvez acheter des crédits en une fois, sans abonnement. Ouvrir une grille qu’on vous a partagée est toujours gratuit. Tous les détails sont sur la [page des crédits](/credits).',
    },
    {
      question: 'Puis-je entrer mes propres mots et mes propres définitions ',
      answer:
        'Pas pour le moment. Les mots et les définitions sont écrits pour le thème et la difficulté choisis, puis vérifiés par le code. Vous choisissez le format, le thème, la taille et la difficulté.',
    },
    {
      question: 'Peut-on imprimer les mots croisés ',
      answer:
        'Oui. Ouvrez la grille, choisissez Enregistrer en PDF, puis la version en couleurs ou en noir et blanc. Vous pouvez ajouter une page séparée avec les réponses.',
    },
    {
      question: 'Comment s’écrivent les accents dans la grille ',
      answer:
        'Comme dans les grilles imprimées  sans accent ni cédille. Été s’écrit ETE et français FRANCAIS. Seul le œ garde sa case à lui, avec sa touche sur le clavier. Notre guide des [mots croisés en français](/guides/mots-croises-en-francais) explique tout cela en détail.',
    },
    {
      question: 'Dans quelles langues peut-on créer des mots croisés ',
      answer:
        'Dans trente-trois langues, du français, de l’anglais et de l’espagnol à l’arménien, au japonais et au swahili. Chaque langue a ses propres mots et définitions, écrits directement et non traduits, et les menus du site changent avec elle.',
    },
    {
      question: 'Les mêmes mots vont-ils revenir ',
      answer: 'Non. Chaque appareil retient les mots qu’il a montrés, et chaque nouvelle grille les laisse de côté.',
    },
  ],
  related: ['solve', 'scanword', 'teachers', 'language-fr'],
}
