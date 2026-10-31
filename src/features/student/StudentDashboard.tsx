import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/db';
import { StudentTopicProgress, Recommendation, Attempt } from '../../types';
import { MasteryBadge } from '../../components/ui/MasteryBadge';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Target
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

  // Find the current active topic (first one in_progress or ready_for_test or not_started)
  const currentTopic = topics.find(t => {
    const prog = progressList.find(p => p.topicId === t.id);
    return !prog || prog.status !== 'mastered';
  }) || topics[0];

  const currentTopicProgress = progressList.find(p => p.topicId === currentTopic?.id);
  const currentMastery = currentTopicProgress ? currentTopicProgress.masteryScore : 0;

  // Compute overall module stats
  const masteredCount = progressList.filter(p => p.status === 'mastered').length;
  const overallMastery = progressList.length > 0
    ? Math.round(progressList.reduce((acc, p) => acc + p.masteryScore, 0) / topics.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Greeting */}
      <div className="bg-white rounded-2xl border border-borderSoft p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Class 7 · Mathematics · Fractions Pilot</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal">
            Namaste, {student.displayName}
          </h1>
          <p className="text-sm sm:text-base text-charcoal-muted mt-1">
            Learning that moves at your pace. Master each concept before advancing.
          </p>
        </div>

        {/* Progress summary widget */}
        <div className="flex items-center gap-4 bg-canvas p-4 rounded-xl border border-borderSoft shrink-0">
          <div className="text-center">
            <span className="block text-2xl font-bold font-heading text-primary">
              {masteredCount}/{topics.length}
            </span>
            <span className="text-xs text-charcoal-muted font-medium">Topics Mastered</span>
          </div>
          <div className="h-8 w-px bg-borderSoft" />
          <div className="text-center">
            <span className="block text-2xl font-bold font-heading text-charcoal">
              {overallMastery}%
            </span>
            <span className="text-xs text-charcoal-muted font-medium">Curriculum Mastery</span>
          </div>
        </div>
      </div>

      {/* Active Adaptive Recommendation Callout */}
      {activeRec && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-primary/20 rounded-xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-primary text-white shrink-0 mt-0.5">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Adaptive Recommendation
                  </span>
                  {activeRec.misconceptionTag && (
                    <span className="text-[10px] px-2 py-0.5 bg-warning-light text-warning rounded-full font-medium">
                      Targeted Revision
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-charcoal mt-0.5">
                  {activeRec.title}
                </h3>
                <p className="text-sm text-charcoal-muted mt-1 leading-relaxed max-w-3xl">
                  {activeRec.explanation}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(activeRec.suggestedActionRoute)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-sm shrink-0"
            >
              <span>{activeRec.suggestedActionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Current Topic Hero Card */}
      {currentTopic && (
        <div className="bg-white rounded-xl border border-borderSoft p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Current Learning Focus
              </span>
              <span className="text-xs text-charcoal-muted">· Sequence Order {currentTopic.sequenceOrder} of 4</span>
            </div>
            <MasteryBadge score={currentMastery} />
          </div>

          <h2 className="text-xl font-heading font-bold text-charcoal">
            {currentTopic.title}
          </h2>
          <p className="text-sm text-charcoal-muted mt-1 max-w-2xl">
            {currentTopic.description}
          </p>

          {/* Mastery Bar */}
          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-xs text-charcoal-muted font-medium">
              <span>Topic Understanding</span>
              <span>{currentMastery}% (Target: 85% for mastery)</span>
            </div>
            <div className="h-2.5 w-full bg-canvas rounded-full overflow-hidden border border-borderSoft">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${Math.max(4, currentMastery)}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate(`/solve/${currentTopic.id}`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
            >
              <span>Practice Questions (Solve)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/learn/${currentTopic.id}`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-canvas hover:bg-borderSoft/60 text-charcoal text-sm font-medium rounded-lg border border-borderSoft transition-colors"
            >
              <BookOpen className="w-4 h-4 text-charcoal-muted" />
              <span>Read Explanation & Worked Examples</span>
            </button>
            {currentMastery >= 70 && (
              <button
                onClick={() => navigate(`/test/${currentTopic.id}`)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-light text-accent hover:bg-accent hover:text-white text-sm font-medium rounded-lg border border-accent/20 transition-colors"
              >
                <Award className="w-4 h-4" />
                <span>Take Assessment</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid: All Module Topics & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Fractions Curriculum Roadmap */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-bold text-charcoal">
              Class 7 Mathematics — Fractions Module
            </h2>
            <Link
              to="/student/path"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View Prerequisite Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {topics.map(topic => {
              const prog = progressList.find(p => p.topicId === topic.id);
              const score = prog ? prog.masteryScore : 0;
              const isMastered = prog?.status === 'mastered';
              const isReady = prog?.status === 'ready_for_test';

              return (
                <div
                  key={topic.id}
                  className="bg-white rounded-xl border border-borderSoft p-4 hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isMastered
                          ? 'bg-primary text-white'
                          : isReady
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-canvas text-charcoal-muted border border-borderSoft'
                      }`}
                    >
                      {topic.sequenceOrder}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-charcoal flex items-center gap-2">
                        {topic.title}
                        {isMastered && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      </h4>
                      <p className="text-xs text-charcoal-muted mt-0.5 line-clamp-1">
                        {topic.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <MasteryBadge score={score} size="sm" />
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => navigate(`/learn/${topic.id}`)}
                        className="px-2.5 py-1 text-xs font-medium rounded border border-borderSoft hover:bg-canvas text-charcoal"
                      >
                        Learn
                      </button>
                      <button
                        onClick={() => navigate(`/solve/${topic.id}`)}
                        className="px-2.5 py-1 text-xs font-medium rounded bg-primary text-white hover:bg-primary-hover"
                      >
                        Solve
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Recent Activity Timeline */}
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-bold text-charcoal">
            Recent Practice Activity
          </h2>

          <div className="bg-white rounded-xl border border-borderSoft p-4 shadow-card">
            {recentAttempts.length === 0 ? (
              <p className="text-xs text-charcoal-muted text-center py-6">
                No recorded attempts yet. Start practicing to see your pace here!
              </p>
            ) : (
              <div className="divide-y divide-borderSoft">
                {recentAttempts.map(attempt => {
                  const topic = topics.find(t => t.id === attempt.topicId);
                  const isCorrect = attempt.isCorrect;

                  return (
                    <div key={attempt.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-charcoal truncate">
                          {topic?.title || 'Practice Question'}
                        </p>
                        <p className="text-[11px] text-charcoal-muted">
                          {isCorrect
                            ? attempt.hintUsed
                              ? 'Solved correctly with hint (+70 pts)'
                              : 'Solved independently (+100 pts)'
                            : attempt.detectedMisconception
                            ? 'Concept check needed'
                            : 'Incorrect answer'}
                        </p>
                      </div>
                      <span className="text-[10px] text-charcoal-muted shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {attempt.timeTakenSeconds}s
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
