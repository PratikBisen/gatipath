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
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multiple_choice' | 'fraction_input';

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
  misconceptionTag?: MisconceptionCode;
  prerequisiteTopicId?: string;
}

export interface Attempt {
  id: string;
  studentId: string;
  questionId: string;
  topicId: string;
  submittedAnswer: string;
  isCorrect: boolean;
  hintUsed: boolean;
  scoreCredit: number; // 100 for independent correct, 70 for hint correct, 0 for incorrect
  detectedMisconception?: MisconceptionCode;
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
