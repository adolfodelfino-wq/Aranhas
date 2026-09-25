# 🏥 NEXUS CLÍNICO — DOSSIÊ TÉCNICO, CLÍNICO E ARQUITETURAL PARA CONSULTORIA ESTRATÉGICA (GPT ASTRA)

**Data de Emissão:** Setembro de 2026  
**Sistema:** Nexus Clínico (v2.4 - Build Especialista)  
**Público-Alvo do Sistema:** Médicos de Família e Comunidade (MFC), Médicos da Atenção Primária à Saúde (APS), Residentes, Internos e Médicos Ambulatoriais no Sistema Único de Saúde (SUS) e Saúde Suplementar.  
**Objetivo deste Dossiê:** Fornecer à IA Consultora Especialista (**GPT Astra**) uma radiografia integral, minuciosa e sem filtros do estado atual do **Nexus Clínico** (arquitetura de software, modelos matemáticos/estatísticos, regras clínicas, ergonomia cognitiva e fluxos de trabalho), visando colher:
1. Recomendações de melhorias e incrementos nas ferramentas determinísticas existentes;
2. Sugestões de novos módulos e calculadoras de alto impacto para a prática clínica ambulatorial;
3. Arquitetura de interoperabilidade com o SUS (e-SUS PEC, RNDS, FHIR, OpenEHR);
4. Otimização de ergonomia cognitiva e usabilidade em consultas estritas de 15 a 20 minutos;
5. Estratégias de uso seguro e ético de Inteligência Artificial Generativa fora do loop crítico de decisão médica.

---

## 1. Contexto Clínico, Filosofia e Missão

### 1.1 O Desafio da Atenção Primária à Saúde (APS)
A consulta ambulatorial na APS é caracterizada por:
- **Tempo escasso**: Consultas com tempo médio de 15 a 20 minutos por paciente.
- **Alta complexidade biopsicossocial**: O mesmo paciente apresenta queixas somáticas (hipertensão, diabetes, dor crônica), queixas psíquicas (ansiedade, insônia, depressão) e determinantes sociais da saúde (vulnerabilidade econômica, conflitos familiares).
- **Sobrecarga de telas e "Fadiga de Cliques"**: Os prontuários eletrônicos tradicionais (PEP) exigem múltiplos cliques desnecessários, rolagem vertical excessiva e formulários burocráticos que afastam o olhar do médico do paciente.
- **Risco de Viés e Iatrogenia Farmacológica**: Prescrições cruzadas de psicofármacos sem cálculo de dose equivalente, descontinuação abrupta gerando Síndrome de Retirada (FINISH), subnotificação de ideação suicida e falta de monitoramento metabólico em uso de antipsicóticos.

### 1.2 Os Três Pilares Inegociáveis do Nexus Clínico
1. **Ergonomia Cognitiva Radical (Anti-Slop / Foco no Essencial)**:
   - Interface com fundo em gelo (`bg-slate-50`) para prevenir astenopia/fadiga visual em plantões prolongados.
   - Superfícies de dados em branco puro (`bg-white`), bordas suaves (`border-slate-200`) e tipografia sem preto puro (`text-slate-800`/`slate-900`).
   - Escaneabilidade visual em menos de 3 segundos com hierarquia por gravidade clínica (Neutro/Verde -> Alerta/Amarelo -> Risco Agudo/Vermelho).
   - Sem poluição visual, animações distrativas ou geradores de texto artificial que poluam o registro médico.
2. **Determinismo Clínico e Medicina Baseada em Evidências (MBE)**:
   - Todas as decisões clínicas, conversões de dosagem, pontos de corte de escalas e estratificações de risco são **100% algorítmicas, auditáveis e transparentes** (sem alucinações de LLM em condutas vitais).
   - Ancoragem em diretrizes internacionais e nacionais indexadas: Maudsley Prescribing Guidelines (14ª ed.), meta-análise de Hayasaka et al. (Lancet/JAD), Horowitz & Taylor (Lancet Psychiatry 2019), Diretrizes da SBC 2019/2021, Consenso ADA/APA e pontos de corte brasileiros do MEEM (Brucki et al., 2003 / TelessaúdeRS).
3. **Soberania da Narrativa Clínica (Método Clínico Centrado na Pessoa & SOAP)**:
   - O campo **S (Subjetivo)** permanece livre e protegido de automações artificiais: o médico registra as palavras autênticas do paciente e o motivo da consulta sem preenchimentos automáticos enviesados.
   - O sistema automatiza onde há ganho de segurança e padronização: **O (Objetivo)** (dados semiológicos do EEM, escores de escalas, TFG), **A (Avaliação)** (classificações e diagnósticos sindrômicos estruturados) e **P (Plano)** (propostas farmacológicas de troca/desmame, plano de segurança e educação em saúde contextual editável).
   - Exportação em 1 clique ("Copiar para Prontuário") compatível com qualquer PEP (e-SUS PEC, MV Soul, Tasy, Philips, ClinicWeb).

---

## 2. Arquitetura Tecnológica e Engenharia de Software

### 2.1 Stack Tecnológico
- **Core:** React 18.3+ com TypeScript estrito (`strict: true` no `tsconfig.json`).
- **Build & Bundler:** Vite 5+, com transpilador TSX para backend Node/Express (`server.ts`).
- **Estilização:** Tailwind CSS v3/v4 utility-first, sem CSS inline ou classes não documentadas.
- **Ícones:** Lucide React (ícones vetoriais leves e consistentes com semiótica médica).
- **Visualização de Dados & Gráficos:** Recharts (gráficos de linha/tendência longitudinal e gráficos de radar de domínios psicométricos com suporte responsivo).
- **Navegação & Roteamento:** History API nativa sincronizada com estado SPA (`parseCurrentLocation`, `updateBrowserHistory`), suporte a deep-linking para cada escala (`/escalas/:id`), calculadora (`/calculadoras/:id`), EEM e SOAP, com fallback estático em `index.html` para indexação e agentes.
- **Privacidade & LGPD:** Arquitetura *client-side first*. Não há persistência de dados sensíveis de pacientes em servidores externos sem autorização expressa. Sessão volátil com opção de carregar paciente demonstrativo para treinamento e testes.

### 2.2 Estrutura de Arquivos e Módulos Principais
```text
/
├── index.html                     # Ponto de entrada HTML, metatags clínicas e rotas canônicas
├── metadata.json                  # Metadados do applet e capabilities
├── server.ts                      # Servidor Express full-stack com proxy e middlewares Vite
├── src/
│   ├── App.tsx                    # Orquestrador de estado global, histórico, sessão e modais
│   ├── types.ts                   # Interfaces TypeScript unificadas (ScaleDefinition, SoapState, etc.)
│   ├── components/
│   │   ├── Header.tsx             # Identificação do paciente, status da sessão e busca global
│   │   ├── Sidebar.tsx            # Navegação lateral expansível/colapsável com contadores SOAP
│   │   ├── DashboardView.tsx      # Visão panorâmica, atalhos rápidos e resumo do paciente
│   │   ├── ScalesView.tsx         # Hub de escalas psicométricas, preenchimento e exportação
│   │   ├── EemSoapWorkstationView.tsx # Estação integrada EEM (Semiologia) + Prontuário SOAP
│   │   ├── EemView.tsx            # Visualizador isolado do Exame do Estado Mental
│   │   ├── SoapView.tsx           # Visualizador isolado do Prontuário SOAP estruturado
│   │   ├── CalculatorsView.tsx    # Hub de calculadoras médicas clínicas e metabólicas
│   │   ├── AntidepressantSwitchCalculator.tsx # Motor Maudsley/Hayasaka de troca de antidepressivos
│   │   ├── EvolutionChartsView.tsx# Gráficos longitudinais (tendência e radar psicométrico)
│   │   ├── PatientSelfFillModal.tsx # Modo de autoaplicação pelo paciente (kiosk / mobile / WhatsApp)
│   │   ├── ContextualEducationModal.tsx # Motor de sugestões contextuais de educação em saúde
│   │   ├── AboutModal.tsx         # Dossiê de evidências científicas, metodologia e bases de dados
│   │   ├── WhatsappShareModal.tsx # Compartilhamento seguro de orientações via link ou texto
│   │   ├── SourceCodeModal.tsx    # Auditoria de transparência algorítmica e código-fonte
│   │   └── ErrorBoundary.tsx      # Captura de exceções e resiliência em tempo de execução
│   ├── data/
│   │   ├── scalesData.ts          # 11 escalas primárias com questões, pontuações e condutas
│   │   ├── additionalScalesData.ts# 10 escalas complementares (AUDIT-C, CAGE, PCL-5, EPDS, etc.)
│   │   ├── eemData.ts             # Taxonomia semiológica completa do EEM em 11 domínios
│   │   ├── evidenceData.ts        # Matriz canônica de referências bibliográficas indexadas
│   │   ├── radarDomainsData.ts    # Configurações de mapeamento para gráficos de radar
│   │   ├── educationData.ts       # Textos estruturados de psicoeducação para APS
│   │   └── demoPatientData.ts     # Dados mock estruturados de paciente para teste/validação
│   └── utils/
│       ├── antidepressantSwitching.ts # Motor farmacocinético Maudsley, CYP450 e desmame
│       ├── calculators.ts         # CKD-EPI 2021, Risco Cardiovascular SBC/Framingham, CPZE
│       ├── healthEducationEngine.ts # Motor de inferência determinística para educação em saúde
│       └── navigation.ts          # Utilitários de roteamento e deep-linking na History API
```

---

## 3. Inventário Detalhado das Ferramentas Clínicas Implementadas

### 3.1 Hub de Escalas Psicométricas e Cognitivas (21 Escalas Validadas)

| Escala | Nome Completo & População | Ponto de Corte / Classificação | Comportamento Clínico & Alertas no Nexus |
| :--- | :--- | :--- | :--- |
| **PHQ-9** | Patient Health Questionnaire-9 (Adultos) | 0-4 Mínimo, 5-9 Leve, 10-14 Moderado, 15-19 Mod. Grave, 20-27 Grave (Corte ≥ 10) | **Alarme Crítico no Item 9**: Se valor > 0 (ideação de morte/suicídio), dispara banner vermelho de urgência, atalho para o C-SSRS e geração imediata do Plano de Segurança. |
| **GAD-7** | Generalized Anxiety Disorder 7 (Adultos) | 0-4 Mínima, 5-9 Leve, 10-14 Moderada, 15-21 Grave (Corte ≥ 10) | Monitoramento de resposta terapêutica (redução ≥ 50% = resposta; escore < 5 = remissão clínica). |
| **MEEM** | Mini-Exame do Estado Mental (Idosos / Suspeita de Declínio) | Pontos de corte de **Brucki et al. (2003)** por 5 faixas de escolaridade: Analfabeto (20), 1-4 anos (25), 5-8 anos (26.5), 9-11 anos (28), >11 anos (29) | Agrupamento oficial nas **7 dimensões semiológicas** (Orientação Temporal, Espacial, Registro, Atenção/Cálculo, Evocação, Linguagem, Praxia). Gráfico longitudinal com taxa de variação anual em pontos/ano. |
| **C-SSRS** | Columbia-Suicide Severity Rating Scale (Risco de Suicídio) | Triagem de Risco: Baixo, Moderado, Alto | Identificação de ideação ativa com método e intenção, planos preparatórios e tentativas prévias. Dispara protocolo de remoção de meios letais e contato de suporte. |
| **HCL-32** | Hypomania Checklist-32 (Rastreio de Transtorno Bipolar) | Ponto de corte nacional ≥ 18 pontos (Soares, Moreno et al., 2010) | Estrutura bifatorial: Fator 1 (Ativação/Elaboração) vs. Fator 2 (Risco/Irritabilidade). Alerta crucial contra prescrição isolada de antidepressivos para evitar viragem maníaca. |
| **AUDIT** | Alcohol Use Disorders Identification Test (10 itens, OMS) | 0-7 Baixo Risco, 8-15 Consumo de Risco, 16-19 Uso Nocivo, 20-40 Provável Dependência | Protocolo de Intervenção Breve (FRAMES) para escores 8-15 e encaminhamento para atenção especializada (CAPS AD) em escores ≥ 20. |
| **AUDIT-C** | Versão Abreviada de Consumo de Álcool (3 itens) | Homens ≥ 4 pts, Mulheres ≥ 3 pts | Triagem ultrarrápida (menos de 1 minuto) para detecção de padrão de risco ou *binge drinking*. |
| **CAGE** | Cutting down, Annoyed, Guilty, Eye-opener (4 itens) | Corte ≥ 2 respostas afirmativas | Rastreio rápido clássico na APS de problemas relacionados ao uso crônico de álcool. |
| **ASRS-18** | Adult ADHD Self-Report Scale v1.1 (OMS) | Parte A (6 itens de rastreio com pesos de corte sombreados) + Parte B (12 itens de frequência) | Triagem de Desatenção e Hiperatividade/Impulsividade em adultos, com diferenciação entre subtipos. |
| **SNAP-IV** | Swanson, Nolan, and Pelham Rating Scale (Crianças/Adolescentes) | 18 itens (9 desatenção, 9 hiperatividade/impulsividade) | Permite preenchimento pareado por pais e educadores para confirmação do critério de persistência em múltiplos ambientes (DSM-5). |
| **Y-BOCS** | Yale-Brown Obsessive Compulsive Scale | 0-7 Subclínico, 8-15 Leve, 16-23 Moderado, 24-31 Grave, 32-40 Extremo | Discrimina gravidade de obsessões vs. compulsões e tempo diário consumido pelos rituais. |
| **PCL-5** | PTSD Checklist for DSM-5 (20 itens) | Escore 0-80; ponto de corte diagnóstico provável ≥ 31-33 | Mapeia os 4 clusters do DSM-5: Intrusão, Evitação, Alterações Cognitivas/Humor e Hiperreatividade. |
| **PC-PTSD-5**| Primary Care PTSD Screen for DSM-5 (5 itens) | Ponto de corte ≥ 3 itens afirmativos | Triagem de 1 minuto na APS após exposição a eventos traumáticos graves. |
| **EPDS** | Escala de Depressão Pós-Parto de Edimburgo (10 itens) | Ponto de corte ≥ 10-12 no Brasil; Item 10 específico para ideação de autoextermínio | Rastreio durante pré-natal e puerpério na APS. Alerta vermelho imediato se item 10 for pontuado. |
| **SRQ-20** | Self-Reporting Questionnaire (20 itens, OMS) | Homens ≥ 6-7 pts, Mulheres ≥ 7-8 pts | Rastreio populacional de Transtornos Mentais Comuns (TMC) na atenção básica. |
| **HAM-A** | Escala de Ansiedade de Hamilton (14 itens) | 0-17 Leve, 18-24 Moderada, 25-30 Severa | Avaliação clínica detalhada com separação de ansiedade psíquica vs. somática/vegetativa. |
| **ISI** | Índice de Gravidade de Insônia (7 itens) | 0-7 Sem insônia, 8-14 Leve, 15-21 Moderada, 22-28 Severa | Avaliação de latência, manutenção, despertar precoce e impacto nas atividades diárias. |
| **PHQ-15** | Patient Health Questionnaire - Somatic Symptoms (15 itens) | 0-4 Baixo, 5-9 Médio, 10-14 Alto, 15-30 Muito Alto | Identificação e manejo de queixas somáticas funcionais e somatização na APS. |
| **MDQ** | Mood Disorder Questionnaire (13 itens + convivência) | Corte: ≥ 7 itens afirmativos simultâneos com impacto moderado a grave | Instrumento complementar para triagem de Transtorno Afetivo Bipolar. |
| **EUROHIS-QOL**| Índice de Qualidade de Vida Abreviado de 8 itens (OMS) | Escala de 8 a 40 pontos | Avaliação multidimensional do bem-estar biopsicossocial do paciente. |
| **WHOQOL-SRPB**| Módulo de Espiritualidade, Religiosidade e Crenças Pessoais (OMS) | Avaliação dos domínios de sentido da vida, esperança e conexão espiritual | Apoio na Abordagem Centrada na Pessoa e histórico espiritual na APS (Protocolo FICA). |

### 3.2 Semiologia Psiquiátrica e Exame do Estado Mental (EEM)
O módulo de EEM foi projetado com base em Dalgalarrondo (*Psicopatologia e Semiologia dos Transtornos Mentais*, 3ª Ed.) e Kaplan & Sadock:
- **11 Domínios Estruturados:**
  1. *Aparência e Higiene* (Cuidado geral, vestuário, adequação à idade).
  2. *Atitude e Contato* (Cooperativo, desconfiado, hostil, inibido, expansivo).
  3. *Fala e Psicomotricidade* (Velocidade, volume, prosódia, latência, mutismo, agitação/retardo).
  4. *Humor* (Eutímico, distímico, ansioso, eufórico, disfórico, apático).
  5. *Afeto* (Normoemotivo, embotado, hipomodulado, lábil, incongruente).
  6. *Pensamento — Curso, Forma e Conteúdo* (Velocidade do fluxo, coerência/fuga de ideias, delírios, ruminações, obsessões, ideação suicida).
  7. *Sensopercepção* (Ausência de alterações, alucinações auditivas, visuais, cinestésicas, ilusões).
  8. *Orientação* (Autopsíquica e Alopsíquica: temporal e espacial).
  9. *Atenção e Memória* (Normoprosexia vs. hipoprosexia; memória de fixação e evocação preservada vs. déficit).
  10. *Juízo Crítico / Julgamento da Realidade* (Preservado, parcialmente prejudicado, francamente prejudicado).
  11. *Insight / Consciência de Morbidade* (Presente/completo, parcial/ambivalente, ausente).
- **Mecanismos Semiologicamente Inteligentes:**
  - *Exclusões mútuas*: Marcar "Eutímico" remove automaticamente opções antagônicas como "Distímico" ou "Eufórico"; marcar "Cooperativo" anula opções de hostilidade.
  - *Sintetizador Narrativo*: Converte seleções discretas em texto semiológico corrido e formal, pronto para inserção no campo **Objetivo (O)** do prontuário.

### 3.3 Calculadoras Clínicas Especializadas

#### A) Calculadora de Transição Segura de Antidepressivos (Motor Maudsley / Hayasaka)
- **Equivalência Farmacológica:** Baseada na meta-análise de 83 ensaios clínicos randomizados (RCTs) com mais de 20.000 pacientes conduzida por *Hayasaka et al. (Lancet/JAD, 2015)*. Todas as doses são referenciadas na Fluoxetina 40 mg/dia como padrão internacional.
- **Protocolos de Troca Adaptativos:**
  - *Troca Direta:* Aplicável para doses baixas de fármacos da mesma classe com meias-vidas semelhantes.
  - *Troca Cruzada (Cross-Tapering):* Redução escalonada do fármaco de origem combinada à introdução proporcional do novo fármaco.
  - *Washout Mandatório:* Alerta automático de períodos sem medicação quando há risco de Síndrome Serotoninérgica fatal ou toxicidade hipertensiva (ex: **5 semanas obrigatórias** para transição de Fluoxetina para IMAO / Tranilcipromina; 14 dias para outros ISRS).
- **Desmame Hiperbólico (Horowitz & Taylor, Lancet Psychiatry 2019):**
  - Implementa o cálculo não-linear de descontinuação baseado na curva de ocupação do transportador de serotonina (SERT), mitigando os sintomas de retirada da Síndrome FINISH (*Flu-like symptoms, Insomnia, Nausea, Imbalance, Sensory disturbances, Hyperarousal*).
- **Matriz de Interações no Citocromo P450:**
  - Mapeamento de inibição potente, moderada ou fraca em CYP2D6, CYP1A2, CYP2C19 e CYP3A4, alertando sobre risco de toxicidade de fármacos concomitantes (antipsicóticos, betabloqueadores, varfarina, tramadol).

#### B) Calculadora de Equivalência de Antipsicóticos (CPZE)
- Conversão precisa de doses diárias para miligramas equivalentes de **Clorpromazina (CPZE)** para fármacos típicos e atípicos (Haloperidol, Risperidona, Olanzapina, Quetiapina, Aripiprazol, Levomepromazina).
- Alerta sobre doses subt terapêuticas ou excessivas com risco de sintomas extrapiramidais (SEP), discinesia tardia e síndrome neuroléptica maligna.

#### C) Função Renal (CKD-EPI 2021 Race-Free)
- Fórmula CKD-EPI 2021 sem ajuste por raça recomendada pela KDIGO e Sociedade Brasileira de Nefrologia.
- Alertas clínicos automáticos de ajuste posológico para Lítio, Pregabalina, Gabapentina e psicofármacos em idosos, alertando sobre contraindicação formal de Lítio na APS em TFG < 30 mL/min.

#### D) Calculadora de Risco Cardiovascular Global (SBC 2019/2021 & Framingham 2008)
- Algoritmo de D'Agostino et al. (Circulation, 2008) adaptado com as diretrizes de prevenção cardiovascular da Sociedade Brasileira de Cardiologia (SBC):
  - *Modo Lipídico:* Idade, sexo, PAS, tratamento anti-hipertensivo, tabagismo, diabetes, Colesterol Total e HDL.
  - *Modo IMC (APS sem laboratório imediato):* Substitui lipídios por Índice de Massa Corporal (peso/altura²), viabilizando estratificação na primeira consulta.
  - *Critérios de Risco Direto (Muito Alto e Alto Risco):* Doença aterosclerótica estabelecida (DAC, IAM prévio, AVC/AIT, DAP), aneurisma de aorta, DRC moderada/grave (TFG < 60), LDL ≥ 190 mg/dL ou DM de longa data.
  - *Reclassificadores de Risco da SBC:* Histórico familiar prematuro, síndrome metabólica, microalbuminúria e PCR-us.
  - *Interface Saúde Mental & Metabólica:* Alerta e calendário de rastreio de síndrome metabólica (Consenso ADA/APA) para pacientes em uso de antipsicóticos atípicos (Olanzapina, Quetiapina, Clozapina, Risperidona).

### 3.4 Modo de Autoaplicação pelo Paciente (Self-Fill / Kiosk / WhatsApp)
- Permite que o paciente preencha as escalas no celular ou em tablet no consultório/sala de espera via rota limpa (`?mode=patient&scale=id&p=Nome`).
- **Psicometria Neutra Rigorosa:** As alternativas de múltipla escolha **não exibem pontuações visíveis** (+0, +1, +2, +3 pts) nem boxes escuros predefinidos para evitar o viés de ancoragem ou indução de respostas pelo paciente.
- Exportação dos resultados preenchidos diretamente para a estação do médico.

---

## 4. Pontos Fortes e Diferenciais Competitivos Atuais

1. **Aderência aos Padrões Nacionais do SUS:** Uso de referências brasileiras oficiais (pontos de corte de escolaridade do MEEM de Brucki et al., validações do PHQ-9 e GAD-7 no Brasil, diretrizes da SBC e Ministério da Saúde).
2. **Navegação Não-Destrutiva com Deep-Linking:** Qualquer ferramenta pode ser acessada diretamente por URL canônica sem perda de estado da sessão do paciente em andamento.
3. **Ergonomia e Escaneabilidade Clínica:** Eliminação de ruído cognitivo, zero pop-ups intrusivos e feedback visual imediato de cópia para o clipboard do sistema operacional.
4. **Resiliência e Ausência de Dependências Pesadas:** Aplicação leve, veloz, capaz de rodar localmente ou em navegadores de computadores modestos de Unidades Básicas de Saúde.
5. **Auditoria Aberta e Transparência:** Todas as fórmulas e coeficientes estatísticos estão documentados e acessíveis na interface para escrutínio de bancas acadêmicas, conselhos de classe e auditoria clínica.

---

## 5. Limitações Atuais, Gargalos e Áreas de Expansão Identificadas

Para orientar a análise do **GPT Astra**, destacamos os seguintes desafios técnicos e clínicos identificados pela equipe:

1. **Interoperabilidade Limitada com o e-SUS APS (PEC):**
   - Atualmente, a transferência de dados para o Prontuário Eletrônico do Cidadão (PEC) ou sistemas municipais depende da ação de "Copiar e Colar" pelo médico.
   - Não há ainda integração nativa via API REST, mensageria FHIR (Fast Healthcare Interoperability Resources) ou barramento RNDS (Rede Nacional de Dados em Saúde).
2. **Farmacogenômica e Polifarmácia em Idosos:**
   - Embora o motor calcule o citocromo P450 para antidepressivos, ainda não há uma ferramenta integrada para aplicar os **Critérios de Beers (AGS 2023)** ou **Critérios STOPP/START** para rastreio de medicamentos potencialmente inapropriados para idosos (MPI).
3. **Matriciamento e Linhas de Cuidado na APS:**
   - Falta de um módulo de suporte para decisões de encaminhamento regulado (quando manter na APS com apoio matricial vs. encaminhar para CAPS I/II/III, CAPS AD, CAPS i ou ambulatório de especialidades focais).
4. **Calculadoras Adicionais de Alta Frequência na APS:**
   - Ausência de calculadoras cardiovasculares/metabólicas complementares cruciais:
     - *FINDRISC* (Escore de risco de diabetes tipo 2 em 10 anos da OMS/SBD).
     - *CHA2DS2-VASc* e *HAS-BLED* (estratificação de risco tromboembólico e hemorrágico em fibrilação atrial).
     - *FRAX Brasil* (risco de fratura osteoporótica).
     - *FIB-4* e *APRI* (estratificação de fibrose hepática em esteatose e hepatites).
5. **Acessibilidade e Modo PWA (Progressive Web App) Offline:**
   - Muitas equipes de Saúde da Família realizam visitas domiciliares em áreas rurais ou de difícil cobertura sem sinal de internet móvel. A aplicação ainda requer aprimoramento na política de cache de Service Worker para operação 100% offline em tablets de agentes comunitários e médicos.
6. **Integração Ética e Segura de LLMs (IA Generativa):**
   - Como incorporar modelos de linguagem avançados (Gemini / GPT) para auxiliar na síntese de casos complexos, confecção de laudos/atestados para o INSS e tradução de condutas para linguagem acessível do paciente (letramento em saúde), **sem violar a LGPD, o sigilo médico e sem introduzir alucinações diagnósticas**?

---

## 6. Roteiro de Perguntas e Desafios Estratégicos para o GPT Astra

Ao submeter este documento ao **GPT Astra**, utilize o seguinte roteiro de provocações e solicitações:

### Bloco A: Clínica e Medicina Baseada em Evidências (MBE)
1. **Auditoria de Escalas e Pontos de Corte:**
   - Há algum ponto de corte, instrumento ou diretriz mais recente (pós-2023/2024) para as escalas implementadas (ex.: novas diretrizes da APA para depressão ou novas recomendações da OMS para rastreamento de demências na APS que superem o MEEM puro, como o MoCA ou o Mini-Cog)?
2. **Expansão do Motor de Desmame e Psicofarmacologia:**
   - Como podemos expandir a calculadora de transição para incluir:
     - Transições complexas envolvendo estabilizadores de humor (Lítio, Valproato, Lamotrigina)?
     - Protocolos de desmame e substituição gradual de benzodiazepínicos (Escala de Ashton / diazepam equivalente) para combater a dependência crônica em idosos na APS?
     - Ajustes farmacocinéticos específicos para insuficiência hepática (Child-Pugh)?
3. **Novas Ferramentas e Calculadoras Prioritárias:**
   - Quais 3 calculadoras clínicas determinísticas você considera mais urgentes e com maior retorno de segurança e tempo para um médico de família brasileiro? Por favor, forneça o algoritmo conceitual e os pontos de corte validados.

### Bloco B: Ergonomia Cognitiva e Design de Interação (UX/UI Clínico)
1. **Otimização do Fluxo de Consulta de 15 Minutos:**
   - Analisando a estrutura atual (EEM + SOAP + Calculadoras), como podemos reduzir em 30% o tempo total de preenchimento do prontuário sem perder a qualidade semiológica e a soberania da narrativa do paciente?
2. **Visualização Longitudinal e Adesão Terapêutica:**
   - Como melhorar a apresentação dos gráficos de evolução (Recharts) para que o médico possa, com um único olhar, demonstrar visualmente para o paciente a melhora percentual dos sintomas (reforço positivo e clínica centrada na pessoa)?

### Bloco C: Arquitetura, Engenharia e Interoperabilidade
1. **Estratégia de Integração e-SUS PEC:**
   - Qual é a arquitetura mais viável e menos burocrática para permitir que o Nexus Clínico envie registros SOAP e escores diretamente para instâncias do e-SUS PEC municipal? Devemos adotar exportação JSON em esquema FHIR padrão RNDS ou extensão de navegador (Chrome Extension) que injeta dados nos formulários do PEC?
2. **Implementação PWA Offline-First:**
   - Quais as melhores práticas para tornar o Nexus Clínico um PWA offline de classe de produção com sincronização assíncrona IndexedDB, permitindo o uso em visitas domiciliares rurais?

### Bloco D: Inteligência Artificial Segura (Outside the Critical Loop)
1. **Arquitetura de "IA Copiloto Ético":**
   - Proponha uma arquitetura de prompt e payload para que uma LLM (como o Gemini ou GPT-4o) atue estritamente como um assistente de pós-consulta:
     - Traduzindo o plano médico (P) em um "Guia de Cuidados em Linguagem Leiga" para o paciente levar para casa (ou enviar no WhatsApp com linguagem simples e ilustrações).
     - Gerando minutas de encaminhamento para o CAPS ou laudos circunstanciados para perícia médica do INSS baseados exclusivamente nos dados estruturados do SOAP e das escalas preenchidas.

---

## 7. Instruções para o GPT Astra

*Caro GPT Astra,*

Você está atuando como **Chief Clinical Information Officer (CCIO) e Arquiteto de Software Especialista em Sistemas de Suporte à Decisão Clínica (CDSS)**.

Com base neste dossiê minucioso do **Nexus Clínico**:
1. Faça uma avaliação crítica dos pontos fortes e vulnerabilidades do sistema;
2. Responda detalhadamente aos blocos de desafios estratégicos da Seção 6;
3. Estruture suas recomendações em três horizontes temporais:
   - **Horizonte 1 (Imediato / Quick Wins):** Melhorias que podem ser codificadas diretamente em TypeScript/React no frontend em menos de 1 semana.
   - **Horizonte 2 (Médio Prazo):** Novos módulos, calculadoras complexas e aprimoramento de fluxos de trabalho.
   - **Horizonte 3 (Longo Prazo / Visão de Futuro):** Interoperabilidade FHIR/e-SUS, modo PWA offline nativo e agentes de IA supervisionados.
