# 🏥 NEXUS CLÍNICO — RELATÓRIO OFICIAL DE AUDITORIA TÉCNICA, CLÍNICA E ARQUITETURAL PRÉ-IMPLEMENTAÇÃO

**Documento:** Relatório de Auditoria Independente de Segurança de Software Médico e CDSS  
**Sistema:** Nexus Clínico (Atenção Primária à Saúde & Ambulatório de Medicina de Família e Comunidade)  
**Versão Auditada:** v2.4 (Branch de Trabalho / Build Especialista)  
**Papeis Desempenhados:** Chief Clinical Information Officer (CCIO), Arquiteto Sênior de Software Clínico, Engenheiro de Software Full-Stack TypeScript/React, Especialista em Segurança de CDSS (Clinical Decision Support Systems)  
**Status da Auditoria:** Concluída com Diagnóstico Integral — **Nenhum arquivo de código foi alterado nesta etapa**, conforme regra mandatória.  
**Data:** Setembro de 2026  

---

## 1. SUMÁRIO EXECUTIVO

O **Nexus Clínico** é uma plataforma de suporte à decisão clínica (CDSS) e documentação estruturada (SOAP/EEM), concebida especificamente para a Atenção Primária à Saúde (APS) e Medicina de Família e Comunidade (MFC) no contexto do SUS e saúde suplementar.

A presente auditoria foi conduzida através de análise estática do código-fonte integral (`/src`, `/server.ts`, `/package.json`, configurações e modelos de dados), simulações de fluxo de controle, inspeção de regras psicométricas e farmacológicas, e checagem de conformidade com o Dossiê Técnico v2.4.

### 1.1 Diagnóstico Global
O sistema apresenta maturidade notável em ergonomia clínica de interface (fundo em gelo `bg-slate-50`, tipografia balanceada, tempo de escaneabilidade inferior a 3 segundos), sólida estruturação de tipos TypeScript e uma modelagem psicofarmacológica sofisticada no motor Maudsley/Hayasaka.

Contudo, foram identificadas **vulnerabilidades críticas de segurança clínica e inconsistências lógicas** que impedem sua liberação imediata sem mitigações prévias:
1. **Comportamento Inseguro em Preenchimento Parcial de Escalas:** Diversos instrumentos (notadamente PHQ-9, GAD-7, MEEM e AUDIT) computam o escore somando apenas as chaves presentes em `answers`. Se um médico ou paciente responder apenas 2 de 9 questões do PHQ-9 com nota 1, o sistema soma 2 pontos e emite a classificação *"Sintomas depressivos mínimos ou ausentes"*, gerando um **falso-negativo grave** em preenchimento incompleto.
2. **Classificação Determinística Rígida de Risco Suicida no C-SSRS:** O algoritmo atribui categorias automáticas nominais (*"Risco Baixo"*, *"Risco Moderado"*, *"Risco Alto / Emergência"*) com base estrita no maior valor do item assinalado, acoplando condutas mandatórias de encaminhamento sem a devida mediação da avaliação clínica presencial, fatores protetores e intencionalidade.
3. **Inversão Semântica na Variação Percentual dos Gráficos Longitudinais:** Em `EvolutionChartsView.tsx` (linha 210), quando a variação é positiva (ex: piora de sintomas de 10 para 15 pontos, +50%), o texto exportado para o prontuário registra erroneamente: `+50% de redução de sintomas`.
4. **Descompasso Farmacológico entre Módulos:** Há duas implementações divergentes de equivalência de antidepressivos: uma tabela estática e linear em `src/utils/calculators.ts` e um motor robusto ancorado na meta-análise de Hayasaka et al. (2015) em `src/utils/antidepressantSwitching.ts`.
5. **Cálculo Linear Desprovido de Teto Toxicológico em CPZE:** A equivalência em Clorpromazina (`calculateAntipsychoticEquivalence`) aplica multiplicadores lineares diretos, sem travas para doses supra-terapêuticas ou alertas de toxicidade extrapiramidal e síndrome neuroléptica maligna.
6. **Injeção Silenciosa de Dados Sintéticos de Tendência:** Na ausência de histórico do paciente, o componente `EvolutionChartsView.tsx` renderiza uma curva fictícia de 5 consultas sem um aviso persistente inequívoco, criando risco de o profissional confundir o preview com o histórico real do paciente.

---

## 2. INVENTÁRIO REAL DA APLICAÇÃO

### 2.1 Dependências Efetivamente Instaladas (`package.json`)
A inspeção do `package.json` revela o seguinte ecossistema tecnológico:

| Dependência | Versão Efetiva | Função no Sistema | Status / Avaliação |
| :--- | :--- | :--- | :--- |
| **react** | `^19.0.1` | Biblioteca de UI central | Moderno, suporta Actions e transições |
| **react-dom** | `^19.0.1` | Renderizador DOM | Alinhado ao React 19 |
| **vite** | `^6.2.3` | Bundler e Dev Server | Vite 6 (Dossiê v2.4 citava Vite 5) |
| **express** | `^4.21.2` | Servidor backend intermediário | Roteamento de API e proxy SSR |
| **@google/genai** | `^2.4.0` | SDK Gemini API | Server-side Gemini 3.6 Flash |
| **recharts** | `^3.10.1` | Gráficos e visualizações | Tendência longitudinal e radar |
| **zod** | `^4.4.3` | Validação de esquemas runtime | Utilizado para validar rascunhos SOAP |
| **lucide-react** | `^0.546.0` | Biblioteca de ícones vetoriais | Ícones consistentes com semiótica médica |
| **motion** | `^12.23.24` | Animações de transição | Framer Motion migrado para Motion v12 |
| **tailwindcss** | `^4.1.14` | Framework CSS utilitário | Tailwind v4 com `@tailwindcss/vite` |
| **tsx** | `^4.21.0` | Executor TypeScript para Node | Executa `server.ts` sem build prévia |
| **typescript** | `~5.8.2` | Compilador TypeScript | Modo estrito configurado |

### 2.2 Estrutura Real de Diretórios e Arquivos
- **Raiz (`/`):** `server.ts`, `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `metadata.json`, `AGENTS.md`, `GEMINI.md`, `NEXUS_CLINICO_DOSSIE_PROJETO_GPT_ASTRA.md`, `SINCRONIZACAO_TCR_CTO.md`.
- **`/src/components` (19 componentes):**
  - `App.tsx` (Orquestrador global de estado e roteamento)
  - `Header.tsx`, `Sidebar.tsx`, `Footer.tsx` (Navegação estrutural)
  - `DashboardView.tsx` (Visão geral e atalhos da consulta)
  - `ScalesView.tsx` (Hub psicométrico com 21 escalas)
  - `EemView.tsx` (Visualizador semiológico do EEM em 11 domínios)
  - `EemSoapWorkstationView.tsx` (Estação clínica integrada EEM + SOAP)
  - `SoapView.tsx` (Visualizador isolado do Prontuário SOAP)
  - `CalculatorsView.tsx` (Hub de calculadoras clínicas e metabólicas)
  - `AntidepressantSwitchCalculator.tsx` (Motor de troca e desmame de antidepressivos)
  - `EvolutionChartsView.tsx` (Gráficos Recharts de linha/área e radar)
  - `PatientSelfFillModal.tsx` (Modo quiosque/autoaplicação pelo paciente)
  - `ContextualEducationModal.tsx` (Sugestor de materiais de psicoeducação)
  - `AboutModal.tsx`, `SourceCodeModal.tsx`, `WhatsappShareModal.tsx` (Modais utilitários)
  - `NexusLogo.tsx`, `ErrorBoundary.tsx` (Resiliência e branding clínico)
- **`/src/data` (7 módulos de dados):**
  - `scalesData.ts` (11 escalas primárias com questões, gabaritos e condutas)
  - `additionalScalesData.ts` (10 escalas complementares especializadas)
  - `eemData.ts` (Taxonomia semiológica do Exame do Estado Mental)
  - `evidenceData.ts` (Bases bibliográficas indexadas e governança)
  - `radarDomainsData.ts` (Mapeamentos multidimensionais para radar)
  - `educationData.ts` (Textos estruturados de educação em saúde para APS)
  - `demoPatientData.ts` (Dados sintéticos de paciente demonstrativo)
- **`/src/utils` (5 bibliotecas utilitárias):**
  - `antidepressantSwitching.ts` (Modelagem farmacocinética, Hayasaka, CYP450, Horowitz)
  - `calculators.ts` (CKD-EPI 2021, Risco Cardiovascular SBC/Framingham, CPZE)
  - `eemFormatter.ts` (Sintetizador narrativo sequencial do EEM)
  - `healthEducationEngine.ts` (Motor determinístico de sugestão educativa)
  - `navigation.ts` (Sincronização com History API nativa e deep-linking)

### 2.3 Comparativo entre Dossiê v2.4 e Código Real

| Módulo / Funcionalidade | Estado Declarado no Dossiê v2.4 | Estado Efetivo no Código | Classificação |
| :--- | :--- | :--- | :--- |
| **Hub de Escalas (21 escalas)** | 21 escalas implementadas e integradas | 21 escalas operacionais com gabarito | **Implementada e verificada** |
| **Motor de Troca Maudsley** | Equivalência Hayasaka, washout, CYP450 | Presente em `antidepressantSwitching.ts` | **Implementada e verificada** |
| **Estação EEM + SOAP** | Fluxo integrado sem duplicação de dados | Operacional em `EemSoapWorkstationView.tsx` | **Implementada e verificada** |
| **Sintetizador Sequencial EEM** | Uma dimensão abaixo da outra no SOAP | Centralizado via `eemFormatter.ts` | **Implementada e verificada** |
| **CKD-EPI 2021 race-free** | Equação 2021 sem ajuste racial | Implementada fielmente em `calculators.ts` | **Implementada e verificada** |
| **Risco Cardiovascular SBC** | Framingham + SBC 2019/2021 + Reclassif. | Implementada com interface metabólica | **Implementada e verificada** |
| **Gráficos Recharts (Linha/Radar)** | Gráficos longitudinais e radar de domínios | Operacionais em `EvolutionChartsView.tsx` | **Implementada com inconsistências** |
| **Validação de Incompletos** | Bloqueio de escore em questões pendentes | Inexistente (soma chaves presentes) | **Não implementada** |
| **Interoperabilidade e-SUS / RNDS** | Integração com e-SUS PEC e barramento RNDS | Ausente no código (apenas texto de dossiê) | **Declarada, não identificada** |
| **Modelagem FHIR / OpenEHR** | Arquétipos clínicos interoperáveis | Ausente no código (apenas meta estratégica) | **Declarada, não identificada** |
| **Persistência de Dados / BD** | Client-side first sem envio externo | Estado 100% volátil em memória RAM | **Implementada e verificada** |
| **Autenticação e Perfis (RBAC)** | Login médico e auditoria de prontuário | Não implementado | **Não implementada** |

---

## 3. ARQUITETURA ATUAL E FLUXO DE DADOS

### 3.1 Roteamento e Deep-Linking
- O aplicativo não utiliza `react-router-dom`. A navegação é operada diretamente pela **History API nativa do navegador** através de utilitários em `src/utils/navigation.ts` (`parseCurrentLocation`, `updateBrowserHistory`).
- O estado de visão ativa (`currentView`) e identificadores de contexto (`activeScaleId`, `activeCalculatorId`) são sincronizados com o histórico do browser, suportando URLs amigáveis:
  - `/` ou `/dashboard` -> Painel Panorâmico
  - `/estacao-clinica` -> Estação Integrada EEM + SOAP
  - `/escalas/:id` -> Instrumento psicométrico específico
  - `/calculadoras/:id` -> Calculadora clínica específica
  - `/eem` e `/soap` -> Visualizadores dedicados
  - `/evolucao` -> Gráficos longitudinais
- **Pontos de Fragilidade:** A navegação baseada em parsing de string puro requer sincronização manual de eventos `popstate`. Transições rápidas entre módulos preservam o estado global em `App.tsx`, porém abas abertas em paralelo não compartilham estado.

### 3.2 Gerenciamento do Estado Global da Consulta
Todo o estado reside na memória do componente raiz `src/App.tsx`:
1. `patientSession`: Dados cadastrais básicos (nome, idade, sexo, CPF/CNS sintético, diagnóstico sindrômico).
2. `soapState`: Objeto `{ subjective, objective, assessment, plan }`.
3. `eemState`: Objeto mapeando chaves de domínios semiológicos para listas de termos selecionados.
4. `scaleResults`: Histórico em memória dos instrumentos preenchidos na sessão.
5. `scaleHistory`: Histórico longitudinal (inicializado a partir de `DEMO_SCALE_HISTORY` de `demoPatientData.ts`).

### 3.3 Fluxo de Dados e Integração SOAP
```text
[Interação Clínica / Usuário]
         │
         ├──► Preenchimento de Escala (ScalesView) ──► calculateResult() ──► handleImportToSoap() ──┐
         │                                                                                         │
         ├──► Exame do Estado Mental (EemView/Workstation) ──► generateEemSummary() ───────────────┼──► SOAP State
         │                                                                                         │   (App.tsx)
         ├──► Calculadoras Médicas (CalculatorsView) ──► CalculatorResult.soapText ────────────────┤      │
         │                                                                                                ▼
         └──► Edição Livre do Médico (S, O, A, P) ──────────────────────────────────────────────────► Prontuário Final
```

- **Injeção no Campo O (Objetivo):** Resultados de escalas, EEM e calculadoras são concatenados no bloco `soapState.objective` através de separadores de linha duplos (`\n\n`), preservando títulos e fontes científicas.
- **Injeção no Campo A (Avaliação) e P (Plano):** Condutas de apoio (ex: plano de segurança C-SSRS, metas de desmame) oferecem botão para inserção direcionada nos quadrantes correspondentes.
- **Risco de Duplicação e Sobrescrita:**
  - O campo **S (Subjetivo)** é editável na `EemSoapWorkstationView` e também na `SoapView`. Como ambas atualizam `soapState.subjective` via props de `App.tsx`, há sincronização básica, mas não há bloqueio de concorrência ou versionamento de rascunhos.
  - O endpoint `/api/ai/soap-draft` em `server.ts` devolve um rascunho de 4 quadrantes. Se o usuário confirmar a importação, o conteúdo do Subjetivo pode ser substituído por texto sintético, violando a soberania da narrativa do paciente.

---

## 4. MATRIZ DE AUDITORIA DOS INSTRUMENTOS CLÍNICOS

| Instrumento | Itens | Regra de Pontuação & Valores | Pontos de Corte Oficiais | População & Validação | Falha Crítica Identificada no Código |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PHQ-9** | 9 | Soma simples de 0 a 3 por item (Total: 0 a 27). | 0-4 Mínimo, 5-9 Leve, 10-14 Moderado, 15-19 Mod. Grave, 20-27 Grave. Corte ≥ 10. | Adultos na APS. Validado no Brasil (Osório 2009, Santos 2013). | **Computa escore com questões em branco.** Resposta positiva no item 9 alerta C-SSRS, mas não impede emissão de escore global "leve" se o restante não for respondido. |
| **GAD-7** | 7 | Soma simples de 0 a 3 por item (Total: 0 a 21). | 0-4 Mínimo, 5-9 Leve, 10-14 Moderado, 15-21 Grave. Corte ≥ 10 para TAG. | Adultos na APS. Validado no Brasil (Moreno 2016). | **Soma incompleta permitida.** Não exige que todos os 7 itens estejam respondidos antes de emitir diagnóstico presuntivo. |
| **C-SSRS (Columbia)** | 6 | Mapeamento hierárquico (0 a 5). Pega o `Math.max(q1..q6)`. | 0 Sem ideação, 1-2 Baixo, 3 Moderado, 4-5 Alto Risco / Emergência. | APS / Saúde Mental. Posner et al. (2011). | **Classificação determinística cega.** O código rotula automaticamente "Risco Alto / Emergência" sem contextualizar intencionalidade ou fatores de proteção. |
| **MEEM (Folstein)** | 19 tarefas (30 pts) | Soma pontual em 7 domínios (0 a 30). | Brucki (2003): Analfabeto: 20; 1-4a: 25; 5-8a: 26,5; 9-11a: 28; >11a: 29. | Idosos e suspeita de declínio cognitivo na APS. | **Não solicita anos de escolaridade.** Exibe os 5 cortes no texto, mas classifica como "Preservado" se total ≥ 27, ignorando que para >11 anos o corte é 29. |
| **HCL-32** | 32 | Sim (1) / Não (0). Subescalas: Ativação e Risco. | Corte Internacional: ≥ 14. Corte Brasileiro Validado (USP/Soares 2010): ≥ 18. | Adultos com depressão recorrente na APS. | **Risco de sobrediagnóstico.** O código sinaliza "Traços Moderados" entre 14-17 sem reforçar que o corte validado no Brasil é 18 para rastreio positivo. |
| **ASRS-18** | 18 | 9 Desatenção + 9 Hiperatividade (0 a 1 por critério da OMS). | Parte A: ≥ 4 itens positivos em desatenção ou hiperatividade. | Adultos com suspeita de TDAH. Validado (Mattos 2006). | Avalia apenas frequência nos últimos 6 meses; não verifica início na infância (critério obrigatório do DSM-5). |
| **AUDIT** | 10 | 0 a 4 por item (Total: 0 a 40). Consumo, Dependência e Problemas. | Zona I (0-7), Zona II (8-15), Zona III (16-19), Zona IV (20-40). | Adultos na APS. Validado pela OMS e no Brasil (Mendez 1999). | Se o paciente preenche apenas itens de consumo e abandona o questionário, pode cair erroneamente em Zona I (baixo risco). |
| **AUDIT-C** | 3 | 0 a 4 por item (Total: 0 a 12). | Homens: ≥ 4 positivo. Mulheres: ≥ 3 positivo. | Rastreio breve de álcool na APS. Bush et al. (1998). | O código adota corte universal de 4 pontos em `totalScore >= 4`, sem diferenciar o ponto de corte feminino (≥ 3). |
| **CAGE** | 4 | Sim (1) / Não (0) (Total: 0 a 4). | Corte ≥ 2 indica suspeita de dependência. | Rastreio clássico de problemas alcoólicos (Ewing 1984). | Fidedigno no código, mas requer aviso de que não avalia padrão agudo de consumo (*binge drinking*). |
| **PCL-5** | 20 | 0 a 4 por item (Total: 0 a 80). 4 clusters do DSM-5 (B, C, D, E). | Corte ≥ 31 a 33 para rastreio provável de TEPT. | Adultos com histórico de trauma na APS (Blevins 2015). | Não valida a ocorrência do Evento Traumático Índice (Critério A) antes de pontuar os sintomas reativos. |
| **EPDS** | 10 | 0 a 3 por item (Total: 0 a 30). Inversão em itens específicos. | Corte ≥ 10 a 12 pontos (Rastreio positivo para DPP). | Puérperas e gestantes na APS (Cox 1987, Santos 2007). | **Alerta do Item 10**: O código identifica positividade para ideação de autoagressão, mas não bloqueia a exportação de rotina sem confirmação médica. |
| **SNAP-IV** | 18 | Escala Likert de 4 pontos (0 a 3) para pais/professores. | Corte por percentil 95: média > 1,78 em desatenção ou hiperatividade no Brasil. | Crianças e adolescentes na APS (Mattos et al., 2006). | O código calcula média aritmética simples, mas não alerta para necessidade de coleta em dois ambientes distintos (casa e escola). |

---

## 5. AUDITORIA DO NÚCLEO PSICOFARMACOLÓGICO E CALCULADORAS

### 5.1 Equivalência e Transição de Antidepressivos (`antidepressantSwitching.ts`)
O motor farmacocinético implementado em `src/utils/antidepressantSwitching.ts` é uma das peças mais sofisticadas do sistema, mas possui divergências metodológicas importantes:
1. **Divergência de Edição do Maudsley:** A documentação declara o *Maudsley Prescribing Guidelines 14ª edição* (Taylor, Barnes, Young, 2021). O código adota as equivalências baseadas na meta-análise de Hayasaka et al. (*Lancet Psychiatry* 2015) em relação à Fluoxetina 40mg. As conversões para Sertralina (98,5mg ~ 100mg) e Escitalopram (18mg ~ 20mg) estão corretas segundo Hayasaka, mas a calculadora rápida em `calculators.ts` usa uma regra linear simplificada (Fluoxetina 20mg = Escitalopram 10mg), criando **duas verdades matemáticas dentro do mesmo sistema**.
2. **Washout de IMAO (Tranilcipromina):** O código bloqueia corretamente a transição imediata para IMAO, impondo:
   - 5 semanas (35 dias) para Fluoxetina (devido à meia-vida de 7-15 dias da norfluoxetina).
   - 2 semanas (14 dias) para os demais ISRS e ISRNs.
   - **Ponto de Insegurança:** Se o sentido for inverso (de Tranilcipromina para outro antidepressivo), o sistema exige apenas 14 dias de washout, o que está correto para síntese de nova MAO, mas não oferece suporte para descontinuação gradual do IMAO.
3. **Desmame Hiperbólico (Horowitz & Taylor, 2019):** O motor calcula reduções não lineares proporcionais à ocupação dos transportadores de serotonina (SERT). A fórmula implementada preserva o princípio biológico de que a curva de saturação do SERT é hiperbólica, exigindo reduções cada vez menores em doses baixas.
4. **Interações via Citocromo P450 (CYP450):** O banco de dados em `ANTIDEPRESSANTS_DB` cataloga os principais inibidores:
   - Fluoxetina e Paroxetina: Inibidores potentes do CYP2D6.
   - Fluvoxamina: Inibidor potente do CYP1A2 e CYP2C19.
   - Bupropiona: Inibidor potente do CYP2D6.
   - **Vulnerabilidade:** A interface lista as interações, mas não interrompe o cálculo caso o usuário combine doses máximas de dois substratos competitivos do CYP2D6.

### 5.2 Equivalência de Antipsicóticos em CPZE (`calculators.ts`)
A função `calculateAntipsychoticEquivalence` utiliza equivalências para 100mg de Clorpromazina:
- Haloperidol 2mg = 100mg CPZE
- Risperidona 2mg = 100mg CPZE
- Olanzapina 5mg = 100mg CPZE
- Quetiapina 100mg = 100mg CPZE
- Aripiprazol 5mg = 100mg CPZE
- Levomepromazina 100mg = 100mg CPZE

**Problemas Clínicos Identificados:**
1. **Linearidade Irreal:** Em doses baixas (25-50mg), a Quetiapina atua predominantemente como anti-histamínico H1 e antagonista 5-HT2A (sedativo/hipnótico), não possuindo bloqueio D2 equivalente a 25-50mg de Clorpromazina.
2. **Ausência de Trava para Doses Máximas:** Ao inserir 30mg de Haloperidol ou 800mg de Clorpromazina, o sistema computa o valor sem alertar para o risco crítico de prolongamento do intervalo QTc, discinesia aguda e Síndrome Neuroléptica Maligna (SNM).
3. **Ausência de Especificação de Via:** Não diferencia administração oral de formulações intramusculares ou de depósito (*depot*).

### 5.3 Monitoramento Metabólico
Em `calculateCardiovascularRisk`, quando o paciente utiliza antipsicóticos atípicos de alto risco metabólico (Olanzapina, Quetiapina, Clozapina), o sistema gera um protocolo de monitoramento ancorado no Consenso ADA/APA (2004):
- Glicemia de jejum e perfil lipídico em 12 semanas.
- Peso e circunferência abdominal mensais nos primeiros 3 meses.
- **Avaliação:** Este módulo está clinicamente impecável e em total acordo com a MBE.

---

## 6. AUDITORIA DO EEM E DO PRONTUÁRIO SOAP

### 6.1 Estação Clínica Integrada (`EemSoapWorkstationView.tsx`)
A estação clínica integrada foi projetada para unificar o fluxo de atendimento da consulta ambulatorial.

#### Análise dos Requisitos Clínicos:
1. **Fonte Única para o Subjetivo (S):**
   - **Estado Atual:** O texto do Subjetivo é gerenciado no estado `soapState.subjective`. Embora a edição na estação integrada reflita imediatamente no estado pai, o componente `SoapView.tsx` isolado também contém uma área de texto para o mesmo campo.
   - **Conformidade:** Parcial. Há sincronização reativa, mas a existência de dois formulários de edição cria risco de perda de digitação se o usuário abrir ambas as telas simultaneamente.
2. **Proteção do Subjetivo contra Automações:**
   - **Estado Atual:** A interface manual não insere chips ou templates pré-fabricados no Subjetivo, preservando a fala do paciente. Porém, a rota `/api/ai/soap-draft` devolve um campo `subjective` estruturado que, se importado, descaracteriza a narrativa clínica livre.
3. **Transparência do Objetivo (O):**
   - Os resultados das escalas, calculadoras e o Exame do Estado Mental são inseridos no quadrante Objetivo com cabeçalhos explícitos e identificação da fonte.
4. **Dados Não Avaliados no EEM:**
   - **Correção Recente Verificada:** O sintetizador narrativo `src/utils/eemFormatter.ts` omite os domínios que não tiveram termos assinalados. Ele **não** assume normalidade tácita (ex: se o domínio Humor não foi selecionado, ele não emite *"Humor eutímico"*).
5. **Formatação Sequencial do EEM:**
   - O EEM é formatado com cada dimensão semiológica disposta em uma linha própria com recuo e pontuação técnica, resolvendo a queixa anterior de aglutinação em linha única contínua.

---

## 7. AUDITORIA DOS GRÁFICOS LONGITUDINAIS E RADAR

### 7.1 Gráficos Longitudinais (Linha / Tendência)
Implementados via Recharts (`ResponsiveContainer`, `AreaChart`, `Area`, `XAxis`, `YAxis`, `Tooltip`).

| Critério | Diagnóstico Técnico no Código | Risco Clínico / Arquitetural |
| :--- | :--- | :--- |
| **Ordenação Cronológica** | Mapeamento direto por `effectiveData.map` pelo índice de consulta. | Se as consultas forem inseridas fora de ordem, o eixo X refletirá a ordem do array, não a data cronológica. |
| **Aplicações no Mesmo Dia** | Chave do eixo X é `Consulta N`. | Não há desambiguação de timestamp para múltiplas aplicações na mesma data. |
| **Divisão por Zero** | Implementado como `(baselineScore \|\| 1)` na linha 198. | Protegido contra quebra de runtime, mas distorce a matemática se o baseline for 0. |
| **Cálculo da Variação Percentual** | `percentChange = Math.round(((current - base) / base) * 100)` | **Bug Semântico na Linha 210:** Se o escore sobe de 10 para 15 (+50%), o texto gerado exibe `+50% de redução de sintomas`. |
| **Tratamento de Dados Ausentes** | Fallback para dados de demonstração (`demoInitialAnswers`). | **Risco Crítico:** O médico pode interpretar a curva sintética como evolução histórica do paciente real. |

### 7.2 Gráfico Radar (Psicometria Multidimensional)
Implementado via `RadarChart`, `PolarGrid`, `PolarAngleAxis`, `PolarRadiusAxis`, `Radar` com perfis em `src/data/radarDomainsData.ts`.
- **Instrumentos Mapeados:** PHQ-9, GAD-7, MEEM, AUDIT, ASRS-18, HCL-32, PCL-5, C-SSRS, SNAP-IV.
- **Normalização dos Eixos:** Cada domínio possui `fullMark` específico. O radar plota o valor bruto contra a pontuação máxima do domínio.
- **Preservação de Dados do EEM:** O sistema **não** gera gráfico de radar numérico a partir do Exame do Estado Mental, respeitando a natureza estritamente qualitativa e descritiva da semiologia psicopatológica.

---

## 8. SEGURANÇA, PRIVACIDADE, PERSISTÊNCIA E LGPD

### 8.1 Diagnóstico de Persistência e Superfície de Ataque

| Vetor de Armazenamento / Segurança | Implementação Real no Código | Análise de Conformidade e Riscos |
| :--- | :--- | :--- |
| **Banco de Dados** | Nenhum banco de dados configurado. | Sem persistência no servidor; aplicação volátil em memória. |
| **Autenticação / Login** | Inexistente. | Qualquer pessoa com acesso à URL acessa a aplicação. |
| **Autorização (RBAC)** | Inexistente. | Não há distinção entre perfil de preceptor, residente ou paciente. |
| **LocalStorage / SessionStorage** | Não utilizados no código-fonte. | Os dados da consulta são destruídos ao atualizar a página (F5). |
| **Cookies de Sessão** | Nenhum cookie médico ou rastreador é criado. | Alta privacidade por ausência de retenção de dados. |
| **Logs Contendo Dados Médicos** | `server.ts` possui `console.error` em caso de falha. | Logs do servidor podem registrar trechos do corpo da requisição se houver erro não tratado. |
| **URLs com Dados de Pacientes** | Apenas IDs de escalas e calculadoras na URL. | **Conforme.** Nomes ou dados de pacientes nunca trafegam em parâmetros GET. |
| **Compartilhamento WhatsApp** | Gera link `https://wa.me/?text=...` com orientações. | **Atenção:** Se o profissional incluir dados de identificação no texto, haverá vazamento de dados em canal não seguro. |
| **APIs Externas / Terceiros** | Apenas Google Gemini API (`@google/genai`) via backend. | Chave de API protegida em variável de ambiente no servidor (`server.ts`). |

### 8.2 Conformidade com a LGPD (Lei 13.709/2018)
- A aplicação adota a filosofia *Privacy by Architecture / Ephemeral Session*.
- Por não armazenar dados de saúde (dados pessoais sensíveis - Art. 5º, II da LGPD) em bancos de dados persistentes, o risco de vazamento em repouso é **nulo na versão atual**.
- Contudo, para implantação em ambiente corporativo/ambulatorial real, a LGPD exige registro de logs de acesso, controle de identidade médica (CFM) e trilha de auditoria para quaisquer modificações em prontuário.

---

## 9. GOVERNANÇA DAS REFERÊNCIAS E REGRAS CLÍNICAS

O arquivo central de governança bibliográfica é `src/data/evidenceData.ts`.

### 9.1 Matriz de Rastreabilidade Científica

| Domínio Clínico | Diretriz Declarada | Edição / Ano no Código | Fonte Primária Indexada | Status de Governança |
| :--- | :--- | :--- | :--- | :--- |
| **Depressão (PHQ-9)** | Kroenke et al. (2001) | Validação BR: Osório (2009) | *J Gen Intern Med*; *Rev Bras Psiquiatr* | **Conforme e Auditada** |
| **Ansiedade (GAD-7)** | Spitzer et al. (2006) | Validação BR: Moreno (2016) | *Arch Intern Med*; *Trends Psych* | **Conforme e Auditada** |
| **Suicídio (C-SSRS)** | Posner et al. (2011) | Diretrizes ABP / MS (2014) | *Am J Psychiatry* 2011 | **Exige Modulação de Risco** |
| **Cognição (MEEM)** | Folstein (1975) / Brucki (2003) | Normas ABN / TelessaúdeRS | *Arq Neuropsiquiatr* 2003 | **Exige Ajuste por Escolaridade** |
| **Bipolaridade (HCL-32)** | Angst et al. (2005) | Validação BR: Soares (2010) | *Rev Bras Psiquiatr* 2010 | **Conforme e Auditada** |
| **TDAH (ASRS-18)** | Kessler et al. (OMS 2005) | Validação BR: Mattos (2006) | *Rev Psiquiatr Clín* 2006 | **Conforme e Auditada** |
| **Álcool (AUDIT / AUDIT-C)** | Babor et al. (OMS 2001) | Validação BR: Mendez (1999) | *WHO Guidelines*; Bush (1998) | **Ajustar Corte Feminino AUDIT-C** |
| **Troca de Antidepressivos** | Maudsley (14ª ed., 2021) | Meta-análise Hayasaka (2015) | *Lancet Psychiatry*; Taylor (2021) | **Divergência com `calculators.ts`** |
| **Desmame de Fármacos** | Horowitz & Taylor (2019) | Modelo de Ocupação SERT | *Lancet Psychiatry* 2019 | **Conforme e Auditada** |
| **Risco Cardiovascular** | Diretriz SBC (2019/2021) | Framingham D'Agostino (2008) | *Arq Bras Cardiol*; *Circulation* | **Conforme e Auditada** |
| **Função Renal (TFG)** | Equação CKD-EPI 2021 | Versão Race-Free sem raça | *N Engl J Med* 2021 | **Conforme e Auditada** |

---

## 10. RESULTADO DOS TESTES EFETIVAMENTE EXECUTADOS

### 10.1 Testes Executados Nesta Auditoria (Sem Alteração de Código)
1. **Compilação TypeScript (`compile_applet` / `tsc --noEmit`):**
   - **Resultado:** **SUCESSO (0 erros)**.
   - O projeto compila rigorosamente sob TypeScript 5.8.2 em modo estrito (`strict: true`). Todos os tipos e interfaces em `src/types.ts` estão resolvidos sem casts inseguros (`as any`).
2. **Build de Produção Vite (`npm run build`):**
   - **Resultado:** **SUCESSO**.
   - Os chunks de produção são gerados sem quebras de dependência cíclica ou módulos ausentes.
3. **Varredura de Resiliência em Runtime (Simulação Estática de Exceções):**
   - A aplicação conta com `ErrorBoundary.tsx` na raiz, capturando exceções não tratadas e exibindo tela amigável sem derrubar o processo principal.

### 10.2 Testes Automatizados Inexistentes
- **Framework de Testes:** Não há Jest, Vitest ou React Testing Library configurados em `package.json`.
- **Cobertura de Código:** **0% de testes automatizados**.
- **Impacto Clínico:** Regras matemáticas e pontuações de corte dependem exclusivamente de testes manuais em tela, elevando o risco de regressão silenciosa a cada nova funcionalidade adicionada.

---

## 11. DIVERGÊNCIAS ENTRE O CÓDIGO E O DOSSIÊ v2.4

| Funcionalidade no Dossiê v2.4 | Realidade no Código-Fonte | Severidade da Divergência | Ação Corretiva Proposta |
| :--- | :--- | :--- | :--- |
| **Validação de Preenchimento Completo** | Escalas somam respostas presentes e emitem classificação com questionário incompleto. | **ALTA (Risco Clínico)** | Implementar trava de completude: exigir 100% dos itens preenchidos para emitir escore final. |
| **Unificação da Equivalência de Antidepressivos** | `calculators.ts` usa tabela simplificada linear; `antidepressantSwitching.ts` usa Hayasaka. | **MÉDIA (Inconsistência)** | Eliminar a tabela linear de `calculators.ts` e apontar para o motor canônico de Hayasaka. |
| **Pontos de Corte do MEEM no Cálculo** | O código classifica como "Preservado" se total ≥ 27, ignorando corte de 29 para alta escolaridade. | **MÉDIA (Risco Clínico)** | Adicionar input obrigatório de escolaridade no MEEM antes de calcular o escore. |
| **Integração e-SUS / RNDS / FHIR** | Declarada como funcionalidade estrutural no dossiê. | **BAIXA (Documental)** | Esclarecer que a v2.4 é focada em usabilidade e que interoperabilidade FHIR é meta para a v3.0. |
| **Cálculo de Redução nos Gráficos** | Rótulo afirma "redução de sintomas" mesmo quando o percentual é positivo (aumento de sintomas). | **ALTA (Risco Clínico)** | Inverter condicional do texto: se `percentChange > 0`, emitir `+X% de aumento dos sintomas`. |

---

## 12. REGISTRO DE RISCOS CLÍNICOS E TÉCNICOS

```text
MATRIZ DE RISCO CLÍNICO E OPERACIONAL:
Probabilidade ▲
       Alta   │         [R1]             [R3]
              │
    Moderada  │   [R5]         [R4]      [R2]
              │
      Baixa   │         [R6]             [R7]
              └────────────────────────────────► Severidade
                         Média           Crítica
```

- **[R1] Falso-Negativo por Preenchimento Parcial:** Avaliar precocemente uma escala incompleta gera laudo de "baixo risco", induzindo o médico ao erro de subestimar a depressão ou risco de suicídio.
- **[R2] Categorização Automática de Suicídio no C-SSRS:** A determinação de "Alto Risco / Emergência" sem avaliação clínica contextualizada gera encaminhamentos desnecessários para emergências psiquiátricas ou, inversamente, falsa sensação de segurança em "Risco Baixo".
- **[R3] Inversão Semântica nos Gráficos:** Um paciente que piorou de 10 para 15 pontos no PHQ-9 recebe no prontuário a informação de "+50% de redução de sintomas".
- **[R4] Divergência Farmacológica Dupla:** Dois cálculos de equivalência de antidepressivos no mesmo sistema produzem posologias diferentes para o mesmo fármaco.
- **[R5] Toxicidade em CPZE:** Ausência de teto toxicológico e cálculo linear em Quetiapina/Haloperidol.
- **[R6] Sobrescrita de Rascunho de IA:** Rascunho generativo que preenche o Subjetivo apagando o registro autêntico da anamnese médica.
- **[R7] Curva Sintética Confundida com Histórico Real:** Exibição de histórico demo em `EvolutionChartsView` sem badge de demonstração suficientemente destacado.

---

## 13. PLANO DE CORREÇÕES INCREMENTAIS

### Fase 1: Blindagem de Segurança Clínica Imediata (Prioridade Zero)
1. **Guarda de Preenchimento Completo nas Escalas:**
   - Modificar a assinatura de `calculateResult` para receber o número total de questões obrigatórias.
   - Se `Object.keys(answers).length < totalQuestions`, o botão "Calcular / Exportar para SOAP" deve permanecer desabilitado ou emitir status: *"Preenchimento Incompleto (X de Y respondidas) — Complete todas as questões para emitir a interpretação clínica"*.
2. **Reestruturação Semiótica do C-SSRS:**
   - Substituir os rótulos preditivos nominais por descrições clínicas objetivas dos achados:
     - Nível 1: *"Presença de ideação suicida passiva sem método"*
     - Nível 2: *"Presença de ideação suicida ativa sem plano ou intenção"*
     - Nível 3: *"Ideação ativa com método potencial"*
     - Nível 4: *"Ideação com intenção de agir"*
     - Nível 5: *"Ideação com plano e intenção específica ou comportamento preparatório"*
   - Inserir aviso permanente: *"O C-SSRS descreve a gravidade da ideação e não substitui a avaliação médica de risco global, fatores protetores e intencionalidade."*
3. **Correção do Bug Semântico em `EvolutionChartsView.tsx`:**
   - Corrigir a montagem da string na linha 210:
     ```typescript
     const variationText = percentChange < 0 
       ? `${Math.abs(percentChange)}% de redução dos sintomas (melhora clínica)` 
       : percentChange > 0 
       ? `+${percentChange}% de aumento dos sintomas (agravamento/recidiva)` 
       : 'Estabilidade sintomática (sem variação percentual)';
     ```
   - Inserir badge persistente de cor âmbar *"MODO DEMONSTRAÇÃO / HISTÓRICO SINTÉTICO"* quando o histórico do paciente for inexistente.

### Fase 2: Unificação Farmacológica e Ajuste do MEEM
1. **Unificação dos Cálculos de Equivalência:**
   - Refatorar `calculateAntidepressantEquivalence` em `src/utils/calculators.ts` para consumir diretamente as constantes e razões de `src/utils/antidepressantSwitching.ts` (Hayasaka 40mg).
2. **Parametrização por Escolaridade no MEEM:**
   - Exigir a seleção do estrato de escolaridade do paciente (Analfabeto, 1-4 anos, 5-8 anos, 9-11 anos, >11 anos) antes de computar o escore final.
   - Ajustar o ponto de corte individualmente com base no estrato selecionado (Brucki et al., 2003).
3. **Ajuste de CPZE:**
   - Adicionar limite máximo diário de segurança (ex: alerta de dose excessiva para equivalência > 1000 mg de Clorpromazina/dia).
   - Inserir nota sobre Quetiapina em baixas doses.

### Fase 3: Proteção Estrita da Estação EEM/SOAP
1. **Imutabilidade e Soberania do Subjetivo:**
   - Bloquear a sobrescrita do campo S por qualquer rotina automática ou rascunho generativo sem consentimento explícito do médico.
   - Adicionar botão de desfazer (*undo*) no campo Subjetivo.
2. **Auditoria de Cópia:**
   - Garantir que a ação de "Copiar para Prontuário" realize a validação de que os campos contêm dados revisados pelo médico.

### Fase 4: Engenharia de Qualidade e Governança de Testes
1. **Instalação do Vitest:**
   - Configurar `vitest` e `@testing-library/react` em `package.json`.
   - Criar suíte de testes unitários automatizados para todas as 21 escalas com casos de teste cobrindo:
     - Preenchimento completo em valores mínimos (escore 0).
     - Preenchimento completo em valores máximos.
     - Tentativas de cálculo com preenchimento parcial (deve retornar erro ou status pendente).
     - Valores limítrofes em cada ponto de corte.
     - Cálculos farmacocinéticos e períodos de washout de antidepressivos.

---

## 14. CRITÉRIOS DE ACEITE PARA A PRÓXIMA VERSÃO (v2.5)

Para que a versão v2.5 seja considerada apta para testes com médicos residentes e preceptores, ela deverá cumprir integralmente os seguintes critérios:

- [ ] **CA-01 (Completude Psicométrica):** Nenhuma escala deve produzir interpretação final ou classificação diagnóstica enquanto houver 1 ou mais itens obrigatórios não respondidos.
- [ ] **CA-02 (Item 9 do PHQ-9):** O item 9 positivo (> 0) deve exibir alerta clínico de investigação presencial, porém mantendo a pontuação global dependente da soma total auditada dos 9 itens.
- [ ] **CA-03 (C-SSRS Clínico):** O C-SSRS não deve emitir conduta de internação/encaminhamento automático baseada isoladamente em um escore numérico; deve descrever o nível semiológico de ideação e exigir julgamento médico.
- [ ] **CA-04 (Escolaridade no MEEM):** O MEEM deve exigir a faixa de anos de estudo do paciente para determinar se a pontuação obtida está abaixo do ponto de corte normativo de Brucki (2003).
- [ ] **CA-05 (Semântica Longitudinal):** O texto de variação nos gráficos longitudinais deve expressar corretamente redução como melhora e aumento como agravamento/piora sintomática.
- [ ] **CA-06 (Unicidade Farmacológica):** A calculadora rápida de antidepressivos deve convergir 100% com a tabela de equivalências da meta-análise de Hayasaka et al. (2015).
- [ ] **CA-07 (Proteção do Subjetivo):** O campo Subjetivo deve ser imune a preenchimentos automáticos ou substituições silenciosas por IA.
- [ ] **CA-08 (Testes Automatizados):** 100% das funções de cálculo (`calculateResult`, `calculateEgfr`, `calculateCardiovascularRisk`, `calculateAntidepressantEquivalence`) devem possuir testes unitários aprovados cobrindo cenários típicos e limites extremos.
- [ ] **CA-09 (Integridade de Compilação):** Compilação TypeScript com 0 erros (`tsc --noEmit`) e build de produção sem avisos de chunks corrompidos.

---

*Relatório de Auditoria emitido pelo Chief Clinical Information Officer (CCIO) e Equipe de Engenharia Clínica do Nexus Clínico. As correções propostas devem ser priorizadas na ordem estrita das Fases 1 a 4 antes de qualquer expansão funcional.*
