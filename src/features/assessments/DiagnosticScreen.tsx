import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/db';
import { SmartDiagnosticEngine, DiagnosticItem } from '../../engine/diagnostic';
import { evaluateStudentAnswer } from '../../engine/misconceptions';
import { DiagnosticSessionResult } from '../../types';
import { FractionBar } from '../../components/visuals/FractionBar';
import { FractionPie } from '../../components/visuals/FractionPie';
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  CheckCircle2,
  XCircle,
  Sparkles,
  Award,
  Zap,
  Target,
  BookOpen,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DiagnosticScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isStudent } = useAuth();
  const student = isStudent && currentUser ? currentUser : db.getStudents()[0];

  const [engine] = useState<SmartDiagnosticEngine>(() => new SmartDiagnosticEngine());
  const [currentProbe, setCurrentProbe] = useState<DiagnosticItem | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticSessionResult | null>(null);

  useEffect(() => {
    const firstProbe = engine.getNextProbe();
    setCurrentProbe(firstProbe);
  }, [engine]);

  const handleSubmitAnswer = () => {
    if (!currentProbe || !selectedOptionId || isAnswered) return;

    const evaluation = evaluateStudentAnswer(
      currentProbe.question,
      selectedOptionId,
      false,
      0
    );

    engine.recordResponse({
      questionId: currentProbe.question.id,
      topicId: currentProbe.topicId,
      isCorrect: evaluation.isCorrect,
      rootCause: evaluation.rootCause,
      detectedMisconception: evaluation.detectedMisconception
    });

    setFeedback({
      isCorrect: evaluation.isCorrect,
      explanation: currentProbe.question.explanation
    });
    setIsAnswered(true);
  };

  const handleNextStep = () => {
    setIsAnswered(false);
    setSelectedOptionId('');
    setFeedback(null);

    const nextProbe = engine.getNextProbe();
    if (nextProbe) {
      setCurrentProbe(nextProbe);
    } else {
      // Diagnostic complete via early stopping criterion!
      const finalReport = engine.finalizeDiagnostic(student.id);
      setDiagnosticResult(finalReport);
      setIsCompleted(true);

      // Persist baseline mastery scores into local db for the student
      for (const [topicId, score] of Object.entries(finalReport.estimatedMastery)) {
        const existingProg = db.getTopicProgress(student.id, topicId);
        if (existingProg) {
          existingProg.masteryScore = score;
          existingProg.updatedAt = new Date().toISOString();
        }
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-4">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#5C5549] hover:text-[#1A1817] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Diagnostic</span>
        </button>

        <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#FAF1E4] text-[#C57D36] border border-[#E8D4BE] font-semibold flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          <span>Smart Adaptive Placement Diagnostic</span>
        </span>
      </div>

      {!isCompleted && currentProbe ? (
        <div className="bg-white rounded-xl border border-[#E0D8CC] p-6 sm:p-8 shadow-xs space-y-6">
          {/* Diagnostic Context Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#EFEAE2] text-xs font-mono text-[#7A7265]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1A1817]">Probe #{engine.getHistory().length + 1}</span>
              <span>·</span>
              <span className="capitalize px-2 py-0.5 rounded bg-[#F4EFE6] text-[#4A453D] text-[10px] font-semibold">
                Targeting {currentProbe.topicId.replace('-', ' ').toUpperCase()}
              </span>
            </div>

            <span className="text-[11px] text-[#C57D36] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Adaptive Branching Active</span>
            </span>
          </div>

          {/* Diagnostic Concept Objective Note */}
          <div className="p-3 bg-[#F9F7F2] rounded-lg border border-[#EAE3D5] text-xs font-mono text-[#5C5549]">
            <span className="font-bold text-[#1A1817]">Evaluation Target: </span>
            <span>{currentProbe.conceptProbe}</span>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1817] leading-snug">
              {currentProbe.question.questionText}
            </h2>

            {/* Visual Model */}
            {currentProbe.question.visualModel && (
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex justify-center">
                {currentProbe.question.visualModel.type === 'fraction_bar' ? (
                  <FractionBar
                    totalParts={currentProbe.question.visualModel.totalParts}
                    shadedParts={currentProbe.question.visualModel.shadedParts}
                    labels={currentProbe.question.visualModel.labels}
                    className="w-full"
                  />
                ) : (
                  <FractionPie
                    totalParts={currentProbe.question.visualModel.totalParts}
                    shadedParts={currentProbe.question.visualModel.shadedParts}
                  />
                )}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentProbe.question.options?.map(option => {
              const isSelected = selectedOptionId === option.id;
              const isCorrectOption = option.id === currentProbe.question.correctAnswer;

              let style = 'bg-white border-[#DCD5C9] hover:border-[#1A1817] text-[#1A1817]';
              if (isAnswered) {
                if (isCorrectOption) {
                  style = 'bg-[#E8F4EE] border-[#1B4332] text-[#1B4332] font-semibold';
                } else if (isSelected && !feedback?.isCorrect) {
                  style = 'bg-[#FEEBEB] border-[#8C2828] text-[#8C2828]';
                } else {
                  style = 'bg-[#FAF8F5] border-[#E8E2D8] text-[#9C958C] opacity-60';
                }
              } else if (isSelected) {
                style = 'bg-[#FAF3EB] border-[#1B4332] text-[#1B4332] font-semibold';
              }

              return (
                <button
                  key={option.id}
                  disabled={isAnswered}
                  onClick={() => setSelectedOptionId(option.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between text-sm sm:text-base ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold border shrink-0 bg-[#FAF7F2]">
                      {option.id.replace('opt-', '').toUpperCase()}
                    </span>
                    <span>{option.text}</span>
                  </div>

                  {isAnswered && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-[#1B4332] shrink-0" />
                  )}
                  {isAnswered && isSelected && !feedback?.isCorrect && (
                    <XCircle className="w-5 h-5 text-[#8C2828] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Feedback */}
          {isAnswered && feedback && (
            <div className={`p-4 rounded-lg border text-xs sm:text-sm leading-relaxed ${
              feedback.isCorrect ? 'bg-[#E8F4EE] border-[#B7D8C4] text-[#1B4332]' : 'bg-[#FEEBEB] border-[#FCD4D4] text-[#8C2828]'
            }`}>
              <div className="font-bold font-editorial mb-1">
                {feedback.isCorrect ? 'Identified with Competence' : 'Concept Frontier Detected'}
              </div>
              <p>{feedback.explanation}</p>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 flex items-center justify-between border-t border-[#E8E2D8]">
            <span className="text-xs font-mono text-[#7A7265]">
              Dynamic branching tests knowledge boundary efficiently
            </span>

            {!isAnswered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className={`px-6 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedOptionId
                    ? 'bg-[#1B4332] text-white hover:bg-[#112F23] cursor-pointer'
                    : 'bg-[#EFEAE2] text-[#8C8377] cursor-not-allowed'
                }`}
              >
                Submit Response
              </button>
            ) : (
              <button
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1B4332] text-white text-xs font-semibold rounded-lg hover:bg-[#112F23] cursor-pointer"
              >
                <span>Continue Adaptive Diagnostic</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : isCompleted && diagnosticResult ? (
        /* Diagnostic Results Dossier */
        <div className="bg-white rounded-xl border border-[#E0D8CC] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-[#E8E2D8] pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#7A7265]">
                <span>Diagnostic Assessment Complete</span>
                <span>·</span>
                <span className="text-[#1B4332] font-semibold">{diagnosticResult.totalQuestionsAsked} Questions Asked</span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1A1817] mt-1">
                Knowledge Frontier Profile
              </h2>
            </div>
            <Award className="w-10 h-10 text-[#C57D36]" />
          </div>

          {/* Early Stop Justification Card */}
          <div className="p-4 bg-[#F2EDE4] rounded-xl border border-[#DFD6C7] space-y-1.5 font-mono text-xs text-[#5C5549]">
            <span className="font-bold text-[#1A1817] uppercase tracking-wider block">
              Smart Questioning Efficiency Telemetry:
            </span>
            <p className="leading-relaxed">{diagnosticResult.earlyStopReason}</p>
          </div>

          {/* Estimated Baseline Mastery Matrix */}
          <div className="space-y-3">
            <h3 className="font-editorial text-lg font-bold text-[#1A1817]">
              Initial Baseline Mastery Estimates
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(diagnosticResult.estimatedMastery).map(([topicId, score]) => (
                <div key={topicId} className="p-3 bg-[#FAF8F5] rounded-lg border border-[#EAE3D6] space-y-1 text-center font-mono">
                  <span className="text-[11px] text-[#7A7265] block uppercase font-semibold">
                    {topicId.replace('-', ' ')}
                  </span>
                  <span className="text-xl font-bold text-[#1B4332] block">
                    {score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Starting Point Callout */}
          <div className="p-5 bg-[#E8F4EE] rounded-xl border border-[#B7D8C4] flex items-start gap-4">
            <Target className="w-6 h-6 text-[#1B4332] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm text-[#1B4332]">
              <h4 className="font-editorial font-bold text-base">
                Optimal Starting Placement: {db.getTopic(diagnosticResult.recommendedStartingTopicId)?.title || diagnosticResult.recommendedStartingTopicId}
              </h4>
              <p className="opacity-95 leading-relaxed">
                The smart diagnostic engine determined that your learning progression should begin at this topic. Foundational prerequisites are accounted for, allowing maximum learning speed without knowledge gaps.
              </p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 flex items-center justify-between border-t border-[#E8E2D8]">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="text-xs font-mono font-semibold text-[#5C5549] hover:underline"
            >
              Return to Student Desk
            </button>

            <button
              onClick={() => navigate(`/solve/${diagnosticResult.recommendedStartingTopicId}`)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1B4332] text-white text-xs font-semibold rounded-lg hover:bg-[#112F23] shadow-xs cursor-pointer"
            >
              <span>Begin Adaptive Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
