import React, { useState } from 'react';
import { ALL_SCALES } from '../data/scalesData';
import { ScaleResult } from '../types';
import { cleanOptionLabel } from './ScalesView';
import {
  Smartphone,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  X,
  Check,
} from 'lucide-react';

interface PatientSelfFillModalProps {
  scaleId?: string;
  patientName?: string;
  onClose: () => void;
  onSaveResult?: (result: ScaleResult, rawAnswers?: Record<string, number>) => void;
}

export const PatientSelfFillModal: React.FC<PatientSelfFillModalProps> = ({
  scaleId = 'phq-9',
  patientName = 'Paciente',
  onClose,
  onSaveResult,
}) => {
  const normalizedScaleId = (scaleId || 'phq-9').toLowerCase().trim();
  const scale =
    ALL_SCALES.find(
      (s) =>
        s.id === normalizedScaleId ||
        s.id === normalizedScaleId.replace('-', '') ||
        s.id.replace('-', '') === normalizedScaleId.replace('-', '')
    ) || ALL_SCALES[0];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ScaleResult | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const currentQuestion = scale.questions[currentQuestionIndex];
  const totalQuestions = scale.questions.length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (value: number) => {
    const updated = { ...answers, [currentQuestion.id]: value };
    setAnswers(updated);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const computed = scale.calculateResult(updated);
      const answersSummary = scale.questions.map((q) => {
        const val = updated[q.id];
        const matchedOpt = q.options.find((o) => o.value === val);
        return {
          questionText: q.text,
          answerLabel: matchedOpt ? matchedOpt.label : 'Não respondido',
          value: val ?? 0,
        };
      });

      const fullResult: ScaleResult = {
        ...computed,
        scaleId: scale.id,
        scaleTitle: scale.title,
        isSelfAdministered: true,
        answersSummary,
        answersArray: scale.questions.map((q) => updated[q.id] ?? 0),
        date:
          new Date().toLocaleDateString('pt-BR') +
          ' ' +
          new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setResult(fullResult);
      if (onSaveResult) {
        onSaveResult(fullResult, updated);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSendResponseToClinic = () => {
    if (!result) return;

    const answersArr = result.answersArray || scale.questions.map((q) => answers[q.id] ?? 0);
    const answersStr = `[${answersArr.join(', ')}]`;

    const summaryText = `Olá, Dr.(a)! Concluí o preenchimento da escala *${scale.acronym}* no Nexus Clínico.

📊 *Resultado:*
- Paciente: ${patientName}
- Escala: ${scale.title} (${scale.acronym})
- Pontuação Total: ${result.totalScore} / ${result.maxScore} pts
- Classificação: ${result.classification}
- Respostas por Item: ${answersStr}

Obrigado!`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(summaryText)}`;
    window.open(waUrl, '_blank');
    setSubmitted(true);
  };

  const handleFinishAndReturn = () => {
    if (result && onSaveResult) {
      onSaveResult(result, answers);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 text-slate-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col my-auto min-h-[500px] font-sans">
        {/* Mobile Header Bar */}
        <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-teal-50 border border-teal-200 p-2 rounded-lg text-teal-700">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-teal-800 uppercase tracking-wider">
                Questionário do Paciente
              </div>
              <h2 className="text-base font-semibold text-slate-900">{scale.acronym} - {scale.title}</h2>
            </div>
          </div>

          <button
            onClick={handleFinishAndReturn}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Fechar questionário"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Questionnaire Flow */}
        {!result ? (
          <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Pergunta {currentQuestionIndex + 1} de {totalQuestions}</span>
                <span className="text-teal-700 font-semibold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 border border-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-700 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            <div className="space-y-2 py-2">
              <h3 className="text-lg font-semibold text-slate-900 leading-snug">
                {currentQuestion.text}
              </h3>
              {currentQuestion.instruction && (
                <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {currentQuestion.instruction}
                </p>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = answers[currentQuestion.id] === opt.value;
                return (
                  <button
                    key={`self-opt-${currentQuestion.id}-${optIdx}-${opt.value}`}
                    type="button"
                    onClick={() => handleSelectOption(opt.value)}
                    className={`w-full p-3.5 rounded-lg border text-left text-sm transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-700 text-teal-950 font-medium shadow-xs ring-1 ring-teal-700/20'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cleanOptionLabel(opt.label)}</span>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-2 ${
                        isSelected ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Footer */}
            <div className="pt-3 flex justify-between items-center border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-teal-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                answers[currentQuestion.id] !== undefined && (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-3 py-1.5 text-xs font-medium text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Próxima</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )
              ) : (
                Object.keys(answers).length >= totalQuestions && (
                  <button
                    type="button"
                    onClick={() => {
                      const computed = scale.calculateResult(answers);
                      const answersSummary = scale.questions.map((q) => {
                        const val = answers[q.id];
                        const matchedOpt = q.options.find((o) => o.value === val);
                        return {
                          questionText: q.text,
                          answerLabel: matchedOpt ? cleanOptionLabel(matchedOpt.label) : 'Não respondido',
                          value: val ?? 0,
                        };
                      });
                      const fullResult: ScaleResult = {
                        ...computed,
                        scaleId: scale.id,
                        scaleTitle: scale.title,
                        isSelfAdministered: true,
                        answersSummary,
                        answersArray: scale.questions.map((q) => answers[q.id] ?? 0),
                        date:
                          new Date().toLocaleDateString('pt-BR') +
                          ' ' +
                          new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                      };
                      setResult(fullResult);
                      if (onSaveResult) {
                        onSaveResult(fullResult, answers);
                      }
                    }}
                    className="px-4 py-1.5 text-xs font-semibold bg-teal-700 text-white rounded-lg hover:bg-teal-800 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Finalizar</span>
                    <Check className="w-4 h-4" />
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          /* Finished Screen */
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Registrado no Prontuário da Consulta</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Questionário Concluído!</h3>
              <p className="text-xs text-slate-600 max-w-sm">
                Obrigado, {patientName}. Suas respostas foram computadas e estão salvas no sistema para avaliação do médico.
              </p>
            </div>

            <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-left text-xs">
              <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">Pontuação:</span>
                <span className="font-mono font-semibold text-slate-900 text-sm">{result.totalScore} / {result.maxScore} pts</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500 font-medium">Classificação:</span>
                <span className="font-medium text-slate-800">{result.classification}</span>
              </div>
            </div>

            <div className="w-full space-y-2 pt-2">
              <button
                type="button"
                onClick={handleFinishAndReturn}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg text-sm flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 text-teal-200" />
                <span>Concluir e Devolver ao Médico</span>
              </button>

              <button
                type="button"
                onClick={handleSendResponseToClinic}
                className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-slate-400" />
                <span>{submitted ? 'Enviado!' : 'Enviar cópia para meu WhatsApp (Opcional)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
