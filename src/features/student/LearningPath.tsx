import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/db';
import { checkPrerequisites } from '../../engine/prerequisites';
import {
  Lock,
  Check,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Award,
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Folio Masthead */}
      <section className="border-b border-[#E8E2D8] pb-6">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#7A7265] mb-1.5">
          <span>Curriculum Architecture</span>
          <span>·</span>
          <span>Directed Acyclic Graph</span>
          <span>·</span>
          <span>Class 7 Fractions</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1817]">
          Prerequisite Progression Journey
        </h1>
        <p className="text-sm sm:text-base text-[#5C5549] mt-2 leading-relaxed">
          In mathematics, advanced topics depend strictly on conceptual foundations. GatiPath prevents cognitive overload by ensuring prerequisite mastery before unlocking later stages.
        </p>
      </section>

      {/* 2. Prerequisite Progression Chain */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 sm:before:left-6 before:w-0.5 before:bg-[#E2DBD0] before:z-0">
        {topics.map((topic, index) => {
          const prog = progressMap[topic.id];
          const score = prog ? prog.masteryScore : 0;
          const isMastered = prog?.status === 'mastered';
          const prereqCheck = checkPrerequisites(topic, topics, progressMap);
          const isLocked = !prereqCheck.isSatisfied && score === 0;

          return (
            <div key={topic.id} className="relative flex items-start gap-4 sm:gap-6 z-10">
              {/* Node indicator */}
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-mono font-bold text-sm shrink-0 border-2 transition-all ${
                  isMastered
                    ? 'bg-[#1B4332] border-[#1B4332] text-white'
                    : isLocked
                    ? 'bg-[#EFEAE2] border-[#DCD5C9] text-[#8C8377]'
                    : 'bg-white border-[#1B4332] text-[#1B4332]'
                }`}
              >
                {isMastered ? (
                  <Check className="w-5 h-5" />
                ) : isLocked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <span>0{topic.sequenceOrder}</span>
                )}
              </div>

              {/* Topic Node Card */}
              <div
                className={`flex-1 rounded-xl border p-5 sm:p-6 transition-all ${
                  isMastered
                    ? 'bg-white border-[#E0D8CC] shadow-xs'
                    : isLocked
                    ? 'bg-[#FAF8F5] border-[#E8E2D8] opacity-75'
                    : 'bg-white border-[#1B4332]/40 shadow-xs ring-1 ring-[#1B4332]/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs uppercase text-[#8C8377] font-semibold">
                        Module 0{topic.sequenceOrder}
                      </span>
                      <h3 className="font-editorial text-xl font-bold text-[#1A1817]">
                        {topic.title}
                      </h3>
                      {isMastered && (
                        <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E8F4EE] text-[#1B4332]">
                          Mastered (85%+)
                        </span>
                      )}
                      {!isMastered && !isLocked && (
                        <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF1E4] text-[#C57D36]">
                          {score}% Mastery
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[#5C5549] leading-relaxed">
                      {topic.description}
                    </p>

                    {/* Prerequisite warning if locked */}
                    {isLocked && prereqCheck.missingPrerequisites.length > 0 && (
                      <div className="p-3 bg-[#FFF5F5] rounded-lg border border-[#FCD4D4] text-xs text-[#8C2828] font-mono mt-2">
                        Prerequisite Required: Complete "{prereqCheck.missingPrerequisites[0]?.topicTitle}" to at least 40% mastery before advancing.
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {!isLocked && (
                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      <button
                        onClick={() => navigate(`/learn/${topic.id}`)}
                        className="px-3 py-1.5 rounded border border-[#DCD5C9] bg-[#FAF7F2] hover:bg-[#F2EDE4] text-xs font-medium text-[#1A1817]"
                      >
                        Learn
                      </button>
                      <button
                        onClick={() => navigate(`/solve/${topic.id}`)}
                        className="px-4 py-1.5 rounded bg-[#1B4332] hover:bg-[#112F23] text-white text-xs font-semibold shadow-xs"
                      >
                        Solve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
