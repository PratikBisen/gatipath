import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/db';
import { StudentTopicProgress, Recommendation, Attempt } from '../../types';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Compass,
  AlertCircle,
  HelpCircle,
  Check,
  Lock,
  RotateCcw
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
      setRecentAttempts(db.getAttempts(student.id).slice(0, 6));
    }
  }, [student]);

  const activeRec = recommendations.find(r => r.status === 'active') || recommendations[0];

  // Find current topic that is not yet mastered
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

  const studentInterventions = db.getTeacherInterventions().filter(i => i.studentId === student.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Scholarly Studio Masthead */}
      <section className="border-b border-[#E8E2D8] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#7A7265] mb-1.5">
            <span>Student Study Studio</span>
            <span>·</span>
            <span>Mathematics Class 7</span>
            <span>·</span>
            <span className="text-[#1B4332] font-semibold">Active Session</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1817]">
            Namaste, {student.displayName.split(' ')[0]}.
          </h1>
          <p className="text-sm sm:text-base text-[#5C5549] mt-2 max-w-2xl leading-relaxed">
            Welcome to your fractions study desk. GatiPath adapts to how you solve problems, highlighting concepts to revisit before moving forward.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Link
              to="/student/diagnostic"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF1E4] border border-[#E8D4BE] text-xs font-mono font-semibold text-[#8C6239] hover:bg-[#F4E3CD] transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-[#C57D36]" />
              <span>Smart Knowledge Placement Diagnostic</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* Milestone Snapshot Bar */}
        <div className="flex items-center gap-6 sm:gap-8 font-mono border-l-0 md:border-l border-[#E2DBD0] md:pl-8">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#7A7265]">Modules Mastered</div>
            <div className="text-2xl sm:text-3xl font-bold text-[#1A1817] mt-0.5">
              {masteredCount} <span className="text-sm text-[#8C8377] font-normal">/ {topics.length}</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#7A7265]">Overall Mastery</div>
            <div className="text-2xl sm:text-3xl font-bold text-[#1B4332] mt-0.5">
              {overallMastery}%
            </div>
          </div>
        </div>
      </section>

      {/* 2. Today's Study Focus — Hero Atelier Workspace */}
      <section className="bg-white rounded-xl border border-[#E0D8CC] shadow-xs overflow-hidden">
        <div className="bg-[#FAF7F2] border-b border-[#E8E2D8] px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#C57D36] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-[#1A1817]">
              Current Adaptive Learning Focus
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#7A7265]">
            <span>Topic {currentTopic.sequenceOrder} of {topics.length}</span>
            <span>·</span>
            <span className="text-[#1B4332] font-semibold">{currentMastery}% Mastery</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#8C8377]">
                Module {String(currentTopic.sequenceOrder).padStart(2, '0')}
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1A1817]">
                {currentTopic.title}
              </h2>
              <p className="text-sm sm:text-base text-[#5C5549] leading-relaxed">
                {currentTopic.description}
              </p>
            </div>

            {/* Primary Action Button Cluster */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                onClick={() => navigate(`/solve/${currentTopic.id}`)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#1B4332] text-white hover:bg-[#112F23] text-sm font-medium transition-all shadow-xs"
              >
                <span>Practice Questions (Solve)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate(`/learn/${currentTopic.id}`)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[#DCD5C9] bg-[#FAF7F2] hover:bg-[#F2EDE4] text-xs font-semibold text-[#1A1817] transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#5C5549]" />
                <span>Read Concept Guide</span>
              </button>
            </div>
          </div>

          {/* Adaptive Diagnostic Rationale Callout */}
          {activeRec && (
            <div className="rounded-lg bg-[#F8F5EE] border border-[#E6DFD3] p-4 sm:p-5 flex items-start gap-4">
              <Sparkles className="w-5 h-5 text-[#C57D36] shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm text-[#4A453D] leading-relaxed">
                <div className="font-mono uppercase text-[10px] tracking-wider text-[#C57D36] font-semibold">
                  Why this is recommended for you
                </div>
                <div className="font-editorial text-base font-bold text-[#1A1817]">
                  {activeRec.title}
                </div>
                <p className="text-[#5C5549]">
                  {activeRec.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Precision Mastery Progress Track */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#7A7265]">Concept Understanding Progress</span>
              <span className="font-semibold text-[#1A1817]">
                {currentMastery}% <span className="text-[#8C8377] font-normal">(Mastery threshold: 85%)</span>
              </span>
            </div>
            <div className="h-2 w-full bg-[#EAE4D8] rounded-full overflow-hidden relative">
              <div
                className="h-full bg-[#1B4332] transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(currentMastery, 100)}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-[#9C958C]"
                style={{ left: '85%' }}
                title="85% Mastery Requirement"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Grid: Curriculum Syllabus on Left (65%) + Study Ledger on Right (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Open Curriculum Roadmap (7 cols) */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#1A1817]">
                Curriculum Syllabus · Class 7 Fractions
              </h3>
              <p className="text-xs text-[#7A7265] mt-0.5">
                Complete modules sequentially. Each module builds upon prerequisites.
              </p>
            </div>
            <Link
              to="/student/path"
              className="text-xs font-mono text-[#1B4332] hover:text-[#112F23] flex items-center gap-1 font-semibold"
            >
              <span>View Prerequisite Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Open Syllabus Entries */}
          <div className="divide-y divide-[#EAE4D8] border-y border-[#EAE4D8]">
            {topics.map((topic) => {
              const prog = progressList.find(p => p.topicId === topic.id);
              const score = prog ? prog.masteryScore : 0;
              const isMastered = prog?.status === 'mastered';
              const isCurrent = topic.id === currentTopic.id;
              const isLocked = topic.sequenceOrder > 1 && (!progressList.find(p => p.topicId === `topic-${topic.sequenceOrder - 1}`) || progressList.find(p => p.topicId === `topic-${topic.sequenceOrder - 1}`)?.masteryScore! < 40);

              return (
                <div
                  key={topic.id}
                  className={`py-5 transition-colors ${isCurrent ? 'bg-[#FAF7F2] -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-lg' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#8C8377]">
                          0{topic.sequenceOrder}
                        </span>
                        <h4 className="font-editorial text-lg font-bold text-[#1A1817] truncate">
                          {topic.title}
                        </h4>
                        {isMastered && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-semibold bg-[#E8F4EE] text-[#1B4332]">
                            <Check className="w-3 h-3" /> Mastered
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold bg-[#FAF1E4] text-[#C57D36]">
                            Active Focus
                          </span>
                        )}
                        {isLocked && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] text-[#7A7265] bg-[#EFEAE2]">
                            <Lock className="w-3 h-3" /> Prerequisite Locked
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-[#5C5549] line-clamp-2 leading-relaxed">
                        {topic.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs font-mono text-[#7A7265] pt-1">
                        <span>Mastery: <strong className="text-[#1A1817]">{score}%</strong></span>
                        <span>·</span>
                        <span>Estimated: {topic.estimatedMinutes} mins</span>
                      </div>
                    </div>

                    {/* Quick Module Actions */}
                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      <button
                        onClick={() => navigate(`/learn/${topic.id}`)}
                        className="px-3 py-1.5 rounded border border-[#DCD5C9] bg-white hover:bg-[#F4EFE6] text-xs font-medium text-[#1A1817] transition-colors"
                      >
                        Learn
                      </button>
                      <button
                        onClick={() => navigate(`/solve/${topic.id}`)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                          isCurrent
                            ? 'bg-[#1B4332] text-white hover:bg-[#112F23]'
                            : 'border border-[#DCD5C9] bg-white hover:bg-[#F4EFE6] text-[#1A1817]'
                        }`}
                      >
                        Solve
                      </button>
                      {score >= 70 && (
                        <button
                          onClick={() => navigate(`/test/${topic.id}`)}
                          className="px-3 py-1.5 rounded border border-[#C57D36] bg-[#FAF3EB] text-[#C57D36] hover:bg-[#F4E6D4] text-xs font-semibold transition-colors"
                        >
                          Assessment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Column: Scholar's Study Log (5 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Teacher Guidance / Assigned Interventions */}
          {studentInterventions.length > 0 && (
            <div className="bg-[#FAF7F2] rounded-xl border border-[#E0D8CC] p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1B4332] font-semibold">
                <BookOpen className="w-4 h-4" />
                <span>Guidance from Teacher Sunita</span>
              </div>
              {studentInterventions.map(item => (
                <div key={item.id} className="text-xs text-[#4A453D] space-y-1 border-t border-[#E8E2D8] pt-2">
                  <div className="font-semibold text-[#1A1817] capitalize">{item.interventionType.replace('_', ' ')}</div>
                  <p className="text-[#5C5549] leading-relaxed">{item.interventionNote}</p>
                  <span className="font-mono text-[10px] text-[#7A7265]">Status: {item.status}</span>
                </div>
              ))}
            </div>
          )}

          {/* Recent Problem Journal */}
          <div className="bg-white rounded-xl border border-[#E0D8CC] p-5 space-y-4">
            <div className="border-b border-[#EFEAE2] pb-2 flex items-center justify-between">
              <h3 className="font-editorial text-base font-bold text-[#1A1817]">
                Recent Problem Journal
              </h3>
              <span className="font-mono text-[10px] text-[#7A7265]">Last 6 answers</span>
            </div>

            {recentAttempts.length === 0 ? (
              <p className="text-xs text-[#7A7265] py-4 text-center">No practice problems logged yet.</p>
            ) : (
              <div className="divide-y divide-[#F2EDE4]">
                {recentAttempts.map((attempt) => (
                  <div key={attempt.id} className="py-2.5 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#1A1817]">
                        Question #{attempt.questionId.slice(-1)}
                      </span>
                      <span className={`font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        attempt.isCorrect
                          ? 'bg-[#E8F4EE] text-[#1B4332]'
                          : 'bg-[#FEEBEB] text-[#8C2828]'
                      }`}>
                        {attempt.isCorrect ? (attempt.hintUsed ? '+70 pts (Hint)' : '+100 pts') : 'Review'}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#5C5549] flex items-center justify-between">
                      <span>Submitted: <code className="font-mono">{attempt.submittedAnswer}</code></span>
                      <span className="font-mono text-[10px] text-[#8C8377]">
                        {new Date(attempt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {attempt.detectedMisconception && (
                      <div className="text-[11px] text-[#8C2828] bg-[#FFF5F5] p-1.5 rounded mt-1">
                        Flagged misconception: {attempt.detectedMisconception.replace(/_/g, ' ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Constructive Growth & Consistency Milestones */}
          <div className="bg-[#FAF8F5] rounded-xl border border-[#E0D8CC] p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1B4332] font-semibold">
              <Sparkles className="w-4 h-4 text-[#C57D36]" />
              <span>Growth Milestones & Consistency</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#5C5549]">
              <div className="p-2 rounded bg-white border border-[#EAE3D6] space-y-0.5">
                <span className="text-[#8C8377] block text-[10px]">Study Cadence</span>
                <span className="font-bold text-[#1B4332]">3-Day Consistency</span>
              </div>
              <div className="p-2 rounded bg-white border border-[#EAE3D6] space-y-0.5">
                <span className="text-[#8C8377] block text-[10px]">Independent Solves</span>
                <span className="font-bold text-[#1A1817]">
                  {recentAttempts.filter(a => a.isCorrect && !a.hintUsed).length} Solved
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#7A7265] italic">
              "Pacing yourself daily builds stronger mathematical intuition than rushing."
            </p>
          </div>

          {/* Quick Study Tip */}
          <div className="border-l-2 border-[#C57D36] pl-3 py-1 text-xs text-[#5C5549] space-y-0.5">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#C57D36]">Math Principle</span>
            <p className="italic font-editorial text-sm text-[#1A1817]">
              "The denominator is the name of the fraction part; the numerator tells you how many parts you have."
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
