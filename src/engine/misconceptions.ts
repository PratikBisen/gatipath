import { MisconceptionCode, Question, Attempt } from '../types';
import { MISCONCEPTIONS } from '../data/curriculum/fractions';

export interface EvaluatedAnswer {
  isCorrect: boolean;
  scoreCredit: number;
  detectedMisconception?: MisconceptionCode;
  explanation: string;
  remedialText?: string;
  visualFixExplanation?: string;
}

export function evaluateStudentAnswer(
  question: Question,
  submittedOptionIdOrText: string,
  hintUsed: boolean
): EvaluatedAnswer {
  const isCorrect = submittedOptionIdOrText.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

  let detectedMisconception: MisconceptionCode | undefined = undefined;

  if (!isCorrect) {
    // Check if the selected option explicitly has a misconception tag
    if (question.options) {
      const chosenOption = question.options.find(
        opt => opt.id === submittedOptionIdOrText || opt.text === submittedOptionIdOrText
      );
      if (chosenOption && chosenOption.misconceptionCode) {
        detectedMisconception = chosenOption.misconceptionCode;
      }
    }

    // Fallback to question-level misconception if option wasn't directly tagged
    if (!detectedMisconception && question.misconceptionTag) {
      detectedMisconception = question.misconceptionTag;
    }
  }

  const scoreCredit = isCorrect ? (hintUsed ? 70 : 100) : 0;

  let remedialText: string | undefined = undefined;
  let visualFixExplanation: string | undefined = undefined;

  if (detectedMisconception && MISCONCEPTIONS[detectedMisconception]) {
    const meta = MISCONCEPTIONS[detectedMisconception];
    remedialText = meta.remedialConcept;
    visualFixExplanation = meta.visualFixExplanation;
  }

  return {
    isCorrect,
    scoreCredit,
    detectedMisconception,
    explanation: question.explanation,
    remedialText,
    visualFixExplanation,
  };
}

/**
 * Analyzes recent attempts to detect patterns of repeated misconceptions.
 */
export function detectRepeatedMisconceptions(
  topicAttempts: Attempt[]
): { code: MisconceptionCode; count: number; name: string }[] {
  const counts: Partial<Record<MisconceptionCode, number>> = {};

  for (const attempt of topicAttempts) {
    if (!attempt.isCorrect && attempt.detectedMisconception) {
      counts[attempt.detectedMisconception] = (counts[attempt.detectedMisconception] || 0) + 1;
    }
  }

  return Object.entries(counts)
    .filter(([_, count]) => (count || 0) >= 1)
    .map(([code, count]) => ({
      code: code as MisconceptionCode,
      count: count || 0,
      name: MISCONCEPTIONS[code]?.name || code
    }))
    .sort((a, b) => b.count - a.count);
}
