import { MisconceptionCode, MisconceptionConfidence, ErrorRootCause, Question, Attempt } from '../types';
import { MISCONCEPTIONS } from '../data/curriculum/fractions';

export interface RemediationPlan {
  activityType: 'visual_concept_repair' | 'prerequisite_refresher' | 'precision_drill' | 'general_review';
  title: string;
  description: string;
  actionRoute: string;
  evidenceSummary: string;
}

export interface EvaluatedAnswer {
  isCorrect: boolean;
  scoreCredit: number;
  detectedMisconception?: MisconceptionCode;
  rootCause: ErrorRootCause;
  misconceptionConfidence?: MisconceptionConfidence;
  explanation: string;
  remedialText?: string;
  visualFixExplanation?: string;
  remediationPlan?: RemediationPlan;
}

/**
 * Maps known misconception codes to their foundational root causes:
 * - Conceptual: flawed mental model of fractions (e.g. adding denominators, treating division as normal multiplication)
 * - Prerequisite: missing earlier foundation (e.g. LCM calculation from Topic 2, simplifying using GCF from Topic 1)
 */
export function classifyRootCause(code?: MisconceptionCode, optionText?: string): ErrorRootCause {
  if (!code) {
    return 'unclassified';
  }

  switch (code) {
    case 'denominator_addition_error':
    case 'numerator_denominator_confusion':
    case 'reciprocal_error':
    case 'comparison_by_numerator_only':
      return 'conceptual_misunderstanding';

    case 'equivalent_fraction_error':
    case 'lcm_error':
    case 'simplification_error':
      return 'prerequisite_gap';

    default:
      return 'unclassified';
  }
}

/**
 * Evaluates student answer with 3-tier root cause attribution:
 * 1. Conceptual Misunderstanding
 * 2. Prerequisite Gap
 * 3. Calculation Slip
 * 4. Unclassified
 *
 * Implements strict anti-slop: An ambiguous wrong answer is marked 'suspected'
 * unless an explicit diagnostic distractor was selected or corroborated by attempt history.
 */
export function evaluateStudentAnswer(
  question: Question,
  submittedOptionIdOrText: string,
  hintUsed: boolean,
  hintLevelUsed: number = 0,
  previousTopicAttempts: Attempt[] = []
): EvaluatedAnswer {
  const isCorrect = submittedOptionIdOrText.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

  let detectedMisconception: MisconceptionCode | undefined = undefined;
  let rootCause: ErrorRootCause = 'unclassified';
  let misconceptionConfidence: MisconceptionConfidence | undefined = undefined;

  // Calculate score credit according to progressive hint level used:
  // Level 0 (no hint) = 100
  // Level 1 (conceptual reminder) = 90
  // Level 2 (guided step) = 75
  // Level 3 (specific explanation) = 55
  // Level 4 (worked solution) = 40
  // Legacy hintUsed = 70
  let scoreCredit = 0;
  if (isCorrect) {
    if (hintLevelUsed === 1) scoreCredit = 90;
    else if (hintLevelUsed === 2) scoreCredit = 75;
    else if (hintLevelUsed === 3) scoreCredit = 55;
    else if (hintLevelUsed === 4) scoreCredit = 40;
    else if (hintUsed) scoreCredit = 70;
    else scoreCredit = 100;
  }

  if (!isCorrect) {
    // 1. Check if the selected option explicitly has a misconception tag
    const chosenOption = question.options?.find(
      opt => opt.id === submittedOptionIdOrText || opt.text === submittedOptionIdOrText
    );

    if (chosenOption?.misconceptionCode) {
      detectedMisconception = chosenOption.misconceptionCode;
      rootCause = chosenOption.rootCause || classifyRootCause(chosenOption.misconceptionCode);
      // Option-specific calibrated distractor indicates high-confidence pattern
      misconceptionConfidence = 'confirmed';
    } else if (chosenOption?.rootCause) {
      rootCause = chosenOption.rootCause;
      misconceptionConfidence = 'confirmed';
    } else if (question.misconceptionTag) {
      // Fallback: If not explicitly tagged on option, check past attempts for repeated pattern
      const pastMatchCount = previousTopicAttempts.filter(
        a => !a.isCorrect && a.detectedMisconception === question.misconceptionTag
      ).length;

      if (pastMatchCount >= 1) {
        // Multi-evidence corroboration: second occurrence confirms it
        detectedMisconception = question.misconceptionTag;
        rootCause = classifyRootCause(question.misconceptionTag);
        misconceptionConfidence = 'confirmed';
      } else {
        // First occurrence without option-specific distractor is only 'suspected'
        detectedMisconception = question.misconceptionTag;
        rootCause = classifyRootCause(question.misconceptionTag);
        misconceptionConfidence = 'suspected';
      }
    } else {
      // Check for calculation slip vs unclassified
      rootCause = 'unclassified';
    }
  }

  let remedialText: string | undefined = undefined;
  let visualFixExplanation: string | undefined = undefined;
  let remediationPlan: RemediationPlan | undefined = undefined;

  if (detectedMisconception && MISCONCEPTIONS[detectedMisconception]) {
    const meta = MISCONCEPTIONS[detectedMisconception];
    remedialText = meta.remedialConcept;
    visualFixExplanation = meta.visualFixExplanation;

    if (rootCause === 'conceptual_misunderstanding') {
      remediationPlan = {
        activityType: 'visual_concept_repair',
        title: `Visual Concept Repair: ${meta.name}`,
        description: `Your response indicates a mental model gap: "${meta.description}". Review the interactive visual model before practicing further.`,
        actionRoute: `/learn/${question.topicId}`,
        evidenceSummary: misconceptionConfidence === 'confirmed'
          ? `Confirmed via specific diagnostic distractor selection.`
          : `Suspected from first incorrect attempt. Monitoring next answer.`
      };
    } else if (rootCause === 'prerequisite_gap') {
      const targetTopic = question.prerequisiteTopicId || 'topic-1';
      remediationPlan = {
        activityType: 'prerequisite_refresher',
        title: `Prerequisite Gap: ${meta.name}`,
        description: `This question relies on prerequisite skill "${meta.name}". A short refresher on earlier concepts will eliminate this roadblock.`,
        actionRoute: `/solve/${targetTopic}`,
        evidenceSummary: `Prerequisite mastery gap identified in foundational steps.`
      };
    }
  } else if (!isCorrect && rootCause === 'calculation_slip') {
    remediationPlan = {
      activityType: 'precision_drill',
      title: 'Arithmetic Precision Check',
      description: 'Your mathematical strategy was sound, but an arithmetic slip occurred in the final numerator computation. Take an extra 10 seconds to verify calculations.',
      actionRoute: `/solve/${question.topicId}`,
      evidenceSummary: 'Process correct; calculation discrepancy detected.'
    };
  }

  return {
    isCorrect,
    scoreCredit,
    detectedMisconception,
    rootCause,
    misconceptionConfidence,
    explanation: question.explanation,
    remedialText,
    visualFixExplanation,
    remediationPlan,
  };
}

/**
 * Analyzes recent attempts to detect patterns of confirmed repeated misconceptions
 * vs single suspected occurrences.
 */
export function detectRepeatedMisconceptions(
  topicAttempts: Attempt[]
): {
  code: MisconceptionCode;
  count: number;
  name: string;
  isConfirmed: boolean;
  rootCause: ErrorRootCause;
}[] {
  const counts: Partial<Record<MisconceptionCode, number>> = {};
  const confirmedMap: Partial<Record<MisconceptionCode, boolean>> = {};

  for (const attempt of topicAttempts) {
    if (!attempt.isCorrect && attempt.detectedMisconception) {
      counts[attempt.detectedMisconception] = (counts[attempt.detectedMisconception] || 0) + 1;
      if (attempt.misconceptionConfidence === 'confirmed' || (counts[attempt.detectedMisconception] || 0) >= 2) {
        confirmedMap[attempt.detectedMisconception] = true;
      }
    }
  }

  return Object.entries(counts)
    .filter(([_, count]) => (count || 0) >= 1)
    .map(([code, count]) => {
      const mCode = code as MisconceptionCode;
      const c = count || 0;
      return {
        code: mCode,
        count: c,
        name: MISCONCEPTIONS[mCode]?.name || mCode,
        isConfirmed: confirmedMap[mCode] === true || c >= 2,
        rootCause: classifyRootCause(mCode)
      };
    })
    .sort((a, b) => b.count - a.count);
}
