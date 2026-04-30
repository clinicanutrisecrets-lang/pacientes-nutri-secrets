// 12 exercícios curtos (TCC / ACT / DBT) em rotação semanal.
export const EXERCICIOS = [
  {
    id: 1,
    titulo: 'Defusão cognitiva',
    abordagem: 'ACT',
    descricao:
      'Identifica um pensamento sabotador que apareceu essa semana. Reescreve ele como uma observação, começando com "Estou tendo o pensamento que…".',
    placeholder: 'Estou tendo o pensamento que…'
  },
  {
    id: 2,
    titulo: 'Análise de cadeia',
    abordagem: 'DBT',
    descricao:
      'Pega um episódio recente. Mapeia: gatilho → pensamento → emoção → comportamento → consequência. Sem julgamento, só observação.',
    placeholder: 'Gatilho:\nPensamento:\nEmoção:\nComportamento:\nConsequência:'
  },
  {
    id: 3,
    titulo: 'Valores',
    abordagem: 'ACT',
    descricao:
      'Que tipo de pessoa você quer ser na sua relação com a comida? Não é sobre peso. É sobre como você quer se sentir, agir, viver.',
    placeholder: 'Quero ser alguém que…'
  },
  {
    id: 4,
    titulo: 'Reestruturação cognitiva',
    abordagem: 'TCC',
    descricao:
      'Identifica uma distorção cognitiva da semana: tudo-ou-nada, catastrofização, leitura mental, etc. Como ela apareceu? Qual seria uma versão mais calibrada?',
    placeholder: 'A distorção foi…\nUma versão mais calibrada seria…'
  },
  {
    id: 5,
    titulo: 'Mindfulness alimentar',
    abordagem: 'Mindfulness',
    descricao:
      'Faz uma refeição em silêncio, sem tela, observando texturas, sabores, temperatura. Depois, escreve uma observação curta sobre a experiência.',
    placeholder: 'O que percebi…'
  },
  {
    id: 6,
    titulo: 'Carta para o "eu impulsivo"',
    abordagem: 'Auto-compaixão',
    descricao:
      'Escreve uma carta para a parte de você que age no impulso. Sem repreender. Como se estivesse falando com alguém que você ama.',
    placeholder: 'Querido eu impulsivo,'
  },
  {
    id: 7,
    titulo: 'Mapa de vulnerabilidade',
    abordagem: 'Prevenção de recaída',
    descricao:
      'Lista 3 situações que vão aumentar seu risco essa semana. Para cada uma, um plano simples. Antecipar é proteger.',
    placeholder: '1) Situação:\nPlano:\n\n2) Situação:\nPlano:\n\n3) Situação:\nPlano:'
  },
  {
    id: 8,
    titulo: 'Prazeres não-alimentares',
    abordagem: 'Comportamental',
    descricao:
      'Lista 10 atividades que te dão prazer e não envolvem comida. Curtas e longas. Caras e gratuitas. Vale tudo.',
    placeholder: '1.\n2.\n3.\n4.\n5.\n6.\n7.\n8.\n9.\n10.'
  },
  {
    id: 9,
    titulo: 'Pausa preventiva',
    abordagem: 'Mindfulness',
    descricao:
      'Agenda 3 pausas no seu dia, mesmo sem impulso. Só pra observar como você tá. Anota aqui os horários e o que percebeu.',
    placeholder: 'Pausa 1 (horário):\nO que percebi:\n\nPausa 2:\n\nPausa 3:'
  },
  {
    id: 10,
    titulo: 'Reframe da recaída',
    abordagem: 'Prevenção de recaída',
    descricao:
      'Pega um episódio recente que você considerou "ruim". O que ele te ensinou? Recaída é dado, não fracasso.',
    placeholder: 'O que eu aprendi com isso…'
  },
  {
    id: 11,
    titulo: 'Compromisso público',
    abordagem: 'ACT',
    descricao:
      'Conta pra uma pessoa de confiança um compromisso da semana. Aqui, registra com quem você dividiu e qual foi o compromisso.',
    placeholder: 'Compartilhei com…\nO compromisso é…'
  },
  {
    id: 12,
    titulo: 'Gratidão corporal',
    abordagem: 'Auto-compaixão',
    descricao:
      'Escreve 3 coisas que seu corpo fez por você essa semana. Sem relação com aparência. Coisa funcional, sentida, vivida.',
    placeholder: '1.\n2.\n3.'
  }
];

// Determine current exercise based on weeks elapsed since first use.
export function exercicioDaSemana(weeksSinceStart = 0) {
  const idx = ((weeksSinceStart % EXERCICIOS.length) + EXERCICIOS.length) % EXERCICIOS.length;
  return EXERCICIOS[idx];
}
