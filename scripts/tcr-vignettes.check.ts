import { generateHealthEducationSuggestions } from '../src/utils/healthEducationEngine';
import { getEmptyEemState } from '../src/utils/eemSelection';
import { PHQ9_SCALE, GAD7_SCALE } from '../src/data/scalesData';
const em=(data:any={})=>({...getEmptyEemState(),...data});
function scale(s:any,a:any){return {...s.calculateResult(a),answersSummary:s.questions.map((q:any)=>({questionText:q.text,value:a[q.id]??0,answerLabel:'sintético'}))};}
const phq6=scale(PHQ9_SCALE,{q1:2,q2:2,q3:2,q4:0,q5:0,q6:0,q7:0,q8:0,q9:0});
const gad6=scale(GAD7_SCALE,{q1:2,q2:2,q3:2,q4:0,q5:0,q6:0,q7:0});
const partial=scale(PHQ9_SCALE,{q9:1});
const cases=[
{id:'V01',contexto:'Pessoa adulta sem achados nem escalas informados.',eem:em(),scales:[],criterio:'Não gerar sugestões específicas de depressão ou ansiedade por dados ausentes.',check:(r:any)=>!r.suggestions.some((s:any)=>['sug-depressao-rotina','sug-ansiedade-manejo'].includes(s.id))},
{id:'V02',contexto:'Humor triste registrado no EEM e PHQ-9 completo com total 6.',eem:em({humor:['distimico']}),scales:[phq6],criterio:'Apresentar sugestão relacionada à depressão com correspondência combinada EEM e PHQ-9.',check:(r:any)=>r.suggestions.some((s:any)=>s.id==='sug-depressao-rotina'&&s.isComboMatch)},
{id:'V03',contexto:'Humor ansioso no EEM e GAD-7 completo com total 6.',eem:em({humor:['ansioso']}),scales:[gad6],criterio:'Apresentar sugestão relacionada à ansiedade com correspondência combinada EEM e GAD-7.',check:(r:any)=>r.suggestions.some((s:any)=>s.id==='sug-ansiedade-manejo'&&s.isComboMatch)},
{id:'V04',contexto:'PHQ-9 incompleto com item 9 positivo.',eem:em(),scales:[partial],criterio:'Sinalizar necessidade prioritária de avaliação clínica de segurança.',check:(r:any)=>r.hasHighRiskWarning},
{id:'V05',contexto:'Ideação suicida selecionada no conteúdo do pensamento, sem escala.',eem:em({pensamentoConteudo:['conteudo_ideacao_suicida']}),scales:[],criterio:'Sinalizar necessidade de avaliação de segurança também pelo achado do EEM.',check:(r:any)=>r.hasHighRiskWarning},
{id:'V06',contexto:'Observação livre: paciente nega insônia; sem escalas.',eem:em({observacoesLivres:'Paciente nega insônia.'}),scales:[],criterio:'Não atribuir alteração de sono exclusivamente ao termo negado.',check:(r:any)=>!r.suggestions.some((s:any)=>s.id==='sug-sono')},
];
for(const c of cases){const out=generateHealthEducationSuggestions(c.scales,c.eem);console.log(JSON.stringify({id:c.id,contexto:c.contexto,criterio:c.criterio,atendeu:c.check(out),alerta:out.hasHighRiskWarning,sugestoes:out.suggestions.map(s=>({id:s.id,combinada:s.isComboMatch,origens:s.matchedSources,preselecionada:s.selected}))}));}
