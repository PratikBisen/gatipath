import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/db';
import { Card } from '../../components/ui/Card';
import { MasteryBadge } from '../../components/ui/MasteryBadge';
import { checkPrerequisites } from '../../engine/prerequisites';
import {
  Lock,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  HelpCircle,
  GitCommit,
  Sparkles
} from 'lucide-react';

export const LearningPath: React.FC = () => {
  const { currentUser, isStudent } = useAuth();
  const navigate = useNavigate();

  const student = isStudent && currentUser ? currentUser : db.getStudents()[0];
  const topics = db.getTopics();
  const progressList = db.getStudentProgress(student.id);

  const progressMap = progressList.reduce((acc, p) => {
    acc[p.topicId] = p;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-subtle text-primary text-[11px] font-semibold mb-2">
          <GitCommit className="w-3.5 h-3.5" />
          <span>Curriculum Prerequisite Progression</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-charcoal tracking-tight">
          Your Adaptive Learning Path
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-1 leading-relaxed">
          In mathematics, higher-level topics require solid prerequisite foundations. GatiPath unlocks each step as you demonstrate understanding.
        </p>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 sm:before:left-6 before:w-0.5 before:bg-border before:-z-0">
        {topics.map((topic, index) => {
          const prog = progressMap[topic.id];
          const score = prog ? prog.masteryScore : 0;
          const isMastered = prog?.status === 'mastered';
          const prereqCheck = checkPrerequisites(topic, topics, progressMap);
          const isLocked = !prereqCheck.isSatisfied && score === 0;

          return (
            <div key={topic.id} className="relative flex items-start gap-4 sm:gap-5 z-10">
              {/* Stepper Node Circle */}
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-heading font-bold text-sm shrink-0 border-2 transition-all shadow-2xs ${
                  isMastered
                    ? 'bg-primary border-primary text-white'
                    : isLocked
                    ? 'bg-canvas-subtle border-border text-charcoal-muted'
                    : 'bg-surface border-primary text-primary'
                }`}
              >
                {isMastered ? (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : isLocked ? (
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal-muted" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Card Content */}
              <Card
                className={`flex-1 p-5 transition-all ${
                  isLocked ? 'opacity-70 bg-canvas-subtle/30' : 'hover:border-primary/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-charcoal-muted">
                      Topic {index + 1}
                    </span>
                    <span className="text-xs text-charcoal-muted">·</span>
                    <span className="text-xs font-medium text-charcoal-muted">
                      Est. {topic.estimatedMinutes} mins
                    </span>
                  </div>
                  <MasteryBadge score={score} size="xs" />
                </div>

                <h3 className="text-base font-heading font-bold text-charcoal">
                  {topic.title}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-muted mt-1 leading-relaxed">
                  {topic.description}
                </p>

                {/* Key Concepts Grid */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {topic.keyConcepts.map((concept, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-1.5 text-xs text-charcoal">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="truncate">{concept}</span>
                    </div>
                  ))}
                </div>

                {/* Locked Prerequisite Alert */}
                {isLocked && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Prerequisite Required: </span>
                      {prereqCheck.missingPrerequisites.map((m) => (
                        <span key={m.topicId}>
                          Achieve at least {m.requiredMastery}% in {m.topicTitle} (current: {m.currentMastery}%) to unlock this topic.
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {!isLocked && (
                  <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => navigate(`/solve/${topic.id}`)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-2xs"
                    >
                      <span>Adaptive Practice (Solve)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => navigate(`/learn/${topic.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-canvas-subtle text-charcoal text-xs font-medium rounded-lg border border-border hover:bg-canvas transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-charcoal-muted" />
                      <span>Learn Concept</span>
                    </button>
                  </div>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
