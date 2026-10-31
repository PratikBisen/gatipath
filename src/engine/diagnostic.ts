import { Question, MisconceptionCode, ErrorRootCause, DiagnosticSessionResult, DiagnosticQuestionResult } from '../types';
import { QUESTIONS, TOPICS } from '../data/curriculum/fractions';

export interface DiagnosticItem {
  id: string;
  topicId: string;
  conceptProbe: string;
  question: Question;
  ifCorrectNextTopicId?: string;
  ifIncorrectNextTopicId?: string;
}

/**
 * Curated diagnostic pool containing representative probes across Topics 1–4.
 */
export const DIAGNOSTIC_PROBES: DiagnosticItem[] = [
  // Probe 1: Topic 2 Benchmark (Comparing Fractions - Medium)
  {
    id: 'diag-t2-med',
    topicId: 'topic-2',
    conceptProbe: 'Comparison with unlike denominators (LCM test)',
    question: QUESTIONS.find(q => q.id === 'q2-2') || QUESTIONS[8],
    ifCorrectNextTopicId: 'topic-3',
    ifIncorrectNextTopicId: 'topic-1'
  },
  // Probe 2: Topic 1 Foundation Check (Equivalent Fractions - Medium)
  {
    id: 'diag-t1-med',
    topicId: 'topic-1',
    conceptProbe: 'Equivalent fraction scaling test',
    question: QUESTIONS.find(q => q.id === 'q1-2') || QUESTIONS[1],
    ifCorrectNextTopicId: 'topic-2',
    ifIncorrectNextTopicId: 'topic-1-easy'
  },
  // Probe 3: Topic 1 Elementary Representation Check (Proper fraction concept - Easy)
  {
    id: 'diag-t1-easy',
    topicId: 'topic-1',
    conceptProbe: 'Numerator and denominator roles',
    question: QUESTIONS.find(q => q.id === 'q1-1') || QUESTIONS[0],
    ifCorrectNextTopicId: 'topic-2',
    ifIncorrectNextTopicId: 'topic-1'
  },
  // Probe 4: Topic 3 Addition Benchmark (Like denominators & common trap - Medium)
  {
    id: 'diag-t3-med',
    topicId: 'topic-3',
    conceptProbe: 'Fraction addition denominator trap test',
    question: QUESTIONS.find(q => q.id === 'q3-1') || QUESTIONS[16],
    ifCorrectNextTopicId: 'topic-4',
    ifIncorrectNextTopicId: 'topic-3-easy'
  },
  // Probe 5: Topic 3 Unlike Addition Check (LCM requirement - Hard)
  {
    id: 'diag-t3-hard',
    topicId: 'topic-3',
    conceptProbe: 'Unlike fraction addition with LCM conversion',
    question: QUESTIONS.find(q => q.id === 'q3-2') || QUESTIONS[17],
    ifCorrectNextTopicId: 'topic-4',
    ifIncorrectNextTopicId: 'topic-3'
  },
  // Probe 6: Topic 4 Advanced Operations (Multiplication / Reciprocal - Hard)
  {
    id: 'diag-t4-hard',
    topicId: 'topic-4',
    conceptProbe: 'Fraction multiplication & reciprocal reasoning',
    question: QUESTIONS.find(q => q.id === 'q4-1') || QUESTIONS[24],
    ifCorrectNextTopicId: 'complete',
    ifIncorrectNextTopicId: 'topic-4-med'
  }
];

export interface DiagnosticEngineState {
  currentProbeIndex: number;
  history: DiagnosticQuestionResult[];
  identifiedKnowledgeFrontier?: string;
  isCompleted: boolean;
}

export class SmartDiagnosticEngine {
  private history: DiagnosticQuestionResult[] = [];
  private answeredProbeIds = new Set<string>();

  constructor() {}

  /**
   * Selects the next diagnostic question dynamically based on prior responses.
   * Starts at Topic 2 (comparing fractions) as the midpoint pivot.
   */
  public getNextProbe(): DiagnosticItem | null {
    if (this.shouldStopEarly()) {
      return null;
    }

    // Question 1: Always start at Topic 2 Benchmark
    if (this.history.length === 0) {
      const startProbe = DIAGNOSTIC_PROBES.find(p => p.id === 'diag-t2-med') || DIAGNOSTIC_PROBES[0];
      this.answeredProbeIds.add(startProbe.id);
      return startProbe;
    }

    const lastResult = this.history[this.history.length - 1];

    // Branching logic:
    if (lastResult.topicId === 'topic-2') {
      if (lastResult.isCorrect) {
        // Topic 2 passed -> branch forward to Topic 3 addition probe
        const nextProbe = DIAGNOSTIC_PROBES.find(p => p.id === 'diag-t3-med' && !this.answeredProbeIds.has(p.id));
        if (nextProbe) {
          this.answeredProbeIds.add(nextProbe.id);
          return nextProbe;
        }
      } else {
        // Topic 2 failed -> step down to test Topic 1 prerequisite foundation
        const nextProbe = DIAGNOSTIC_PROBES.find(p => p.id === 'diag-t1-med' && !this.answeredProbeIds.has(p.id));
        if (nextProbe) {
          this.answeredProbeIds.add(nextProbe.id);
          return nextProbe;
        }
      }
    } else if (lastResult.topicId === 'topic-1') {
      if (!lastResult.isCorrect) {
        // Struggling on Topic 1 medium -> test fundamental fraction representation
        const nextProbe = DIAGNOSTIC_PROBES.find(p => p.id === 'diag-t1-easy' && !this.answeredProbeIds.has(p.id));
        if (nextProbe) {
          this.answeredProbeIds.add(nextProbe.id);
          return nextProbe;
        }
      } else {
        // Topic 1 is verified -> frontier is confirmed at Topic 2
        return null; // Stop early!
      }
    } else if (lastResult.topicId === 'topic-3') {
      if (lastResult.isCorrect) {
        // Topic 3 passed -> advance to Topic 4
        const nextProbe = DIAGNOSTIC_PROBES.find(p => p.id === 'diag-t4-hard' && !this.answeredProbeIds.has(p.id));
        if (nextProbe) {
          this.answeredProbeIds.add(nextProbe.id);
          return nextProbe;
        }
      } else {
        // Topic 3 failed -> frontier identified at Topic 3!
        return null; // Stop early!
      }
    } else if (lastResult.topicId === 'topic-4') {
      // Completed Topic 4 probe -> stopping point reached
      return null;
    }

    // Fallback: pick any unasked probe
    const unasked = DIAGNOSTIC_PROBES.find(p => !this.answeredProbeIds.has(p.id));
    if (unasked && this.history.length < 5) {
      this.answeredProbeIds.add(unasked.id);
      return unasked;
    }

    return null;
  }

  /**
   * Early stopping check:
   * Stops when sufficient evidence has definitively located the student's knowledge boundary,
   * avoiding redundant questions.
   */
  public shouldStopEarly(): boolean {
    const total = this.history.length;
    if (total >= 5) return true; // Strict efficiency cap: never ask more than 5 questions
    if (total < 2) return false; // Need at least 2 questions to detect a gradient

    const hasT1Result = this.history.some(h => h.topicId === 'topic-1');
    const hasT2Result = this.history.some(h => h.topicId === 'topic-2');
    const hasT3Result = this.history.some(h => h.topicId === 'topic-3');
    const hasT4Result = this.history.some(h => h.topicId === 'topic-4');

    // Case 1: Failed Topic 2, then passed Topic 1 -> Boundary is Topic 2
    if (hasT2Result && hasT1Result) {
      const t2Correct = this.history.find(h => h.topicId === 'topic-2')?.isCorrect;
      const t1Correct = this.history.find(h => h.topicId === 'topic-1')?.isCorrect;
      if (!t2Correct && t1Correct !== undefined) {
        return true;
      }
    }

    // Case 2: Passed Topic 2, failed Topic 3 -> Boundary is Topic 3
    if (hasT2Result && hasT3Result) {
      const t2Correct = this.history.find(h => h.topicId === 'topic-2')?.isCorrect;
      const t3Correct = this.history.find(h => h.topicId === 'topic-3')?.isCorrect;
      if (t2Correct && !t3Correct) {
        return true;
      }
    }

    // Case 3: Passed Topic 2, passed Topic 3, tested Topic 4 -> Fully mapped
    if (hasT4Result) {
      return true;
    }

    return false;
  }

  public recordResponse(result: DiagnosticQuestionResult): void {
    this.history.push(result);
  }

  public getHistory(): DiagnosticQuestionResult[] {
    return [...this.history];
  }

  /**
   * Synthesizes diagnostic findings into a transparent starting profile.
   */
  public finalizeDiagnostic(studentId: string): DiagnosticSessionResult {
    const totalQuestionsAsked = this.history.length;
    const estimatedMastery: Record<string, number> = {
      'topic-1': 50,
      'topic-2': 40,
      'topic-3': 20,
      'topic-4': 0
    };

    const detectedGaps: DiagnosticSessionResult['detectedGaps'] = [];

    // Analyze responses per topic
    for (const h of this.history) {
      if (h.isCorrect) {
        estimatedMastery[h.topicId] = Math.max(estimatedMastery[h.topicId], 85);
      } else {
        estimatedMastery[h.topicId] = Math.min(estimatedMastery[h.topicId], 35);
        if (h.rootCause) {
          detectedGaps.push({
            topicId: h.topicId,
            rootCause: h.rootCause,
            description: h.detectedMisconception
              ? `Misconception detected: ${h.detectedMisconception.replace(/_/g, ' ')}`
              : `Difficulty observed on ${h.topicId}`
          });
        }
      }
    }

    // Determine recommended starting topic based on lowest mastered prerequisite
    let recommendedStartingTopicId = 'topic-1';

    if (estimatedMastery['topic-1'] >= 70 && estimatedMastery['topic-2'] >= 70 && estimatedMastery['topic-3'] >= 70) {
      recommendedStartingTopicId = 'topic-4';
    } else if (estimatedMastery['topic-1'] >= 70 && estimatedMastery['topic-2'] >= 70) {
      recommendedStartingTopicId = 'topic-3';
    } else if (estimatedMastery['topic-1'] >= 70) {
      recommendedStartingTopicId = 'topic-2';
    } else {
      recommendedStartingTopicId = 'topic-1';
    }

    // Build early-stop justification
    const earlyStopReason = `Diagnostic converged in ${totalQuestionsAsked} questions. Knowledge frontier pinpointed at ${recommendedStartingTopicId} with high confidence without asking redundant questions.`;

    return {
      id: `diag-sess-${Date.now()}`,
      studentId,
      totalQuestionsAsked,
      completedAt: new Date().toISOString(),
      recommendedStartingTopicId,
      estimatedMastery,
      detectedGaps,
      earlyStopReason
    };
  }
}
