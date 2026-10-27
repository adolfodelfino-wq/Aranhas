# Auditoria clínico-científica do MEEM — parecer técnico preliminar

**Âmbito:** MRC-ESC, instrumento MEEM (Mini-Exame do Estado Mental), no Nexus Clínico. **Objetivo:** confrontar a aplicação implementada com a versão brasileira de Brucki et al. (2003) e identificar requisitos de segurança documental. **Dados:** exclusivamente inspeção bibliográfica e do código; nenhuma aplicação em pacientes, teste manual de interface ou parecer independente foi executado.

**Versão inspecionada:** branch `tcr-2026-fundamentacao-seguranca-soap`, `src/data/scalesData.ts` (MEEM_SCALE), `src/components/ScalesView.tsx` e `src/components/PatientSelfFillModal.tsx`. Para rastrear a versão final, recuperar o commit específico de avaliação e registrar as correções em outra rodada.

## Referências diretamente confrontadas

- BRUCKI, S. M. D. et al. Sugestões para o uso do mini-exame do estado mental no Brasil. *Arquivos de Neuro-Psiquiatria*, v. 61, n. 3B, p. 777–781, 2003. https://doi.org/10.1590/S0004-282X2003000500014 . Texto integral e apêndice: https://www.scielo.br/j/anp/a/YgRksxZVZ4b9j3gS4gw97NN/?format=pdf&lang=pt .
- Revisão sistemática de dados normativos do MEEM no Brasil: https://pmc.ncbi.nlm.nih.gov/articles/PMC6820509/ . Distingue dados normativos de Brucki de estudos com amostras clínicas e curvas ROC.
- Estudo com amostra do sul do Brasil e pontos de corte por escolaridade estimados por ROC (amostras clínica/controle): https://pmc.ncbi.nlm.nih.gov/articles/PMC5619528/ . Demonstra dependência de população, versão e definição de caso; **não autoriza trocar um conjunto de cortes por outro sem justificativa e compatibilidade da versão**.
- Informação da editora sobre licenciamento, modificações de formato e traduções do instrumento: https://www.parinc.com/products/MMSE . As condições de reprodução digital do formulário completo no Nexus Clínico ainda **não foram verificadas/obtidas**. O acesso aberto ao artigo de Brucki não equivale automaticamente a licença de reprodução de todos os direitos associados ao teste.

## Achados com rastreabilidade

| ID | Área | Comparação concreta | Parecer | Prioridade |
|---|---|---|---|---|
| MEE-FC-01 | Referência / interpretação | Brucki descreve **medianas** 20, 25, 26,5, 28 e 29 por estrato educacional e declara que optou por **não delimitar níveis de corte**. O código as rotula “pontos de corte” e compara cada pontuação para afirmar “preservado”/“sugestivo de declínio”. | **Divergente da referência atribuída**; suspender classificação automática antes de resolver a regra de interpretação. Brucki admite que valores *abaixo da mediana* motivam avaliação complementar — isso **não** equivale a resultado diagnóstico. | Crítica |
| MEE-FC-02 | Classificação geral | O código define 27+ como “preservado na maioria”, 20–26 como “limítrofe”, <20 como “declínio significativo em todas as escolaridades”. Não há escolaridade individual informada na lógica da classificação geral. | **Não sustentado como resultado individual por Brucki**; no máximo registrar o escore, as condições e ressalvas. | Crítica |
| MEE-FC-03 | Orientação temporal | Brucki 2003 substitui “semestre” por **hora aproximada (±1 hora)** na versão final. `q1_semestre` avalia “semestre ou estação do ano”. | **Divergência explícita de conteúdo/versão**; alinhar ao instrumento adotado. | Alta |
| MEE-FC-04 | Atenção/cálculo | Brucki 2003 escolheu somente **subtrações seriadas de sete**. `q4_atencao` oferece adicionalmente soletrar “MUNDO” ao contrário. | **Divergência de procedimento** que afeta comparabilidade com dados de Brucki. | Alta |
| MEE-FC-05 | Memória imediata | O apêndice Brucki indica repetição das três palavras para aprendizado até **três vezes**, com pontuação da primeira; `q3_memoria.instruction` permite até **seis** repetições. | **Divergência de instrução**; verificar antes de disponibilização. | Alta |
| MEE-FC-06 | Orientação espacial | O apêndice distingue local imediato/específico (consultório/sala) e local geral (hospital/casa), com bairro **ou rua próxima**. O código utiliza “sala ou andar” e “bairro”, sem opção textual da rua. | **Equivalência parcial**; revisão do roteiro de aplicação necessária. | Moderada |
| MEE-FC-07 | Frase / escrita | Apêndice exige frase com sentido; erros gramaticais/ortográficos não devem ser descontados. O código menciona “frase completa com sujeito e verbo”. | **Condição mais restritiva possível**; esclarecer ao examinador a regra adotada. | Moderada |
| MEE-FC-08 | Estímulos de aplicação | Nomeação requer objetos reais, leitura requer estímulo escrito e cópia requer modelo de dois pentágonos. Em `ScalesView.tsx` a apresentação das perguntas é predominantemente textual e há escolhas de pontuação; não foi confirmada a exibição de estímulos necessários na própria interface. | **Necessidade de material padronizado e execução manual**, sem presumir equivalência de autoaplicação eletrônica. | Alta |
| MEE-FC-09 | Modo de administração | `ScalesView.tsx` oferece “Autoaplicação (PC / Tablet)” independentemente do instrumento; `PatientSelfFillModal.tsx` carrega escalas de `ALL_SCALES` sem exclusão explícita de MEEM no trecho inspecionado. | **Fluxo potencialmente incompatível** com teste que requer examinador e apresentação de estímulos. Confirmar no navegador; bloquear autoaplicação não supervisionada se confirmado. | Crítica |
| MEE-FC-10 | Direitos de uso | PAR lista MMSE e menciona autorização para versões modificadas e alterações de formato; versão digital desenvolvida para o Nexus não possui permissão documentada. | **Licença/condições de reprodução pendentes**; não presumir que CC do artigo libera o teste para aplicação digital. | Crítica |
| MEE-TF-01 | Pontuação bruta | O código soma as 19 respostas agregadas distribuídas em 30 pontos e informa dimensões cujo máximo total é 30. | **Inspeção aparentemente coerente**, sujeito a testes independentes com casos sintéticos. Não atesta equivalência da administração. | Técnica |

## Delimitação científica das conclusões

1. O trabalho de Brucki avalia 433 sujeitos sem queixas de memória e descreve distribuições normativas por escolaridade. Os autores expressamente não estabeleceram níveis de corte específicos no estudo. Entretanto, indicaram que desempenhos **abaixo das medianas** justificam investigação clínica adicional. Evitar tanto o excesso de interpretar mediana como diagnóstico quanto o excesso oposto de afirmar que as medianas não têm nenhuma utilidade clínica.
2. Estudos posteriores com grupos clínicos e curvas ROC obtiveram outros limiares, mas eles dependem da população e do contexto. Não extrapolar para os pacientes da APS sem escolher versão e evidência aplicável.
3. A correção deve distinguir **adequação do formulário** de **cálculo do resultado**. Preservar a estrutura de 30 pontos não resolve divergências na administração.
4. Status atual: parecer de inspeção documental — **não representa validação clínica, nem execução dos cenários MEE-01, MEE-03, MEE-05 ou MEE-06**.

## Proposta de especificação clínica para decisão

- Identificar a versão que se pretende reproduzir: Brucki 2003, com aplicação conduzida por profissional e estímulos disponibilizados de modo compatível, ou outra versão documentalmente sustentada. Registrar a razão da escolha e os direitos correspondentes.
- No resultado, manter **pontuação bruta de 0 a 30 e subtotais**, identificando escolaridade se efetivamente informada; não atribuir “preservado”, “normal”, “demência”, “declínio significativo” ou outras classificações automáticas derivadas das medianas.
- Se houver uso das medianas como referência descritiva, rotulá-las **medianas populacionais**, nunca “ponto de corte diagnóstico”; abaixo delas, apenas indicar que a avaliação clínica complementar pode ser pertinente conforme os autores.
- Exigir seleção/documentação da aplicação assistida por profissional e das condições dos estímulos antes de considerar pontuação concluída no fluxo clínico.
- Manter bloqueio de interpretação com dados incompletos ou inválidos.
- Antes de publicação ou uso assistencial, esclarecer licenças do instrumento e condições da adaptação digital.

## Testes previstos após decisão e correção (não executados)

| Cenário | Entrada sintética | Aceitação prevista |
|---|---|---|
| ESC-MEE-01 | Conferir textos das 19 questões agregadas contra a versão adotada | Enunciados, instruções e estímulos equivalentes ou discrepâncias explicitamente rotuladas |
| ESC-MEE-02 | Preencher pontuação mínima, máxima e valores intermediários | Soma numérica e subtotais 0–30 coerentes; sem extrapolar interpretação |
| ESC-MEE-03 | Simular escores 19, 20, 24, 25, 26, 27, 28 e 29 em escolaridades diferentes | Nenhuma classificação diagnóstica automática derivada apenas das medianas |
| ESC-MEE-04 | Deixar questão em branco e inserir valor inválido | Resultado marcado incompleto; não oferecer escore final ou interpretação |
| ESC-MEE-05 | Abrir opção de autoaplicação para MEEM | Autoaplicação não supervisionada indisponível; examinar demais fluxos sob controle profissional |
| ESC-MEE-06 | Gerar registro SOAP e verificar contexto | Escore e itens preservados; versão e ressalvas adequadas; direitos de uso documentados |

**Próxima ação:** discutir e aprovar a versão e os critérios de interpretação; então corrigir o código em branch de revisão, criar testes independentes e documentar nova execução. Não mesclar com `main` antes do fechamento dos cenários.
