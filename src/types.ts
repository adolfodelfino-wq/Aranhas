export type NavView =
  | 'dashboard'
  | 'scales'
  | 'eem'
  | 'soap'
  | 'calculators';

export interface PatientSession {
  id?: string;
  name: string;
  age: number;
  gender?: string;
  prontuario: string;
  unit?: string;
  date: string;
  active?: boolean;
  isDemo?: boolean;
}

export interface ScaleQuestionOption {
  label: string;
  value: number;
}

export interface ScaleQuestion {
  id: string;
  text: string;
  instruction?: string;
  options: ScaleQuestionOption[];
  subscale?: string;
}

export interface ClinicalConductStep {
  title: string;
  description: string;
  badge?: string;
  badgeType?: 'neutral' | 'warning' | 'danger' | 'success';
}

export interface ClinicalMonitoringGoal {
  title: string;
  description: string;
}

export interface ClinicalPearl {
  type: 'pearl' | 'pitfall' | 'alert' | 'evidence';
  title: string;
  text: string;
  reference?: string;
}

export interface ScaleDefinition {
  id: string;
  title: string;
  acronym: string;
  targetGroup: string;
  description: string;
  instructions: string;
  shortInstruction?: string;
  referenceCitation?: string;
  validationInfo?: string;
  cutoffInfo?: string;
  estimatedMinutes?: number;
  questions: ScaleQuestion[];
  calculateResult: (answers: Record<string, number>) => ScaleResult;
  clinicalConductSteps?: ClinicalConductStep[];
  monitoringGoals?: ClinicalMonitoringGoal[];
  clinicalPearls?: ClinicalPearl[];
}

export interface ScaleResult {
  id?: string;
  date?: string;
  consultationNumber?: number;
  scaleId: string;
  scaleTitle: string;
  totalScore: number;
  maxScore: number;
  classification: string;
  severityLevel: 'low' | 'moderate' | 'high' | 'severe';
  interpretation: string;
  recommendations: string[];
  soapText: string;
  answersSummary?: { questionText: string; answerLabel: string; value: number }[];
  answersArray?: number[];
}

export interface EemDomainOption {
  id: string;
  label: string;
  description?: string;
}

export interface EemDomain {
  id: string;
  title: string;
  instructions?: string;
  options: EemDomainOption[];
}

export interface EemState {
  aparencia: string[];
  aparenciaOutros: string;
  atitude: string[];
  atitudeOutros: string;
  fala: string[];
  falaOutros: string;
  humor: string[];
  humorOutros: string;
  afeto: string[];
  afetoOutros: string;
  pensamentoCurso: string[];
  pensamentoForma: string[];
  pensamentoConteudo: string[];
  pensamentoOutros: string;
  sensopercepcao: string[];
  sensopercepcaoOutros: string;
  orientacao: string[];
  orientacaoOutros: string;
  atencaoMemoria: string[];
  atencaoMemoriaOutros: string;
  insight: string[];
  insightOutros: string;
  julgamento: string[];
  julgamentoOutros: string;
  observacoesLivres: string;
}

export interface SoapImportedItem {
  id?: string;
  type?: 'scale' | 'eem' | 'calculator' | 'education' | 'ai' | 'other';
  title: string;
  content?: string;
  timestamp?: string;
  targetSection: 'S' | 'O' | 'A' | 'P' | 'SOAP';
}

export interface SoapState {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  importedItems: SoapImportedItem[];
}

export interface CalculatorResult {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  interpretation: string;
  soapText: string;
  details?: Record<string, any>;
}

export interface EducationMaterial {
  id: string;
  topic: 'TDAH' | 'Depressão' | 'Ansiedade' | 'Sono' | 'Crises & Segurança' | 'Psicofármacos';
  title: string;
  targetAudience: string;
  summary: string;
  practicalActions: string[];
  fullText: string;
  printFriendly: string;
}

export interface EvidenceReference {
  id: string;
  topic: string;
  title: string;
  source: string;
  year: string;
  summary: string;
  keyPoints: string[];
  url?: string;
}

export interface EducationSuggestion {
  id: string;
  topic: string;
  title: string;
  shortDescription: string;
  soapPhrase: string;
  reasonText: string;
  matchedSources: string[];
  isComboMatch: boolean;
  selected: boolean;
  isEditing?: boolean;
}
