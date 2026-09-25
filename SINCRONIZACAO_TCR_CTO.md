# 📋 NEXUS CLÍNICO — RELATÓRIO TÉCNICO E CLÍNICO DE SINCRONIZAÇÃO (TCR, ROTEIRO E ARQUITETURA)
**Data:** 31 de Agosto de 2026  
**Destinatário:** Equipe de Desenvolvimento, CTO (ChatGPT Work) & Coordenação Acadêmica / Banca de TCR  
**Projeto:** **Nexus Clínico** — Sistema Especialista de Suporte à Decisão Clínica e Registros Estruturados para a Atenção Primária à Saúde (APS) e Medicina de Família e Comunidade (MFC).

---

## 1. Sumário Executivo das Mudanças Recentes

O Nexus Clínico passou por um refinamento arquitetural e clínico significativo, alinhando a interface e o motor determinístico aos preceitos rigorosos da ergonomia cognitiva para consultas de 15 a 20 minutos na APS, Medicina Baseada em Evidências (MBE) e diretrizes nacionais/internacionais.

### Principais Ações Implementadas:
1. **Remoção do Rascunho Assistido e Marcadores do Subjetivo:**
   - O prontuário clínico SOAP foi limpo de geradores automáticos de anamnese ou "marcadores subjetivos" que pudessem induzir rascunhos artificiais ou viés de registro.
   - O campo **S (Subjetivo)** permanece livre e soberano para a escuta qualificada do médico e a narrativa autêntica do paciente (Clínica Centrada na Pessoa).
   - O sistema agora foca sua automação inteligente onde ela é metodologicamente segura: **Objetivo (O)** (dados estruturados do EEM, escores de escalas e calculadora de risco CV), **Avaliação (A)** (estratificação de gravidade e pontos de corte MBE) e **Plano (P)** (intervenções de educação em saúde editáveis, plano de segurança e estratégias farmacológicas de troca e desmame).

2. **Reestruturação e Agrupamento das 7 Dimensões do MEEM (Mini-Exame do Estado Mental):**
   - Substituição da saída crua e ilegível de itens isolados por um agrupamento semiológico rigoroso nas 7 dimensões oficiais:
     1. *Orientação Temporal* (0-5 pts)
     2. *Orientação Espacial* (0-5 pts)
     3. *Memória Imediata / Registro* (0-3 pts)
     4. *Atenção e Cálculo* (0-5 pts)
     5. *Evocação Tardia* (0-3 pts)
     6. *Linguagem* (0-8 pts)
     7. *Praxia Construtiva* (0-1 pt)
   - Eliminação de frases prolixas ou diagnósticas no gráfico longitudinal do MEEM, focando no delta real de **Variação Cognitiva** (ganho/estabilidade vs. declínio em pontos/ano) e nos pontos de corte brasileiros por 5 faixas de escolaridade (Brucki et al., 2003 / TelessaúdeRS).

3. **Semiologia Psiquiátrica e Exame do Estado Mental (EEM) Rigoroso:**
   - Separação mandatória entre **Orientação** (Autopsíquica e Alopsíquica: Tempo/Espaço) e **Atenção/Memória** (Normoprosexia, Hipoprosexia, Hiperprosexia, Memória de Fixação e Evocação).
   - Baseado nas obras seminais de *Paulo Dalgalarrondo*, *Kaplan & Sadock* e diretrizes do *StatPearls/NCBI*.

4. **Motor de Educação em Saúde Contextual (APS/MBE):**
   - Integração cruzada determinística entre resultados de escalas e achados estruturados do EEM gerando sugestões de estilo de vida, sono, respiração diafragmática, higiene do sono e ativação comportamental, sempre com checagem de segurança (Red Flags / Ideação Suicida com prioridade imediata sobre psicoeducação).

5. **Calculadora de Transição Segura de Antidepressivos & Monitoramento Metabólico:**
   - Doses equivalentes baseadas na meta-análise de ensaios clínicos de *Hayasaka et al. (2015)* (Fluoxetina 40 mg/d como padrão de eficácia).
   - Protocolos de troca cruzada (*cross-tapering*), troca direta e períodos de *washout* obrigatórios (Maudsley Guidelines, 2021).
   - Desmame hiperbólico de ISRS e monitoramento da Síndrome FINISH (*Horowitz & Taylor, Lancet Psychiatry, 2019*).
   - Calendário de monitoramento metabólico em uso de psicofármacos (ADA/APA Consensus) e calculadora de Risco Cardiovascular Global em 10 anos (SBC 2019/2021 & Framingham 2008).

---

## 2. Matriz de Referências Bibliográficas Atualizada (Para o TCR e Apresentação)

Todas as ferramentas determinísticas do sistema estão ancoradas na literatura científica indexada e diretrizes oficiais do SUS:

| Domínio / Ferramenta | Título / Fonte da Evidência | Autores / Ano | Aplicação no Nexus Clínico |
| :--- | :--- | :--- | :--- |
| **Cognição (MEEM)** | *Sugestões para o uso do Mini-Exame do Estado Mental no Brasil* (Arq Neuropsiquiatr) / Diretrizes TelessaúdeRS | Brucki SMD, Nitrini R, Caramelli P, Bertolucci PH, Okamoto IH (2003); Folstein MF (1975) | Pontos de corte estratificados por 5 faixas de escolaridade (20, 25, 26.5, 28 e 29 pts) e agrupamento nas 7 dimensões semiológicas. |
| **Depressão (PHQ-9)** | *The PHQ-9: Validity of a Brief Depression Severity Measure* & Validação Brasileira na APS | Kroenke K, Spitzer RL (2001); Osório FL et al. (2009); Santos IS et al. (2013) | Rastreio e estratificação de gravidade (0-27 pts); alarme mandatório no item 9 para ideação de morte/suicídio. |
| **Ansiedade (GAD-7)** | *A Brief Measure for Assessing Generalized Anxiety Disorder* & Validação Brasileira | Spitzer RL, Kroenke K (2006); Moreno AL et al. (2016) | Rastreio e monitoramento longitudinal de resposta terapêutica em transtornos de ansiedade na APS. |
| **Transtorno Bipolar (HCL-32)** | *Validation and reliability of the Portuguese version of the Hypomania Checklist-32 (HCL-32)* | Soares OT, Moreno RA, Moura EC, Angst J (2010); Angst J (2005) | Ponto de corte nacional (≥18 pts) e estrutura bifatorial (Ativação vs. Risco/Irritabilidade) para evitar viragem maníaca. |
| **Uso de Substâncias (AUDIT)** | *The Alcohol Use Disorders Identification Test: Guidelines for Use in Primary Care* | OMS / Babor TF et al. (2001); Mendez EB (1999); Moretti-Pires (2011) | Rastreio de consumo de risco (corte ≥8 pts para Intervenção Breve) e dependência grave (≥20 pts). |
| **TDAH Adulto (ASRS-18)** | *Adult ADHD Self-Report Scale (ASRS-v1.1) da OMS* & Adaptação Brasileira | Kessler RC et al. (2005); Mattos P, Segenreich D et al. (2006) | Triagem de desatenção e hiperatividade/impulsividade em adultos na APS. |
| **TDAH Infantil (SNAP-IV)** | *Swanson, Nolan, and Pelham Rating Scale (SNAP-IV)* & Validação Brasileira | Swanson JM (2001); Mattos P, Rohde LA et al. (2006) | Avaliação pareada (pais e educadores) de sintomas em múltiplos ambientes. |
| **Prevenção do Suicídio (C-SSRS)** | *The Columbia-Suicide Severity Rating Scale: Initial Validity Findings* | Posner K, Brown GK, Stanley B (2011); Diretrizes ABP (2022) | Estratificação em Baixo, Moderado e Alto Risco, disparando criação do Plano de Segurança e remoção de meios. |
| **Equivalência de Antidepressivos** | *Dose equivalents of antidepressants: evidence-based recommendations from randomized controlled trials* | Hayasaka Y, Purgato M, Magni LR et al. *J Affect Disord* (2015) | Matriz matemática de conversão de doses baseada em 83 RCTs (>20.000 pacientes), referenciada em Fluoxetina 40 mg/d. |
| **Protocolos de Troca de Fármacos** | *The Maudsley Prescribing Guidelines in Psychiatry (14th Edition)* | Taylor D, Barnes TRE, Young AH. Wiley-Blackwell (2021) | Algoritmos de troca direta, troca cruzada com desmame proporcional e períodos de *washout* (14d a 5 semanas para IMAO). |
| **Desmame e Sintomas de Retirada** | *Tapering of SSRI treatment to mitigate withdrawal symptoms* (*Lancet Psychiatry*) | Horowitz MA, Taylor D (2019) | Curva hiperbólica de ocupação do SERT, desmame microescalonado e monitoramento do mnemônico FINISH. |
| **Risco Cardiovascular Global** | *Atualização da Diretriz de Prevenção Cardiovascular da SBC* (2019/2021) & Framingham Global Score | Précoma DB, Oliveira GMM et al. (SBC, 2019); D'Agostino RB et al. (Circulation, 2008) | Estimativa de risco em 10 anos, metas de LDL por estrato (<50, <70, <100, <130 mg/dL) e indicação de estatinas potentes. |
| **Monitoramento Metabólico em Psicofármacos** | *Consensus Development Conference on Antipsychotic Drugs and Obesity and Diabetes* | ADA / APA (Diabetes Care, 2004-2020) | Calendário de rastreio metabólico (Peso/IMC, PA, Glicemia, Lipídios) para antipsicóticos atípicos e estabilizadores. |
| **Semiologia Psiquiátrica (EEM)** | *Psicopatologia e Semiologia dos Transtornos Mentais* (3ª Edição) & *Compêndio de Psiquiatria* | Dalgalarrondo P (Artmed, 2019); Sadock BJ, Sadock VA, Ruiz P (Kaplan & Sadock, 2017-2022); StatPearls (NCBI, 2023) | Distinção entre orientação autopsíquica/alopsíquica e atenção/memória, afeto vs humor, e tripartição do pensamento. |
| **Organização da APS e MFC no SUS** | *Caderno de Atenção Básica nº 34: Saúde Mental* & *Tratado de MFC* (2ª Edição) | Ministério da Saúde Brasil (2013); Gusso G, Lopes JMC (SBMFC, 2019); WHO mhGAP (2019) | Matriciamento territorial, acolhimento, PTS, uso racional de psicofármacos e combate à hipermedicalização. |

---

## 3. Roteiro Sugerido para Apresentação do TCR (Slide a Slide)

### **Slide 1: Título e Identidade**
- **Título:** Nexus Clínico: Sistema Inteligente de Suporte à Decisão Clínica e Registros Estruturados para a Atenção Primária à Saúde.
- **Foco:** Redução da carga cognitiva do médico de família e melhoria da segurança do paciente na consulta de 20 minutos.

### **Slide 2: O Problema na APS**
- Tempo restrito de consulta (15-20 min) vs. alta complexidade biopsicossocial.
- Subnotificação de ideação suicida, subdiagnóstico de transtorno bipolar (viragem maníaca por antidepressivos) e trocas farmacológicas empíricas com síndrome de descontinuação (FINISH).
- Sobrecarga de telas e prontuários eletrônicos com excesso de cliques e poluição visual ("AI Slop" e fadiga de alertas).

### **Slide 3: A Proposta de Valor do Nexus Clínico**
- Interface orientada à ergonomia cognitiva: fundo gelo (`bg-slate-50`), superfícies brancas com contraste AA/AAA e escaneabilidade em menos de 3 segundos.
- **Transparência e Determinismo**: Sem "alucinações" de IA generativa em condutas clínicas críticas — todos os algoritmos são baseados em matrizes de evidência (Maudsley, Hayasaka, SBC, TelessaúdeRS).
- Preservação da narrativa clínica: Subjetivo (S) soberano e livre; Objetivo (O) e Plano (P) estruturados com exportação em 1 clique para prontuários do SUS (e-SUS PEC, MV, Tasy, etc.).

### **Slide 4: Demonstração Funcional — Escalas Clínicas e o MEEM Reestruturado**
- Demonstração do MEEM: pontuação por 5 faixas de escolaridade (norma brasileira) e discriminação analítica nas 7 dimensões cognitivas.
- Triagem com PHQ-9 e alarme visual de urgência quando há ideação suicida (item 9 > 0) disparando o C-SSRS e o Plano de Segurança.
- Acompanhamento longitudinal com visualização gráfica (Radar e Tendência Temporal) mensurando a resposta clínica real (≥ 50% de redução).

### **Slide 5: Demonstração Funcional — Psicofarmacologia e Troca de Antidepressivos**
- Calculadora de conversão com doses equivalentes por RCTs (Hayasaka et al., 2015).
- Cronograma automatizado de troca cruzada (*cross-tapering*) e desmame hiperbólico (Horowitz & Taylor, 2019).
- Checagem cruzada de interações no citocromo P450 (CYP2D6, CYP1A2) e risco de Síndrome Serotoninérgica / Washout de IMAO.

### **Slide 6: Demonstração Funcional — Saúde Integral e Risco Cardiovascular**
- Integração da saúde mental com a saúde metabólica e cardiovascular.
- Escore de Risco Global SBC/Framingham integrado ao calendário de monitoramento metabólico em uso de psicofármacos (ADA/APA).

### **Slide 7: Resultados, Validação e Conclusão**
- Feedback de usabilidade: agilidade no preenchimento do SOAP estruturado, redução de erros de dosagem em transições farmacológicas e rastreio seguro de ideação e cognição.
- Próximos passos: integração nativa via interoperabilidade FHIR/OpenEHR com o e-SUS APS.

---

## 4. Orientações para o CTO (ChatGPT Work)

- **Arquitetura Frontend:** React 18+, TypeScript Estrito, Tailwind CSS, Lucide Icons.
- **Navegação Semântica & Deep-Linking (Fase 1 de Acessibilidade para Agentes):**
  - Rotas canônicas ativas e sincronizadas via History API (`/`, `/escalas/:id`, `/calculadoras/:id`, `/eem`, `/soap`), com fallback estático no `index.html` para rastreadores e agentes de recuperação textual.
  - Elementos interativos convertidos para links `<a href="...">` e botões semânticos com atributos ARIA completos (`aria-label`, `aria-selected`, `aria-pressed`, `role="tab"`).
  - Preservação total da experiência do usuário, design, velocidade SPA e lógica clínica determinística sem necessidade de SSR invasivo.
- **Garantia de Estado e Resiliência:** Todas as propriedades de arrays (como itens do EEM, histórico longitudinal de escalas e interações CYP) possuem checagens defensivas (`Array.isArray`, optional chaining `?.`, fallbacks vazios) para evitar `TypeError` em tempo de execução.
- **Single Source of Truth:** O arquivo `/src/data/evidenceData.ts` é a fonte canônica para todas as citações, fontes bibliográficas e pontos-chave exibidos na modal de evidências (`AboutModal.tsx`) e na documentação acadêmica.
- **Ausência de IA Generativa no Loop Crítico:** O motor de decisão é 100% determinístico e auditável via código-fonte, em conformidade com as normas éticas do CFM e da LGPD para suporte à decisão médica.
