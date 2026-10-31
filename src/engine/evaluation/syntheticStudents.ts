import { Attempt, Question, ErrorRootCause, MisconceptionCode } from '../../types';

export type ArchetypeProfileType =
  | 'prerequisite_gap'
  | 'conceptual_trap'
  | 'calculation_slip'
  | 'ambiguous_wrong'
  | 'repeated_misconception'
  | 'correct_after_hints'
  | 'recovery_remediation'
  | 'accelerated_master'
  | 'inconsistent_performer';

export interface StudentArchetype {
  id: string;
  name: string;
  description: string;
  profileType: ArchetypeProfileType;
  expectedMisconceptions: MisconceptionCode[];
  expectedRootCause: ErrorRootCause;
  answerStrategy: (question: Question, attemptIndex: number) => {
    optionId: string;
    hintLevelToRequest: number;
    intentionalErrorType?: ErrorRootCause;
  };
}

export const SYNTHETIC_STUDENT_ARCHETYPES: StudentArchetype[] = [
  // 1. Foundation Gap (Rohan Archetype)
  {
    id: 'arch-rohan-prereq',
    name: 'Foundation Gap (Prerequisite Weakness)',
    description: 'Understands basic counting but lacks equivalence scaling and LCM foundation from Topics 1 & 2.',
    profileType: 'prerequisite_gap',
    expectedMisconceptions: ['equivalent_fraction_error', 'lcm_error', 'simplification_error'],
    expectedRootCause: 'prerequisite_gap',
    answerStrategy: (question: Question) => {
      // Prioritize foundational/prerequisite error distractors
      const prereqOpt = question.options?.find(o => 
        o.misconceptionCode === 'equivalent_fraction_error' || 
        o.misconceptionCode === 'lcm_error' || 
        o.misconceptionCode === 'simplification_error'
      );
      if (prereqOpt) {
        return { optionId: prereqOpt.id, hintLevelToRequest: 0, intentionalErrorType: 'prerequisite_gap' };
      }
      const wrongOpt = question.options?.find(o => o.id !== question.correctAnswer && o.misconceptionCode !== 'denominator_addition_error');
      return { optionId: wrongOpt?.id || question.correctAnswer, hintLevelToRequest: 0 };
    }
  },

  // 2. Conceptual Trap (Aarav Archetype)
  {
    id: 'arch-aarav-conceptual',
    name: 'Conceptual Trap (Denominator Addition)',
    description: 'Applies whole-number addition intuition to fractions, adding denominators directly (1/4 + 1/4 = 2/8).',
    profileType: 'conceptual_trap',
    expectedMisconceptions: ['denominator_addition_error'],
    expectedRootCause: 'conceptual_misunderstanding',
    answerStrategy: (question: Question) => {
      const denomAddOpt = question.options?.find(o => o.misconceptionCode === 'denominator_addition_error');
      if (denomAddOpt) {
        return { optionId: denomAddOpt.id, hintLevelToRequest: 0, intentionalErrorType: 'conceptual_misunderstanding' };
      }
      return { optionId: question.correctAnswer, hintLevelToRequest: 0 };
    }
  },

  // 3. Calculation Slip (Arithmetic Noise without conceptual flaw)
  {
    id: 'arch-slip-student',
    name: 'Calculation Slip (Arithmetic Mistake)',
    description: 'Understands denominator preservation and common denominators, but makes an arithmetic slip on numerator.',
    profileType: 'calculation_slip',
    expectedMisconceptions: [],
    expectedRootCause: 'calculation_slip',
    answerStrategy: (question: Question, attemptIndex: number) => {
      if (attemptIndex === 1) {
        // Find an option that is NOT tagged with a conceptual misconception
        const slipOpt = question.options?.find(o => o.id !== question.correctAnswer && !o.misconceptionCode);
        if (slipOpt) {
          return { optionId: slipOpt.id, hintLevelToRequest: 0, intentionalErrorType: 'calculation_slip' };
        }
      }
      return { optionId: question.correctAnswer, hintLevelToRequest: 0 };
    }
  },

  // 4. Ambiguous Wrong Answer (Random Guessing without Misconception Signature)
  {
    id: 'arch-ambiguous-guess',
    name: 'Ambiguous Wrong (Unclassified Mistake)',
    description: 'Picks an incorrect distractor that has no misconception mapping. Should NOT be falsely labeled as having a conceptual flaw.',
    profileType: 'ambiguous_wrong',
    expectedMisconceptions: [],
    expectedRootCause: 'unclassified',
    answerStrategy: (question: Question) => {
      // Find an option that is wrong and has no misconception code
      const unmappedOpt = question.options?.find(o => o.id !== question.correctAnswer && !o.misconceptionCode && !o.rootCause);
      if (unmappedOpt) {
        return { optionId: unmappedOpt.id, hintLevelToRequest: 0, intentionalErrorType: 'unclassified' };
      }
      // Fallback to any non-correct option
      const anyWrong = question.options?.find(o => o.id !== question.correctAnswer);
      return { optionId: anyWrong?.id || question.correctAnswer, hintLevelToRequest: 0 };
    }
  },

  // 5. Repeated Misconception (Entrenched Pattern)
  {
    id: 'arch-repeated-trap',
    name: 'Repeated Misconception (Entrenched Pattern)',
    description: 'Persistently adds denominators across every question, demonstrating an entrenched false mental model.',
    profileType: 'repeated_misconception',
    expectedMisconceptions: ['denominator_addition_error'],
    expectedRootCause: 'conceptual_misunderstanding',
    answerStrategy: (question: Question) => {
      const denomAddOpt = question.options?.find(o => o.misconceptionCode === 'denominator_addition_error');
      if (denomAddOpt) {
        return { optionId: denomAddOpt.id, hintLevelToRequest: 0, intentionalErrorType: 'conceptual_misunderstanding' };
      }
      return { optionId: question.correctAnswer, hintLevelToRequest: 0 };
    }
  },

  // 6. Correct Answers After Hints (Scaffolded Learner)
  {
    id: 'arch-scaffold-hints',
    name: 'Scaffolded Growth (Correct After Hints)',
    description: 'Requires a guided step (Stage 2 hint) before arriving at the correct answer; earns 75% partial credit.',
    profileType: 'correct_after_hints',
    expectedMisconceptions: [],
    expectedRootCause: 'unclassified',
    answerStrategy: (question: Question) => {
      return { optionId: question.correctAnswer, hintLevelToRequest: 2 };
    }
  },

  // 7. Recovery After Remediation
  {
    id: 'arch-recovery-remediation',
    name: 'Remediation Recovery (Learn & Rebound)',
    description: 'Makes conceptual errors initially (attempts 0 & 1), receives remedial guidance, then answers subsequent attempts correctly independently.',
    profileType: 'recovery_remediation',
    expectedMisconceptions: ['denominator_addition_error'],
    expectedRootCause: 'conceptual_misunderstanding',
    answerStrategy: (question: Question, attemptIndex: number) => {
      if (attemptIndex < 2) {
        const denomOpt = question.options?.find(o => o.misconceptionCode === 'denominator_addition_error');
        if (denomOpt) {
          return { optionId: denomOpt.id, hintLevelToRequest: 0, intentionalErrorType: 'conceptual_misunderstanding' };
        }
      }
      // After remediation, student solves correctly without hints
      return { optionId: question.correctAnswer, hintLevelToRequest: 0 };
    }
  },

  // 8. Accelerated Master (Priya Archetype)
  {
    id: 'arch-priya-master',
    name: 'Accelerated Master (High Aptitude)',
    description: 'Consistently selects mathematically correct representations independently without needing hints.',
    profileType: 'accelerated_master',
    expectedMisconceptions: [],
    expectedRootCause: 'unclassified',
    answerStrategy: (question: Question) => {
      return { optionId: question.correctAnswer, hintLevelToRequest: 0 };
    }
  },

  // 9. Inconsistent Student Performance (Fluctuating Performance)
  {
    id: 'arch-inconsistent-erratic',
    name: 'Inconsistent Performance (Noisy Learner)',
    description: 'Alternates between independent correct solves and arithmetic slips. Evaluates EMA stability against erratic noise.',
    profileType: 'inconsistent_performer',
    expectedMisconceptions: [],
    expectedRootCause: 'unclassified',
    answerStrategy: (question: Question, attemptIndex: number) => {
      if (attemptIndex % 2 === 1) {
        // Find an arithmetic distractor with no misconception code
        const slipOpt = question.options?.find(o => o.id !== question.correctAnswer && !o.misconceptionCode);
        if (slipOpt) {
          return { optionId: slipOpt.id, hintLevelToRequest: 0, intentionalErrorType: 'calculation_slip' };
        }
      }
      return { optionId: question.correctAnswer, hintLevelToRequest: 0 };
    }
  }
];
