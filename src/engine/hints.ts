import { ProgressiveHint, Question } from '../types';
import { ENGINE_CONFIG } from './config';

/**
 * Creates a structured 4-stage progressive hint sequence using authoritative credit constants:
 * 1. Conceptual Reminder (90% score credit)
 * 2. Guided Next Step (75% score credit)
 * 3. Specific Explanation (55% score credit)
 * 4. Full Worked Solution (40% score credit)
 */
export function buildProgressiveHints(
  conceptual: string,
  guidedStep: string,
  specificExplanation: string,
  workedSolution: string
): ProgressiveHint[] {
  return [
    {
      level: 1,
      stageName: 'Conceptual Reminder',
      text: conceptual,
      scoreCreditPercent: ENGINE_CONFIG.HINT_CREDITS.STAGE_1_CONCEPTUAL
    },
    {
      level: 2,
      stageName: 'Guided Next Step',
      text: guidedStep,
      scoreCreditPercent: ENGINE_CONFIG.HINT_CREDITS.STAGE_2_GUIDED_STEP
    },
    {
      level: 3,
      stageName: 'Specific Explanation',
      text: specificExplanation,
      scoreCreditPercent: ENGINE_CONFIG.HINT_CREDITS.STAGE_3_EXPLANATION
    },
    {
      level: 4,
      stageName: 'Worked Solution',
      text: workedSolution,
      scoreCreditPercent: ENGINE_CONFIG.HINT_CREDITS.STAGE_4_WORKED_SOLUTION
    }
  ];
}

/**
 * Returns the 4-stage progressive hints for a question.
 * If the question defines bespoke hints, returns those.
 * Otherwise, dynamically derives high-quality 4-stage hints from the question metadata.
 */
export function getQuestionHints(question: Question): ProgressiveHint[] {
  if (question.hints && question.hints.length === 4) {
    return question.hints;
  }

  // Derive calibrated 4 stages using question explanation and rules:
  return buildProgressiveHints(
    question.hint || 'Recall the foundational definition of numerators and denominators for this operation.',
    `First, observe the denominators. Determine whether conversions to equal-sized pieces (equivalent fractions) are required.`,
    `Apply the mathematical rule: operate on the numerators as counted pieces, keeping identical denominators unchanged or using the common denominator.`,
    `Full Worked Solution: ${question.explanation}`
  );
}
