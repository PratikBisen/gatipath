import { ProgressiveHint, Question } from '../types';

/**
 * Creates a structured 4-stage progressive hint sequence:
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
      scoreCreditPercent: 90
    },
    {
      level: 2,
      stageName: 'Guided Next Step',
      text: guidedStep,
      scoreCreditPercent: 75
    },
    {
      level: 3,
      stageName: 'Specific Explanation',
      text: specificExplanation,
      scoreCreditPercent: 55
    },
    {
      level: 4,
      stageName: 'Worked Solution',
      text: workedSolution,
      scoreCreditPercent: 40
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

  // Derive calibrated 4 stages:
  return buildProgressiveHints(
    question.hint || 'Recall the foundational definition of numerators and denominators for this operation.',
    `First, look at the denominators. Are they the same or different? Decide whether conversion or common denominators are needed.`,
    `Notice the exact values: apply the arithmetic rule to combine or compare the parts while observing whether the denominator changes.`,
    `Worked Solution: ${question.explanation}`
  );
}
