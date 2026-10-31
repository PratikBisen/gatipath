import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/db';
import { Question, Attempt, StudentTopicProgress } from '../../types';
import { evaluateStudentAnswer } from '../../engine/misconceptions';
import { selectNextQuestion } from '../../engine/difficulty';
import { MasteryBadge } from '../../components/ui/MasteryBadge';
import { FractionBar } from '../../components/visuals/FractionBar';
import { FractionPie } from '../../components/visuals/FractionPie';
import { MisconceptionCard } from '../../components/visuals/MisconceptionCard';
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  XCircle,
  BarChart2,
  Clock,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SolveScreen: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { currentUser, isStudent } = useAuth();

  const student = isStudent && currentUser ? currentUser : db.getStudents()[0];
  const targetTopicId = topicId || 'topic-3';
  const topic = db.getTopic(targetTopicId) || db.getTopics()[0];

  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [showHintBox, setShowHintBox] = useState<boolean>(false);
  const [progress, setProgress] = useState<StudentTopicProgress | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  useEffect(() => {
    const qList = db.getQuestions(topic.id);
    const prevAttempts = db.getAttempts(student.id, topic.id);
    const currProg = db.getTopicProgress(student.id, topic.id) || null;

    setAvailableQuestions(qList);
    setAttempts(prevAttempts);
    setProgress(currProg);

    const nextQ = selectNextQuestion(qList, prevAttempts);
    setCurrentQuestion(nextQ);
    setQuestionStartTime(Date.now());
  }, [topic.id, student.id]);

  const handleSubmit = () => {
    if (!currentQuestion || !selectedOptionId || isSubmitted) return;

    const timeTaken = Math.max(3, Math.round((Date.now() - questionStartTime) / 1000));
    const result = evaluateStudentAnswer(currentQuestion, selectedOptionId, hintUsed);

    const { attempt, updatedProgress } = db.recordAttempt({
      studentId: student.id,
      questionId: currentQuestion.id,
      topicId: topic.id,
      submittedAnswer: selectedOptionId,
      isCorrect: result.isCorrect,
      hintUsed,
      scoreCredit: result.scoreCredit,
      detectedMisconception: result.detectedMisconception,
      timeTakenSeconds: timeTaken,
    });

    setEvaluation(result);
    setIsSubmitted(true);
    setProgress(updatedProgress);
    setAttempts(prev => [attempt, ...prev]);

    if (result.isCorrect) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptionId('');
    setIsSubmitted(false);
    setEvaluation(null);
    setHintUsed(false);
    setShowHintBox(false);

    const latestAttempts = db.getAttempts(student.id, topic.id);
    const nextQ = selectNextQuestion(availableQuestions, latestAttempts);
    setCurrentQuestion(nextQ);
    setQuestionStartTime(Date.now());
  };

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center text-xs text-charcoal-muted">
        Loading adaptive practice session...
      </div>
    );
  }

  const currentMastery = progress ? progress.masteryScore : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/learn/${topic.id}`)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Concept Lesson</span>
          </button>
          <MasteryBadge score={currentMastery} size="xs" />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-card space-y-6">
        {/* Meta Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-border text-xs text-charcoal-muted">
          <div className="flex items-center gap-2">
            <span className="font-bold text-charcoal">{topic.title}</span>
            <span>·</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-full capitalize text-[11px] ${
                currentQuestion.difficulty === 'easy'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
              }`}
            >
              {currentQuestion.difficulty} Level
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <BarChart2 className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-charcoal tabular-nums">Mastery: {currentMastery}%</span>
          </div>
        </div>

        {/* Question Text */}
        <div>
          <h2 className="text-lg sm:text-xl font-heading font-bold text-charcoal leading-snug">
            {currentQuestion.questionText}
          </h2>

          {/* Visual Model */}
          {currentQuestion.visualModel && (
            <div className="mt-4 p-4 bg-canvas-subtle rounded-xl border border-border flex justify-center">
              {currentQuestion.visualModel.type === 'fraction_bar' ? (
                <FractionBar
                  totalParts={currentQuestion.visualModel.totalParts}
                  shadedParts={currentQuestion.visualModel.shadedParts}
                  labels={currentQuestion.visualModel.labels}
                  className="w-full"
                />
              ) : (
                <FractionPie
                  totalParts={currentQuestion.visualModel.totalParts}
                  shadedParts={currentQuestion.visualModel.shadedParts}
                />
              )}
            </div>
          )}
        </div>

        {/* Options Selection */}
        <div className="space-y-2.5">
          {currentQuestion.options?.map(option => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.id === currentQuestion.correctAnswer;

            let optionStyle = 'bg-surface border-border hover:border-primary/50 text-charcoal';

            if (isSubmitted) {
              if (isCorrectOption) {
                optionStyle = 'bg-emerald-50/80 border-emerald-500 text-emerald-950 font-medium';
              } else if (isSelected && !evaluation?.isCorrect) {
                optionStyle = 'bg-rose-50/80 border-rose-500 text-rose-950';
              } else {
                optionStyle = 'bg-canvas-subtle/50 border-border text-charcoal-muted opacity-60';
              }
            } else if (isSelected) {
              optionStyle = 'bg-primary-subtle border-primary text-primary font-medium';
            }

            return (
              <button
                key={option.id}
                disabled={isSubmitted}
                onClick={() => setSelectedOptionId(option.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between text-sm sm:text-base ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${
                      isSelected
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-canvas-subtle text-charcoal-muted'
                    }`}
                  >
                    {option.id.replace('opt-', '').toUpperCase()}
                  </span>
                  <span>{option.text}</span>
                </div>

                {isSubmitted && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                )}
                {isSubmitted && isSelected && !evaluation?.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-700 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Hint Section */}
        {!isSubmitted && (
          <div className="pt-1">
            {!showHintBox ? (
              <button
                onClick={() => {
                  setShowHintBox(true);
                  setHintUsed(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Need a hint? (Awards 70% credit)</span>
              </button>
            ) : (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs sm:text-sm text-amber-900 flex items-start gap-2.5 animate-in fade-in">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Hint: </span>
                  <span>{currentQuestion.hint}</span>
                  <span className="block text-[11px] text-amber-800/80 mt-1 italic">
                    Hint applied. Successful answer will record 70 credit.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Evaluation Feedback */}
        {isSubmitted && evaluation && (
          <div className="space-y-4 pt-3 border-t border-border">
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                evaluation.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {evaluation.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="text-sm font-bold">
                  {evaluation.isCorrect
                    ? hintUsed
                      ? 'Correct with Hint (+70 Mastery Points)'
                      : 'Correct! (+100 Mastery Points)'
                    : 'Not quite right'}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed opacity-95">
                  {evaluation.explanation}
                </p>
              </div>
            </div>

            {/* Targeted Misconception Breakdown Card */}
            {evaluation.detectedMisconception && (
              <MisconceptionCard
                misconceptionCode={evaluation.detectedMisconception}
                onContinue={handleNextQuestion}
                continueLabel="Continue to Next Question"
              />
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 flex items-center justify-between border-t border-border/80">
          <span className="text-xs text-charcoal-muted flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Take your time to calculate accurately</span>
          </span>

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOptionId}
              className={`px-6 py-2.5 text-xs font-semibold rounded-lg shadow-2xs transition-all ${
                selectedOptionId
                  ? 'bg-primary text-white hover:bg-primary-hover'
                  : 'bg-canvas-subtle text-charcoal-muted border border-border cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-2xs transition-all"
            >
              <span>Next Adaptive Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
