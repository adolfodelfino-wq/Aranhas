import { EvidenceReference } from '../types';

export const EVIDENCE_REFERENCES: EvidenceReference[] = [
  // 1. HCL-32 / Transtorno Bipolar
  {
    id: 'hcl32-soares-moreno',
    topic: 'Transtorno Bipolar e Rastreio de Hipomania',
    title: 'Validation and reliability of the Portuguese version of the Hypomania Checklist-32 (HCL-32) for the detection of bipolar disorder',
    source: 'Soares OT, Moreno RA, Moura EC, Angst J. Revista Brasileira de Psiquiatria / FMUSP',
    year: '2010',
    summary: 'Validação psicométrica da versão brasileira do HCL-32 (HCL-32 VB). Instrumento padrão de autorrelato para diferenciar Transtorno Bipolar (especialmente Tipo II) de Transtorno Depressivo Maior.',
    keyPoints: [
      'Ponto de corte no Brasil: escore ≥ 18 pontos apresentou melhor equilíbrio discriminativo (Sensibilidade: 75%, Especificidade: 58%, Alfa de Cronbach: 0.86).',
      'Estrutura bifatorial validada: Fator 1 (Ativação/Elação com 19 itens) e Fator 2 (Comportamento de Risco/Irritabilidade com 13 itens).',
      'Crucial para evitar uso inadvertido de antidepressivos em monoterapia em pacientes com depressão bipolar oculta.',
      'Referência primária internacional: Angst J et al. (Journal of Affective Disorders, 2005).'
    ]
  },
  // 2. PHQ-9 / Depressão
  {
    id: 'phq9-kroenke-osorio',
    topic: 'Transtorno Depressivo Maior na APS',
    title: 'The PHQ-9: Validity of a Brief Depression Severity Measure & Validação Brasileira na Atenção Primária',
    source: 'Kroenke K, Spitzer RL, Williams JB (2001) / de Lima Osório F et al. (2009) / Santos IS et al. (2013)',
    year: '2001-2013',
    summary: 'Instrumento padrão-ouro mundial e do SUS para triagem e monitoramento da gravidade de sintomas depressivos alinhado aos critérios do DSM-IV e DSM-5.',
    keyPoints: [
      'Ponto de corte padrão: escore ≥ 10 com sensibilidade de 88% e especificidade de 88% para episódio depressivo maior.',
      'Item 9 avalia ideação suicida e necessita de desdobramento imediato com protocolo de segurança (C-SSRS).',
      'Excelente sensibilidade à mudança terapêutica para avaliar resposta ao tratamento após 4 a 6 semanas.'
    ]
  },
  // 3. GAD-7 / Ansiedade
  {
    id: 'gad7-spitzer-moreno',
    topic: 'Transtorno de Ansiedade Generalizada (TAG)',
    title: 'A Brief Measure for Assessing Generalized Anxiety Disorder: The GAD-7 & Validação Brasileira',
    source: 'Spitzer RL, Kroenke K, Williams JB, Löwe B (2006) / Moreno AL et al. (2016)',
    year: '2006-2016',
    summary: 'Escala breve e autoadministrada para triagem e mensuração da severidade do TAG e transtornos ansiosos na Atenção Primária.',
    keyPoints: [
      'Ponto de corte: escore ≥ 10 pontos (Sensibilidade 89%, Especificidade 82%).',
      'Estratificação: 0-4 (mínima), 5-9 (leve), 10-14 (moderada), 15-21 (grave).',
      'Permite diferenciar queixas ansiosas subclínicas de transtornos ansiosos com impacto funcional que demandam intervenção.'
    ]
  },
  // 4. AUDIT / Álcool
  {
    id: 'audit-oms-mendez',
    topic: 'Uso de Substâncias e Álcool na APS',
    title: 'The Alcohol Use Disorders Identification Test (AUDIT): Guidelines for Use in Primary Care & Validação Brasileira',
    source: 'Organização Mundial da Saúde (OMS / Babor TF et al., 2001) / Mendez EB (1999) / Moretti-Pires & Corradi-Webster (2011)',
    year: '2001-2011',
    summary: 'Instrumento desenvolvido pela OMS especificamente para profissionais da atenção primária identificarem consumo de risco, uso nocivo e dependência de álcool precocemente.',
    keyPoints: [
      'Escore total de 0 a 40 pontos, subdividido em Consumo (itens 1-3), Dependência (itens 4-6) e Danos (itens 7-10).',
      'Ponto de corte ≥ 8 pontos indica Uso de Risco, demandando Intervenção Breve (IB) imediata na própria UBS.',
      'Escore ≥ 20 indica Provável Síndrome de Dependência, exigindo avaliação médica para Síndrome de Abstinência Alcoólica e articulação com CAPS AD.'
    ]
  },
  // 5. ASRS-18 / TDAH Adulto
  {
    id: 'asrs18-kessler-mattos',
    topic: 'TDAH em Adultos',
    title: 'Adult ADHD Self-Report Scale (ASRS-v1.1) da OMS & Adaptação Transcultural para o Português',
    source: 'Kessler RC et al. (Psychological Medicine, 2005) / Mattos P, Segenreich D et al. (Rev Psiquiatr Clín, 2006)',
    year: '2005-2006',
    summary: 'Escala oficial desenvolvida pelo grupo de trabalho da OMS em colaboração com a Harvard Medical School para rastreio de TDAH em adultos.',
    keyPoints: [
      '18 itens divididos em Desatenção (Parte A/1-9) e Hiperatividade/Impulsividade (Parte B/10-18).',
      'Corte de rastreio positivo: presença de 4 ou mais itens com pontuação positiva em cada domínio.',
      'Auxilia na investigação de histórico de prejuízos executivos desde a infância.'
    ]
  },
  // 6. SNAP-IV / TDAH Infantil
  {
    id: 'snap4-swanson-mattos',
    topic: 'Saúde Mental da Criança e Adolescente',
    title: 'Swanson, Nolan, and Pelham Rating Scale (SNAP-IV) & Validação Brasileira',
    source: 'Swanson JM et al. (2001) / Mattos P, Serra-Pinheiro MA, Rohde LA, Pinto D (Rev Psiquiatr Rio Gd Sul, 2006)',
    year: '2001-2006',
    summary: 'Escala de 18 itens correspondentes aos critérios diagnósticos do DSM-IV/DSM-5 para TDAH aplicada a pais e educadores.',
    keyPoints: [
      'Corte positivo: presença de 6 ou mais itens pontuados como "Bastante" ou "Demais" por domínio.',
      'Recomenda-se preenchimento pareado por pais e professores para comprovação de sintomas em múltiplos ambientes.'
    ]
  },
  // 7. Y-BOCS / TOC
  {
    id: 'ybocs-goodman-cordioli',
    topic: 'Transtorno Obsessivo-Compulsivo (TOC)',
    title: 'The Yale-Brown Obsessive Compulsive Scale (Y-BOCS) & Validação Brasileira',
    source: 'Goodman WK et al. (Arch Gen Psychiatry, 1989) / Cordioli AV et al. (Revista ABP-APAL, 1998)',
    year: '1989-1998',
    summary: 'Padrão-ouro para quantificar a severidade das obsessões (tempo, interferência, angústia, resistência e controle) e rituais compulsivos.',
    keyPoints: [
      'Escore total de 0 a 40 pontos (0-7 subclínico, 8-15 leve, 16-23 moderado, 24-31 grave, 32-40 extremo).',
      'Orienta indicação de doses elevadas de ISRS e Terapia Cognitivo-Comportamental com Exposição e Prevenção de Resposta (EPR).'
    ]
  },
  // 8. C-SSRS / Suicídio
  {
    id: 'cssrs-posner',
    topic: 'Prevenção do Suicídio e Manejo de Crise',
    title: 'The Columbia-Suicide Severity Rating Scale (C-SSRS): Initial Validity and Internal Consistency Findings',
    source: 'Posner K, Brown GK, Stanley B et al. (Am J Psychiatry, 2011) / Associação Brasileira de Psiquiatria (ABP)',
    year: '2011',
    summary: 'Instrumento padronizado de triagem de ideação e comportamento suicida que gradua o risco de ideação passiva até planos com intenção imediata.',
    keyPoints: [
      'Classifica o risco em Baixo, Moderado e Alto/Emergência para guiar a conduta imediata na UBS.',
      'Enfatiza a criação do Plano de Segurança Pessoal, remoção de meios letais e envolvimento de suporte familiar com consentimento.'
    ]
  },
  // 9. MEEM / Cognição
  {
    id: 'meem-folstein-brucki',
    topic: 'Saúde Mental do Idoso e Rastreio Cognitivo na APS',
    title: 'Sugestões para o uso do Mini-Exame do Estado Mental no Brasil (Brucki SMD et al., 2003) e Diretrizes TelessaúdeRS',
    source: 'Folstein MF (1975) / Brucki SMD, Nitrini R, Caramelli P, Bertolucci PH, Okamoto IH (Arq Neuropsiquiatr, 2003) / TelessaúdeRS-UFRGS',
    year: '1975-2003',
    summary: 'Estudo seminal de padronização e normatização do MEEM para a população brasileira, estabelecendo pontos de corte estratificados por 5 faixas de escolaridade para aumentar a sensibilidade e especificidade do rastreio cognitivo na Atenção Primária.',
    keyPoints: [
      'Pontos de corte recomendados no Brasil (Brucki et al., 2003 / TelessaúdeRS / ABN): Analfabetos: 20 pontos; 1 a 4 anos de escolaridade: 25 pontos; 5 a 8 anos: 26,5 pontos; 9 a 11 anos: 28 pontos; Acima de 11 anos (>11): 29 pontos.',
      'Avalia orientação temporal/espacial, memória imediata, atenção/cálculo, evocação, linguagem e praxia construtiva (total de 0 a 30 pontos).',
      'Diretrizes TelessaúdeRS: O MEEM é instrumento de triagem e deve sempre ser complementado pela avaliação da funcionalidade (ABVD - Katz e AIVD - Lawton e Brody ou Pfeffer/FAQ), Teste do Desenho do Relógio (TDR) e exclusão laboratorial de causas reversíveis (TSH, Vitamina B12, VDRL, função renal/hepática).'
    ]
  },
  // 10. EUROHIS-QOL & WHOQOL
  {
    id: 'eurohis-rocha-fleck',
    topic: 'Qualidade de Vida e Saúde Integral',
    title: 'Desenvolvimento e Validação da Versão em Português do Índice de Qualidade de Vida EUROHIS-QOL de 8 Itens',
    source: 'Schmidt S et al. (2006) / Rocha NS, Power MJ, Bushnell DM, Fleck MP (Revista de Saúde Pública, 2008)',
    year: '2008',
    summary: 'Versão abreviada da OMS para avaliação rápida e confiável da qualidade de vida global, saúde física, relações e condições de moradia.',
    keyPoints: [
      'Escore de 8 a 40 pontos com forte correlação com o WHOQOL-Bref e facilidade de aplicação na rotina da APS.',
      'Permite monitorar ganhos de autonomia e bem-estar subjetivo ao longo do cuidado longitudinal.'
    ]
  },
  // 11. Diretrizes Institucionais e SUS
  {
    id: 'cab-34',
    topic: 'Organização da Saúde Mental na APS',
    title: 'Caderno de Atenção Básica nº 34: Saúde Mental',
    source: 'Ministério da Saúde - Brasil',
    year: '2013',
    summary: 'Documento balizador para o cuidado em saúde mental territorializado, matriciamento e acolhimento na Atenção Primária à Saúde no SUS.',
    keyPoints: [
      'Acolhimento humanizado e escuta qualificada como porta de entrada.',
      'Apoio Matricial com equipes de Saúde Mental / eNASF / CAPS para casos complexos.',
      'Uso racional de psicofármacos e combate à medicalização excessiva do sofrimento psíquico.',
      'Construção de Projetos Terapêuticos Singulares (PTS) pactuados com o usuário.'
    ]
  },
  {
    id: 'sbmfc-saude-mental',
    topic: 'Medicina de Família e Comunidade (MFC)',
    title: 'Tratado de Medicina de Família e Comunidade (2ª Edição) - Abordagem em Saúde Mental',
    source: 'Sociedade Brasileira de Medicina de Família e Comunidade (SBMFC) / Gusso G, Lopes JMC, Dias LC',
    year: '2019',
    summary: 'Princípios da clínica ampliada, método clínico centrado na pessoa, abordagem familiar e seguimento longitudinal na APS.',
    keyPoints: [
      'Integração dos aspectos biológicos, psicológicos e sociais na consulta de MFC.',
      'Manejo da incerteza e acompanhamento ao longo do tempo.',
      'Abordagem de somatização e sintomas fisicamente inexplicados.'
    ]
  },
  {
    id: 'aps-protocolo-sm',
    topic: 'Linha de Cuidado Territorial',
    title: 'Diretrizes de Apoio Matricial e Saúde Mental na APS',
    source: 'Cadernos de Atenção Básica / MFC Brasil',
    year: '2022',
    summary: 'Orientações práticas para o matriciamento e cuidado compartilhado entre equipes de Saúde da Família e Saúde Mental.',
    keyPoints: [
      'Fluxo de encaminhamento e estratificação de risco clínico no território.',
      'Consultoria conjunta e discussão de casos complexos em reuniões de matriciamento.',
      'Acompanhamento compartilhado e longitudinal na Atenção Primária.'
    ]
  },
  {
    id: 'who-mhgap',
    topic: 'Saúde Mental Global',
    title: 'Manual de Intervenções mhGAP (versão 2.0)',
    source: 'Organização Mundial da Saúde (OMS / WHO)',
    year: '2019',
    summary: 'Guia de suporte à decisão clínica para manejo de transtornos mentais, neurológicos e por uso de substâncias em serviços de atenção não especializada.',
    keyPoints: [
      'Apoio à tomada de decisão para médicos e enfermeiros na Atenção Primária.',
      'Rastreamento de risco de suicídio e intervenções em crise.',
      'Orientações educativas para cuidadores e familiares.'
    ]
  },

  {
    id: 'maudsley-prescribing-guidelines-2021',
    topic: 'Diretrizes de Troca de Psicofármacos & Segurança',
    title: 'The Maudsley Prescribing Guidelines in Psychiatry (14th Edition) - Switching and Deprescribing Antidepressants',
    source: 'Taylor D, Barnes TRE, Young AH. Wiley-Blackwell / King\'s College London',
    year: '2021',
    summary: 'Principal tratado mundial de psicofarmacologia clínica aplicada, detalhando protocolos sistemáticos para troca direta, troca cruzada (cross-tapering) e troca com períodos de washout entre diferentes classes de antidepressivos.',
    keyPoints: [
      'Troca Cruzada (Cross-tapering): Estratégia de primeira escolha para a maioria das trocas de classe para mitigar a Síndrome de Descontinuação e evitar recaídas depressivas.',
      'Meia-vida da Norfluoxetina (7-15 dias): Possibilita a troca direta facilitada de Fluoxetina para outros ISRS sem necessidade de desmame lento prévio.',
      'Washout obrigatório: 14 dias para trocas com IMAO (Tranilcipromina) e 5 semanas (35 dias) estritas para transição de Fluoxetina para IMAO para prevenção da Síndrome Serotoninérgica potencialmente fatal.'
    ]
  },
  {
    id: 'horowitz-taylor-ssri-tapering-2019',
    topic: 'Desmame Hiperbólico & Síndrome de Descontinuação (FINISH)',
    title: 'Tapering of SSRI treatment to mitigate withdrawal symptoms',
    source: 'Horowitz MA, Taylor D. The Lancet Psychiatry',
    year: '2019',
    summary: 'Demonstração farmacológica da curva hiperbólica de ocupação do transportador de serotonina (SERT) e a necessidade de desmame proporcional gradual para prevenir sintomas de descontinuação (FINISH).',
    keyPoints: [
      'Reduções lineares de dose produzem quedas hiperbólicas desproporcionais na ocupação do receptor SERT em doses baixas.',
      'Alerta clínico para sintomas FINISH (Flu-like, Insomnia, Nausea, Imbalance/tonturas, Sensory "brain zaps", Hyperarousal).',
      'Paroxetina e Venlafaxina requerem cuidados redobrados devido à meia-vida curta e alta afinidade de recaptação.'
    ]
  },
  {
    id: 'canmat-mdd-guidelines-2016',
    topic: 'Diretrizes Clínicas de Manejo do TDM',
    title: 'Canadian Network for Mood and Anxiety Treatments (CANMAT) 2016 Clinical Guidelines for the Management of Adults with Major Depressive Disorder',
    source: 'Kennedy SH, Lam RW, McIntyre RS, et al. Canadian Journal of Psychiatry',
    year: '2016',
    summary: 'Diretriz clínica baseada em evidências para seleção, troca e potencialização de antidepressivos no manejo do Transtorno Depressivo Maior na APS e atenção especializada.',
    keyPoints: [
      'Avaliação de resposta terapêutica após 4 a 6 semanas de dose plena.',
      'Troca entre classes (ex: ISRS para ISRN ou Atípico) quando há falha terapêutica ou intolerância a efeitos adversos.',
      'Monitoramento de interações metabólicas no Citocromo P450 (CYP2D6, CYP1A2, CYP2C19, CYP3A4).'
    ]
  },
  // 13. Prevenção Cardiovascular & Monitoramento Metabólico na APS / Saúde Mental
  {
    id: 'sbc-prevencao-cv-2019',
    topic: 'Cardiologia Preventiva & Risco Cardiovascular na APS',
    title: 'Atualização da Diretriz de Prevenção Cardiovascular da Sociedade Brasileira de Cardiologia - 2019/2021',
    source: 'Précoma DB, Oliveira GMM, Simão AF et al. Arquivos Brasileiros de Cardiologia (SBC)',
    year: '2019-2021',
    summary: 'Diretriz nacional padrão-ouro para estratificação do risco cardiovascular global em 10 anos, identificação de condições de muito alto e alto risco direto, fatores agravantes reclassificadores e metas lipídicas/pressóricas estritas na Atenção Primária.',
    keyPoints: [
      'Estratificação em 4 categorias de risco: Baixo (<5%), Intermediário (5-20% M / 5-10% F), Alto (>20% M / >10% F ou DM/DRC/LDL≥190) e Muito Alto (DAC/AVC/DAP clinicamente manifestos).',
      'Fatores agravantes reclassificam risco intermediário para alto: história familiar prematura de DCV, síndrome metabólica, microalbuminúria e PCR-us > 2 mg/L.',
      'Metas de LDL-C por estrato: Muito Alto Risco < 50 mg/dL (e redução ≥ 50%); Alto Risco < 70 mg/dL; Risco Intermediário < 100 mg/dL; Baixo Risco < 130 mg/dL.',
      'Estatina de Alta Potência (Atorvastatina 40-80mg ou Rosuvastatina 20-40mg) indicada formalmente para muito alto e alto risco.'
    ]
  },
  {
    id: 'dagostino-framingham-2008',
    topic: 'Escore de Risco de Framingham Global',
    title: 'General Cardiovascular Risk Profile for Use in Primary Care: The Framingham Heart Study',
    source: 'D\'Agostino RB Sr, Vasan RS, Pencina MJ, Wolf PA, Cobain M, Massaro JM, Kannel WB. Circulation',
    year: '2008',
    summary: 'Estudo seminal do Framingham Heart Study que validou a função de regressão de Cox para estimar o risco global de eventos cardiovasculares maiores em 10 anos na atenção primária, com variantes baseadas em perfil lipídico ou em IMC para contextos sem exames laboratoriais imediatos.',
    keyPoints: [
      'Modelo validado para homens e mulheres de 30 a 74 anos para predição de DAC, IAM, AVC, AIT, insuficiência cardíaca e doença arterial periférica.',
      'Permite uso da variante baseada no Índice de Massa Corporal (IMC) com acurácia clínica comparável quando não há dosagem de colesterol disponível na UBS.',
      'Fundamento algorítmico do Escore de Risco Global adotado no Brasil e internacionalmente.'
    ]
  },
  {
    id: 'ada-apa-metabolic-antipsychotics',
    topic: 'Saúde Mental & Síndrome Metabólica em Psicofármacos',
    title: 'Consensus Development Conference on Antipsychotic Drugs and Obesity and Diabetes',
    source: 'American Diabetes Association (ADA) / American Psychiatric Association (APA) / Diabetes Care',
    year: '2004-2020',
    summary: 'Consenso intersocietário sobre o impacto metabólico dos antipsicóticos de segunda geração, risco de ganho de peso acelerado, disglicemia e dislipidemia, estabelecendo o calendário padrão de monitoramento metabólico na atenção primária.',
    keyPoints: [
      'Classificação de risco metabólico: Alto risco (Clozapina, Olanzapina); Risco intermediário (Quetiapina, Risperidona); Baixo risco (Aripiprazol, Ziprasidona, Lurasidona).',
      'Protocolo de rastreio na APS: Peso/IMC (basal, 4, 8 e 12 semanas, depois trimestral); PA, Glicemia de jejum e Perfil Lipídico (basal, 12 semanas e anual).',
      'Alerta clínico: Ganho de peso > 5% do peso corporal no primeiro trimestre é preditor de obesidade grave e deve motivar discussão de troca ou intervenção precoce de estilo de vida.'
    ]
  },
  // 14. Semiologia Psiquiátrica & Exame do Estado Mental (EEM)
  {
    id: 'dalgalarrondo-semiologia-psicopatologia',
    topic: 'Semiologia Psiquiátrica & Exame do Estado Mental',
    title: 'Psicopatologia e Semiologia dos Transtornos Mentais (3ª Edição)',
    source: 'Dalgalarrondo, Paulo. Artmed Editora',
    year: '2019',
    summary: 'Tratado clássico brasileiro de semiologia psiquiátrica. Estabelece a distinção conceitual rigorosa das funções psíquicas: Consciência (vigília/rebaixamento), Orientação (autopsíquica e alopsíquica: tempo e espaço), Atenção (tenacidade e vigilância), Memória (fixação e evocação), Sensopercepção, Pensamento (curso, forma e conteúdo), Afetividade (humor e afeto), Vontade/Psicomotricidade e Juízo Crítico/Insight.',
    keyPoints: [
      'Orientação: subdividida estritamente em Autopsíquica (orientação quanto à própria pessoa) e Alopsíquica (orientação no Tempo e no Espaço).',
      'Atenção e Concentração: função autônoma (tenacidade, vigilância, normoprosexia, hipoprosexia, aprosexia e hiperprosexia), distinguindo-se do teste de orientação.',
      'Memória: diferenciação entre memória de fixação (imediata/recente) e evocação (remota).',
      'Pensamento: tripartição indispensável em Curso (velocidade/ritmo), Forma (estrutura/encadeamento) e Conteúdo (temática/juízo de realidade).'
    ]
  },
  {
    id: 'kaplan-sadock-compendio-psiquiatria',
    topic: 'Exame Psiquiátrico & Mental Status Examination (MSE)',
    title: 'Compêndio de Psiquiatria: Ciência do Comportamento e Psiquiatria Clínica (11ª/12ª Edição)',
    source: 'Sadock BJ, Sadock VA, Ruiz P. Kaplan & Sadock / Artmed / Wolters Kluwer',
    year: '2017-2022',
    summary: 'Referência internacional padrão-ouro para a condução estruturada do Mental Status Examination (MSE). Organiza o exame sistemático em: Descrição Geral (Aparência, Atitude, Comportamento psicomotor), Fala, Humor e Afeto, Pensamento (Processo/Forma e Conteúdo), Percepção (Sensopercepção), Sensório e Cognição (Consciência, Orientação nos 3 eixos, Atenção/Cálculo, Memória e Linguagem), Insight e Julgamento.',
    keyPoints: [
      'Sensório & Cognição: Orientação avaliada especificamente nos três eixos (Tempo, Lugar/Espaço e Pessoa).',
      'Atenção e Concentração testadas separadamente (ex: subtração seriada de 7, soletrar "MUNDO" de trás para frente).',
      'Distinção precisa entre Humor (estado subjetivo sustentado ao longo do tempo) e Afeto (expressão objetiva e modulação no momento da entrevista).'
    ]
  },
  {
    id: 'statpearls-mental-status-examination',
    topic: 'Semiologia Médica & Mental Status Examination (MSE)',
    title: 'Mental Status Examination (StatPearls / NCBI Bookshelf)',
    source: 'Soni P, Gossman W, Munakomi S. StatPearls Publishing, Treasure Island (FL) / National Center for Biotechnology Information (NCBI) NBK546682',
    year: '2023',
    summary: 'Revisão clínica estruturada do StatPearls/NCBI para o Exame do Estado Mental no atendimento médico ambulatorial e de emergência, destacando a avaliação metódica das funções cognitivas isoladas (Orientação, Atenção/Concentração, Memória, Insight e Julgamento).',
    keyPoints: [
      'Estrutura em domínios claros: Appearance & Behavior, Speech, Mood & Affect, Thought Process, Thought Content, Perceptions, Cognition (Orientation, Attention/Calculation, Memory), Insight, and Judgment.',
      'Orientação (Tempo, Lugar, Pessoa) é o primeiro índice cognitivo de rastreio de delirium e estados confusionais agudos.',
      'Atenção e Concentração representam a capacidade de focar e sustentar o esforço cognitivo em tarefas direcionadas.'
    ]
  },
  {
    id: 'maudsley-prescribing-15th-ed',
    topic: 'Psicofarmacologia Clínica e Diretrizes Posológicas',
    title: 'The Maudsley Prescribing Guidelines in Psychiatry (15ª Edição)',
    source: 'Taylor DM, Barnes TRE, Young AH. Wiley-Blackwell',
    year: '2025',
    summary: 'Referência global padrão-ouro para prescrição psicofarmacológica clínica baseada em evidências. Estabelece faixas posológicas terapêuticas de referência, doses de introdução, monitoramento de intervalo QTc e estratégias de transição posológica.',
    keyPoints: [
      'Faixas Terapêuticas de Referência: Estabelece as janelas de eficácia e doses máximas para todos os antidepressivos maiores na prática ambulatorial e hospitalar.',
      'Transição entre Psicofármacos: Detalha o manejo das trocas diretas, trocas cruzadas e janelas estritas de intervalo livre (washout).',
      'Monitoramento de Segurança: Critérios rigorosos para controle de intervalo QTc com citalopram e escitalopram, toxicidade cardiovascular de tricíclicos e monitoramento pressórico com duais.',
      'Diferenciação Metodológica: Distingue claramente a prescrição e titulação aguda da desprescrição em fases de remissão estável.'
    ]
  },
  {
    id: 'maudsley-deprescribing-2024',
    topic: 'Desprescrição e Desmame Gradual de Psicofármacos',
    title: 'The Maudsley Deprescribing Guidelines: Antidepressants, Benzodiazepines, Gabapentinoids and Z-drugs',
    source: 'Horowitz MA, Taylor DM. Wiley-Blackwell (DOI: 10.1002/9781394291052)',
    year: '2024',
    summary: 'Primeiro compêndio clínico internacional sistemático dedicado exclusivamente à desprescrição segura de psicofármacos. Apresenta o método do Desmame Hiperbólico fundamentado em estudos de neuroimagem PET da ocupação de receptores.',
    keyPoints: [
      'Princípio Hiperbólico: Reduções de dose devem ser proporcionais à dose remanescente atual (e não cortes lineares fixos em mg), prevenindo o choque de receptores nas etapas finais ("the difficult last mile").',
      'Desmame Guiado pelo Paciente (Patient-Led Tapering): O paciente controla o ritmo dos degraus. Se houver abstinência moderada a severa, a dose deve ser mantida (regra do "hold") por 2 a 4 semanas até estabilização biológica.',
      'Diferencial Clínico: Estabelece a distinção semiológica precisa entre Síndrome de Retirada (início precoce, curso em ondas, sintomas sensoriais/choques) e Recaída (início insidioso e tardio, sintomas puramente psíquicos).',
      'Microescalonamento: Enfatiza a utilização de formulações líquidas (gotas) e fracionamento fino para viabilizar microdoses sem forçar a interrupção prematura para zero.'
    ]
  },
  {
    id: 'hayasaka-dose-equivalents-2015',
    topic: 'Equivalência de Doses de Antidepressivos em Ensaios Clínicos',
    title: 'Dose equivalents of antidepressants: Evidence-based recommendations from randomized controlled trials',
    source: 'Hayasaka Y, Purgato M, Magni LR, Ogawa Y, Takeshima N, Cipriani A, Barbui C, Leucht S, Furukawa TA. Journal of Affective Disorders (DOI: 10.1016/j.jad.2015.03.021)',
    year: '2015',
    summary: 'Meta-análise de 83 ensaios clínicos randomizados duplo-cegos (14.131 pacientes) que determinou as razões de dose clinicamente equivalentes para 12 antidepressivos tomando como padrão de referência a Fluoxetina 40 mg/dia.',
    keyPoints: [
      'Doses Equivalentes Primárias a Fluoxetina 40 mg/dia: Paroxetina 34,0 mg; Sertralina 98,5 mg; Escitalopram 18,0 mg; Fluvoxamina 143,3 mg; Venlafaxina 149,4 mg; Mirtazapina 50,9 mg; Bupropiona 348,5 mg; Amitriptilina 122,3 mg; Nortriptilina 100,9 mg; Clomipramina 116,1 mg; Agomelatina 53,2 mg.',
      'Escopo e Limitações: Citalopram e antidepressivos mais recentes (Desvenlafaxina, Duloxetina, Vortioxetina) não tiveram coeficientes de equivalência primários estabelecidos no resumo da meta-análise.',
      'Aplicação Clínica: Fornece um balizador populacional baseado em RCTs, mas NÃO substitui a titulação individualizada e a consideração da dose de introdução clínica na prescrição.'
    ]
  },
  {
    id: 'asam-benzodiazepine-tapering-2025',
    topic: 'Desprescrição de Benzodiazepínicos na Atenção Primária',
    title: 'The ASAM Clinical Practice Guideline on Benzodiazepine Tapering',
    source: 'American Society of Addiction Medicine (ASAM)',
    year: '2025',
    summary: 'Diretriz de prática clínica da ASAM orientando a descontinuação e redução gradual de benzodiazepínicos e agonistas do receptor de benzodiazepínicos na atenção primária e ambulatório.',
    keyPoints: [
      'Ritmo Individualizado: Reduções recomendadas de 5% a 25% da dose atual a cada 1 a 4 semanas, com desaceleração progressiva nas doses finais.',
      'Não Forçar Término para Zero: Desaconselha cronogramas inflexíveis que forçam a última dose para zero sem estabilização e consentimento; preconiza a consolidação na menor dose viável.',
      'Manejo Compartilhado: Se surgirem sintomas moderados de abstinência, pausar a redução mantendo a dose atual por 2 a 4 semanas, sem acelerar e sem retornar à dose cheia inicial.',
      'Prevenção de Danos: A redução gradual associada a apoio psicoterápico previne convulsões, delirium e quedas em populações vulneráveis.'
    ]
  },
  {
    id: 'canmat-depression-2023',
    topic: 'Diretrizes Clínicas de Manejo do Transtorno Depressivo Maior',
    title: 'CANMAT 2023 Update on Clinical Guidelines for Management of Major Depressive Disorder in Adults',
    source: 'Lam RW, McIntosh D, Wang J et al. Canadian Journal of Psychiatry (DOI: 10.1177/07067437241245384)',
    year: '2024',
    summary: 'Atualização das diretrizes da Canadian Network for Mood and Anxiety Treatments (CANMAT) para diagnóstico, tratamento farmacológico de primeira linha, troca e descontinuação no TDM.',
    keyPoints: [
      'Medicamentos de Primeira Linha: Confirma ISRSs (exceto fluvoxamina), ISRNs (desvenlafaxina, duloxetina, venlafaxina), bupropiona, mirtazapina e vortioxetina com nível 1 de evidência.',
      'Doses e Titulação: Define a dose de introdução e a faixa terapêutica recomendada para cada fármaco, alertando contra titulações aceleradas desnecessárias.',
      'Transição Terapêutica: Recomenda troca cruzada gradual como conduta padrão na ausência de resposta terapêutica ou intolerância a efeitos colaterais.'
    ]
  },
  {
    id: 'nhs-sps-antidepressant-switching-2024',
    topic: 'Estratégias Práticas de Troca de Antidepressivos',
    title: 'Switching strategies for antidepressants in adults: Practice Guidelines',
    source: 'NHS Specialist Pharmacy Service (SPS) - Reino Unido',
    year: '2024',
    summary: 'Diretrizes práticas do serviço especializado de farmácia clínica do NHS britânico para seleção de estratégias de transição entre antidepressivos em adultos.',
    keyPoints: [
      'Troca Direta (Direct Switch): Indicada principalmente entre ISRSs da mesma classe em doses baixas ou moderadas.',
      'Troca Cruzada (Cross-Taper): Estratégia de escolha para transições entre classes distintas (ISRS para ISRN, tricíclicos, etc.) e em doses elevadas.',
      'Janela Livre Obrigatória (Washout): Exigência inegociável em trocas envolvendo IMAOs (14 dias gerais e 5 semanas para fluoxetina) para prevenção de síndrome serotoninérgica fatal.'
    ]
  },
// Fundamentação acadêmica do TCR — documentação, EEM, integração e método DSR.
  // Estes estudos não validam diretamente o Nexus Clínico nem suas regras de escore.
  {
    id: 'tcr-lobo-2015',
    topic: 'Pesquisa TCR: EEM e registro semiestruturado',
    title: 'A comparison of mental state examination documentation before and after a semi-structured assessment template',
    source: 'Lobo SEM et al. International Journal of Medical Informatics. DOI: 10.1016/j.ijmedinf.2015.05.001',
    year: '2015',
    summary: 'Comparação de registros de EEM em serviço especializado antes e depois de um modelo eletrônico semiestruturado; não é prova de efetividade na APS brasileira.',
    keyPoints: [
      'Evidência direta para estudar organização e abrangência documental do EEM.',
      'Não demonstra redução de tempo ou melhora de desfechos clínicos no Nexus.'
    ]
  },
  {
    id: 'tcr-zurynski-2021',
    topic: 'Pesquisa TCR: narrativa e prontuário em saúde mental',
    title: 'Implementation of Electronic Medical Records in Mental Health Settings: Scoping Review',
    source: 'Zurynski Y et al. JMIR Mental Health. DOI: 10.2196/30564',
    year: '2021',
    summary: 'Revisão de escopo sobre implementação de registros eletrônicos em serviços de saúde mental e desafios da documentação narrativa.',
    keyPoints: [
      'Examina compatibilidade entre prontuário e necessidades próprias do atendimento em saúde mental.',
      'A implementação de registro eletrônico não garante maior qualidade assistencial.'
    ]
  },
  {
    id: 'tcr-seinen-2025',
    topic: 'Pesquisa TCR: registro estruturado e texto livre',
    title: 'Using Structured Codes and Free-Text Notes to Measure Information Complementarity in Electronic Health Records',
    source: 'Seinen TM et al. Journal of Medical Internet Research. DOI: 10.2196/66910',
    year: '2025',
    summary: 'Estudo sobre a complementaridade das informações presentes em códigos estruturados e notas livres no prontuário.',
    keyPoints: [
      'Sustenta preservar texto livre mesmo com documentação estruturada.',
      'Não testa o Nexus nem demonstra que uma interface específica melhora desfechos.'
    ]
  },
  {
    id: 'tcr-gaspary-2026',
    topic: 'Pesquisa TCR: prontuários em saúde mental brasileira',
    title: 'A structured framework to improve usability in EHR implementation: a user-centered case study in Brazilian mental healthcare',
    source: 'Gaspary FP et al. Frontiers in Digital Health. DOI: 10.3389/fdgth.2025.1676631',
    year: '2026',
    summary: 'Estudo brasileiro de usabilidade e implementação de prontuário em saúde mental, útil para contextualização sociotécnica.',
    keyPoints: [
      'Discute dificuldades de navegação, integração e flexibilidade documental.',
      'Usabilidade observada em outro serviço não equivale a avaliação técnico-funcional do Nexus.'
    ]
  },
  {
    id: 'tcr-peffers-2007',
    topic: 'Pesquisa TCR: Design Science Research',
    title: 'A Design Science Research Methodology for Information Systems Research',
    source: 'Peffers K et al. Journal of Management Information Systems. DOI: 10.2753/MIS0742-1222240302',
    year: '2007',
    summary: 'Propõe seis atividades de pesquisa orientada ao desenvolvimento e à avaliação de artefatos de sistemas de informação.',
    keyPoints: [
      'Distingue a construção e demonstração da avaliação efetiva do artefato.',
      'A unidade de análise é a instanciação de software em versão identificada.'
    ]
  },
  {
    id: 'tcr-venable-2016',
    topic: 'Pesquisa TCR: avaliação de artefatos DSR',
    title: 'FEDS: A Framework for Evaluation in Design Science Research',
    source: 'Venable J, Pries-Heje J, Baskerville R. European Journal of Information Systems. DOI: 10.1057/ejis.2014.36',
    year: '2016',
    summary: 'Framework de planejamento da avaliação de artefatos, distinguindo avaliação artificial/naturalística e formativa/somativa.',
    keyPoints: [
      'A avaliação preliminar com dados sintéticos é artificial e delimitada à consistência técnico-funcional.',
      'Testes de bancada não demonstram eficácia clínica nem usabilidade por profissionais.'
    ]
  }

];
