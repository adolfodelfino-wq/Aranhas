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
import { formatEemIntoObjective, sanitizeDuplicateEemHeader } from './utils/eemFormatter';
import {
  fetchPatientCloudHistory,
  syncPatientToCloud,
  sanitizeProntuarioKey,
} from './services/patientSyncService';
import { testFirestoreConnection } from './services/firebase';

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
  const [patient, setPatient] = useState<PatientSession>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nexus_patient_session');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {
      name: '',
      age: 0,
      prontuario: '',
      date: new Date().toLocaleDateString('pt-BR'),
      isDemo: false,
    };
  });

  // SOAP State (Default: Empty for real consultations)
  const [soapState, setSoapState] = useState<SoapState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nexus_soap_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.objective === 'string') {
            parsed.objective = sanitizeDuplicateEemHeader(parsed.objective);
          }
          return parsed;
        }
      } catch {}
    }
    return {
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      importedItems: [],
    };
  });

  // Scale Results State (Scale History for Patient)
  const [scaleHistory, setScaleHistory] = useState<ScaleResult[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nexus_scale_history');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });
  const [scaleResults, setScaleResults] = useState<ScaleResult[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nexus_scale_results');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  // Cloud synchronization state (Silent cloud follow-up by prontuário)
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [cloudSynced, setCloudSynced] = useState<boolean>(false);

  // Test connection on boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Fetch longitudinal history from cloud when medical record (prontuário) changes
  useEffect(() => {
    const prontuario = patient.prontuario?.trim();
    if (!prontuario || patient.isDemo || prontuario.toLowerCase().includes('demo')) {
      setCloudSynced(false);
      return;
    }

    const sanitized = sanitizeProntuarioKey(prontuario);
    if (!sanitized) return;

    let isMounted = true;
    setIsSyncingCloud(true);

    fetchPatientCloudHistory(sanitized)
      .then((record) => {
        if (!isMounted) return;
        if (record && Array.isArray(record.scaleHistory) && record.scaleHistory.length > 0) {
          // Merge fetched cloud scale history with current local history (avoiding duplicate IDs)
          setScaleHistory((local) => {
            const map = new Map<string, ScaleResult>();
            // Add cloud entries first
            record.scaleHistory.forEach((item) => {
              const key = item.id || `${item.scaleId}-${item.date}-${item.consultationNumber}`;
              map.set(key, item);
            });
            // Overwrite or append with local
            local.forEach((item) => {
              const key = item.id || `${item.scaleId}-${item.date}-${item.consultationNumber}`;
              map.set(key, item);
            });
            return Array.from(map.values());
          });
          // If local name is empty or default, adopt cloud name if available
          if ((!patient.name || patient.name === 'Novo Paciente') && record.name) {
            setPatient((prev) => ({
              ...prev,
              name: record.name || prev.name,
              age: record.age !== undefined && record.age > 0 ? record.age : prev.age,
            }));
          }
          setCloudSynced(true);
        } else {
          setCloudSynced(false);
        }
      })
      .catch(() => {
        if (isMounted) setCloudSynced(false);
      })
      .finally(() => {
        if (isMounted) setIsSyncingCloud(false);
      });

    return () => {
      isMounted = false;
    };
  }, [patient.prontuario, patient.isDemo]);

  // Persist consultation state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nexus_patient_session', JSON.stringify(patient));
      } catch {}
    }
  }, [patient]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nexus_soap_state', JSON.stringify(soapState));
      } catch {}
    }
  }, [soapState]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nexus_scale_history', JSON.stringify(scaleHistory));
      } catch {}
    }
  }, [scaleHistory]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nexus_scale_results', JSON.stringify(scaleResults));
      } catch {}
    }
  }, [scaleResults]);

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
    const cleanPatient: PatientSession = {
      name: customPatient?.name !== undefined ? customPatient.name.trim() : '',
      age: typeof customPatient?.age === 'number' && customPatient.age > 0 ? customPatient.age : 0,
      prontuario: customPatient?.prontuario !== undefined ? customPatient.prontuario.trim() : '',
      date: customPatient?.date || new Date().toLocaleDateString('pt-BR'),
      isDemo: false,
    };
    setPatient(cleanPatient);

    const emptySoap: SoapState = {
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      importedItems: [],
    };
    setSoapState(emptySoap);

    // Zero out all active scales and historical consultations completely
    setScaleResults([]);
    setScaleHistory([]);
    setCloudSynced(false);
    setIsSyncingCloud(false);

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

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nexus_patient_session', JSON.stringify(cleanPatient));
        localStorage.setItem('nexus_soap_state', JSON.stringify(emptySoap));
        localStorage.setItem('nexus_scale_history', JSON.stringify([]));
        localStorage.setItem('nexus_scale_results', JSON.stringify([]));
      } catch {}
    }
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

    const updatedHistory = [...scaleHistory, entryWithMeta];
    setScaleHistory(updatedHistory);

    setScaleResults((prev) => {
      const exists = prev.some((r) => r.scaleId === newResult.scaleId);
      if (exists) {
        return prev.map((r) => (r.scaleId === newResult.scaleId ? entryWithMeta : r));
      }
      return [...prev, entryWithMeta];
    });

    // Silently synchronize updated longitudinal history to the cloud if patient has a prontuário
    if (patient.prontuario && !patient.isDemo) {
      setIsSyncingCloud(true);
      syncPatientToCloud(patient, updatedHistory)
        .then((success) => {
          if (success) setCloudSynced(true);
        })
        .finally(() => {
          setIsSyncingCloud(false);
        });
    }
  };

  const handleDeleteScaleResult = (id?: string, index?: number) => {
    setScaleHistory((prev) => {
      const updated = prev.filter((item, idx) => {
        if (id && item.id) return item.id !== id;
        if (index !== undefined) return idx !== index;
        return item.scaleId !== id;
      });
      if (patient.prontuario && !patient.isDemo) {
        setIsSyncingCloud(true);
        syncPatientToCloud(patient, updated)
          .then((success) => {
            if (success) setCloudSynced(true);
          })
          .finally(() => {
            setIsSyncingCloud(false);
          });
      }
      return updated;
    });

    setScaleResults((prev) =>
      prev.filter((item, idx) => {
        if (id && item.id) return item.id !== id;
        if (index !== undefined) return idx !== index;
        return item.scaleId !== id;
      })
    );
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
    const isEem = title.toLowerCase().includes('exame do estado mental') || title.toLowerCase().includes('eem');
    const updatedObjective = isEem
      ? formatEemIntoObjective(soapState.objective, text)
      : (soapState.objective.trim() ? `${soapState.objective.trim()}\n\n${text}` : text);

    setSoapState((prev) => ({
      ...prev,
      objective: sanitizeDuplicateEemHeader(updatedObjective),
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
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4">
        <PatientSelfFillModal
          scaleId={patientUrlMode.scaleId}
          patientName={patientUrlMode.patientName || patient.name || 'Paciente'}
          onClose={() => {
            setPatientUrlMode({
              isPatient: false,
              scaleId: patientUrlMode.scaleId,
              patientName: patient.name || 'Paciente',
            });
            setSelectedScaleId(patientUrlMode.scaleId);
            setCurrentView('scales');
            updateBrowserHistory('scales', { scaleId: patientUrlMode.scaleId });
          }}
          onSaveResult={(res) => {
            const enriched: ScaleResult = {
              ...res,
              isSelfAdministered: true,
              soapText:
                res.soapText ||
                `${res.scaleTitle}: ${res.totalScore}/${res.maxScore} pts (${res.classification}) [Autoaplicação no Tablet/PC]`,
            };
            handleSaveScaleResult(enriched);
            const soapEntry = `[Autoaplicação no Tablet/PC - ${res.scaleTitle || res.scaleId}] Pontuação: ${res.totalScore}/${res.maxScore} pts (${res.classification}) | Respostas: [${(res.answersArray || []).join(', ')}] | Registro eletrônico às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
            handleImportToSoapObjective(soapEntry, `Autoaplicação: ${res.scaleTitle || res.scaleId}`);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-700 selection:text-white w-full max-w-full overflow-x-hidden">
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
        isSyncingCloud={isSyncingCloud}
        cloudSynced={cloudSynced}
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
        <main className="flex-1 w-full max-w-full min-w-0 px-2 py-3 sm:px-6 sm:py-6 lg:px-8 lg:py-8 overflow-y-auto overflow-x-hidden bg-slate-50">
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
                onDeleteScaleResult={handleDeleteScaleResult}
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
