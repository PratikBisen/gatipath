import { TopicStatus } from '../types';
import { ENGINE_CONFIG } from './config';

export const MASTERY_THRESHOLDS = ENGINE_CONFIG.THRESHOLDS;

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
  if (score >= MASTERY_THRESHOLDS.PREREQUISITE_MINIMUM) { // 70-84
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
 * new_mastery = (old_mastery * EMA_HISTORY_WEIGHT) + (attempt_score * EMA_ATTEMPT_WEIGHT)
 */
export function calculateNewMastery(
  oldMastery: number,
  isCorrect: boolean,
  hintUsed: boolean,
  scoreCreditOverride?: number
): number {
  let attemptScore = 0;
  if (isCorrect) {
    if (scoreCreditOverride !== undefined) {
      attemptScore = scoreCreditOverride;
    } else {
      attemptScore = hintUsed ? ENGINE_CONFIG.HINT_CREDITS.LEGACY_HINT_DEFAULT : ENGINE_CONFIG.HINT_CREDITS.INDEPENDENT_CORRECT;
    }
  } else {
    attemptScore = ENGINE_CONFIG.HINT_CREDITS.INCORRECT;
  }

  // If this is the very first attempt (mastery is 0)
  if (oldMastery === 0) {
    return Math.round(attemptScore * ENGINE_CONFIG.MASTERY.COLD_START_WEIGHT); // Gentle baseline start
  }

  const updated = (oldMastery * ENGINE_CONFIG.MASTERY.EMA_HISTORY_WEIGHT) + (attemptScore * ENGINE_CONFIG.MASTERY.EMA_ATTEMPT_WEIGHT);
  return Math.min(100, Math.max(0, Math.round(updated)));
}

/**
 * Determines topic progression status based on mastery, attempt count, and assessment results.
 * Strict Anti-Slop: A topic CANNOT be marked 'mastered' without at least MIN_INDEPENDENT_FOR_MASTERY independent correct answers
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

  if (
    masteryScore >= MASTERY_THRESHOLDS.MASTERED &&
    hasPassedAssessment &&
    correctIndependentAttempts >= ENGINE_CONFIG.MASTERY.MIN_INDEPENDENT_FOR_MASTERY
  ) {
    return 'mastered';
  }

  if (
    masteryScore >= MASTERY_THRESHOLDS.PREREQUISITE_MINIMUM &&
    totalAttempts >= ENGINE_CONFIG.MASTERY.MIN_ATTEMPTS_FOR_TEST
  ) {
    return 'ready_for_test';
  }

  return 'in_progress';
}
