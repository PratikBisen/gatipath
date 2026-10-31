import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/db';
import { Question } from '../../types';
import { Card } from '../../components/ui/Card';
import { FractionBar } from '../../components/visuals/FractionBar';
import { FractionPie } from '../../components/visuals/FractionPie';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Award,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TestScreen: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { currentUser, isStudent } = useAuth();

  const student = isStudent && currentUser ? currentUser : db.getStudents()[0];
  const targetTopicId = topicId || 'topic-3';
  const topic = db.getTopic(targetTopicId) || db.getTopics()[0];

  const allTopicQuestions = db.getQuestions(topic.id);
  const [testQuestions] = useState<Question[]>(() => {
    return allTopicQuestions.slice(0, 5);
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [scorePercentage, setScorePercentage] = useState<number>(0);
  const [detailedResults, setDetailedResults] = useState<{
    question: Question;
    selected: string;
    isCorrect: boolean;
  }[]>([]);

  const currentQ = testQuestions[currentIndex];
  const selectedOption = currentQ ? answers[currentQ.id] : undefined;

  const handleSelect = (optionId: string) => {
    if (isCompleted || !currentQ) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < testQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitTest = () => {
    let correctCount = 0;
    const results = testQuestions.map(q => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount++;
      return { question: q, selected, isCorrect };
    });

    const percent = Math.round((correctCount / testQuestions.length) * 100);
    setScorePercentage(percent);
    setDetailedResults(results);
    setIsCompleted(true);

    db.recordAssessmentCompletion(student.id, topic.id, percent);

    if (percent >= 80) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === testQuestions.length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Assessment</span>
        </button>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-light text-accent border border-accent/20">
          Formal Assessment Mode (No Hints)
        </span>
      </div>

      {!isCompleted ? (
        <Card className="p-6 sm:p-8 space-y-6">
          {/* Stepper Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-border text-xs text-charcoal-muted">
            <span className="font-bold text-charcoal">{topic.title}</span>
            <span className="tabular-nums font-medium">
              Question {currentIndex + 1} of {testQuestions.length} ({answeredCount} answered)
            </span>
          </div>

          <div className="w-full bg-canvas-subtle h-2 rounded-full overflow-hidden border border-border">
            <div
              className="bg-accent h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / testQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div>
            <h2 className="text-lg sm:text-xl font-heading font-bold text-charcoal leading-snug">
              {currentQ.questionText}
            </h2>

            {currentQ.visualModel && (
              <div className="mt-4 p-4 bg-canvas-subtle rounded-xl border border-border flex justify-center">
                {currentQ.visualModel.type === 'fraction_bar' ? (
                  <FractionBar
                    totalParts={currentQ.visualModel.totalParts}
                    shadedParts={currentQ.visualModel.shadedParts}
                    labels={currentQ.visualModel.labels}
                    className="w-full"
                  />
                ) : (
                  <FractionPie
                    totalParts={currentQ.visualModel.totalParts}
                    shadedParts={currentQ.visualModel.shadedParts}
                  />
                )}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options?.map(option => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between text-sm sm:text-base ${
                    isSelected
                      ? 'bg-accent-light/70 border-accent text-accent font-semibold'
                      : 'bg-surface border-border hover:border-accent/40 text-charcoal'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${
                        isSelected
                          ? 'border-accent bg-accent text-white'
                          : 'border-border bg-canvas-subtle text-charcoal-muted'
                      }`}
                    >
                      {option.id.replace('opt-', '').toUpperCase()}
                    </span>
                    <span>{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stepper Navigation */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border border-border transition-colors ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-canvas-subtle text-charcoal-muted'
                  : 'bg-surface hover:bg-canvas text-charcoal'
              }`}
            >
              Previous
            </button>

            {currentIndex < testQuestions.length - 1 ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-charcoal text-white text-xs font-semibold rounded-lg hover:bg-black transition-colors"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                disabled={!isAllAnswered}
                className={`inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold rounded-lg shadow-2xs transition-all ${
                  isAllAnswered
                    ? 'bg-primary text-white hover:bg-primary-hover'
                    : 'bg-canvas-subtle text-charcoal-muted border border-border cursor-not-allowed'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Submit Assessment</span>
              </button>
            )}
          </div>
        </Card>
      ) : (
        /* Results Screen */
        <Card className="p-6 sm:p-8 space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <div
              className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center ${
                scorePercentage >= 80
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {scorePercentage >= 80 ? (
                <Award className="w-7 h-7" />
              ) : (
                <AlertCircle className="w-7 h-7" />
              )}
            </div>

            <h2 className="text-2xl font-heading font-extrabold text-charcoal">
              {scorePercentage >= 80 ? 'Assessment Passed!' : 'Assessment Complete — Practice Needed'}
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted">
              You scored <span className="font-bold text-charcoal tabular-nums">{scorePercentage}%</span> on {topic.title}.
            </p>
          </div>

          <div className="p-4 bg-canvas-subtle rounded-xl border border-border flex items-center justify-around text-center">
            <div>
              <span className="block text-xl font-bold text-charcoal tabular-nums">
                {detailedResults.filter(r => r.isCorrect).length}/{testQuestions.length}
              </span>
              <span className="text-[11px] text-charcoal-muted font-medium">Questions Correct</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <span
                className={`block text-xl font-bold ${
                  scorePercentage >= 80 ? 'text-primary' : 'text-amber-800'
                }`}
              >
                {scorePercentage >= 80 ? 'Mastery Unlocked' : 'Developing'}
              </span>
              <span className="text-[11px] text-charcoal-muted font-medium">Topic Status</span>
            </div>
          </div>

          {/* Question Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Detailed Question Review
            </h3>
            <div className="space-y-2">
              {detailedResults.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                    item.isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200/80'
                      : 'bg-rose-50/50 border-rose-200/80'
                  }`}
                >
                  {item.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 space-y-0.5">
                    <p className="font-semibold text-charcoal">{item.question.questionText}</p>
                    <p className="text-charcoal-muted text-[11px]">{item.question.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                setIsCompleted(false);
                setAnswers({});
                setCurrentIndex(0);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-border hover:bg-canvas text-charcoal transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Assessment</span>
            </button>

            <button
              onClick={() => navigate('/student/dashboard')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-2xs transition-colors"
            >
              <span>Return to Learning Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};
