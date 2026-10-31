import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/db';
import { MasteryBadge } from '../../components/ui/MasteryBadge';
import { Award, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export const AssessmentsList: React.FC = () => {
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>Summative Checkpoints</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal">
          Topic Assessments
        </h1>
        <p className="text-sm text-charcoal-muted mt-1">
          Take un-scaffolded assessments to demonstrate concept mastery and unlock curriculum progression.
        </p>
      </div>

      <div className="space-y-4">
        {topics.map(topic => {
          const prog = progressMap[topic.id];
          const mastery = prog ? prog.masteryScore : 0;
          const isMastered = prog?.status === 'mastered';
          const isReady = mastery >= 70;
          const lastScore = prog?.lastAssessmentScore;

          return (
            <div
              key={topic.id}
              className="bg-white rounded-xl border border-borderSoft p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isMastered
                      ? 'bg-primary-light text-primary'
                      : isReady
                      ? 'bg-accent-light text-accent'
                      : 'bg-canvas text-charcoal-muted border border-borderSoft'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-charcoal-muted">
                      Topic {topic.sequenceOrder}
                    </span>
                    <span className="text-xs text-charcoal-muted">·</span>
                    <MasteryBadge score={mastery} size="sm" />
                  </div>
                  <h3 className="text-base font-semibold text-charcoal mt-0.5">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    {lastScore !== undefined
                      ? `Last assessment score: ${lastScore}%`
                      : 'Not yet taken'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                {isMastered ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mastered</span>
                    </span>
                    <button
                      onClick={() => navigate(`/test/${topic.id}`)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-borderSoft hover:bg-canvas text-charcoal"
                    >
                      Retake
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate(`/test/${topic.id}`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-sm"
                  >
                    <span>Start Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
