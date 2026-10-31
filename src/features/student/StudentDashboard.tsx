import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/db';
import { StudentTopicProgress, Recommendation, Attempt } from '../../types';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { MasteryBadge } from '../../components/ui/MasteryBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Target,
  GraduationCap
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser, isStudent } = useAuth();
  const navigate = useNavigate();

  const [progressList, setProgressList] = useState<StudentTopicProgress[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<Attempt[]>([]);

  const student = isStudent && currentUser ? currentUser : db.getStudents()[0];
  const topics = db.getTopics();

  useEffect(() => {
    if (student) {
      setProgressList(db.getStudentProgress(student.id));
      setRecommendations(db.getRecommendations(student.id));
      setRecentAttempts(db.getAttempts(student.id).slice(0, 5));
    }
  }, [student]);

  const activeRec = recommendations.find(r => r.status === 'active') || recommendations[0];

  // Find the current active topic
  const currentTopic = topics.find(t => {
    const prog = progressList.find(p => p.topicId === t.id);
    return !prog || prog.status !== 'mastered';
  }) || topics[0];

  const currentTopicProgress = progressList.find(p => p.topicId === currentTopic?.id);
  const currentMastery = currentTopicProgress ? currentTopicProgress.masteryScore : 0;

  const masteredCount = progressList.filter(p => p.status === 'mastered').length;
  const overallMastery = progressList.length > 0
    ? Math.round(progressList.reduce((acc, p) => acc + p.masteryScore, 0) / topics.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Greeting */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-subtle text-primary text-[11px] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Class 7 Mathematics · Fractions Pilot</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-charcoal tracking-tight">
            Namaste, {student.displayName}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1 leading-relaxed">
            Learning that moves at your pace. Master foundational concepts before advancing to the next challenge.
          </p>
        </div>

        {/* Quick summary stats */}
        <div className="flex items-center gap-3 bg-canvas-subtle p-3.5 rounded-xl border border-border shrink-0">
          <div className="text-center px-2">
            <span className="block text-2xl font-bold font-heading text-primary tabular-nums">
              {masteredCount}/{topics.length}
            </span>
            <span className="text-[11px] text-charcoal-muted font-medium">Topics Mastered</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center px-2">
            <span className="block text-2xl font-bold font-heading text-charcoal tabular-nums">
              {overallMastery}%
            </span>
            <span className="text-[11px] text-charcoal-muted font-medium">Curriculum Pace</span>
          </div>
        </div>
      </div>

      {/* Adaptive Recommendation Card */}
      {activeRec && (
        <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-200/80 rounded-xl p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-primary text-white shrink-0 mt-0.5">
                <Target className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Adaptive Recommendation
                  </span>
                  {activeRec.misconceptionTag && (
                    <span className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-full font-semibold">
                      Targeted Revision
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-heading font-bold text-charcoal">
                  {activeRec.title}
                </h3>
                <p className="text-xs text-charcoal-muted leading-relaxed max-w-3xl">
                  {activeRec.explanation}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(activeRec.suggestedActionRoute)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-2xs shrink-0"
            >
              <span>{activeRec.suggestedActionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Current Topic Focus Hero Card */}
      {currentTopic && (
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Current Learning Focus
              </span>
              <span className="text-xs text-charcoal-muted">· Topic {currentTopic.sequenceOrder} of 4</span>
            </div>
            <MasteryBadge score={currentMastery} />
          </div>

          <h2 className="text-lg sm:text-xl font-heading font-bold text-charcoal">
            {currentTopic.title}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1 max-w-2xl leading-relaxed">
            {currentTopic.description}
          </p>

          {/* Mastery Bar */}
          <div className="mt-4 space-y-1.5 max-w-2xl">
            <div className="flex justify-between text-xs text-charcoal-muted font-medium">
              <span>Topic Understanding</span>
              <span className="font-semibold text-charcoal tabular-nums">{currentMastery}% (Target: 85% for mastery)</span>
            </div>
            <ProgressBar value={currentMastery} target={85} size="md" />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5 pt-4 border-t border-border">
            <button
              onClick={() => navigate(`/solve/${currentTopic.id}`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-2xs"
            >
              <span>Practice Questions (Solve)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/learn/${currentTopic.id}`)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-canvas-subtle hover:bg-canvas text-charcoal text-xs font-medium rounded-lg border border-border transition-colors"
            >
              <BookOpen className="w-4 h-4 text-charcoal-muted" />
              <span>Read Explanation & Worked Examples</span>
            </button>
            {currentMastery >= 70 && (
              <button
                onClick={() => navigate(`/test/${currentTopic.id}`)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-accent-light text-accent hover:bg-accent hover:text-white text-xs font-semibold rounded-lg border border-accent/20 transition-colors"
              >
                <Award className="w-4 h-4" />
                <span>Take Assessment</span>
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Grid: All Module Topics & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fractions Curriculum Roadmap */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader
              title="Class 7 Mathematics — Fractions Module"
              subtitle="Step-by-step sequential mastery path."
              action={
                <Link
                  to="/student/path"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
                >
                  <span>Prerequisite Map</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              }
            />

            <div className="divide-y divide-border">
              {topics.map(topic => {
                const prog = progressList.find(p => p.topicId === topic.id);
                const score = prog ? prog.masteryScore : 0;
                const isMastered = prog?.status === 'mastered';

                return (
                  <div
                    key={topic.id}
                    className="p-4 px-5 hover:bg-canvas-subtle/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          isMastered
                            ? 'bg-primary text-white'
                            : 'bg-canvas-subtle text-charcoal-muted border border-border'
                        }`}
                      >
                        {topic.sequenceOrder}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-heading font-bold text-charcoal flex items-center gap-2">
                          {topic.title}
                          {isMastered && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                        </h4>
                        <p className="text-xs text-charcoal-muted mt-0.5 line-clamp-1">
                          {topic.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <MasteryBadge score={score} size="xs" />
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => navigate(`/learn/${topic.id}`)}
                          className="px-2.5 py-1 text-xs font-medium rounded-md border border-border hover:bg-canvas text-charcoal"
                        >
                          Learn
                        </button>
                        <button
                          onClick={() => navigate(`/solve/${topic.id}`)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-primary text-white hover:bg-primary-hover shadow-2xs"
                        >
                          Solve
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Col: Recent Activity Timeline */}
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Recent Practice Activity"
              subtitle="Your chronological questions and evaluations."
            />
            <div className="divide-y divide-border">
              {recentAttempts.length === 0 ? (
                <div className="p-8 text-xs text-charcoal-muted text-center">
                  No recorded attempts yet. Start practicing to see your pace here!
                </div>
              ) : (
                recentAttempts.map(attempt => {
                  const topic = topics.find(t => t.id === attempt.topicId);
                  const isCorrect = attempt.isCorrect;

                  return (
                    <div key={attempt.id} className="p-3.5 px-5 flex items-start gap-3 text-xs">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isCorrect
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-charcoal truncate">
                          {topic?.title || 'Practice Question'}
                        </p>
                        <p className="text-[11px] text-charcoal-muted">
                          {isCorrect
                            ? attempt.hintUsed
                              ? 'Solved with hint (+70 pts)'
                              : 'Solved independently (+100 pts)'
                            : attempt.detectedMisconception
                            ? 'Concept check needed'
                            : 'Incorrect answer'}
                        </p>
                      </div>
                      <span className="text-[10px] text-charcoal-muted shrink-0 flex items-center gap-1 tabular-nums">
                        <Clock className="w-3 h-3" />
                        {attempt.timeTakenSeconds}s
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
