import { TopicStatus } from '../types';

export const MASTERY_THRESHOLDS = {
  NEEDS_SUPPORT: 39,
  DEVELOPING: 69,
  ALMOST_MASTERED: 84,
  MASTERED: 85,
  PREREQUISITE_MINIMUM: 70,
  ASSESSMENT_PASS: 80,
} as const;

export function getMasteryLabel(score: number): {
  label: string;
  badgeColor: string;
  textColor: string;
} {
  if (score >= MASTERY_THRESHOLDS.MASTERED) {
    return {
      label: 'Mastered',
      badgeColor: 'bg-primary-light text-primary border-primary/20',
      textColor: 'text-primary'
    };
  }
  if (score >= MASTERY_THRESHOLDS.ALMOST_MASTERED - 14) { // 70-84
    return {
      label: 'Almost Mastered',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      textColor: 'text-emerald-700'
    };
  }
  if (score >= MASTERY_THRESHOLDS.NEEDS_SUPPORT + 1) { // 40-69
    return {
      label: 'Developing',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
      textColor: 'text-amber-800'
    };
  }
  return {
    label: 'Needs Support',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    textColor: 'text-rose-700'
  };
}

/**
 * Calculates new topic mastery using Exponential Moving Average:
 * new_mastery = (old_mastery * 0.7) + (attempt_score * 0.3)
 */
export function calculateNewMastery(
  oldMastery: number,
  isCorrect: boolean,
  hintUsed: boolean
): number {
  let attemptScore = 0;
  if (isCorrect) {
    attemptScore = hintUsed ? 70 : 100;
  } else {
    attemptScore = 0;
  }

  // If this is the very first attempt (mastery is 0)
  if (oldMastery === 0) {
    return Math.round(attemptScore * 0.6); // Gentle baseline start
  }

  const updated = (oldMastery * 0.7) + (attemptScore * 0.3);
  return Math.min(100, Math.max(0, Math.round(updated)));
}

/**
 * Determines topic progression status based on mastery, attempt count, and assessment results.
 * Strict Anti-Slop: A topic CANNOT be marked 'mastered' without at least 3 independent correct answers
 * and passing assessment.
 */
export function determineTopicStatus(
  masteryScore: number,
  totalAttempts: number,
  correctIndependentAttempts: number,
  hasPassedAssessment: boolean
): TopicStatus {
  if (totalAttempts === 0) {
    return 'not_started';
  }

  if (masteryScore >= MASTERY_THRESHOLDS.MASTERED && hasPassedAssessment && correctIndependentAttempts >= 3) {
    return 'mastered';
  }

  if (masteryScore >= MASTERY_THRESHOLDS.PREREQUISITE_MINIMUM && totalAttempts >= 3) {
    return 'ready_for_test';
  }

  return 'in_progress';
}
