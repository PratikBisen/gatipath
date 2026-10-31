/**
 * GatiPath Authoritative Adaptive Engine Configuration & Pedagogical Business Rules.
 * Single source of truth for all thresholds, scoring models, and state transitions.
 */

export const ENGINE_CONFIG = {
  // Mastery Score Thresholds (Scale: 0 to 100)
  THRESHOLDS: {
    NEEDS_SUPPORT: 39,
    DEVELOPING: 69,
    PREREQUISITE_MINIMUM: 70, // Minimum mastery required in prerequisite topic to unlock dependent topic
    ALMOST_MASTERED: 84,
    MASTERED: 85,             // Score threshold required for topic mastery status
    ASSESSMENT_PASS: 80,       // Score percentage required to pass summative assessment
  },

  // Exponential Moving Average (EMA) Parameters
  MASTERY: {
    EMA_HISTORY_WEIGHT: 0.7,   // 70% weight on accumulated historical mastery
    EMA_ATTEMPT_WEIGHT: 0.3,   // 30% weight on new attempt score
    COLD_START_WEIGHT: 0.6,    // Initial attempt multiplier when starting from 0 mastery
    ASSESSMENT_BLEND_WEIGHT: 0.5, // 50/50 blend between practice mastery and formal summative score
    MIN_INDEPENDENT_FOR_MASTERY: 3, // Anti-slop: Minimum independent correct solves required for 'mastered'
    MIN_ATTEMPTS_FOR_TEST: 3,       // Minimum practice attempts before summative test unlocks
  },

  // Progressive Hint Credit Schedule (0 to 100 points)
  HINT_CREDITS: {
    INDEPENDENT_CORRECT: 100, // Solved without hints
    STAGE_1_CONCEPTUAL: 90,   // Stage 1: Conceptual reminder
    STAGE_2_GUIDED_STEP: 75,  // Stage 2: Guided next step
    STAGE_3_EXPLANATION: 55,  // Stage 3: Specific mathematical breakdown
    STAGE_4_WORKED_SOLUTION: 40, // Stage 4: Full step-by-step worked answer
    LEGACY_HINT_DEFAULT: 70,  // Backward compatibility fallback for single-hint items
    INCORRECT: 0,             // Any incorrect answer
  },

  // Dynamic Item Selection & Difficulty Pacing
  DIFFICULTY: {
    ROLLING_WINDOW_SIZE: 5,   // Number of recent attempts evaluated
    HARD_ACCURACY_THRESHOLD: 0.75, // >= 75% accuracy (min 3 attempts) -> 'hard'
    MEDIUM_ACCURACY_THRESHOLD: 0.50, // >= 50% accuracy -> 'medium'
    MIN_ATTEMPTS_FOR_HARD: 3,
  },

  // Smart Diagnostic Placement
  DIAGNOSTIC: {
    MIN_QUESTIONS: 2,         // Minimum probes needed to detect gradient
    MAX_QUESTIONS: 5,         // Efficiency ceiling: never exceed 5 probes
    PIVOT_TOPIC_ID: 'topic-2', // Midpoint topic to start diagnostic assessment
  },

  // Root-Cause Attribution & Anti-Slop Confirmation
  DIAGNOSIS: {
    CONFIRMATION_MIN_ATTEMPTS: 2, // Ambiguous wrong answer requires 2 occurrences before confirmed label
  }
} as const;

export type EngineConfig = typeof ENGINE_CONFIG;
