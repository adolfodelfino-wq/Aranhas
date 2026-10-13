# Plano de Implementação — Despoluição Visual e Acordeões Clínicos no Desmame de Benzodiazepínicos

## 1. Contexto & Diagnóstico
Na tela de resultado da calculadora de desmame de benzodiazepínicos (`BenzodiazepineTaperCalculator.tsx`), existem blocos extensos de texto abertos por padrão que aumentam a carga cognitiva na consulta de 20 minutos:
- Texto redundante: *"Protocolo farmacocinético e clínico estruturado pelas Diretrizes ASAM (2025)..."* (desnecessário, pois já é exibido nos badges superiores).
- *Sinais de Alarme & Alertas Clínicos Críticos (Segurança do Paciente)* (5 tópicos densos).
- *Sintomas Esperados de Retirada* (5 tópicos).
- *Não-Farmacológicos na APS (TCC-I)* (5 tópicos).

## 2. Ações Planejadas

### A. Remoção de Texto Redundante
- Remover o parágrafo explicativo redundante que antecede o cronograma:
  *"Protocolo farmacocinético e clínico estruturado pelas Diretrizes ASAM (2025) e Maudsley Deprescribing Guidelines (2024)..."*
  Os badges superiores (`Diretrizes ASAM (2025)`, `Maudsley Deprescribing 2024`, `Desmame Centrado no Paciente`) já transmitem essa informação.

### B. Implementação de Acordeões Recolhidos em Linha (Cards Clicáveis)
Adicionar controle de estado para expandir/recolher individualmente as seções de orientação:
1. **Sinais de Alarme & Alertas Críticos (Segurança do Paciente)**:
   - Card com cabeçalho âmbar sutil (`bg-amber-50/60 border-amber-200`), ícone de alerta, contador de itens e botão/chevron de expandir/recolher.
   - Padrão: recolhido, com resumo limpo de 1 linha.
2. **Sintomas Esperados de Retirada**:
   - Card recolhido (`bg-slate-50 border-slate-200 hover:bg-slate-100`), ícone de informação clínica e alternância de expansão.
3. **Manejo Não-Farmacológico na APS (TCC-I & Higiene do Sono)**:
   - Card recolhido (`bg-slate-50 border-slate-200 hover:bg-slate-100`), ícone correspondente e expansão sob demanda.

### C. Preservação Intacta do Guia para WhatsApp
- A seção de mensagem para WhatsApp continuará com sua formatação e botão de cópia de alta usabilidade.

## 3. Validação
- Executar testes automatizados com `npm test -- --run`.
- Validar a compilação com `compile_applet`.
- Remover quaisquer arquivos temporários de compilação.
