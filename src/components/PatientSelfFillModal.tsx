import React, { useState } from 'react';
import { ALL_SCALES } from '../data/scalesData';
import { ScaleResult } from '../types';
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
  onSaveResult?: (result: ScaleResult) => void;
}

export const PatientSelfFillModal: React.FC<PatientSelfFillModalProps> = ({
  scaleId = 'phq9',
  patientName = 'Maria da Silva',
  onClose,
  onSaveResult,
}) => {
  const scale = ALL_SCALES.find((s) => s.id === scaleId) || ALL_SCALES[0];

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

      const fullResult = { ...computed, answersSummary };
      setResult(fullResult);
      if (onSaveResult) {
        onSaveResult(fullResult);
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
              <div className="font-mono text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                Questionário do Paciente
              </div>
              <h2 className="text-base font-bold text-slate-900">{scale.acronym} - {scale.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Questionnaire Flow */}
        {!result ? (
          <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-600">
                <span>Pergunta {currentQuestionIndex + 1} de {totalQuestions}</span>
                <span className="text-teal-700">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 border border-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            <div className="space-y-2 py-2">
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {currentQuestion.text}
              </h3>
              {currentQuestion.instruction && (
                <p className="text-xs text-slate-500 italic">
                  {currentQuestion.instruction}
                </p>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption(opt.value)}
                    className={`w-full p-3.5 rounded-lg border text-left text-sm transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ml-2 ${
                        isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Footer */}
            <div className="pt-3 flex justify-between items-center border-t border-slate-100">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-3.5 py-2 text-xs font-mono uppercase font-bold text-slate-700 hover:text-teal-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <span className="font-mono text-[10px] text-slate-400 uppercase">
                Salvo automaticamente
              </span>
            </div>
          </div>
        ) : (
          /* Finished Screen */
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Questionário Concluído!</h3>
              <p className="text-xs text-slate-600">
                Obrigado por responder, {patientName}. Suas respostas já foram salvas para a consulta.
              </p>
            </div>

            <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-left text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-mono text-[11px] uppercase font-semibold text-slate-500">Pontuação:</span>
                <span className="font-mono font-bold text-teal-700 text-sm">{result.totalScore} / {result.maxScore} pts</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-mono text-[11px] uppercase font-semibold text-slate-500">Classificação:</span>
                <span className="font-bold text-slate-900">{result.classification}</span>
              </div>
            </div>

            <div className="w-full space-y-2 pt-2">
              <button
                onClick={handleSendResponseToClinic}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-mono font-bold uppercase tracking-wider rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{submitted ? 'Enviado!' : 'Enviar Resumo via WhatsApp'}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-mono font-semibold uppercase tracking-wider rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
