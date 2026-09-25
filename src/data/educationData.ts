import { EducationMaterial } from '../types';

export const EDUCATION_MATERIALS: EducationMaterial[] = [
  {
    id: 'tdah-adultos-criancas',
    topic: 'TDAH',
    title: 'Guia Prático de Estratégias e Organização no TDAH',
    targetAudience: 'Adultos com TDAH, pais e educadores',
    summary: 'Estratégias não farmacológicas fundamentais para estruturação do ambiente, rotinas e manejo do foco na Atenção Primária.',
    practicalActions: [
      'Técnica Pomodoro Adaptada: Blocos curtos de 15 a 25 minutos de foco estrito seguidos de 5 minutos de pausa ativa.',
      'Organização Visual: Uso de quadros brancos, post-its em locais visíveis e agendas únicas para centralizar compromissos.',
      'Regra dos 2 Minutos: Se uma tarefa levar menos de 2 minutos para ser executada (ex: guardar um casaco, responder uma mensagem), faça-a imediatamente.',
      'Rotina Pré-Sono: Desligar telas 1 hora antes de deitar e definir horários fixos de despertar para estabilizar o ciclo circadiano.',
      'Diálogo com a Escola/Trabalho: Pactuar pausas para movimentação e assento nas primeiras carteiras da sala ou estação de trabalho silenciosa.'
    ],
    fullText: `O Transtorno do Déficit de Atenção com Hiperatividade (TDAH) envolve variações no funcionamento das funções executivas, como controle inibitório, memória de trabalho e planejamento.

Medidas Práticas Recomendadas na APS:
1. Estruturação do Ambiente: Reduzir distratores visuais e auditivos no espaço de estudo/trabalho.
2. Fragmentação de Tarefas: Dividir grandes obrigações em etapas pequenas e sequenciais (checklist).
3. Alarmes e Lembretes Externos: Utilizar cronômetros para marcar transições entre tarefas.
4. Exercício Físico Aeróbico: Prática regular reduz o estresse e favorece a liberação de dopamina e noradrenalina.
5. Aliança Terapêutica e Suporte Escolar/Familiar: Envolver a rede de apoio de forma não punitiva.`,
    printFriendly: `NEXUS CLÍNICO - GUIA DE ORIENTAÇÕES AO PACIENTE E FAMÍLIA: TDAH

O TDAH é uma condição neurobiológica que afeta a atenção, organização e controle do impulso.

AÇÕES PRÁTICAS PARA O DIA A DIA:
- Divida tarefas grandes em passos pequenos.
- Use agendas visuais e alarmes no celular.
- Mantenha um local limpo e sem distrações para estudar/trabalhar.
- Pratique atividades físicas regulares.
- Estabeleça horários fixos para dormir e acordar.`
  },
  {
    id: 'depressao-ativacao',
    topic: 'Depressão',
    title: 'Ativação Comportamental e Cuidados na Depressão',
    targetAudience: 'Pacientes com sintomas depressivos e familiares',
    summary: 'Instruções para quebrar o ciclo de isolamento e inatividade através de pequenos passos diários.',
    practicalActions: [
      'MicroMetas Diárias: Estabelecer 1 a 2 tarefas simples (ex: arrumar a cama, tomar um banho de sol por 10 minutos).',
      'Ativação Comportamental: Realizar atividades agradáveis mesmo sem sentir motivação inicial.',
      'Conexão Social Mínima: Manter contato com pelo menos uma pessoa de confiança por dia.',
      'Higiene da Luz Natural: Expor-se à luz do sol matinal para regulação biológica.'
    ],
    fullText: `Na depressão, é comum surgir a sensação de cansaço extremo e perda de prazer (anedonia). Esperar a motivação surgir para agir costuma prolongar a prostração. A Ativação Comportamental demonstra que a ação antecede a motivação.

Orientação Geral:
- Evite decisões drásticas de vida nos momentos de maior intensidade dos sintomas.
- Respeite seu ritmo, mas não se isole completamente.
- O tratamento medicamentoso, quando indicado pelo médico da APS, leva de 2 a 4 semanas para iniciar seus efeitos benéficos.`,
    printFriendly: `NEXUS CLÍNICO - GUIA DE SAÚDE MENTAL: MANEJO DA DEPRESSÃO

DICAS PARA O RECOMEÇO:
- Comece pequeno: celebre cada pequena tarefa concluída.
- Movimente o corpo: caminhadas curtas ajudam na liberação de neurotransmissores.
- Mantenha a medicação conforme orientação médica (não suspenda por conta própria).
- Procure sua Unidade Básica de Saúde em caso de dúvidas.`
  },
  {
    id: 'ansiedade-desaceleracao',
    topic: 'Ansiedade',
    title: 'Manejo de Crises de Ansiedade e Desaceleração Ansiogênica',
    targetAudience: 'Pacientes com sintomas de ansiedade e ataques de pânico',
    summary: 'Técnicas corporais e cognitivas de emergência para controle da hiperventilação e ansiedade aguda.',
    practicalActions: [
      'Respiração Diafragmática (4-7-8): Inspirar pelo nariz em 4s, segurar por 7s, expirar lentamente pela boca em 8s.',
      'Técnica do Aterramento 5-4-3-2-1: Identificar no ambiente 5 coisas que vê, 4 que toca, 3 que ouve, 2 que cheira e 1 que gosta no paladar.',
      'Descatastrofização: Perguntar-se: "Isso que temo é um fato ou apenas um pensamento?"'
    ],
    fullText: `A ansiedade é uma resposta natural de proteção do organismo. Durante uma crise, o corpo entra em estado de 'luta ou fuga', provocando taquicardia, falta de ar e tontura.

Recomendações Clínicas:
1. Lembrar-se de que a crise de ansiedade tem um pico de intensidade de 10 a 15 minutos e depois tende a ceder.
2. Não combater as sensações corporais; focar na respiração pausada.
3. Evitar o consumo excessivo de estimulantes (café, energéticos, refrigerantes de cola e álcool).`,
    printFriendly: `NEXUS CLÍNICO - ORIENTAÇÕES PARA CRISES DE ANSIEDADE

EM MOMENTOS DE CRISE:
1. Sente-se confortavelmente com os pés apoiados no chão.
2. Respire devagar, soltando o ar mais lentamente do que puxa.
3. Lembre-se: as sensações desconfortáveis vão passar e não são fatais.`
  },
  {
    id: 'sono-cronobiologia',
    topic: 'Sono',
    title: 'Higiene do Sono e Estabilização Circadiana',
    targetAudience: 'Pacientes com insônia primária ou secundária',
    summary: 'Regras de ouro de higiene do sono recomendadas na Atenção Primária para evitar dependência de sedativos.',
    practicalActions: [
      'Horário Fixo de Despertar: Acordar no mesmo horário diariamente, inclusive nos finais de semana.',
      'Ambiente Adequado: Quarto escuro, silencioso e com temperatura agradável.',
      'Regra dos 20 Minutos: Se não adormecer em 20 minutos na cama, levante-se e faça uma atividade calma à meia-luz.',
      'Restrição de Telas: Cessar uso de smartphones, tablets e TV pelo menos 60 minutos antes de deitar.'
    ],
    fullText: `A insônia é uma queixa frequente na APS e o uso contínuo de benzodiazepínicos deve ser evitado devido ao risco de dependência e quedas. A higiene do sono é a intervenção de primeira escolha.`,
    printFriendly: `NEXUS CLÍNICO - GUIA DE HIGIENE DO SONO

REGRAS PARA UM SONO REPARADOR:
- Use a cama apenas para dormir e namorar (não assista TV nem trabalhe na cama).
- Evite café, chá preto/verde e energéticos após as 14 horas.
- Faça refeições leves à noite.`
  },
  {
    id: 'psicofarmacos-seguranca',
    topic: 'Psicofármacos',
    title: 'Uso Seguro e Consciente de Psicofármacos na APS',
    targetAudience: 'Pacientes em início ou ajuste de medicação psicotrópica',
    summary: 'Orientações essenciais sobre tempo de latência dos antidepressivos, efeitos colaterais iniciais e descontinuação orientada.',
    practicalActions: [
      'Latência Terapêutica: Os antidepressivos levam de 2 a 4 semanas para demonstrar efeito benéfico pleno.',
      'Efeitos Iniciais Transitórios: Náuseas leves, dor de cabeça e alteração do sono podem ocorrer nos primeiros 7 a 10 dias e costumam desaparecer.',
      'Não Interromper Bruscamente: A suspensão repentina pode causar síndrome de descontinuação (tontura, irritabilidade, choque elétrico na cabeça).'
    ],
    fullText: `O uso de medicação psicotrópica na Atenção Primária visa restaurar o equilíbrio de neurotransmissores e permitir a recuperação funcional. O alinhamento das expectativas do paciente é fundamental para a adesão.`,
    printFriendly: `NEXUS CLÍNICO - INFORMAÇÕES SOBRE O USO DE SEU MEDICAMENTO

- Tome seu remédio exatamente nos horários recomendados pelo médico.
- Os benefícios não são imediatos: aguarde de 2 a 4 semanas.
- Se sentir desconforto nos primeiros dias, entre em contato com sua equipe de saúde.`
  }
];
