export type Role = 'student' | 'teacher';

export interface Student {
  id: string;
  displayName: string;
  email: string;
  classLevel: number;
  preferredLanguage: string;
  avatarSeed: string;
  createdAt: string;
}

export interface Teacher {
  id: string;
  displayName: string;
  email: string;
  createdAt: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  classLevel: number;
  teacherId: string;
  academicYear: string;
}

export interface ClassStudent {
  id: string;
  classId: string;
  studentId: string;
  rollNumber: number;
}

export type TopicStatus = 'not_started' | 'in_progress' | 'ready_for_test' | 'mastered';

export interface Topic {
  id: string;
  title: string;
  description: string;
  classLevel: number;
  subject: string;
  sequenceOrder: number;
  estimatedMinutes: number;
  prerequisites: string[]; // Topic IDs that must be >= 70 mastery
  keyConcepts: string[];
  curriculumStandard?: string; // NCERT / CBSE Learning Outcome code
  ncertReference?: string; // Chapter & section reference
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multiple_choice' | 'fraction_input';

export type ErrorRootCause = 
  | 'conceptual_misunderstanding' // e.g. adding denominators directly, flipping division incorrectly
  | 'prerequisite_gap'           // e.g. inability to find common denominator/LCM or form equivalent fraction
  | 'calculation_slip'           // process is correct, but made an arithmetic slip in numerator calculation
  | 'unclassified';              // ambiguous wrong answer without specific diagnostic match

export type MisconceptionConfidence = 'suspected' | 'confirmed';

export type MisconceptionCode = 
  | 'denominator_addition_error'          // adding denominators directly e.g. 1/4 + 1/4 = 2/8
  | 'numerator_denominator_confusion'     // flipping numerator & denominator
  | 'equivalent_fraction_error'           // multiplying numerator without denominator or vice versa
  | 'lcm_error'                          // incorrect least common multiple / denominator
  | 'reciprocal_error'                   // forgetting to invert fraction when dividing
  | 'simplification_error'               // stopping before simplest form or dividing unevenly
  | 'comparison_by_numerator_only';       // comparing only top number ignoring denominator

export interface Misconception {
  code: MisconceptionCode;
  name: string;
  description: string;
  whyItHappens: string;
  remedialConcept: string;
  visualFixExplanation: string;
}

export interface VisualFractionModel {
  type: 'fraction_bar' | 'pie_chart' | 'grid_blocks';
  totalParts: number;
  shadedParts: number[]; // e.g. [1, 2] for 1/4 + 2/4
  labels?: string[];
  operation?: '+' | '-' | '×' | '÷' | '=';
}

export interface QuestionOption {
  id: string;
  text: string;
  misconceptionCode?: MisconceptionCode;
  rootCause?: ErrorRootCause;
  distractorExplanation?: string;
}

export interface ProgressiveHint {
  level: 1 | 2 | 3 | 4;
  stageName: 'Conceptual Reminder' | 'Guided Next Step' | 'Specific Explanation' | 'Worked Solution';
  text: string;
  scoreCreditPercent: number; // 90%, 75%, 55%, 40%
}

export interface Question {
  id: string;
  topicId: string;
  questionText: string;
  visualModel?: VisualFractionModel;
  questionType: QuestionType;
  options?: QuestionOption[];
  difficulty: DifficultyLevel;
  correctAnswer: string;
  explanation: string;
  hint: string;
  hints?: ProgressiveHint[]; // 4-stage progressive guidance
  misconceptionTag?: MisconceptionCode;
  rootCauseCategory?: ErrorRootCause;
  prerequisiteTopicId?: string;
  curriculumStandardCode?: string; // e.g. NCERT-M701
}

export interface Attempt {
  id: string;
  idempotencyKey?: string;
  studentId: string;
  questionId: string;
  topicId: string;
  submittedAnswer: string;
  isCorrect: boolean;
  hintUsed: boolean;
  hintLevelUsed?: number; // 0 (none), 1, 2, 3, or 4
  scoreCredit: number; // 100 for independent correct, scaled for hints, 0 for incorrect
  detectedMisconception?: MisconceptionCode;
  rootCause?: ErrorRootCause;
  misconceptionConfidence?: MisconceptionConfidence;
  timeTakenSeconds: number;
  createdAt: string;
}

export interface StudentTopicProgress {
  id: string;
  studentId: string;
  topicId: string;
  masteryScore: number; // 0 to 100
  totalAttempts: number;
  correctAttempts: number;
  hintsUsedCount: number;
  status: TopicStatus;
  lastAssessmentScore?: number;
  updatedAt: string;
}

export type RecommendationType =
  | 'targeted_explanation'
  | 'prerequisite_review'
  | 'guided_practice'
  | 'advance_difficulty'
  | 'take_assessment';

export interface Recommendation {
  id: string;
  studentId: string;
  topicId: string;
  recommendationType: RecommendationType;
  title: string;
  explanation: string;
  misconceptionTag?: MisconceptionCode;
  suggestedActionLabel: string;
  suggestedActionRoute: string;
  status: 'active' | 'dismissed' | 'completed';
  createdAt: string;
}

export type InterventionType = 'assign_remedial' | 'one_on_one' | 'peer_buddy' | 'exempt';
export type InterventionStatus = 'pending' | 'in_progress' | 'completed';

export interface TeacherIntervention {
  id: string;
  teacherId: string;
  studentId: string;
  topicId: string;
  interventionType: InterventionType;
  interventionNote: string;
  status: InterventionStatus;
  createdAt: string;
  completedAt?: string;
}

export interface DiagnosticQuestionResult {
  questionId: string;
  topicId: string;
  isCorrect: boolean;
  rootCause?: ErrorRootCause;
  detectedMisconception?: MisconceptionCode;
}

export interface DiagnosticSessionResult {
  id: string;
  studentId: string;
  totalQuestionsAsked: number;
  completedAt: string;
  recommendedStartingTopicId: string;
  estimatedMastery: Record<string, number>; // topicId -> baseline mastery
  detectedGaps: {
    topicId: string;
    rootCause: ErrorRootCause;
    description: string;
  }[];
  earlyStopReason: string;
}
