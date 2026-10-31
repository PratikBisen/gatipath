import { describe, it, expect } from 'vitest';
import { runAdaptiveEngineEvaluation } from '../engine/evaluation/simulationEngine';
import { SmartDiagnosticEngine } from '../engine/diagnostic';
import { buildProgressiveHints, getQuestionHints } from '../engine/hints';
import { classifyRootCause, evaluateStudentAnswer } from '../engine/misconceptions';
import { db } from '../lib/db';
import { QUESTIONS, TOPICS } from '../data/curriculum/fractions';

describe('Adaptive Engine Evaluation Framework — Measurable Benchmarks', () => {
  it('executes simulation across all 5 synthetic student archetypes', () => {
    const report = runAdaptiveEngineEvaluation();
    expect(report.totalSimulationsRun).toBe(5);
    expect(report.archetypeResults.length).toBe(5);

    // Verify all archetypes matched their expected deterministic behavior
    const allMatched = report.archetypeResults.every(r => r.expectedBehaviorMatched);
    expect(allMatched).toBe(true);
  });

  it('verifies misconception false positive rate is 0% on calculation slips', () => {
    const report = runAdaptiveEngineEvaluation();
    expect(report.confusionMatrix.falsePositives).toBe(0);
    expect(report.confusionMatrix.falsePositiveRate).toBe(0);
  });

  it('verifies misconception recall is 100% on conceptual traps', () => {
    const report = runAdaptiveEngineEvaluation();
    expect(report.confusionMatrix.falseNegatives).toBe(0);
    expect(report.confusionMatrix.recall).toBe(1.0);
  });

  it('verifies diagnostic efficiency: early stopping locates boundary in <= 5 questions', () => {
    const report = runAdaptiveEngineEvaluation();
    expect(report.diagnosticEfficiency.averageQuestionsAsked).toBeLessThanOrEqual(5);
    expect(report.diagnosticEfficiency.earlyStopEffectivePercent).toBe(100);
  });
});

describe('Smart Diagnostic Placement Engine — Branching & Early Stopping', () => {
  it('begins placement at Topic 2 (comparing fractions) benchmark probe', () => {
    const engine = new SmartDiagnosticEngine();
    const firstProbe = engine.getNextProbe();
    expect(firstProbe).not.toBeNull();
    expect(firstProbe?.topicId).toBe('topic-2');
  });

  it('branches down to Topic 1 if Topic 2 benchmark fails', () => {
    const engine = new SmartDiagnosticEngine();
    const firstProbe = engine.getNextProbe()!;
    engine.recordResponse({
      questionId: firstProbe.question.id,
      topicId: firstProbe.topicId,
      isCorrect: false
    });

    const secondProbe = engine.getNextProbe();
    expect(secondProbe?.topicId).toBe('topic-1');
  });

  it('branches forward to Topic 3 if Topic 2 benchmark succeeds', () => {
    const engine = new SmartDiagnosticEngine();
    const firstProbe = engine.getNextProbe()!;
    engine.recordResponse({
      questionId: firstProbe.question.id,
      topicId: firstProbe.topicId,
      isCorrect: true
    });

    const secondProbe = engine.getNextProbe();
    expect(secondProbe?.topicId).toBe('topic-3');
  });

  it('early stopping triggers once knowledge boundary is localized', () => {
    const engine = new SmartDiagnosticEngine();
    // Student fails Topic 2, then passes Topic 1 -> boundary is Topic 2
    const p1 = engine.getNextProbe()!;
    engine.recordResponse({ questionId: p1.question.id, topicId: p1.topicId, isCorrect: false });
    const p2 = engine.getNextProbe()!;
    engine.recordResponse({ questionId: p2.question.id, topicId: p2.topicId, isCorrect: true });

    expect(engine.shouldStopEarly()).toBe(true);

    const finalResult = engine.finalizeDiagnostic('student-test');
    expect(finalResult.recommendedStartingTopicId).toBe('topic-2');
    expect(finalResult.totalQuestionsAsked).toBe(2);
  });
});

describe('Teaching Through Guidance — 4-Stage Progressive Hints', () => {
  it('constructs calibrated 4-level progressive hints with scaled credits', () => {
    const hints = buildProgressiveHints(
      'Conceptual Reminder',
      'Guided Next Step',
      'Specific Explanation',
      'Worked Solution'
    );

    expect(hints.length).toBe(4);
    expect(hints[0].level).toBe(1);
    expect(hints[0].scoreCreditPercent).toBe(90);
    expect(hints[1].scoreCreditPercent).toBe(75);
    expect(hints[2].scoreCreditPercent).toBe(55);
    expect(hints[3].scoreCreditPercent).toBe(40);
  });

  it('awards correct partial credit on question evaluation for progressive hints', () => {
    const q31 = QUESTIONS.find(q => q.id === 'q3-1')!;

    // Level 1 hint used
    const evalLevel1 = evaluateStudentAnswer(q31, 'opt-a', true, 1);
    expect(evalLevel1.isCorrect).toBe(true);
    expect(evalLevel1.scoreCredit).toBe(90);

    // Level 2 hint used
    const evalLevel2 = evaluateStudentAnswer(q31, 'opt-a', true, 2);
    expect(evalLevel2.scoreCredit).toBe(75);

    // Level 4 (worked solution) used
    const evalLevel4 = evaluateStudentAnswer(q31, 'opt-a', true, 4);
    expect(evalLevel4.scoreCredit).toBe(40);
  });
});

describe('Root-Cause Attribution & Anti-Slop Thresholds', () => {
  it('classifies denominator addition as a conceptual misunderstanding', () => {
    expect(classifyRootCause('denominator_addition_error')).toBe('conceptual_misunderstanding');
  });

  it('classifies equivalent fraction error and lcm error as prerequisite gaps', () => {
    expect(classifyRootCause('equivalent_fraction_error')).toBe('prerequisite_gap');
    expect(classifyRootCause('lcm_error')).toBe('prerequisite_gap');
  });

  it('generates targeted visual repair plan for conceptual error', () => {
    const q31 = QUESTIONS.find(q => q.id === 'q3-1')!;
    const evalResult = evaluateStudentAnswer(q31, 'opt-b', false, 0); // 2/8 -> denominator addition
    expect(evalResult.rootCause).toBe('conceptual_misunderstanding');
    expect(evalResult.remediationPlan?.activityType).toBe('visual_concept_repair');
    expect(evalResult.remediationPlan?.actionRoute).toBe('/learn/topic-3');
  });
});

describe('Data Integrity & Idempotency Safeguards', () => {
  it('prevents double-credit and duplicate attempt entries for identical idempotencyKey', () => {
    const studentId = 'student-aarav';
    const topicId = 'topic-3';
    const testKey = `test-idempotency-${Date.now()}`;

    const initialAttemptsCount = db.getAttempts(studentId, topicId).length;

    // First submission
    const res1 = db.recordAttempt({
      idempotencyKey: testKey,
      studentId,
      questionId: 'q3-1',
      topicId,
      submittedAnswer: 'opt-a',
      isCorrect: true,
      hintUsed: false,
      scoreCredit: 100,
      timeTakenSeconds: 15
    });

    const postFirstCount = db.getAttempts(studentId, topicId).length;
    expect(postFirstCount).toBe(initialAttemptsCount + 1);

    // Duplicate submission with identical idempotencyKey (simulating double click)
    const res2 = db.recordAttempt({
      idempotencyKey: testKey,
      studentId,
      questionId: 'q3-1',
      topicId,
      submittedAnswer: 'opt-a',
      isCorrect: true,
      hintUsed: false,
      scoreCredit: 100,
      timeTakenSeconds: 15
    });

    const postSecondCount = db.getAttempts(studentId, topicId).length;
    // Count MUST NOT increase!
    expect(postSecondCount).toBe(postFirstCount);
    // Result returned is identical attempt
    expect(res2.attempt.id).toBe(res1.attempt.id);
  });
});
