import { Attempt, Question, ErrorRootCause, MisconceptionCode } from '../../types';

export interface StudentArchetype {
  id: string;
  name: string;
  description: string;
  profileType: 'prerequisite_gap' | 'conceptual_trap' | 'calculation_slip' | 'accelerated_master' | 'scaffolded_learner';
  expectedMisconceptions: MisconceptionCode[];
  expectedRootCause: ErrorRootCause;
  answerStrategy: (question: Question, attemptIndex: number) => {
    optionId: string;
    hintLevelToRequest: number;
    intentionalErrorType?: ErrorRootCause;
  };
}

export const SYNTHETIC_STUDENT_ARCHETYPES: StudentArchetype[] = [
  // Archetype 1: Foundation Gap (Rohan Archetype)
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
      return { optionId: wrongOpt?.id || question.correctAnswer, hintLevelToRequest: 0, intentionalErrorType: 'prerequisite_gap' };
    }
  },

  // Archetype 2: Conceptual Trap (Aarav Archetype)
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

  // Archetype 3: Calculation Slip (Arithmetic Noise without conceptual flaw)
  {
    id: 'arch-slip-student',
    name: 'Calculation Slip (Arithmetic Mistake)',
    description: 'Understands denominator preservation and common denominators, but occasionally makes an arithmetic slip on the numerator.',
    profileType: 'calculation_slip',
    expectedMisconceptions: [],
    expectedRootCause: 'calculation_slip',
    answerStrategy: (question: Question, attemptIndex: number) => {
      if (attemptIndex === 1) {
        // Find an option that is NOT tagged with a conceptual misconception (e.g. calculation slip)
        const slipOpt = question.options?.find(o => o.id !== question.correctAnswer && !o.misconceptionCode);
        if (slipOpt) {
          return { optionId: slipOpt.id, hintLevelToRequest: 0, intentionalErrorType: 'calculation_slip' };
        }
      }
      return { optionId: question.correctAnswer, hintLevelToRequest: 0 };
    }
  },

  // Archetype 4: Accelerated Master (Priya Archetype)
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

  // Archetype 5: Scaffolded Learner (Benefits from Progressive Hints)
  {
    id: 'arch-scaffold-learner',
    name: 'Scaffolded Learner (Guided Growth)',
    description: 'Struggles when answering cold, but reaches correct answer when shown Stage 1 or 2 hints.',
    profileType: 'scaffolded_learner',
    expectedMisconceptions: [],
    expectedRootCause: 'unclassified',
    answerStrategy: (question: Question, attemptIndex: number) => {
      // Uses Stage 1 hint and answers correctly with hint assistance
      return { optionId: question.correctAnswer, hintLevelToRequest: 1 };
    }
  }
];
