import { describe, it, expect, beforeEach } from 'vitest';
import { runAdaptiveEngineEvaluation } from '../engine/evaluation/simulationEngine';
import { SmartDiagnosticEngine } from '../engine/diagnostic';
import { buildProgressiveHints, getQuestionHints } from '../engine/hints';
import { classifyRootCause, evaluateStudentAnswer } from '../engine/misconceptions';
import { db } from '../lib/db';
import { OfflineSyncManager } from '../lib/offline/syncManager';
import { QUESTIONS, TOPICS } from '../data/curriculum/fractions';

// Provide memory localStorage polyfill for Node/Vitest test runner
if (typeof globalThis.localStorage === 'undefined') {
  const store: Record<string, string> = {};
  (globalThis as any).localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, val: string) => { store[key] = String(val); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    key: (index: number) => Object.keys(store)[index] || null,
    get length() { return Object.keys(store).length; }
  };
}

describe('Adaptive Engine Evaluation Framework — Measurable Benchmarks', () => {
  it('executes simulation across all 9 synthetic student archetypes', () => {
    const report = runAdaptiveEngineEvaluation();
    expect(report.totalSimulationsRun).toBe(9);
    expect(report.archetypeResults.length).toBe(9);
    expect(report.totalEvaluatedAttempts).toBe(36);

    // Verify all archetypes matched their expected deterministic behavior
    const allMatched = report.archetypeResults.every(r => r.expectedBehaviorMatched);
    expect(allMatched).toBe(true);
  });

  it('verifies misconception false positive rate is 0% on calculation slips and ambiguous guesses', () => {
    const report = runAdaptiveEngineEvaluation();
    expect(report.confusionMatrix.falsePositives).toBe(0);
    expect(report.confusionMatrix.falsePositiveRate).toBe(0);
  });

  it('verifies misconception recall and F1 score on conceptual traps and prerequisite gaps', () => {
    const report = runAdaptiveEngineEvaluation();
    expect(report.confusionMatrix.falseNegatives).toBe(0);
    expect(report.confusionMatrix.recall).toBe(1.0);
    expect(report.confusionMatrix.precision).toBe(1.0);
    expect(report.confusionMatrix.f1Score).toBe(1.0);
    expect(report.confusionMatrix.incorrectRecommendationRate).toBe(0);
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

  it('safely queues offline attempts and synchronizes without duplicates on multiple sync calls', () => {
    const syncManager = new OfflineSyncManager();
    const testIdempotency = `offline-sync-test-${Date.now()}`;
    const studentId = 'student-aarav';
    const topicId = 'topic-1';

    const initialAttempts = db.getAttempts(studentId, topicId).length;

    // Enqueue an attempt while offline
    syncManager.enqueueAttempt({
      idempotencyKey: testIdempotency,
      studentId,
      questionId: 'q1-1',
      topicId,
      submittedAnswer: 'opt-a',
      isCorrect: true,
      hintUsed: false,
      scoreCredit: 100,
      timeTakenSeconds: 20
    });

    expect(syncManager.getQueuedCount()).toBeGreaterThanOrEqual(1);

    // First sync call
    const syncResult1 = syncManager.syncQueuedAttempts();
    expect(syncResult1.syncedCount).toBeGreaterThanOrEqual(1);
    expect(syncManager.getQueuedCount()).toBe(0);

    const countAfterFirstSync = db.getAttempts(studentId, topicId).length;
    expect(countAfterFirstSync).toBe(initialAttempts + 1);

    // Duplicate sync event: queue is already empty, should safely return 0 and not corrupt data
    const syncResult2 = syncManager.syncQueuedAttempts();
    expect(syncResult2.syncedCount).toBe(0);
    expect(db.getAttempts(studentId, topicId).length).toBe(countAfterFirstSync);
  });

  it('preserves student progress and state consistency across simulated browser reload', () => {
    const studentId = 'student-aarav';
    const topicId = 'topic-3';

    // Record an attempt
    db.recordAttempt({
      studentId,
      questionId: 'q3-5',
      topicId,
      submittedAnswer: 'opt-a',
      isCorrect: true,
      hintUsed: false,
      scoreCredit: 100,
      timeTakenSeconds: 30
    });

    const progressBeforeReload = db.getStudentProgress(studentId).find(p => p.topicId === topicId);
    expect(progressBeforeReload).toBeDefined();

    // Verify localStorage retains serialized state
    const rawProgress = localStorage.getItem('gatipath_progress');
    expect(rawProgress).toBeTruthy();

    const parsed = JSON.parse(rawProgress!);
    const savedProgress = parsed.find((p: any) => p.studentId === studentId && p.topicId === topicId);
    expect(savedProgress.masteryScore).toBe(progressBeforeReload!.masteryScore);
    expect(savedProgress.totalAttempts).toBe(progressBeforeReload!.totalAttempts);
  });
});

describe('Synthetic Scenario Coverage — All 9 Core Evaluation Profiles', () => {
  it('covers conceptual misunderstandings with targeted remediation', () => {
    const report = runAdaptiveEngineEvaluation();
    const aarav = report.archetypeResults.find(a => a.archetypeId === 'arch-aarav-conceptual')!;
    expect(aarav.profileType).toBe('conceptual_trap');
    expect(aarav.expectedBehaviorMatched).toBe(true);
    expect(aarav.detectedMisconceptions).toContain('Adding Denominators Together');
  });

  it('covers prerequisite gaps with routing to prior curriculum topic', () => {
    const report = runAdaptiveEngineEvaluation();
    const rohan = report.archetypeResults.find(a => a.archetypeId === 'arch-rohan-prereq')!;
    expect(rohan.profileType).toBe('prerequisite_gap');
    expect(rohan.expectedBehaviorMatched).toBe(true);
    expect(rohan.recommendationGiven).toContain('prerequisite_review');
  });

  it('covers calculation mistakes without false-positive misconception labeling', () => {
    const report = runAdaptiveEngineEvaluation();
    const slip = report.archetypeResults.find(a => a.archetypeId === 'arch-slip-student')!;
    expect(slip.profileType).toBe('calculation_slip');
    expect(slip.expectedBehaviorMatched).toBe(true);
    expect(slip.detectedMisconceptions.length).toBe(0);
  });

  it('covers ambiguous wrong answers without falsely labeling misconceptions', () => {
    const report = runAdaptiveEngineEvaluation();
    const guess = report.archetypeResults.find(a => a.archetypeId === 'arch-ambiguous-guess')!;
    expect(guess.profileType).toBe('ambiguous_wrong');
    expect(guess.expectedBehaviorMatched).toBe(true);
    expect(guess.detectedMisconceptions.length).toBe(0);
  });

  it('covers repeated misconceptions with high confidence confirmation', () => {
    const report = runAdaptiveEngineEvaluation();
    const repeated = report.archetypeResults.find(a => a.archetypeId === 'arch-repeated-trap')!;
    expect(repeated.profileType).toBe('repeated_misconception');
    expect(repeated.expectedBehaviorMatched).toBe(true);
    expect(repeated.detectedMisconceptions).toContain('Adding Denominators Together');
  });

  it('covers correct answers after hints with calibrated partial credit', () => {
    const report = runAdaptiveEngineEvaluation();
    const hintLearner = report.archetypeResults.find(a => a.archetypeId === 'arch-scaffold-hints')!;
    expect(hintLearner.profileType).toBe('correct_after_hints');
    expect(hintLearner.expectedBehaviorMatched).toBe(true);
    expect(hintLearner.finalMastery).toBeGreaterThan(20);
  });

  it('covers recovery after remediation showing rebound and reinforcement recommendation', () => {
    const report = runAdaptiveEngineEvaluation();
    const recovery = report.archetypeResults.find(a => a.archetypeId === 'arch-recovery-remediation')!;
    expect(recovery.profileType).toBe('recovery_remediation');
    expect(recovery.expectedBehaviorMatched).toBe(true);
    expect(recovery.recommendationGiven).toContain('Recovery Verified');
  });

  it('covers accelerated learners advancing towards assessment readiness', () => {
    const report = runAdaptiveEngineEvaluation();
    const master = report.archetypeResults.find(a => a.archetypeId === 'arch-priya-master')!;
    expect(master.profileType).toBe('accelerated_master');
    expect(master.expectedBehaviorMatched).toBe(true);
    expect(master.finalMastery).toBeGreaterThanOrEqual(70);
  });

  it('covers inconsistent student performance proving EMA smoothing stability', () => {
    const report = runAdaptiveEngineEvaluation();
    const inconsistent = report.archetypeResults.find(a => a.archetypeId === 'arch-inconsistent-erratic')!;
    expect(inconsistent.profileType).toBe('inconsistent_performer');
    expect(inconsistent.expectedBehaviorMatched).toBe(true);
    expect(inconsistent.finalMastery).toBeGreaterThanOrEqual(30);
    expect(inconsistent.finalMastery).toBeLessThanOrEqual(70);
  });
});
