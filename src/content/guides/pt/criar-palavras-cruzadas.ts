import type { Guide } from '../../types'

export const criarPalavrasCruzadas: Guide = {
  key: 'make',
  slug: 'criar-palavras-cruzadas',
  title: 'Como criar palavras cruzadas online: passo a passo com um gerador',
  shortTitle: 'Como criar palavras cruzadas',
  metaTitle: 'Criar palavras cruzadas online: passo a passo',
  description:
    'Crie palavras cruzadas online em poucos minutos: escolha formato, tema e dificuldade, jogue no celular, compartilhe um link ou imprima em PDF com as respostas.',
  searchTerms: [
    'criar palavras cruzadas',
    'fazer palavras cruzadas online',
    'gerador de palavras cruzadas',
    'como fazer palavras cruzadas',
    'criar cruzadinha',
    'fazer cruzadinha online',
    'criar palavras cruzadas grátis',
    'palavras cruzadas personalizadas',
    'gerador de cruzadinhas para imprimir',
    'palavras cruzadas online gratis',
  ],
  published: '2026-11-23',
  updated: '2026-11-23',
  intro: [
    'Criar palavras cruzadas à mão dá muito mais trabalho do que parece. Encaixar palavras que se cruzem direitinho já é um passatempo por si só, e escrever para cada uma delas uma dica justa, nem óbvia demais nem impossível, é um segundo passatempo em cima do primeiro. Um gerador de palavras cruzadas cuida da parte mecânica, e o seu tempo vai para o que importa: sobre o que é a grade e para quem ela é.',
    'Neste guia você vê, passo a passo, como fazer palavras cruzadas online no Palavras Cruzadas IA: da primeira escolha até uma grade pronta para jogar no celular, mandar para um amigo ou imprimir para a turma. E, de quebra, o que separa uma boa cruzadinha de uma fraca, coisa útil até para quem continua montando as suas no papel quadriculado.',
  ],
  sections: [
    {
      id: 'formato',
      heading: 'Passo 1: palavras cruzadas clássicas ou autodefinido',
      blocks: [
        {
          kind: 'p',
          text: 'Primeiro, escolha o tipo de passatempo. Nas **palavras cruzadas clássicas**, as casas são numeradas e as dicas ficam fora da grade, em duas listas: horizontal e vertical. No **autodefinido**, que no Brasil muita gente conhece como palavras cruzadas diretas, cada dica fica dentro da própria grade, com uma seta apontando para a resposta. As palavras e as habilidades são as mesmas; muda só o jeito de ler.',
        },
        {
          kind: 'list',
          items: [
            'Escolha as [palavras cruzadas clássicas](/crossword) para imprimir, para usar em sala de aula ou se você gosta de ler todas as dicas antes de começar.',
            'Escolha o [autodefinido](/scanword) para uma partida rápida no celular: a dica fica bem ao lado de onde você digita, sem pular entre a grade e uma lista.',
          ],
        },
        {
          kind: 'tip',
          text: 'Na dúvida, comece com uma grade clássica pequena e fácil. Ela se resolve em uns dez minutos: perfeita para um primeiro teste ou para aquecer a turma no começo da aula.',
        },
      ],
    },
    {
      id: 'tema',
      heading: 'Passo 2: escolha o tema',
      blocks: [
        {
          kind: 'p',
          text: 'O tema dá personalidade às palavras cruzadas. Quando todas as respostas são bichos, pratos ou coisas de esporte, a grade parece feita sob medida, e adivinhar fica mais gostoso porque o próprio tema aponta o caminho. Os temas misturados são ótimos para praticar sem compromisso, quando o que você quer é variedade.',
        },
        {
          kind: 'p',
          text: 'São doze [temas](/topics) à escolha, entre eles animais, [comida e bebida](/topics/food), geografia, ciência, história e [cultura brasileira](/topics/local-culture), que gira em torno das tradições, dos lugares, das pessoas e da comida do Brasil.',
        },
      ],
    },
    {
      id: 'tamanho-e-dificuldade',
      heading: 'Passo 3: tamanho e dificuldade',
      blocks: [
        {
          kind: 'p',
          text: 'O tamanho define quanto tempo a grade vai durar; a dificuldade, o quanto cada dica é complicada. Eles são separados de propósito: uma grade pequena e difícil é um desafio rápido, enquanto uma grande e fácil é meia hora tranquila com um cafezinho.',
        },
        {
          kind: 'list',
          items: [
            '**Pequeno**: grade de 9×9 com umas 8 a 14 palavras. Ideal para crianças, iniciantes e uma pausa de cinco minutos.',
            '**Médio**: 13×13 com 16 a 24 palavras. O tamanho do dia a dia para a maioria das pessoas.',
            '**Grande**: 15×15 com até 34 palavras, como as palavras cruzadas do jornal de domingo.',
          ],
        },
        {
          kind: 'p',
          text: 'As dicas **fáceis** usam palavras comuns e vão direto ao ponto. As **difíceis** apelam para palavras menos frequentes, conhecimentos gerais e sentidos menos óbvios. O nível **médio** fica no meio do caminho e agrada à maioria dos adultos. No autodefinido, os tamanhos são 8×10, 10×13 e 13×17.',
        },
      ],
    },
    {
      id: 'o-que-a-ia-faz',
      heading: 'Passo 4: a IA escreve as palavras e as dicas',
      blocks: [
        {
          kind: 'p',
          text: 'Quando você clica em criar, um modelo de IA escreve as palavras e as dicas diretamente em português, sobre o tema escolhido: nada é traduzido do inglês. Depois é o código, e não o modelo, que monta a grade, confere cada palavra com o alfabeto e o seu tamanho em casas, e descarta tudo o que não encaixa. Uma dica que entrega a própria resposta ou uma palavra com erro de digitação é eliminada, não remendada.',
        },
        {
          kind: 'p',
          text: 'Além disso, cada aparelho lembra as palavras que já mostrou, então uma grade nova nunca repete uma resposta que você já viu. Parece detalhe, mas depois de algumas partidas as palavras repetidas são a primeira coisa que deixa um passatempo sem graça.',
        },
      ],
    },
    {
      id: 'boas-dicas',
      heading: 'Passo 5: o que faz uma boa dica',
      blocks: [
        {
          kind: 'p',
          text: 'Seja com um gerador, seja à mão, vale saber reconhecer uma boa dica. Ela tem uma única resposta razoável, usa palavras que quem joga conhece e não contém a resposta nem uma palavra da mesma família.',
        },
        {
          kind: 'compare',
          weak: 'Animal grande (8 letras)',
          strong: 'Gigante cinzento com tromba (8 letras)',
        },
        {
          kind: 'p',
          text: 'A primeira dica serve para dezenas de bichos; a segunda aponta para um só. O número de letras ajuda, mas deve confirmar a resposta, não ser o único jeito de achá-la.',
        },
        {
          kind: 'clues',
          items: [
            { clue: 'Gigante cinzento com tromba', answer: 'elefante' },
            { clue: 'Bebida preta servida no cafezinho', answer: 'café' },
            { clue: 'Capital do Peru', answer: 'lima' },
            { clue: 'Sua agulha sempre aponta para o norte', answer: 'bússola' },
            { clue: 'Prato de feijão-preto com carnes de porco', answer: 'feijoada' },
          ],
        },
        {
          kind: 'tip',
          text: 'Se uma dica parecer errada ou injusta, use «Informar uma dica» no menu da grade. As dicas informadas são revisadas e aposentadas, para que a próxima pessoa não esbarre nelas.',
        },
      ],
    },
    {
      id: 'jogar-compartilhar-imprimir',
      heading: 'Passo 6: jogue, compartilhe ou imprima',
      blocks: [
        {
          kind: 'p',
          text: 'Suas palavras cruzadas abrem na hora, no navegador do celular ou do computador. Numa tela de toque aparece um teclado próprio, para a grade não ficar escondida. Você pode conferir uma letra, uma palavra ou a grade inteira, revelar uma resposta quando empacar e parar no meio para continuar depois: suas letras ficam salvas no aparelho.',
        },
        {
          kind: 'list',
          items: [
            '**Compartilhar um link**: seu amigo recebe exatamente a mesma grade e as mesmas dicas, de graça e sem cadastro.',
            '**Salvar como PDF**: na aparência padrão, colorida ou em preto e branco, com ou sem uma página à parte com as respostas. Prático para a escola, um almoço de família ou uma viagem sem sinal.',
            '**Jogar offline**: instale o site como aplicativo, e as grades que você já abriu continuam funcionando sem internet.',
          ],
        },
      ],
    },
    {
      id: 'ideias',
      heading: 'Ideias: palavras cruzadas para a escola, festas ou de presente',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Na sala de aula**: uma grade pequena sobre o assunto da semana é um começo de aula tranquilo. Imprima uma cópia por dupla e deixe a turma discutir as respostas.',
            '**Numa festa ou num almoço de família**: mande o link no grupo do WhatsApp e veja quem termina primeiro.',
            '**Para quem aprende outro idioma**: troque o idioma do site. As palavras e as dicas são escritas de forma nativa naquele idioma, então a grade vira também treino de vocabulário.',
            '**No ônibus ou no metrô**: um autodefinido médio dura uma viagem de vinte minutos e não precisa de papel nem caneta.',
          ],
        },
        {
          kind: 'p',
          text: 'Para usar palavras cruzadas com alunos, veja o guia de [palavras cruzadas para crianças e para a sala de aula](/guides/palavras-cruzadas-para-criancas). E, se você está do outro lado da grade, o guia [como resolver palavras cruzadas](/guides/como-resolver-palavras-cruzadas) traz dicas para desempacar.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'O gerador de palavras cruzadas é grátis?',
      answer:
        'Sua primeira grade de cada mês é grátis, sem conta e sem cadastro. Depois, você pode comprar pacotes de créditos com pagamento único, sem assinatura. Abrir uma grade que alguém compartilhou com você é sempre grátis. Os detalhes estão na [página de créditos](/credits).',
    },
    {
      question: 'Posso colocar as minhas próprias palavras e dicas?',
      answer:
        'Por enquanto, não. As palavras e as dicas são escritas para o tema e a dificuldade que você escolhe e depois conferidas pelo código. O que você decide é o formato, o tema, o tamanho e a dificuldade.',
    },
    {
      question: 'Como imprimir as palavras cruzadas com as respostas?',
      answer:
        'Abra a grade, escolha «Salvar como PDF» e marque «Incluir as respostas»: a grade resolvida sai numa página à parte. Dá para escolher a aparência padrão, colorida ou em preto e branco.',
    },
    {
      question: 'Em quais idiomas posso criar palavras cruzadas?',
      answer:
        'Em trinta e três, do português, do espanhol e do inglês ao armênio, ao japonês e ao suaíli. Cada idioma tem as suas próprias palavras e dicas, escritas de forma nativa e não traduzidas, e os menus do site mudam junto.',
    },
    {
      question: 'As palavras se repetem de uma grade para outra?',
      answer: 'Não. Cada aparelho lembra as palavras que já mostrou, e toda grade nova as deixa de fora.',
    },
  ],
  related: ['solve', 'scanword', 'teachers'],
}
