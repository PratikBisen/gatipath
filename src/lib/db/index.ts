import {
  Student, Teacher, ClassRoom, ClassStudent, Topic, Question, Attempt,
  StudentTopicProgress, Recommendation, TeacherIntervention, InterventionStatus
} from '../../types';
import {
  DEMO_TEACHER, DEMO_CLASS, DEMO_STUDENTS, DEMO_CLASS_STUDENTS,
  INITIAL_PROGRESS, INITIAL_ATTEMPTS, INITIAL_RECOMMENDATIONS, INITIAL_INTERVENTIONS
} from '../../data/seed/initialData';
import { TOPICS, QUESTIONS } from '../../data/curriculum/fractions';
import { calculateNewMastery, determineTopicStatus } from '../../engine/mastery';
import { generateAdaptiveRecommendation } from '../../engine/recommendation';

const STORAGE_KEYS = {
  STUDENTS: 'gatipath_students',
  TEACHERS: 'gatipath_teachers',
  CLASSES: 'gatipath_classes',
  CLASS_STUDENTS: 'gatipath_class_students',
  TOPICS: 'gatipath_topics',
  QUESTIONS: 'gatipath_questions',
  PROGRESS: 'gatipath_progress',
  ATTEMPTS: 'gatipath_attempts',
  RECOMMENDATIONS: 'gatipath_recommendations',
  INTERVENTIONS: 'gatipath_interventions',
  INITIALIZED: 'gatipath_initialized_v1'
};

class DatabaseRepository {
  private memoryCache: {
    students: Student[];
    teacher: Teacher;
    classRoom: ClassRoom;
    classStudents: ClassStudent[];
    topics: Topic[];
    questions: Question[];
    progress: StudentTopicProgress[];
    attempts: Attempt[];
    recommendations: Recommendation[];
    interventions: TeacherIntervention[];
  };

  constructor() {
    this.memoryCache = this.loadInitialData();
  }

  private loadFromStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading ${key} from storage:`, e);
      return defaultValue;
    }
  }

  private saveToStorage<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  }

  private loadInitialData() {
    const isInit = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.INITIALIZED) : null;
    if (!isInit) {
      this.resetDemoData();
    }

    return {
      students: this.loadFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, DEMO_STUDENTS),
      teacher: this.loadFromStorage<Teacher>(STORAGE_KEYS.TEACHERS, DEMO_TEACHER),
      classRoom: this.loadFromStorage<ClassRoom>(STORAGE_KEYS.CLASSES, DEMO_CLASS),
      classStudents: this.loadFromStorage<ClassStudent[]>(STORAGE_KEYS.CLASS_STUDENTS, DEMO_CLASS_STUDENTS),
      topics: this.loadFromStorage<Topic[]>(STORAGE_KEYS.TOPICS, TOPICS),
      questions: this.loadFromStorage<Question[]>(STORAGE_KEYS.QUESTIONS, QUESTIONS),
      progress: this.loadFromStorage<StudentTopicProgress[]>(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS),
      attempts: this.loadFromStorage<Attempt[]>(STORAGE_KEYS.ATTEMPTS, INITIAL_ATTEMPTS),
      recommendations: this.loadFromStorage<Recommendation[]>(STORAGE_KEYS.RECOMMENDATIONS, INITIAL_RECOMMENDATIONS),
      interventions: this.loadFromStorage<TeacherIntervention[]>(STORAGE_KEYS.INTERVENTIONS, INITIAL_INTERVENTIONS),
    };
  }

  public resetDemoData(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      this.saveToStorage(STORAGE_KEYS.STUDENTS, DEMO_STUDENTS);
      this.saveToStorage(STORAGE_KEYS.TEACHERS, DEMO_TEACHER);
      this.saveToStorage(STORAGE_KEYS.CLASSES, DEMO_CLASS);
      this.saveToStorage(STORAGE_KEYS.CLASS_STUDENTS, DEMO_CLASS_STUDENTS);
      this.saveToStorage(STORAGE_KEYS.TOPICS, TOPICS);
      this.saveToStorage(STORAGE_KEYS.QUESTIONS, QUESTIONS);
      this.saveToStorage(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
      this.saveToStorage(STORAGE_KEYS.ATTEMPTS, INITIAL_ATTEMPTS);
      this.saveToStorage(STORAGE_KEYS.RECOMMENDATIONS, INITIAL_RECOMMENDATIONS);
      this.saveToStorage(STORAGE_KEYS.INTERVENTIONS, INITIAL_INTERVENTIONS);
    }

    this.memoryCache = {
      students: [...DEMO_STUDENTS],
      teacher: { ...DEMO_TEACHER },
      classRoom: { ...DEMO_CLASS },
      classStudents: [...DEMO_CLASS_STUDENTS],
      topics: [...TOPICS],
      questions: [...QUESTIONS],
      progress: [...INITIAL_PROGRESS],
      attempts: [...INITIAL_ATTEMPTS],
      recommendations: [...INITIAL_RECOMMENDATIONS],
      interventions: [...INITIAL_INTERVENTIONS],
    };
  }

  // --- Student operations ---
  public getStudents(): Student[] {
    return [...this.memoryCache.students];
  }

  public getStudent(id: string): Student | undefined {
    return this.memoryCache.students.find(s => s.id === id);
  }

  // --- Teacher operations ---
  public getTeacher(): Teacher {
    return { ...this.memoryCache.teacher };
  }

  public getClassRoom(): ClassRoom {
    return { ...this.memoryCache.classRoom };
  }

  // --- Topics and Curriculum ---
  public getTopics(): Topic[] {
    return [...this.memoryCache.topics].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  }

  public getTopic(id: string): Topic | undefined {
    return this.memoryCache.topics.find(t => t.id === id);
  }

  public getQuestions(topicId?: string): Question[] {
    if (topicId) {
      return this.memoryCache.questions.filter(q => q.topicId === topicId);
    }
    return [...this.memoryCache.questions];
  }

  public getQuestion(id: string): Question | undefined {
    return this.memoryCache.questions.find(q => q.id === id);
  }

  // --- Progress & Attempts ---
  public getStudentProgress(studentId: string): StudentTopicProgress[] {
    return this.memoryCache.progress.filter(p => p.studentId === studentId);
  }

  public getTopicProgress(studentId: string, topicId: string): StudentTopicProgress | undefined {
    return this.memoryCache.progress.find(p => p.studentId === studentId && p.topicId === topicId);
  }

  public getAttempts(studentId: string, topicId?: string): Attempt[] {
    return this.memoryCache.attempts
      .filter(a => a.studentId === studentId && (!topicId || a.topicId === topicId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public recordAttempt(attempt: Omit<Attempt, 'id' | 'createdAt'>): {
    attempt: Attempt;
    updatedProgress: StudentTopicProgress;
    newRecommendation: Recommendation;
  } {
    const fullAttempt: Attempt = {
      ...attempt,
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };

    // 1. Save attempt
    this.memoryCache.attempts.push(fullAttempt);
    this.saveToStorage(STORAGE_KEYS.ATTEMPTS, this.memoryCache.attempts);

    // 2. Fetch or create progress record
    let progress = this.memoryCache.progress.find(
      p => p.studentId === attempt.studentId && p.topicId === attempt.topicId
    );

    const oldMastery = progress ? progress.masteryScore : 0;
    const newMastery = calculateNewMastery(oldMastery, attempt.isCorrect, attempt.hintUsed);

    const topicAttempts = this.memoryCache.attempts.filter(
      a => a.studentId === attempt.studentId && a.topicId === attempt.topicId
    );

    const correctIndependent = topicAttempts.filter(a => a.isCorrect && !a.hintUsed).length;
    const hasPassed = (progress?.lastAssessmentScore || 0) >= 80;

    const newStatus = determineTopicStatus(
      newMastery,
      topicAttempts.length,
      correctIndependent,
      hasPassed
    );

    if (progress) {
      progress.masteryScore = newMastery;
      progress.totalAttempts = topicAttempts.length;
      progress.correctAttempts = topicAttempts.filter(a => a.isCorrect).length;
      progress.hintsUsedCount += attempt.hintUsed ? 1 : 0;
      progress.status = newStatus;
      progress.updatedAt = new Date().toISOString();
    } else {
      progress = {
        id: `p-${attempt.studentId}-${attempt.topicId}`,
        studentId: attempt.studentId,
        topicId: attempt.topicId,
        masteryScore: newMastery,
        totalAttempts: 1,
        correctAttempts: attempt.isCorrect ? 1 : 0,
        hintsUsedCount: attempt.hintUsed ? 1 : 0,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      this.memoryCache.progress.push(progress);
    }
    this.saveToStorage(STORAGE_KEYS.PROGRESS, this.memoryCache.progress);

    // 3. Generate adaptive recommendation
    const topic = this.getTopic(attempt.topicId)!;
    const progressMap: Record<string, StudentTopicProgress> = {};
    for (const p of this.getStudentProgress(attempt.studentId)) {
      progressMap[p.topicId] = p;
    }

    const newRec = generateAdaptiveRecommendation({
      studentId: attempt.studentId,
      currentTopic: topic,
      allTopics: this.memoryCache.topics,
      allProgress: progressMap,
      topicAttempts
    });

    // Mark previous active recommendations for this topic as dismissed
    this.memoryCache.recommendations = this.memoryCache.recommendations.map(r => {
      if (r.studentId === attempt.studentId && r.topicId === attempt.topicId && r.status === 'active') {
        return { ...r, status: 'completed' as const };
      }
      return r;
    });

    this.memoryCache.recommendations.unshift(newRec);
    this.saveToStorage(STORAGE_KEYS.RECOMMENDATIONS, this.memoryCache.recommendations);

    return {
      attempt: fullAttempt,
      updatedProgress: { ...progress },
      newRecommendation: { ...newRec }
    };
  }

  // --- Assessments ---
  public recordAssessmentCompletion(
    studentId: string,
    topicId: string,
    scorePercentage: number
  ): StudentTopicProgress {
    let progress = this.memoryCache.progress.find(
      p => p.studentId === studentId && p.topicId === topicId
    );

    const isPassed = scorePercentage >= 80;
    const currentScore = progress ? progress.masteryScore : 0;
    // Blend assessment score with mastery: higher weight on formal assessment
    const finalMastery = Math.min(100, Math.round((currentScore * 0.5) + (scorePercentage * 0.5)));

    const topicAttempts = this.memoryCache.attempts.filter(
      a => a.studentId === studentId && a.topicId === topicId
    );
    const correctIndependent = topicAttempts.filter(a => a.isCorrect && !a.hintUsed).length;

    const newStatus = determineTopicStatus(
      finalMastery,
      topicAttempts.length,
      correctIndependent,
      isPassed
    );

    if (progress) {
      progress.masteryScore = finalMastery;
      progress.lastAssessmentScore = scorePercentage;
      progress.status = newStatus;
      progress.updatedAt = new Date().toISOString();
    } else {
      progress = {
        id: `p-${studentId}-${topicId}`,
        studentId,
        topicId,
        masteryScore: finalMastery,
        totalAttempts: 0,
        correctAttempts: 0,
        hintsUsedCount: 0,
        status: newStatus,
        lastAssessmentScore: scorePercentage,
        updatedAt: new Date().toISOString()
      };
      this.memoryCache.progress.push(progress);
    }

    this.saveToStorage(STORAGE_KEYS.PROGRESS, this.memoryCache.progress);
    return { ...progress };
  }

  // --- Recommendations ---
  public getRecommendations(studentId: string): Recommendation[] {
    return this.memoryCache.recommendations
      .filter(r => r.studentId === studentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // --- Teacher Interventions ---
  public getTeacherInterventions(teacherId?: string): TeacherIntervention[] {
    if (teacherId) {
      return this.memoryCache.interventions.filter(i => i.teacherId === teacherId);
    }
    return [...this.memoryCache.interventions];
  }

  public createIntervention(intervention: Omit<TeacherIntervention, 'id' | 'createdAt'>): TeacherIntervention {
    const newIntervention: TeacherIntervention = {
      ...intervention,
      id: `int-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };

    this.memoryCache.interventions.unshift(newIntervention);
    this.saveToStorage(STORAGE_KEYS.INTERVENTIONS, this.memoryCache.interventions);

    // Also push a high-priority recommendation for the student
    const studentTopic = this.getTopic(intervention.topicId);
    const teacherRec: Recommendation = {
      id: `rec-teacher-${Date.now()}`,
      studentId: intervention.studentId,
      topicId: intervention.topicId,
      recommendationType: 'targeted_explanation',
      title: `Teacher Action: ${studentTopic?.title || 'Targeted Practice'}`,
      explanation: `Teacher Note: "${intervention.interventionNote}"`,
      suggestedActionLabel: 'Open Assigned Activity',
      suggestedActionRoute: `/solve/${intervention.topicId}`,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.memoryCache.recommendations.unshift(teacherRec);
    this.saveToStorage(STORAGE_KEYS.RECOMMENDATIONS, this.memoryCache.recommendations);

    return newIntervention;
  }

  public updateInterventionStatus(id: string, status: InterventionStatus): boolean {
    const item = this.memoryCache.interventions.find(i => i.id === id);
    if (!item) return false;

    item.status = status;
    if (status === 'completed') {
      item.completedAt = new Date().toISOString();
    }
    this.saveToStorage(STORAGE_KEYS.INTERVENTIONS, this.memoryCache.interventions);
    return true;
  }
}

export const db = new DatabaseRepository();
