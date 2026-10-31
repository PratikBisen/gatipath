import { Topic, Attempt, StudentTopicProgress, Recommendation, MisconceptionCode } from '../types';
import { detectRepeatedMisconceptions } from './misconceptions';
import { checkPrerequisites } from './prerequisites';
import { MASTERY_THRESHOLDS } from './mastery';
import { MISCONCEPTIONS } from '../data/curriculum/fractions';

export interface RecommendationContext {
  studentId: string;
  currentTopic: Topic;
  allTopics: Topic[];
  allProgress: Record<string, StudentTopicProgress>;
  topicAttempts: Attempt[];
}

export function generateAdaptiveRecommendation(context: RecommendationContext): Recommendation {
  const { studentId, currentTopic, allTopics, allProgress, topicAttempts } = context;
  const currentProgress = allProgress[currentTopic.id];
  const currentMastery = currentProgress ? currentProgress.masteryScore : 0;

  // 1. Check for Misconceptions in recent attempts
  const detectedMisconceptions = detectRepeatedMisconceptions(topicAttempts);
  if (detectedMisconceptions.length > 0) {
    const topMisconception = detectedMisconceptions[0];
    const details = MISCONCEPTIONS[topMisconception.code];

    return {
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      studentId,
      topicId: currentTopic.id,
      recommendationType: 'targeted_explanation',
      title: `Concept Review: ${details ? details.name : 'Targeted Guidance'}`,
      explanation: `Recommended because your recent attempt showed a tendency to make the '${details?.name || 'arithmetic'}' error. Understanding this rule will unlock faster problem solving.`,
      misconceptionTag: topMisconception.code,
      suggestedActionLabel: 'Review Concept Lesson',
      suggestedActionRoute: `/learn/${currentTopic.id}`,
      status: 'active',
      createdAt: new Date().toISOString()
    };
  }

  // 2. Check Prerequisite Readiness
  const prereqCheck = checkPrerequisites(currentTopic, allTopics, allProgress);
  if (!prereqCheck.isSatisfied) {
    const missing = prereqCheck.missingPrerequisites[0];
    return {
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      studentId,
      topicId: missing.topicId,
      recommendationType: 'prerequisite_review',
      title: `Prerequisite Gap: ${missing.topicTitle}`,
      explanation: `Let's revisit ${missing.topicTitle} (current mastery: ${missing.currentMastery}%) because ${currentTopic.title} builds directly upon it.`,
      suggestedActionLabel: `Practise ${missing.topicTitle}`,
      suggestedActionRoute: `/solve/${missing.topicId}`,
      status: 'active',
      createdAt: new Date().toISOString()
    };
  }

  // 3. Check for Struggling Recent Performance
  if (topicAttempts.length >= 3) {
    const recent = topicAttempts.slice(-3);
    const correctRecent = recent.filter(a => a.isCorrect).length;
    if (correctRecent <= 1) {
      return {
        id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        studentId,
        topicId: currentTopic.id,
        recommendationType: 'guided_practice',
        title: 'Step-by-Step Guided Practice',
        explanation: 'Recommended because 2 of your last 3 attempts were challenging. Stepping down difficulty will help rebuild confidence.',
        suggestedActionLabel: 'Solve Guided Questions',
        suggestedActionRoute: `/solve/${currentTopic.id}`,
        status: 'active',
        createdAt: new Date().toISOString()
      };
    }
  }

  // 4. Check for Assessment Readiness or High Performance
  const independentCorrect = topicAttempts.filter(a => a.isCorrect && !a.hintUsed).length;
  if (currentMastery >= MASTERY_THRESHOLDS.PREREQUISITE_MINIMUM && independentCorrect >= 3) {
    if (currentProgress?.status !== 'mastered') {
      return {
        id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        studentId,
        topicId: currentTopic.id,
        recommendationType: 'take_assessment',
        title: 'Ready for Topic Assessment',
        explanation: `Recommended because you have solved ${independentCorrect} questions independently with strong mastery (${currentMastery}%). Take the assessment to demonstrate mastery!`,
        suggestedActionLabel: 'Start Assessment',
        suggestedActionRoute: `/test/${currentTopic.id}`,
        status: 'active',
        createdAt: new Date().toISOString()
      };
    }
  }

  // 5. Default: Continue Practicing Current Topic
  return {
    id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    studentId,
    topicId: currentTopic.id,
    recommendationType: 'advance_difficulty',
    title: 'Adaptive Practice',
    explanation: `Continue practicing ${currentTopic.title}. Each question adapts dynamically to your pace.`,
    suggestedActionLabel: 'Continue Practice',
    suggestedActionRoute: `/solve/${currentTopic.id}`,
    status: 'active',
    createdAt: new Date().toISOString()
  };
}
