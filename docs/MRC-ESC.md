# MRC-ESC v1.0 — Rastreabilidade e fidelidade clínico-científica das escalas

**Escopo:** PHQ-9, GAD-7, AUDIT de dez itens, EPDS, MEEM, ASRS-18 e SNAP-IV. Excluídas calculadoras e demais instrumentos do aplicativo. **Sem uso de dados assistenciais reais.**

## Dois eixos independentes

**FC — fidelidade clínico-científica:** verificar, frente à publicação primária e à versão brasileira adotada, itens, tradução, respondente, recordatório, respostas, valores, critérios interpretativos, risco de inferência diagnóstica, alertas, indicações e condições de reprodução.

**TF — conformidade técnico-funcional:** verificar que o código aceita respostas válidas, recusa respostas inválidas, soma corretamente, bloqueia classificação de dados incompletos, preserva alertas sensíveis e exporta informações sem distorcer o texto.

Cada julgamento documental: **corresponde à fonte**, **diverge da fonte citada**, **indeterminado**, **não aplicável**. Cada cenário executado: **aprovado**, **reprovado**, **bloqueado**, **pendente**. Não misturar julgamento de fonte com execução do teste, nem presumir que bibliografia citada valida pontuações do software.

## Matriz: seis critérios por instrumento

IDs de cada instrumento identificam, respectivamente: 
- **01 — conteúdo e versão (FC):** número e texto dos itens, opções, população, prazo e tradução.
- **02 — pesos e cálculo (FC + TF):** pontuação independente, mínimo, máximo e inversões.
- **03 — pontos de corte e interpretação (FC + TF):** limites consecutivos, população, versão e diferenciação entre rastreio e diagnóstico.
- **04 — entradas incompletas ou inválidas (TF):** bloqueio da classificação final, preservação de alertas.
- **05 — avisos e recomendações (FC + TF):** fidelidade da interpretação e ausência de conduta terapêutica obrigatória deduzida exclusivamente de escore.
- **06 — registro, documentação e uso (FC + TF):** texto exportado, fonte declarada, limitações e condições de reprodução.

| Instrumento | IDs (6 verificações cada) | Intervalo de escore e pontos clínicos críticos | Implementação |
|---|---|---|---|
| PHQ-9 | ESC-PHQ-01 a ESC-PHQ-06 | Nove itens, 0–27; item 9; gradação dos sintomas não equivale a diagnóstico | src/data/scalesData.ts |
| GAD-7 | ESC-GAD-01 a ESC-GAD-06 | Sete itens, 0–21; faixas de sintomas e inferências de TAG | src/data/scalesData.ts |
| AUDIT-10 | ESC-AUD-01 a ESC-AUD-06 | Dez itens, 0–40; itens 9 e 10 com opções 0/2/4; distinguir AUDIT-C | src/data/scalesData.ts |
| EPDS | ESC-EPD-01 a ESC-EPD-06 | Dez itens, 0–30; codificação específica e alerta do item 10 | src/data/additionalScalesData.ts |
| MEEM | ESC-MEE-01 a ESC-MEE-06 | 30 pontos; escolaridade e interpretação normativa; direitos de reprodução | src/data/scalesData.ts |
| ASRS-18 | ESC-ASR-01 a ESC-ASR-06 | 18 itens; distinguir rastreador de seis itens e domínio de nove | src/data/scalesData.ts |
| SNAP-IV | ESC-SNA-01 a ESC-SNA-06 | 18 itens, 0–54; subescalas e informantes; distinguir formulário com TOD | src/data/scalesData.ts |

**Total: 42 critérios planejados**, a detalhar em entradas sintéticas, saídas esperadas determinadas independentemente do código, fonte, observação e evidência.

## Fontes de conferência e divergências preliminares

1. **PHQ-9:** Kroenke et al. (2001), DOI https://doi.org/10.1046/j.1525-1497.2001.016009606.x. Sensibilidade/especificidade de 88%/88% foram obtidas na amostra original e não devem ser automaticamente atribuídas ao estudo brasileiro. Revisar as recomendações farmacológicas assertivas associadas apenas ao escore.
2. **GAD-7:** Spitzer et al. (2006). Conferir a referência da versão brasileira, a origem das propriedades psicométricas e as recomendações terapêuticas, que não devem resultar automaticamente da pontuação.
3. **AUDIT:** manual da OMS, https://www.who.int/publications/i/item/brief-intervention-for-hazardous-and-harmful-drinking-%28audit%29. A estrutura de dez itens e as opções dos itens 9–10 parecem corresponder ao manual; confirmar dose-padrão, mensagens clínicas e interpretação.
4. **EPDS:** Santos et al. (2007), https://doi.org/10.1590/S0102-311X2007001100005. O estudo citado reportou, no corte >10, sensibilidade **82,6%** e especificidade **65,4%**; para casos moderados/graves, corte >11. O código informa 82,6%/88,9% e utiliza ≥10 como corte principal. Conferir versão e justificar escolha do corte antes de alterar regra.
5. **MEEM:** Brucki et al. (2003), https://doi.org/10.1590/S0004-282X2003000500014. Valores 20, 25, 26,5, 28 e 29 são **medianas por escolaridade** em amostra de indivíduos saudáveis e não limites diagnósticos da publicação. O código as rotula como cortes e gera inferência de preservação/declínio: **divergência prioritária**. Conferir também direitos de reprodução.
6. **ASRS-18:** Mattos et al. (2006), https://www.scielo.br/j/rpc/a/nnhNLNxkFSmQwVBSGZYdp6d/?lang=pt. O critério de quatro itens positivos pertence ao rastreador breve de seis itens. O código o aplica a cada domínio de nove e o denomina corte da OMS: **divergência prioritária de versão e interpretação**.
7. **SNAP-IV:** estudo brasileiro de acurácia, https://www.scielo.br/j/jped/a/rPZ49wGXHySpw575mHJt3wP/. Cortes empíricos por contagem de sintomas variaram por domínio (6 desatenção e 4 hiperatividade/impulsividade nessa amostra), enquanto a versão atual apresenta ≥6 em ambos como regra universal; a versão de 18 itens do aplicativo não inclui subescala de TOD. **Interpretar como resultado de rastreio, não confirmação diagnóstica.**

**Esses apontamentos são inspeções de código e literatura, ainda não testes executados.** A correção dependerá de versão escolhida, fonte e reexecução documentada; se houver revisão clínica independente, registrar responsável e decisão. Se não houver, declarar como limitação.

## Protocolo de avaliação

1. Inventariar itens, versões brasileiras e condições de reprodução; atribuir uma fonte específica a cada regra.
2. Estabelecer as respostas esperadas de modo independente das funções implementadas, incluindo limites, valores ausentes, alertas e casos completos.
3. Executar testes automatizados e, separadamente, os testes de interface com dados sintéticos.
4. Categorizar divergências entre código e fonte como bibliográficas, semânticas, de pontuação, limites, alertas ou documentação.
5. Corrigir em commit separado e repetir os testes pertinentes. Não agregar resultados de versões diferentes como se fossem uma rodada única.
6. Relatar denominadores de critérios documentais examinados e de cenários técnicos executados; indeterminados não são aprovações.

## Auditorias específicas por instrumento

- **MEEM:** [parecer de fidelidade clínico-científica e protocolo de decisão](MRC-ESC-MEEM-AUDITORIA.md). Documento de inspeção; diferenças na aplicação, interpretação normativa e condições de reprodução ainda pendentes de decisão e teste.

## Registro de execução formativa da MRC-ESC

- **Commit:** a8e4d195c7993a2465617b2cb371b42d97ecbc25.
- **Evidência:** https://github.com/adolfodelfino-wq/Aranhas/actions/runs/40439681470
- **Execução:** suíte Vitest delimitada a MRC-SOAP, MRC-EEM e MRC-ESC; **44/44 testes automatizados passaram**, dos quais **26/26 foram verificações técnico-funcionais dos sete instrumentos de escala**.
- **Critérios técnicos cobertos nessa rodada:** para cada um dos sete instrumentos, quantidade de itens e extremos de escore; bloqueio de resultados vazios/incompletos; rejeição de alternativa inválida. Adicionalmente, opções 0/2/4 do AUDIT (itens 9–10), alertas PHQ-9 item 9 e EPDS item 10 em formulários incompletos e com soma baixa.
- **Build:** realizado. Diagnóstico global TypeScript conserva pendência em componente de calculadora farmacológica fora do escopo do TCR; não contabilizar como falha das matrizes.
- **Avaliação clínico-científica:** **não concluída**. As discrepâncias identificadas no confronto documental permanecem sob análise, e o fato de o código calcular corretamente uma regra programada **não valida a pertinência clínica dessa regra**.
- **Pendências:** pontos de corte e versões brasileiras, equivalência textual de todos os itens, interpretação e recomendações, limites próximos aos cortes, testes de interface e verificação independente da bibliografia.
- **Limite de interpretação:** 26 verificações automáticas aprovadas não equivalem a aprovação dos 42 critérios documentais/funcionais planejados.

**Estado:** protocolo das sete escalas definido, execução técnica formativa registrada, auditoria clínica ainda pendente de adjudicação.

