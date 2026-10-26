# MRC-SOAP v1.0 — Matriz de Rastreabilidade de Critérios

**Projeto:** Nexus Clínico — avaliação técnico-funcional preliminar (TCR em MFC).  
**Objeto:** módulo SOAP e interfaces com EEM, escalas e exportação textual para PEC/e-SUS APS.  
**Referência metodológica:** Design Science Research (Peffers et al., 2007) e FEDS (Venable et al., 2016).  
**Nota:** MRC é denominação operacional deste projeto, não sigla universal da DSR.  
**Prazo do TCR:** 20/11/2026.

## Delimitação e critérios

- Usar **somente pacientes sintéticos** e **ambiente sem registros reais**.
- Registrar em cada rodada: data, executor, **SHA do commit**, navegador/Node, sistema operacional, origem dos dados e isolamento de Firebase/Firestore.
- Definir o resultado esperado **antes** da execução do cenário.
- Manter separados: **teste escrito**, **executado**, **aprovado**, **reprovado** e **bloqueado**.
- Conferir escalas contra suas fontes. A MRC-SOAP avalia a **integração documental**, não a validade psicométrica das escalas.
- Nenhum campo pode receber achados normais, diagnósticos ou condutas que não foram registrados pelo médico.
- Estados possíveis: Pendente (não executado), Aprovado, Reprovado, Bloqueado (impossibilidade técnica), Não aplicável (justificado).
- Cobertura funcional = requisitos do escopo com pelo menos um cenário executado ÷ requisitos previstos. Não equivale à cobertura do código.

## Matriz de rastreabilidade e aceitação

| ID | Critério funcional | Entrada ou procedimento sintético | Resultado esperado e condição de aceitação | Código | Modo | Estado |
|---|---|---|---|---|---|---|
| SOAP-01 | Correspondência dos quatro campos | Preencher S, O, A, P com frases distintas e exportar | Cada frase somente no campo correto, na ordem S/O/A/P | src/components/SoapView.tsx; src/utils/pecFormatter.ts | Auto: exportação; manual: edição | Pendente |
| SOAP-02 | Preservação do texto livre | Inserir acentos, números e quebras de linha em S e O | Conteúdo interno preservado sem reescrita do relato | src/utils/pecFormatter.ts; src/components/SoapView.tsx | Auto + manual | Pendente |
| SOAP-03 | Não presumir normalidade | S, A e P preenchidos; O vazio; exportar | O apenas “Não registrado.”; sem exame presumido normal | src/utils/pecFormatter.ts | Auto | Pendente |
| SOAP-04 | Integridade de exportação | Quatro campos com marcadores exclusivos | Ordem e conteúdo preservados na saída PEC | src/utils/pecFormatter.ts | Auto | Pendente |
| SOAP-05 | SOAP inteiramente vazio | Exportar S/O/A/P vazios | Os quatro campos indicam ausência de registro, sem inventar diagnóstico/conduta | src/utils/pecFormatter.ts | Auto | Pendente |
| SOAP-06 | Codificação selecionada | Selecionar somente um código sintético | Somente código selecionado no A, sem alteração de S | src/utils/pecFormatter.ts; src/components/PecExportModal.tsx | Auto: formatação; manual: seleção | Pendente |
| SOAP-07 | Integração EEM e sinais vitais | O contém PA/FC; adicionar EEM sintético | Preservação de PA/FC e inserção de EEM com um cabeçalho | src/utils/eemFormatter.ts; src/components/EemSoapWorkstationView.tsx | Auto | Pendente |
| SOAP-08 | Reimportação do EEM | Reimportar descritores alterados com resultado de escala já registrado | Atualizar EEM sem duplicar cabeçalho, mantendo sinais vitais e escala | src/utils/eemFormatter.ts | Auto | Pendente |
| SOAP-09 | Importação da escala concluída | Aplicar escala completa e importar; repetir com preenchimento incompleto | Resultado completo é transposto corretamente; incompleto não vira escore final | src/components/ScalesView.tsx; src/components/EemSoapWorkstationView.tsx | Manual | Pendente |
| SOAP-10 | Repetição da mesma importação | Importar duas vezes o mesmo resultado | Não duplicar; considerar necessidade de versões/datas diferentes | src/components/EemSoapWorkstationView.tsx; src/App.tsx | Manual | Pendente |
| SOAP-11 | Limpeza mediante confirmação | Preencher, cancelar limpeza, confirmar limpeza | Cancelar preserva; confirmar zera S/O/A/P conforme aviso | src/components/SoapView.tsx; src/components/EemSoapWorkstationView.tsx | Manual | Pendente |
| SOAP-12 | Separação de consultas | Preencher sessão fictícia A; iniciar sessão fictícia B | Não mostrar SOAP/EEM/histórico da sessão anterior; verificar persistência local | src/App.tsx, handleResetNewPatient | Manual | Pendente |

**Automação:** o arquivo src/__tests__/mrcSoap.test.ts contém testes associados a SOAP-01 até SOAP-08. Para SOAP-01, SOAP-02 e SOAP-06 há ainda ações de interface não cobertas pela automação. Escrever testes NÃO equivale a executá-los.

## Procedimento de execução

1. Preparar ambiente isolado, sem dados reais; verificar armazenamento local e serviços externos.
2. Registrar branch, commit e dependências; manter mesma versão durante a rodada.
3. Executar npm run lint, npm test -- --reporter=verbose e npm run build. Salvar data, comando, saída e código de retorno.
4. Registrar saídas dos testes SOAP-01 a SOAP-08 e comparar com aceitação predefinida.
5. Executar manualmente SOAP-01, SOAP-02, SOAP-06 e SOAP-09 a SOAP-12; registrar evidências sem dados pessoais.
6. Classificar divergências, corrigir em commit diferente e reexecutar os casos relevantes.
7. Concluir a rodada final em commit identificado, apresentando denominadores.

## Registro de execução (não preencher antes da rodada)

- **ID da rodada:** MRC-SOAP-R___
- **Data e hora:** pendente
- **Executor / revisor:** pendente
- **Branch / SHA completo:** pendente
- **Ambiente (SO, navegador, Node, Vitest):** pendente
- **Dados:** somente sintéticos; isolamento externo: pendente
- **Comandos executados / saída de cada um:** pendente
- **Cenários totais previstos:** 12
- **Cenários executados:** pendente; distinguir etapas automatizadas/manuais
- **Aprovados:** pendente | **Reprovados:** pendente | **Bloqueados:** pendente | **Não executados:** pendente
- **Falhas** (ID, entradas, esperado, observado, evidência, commit): pendente
- **Correções realizadas** (SHA): pendente
- **Reexecuções após correção:** pendente
- **Pendências para fechamento da avaliação:** pendente

**Não relatar taxas de aprovação ou validação clínica antes da execução e documentação.**
