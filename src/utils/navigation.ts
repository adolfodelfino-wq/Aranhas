import { NavView } from '../types';

export type CalculatorTabId = 'antidepressant' | 'antipsychotic' | 'egfr' | 'cv';

export interface RouteState {
  view: NavView;
  scaleId: string;
  calcTab: CalculatorTabId;
  isPatientMode: boolean;
  patientScaleId: string;
  patientName: string;
  modalTab?: 'sobre' | 'desenvolvedor' | 'contato' | 'evidencias';
}

const CALC_TAB_ALIASES: Record<string, CalculatorTabId> = {
  antidepressant: 'antidepressant',
  'troca-antidepressivo': 'antidepressant',
  'troca-antidepressivos': 'antidepressant',
  antipsychotic: 'antipsychotic',
  cpze: 'antipsychotic',
  antipsicoticos: 'antipsychotic',
  egfr: 'egfr',
  'ckd-epi': 'egfr',
  clearence: 'egfr',
  cv: 'cv',
  'risco-cv': 'cv',
  framingham: 'cv',
  score: 'cv',
};

/**
 * Parses the current window.location into a structured RouteState
 */
export function parseCurrentLocation(): RouteState {
  if (typeof window === 'undefined') {
    return {
      view: 'dashboard',
      scaleId: 'phq-9',
      calcTab: 'antidepressant',
      isPatientMode: false,
      patientScaleId: 'phq-9',
      patientName: '',
    };
  }

  const pathname = window.location.pathname.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);

  // Check patient mode
  const modeParam = searchParams.get('mode');
  const isPatientMode = modeParam === 'patient' || pathname.startsWith('/autoaplicacao');
  const patientScaleId = searchParams.get('scale') || (pathname.startsWith('/autoaplicacao/') ? pathname.split('/')[2] : 'phq-9');
  const patientName = searchParams.get('p') || 'Paciente';

  // Check modal param
  const modalParam = searchParams.get('modal') as RouteState['modalTab'] | null;
  const modalTab = modalParam && ['sobre', 'desenvolvedor', 'contato', 'evidencias'].includes(modalParam) ? modalParam : undefined;

  // Defaults
  let view: NavView = 'dashboard';
  let scaleId = 'phq-9';
  let calcTab: CalculatorTabId = 'antidepressant';

  const segments = pathname.split('/').filter(Boolean);
  const primarySegment = segments[0] || '';
  const secondarySegment = segments[1] || '';

  if (primarySegment === 'escalas' || primarySegment === 'escala' || primarySegment === 'scales') {
    view = 'scales';
    if (secondarySegment) {
      scaleId = secondarySegment;
    }
  } else if (primarySegment === 'calculadoras' || primarySegment === 'calculadora' || primarySegment === 'calculators') {
    view = 'calculators';
    if (secondarySegment && CALC_TAB_ALIASES[secondarySegment]) {
      calcTab = CALC_TAB_ALIASES[secondarySegment];
    }
  } else if (primarySegment === 'eem' || primarySegment === 'exame-mental' || primarySegment === 'exame-estado-mental') {
    view = 'eem';
  } else if (primarySegment === 'soap' || primarySegment === 'prontuario' || primarySegment === 'registro-soap') {
    view = 'soap';
  } else if (primarySegment === 'dashboard' || primarySegment === '') {
    view = 'dashboard';
  }

  return {
    view,
    scaleId,
    calcTab,
    isPatientMode,
    patientScaleId,
    patientName,
    modalTab,
  };
}

/**
 * Builds a clean canonical URL path for any view/scale/calculator
 */
export function buildCanonicalPath(
  view: NavView,
  options?: {
    scaleId?: string;
    calcTab?: CalculatorTabId;
    modalTab?: string;
  }
): string {
  let path = '/';

  switch (view) {
    case 'dashboard':
      path = '/';
      break;
    case 'scales':
      path = options?.scaleId ? `/escalas/${options.scaleId}` : '/escalas';
      break;
    case 'calculators':
      path = options?.calcTab ? `/calculadoras/${options.calcTab}` : '/calculadoras';
      break;
    case 'eem':
      path = '/eem';
      break;
    case 'soap':
      path = '/soap';
      break;
    default:
      path = '/';
  }

  if (options?.modalTab) {
    path += `?modal=${options.modalTab}`;
  }

  return path;
}

/**
 * Safely updates browser URL using HTML5 History API without page reload
 */
export function updateBrowserHistory(
  view: NavView,
  options?: {
    scaleId?: string;
    calcTab?: CalculatorTabId;
    modalTab?: string;
    replace?: boolean;
  }
): void {
  if (typeof window === 'undefined') return;

  const targetPath = buildCanonicalPath(view, options);
  const currentPath = window.location.pathname + window.location.search;

  if (targetPath === currentPath) return;

  try {
    if (options?.replace) {
      window.history.replaceState({ view, ...options }, '', targetPath);
    } else {
      window.history.pushState({ view, ...options }, '', targetPath);
    }
  } catch (err) {
    console.error('Failed to update browser history:', err);
  }
}
