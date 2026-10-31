import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/db';
import { Award, ArrowRight, Check, Lock } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Folio Masthead */}
      <section className="border-b border-[#E8E2D8] pb-6">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#7A7265] mb-1.5">
          <span>Summative Checkpoints</span>
          <span>·</span>
          <span>Formal Diagnostic Evaluations</span>
          <span>·</span>
          <span>80% Mastery Requirement</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1817]">
          Curriculum Topic Assessments
        </h1>
        <p className="text-sm sm:text-base text-[#5C5549] mt-2 leading-relaxed">
          Summative assessments do not offer hints. Passing an assessment ($\ge 80\%$) with demonstrated independent success formally certifies topic mastery on your academic record.
        </p>
      </section>

      {/* 2. Assessments List */}
      <div className="divide-y divide-[#EAE4D8] border-y border-[#EAE4D8]">
        {topics.map((topic) => {
          const prog = progressMap[topic.id];
          const mastery = prog ? prog.masteryScore : 0;
          const isMastered = prog?.status === 'mastered';
          const isReady = mastery >= 60;
          const lastScore = prog?.lastAssessmentScore;

          return (
            <div
              key={topic.id}
              className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-semibold text-[#8C8377]">
                    0{topic.sequenceOrder}
                  </span>
                  <h3 className="font-editorial text-lg font-bold text-[#1A1817]">
                    {topic.title} Assessment
                  </h3>
                  {isMastered && (
                    <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E8F4EE] text-[#1B4332]">
                      Certified Mastered
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#5C5549] max-w-xl">
                  5 formal questions · 15 minutes · Evaluates full topic proficiency
                </p>

                <div className="flex items-center gap-4 text-xs font-mono text-[#7A7265] pt-0.5">
                  <span>Practice Mastery: <strong className="text-[#1A1817]">{mastery}%</strong></span>
                  {lastScore !== undefined && (
                    <span>Last Test Score: <strong className="text-[#1A1817]">{lastScore}%</strong></span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0">
                <button
                  onClick={() => navigate(`/test/${topic.id}`)}
                  className={`px-4 py-2 rounded text-xs font-semibold transition-all ${
                    isMastered
                      ? 'border border-[#DCD5C9] bg-white text-[#5C5549] hover:bg-[#F2EDE4]'
                      : isReady
                      ? 'bg-[#1B4332] text-white hover:bg-[#112F23] shadow-xs'
                      : 'border border-[#DCD5C9] bg-[#FAF7F2] text-[#7A7265] hover:bg-[#F2EDE4]'
                  }`}
                >
                  {isMastered ? 'Retake Checkpoint' : isReady ? 'Take Assessment →' : 'Attempt Assessment'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
