import { DifficultyLevel, Question, Attempt } from '../types';

export function calculateTargetDifficulty(recentAttempts: Attempt[]): DifficultyLevel {
  if (recentAttempts.length === 0) {
    return 'easy';
  }

  // Look at last 3 to 5 attempts
  const slice = recentAttempts.slice(-5);
  const correctCount = slice.filter(a => a.isCorrect && !a.hintUsed).length;
  const accuracy = correctCount / slice.length;

  if (accuracy >= 0.75 && slice.length >= 3) {
    return 'hard';
  } else if (accuracy >= 0.50) {
    return 'medium';
  } else {
    return 'easy';
  }
}

/**
 * Selects the optimal next question from the pool based on target difficulty and attempted history.
 */
export function selectNextQuestion(
  availableQuestions: Question[],
  previousAttempts: Attempt[],
  forcedDifficulty?: DifficultyLevel
): Question {
  if (availableQuestions.length === 0) {
    throw new Error('No available questions for this topic');
  }

  const targetDifficulty = forcedDifficulty || calculateTargetDifficulty(previousAttempts);
  const attemptedQuestionIds = new Set(previousAttempts.map(a => a.questionId));

  // 1. Try matching target difficulty that has not been answered yet
  const unattemptedAtTarget = availableQuestions.filter(
    q => q.difficulty === targetDifficulty && !attemptedQuestionIds.has(q.id)
  );
  if (unattemptedAtTarget.length > 0) {
    return unattemptedAtTarget[0];
  }

  // 2. Try any unattempted question in the topic
  const anyUnattempted = availableQuestions.filter(q => !attemptedQuestionIds.has(q.id));
  if (anyUnattempted.length > 0) {
    return anyUnattempted[0];
  }

  // 3. If all attempted, prioritize questions previously answered incorrectly
  const incorrectIds = new Set(previousAttempts.filter(a => !a.isCorrect).map(a => a.questionId));
  const incorrectQuestions = availableQuestions.filter(q => incorrectIds.has(q.id));
  if (incorrectQuestions.length > 0) {
    return incorrectQuestions[0];
  }

  // 4. Fallback to first available question
  return availableQuestions[0];
}
