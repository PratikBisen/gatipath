import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/db';
import { Question } from '../../types';
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
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === testQuestions.length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-4">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#5C5549] hover:text-[#1A1817] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Assessment</span>
        </button>

        <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#FAF1E4] text-[#C57D36] border border-[#E8D4BE] font-semibold">
          Formal Assessment Mode · No Hints Allowed
        </span>
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-xl border border-[#E0D8CC] p-6 sm:p-8 shadow-xs space-y-6">
          {/* Stepper Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#EFEAE2]">
            <div>
              <span className="font-mono text-xs uppercase text-[#8C8377] font-semibold">
                Question {currentIndex + 1} of {testQuestions.length}
              </span>
              <h3 className="font-editorial text-lg font-bold text-[#1A1817]">
                {topic.title} Assessment Checkpoint
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              {testQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-full text-xs font-mono font-bold transition-all ${
                    idx === currentIndex
                      ? 'bg-[#1B4332] text-white shadow-2xs'
                      : answers[q.id]
                      ? 'bg-[#E8F4EE] text-[#1B4332] border border-[#B7D8C4]'
                      : 'bg-[#FAF7F2] text-[#7A7265] border border-[#DCD5C9]'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1817] leading-snug">
              {currentQ.questionText}
            </h2>

            {/* Visual model if available */}
            {currentQ.visualModel && (
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex justify-center">
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
            {currentQ.options?.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all flex items-center gap-3 text-sm sm:text-base ${
                    isSelected
                      ? 'bg-[#FAF3EB] border-[#1B4332] text-[#1B4332] font-semibold'
                      : 'bg-white border-[#DCD5C9] hover:border-[#1A1817] text-[#1A1817]'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold border shrink-0 ${
                      isSelected
                        ? 'border-[#1B4332] bg-[#1B4332] text-white'
                        : 'border-[#DCD5C9] bg-[#FAF7F2] text-[#5C5549]'
                    }`}
                  >
                    {option.id.replace('opt-', '').toUpperCase()}
                  </span>
                  <span>{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-[#E8E2D8] flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded text-xs font-semibold ${
                currentIndex === 0
                  ? 'text-[#A39B8F] cursor-not-allowed'
                  : 'text-[#1A1817] hover:bg-[#FAF7F2]'
              }`}
            >
              Previous Question
            </button>

            {currentIndex < testQuestions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded bg-[#1B4332] text-white hover:bg-[#112F23] text-xs font-semibold shadow-xs"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                disabled={!isAllAnswered}
                className={`px-6 py-2.5 rounded text-xs font-semibold shadow-xs transition-all ${
                  isAllAnswered
                    ? 'bg-[#1B4332] text-white hover:bg-[#112F23]'
                    : 'bg-[#EFEAE2] text-[#8C8377] cursor-not-allowed'
                }`}
              >
                Submit Assessment ({answeredCount}/{testQuestions.length} answered)
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="bg-white rounded-xl border border-[#E0D8CC] p-8 shadow-xs space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E0D8CC] flex items-center justify-center mx-auto text-[#1B4332]">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[#7A7265] font-semibold">
              Assessment Evaluation
            </span>
            <h2 className="font-editorial text-3xl font-bold text-[#1A1817]">
              {scorePercentage >= 80 ? 'Mastery Formally Certified!' : 'Assessment Incomplete'}
            </h2>
            <div className="text-4xl font-bold font-mono text-[#1B4332] pt-2">
              {scorePercentage}%
            </div>
            <p className="text-xs text-[#5C5549] max-w-md mx-auto leading-relaxed">
              {scorePercentage >= 80
                ? 'Congratulations! You have demonstrated un-scaffolded understanding of this module and met the 80% certification bar.'
                : 'You scored below the 80% passing threshold. We recommend reviewing the worked examples and practicing adaptive questions before re-testing.'}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-4 border-t border-[#E8E2D8]">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-5 py-2.5 rounded-lg bg-[#1B4332] text-white hover:bg-[#112F23] text-xs font-semibold shadow-xs"
            >
              Return to Study Desk
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
