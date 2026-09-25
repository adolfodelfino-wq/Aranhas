import React, { useState, useEffect, useCallback } from 'react';
import { NavView, PatientSession, SoapState, ScaleResult, EemState } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ScalesView } from './components/ScalesView';
import { EemView } from './components/EemView';
import { SoapView } from './components/SoapView';
import { EemSoapWorkstationView } from './components/EemSoapWorkstationView';
import { CalculatorsView } from './components/CalculatorsView';
import { ContextualEducationModal } from './components/ContextualEducationModal';
import { AboutModal, AboutModalTab } from './components/AboutModal';
import { SourceCodeModal } from './components/SourceCodeModal';
import { PatientSelfFillModal } from './components/PatientSelfFillModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import {
  parseCurrentLocation,
  updateBrowserHistory,
  CalculatorTabId,
} from './utils/navigation';
import {
  DEMO_PATIENT,
  DEMO_SOAP,
  DEMO_EEM,
  DEMO_SCALE_HISTORY,
  DEMO_SCALE_RESULTS,
} from './data/demoPatientData';

export const App: React.FC = () => {
  // Parse initial route from URL
  const initialRoute = parseCurrentLocation();

  const [currentView, setCurrentView] = useState<NavView>(initialRoute.view);
  const [selectedScaleId, setSelectedScaleId] = useState<string>(initialRoute.scaleId);
  const [selectedCalcTab, setSelectedCalcTab] = useState<CalculatorTabId>(initialRoute.calcTab);
  const [focusSubjectiveTrigger, setFocusSubjectiveTrigger] = useState(0);
  const [showAbout, setShowAbout] = useState(Boolean(initialRoute.modalTab));
  const [aboutTab, setAboutTab] = useState<AboutModalTab>(initialRoute.modalTab || 'sobre');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showContextualEducation, setShowContextualEducation] = useState(false);

  // Check URL parameters for direct patient self-fill access (?mode=patient&scale=phq-9&p=Nome)
  const [patientUrlMode, setPatientUrlMode] = useState<{ isPatient: boolean; scaleId: string; patientName: string }>({
    isPatient: initialRoute.isPatientMode,
    scaleId: initialRoute.patientScaleId,
    patientName: initialRoute.patientName,
  });

  // Centralized Navigation with History Synchronization
  const handleNavigate = useCallback((view: NavView, options?: { scaleId?: string; calcTab?: CalculatorTabId; replace?: boolean }) => {
    setCurrentView(view);
    if (options?.scaleId) {
      setSelectedScaleId(options.scaleId);
    }
    if (options?.calcTab) {
      setSelectedCalcTab(options.calcTab);
    }
    updateBrowserHistory(view, {
      scaleId: options?.scaleId || (view === 'scales' ? selectedScaleId : undefined),
      calcTab: options?.calcTab || (view === 'calculators' ? selectedCalcTab : undefined),
      replace: options?.replace,
    });
  }, [selectedScaleId, selectedCalcTab]);

  const handleSelectScale = useCallback((scaleId: string) => {
    setSelectedScaleId(scaleId);
    setCurrentView('scales');
    updateBrowserHistory('scales', { scaleId });
  }, []);

  const handleSelectCalculator = useCallback((calcTab: CalculatorTabId) => {
    setSelectedCalcTab(calcTab);
    setCurrentView('calculators');
    updateBrowserHistory('calculators', { calcTab });
  }, []);

  // Listen to browser Back / Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseCurrentLocation();
      setCurrentView(route.view);
      setSelectedScaleId(route.scaleId);
      setSelectedCalcTab(route.calcTab);
      setPatientUrlMode({
        isPatient: route.isPatientMode,
        scaleId: route.patientScaleId,
        patientName: route.patientName,
      });
      if (route.modalTab) {
        setAboutTab(route.modalTab);
        setShowAbout(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenAboutWithTab = (tab: AboutModalTab = 'sobre') => {
    setAboutTab(tab);
    setShowAbout(true);
    updateBrowserHistory(currentView, {
      scaleId: currentView === 'scales' ? selectedScaleId : undefined,
      calcTab: currentView === 'calculators' ? selectedCalcTab : undefined,
      modalTab: tab,
    });
  };

  const handleCloseAbout = () => {
    setShowAbout(false);
    updateBrowserHistory(currentView, {
      scaleId: currentView === 'scales' ? selectedScaleId : undefined,
      calcTab: currentView === 'calculators' ? selectedCalcTab : undefined,
    });
  };

  // Active Patient Session (Default: Blank patient for real clinical use)
  const [patient, setPatient] = useState<PatientSession>({
    name: '',
    age: 0,
    prontuario: '',
    date: new Date().toLocaleDateString('pt-BR'),
    isDemo: false,
  });

  // SOAP State (Default: Empty for real consultations)
  const [soapState, setSoapState] = useState<SoapState>({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    importedItems: [],
  });

  // Scale Results State (Scale History for Patient)
  const [scaleHistory, setScaleHistory] = useState<ScaleResult[]>([]);
  const [scaleResults, setScaleResults] = useState<ScaleResult[]>([]);

  // EEM State
  const [eemState, setEemState] = useState<EemState>({
    aparencia: [],
    aparenciaOutros: '',
    atitude: [],
    atitudeOutros: '',
    fala: [],
    falaOutros: '',
    humor: [],
    humorOutros: '',
    afeto: [],
    afetoOutros: '',
    pensamentoCurso: [],
    pensamentoForma: [],
    pensamentoConteudo: [],
    pensamentoOutros: '',
    sensopercepcao: [],
    sensopercepcaoOutros: '',
    orientacao: [],
    orientacaoOutros: '',
    atencaoMemoria: [],
    atencaoMemoriaOutros: '',
    insight: [],
    insightOutros: '',
    julgamento: [],
    julgamentoOutros: '',
    observacoesLivres: '',
  });

  const handleResetNewPatient = (customPatient?: Partial<PatientSession>) => {
    setPatient({
      name: customPatient?.name?.trim() || 'Novo Paciente',
      age: typeof customPatient?.age === 'number' ? customPatient.age : 30,
      prontuario: customPatient?.prontuario?.trim() || `${Math.floor(100000 + Math.random() * 900000)}-0`,
      date: customPatient?.date || new Date().toLocaleDateString('pt-BR'),
    });

    setSoapState({
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      importedItems: [],
    });

    // Zero out all active scales and historical consultations completely
    setScaleResults([]);
    setScaleHistory([]);

    setEemState({
      aparencia: [],
      aparenciaOutros: '',
      atitude: [],
      atitudeOutros: '',
      fala: [],
      falaOutros: '',
      humor: [],
      humorOutros: '',
      afeto: [],
      afetoOutros: '',
      pensamentoCurso: [],
      pensamentoForma: [],
      pensamentoConteudo: [],
      pensamentoOutros: '',
      sensopercepcao: [],
      sensopercepcaoOutros: '',
      orientacao: [],
      orientacaoOutros: '',
      atencaoMemoria: [],
      atencaoMemoriaOutros: '',
      insight: [],
      insightOutros: '',
      julgamento: [],
      julgamentoOutros: '',
      observacoesLivres: '',
    });
  };

  const handleLoadDemoPatient = () => {
    setPatient(DEMO_PATIENT);
    setSoapState(DEMO_SOAP);
    setScaleResults(DEMO_SCALE_RESULTS);
    setScaleHistory(DEMO_SCALE_HISTORY);
    setEemState(DEMO_EEM);
  };

  const handleSaveScaleResult = (newResult: ScaleResult) => {
    const existingForScale = scaleHistory.filter((h) => h.scaleId === newResult.scaleId);
    const consultationNum = newResult.consultationNumber || existingForScale.length + 1;
    const entryWithMeta: ScaleResult = {
      ...newResult,
      id: newResult.id || `scale-res-${Date.now()}`,
      consultationNumber: consultationNum,
      date: newResult.date || new Date().toLocaleDateString('pt-BR'),
    };

    setScaleHistory((prev) => [...prev, entryWithMeta]);

    setScaleResults((prev) => {
      const exists = prev.some((r) => r.scaleId === newResult.scaleId);
      if (exists) {
        return prev.map((r) => (r.scaleId === newResult.scaleId ? entryWithMeta : r));
      }
      return [...prev, entryWithMeta];
    });
  };

  const handleUpdateEem = (updated: EemState) => {
    setEemState(updated);
  };

  const handleConfirmEducationToPlan = (formattedText: string, titlesSummary: string) => {
    if (!formattedText.trim()) return;

    const existing = soapState.plan.trim();
    const updatedPlan = existing ? `${existing}\n\n${formattedText}` : formattedText;

    setSoapState((prev) => ({
      ...prev,
      plan: updatedPlan,
      importedItems: [
        ...prev.importedItems,
        {
          id: `edu-${Date.now()}`,
          type: 'education',
          title: `Educação em Saúde: ${titlesSummary}`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          targetSection: 'P',
        },
      ],
    }));
  };

  // Helper to import formatted text into SOAP sections
  const handleImportToSoapObjective = (text: string, title: string) => {
    const existing = soapState.objective.trim();
    const updatedObjective = existing ? `${existing}\n\n${text}` : text;

    setSoapState((prev) => ({
      ...prev,
      objective: updatedObjective,
      importedItems: [...prev.importedItems, { title, targetSection: 'O' }],
    }));
  };

  const handleImportToSoapPlan = (text: string, title: string) => {
    const existing = soapState.plan.trim();
    const updatedPlan = existing ? `${existing}\n\n${text}` : text;

    setSoapState((prev) => ({
      ...prev,
      plan: updatedPlan,
      importedItems: [...prev.importedItems, { title, targetSection: 'P' }],
    }));
  };

  if (patientUrlMode.isPatient) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <PatientSelfFillModal
          scaleId={patientUrlMode.scaleId}
          patientName={patientUrlMode.patientName}
          onClose={() => {
            if (typeof window !== 'undefined') {
              window.location.href = window.location.pathname;
            }
          }}
          onSaveResult={(res) => {
            console.log('Patient submitted response:', res);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#0F172A] flex flex-col font-sans selection:bg-[#0A3B74] selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Top Header */}
      <Header
        currentView={currentView}
        patient={patient}
        onUpdatePatient={setPatient}
        onResetNewPatient={handleResetNewPatient}
        onLoadDemoPatient={handleLoadDemoPatient}
        onOpenAbout={() => handleOpenAboutWithTab('sobre')}
        onOpenAboutWithTab={handleOpenAboutWithTab}
        onOpenCodeExport={() => setShowCodeModal(true)}
        onNavigate={handleNavigate}
        onSelectScale={handleSelectScale}
      />

      {/* Main Flexible Body - 100% screen width on all devices */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-full min-w-0">
        {/* Navigation Sidebar / Mobile Nav Bar */}
        <Sidebar
          currentView={currentView}
          onSelectView={handleNavigate}
          importedCount={soapState.importedItems.length}
        />

        {/* Content Area - Adjusted mobile paddings (px-2 py-3) for edge-to-edge layout without empty right margins */}
        <main className="flex-1 w-full max-w-full min-w-0 px-2 py-3 sm:px-6 sm:py-6 lg:px-8 lg:py-8 overflow-y-auto overflow-x-hidden bg-[#F4F6F9]">
          <ErrorBoundary>
            {currentView === 'dashboard' && (
              <DashboardView
                patient={patient}
                soapState={soapState}
                onNavigate={handleNavigate}
                onSelectScale={handleSelectScale}
                onSelectCalculator={handleSelectCalculator}
                scaleHistory={scaleHistory}
                onOpenEducationSuggestions={() => setShowContextualEducation(true)}
                onOpenAboutWithTab={handleOpenAboutWithTab}
                onStartNewConsultation={() => {
                  handleResetNewPatient();
                  handleNavigate('soap');
                  setFocusSubjectiveTrigger((prev) => prev + 1);
                }}
              />
            )}

            {currentView === 'scales' && (
              <ScalesView
                onImportToSoap={handleImportToSoapObjective}
                onSaveScaleResult={handleSaveScaleResult}
                onOpenEducationSuggestions={() => setShowContextualEducation(true)}
                patientName={patient.name}
                scaleHistory={scaleHistory}
                initialScaleId={selectedScaleId}
                onSelectScaleId={(id) => {
                  setSelectedScaleId(id);
                  updateBrowserHistory('scales', { scaleId: id });
                }}
                onLoadDemoHistory={handleLoadDemoPatient}
              />
            )}

            {(currentView === 'soap' || currentView === 'eem') && (
              <EemSoapWorkstationView
                soapState={soapState}
                patient={patient}
                eemState={eemState}
                scaleHistory={scaleHistory}
                onUpdateSoap={setSoapState}
                onUpdateEem={handleUpdateEem}
                onNavigate={handleNavigate}
                onResetConsultation={handleResetNewPatient}
                onOpenEvidence={() => handleOpenAboutWithTab('evidencias')}
                focusSubjectiveTrigger={focusSubjectiveTrigger}
              />
            )}

            {currentView === 'calculators' && (
              <CalculatorsView
                onImportToSoapPlan={handleImportToSoapPlan}
                onImportToSoapObjective={handleImportToSoapObjective}
                onOpenEvidenceModal={() => handleOpenAboutWithTab('evidencias')}
                initialTab={selectedCalcTab}
                onSelectTab={(tab) => {
                  setSelectedCalcTab(tab);
                  updateBrowserHistory('calculators', { calcTab: tab });
                }}
              />
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* Horizontal Footer */}
      <Footer onOpenAboutWithTab={handleOpenAboutWithTab} />

      {/* Modals */}
      {showAbout && (
        <AboutModal
          onClose={handleCloseAbout}
          onOpenCodeExport={() => setShowCodeModal(true)}
          initialTab={aboutTab}
        />
      )}
      {showCodeModal && <SourceCodeModal onClose={() => setShowCodeModal(false)} />}

      {showContextualEducation && (
        <ContextualEducationModal
          scaleResults={scaleResults}
          eemState={eemState}
          onClose={() => setShowContextualEducation(false)}
          onConfirmToPlan={handleConfirmEducationToPlan}
        />
      )}
    </div>
  );
};

export default App;
