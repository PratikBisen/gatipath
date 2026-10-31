import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/db';
import { Question, Attempt, StudentTopicProgress } from '../../types';
import { evaluateStudentAnswer } from '../../engine/misconceptions';
import { selectNextQuestion } from '../../engine/difficulty';
import { FractionBar } from '../../components/visuals/FractionBar';
import { FractionPie } from '../../components/visuals/FractionPie';
import { MisconceptionCard } from '../../components/visuals/MisconceptionCard';
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Sparkles
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
        particleCount: 35,
        spread: 55,
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
      <div className="max-w-2xl mx-auto py-12 text-center text-xs font-mono text-[#7A7265]">
        Loading adaptive practice session...
      </div>
    );
  }

  const currentMastery = progress ? progress.masteryScore : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-4">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#5C5549] hover:text-[#1A1817] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Study Desk</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/learn/${topic.id}`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B4332] hover:underline"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Concept Lesson</span>
          </button>
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#FAF1E4] text-[#C57D36]">
            {currentMastery}% Mastery
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl border border-[#E0D8CC] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Meta Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EFEAE2] text-xs font-mono text-[#7A7265]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1A1817]">{topic.title}</span>
            <span>·</span>
            <span className="capitalize px-2 py-0.5 rounded bg-[#F4EFE6] text-[#4A453D] text-[10px] font-semibold">
              {currentQuestion.difficulty} Level
            </span>
          </div>

          <span className="text-[11px]">
            Mastery: <strong className="text-[#1A1817]">{currentMastery}%</strong>
          </span>
        </div>

        {/* Question Text */}
        <div className="space-y-4">
          <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1817] leading-snug">
            {currentQuestion.questionText}
          </h2>

          {/* Visual Model */}
          {currentQuestion.visualModel && (
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex justify-center">
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

            let optionStyle = 'bg-white border-[#DCD5C9] hover:border-[#1A1817] text-[#1A1817]';

            if (isSubmitted) {
              if (isCorrectOption) {
                optionStyle = 'bg-[#E8F4EE] border-[#1B4332] text-[#1B4332] font-semibold';
              } else if (isSelected && !evaluation?.isCorrect) {
                optionStyle = 'bg-[#FEEBEB] border-[#8C2828] text-[#8C2828]';
              } else {
                optionStyle = 'bg-[#FAF8F5] border-[#E8E2D8] text-[#9C958C] opacity-60';
              }
            } else if (isSelected) {
              optionStyle = 'bg-[#FAF3EB] border-[#1B4332] text-[#1B4332] font-semibold';
            }

            return (
              <button
                key={option.id}
                disabled={isSubmitted}
                onClick={() => setSelectedOptionId(option.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between text-sm sm:text-base ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
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
                </div>

                {isSubmitted && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-[#1B4332] shrink-0" />
                )}
                {isSubmitted && isSelected && !evaluation?.isCorrect && (
                  <XCircle className="w-5 h-5 text-[#8C2828] shrink-0" />
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
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#C57D36] hover:underline"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need a hint? (Awards 70% credit)</span>
              </button>
            ) : (
              <div className="p-3.5 bg-[#FAF3EB] rounded-lg border border-[#E8D4BE] text-xs text-[#5C5549] flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-[#C57D36] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#1A1817]">Hint: </span>
                  <span>{currentQuestion.hint}</span>
                  <span className="block text-[11px] text-[#C57D36] mt-1 font-mono">
                    Hint applied: Correct answer will award +70 mastery score.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Evaluation Feedback */}
        {isSubmitted && evaluation && (
          <div className="space-y-4 pt-4 border-t border-[#E8E2D8]">
            <div
              className={`p-4 rounded-lg border flex items-start gap-3 ${
                evaluation.isCorrect
                  ? 'bg-[#E8F4EE] border-[#B7D8C4] text-[#1B4332]'
                  : 'bg-[#FEEBEB] border-[#FCD4D4] text-[#8C2828]'
              }`}
            >
              {evaluation.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-[#1B4332] shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-[#8C2828] shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="text-sm font-bold font-editorial">
                  {evaluation.isCorrect
                    ? hintUsed
                      ? 'Correct with Hint (+70 Mastery Points)'
                      : 'Correct! (+100 Mastery Points)'
                    : 'Incorrect Result'}
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
        <div className="pt-4 flex items-center justify-between border-t border-[#E8E2D8]">
          <span className="text-xs font-mono text-[#7A7265] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Take your time to reason carefully</span>
          </span>

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOptionId}
              className={`px-6 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                selectedOptionId
                  ? 'bg-[#1B4332] text-white hover:bg-[#112F23] shadow-xs'
                  : 'bg-[#EFEAE2] text-[#8C8377] cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1B4332] text-white text-xs font-semibold rounded-lg hover:bg-[#112F23] shadow-xs transition-all"
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
