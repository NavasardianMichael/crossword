import type { Guide } from '../../types'

export const commentResoudreMotsCroises: Guide = {
  key: 'solve',
  slug: 'comment-resoudre-mots-croises',
  title: 'Comment résoudre des mots croisés  méthode et astuces pour ne plus sécher',
  shortTitle: 'Résoudre des mots croisés',
  metaTitle: 'Comment résoudre des mots croisés  astuces et méthode',
  description:
    'Comment résoudre des mots croisés sans rester bloqué  par où commencer, lire les définitions, exploiter les croisements, et progresser de Facile à Difficile.',
  searchTerms: [
    'comment résoudre des mots croisés',
    'astuces mots croisés',
    'comment faire des mots croisés',
    'méthode mots croisés',
    'progresser aux mots croisés',
    'mots croisés débutant',
    'comment resoudre mots croises',
    'aide mots croisés',
    'mots croisés difficiles astuces',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Comment résoudre des mots croisés quand on bute dès la première définition  Bonne nouvelle  les cruciverbistes chevronnés ne connaissent pas plus de mots que vous. Ils ont une méthode. Ils savent par où attaquer une grille, comment lire une définition à double fond et comment laisser les croisements travailler pour eux.',
    'Voici cette méthode, étape par étape  l’ordre dans lequel remplir la grille, les familles de définitions à reconnaître, quoi faire quand on sèche, et comment passer en quelques semaines des grilles faciles aux grilles difficiles sans se décourager.',
  ],
  sections: [
    {
      id: 'par-ou-commencer',
      heading: 'Par où commencer une grille ',
      blocks: [
        {
          kind: 'p',
          text: 'Ne lisez pas les définitions dans l’ordre en espérant tout trouver du premier coup. Faites d’abord un tour rapide de la grille et notez seulement ce qui vous saute aux yeux. Trois ou quatre réponses sûres, bien réparties, valent mieux qu’une longue série de suppositions dans un coin.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Commencez par les définitions les plus directes, du genre « Capitale de l’Italie  ou « Fruit du pommier . Elles ne pardonnent pas l’hésitation  si vous savez, écrivez.',
            'Attaquez ensuite les mots courts. Un mot de trois ou quatre lettres a peu de candidats, et chacune de ses lettres en ouvre un autre.',
            'Repartez de chaque lettre posée. Une réponse horizontale vous donne la première lettre de plusieurs mots verticaux  relisez leurs définitions avec cet indice.',
            'Gardez les longs mots pour la fin. Avec trois ou quatre lettres déjà en place, ils se devinent souvent d’un coup.',
          ],
        },
        {
          kind: 'tip',
          text: 'Ici, la case touchée allume tout le mot et affiche sa définition dans la barre du haut. Touchez encore la même case pour passer de l’horizontal au vertical, sans chercher dans les listes.',
        },
      ],
    },
    {
      id: 'lire-une-definition',
      heading: 'Lire une définition comme un cruciverbiste',
      blocks: [
        {
          kind: 'p',
          text: 'Une définition de mots croisés obéit à une règle d’or  elle a la même nature que sa réponse. Si la définition est au féminin pluriel, la réponse l’est aussi. Si elle commence par un verbe à l’infinitif, cherchez un infinitif. Cette simple vérification élimine la moitié des fausses pistes.',
        },
        {
          kind: 'list',
          items: [
            '**La définition directe**  un synonyme ou une explication de dictionnaire. « Bloc de fer que frappe le forgeron  mène à ENCLUME.',
            '**La périphrase**  on décrit la chose sans la nommer. « Tour qui guide les navires la nuit  pour PHARE.',
            '**La culture générale**  un lieu, une œuvre, un personnage. Ces définitions apparaissent surtout dans les thèmes Géographie et Culture francophone.',
            '**Le sens figuré**  en Difficile, une définition peut jouer sur un second sens. Si le sens propre ne donne rien, demandez-vous ce que les mots veulent dire au figuré.',
          ],
        },
        {
          kind: 'compare',
          weak: 'Lire « Il bat  et chercher un boxeur',
          strong: 'Lire « Il bat dans la poitrine  jusqu’au bout et trouver CŒUR',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Il bat dans la poitrine', answer: 'cœur' },
            { clue: 'Lieu du désert avec de l’eau et des palmiers', answer: 'oasis' },
            { clue: 'Mammifère qui creuse de profondes galeries', answer: 'blaireau' },
            { clue: 'Bouillon que l’on mange à la cuillère', answer: 'soupe' },
            { clue: 'Qu’on ne peut exprimer par des mots', answer: 'ineffable' },
          ],
        },
      ],
    },
    {
      id: 'compter-les-cases',
      heading: 'Compter les cases  accents, cédille et œ',
      blocks: [
        {
          kind: 'p',
          text: 'Les grilles françaises s’écrivent en majuscules sans accents, et les nôtres aussi. FORÊT s’écrit FORET, GARÇON s’écrit GARCON, ÉTÉ s’écrit ETE. Quand vous comptez les lettres d’une réponse, comptez donc les lettres de base  l’accent ne prend pas de place et ne change rien au croisement. Un E de ÉTÉ peut très bien croiser le E de MER.',
        },
        {
          kind: 'p',
          text: 'Une exception à connaître  le **œ** occupe une seule case, et il a sa propre touche sur le clavier de la grille. CŒUR tient en quatre cases, SŒUR aussi, ŒUF en trois. Si un mot semble trop court d’une lettre, pensez-y.',
        },
      ],
    },
    {
      id: 'quand-on-seche',
      heading: 'Quand on sèche  les bons réflexes',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Changez de coin.** Un blocage se dénoue souvent par un croisement venu d’ailleurs.',
            '**Dites la définition à voix haute.** Entendre une phrase fait parfois surgir le mot qu’on cherchait des yeux.',
            '**Essayez les terminaisons.** En français, beaucoup de noms finissent en -TION, -MENT, -EUR ou -ETTE. Posez la fin probable et voyez si les croisements tiennent.',
            '**Faites une pause.** Revenir à une grille après dix minutes, c’est la voir avec des yeux neufs. Vos lettres sont enregistrées sur l’appareil, rien ne se perd.',
          ],
        },
        {
          kind: 'p',
          text: 'Et si rien ne vient, utilisez les outils sans culpabilité. **Vérifier** la lettre, le mot ou la grille barre ce qui est faux et verrouille ce qui est juste. **Révéler** une seule lettre suffit souvent à débloquer tout un coin, sans gâcher le reste. L’option « Vérifier en tapant , dans les réglages, signale une erreur dès que vous la posez  idéal pour apprendre, à désactiver quand vous voulez vous tester.',
        },
        {
          kind: 'tip',
          text: 'Révéler une lettre plutôt qu’un mot entier  c’est le petit coup de pouce qui laisse le plaisir de trouver le reste.',
        },
      ],
    },
    {
      id: 'progresser',
      heading: 'Progresser de Facile à Difficile',
      blocks: [
        {
          kind: 'p',
          text: 'On progresse aux mots croisés comme au tennis  en jouant souvent, à un niveau un peu au-dessus du sien. Commencez par de petites grilles faciles jusqu’à les finir sans aide, puis passez au niveau Moyen, puis aux grandes grilles. Le niveau Difficile vient en dernier  mots plus rares, définitions plus détournées.',
        },
        {
          kind: 'list',
          items: [
            'Une petite grille par jour vaut mieux qu’une grande par mois. Le vocabulaire des grilles revient vite quand on pratique régulièrement.',
            'Chronométrez-vous si vous aimez les défis  le minuteur tourne pendant la partie, et battre son propre temps motive.',
            'Variez les [thèmes](/topics). Une grille sur les [sciences](/topics/science) ou l’[histoire](/topics/history) fait travailler d’autres zones de votre mémoire.',
            'Essayez aussi les [mots fléchés](/guides/mots-fleches)  les définitions plus courtes entraînent à deviner vite.',
          ],
        },
        {
          kind: 'p',
          text: 'Comme chaque appareil retient les mots déjà vus, vous ne tomberez jamais deux fois sur la même réponse. Pas moyen de progresser en récitant des grilles par cœur  chaque partie est un vrai exercice.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Quelle est la meilleure astuce pour débuter aux mots croisés ',
      answer:
        'Commencer petit et facile. Une grille de 9×9 en niveau Facile se finit en un quart d’heure et apprend les bons réflexes  définitions évidentes d’abord, mots courts ensuite, longs mots en dernier. Vous pouvez en [lancer une ici](/crossword).',
    },
    {
      question: 'Est-ce tricher d’utiliser Vérifier ou Révéler ',
      answer:
        'Non, c’est apprendre. Vérifier montre où l’on s’est trompé, Révéler débloque un coin. Les lettres révélées portent un petit drapeau, pour que vous sachiez ce que vous avez trouvé seul.',
    },
    {
      question: 'Faut-il écrire les accents dans la grille ',
      answer:
        'Non. Comme dans les journaux, la grille s’écrit sans accents ni cédille  si vous tapez é, la case affiche E. Seul le œ a sa propre case. Les règles détaillées sont sur la page [Comment jouer](/rules).',
    },
    {
      question: 'Comment savoir si une réponse est au pluriel ',
      answer:
        'Regardez la définition  elle s’accorde avec la réponse. « Ils gardent les troupeaux  appelle un pluriel, « Elle garde le troupeau  un féminin singulier.',
    },
    {
      question: 'Combien de temps faut-il pour devenir bon aux mots croisés ',
      answer:
        'Il n’y a pas de règle, mais une grille par jour pendant quelques semaines change déjà beaucoup de choses. On mémorise les mots qui reviennent dans les définitions, et l’on apprend à reconnaître les tournures.',
    },
  ],
  related: ['make', 'scanword', 'language-fr'],
}
