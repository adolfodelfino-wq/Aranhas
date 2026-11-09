# Nexus Clínico: verificação focal do apoio contextual

Data: 03/11/2026. Base: `f4bf106acfb4c35adff9387cf7ba9134b9e1913f`, mais o patch local descrito em `TCR-NUCLEO-20261030.md` e as alterações adicionais desta rodada. Execução local em Node.js 24.22.1, sem instalação de dependências. Não houve publicação da alteração nem testes interativos da interface.

## Alterações examinadas

- O descritor estruturado de ideação suicida no conteúdo do pensamento passa a gerar aviso de prioridade para avaliação clínica; o item 9 do PHQ-9 é verificado também quando o resultado chega como vetor de respostas ou como alerta crítico, além do resumo de itens.
- As observações livres do EEM deixaram de ser analisadas para disparar sugestões de sono. Portanto, tanto uma frase negativa quanto uma positiva deixam de acionar essa regra. Isso evita tratar negação como afirmação, mas não constitui reconhecimento contextual ou validação de processamento de linguagem natural.
- A sugestão de sono passa a estar relacionada à resposta do item 3 do PHQ-9, sem atribuir achados não registrados ao EEM nem inferir alteração de sono pelo escore total do GAD-7, pelo humor ou pela inquietação.
- O aviso do modal recebeu estilo visual de destaque; sua apresentação e a navegação não foram testadas interativamente nesta rodada.

## Execução

```sh
node --no-warnings --loader ./scripts/tcr-typescript-loader.mjs ./scripts/tcr-vignettes.check.ts
node --no-warnings --loader ./scripts/tcr-typescript-loader.mjs --test ./scripts/tcr-contextual.check.mjs
```

As seis vinhetas originais foram executadas diretamente na função e os seis critérios específicos foram atendidos. Em V02, a sugestão de sono permaneceu em razão de resposta positiva ao item 3 do PHQ-9, sem atribuição ao EEM; em V03, deixou de ser gerada sem informação específica de sono. Em V05 foi retornado o aviso associado ao descritor estruturado, e em V06 não houve sugestão a partir do texto livre. Os testes adicionais do Node, distintos das seis vinhetas e da seleção de 49 casos Vitest anterior, totalizaram 18 casos e não apresentaram falhas de asserção.

Os cenários adicionais abrangem dados ausentes, frases negativas e positivas de sono, PHQ-9 com item 3 positivo ou negativo, GAD-7 elevado, ideação estruturada e não estruturada, item 9 positivo em resultado completo ou incompleto e manutenção de uma sugestão combinada de EEM e escala. O caso de texto livre positivo demonstra uma limitação deliberada: esse mecanismo não interpreta automaticamente a anotação, inclusive quando contém menção a pensamentos de morte; a ausência de alerta não exclui risco. Os 49 casos e os 183 de regressão correspondem à rodada anterior e não foram reexecutados após esta alteração. Nenhum resultado desta rodada comprova segurança clínica, desempenho em consulta ou eficácia assistencial.
