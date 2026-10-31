import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/db';
import { MasteryBadge } from '../../components/ui/MasteryBadge';
import { checkPrerequisites } from '../../engine/prerequisites';
import {
  Lock,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Sparkles,
  GitCommit
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-semibold mb-2">
          <GitCommit className="w-3.5 h-3.5" />
          <span>Curriculum Prerequisite Progression</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal">
          Your Adaptive Learning Path
        </h1>
        <p className="text-sm text-charcoal-muted mt-1">
          In mathematics, each step builds on the previous one. GatiPath ensures you master foundational concepts first.
        </p>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-borderSoft before:-z-0">
        {topics.map((topic, index) => {
          const prog = progressMap[topic.id];
          const score = prog ? prog.masteryScore : 0;
          const isMastered = prog?.status === 'mastered';
          const prereqCheck = checkPrerequisites(topic, topics, progressMap);
          const isLocked = !prereqCheck.isSatisfied && score === 0;

          return (
            <div key={topic.id} className="relative flex items-start gap-5 z-10">
              {/* Stepper node circle */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border-2 transition-all ${
                  isMastered
                    ? 'bg-primary border-primary text-white shadow-sm'
                    : isLocked
                    ? 'bg-canvas border-borderSoft text-charcoal-muted'
                    : 'bg-white border-primary text-primary shadow-sm'
                }`}
              >
                {isMastered ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : isLocked ? (
                  <Lock className="w-5 h-5 text-charcoal-muted" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Card content */}
              <div
                className={`flex-1 bg-white rounded-xl border p-5 transition-all shadow-card ${
                  isLocked
                    ? 'border-borderSoft opacity-75 bg-canvas/40'
                    : 'border-borderSoft hover:border-primary/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-charcoal-muted">
                      Topic {index + 1}
                    </span>
                    <span className="text-xs text-charcoal-muted">·</span>
                    <span className="text-xs font-medium text-charcoal-muted">
                      Est. {topic.estimatedMinutes} mins
                    </span>
                  </div>
                  <MasteryBadge score={score} size="sm" />
                </div>

                <h3 className="text-base font-heading font-bold text-charcoal">
                  {topic.title}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-muted mt-1 leading-relaxed">
                  {topic.description}
                </p>

                {/* Key concept points */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {topic.keyConcepts.map((concept, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-1.5 text-xs text-charcoal">
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                      <span className="truncate">{concept}</span>
                    </div>
                  ))}
                </div>

                {/* Locked Prerequisite Explanation Banner */}
                {isLocked && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Prerequisite Required: </span>
                      {prereqCheck.missingPrerequisites.map(m => (
                        <span key={m.topicId}>
                          Master {m.topicTitle} ({m.currentMastery}% / required {m.requiredMastery}%) before unlocking this topic.
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {!isLocked && (
                  <div className="mt-4 pt-3 border-t border-borderSoft flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => navigate(`/solve/${topic.id}`)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
                    >
                      <span>Adaptive Practice (Solve)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => navigate(`/learn/${topic.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-canvas text-charcoal text-xs font-medium rounded-lg border border-borderSoft hover:bg-white transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-charcoal-muted" />
                      <span>Learn Concept</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
