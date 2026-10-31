import { describe, it, expect } from 'vitest';
import { calculateNewMastery, determineTopicStatus } from '../engine/mastery';
import { evaluateStudentAnswer, detectRepeatedMisconceptions } from '../engine/misconceptions';
import { calculateTargetDifficulty, selectNextQuestion } from '../engine/difficulty';
import { generateAdaptiveRecommendation } from '../engine/recommendation';
import { QUESTIONS, TOPICS } from '../data/curriculum/fractions';
import { Attempt } from '../types';

describe('Adaptive Engine - Mastery Calculations', () => {
  it('updates mastery using EMA for independent correct answer', () => {
    const oldScore = 50;
    const newScore = calculateNewMastery(oldScore, true, false);
    // (50 * 0.7) + (100 * 0.3) = 35 + 30 = 65
    expect(newScore).toBe(65);
  });

  it('awards partial credit (70) when hint is used', () => {
    const oldScore = 50;
    const newScore = calculateNewMastery(oldScore, true, true);
    // (50 * 0.7) + (70 * 0.3) = 35 + 21 = 56
    expect(newScore).toBe(56);
  });

  it('reduces score when answer is incorrect', () => {
    const oldScore = 60;
    const newScore = calculateNewMastery(oldScore, false, false);
    // (60 * 0.7) + 0 = 42
    expect(newScore).toBe(42);
  });

  it('strict anti-slop: cannot be marked mastered without passed assessment and >=3 independent answers', () => {
    // High score, but has not passed assessment
    expect(determineTopicStatus(90, 5, 4, false)).toBe('ready_for_test');

    // High score, passed assessment, 3 independent answers -> Mastered!
    expect(determineTopicStatus(88, 6, 4, true)).toBe('mastered');

    // Low score -> in_progress
    expect(determineTopicStatus(45, 2, 1, false)).toBe('in_progress');
  });
});

describe('Adaptive Engine - Misconception Evaluation', () => {
  const aaravQuestion = QUESTIONS.find(q => q.id === 'q3-1')!;

  it('detects denominator addition error on 1/4 + 1/4 = 2/8 (Aarav scenario)', () => {
    const evalResult = evaluateStudentAnswer(aaravQuestion, 'opt-b', false);
    expect(evalResult.isCorrect).toBe(false);
    expect(evalResult.detectedMisconception).toBe('denominator_addition_error');
    expect(evalResult.remedialText?.toLowerCase()).toContain('denominator');
  });

  it('correctly evaluates simplest form 1/2', () => {
    const evalResult = evaluateStudentAnswer(aaravQuestion, 'opt-a', false);
    expect(evalResult.isCorrect).toBe(true);
    expect(evalResult.scoreCredit).toBe(100);
  });

  it('detects repeated misconception from attempt history', () => {
    const attempts: Attempt[] = [
      {
        id: 'att-1',
        studentId: 'stud-aarav',
        questionId: 'q3-1',
        topicId: 'topic-3',
        submittedAnswer: 'opt-b',
        isCorrect: false,
        hintUsed: false,
        scoreCredit: 0,
        detectedMisconception: 'denominator_addition_error',
        timeTakenSeconds: 30,
        createdAt: new Date().toISOString()
      }
    ];

    const repeated = detectRepeatedMisconceptions(attempts);
    expect(repeated.length).toBe(1);
    expect(repeated[0].code).toBe('denominator_addition_error');
  });
});

describe('Adaptive Engine - Recommendation Logic', () => {
  const topic3 = TOPICS.find(t => t.id === 'topic-3')!;

  it('prioritizes targeted explanation when a misconception is detected', () => {
    const attempts: Attempt[] = [
      {
        id: 'att-1',
        studentId: 'stud-aarav',
        questionId: 'q3-1',
        topicId: 'topic-3',
        submittedAnswer: 'opt-b',
        isCorrect: false,
        hintUsed: false,
        scoreCredit: 0,
        detectedMisconception: 'denominator_addition_error',
        timeTakenSeconds: 25,
        createdAt: new Date().toISOString()
      }
    ];

    const rec = generateAdaptiveRecommendation({
      studentId: 'stud-aarav',
      currentTopic: topic3,
      allTopics: TOPICS,
      allProgress: {
        'topic-1': { id: 'p1', studentId: 'stud-aarav', topicId: 'topic-1', masteryScore: 85, totalAttempts: 4, correctAttempts: 4, hintsUsedCount: 0, status: 'mastered', updatedAt: '' },
        'topic-2': { id: 'p2', studentId: 'stud-aarav', topicId: 'topic-2', masteryScore: 75, totalAttempts: 4, correctAttempts: 3, hintsUsedCount: 1, status: 'ready_for_test', updatedAt: '' },
        'topic-3': { id: 'p3', studentId: 'stud-aarav', topicId: 'topic-3', masteryScore: 35, totalAttempts: 1, correctAttempts: 0, hintsUsedCount: 0, status: 'in_progress', updatedAt: '' },
      },
      topicAttempts: attempts
    });

    expect(rec.recommendationType).toBe('targeted_explanation');
    expect(rec.misconceptionTag).toBe('denominator_addition_error');
    expect(rec.explanation.toLowerCase()).toContain('denominator');
  });
});
