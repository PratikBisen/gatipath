import { DifficultyLevel, Question, Attempt, MisconceptionCode } from '../types';
import { ENGINE_CONFIG } from './config';

export interface QuestionSelectionRationale {
  question: Question;
  targetDifficulty: DifficultyLevel;
  selectionReason: string;
}

export function calculateTargetDifficulty(recentAttempts: Attempt[]): DifficultyLevel {
  if (recentAttempts.length === 0) {
    return 'easy';
  }

  // Look at rolling window of recent attempts
  const slice = recentAttempts.slice(-ENGINE_CONFIG.DIFFICULTY.ROLLING_WINDOW_SIZE);
  const correctCount = slice.filter(a => a.isCorrect && !a.hintUsed).length;
  const accuracy = correctCount / slice.length;

  if (accuracy >= ENGINE_CONFIG.DIFFICULTY.HARD_ACCURACY_THRESHOLD && slice.length >= ENGINE_CONFIG.DIFFICULTY.MIN_ATTEMPTS_FOR_HARD) {
    return 'hard';
  } else if (accuracy >= ENGINE_CONFIG.DIFFICULTY.MEDIUM_ACCURACY_THRESHOLD) {
    return 'medium';
  } else {
    return 'easy';
  }
}

/**
 * Selects the optimal next question with a human-readable deterministic rationale.
 * Incorporates root-cause recovery: if the last attempt had an error,
 * attempts to select an item reinforcing the concept or scaffolded at easier difficulty.
 */
export function selectNextQuestionWithRationale(
  availableQuestions: Question[],
  previousAttempts: Attempt[],
  forcedDifficulty?: DifficultyLevel
): QuestionSelectionRationale {
  if (availableQuestions.length === 0) {
    throw new Error('No available questions for this topic');
  }

  const attemptedQuestionIds = new Set(previousAttempts.map(a => a.questionId));
  const lastAttempt = previousAttempts[previousAttempts.length - 1];

  // 1. If previous attempt failed due to a misconception, look for a reinforcing question
  if (lastAttempt && !lastAttempt.isCorrect && lastAttempt.detectedMisconception) {
    const targetTag = lastAttempt.detectedMisconception;
    const recoveryQuestion = availableQuestions.find(
      q => !attemptedQuestionIds.has(q.id) && q.misconceptionTag === targetTag && (q.difficulty === 'easy' || q.difficulty === 'medium')
    );

    if (recoveryQuestion) {
      return {
        question: recoveryQuestion,
        targetDifficulty: recoveryQuestion.difficulty,
        selectionReason: `Selected to verify conceptual recovery on '${targetTag.replace(/_/g, ' ')}' with visual reinforcement.`
      };
    }
  }

  const targetDifficulty = forcedDifficulty || calculateTargetDifficulty(previousAttempts);

  // 2. Try unattempted at target difficulty
  const unattemptedAtTarget = availableQuestions.filter(
    q => q.difficulty === targetDifficulty && !attemptedQuestionIds.has(q.id)
  );
  if (unattemptedAtTarget.length > 0) {
    return {
      question: unattemptedAtTarget[0],
      targetDifficulty,
      selectionReason: `Matched target difficulty (${targetDifficulty}) based on recent ${previousAttempts.length > 0 ? 'accuracy pace' : 'introductory baseline'}.`
    };
  }

  // 3. Try any unattempted question
  const anyUnattempted = availableQuestions.filter(q => !attemptedQuestionIds.has(q.id));
  if (anyUnattempted.length > 0) {
    return {
      question: anyUnattempted[0],
      targetDifficulty: anyUnattempted[0].difficulty,
      selectionReason: `Selected unattempted ${anyUnattempted[0].difficulty} question to broaden concept coverage.`
    };
  }

  // 4. Prioritize re-practicing questions answered incorrectly
  const incorrectIds = new Set(previousAttempts.filter(a => !a.isCorrect).map(a => a.questionId));
  const incorrectQuestions = availableQuestions.filter(q => incorrectIds.has(q.id));
  if (incorrectQuestions.length > 0) {
    return {
      question: incorrectQuestions[0],
      targetDifficulty: incorrectQuestions[0].difficulty,
      selectionReason: `Spaced review: Retrying previously challenging problem to solidify mastery.`
    };
  }

  // 5. Fallback
  return {
    question: availableQuestions[0],
    targetDifficulty: availableQuestions[0].difficulty,
    selectionReason: `Default practice sequence selection.`
  };
}

/**
 * Backward-compatible wrapper returning Question directly.
 */
export function selectNextQuestion(
  availableQuestions: Question[],
  previousAttempts: Attempt[],
  forcedDifficulty?: DifficultyLevel
): Question {
  return selectNextQuestionWithRationale(availableQuestions, previousAttempts, forcedDifficulty).question;
}
