import { Student, Teacher, ClassRoom, ClassStudent, StudentTopicProgress, Attempt, Recommendation, TeacherIntervention } from '../../types';

export const DEMO_TEACHER: Teacher = {
  id: 'teacher-sunita',
  displayName: 'Sunita Verma',
  email: 'teacher@gatipath.demo',
  createdAt: '2026-10-01T08:00:00.000Z'
};

export const DEMO_CLASS: ClassRoom = {
  id: 'class-7b',
  name: 'Class 7-B Mathematics',
  classLevel: 7,
  teacherId: 'teacher-sunita',
  academicYear: '2026-2027'
};

export const DEMO_STUDENTS: Student[] = [
  {
    id: 'student-aarav',
    displayName: 'Aarav Sharma',
    email: 'student@gatipath.demo',
    classLevel: 7,
    preferredLanguage: 'en',
    avatarSeed: 'AS',
    createdAt: '2026-10-05T09:00:00.000Z'
  },
  {
    id: 'student-priya',
    displayName: 'Priya Patel',
    email: 'priya@gatipath.demo',
    classLevel: 7,
    preferredLanguage: 'en',
    avatarSeed: 'PP',
    createdAt: '2026-10-05T09:05:00.000Z'
  },
  {
    id: 'student-rohan',
    displayName: 'Rohan Gupta',
    email: 'rohan@gatipath.demo',
    classLevel: 7,
    preferredLanguage: 'en',
    avatarSeed: 'RG',
    createdAt: '2026-10-05T09:10:00.000Z'
  },
  {
    id: 'student-ananya',
    displayName: 'Ananya Iyer',
    email: 'ananya@gatipath.demo',
    classLevel: 7,
    preferredLanguage: 'en',
    avatarSeed: 'AI',
    createdAt: '2026-10-05T09:15:00.000Z'
  },
  {
    id: 'student-kabir',
    displayName: 'Kabir Mehta',
    email: 'kabir@gatipath.demo',
    classLevel: 7,
    preferredLanguage: 'en',
    avatarSeed: 'KM',
    createdAt: '2026-10-05T09:20:00.000Z'
  },
  {
    id: 'student-diya',
    displayName: 'Diya Nair',
    email: 'diya@gatipath.demo',
    classLevel: 7,
    preferredLanguage: 'en',
    avatarSeed: 'DN',
    createdAt: '2026-10-05T09:25:00.000Z'
  },
  {
    id: 'student-vihaan',
    displayName: 'Vihaan Reddy',
    email: 'vihaan@gatipath.demo',
    classLevel: 7,
    preferredLanguage: 'en',
    avatarSeed: 'VR',
    createdAt: '2026-10-05T09:30:00.000Z'
  },
  {
    id: 'student-meera',
    displayName: 'Meera Joshi',
    email: 'meera@gatipath.demo',
    classLevel: 7,
    preferredLanguage: 'en',
    avatarSeed: 'MJ',
    createdAt: '2026-10-05T09:35:00.000Z'
  },
  {
    id: 'student-aditya',
    displayName: 'Aditya Singh',
    email: 'aditya@gatipath.demo',
    classLevel: 7,
    preferredLanguage: 'en',
    avatarSeed: 'AS2',
    createdAt: '2026-10-05T09:40:00.000Z'
  },
  {
    id: 'student-sara',
    displayName: 'Sara Khan',
    email: 'sara@gatipath.demo',
    classLevel: 7,
    preferredLanguage: 'en',
    avatarSeed: 'SK',
    createdAt: '2026-10-05T09:45:00.000Z'
  }
];

export const DEMO_CLASS_STUDENTS: ClassStudent[] = DEMO_STUDENTS.map((s, index) => ({
  id: `cs-${s.id}`,
  classId: DEMO_CLASS.id,
  studentId: s.id,
  rollNumber: index + 1
}));

export const INITIAL_PROGRESS: StudentTopicProgress[] = [
  // Aarav: Ready for Topic 3
  { id: 'p-aarav-1', studentId: 'student-aarav', topicId: 'topic-1', masteryScore: 88, totalAttempts: 6, correctAttempts: 5, hintsUsedCount: 1, status: 'mastered', lastAssessmentScore: 90, updatedAt: '2026-10-30T10:00:00Z' },
  { id: 'p-aarav-2', studentId: 'student-aarav', topicId: 'topic-2', masteryScore: 76, totalAttempts: 5, correctAttempts: 4, hintsUsedCount: 1, status: 'ready_for_test', lastAssessmentScore: 75, updatedAt: '2026-10-30T11:00:00Z' },
  { id: 'p-aarav-3', studentId: 'student-aarav', topicId: 'topic-3', masteryScore: 20, totalAttempts: 1, correctAttempts: 0, hintsUsedCount: 0, status: 'in_progress', updatedAt: '2026-10-31T05:30:00Z' },
  { id: 'p-aarav-4', studentId: 'student-aarav', topicId: 'topic-4', masteryScore: 0, totalAttempts: 0, correctAttempts: 0, hintsUsedCount: 0, status: 'not_started', updatedAt: '2026-10-31T05:30:00Z' },

  // Priya: Advanced
  { id: 'p-priya-1', studentId: 'student-priya', topicId: 'topic-1', masteryScore: 95, totalAttempts: 5, correctAttempts: 5, hintsUsedCount: 0, status: 'mastered', lastAssessmentScore: 100, updatedAt: '2026-10-29T14:00:00Z' },
  { id: 'p-priya-2', studentId: 'student-priya', topicId: 'topic-2', masteryScore: 92, totalAttempts: 5, correctAttempts: 5, hintsUsedCount: 0, status: 'mastered', lastAssessmentScore: 95, updatedAt: '2026-10-29T15:00:00Z' },
  { id: 'p-priya-3', studentId: 'student-priya', topicId: 'topic-3', masteryScore: 88, totalAttempts: 6, correctAttempts: 5, hintsUsedCount: 1, status: 'mastered', lastAssessmentScore: 88, updatedAt: '2026-10-30T16:00:00Z' },
  { id: 'p-priya-4', studentId: 'student-priya', topicId: 'topic-4', masteryScore: 65, totalAttempts: 3, correctAttempts: 2, hintsUsedCount: 1, status: 'in_progress', updatedAt: '2026-10-31T04:00:00Z' },

  // Rohan: Struggling with equivalent fractions
  { id: 'p-rohan-1', studentId: 'student-rohan', topicId: 'topic-1', masteryScore: 42, totalAttempts: 7, correctAttempts: 2, hintsUsedCount: 4, status: 'in_progress', updatedAt: '2026-10-30T12:00:00Z' },
  { id: 'p-rohan-2', studentId: 'student-rohan', topicId: 'topic-2', masteryScore: 25, totalAttempts: 3, correctAttempts: 0, hintsUsedCount: 2, status: 'in_progress', updatedAt: '2026-10-30T13:00:00Z' },
  { id: 'p-rohan-3', studentId: 'student-rohan', topicId: 'topic-3', masteryScore: 0, totalAttempts: 0, correctAttempts: 0, hintsUsedCount: 0, status: 'not_started', updatedAt: '2026-10-30T13:00:00Z' },
  { id: 'p-rohan-4', studentId: 'student-rohan', topicId: 'topic-4', masteryScore: 0, totalAttempts: 0, correctAttempts: 0, hintsUsedCount: 0, status: 'not_started', updatedAt: '2026-10-30T13:00:00Z' },

  // Ananya: Needs support with LCM
  { id: 'p-ananya-1', studentId: 'student-ananya', topicId: 'topic-1', masteryScore: 78, totalAttempts: 5, correctAttempts: 4, hintsUsedCount: 1, status: 'ready_for_test', updatedAt: '2026-10-29T10:00:00Z' },
  { id: 'p-ananya-2', studentId: 'student-ananya', topicId: 'topic-2', masteryScore: 55, totalAttempts: 6, correctAttempts: 3, hintsUsedCount: 2, status: 'in_progress', updatedAt: '2026-10-30T09:00:00Z' },
  { id: 'p-ananya-3', studentId: 'student-ananya', topicId: 'topic-3', masteryScore: 35, totalAttempts: 3, correctAttempts: 1, hintsUsedCount: 1, status: 'in_progress', updatedAt: '2026-10-30T15:00:00Z' },
  { id: 'p-ananya-4', studentId: 'student-ananya', topicId: 'topic-4', masteryScore: 0, totalAttempts: 0, correctAttempts: 0, hintsUsedCount: 0, status: 'not_started', updatedAt: '2026-10-30T15:00:00Z' },

  // Kabir
  { id: 'p-kabir-1', studentId: 'student-kabir', topicId: 'topic-1', masteryScore: 82, totalAttempts: 4, correctAttempts: 3, hintsUsedCount: 1, status: 'ready_for_test', updatedAt: '2026-10-28T10:00:00Z' },
  { id: 'p-kabir-2', studentId: 'student-kabir', topicId: 'topic-2', masteryScore: 68, totalAttempts: 5, correctAttempts: 3, hintsUsedCount: 1, status: 'in_progress', updatedAt: '2026-10-29T11:00:00Z' },
  { id: 'p-kabir-3', studentId: 'student-kabir', topicId: 'topic-3', masteryScore: 0, totalAttempts: 0, correctAttempts: 0, hintsUsedCount: 0, status: 'not_started', updatedAt: '2026-10-29T11:00:00Z' },
  { id: 'p-kabir-4', studentId: 'student-kabir', topicId: 'topic-4', masteryScore: 0, totalAttempts: 0, correctAttempts: 0, hintsUsedCount: 0, status: 'not_started', updatedAt: '2026-10-29T11:00:00Z' },

  // Diya
  { id: 'p-diya-1', studentId: 'student-diya', topicId: 'topic-1', masteryScore: 92, totalAttempts: 5, correctAttempts: 5, hintsUsedCount: 0, status: 'mastered', lastAssessmentScore: 92, updatedAt: '2026-10-29T11:00:00Z' },
  { id: 'p-diya-2', studentId: 'student-diya', topicId: 'topic-2', masteryScore: 86, totalAttempts: 5, correctAttempts: 4, hintsUsedCount: 1, status: 'mastered', lastAssessmentScore: 85, updatedAt: '2026-10-30T12:00:00Z' },
  { id: 'p-diya-3', studentId: 'student-diya', topicId: 'topic-3', masteryScore: 78, totalAttempts: 5, correctAttempts: 4, hintsUsedCount: 1, status: 'ready_for_test', updatedAt: '2026-10-31T03:00:00Z' },
  { id: 'p-diya-4', studentId: 'student-diya', topicId: 'topic-4', masteryScore: 0, totalAttempts: 0, correctAttempts: 0, hintsUsedCount: 0, status: 'not_started', updatedAt: '2026-10-31T03:00:00Z' },

  // Vihaan
  { id: 'p-vihaan-1', studentId: 'student-vihaan', topicId: 'topic-1', masteryScore: 60, totalAttempts: 4, correctAttempts: 2, hintsUsedCount: 2, status: 'in_progress', updatedAt: '2026-10-27T10:00:00Z' },
  { id: 'p-vihaan-2', studentId: 'student-vihaan', topicId: 'topic-2', masteryScore: 35, totalAttempts: 2, correctAttempts: 0, hintsUsedCount: 1, status: 'in_progress', updatedAt: '2026-10-27T11:00:00Z' },
  { id: 'p-vihaan-3', studentId: 'student-vihaan', topicId: 'topic-3', masteryScore: 0, totalAttempts: 0, correctAttempts: 0, hintsUsedCount: 0, status: 'not_started', updatedAt: '2026-10-27T11:00:00Z' },
  { id: 'p-vihaan-4', studentId: 'student-vihaan', topicId: 'topic-4', masteryScore: 0, totalAttempts: 0, correctAttempts: 0, hintsUsedCount: 0, status: 'not_started', updatedAt: '2026-10-27T11:00:00Z' },

  // Meera
  { id: 'p-meera-1', studentId: 'student-meera', topicId: 'topic-1', masteryScore: 58, totalAttempts: 6, correctAttempts: 3, hintsUsedCount: 2, status: 'in_progress', updatedAt: '2026-10-30T14:00:00Z' },
  { id: 'p-meera-2', studentId: 'student-meera', topicId: 'topic-2', masteryScore: 40, totalAttempts: 3, correctAttempts: 1, hintsUsedCount: 1, status: 'in_progress', updatedAt: '2026-10-30T15:00:00Z' },
  { id: 'p-meera-3', studentId: 'student-meera', topicId: 'topic-3', masteryScore: 0, totalAttempts: 0, correctAttempts: 0, hintsUsedCount: 0, status: 'not_started', updatedAt: '2026-10-30T15:00:00Z' },
  { id: 'p-meera-4', studentId: 'student-meera', topicId: 'topic-4', masteryScore: 0, totalAttempts: 0, correctAttempts: 0, hintsUsedCount: 0, status: 'not_started', updatedAt: '2026-10-30T15:00:00Z' },

  // Aditya
  { id: 'p-aditya-1', studentId: 'student-aditya', topicId: 'topic-1', masteryScore: 76, totalAttempts: 4, correctAttempts: 3, hintsUsedCount: 1, status: 'ready_for_test', updatedAt: '2026-10-28T09:00:00Z' },
  { id: 'p-aditya-2', studentId: 'student-aditya', topicId: 'topic-2', masteryScore: 72, totalAttempts: 4, correctAttempts: 3, hintsUsedCount: 1, status: 'ready_for_test', updatedAt: '2026-10-29T10:00:00Z' },
  { id: 'p-aditya-3', studentId: 'student-aditya', topicId: 'topic-3', masteryScore: 48, totalAttempts: 3, correctAttempts: 1, hintsUsedCount: 1, status: 'in_progress', updatedAt: '2026-10-30T11:00:00Z' },
  { id: 'p-aditya-4', studentId: 'student-aditya', topicId: 'topic-4', masteryScore: 0, totalAttempts: 0, correctAttempts: 0, hintsUsedCount: 0, status: 'not_started', updatedAt: '2026-10-30T11:00:00Z' },

  // Sara
  { id: 'p-sara-1', studentId: 'student-sara', topicId: 'topic-1', masteryScore: 84, totalAttempts: 4, correctAttempts: 3, hintsUsedCount: 0, status: 'ready_for_test', updatedAt: '2026-10-29T13:00:00Z' },
  { id: 'p-sara-2', studentId: 'student-sara', topicId: 'topic-2', masteryScore: 78, totalAttempts: 4, correctAttempts: 3, hintsUsedCount: 1, status: 'ready_for_test', updatedAt: '2026-10-30T14:00:00Z' },
  { id: 'p-sara-3', studentId: 'student-sara', topicId: 'topic-3', masteryScore: 82, totalAttempts: 5, correctAttempts: 4, hintsUsedCount: 1, status: 'ready_for_test', updatedAt: '2026-10-30T16:00:00Z' },
  { id: 'p-sara-4', studentId: 'student-sara', topicId: 'topic-4', masteryScore: 55, totalAttempts: 3, correctAttempts: 1, hintsUsedCount: 1, status: 'in_progress', updatedAt: '2026-10-31T05:00:00Z' }
];

export const INITIAL_ATTEMPTS: Attempt[] = [
  // Aarav's initial attempt on Topic 3 (The demonstration scenario starter!)
  {
    id: 'att-aarav-init',
    studentId: 'student-aarav',
    questionId: 'q3-1',
    topicId: 'topic-3',
    submittedAnswer: 'opt-b', // 2/8 -> denominator_addition_error
    isCorrect: false,
    hintUsed: false,
    scoreCredit: 0,
    detectedMisconception: 'denominator_addition_error',
    timeTakenSeconds: 34,
    createdAt: '2026-10-31T05:28:00Z'
  },
  // Aarav's successful past attempts on Topic 1 & 2
  {
    id: 'att-aarav-1',
    studentId: 'student-aarav',
    questionId: 'q1-1',
    topicId: 'topic-1',
    submittedAnswer: 'opt-a',
    isCorrect: true,
    hintUsed: false,
    scoreCredit: 100,
    timeTakenSeconds: 18,
    createdAt: '2026-10-30T09:40:00Z'
  },
  {
    id: 'att-aarav-2',
    studentId: 'student-aarav',
    questionId: 'q1-2',
    topicId: 'topic-1',
    submittedAnswer: 'opt-a',
    isCorrect: true,
    hintUsed: false,
    scoreCredit: 100,
    timeTakenSeconds: 22,
    createdAt: '2026-10-30T09:45:00Z'
  },
  {
    id: 'att-aarav-3',
    studentId: 'student-aarav',
    questionId: 'q2-1',
    topicId: 'topic-2',
    submittedAnswer: 'opt-a',
    isCorrect: true,
    hintUsed: false,
    scoreCredit: 100,
    timeTakenSeconds: 15,
    createdAt: '2026-10-30T10:45:00Z'
  },
  // Rohan's attempts demonstrating equivalent fraction difficulty
  {
    id: 'att-rohan-1',
    studentId: 'student-rohan',
    questionId: 'q1-2',
    topicId: 'topic-1',
    submittedAnswer: 'opt-b',
    isCorrect: false,
    hintUsed: false,
    scoreCredit: 0,
    detectedMisconception: 'equivalent_fraction_error',
    timeTakenSeconds: 45,
    createdAt: '2026-10-30T11:50:00Z'
  },
  {
    id: 'att-rohan-2',
    studentId: 'student-rohan',
    questionId: 'q1-7',
    topicId: 'topic-1',
    submittedAnswer: 'opt-c',
    isCorrect: false,
    hintUsed: true,
    scoreCredit: 0,
    detectedMisconception: 'equivalent_fraction_error',
    timeTakenSeconds: 52,
    createdAt: '2026-10-30T11:58:00Z'
  },
  // Ananya's attempts on LCM
  {
    id: 'att-ananya-1',
    studentId: 'student-ananya',
    questionId: 'q2-3',
    topicId: 'topic-2',
    submittedAnswer: 'opt-b',
    isCorrect: false,
    hintUsed: false,
    scoreCredit: 0,
    detectedMisconception: 'lcm_error',
    timeTakenSeconds: 40,
    createdAt: '2026-10-30T08:50:00Z'
  }
];

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  // Aarav's active recommendation based on his denominator_addition_error attempt
  {
    id: 'rec-aarav-1',
    studentId: 'student-aarav',
    topicId: 'topic-3',
    recommendationType: 'targeted_explanation',
    title: 'Visual Concept: Why Denominators Are Never Added',
    explanation: 'Recommended because your recent attempt on 1/4 + 1/4 resulted in 2/8 (denominator addition error). Let us review why the denominator stays 4 before trying another problem.',
    misconceptionTag: 'denominator_addition_error',
    suggestedActionLabel: 'Review Concept & Visual Model',
    suggestedActionRoute: '/learn/topic-3',
    status: 'active',
    createdAt: '2026-10-31T05:29:00Z'
  },
  // Rohan's active recommendation for equivalent fractions
  {
    id: 'rec-rohan-1',
    studentId: 'student-rohan',
    topicId: 'topic-1',
    recommendationType: 'prerequisite_review',
    title: 'Prerequisite Gap: Equivalent Fractions',
    explanation: 'Recommended because recent attempts show difficulty scaling numerators and denominators equally. Revisit Topic 1 practice.',
    misconceptionTag: 'equivalent_fraction_error',
    suggestedActionLabel: 'Practice Equivalent Fractions',
    suggestedActionRoute: '/solve/topic-1',
    status: 'active',
    createdAt: '2026-10-30T12:05:00Z'
  }
];

export const INITIAL_INTERVENTIONS: TeacherIntervention[] = [
  {
    id: 'int-1',
    teacherId: 'teacher-sunita',
    studentId: 'student-rohan',
    topicId: 'topic-1',
    interventionType: 'assign_remedial',
    interventionNote: 'Assigned 5 foundational questions on visual fraction strips to strengthen understanding of equivalent multipliers.',
    status: 'in_progress',
    createdAt: '2026-10-30T13:30:00Z'
  },
  {
    id: 'int-2',
    teacherId: 'teacher-sunita',
    studentId: 'student-ananya',
    topicId: 'topic-2',
    interventionType: 'one_on_one',
    interventionNote: 'Quick 5-minute board check on finding LCM of unlike denominators.',
    status: 'pending',
    createdAt: '2026-10-30T16:00:00Z'
  }
];
