import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../lib/db';
import {
  Users,
  AlertTriangle,
  Award,
  ArrowRight,
  ClipboardList,
  Clock,
  Sparkles,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();

  const teacher = db.getTeacher();
  const classRoom = db.getClassRoom();
  const students = db.getStudents();
  const topics = db.getTopics();

  // Compute live statistics from persistent records
  const allProgress = students.flatMap(s => db.getStudentProgress(s.id));
  const allAttempts = students.flatMap(s => db.getAttempts(s.id));
  const allInterventions = db.getTeacherInterventions();
  const pendingInterventions = allInterventions.filter(i => i.status === 'pending');

  const studentSummaries = students.map(s => {
    const sProg = db.getStudentProgress(s.id);
    const avgMastery = sProg.length > 0
      ? Math.round(sProg.reduce((sum, p) => sum + p.masteryScore, 0) / topics.length)
      : 0;

    const sAttempts = db.getAttempts(s.id);
    const recentFlaggedAttempt = sAttempts.slice(0, 3).find(a => !a.isCorrect && a.detectedMisconception);
    const hasRecentErrors = !!recentFlaggedAttempt;
    const needsAttention = avgMastery < 55 || hasRecentErrors;
    const activeRec = db.getRecommendations(s.id)[0];
    const hasImproved = sAttempts.length >= 2 && sAttempts[0]?.isCorrect && sAttempts.slice(1).some(a => !a.isCorrect || a.hintUsed);

    return {
      student: s,
      avgMastery,
      attemptsCount: sAttempts.length,
      needsAttention,
      hasImproved,
      recentFlaggedAttempt,
      activeRec,
      topicProgress: sProg
    };
  });

  const strugglingStudents = studentSummaries.filter(s => s.needsAttention);
  const readyForNextTopic = studentSummaries.filter(s => s.avgMastery >= 75);
  const improvedStudents = studentSummaries.filter(s => s.hasImproved);

  const topicStats = topics.map(t => {
    const topicProgress = allProgress.filter(p => p.topicId === t.id);
    const avg = topicProgress.length > 0
      ? Math.round(topicProgress.reduce((sum, p) => sum + p.masteryScore, 0) / topicProgress.length)
      : 0;
    const strugglingCount = topicProgress.filter(p => p.masteryScore < 60).length;
    const masteredCount = topicProgress.filter(p => p.masteryScore >= 80).length;
    const developingCount = topicProgress.length - strugglingCount - masteredCount;

    return {
      topic: t,
      avgMastery: avg,
      strugglingCount,
      masteredCount,
      developingCount: Math.max(0, developingCount)
    };
  });

  const hardestTopic = [...topicStats].sort((a, b) => a.avgMastery - b.avgMastery)[0];
  const recentClassAttempts = [...allAttempts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 7);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Academic Dossier Masthead */}
      <section className="border-b border-[#E8E2D8] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#7A7265] mb-1.5">
            <span>Teacher Command Dossier</span>
            <span>·</span>
            <span>{classRoom.name}</span>
            <span>·</span>
            <span>Teacher: Sunita Verma</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1817]">
            Instructional Overview & Action Ledger
          </h1>
          <p className="text-sm sm:text-base text-[#5C5549] mt-2 max-w-2xl leading-relaxed">
            Real-time diagnostic telemetry from Class 7-B. GatiPath identifies underlying misconception patterns to help you direct targeted classroom guidance.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/teacher/students"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#DCD5C9] bg-white hover:bg-[#F4EFE6] text-xs font-semibold text-[#1A1817] transition-all shadow-2xs"
          >
            <span>Open Scholar Ledger ({students.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#5C5549]" />
          </Link>
          <Link
            to="/teacher/interventions"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1B4332] hover:bg-[#112F23] text-xs font-medium text-white transition-all shadow-2xs"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Active Interventions ({pendingInterventions.length})</span>
          </Link>
        </div>
      </section>

      {/* 2. Open Class Ledger Ticker (Not 4 boxed cards!) */}
      <section className="bg-white rounded-xl border border-[#E0D8CC] shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#E8E2D8]">
          <div className="p-5 sm:p-6 space-y-1">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#7A7265] block">
              Enrolled Scholars
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#1A1817] font-mono">
              {students.length}
            </div>
            <p className="text-[11px] text-[#5C5549]">
              Active in Fractions Pilot
            </p>
          </div>

          <div className="p-5 sm:p-6 space-y-1 bg-[#FDF9F7]">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#8C2828] block font-semibold">
              Action Required
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#8C2828] font-mono">
              {strugglingStudents.length}
            </div>
            <p className="text-[11px] text-[#7A3E3E]">
              Flagged with concept gaps
            </p>
          </div>

          <div className="p-5 sm:p-6 space-y-1">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#2D6A4F] block font-semibold">
              Advanced Cohort
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#2D6A4F] font-mono">
              {readyForNextTopic.length}
            </div>
            <p className="text-[11px] text-[#5C5549]">
              ≥75% Curriculum Mastery
            </p>
          </div>

          <div className="p-5 sm:p-6 space-y-1">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#C57D36] block font-semibold">
              Class Bottleneck
            </span>
            <div className="text-lg sm:text-xl font-bold text-[#1A1817] font-editorial truncate">
              {hardestTopic.topic.title}
            </div>
            <p className="text-[11px] text-[#5C5549] font-mono">
              Avg Mastery: {hardestTopic.avgMastery}%
            </p>
          </div>
        </div>
      </section>

      {/* 3. Main Asymmetrical Layout: Casebook on Left (68%), Briefing on Right (32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Priority Action Ledger & Concept Landscape */}
        <div className="lg:col-span-8 space-y-8">
          {/* Priority Casebook Table */}
          <section className="bg-white rounded-xl border border-[#E0D8CC] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E8E2D8] flex items-center justify-between bg-[#FAF7F2]">
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#1A1817]">
                  Scholars Requiring Immediate Guidance
                </h3>
                <p className="text-xs text-[#7A7265] mt-0.5">
                  Ranked by detected misconception severity and prerequisite gaps.
                </p>
              </div>
              <Link
                to="/teacher/students"
                className="text-xs font-mono font-semibold text-[#1B4332] hover:text-[#112F23] flex items-center gap-1"
              >
                <span>Full Ledger</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[#EFEAE2]">
              {strugglingStudents.slice(0, 5).map(({ student, avgMastery, recentFlaggedAttempt, activeRec }) => (
                <div key={student.id} className="p-5 hover:bg-[#FAF8F5] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 min-w-0">
                      {/* Name & Roll */}
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-[#1A1817] text-[#FAF7F2] font-editorial font-bold text-xs flex items-center justify-center shrink-0">
                          {student.displayName.split(' ').map(n => n[0]).join('')}
                        </span>
                        <div>
                          <Link
                            to={`/teacher/student/${student.id}`}
                            className="font-editorial text-base font-bold text-[#1A1817] hover:text-[#1B4332] transition-colors"
                          >
                            {student.displayName}
                          </Link>
                          <span className="font-mono text-[11px] text-[#7A7265] ml-2">
                            Roll #{String(students.findIndex(st => st.id === student.id) + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FEEBEB] text-[#8C2828]">
                          {avgMastery}% Mastery
                        </span>
                      </div>

                      {/* Editorial Diagnostic Diagnosis */}
                      <div className="pl-9 space-y-1">
                        <div className="text-xs font-medium text-[#1A1817]">
                          {activeRec ? activeRec.title : 'Prerequisite Gap Review'}
                        </div>
                        <p className="text-xs text-[#5C5549] leading-relaxed italic font-serif">
                          "{activeRec?.explanation || 'Struggling with core fraction operations. Needs targeted guidance.'}"
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 sm:self-center pl-9 sm:pl-0">
                      <Link
                        to={`/teacher/student/${student.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#DCD5C9] bg-white hover:bg-[#F2EDE4] text-xs font-medium text-[#1A1817] transition-all"
                      >
                        <span>Inspect Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#5C5549]" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Scholars Demonstrating Improvement (Delta Growth Tracking) */}
          {improvedStudents.length > 0 && (
            <section className="bg-white rounded-xl border border-[#E0D8CC] shadow-xs overflow-hidden">
              <div className="p-5 border-b border-[#E8E2D8] flex items-center justify-between bg-[#F2F8F4]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F]" />
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-[#1B4332]">
                      Scholars Demonstrating Concrete Improvement ({improvedStudents.length})
                    </h3>
                    <p className="text-xs text-[#5C5549] mt-0.5 font-mono">
                      Overcame previous errors or successfully utilized progressive guidance.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#EAF2ED] text-[#1B4332] font-bold">
                  Positive Growth Delta
                </span>
              </div>

              <div className="divide-y divide-[#EFEAE2]">
                {improvedStudents.map(({ student, avgMastery, attemptsCount }) => (
                  <div key={student.id} className="p-4 hover:bg-[#FAF8F5] transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#1B4332] text-white font-editorial font-bold text-xs flex items-center justify-center shrink-0">
                        {student.displayName.split(' ').map(n => n[0]).join('')}
                      </span>
                      <div>
                        <div className="font-editorial font-bold text-sm text-[#1A1817]">
                          {student.displayName}
                        </div>
                        <span className="text-[11px] text-[#5C5549] font-mono">
                          Resolved prior difficulty · Current Mastery: <strong className="text-[#1B4332]">{avgMastery}%</strong>
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/teacher/student/${student.id}`}
                      className="text-xs font-mono font-semibold text-[#1B4332] hover:underline"
                    >
                      View Growth Trace &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Classroom Concept Landscape */}
          <section className="bg-white rounded-xl border border-[#E0D8CC] shadow-xs p-6 space-y-6">
            <div className="border-b border-[#E8E2D8] pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#1A1817]">
                  Curriculum Mastery Landscape
                </h3>
                <p className="text-xs text-[#7A7265] mt-0.5">
                  Distribution of scholar understanding across the 4 core topics.
                </p>
              </div>
              <Link
                to="/teacher/insights"
                className="text-xs font-mono font-semibold text-[#1B4332] hover:text-[#112F23] flex items-center gap-1"
              >
                <span>Diagnostic Breakdown</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-5">
              {topicStats.map(({ topic, avgMastery, strugglingCount, masteredCount, developingCount }) => (
                <div key={topic.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#7A7265]">0{topic.sequenceOrder}</span>
                      <span className="font-editorial font-bold text-sm text-[#1A1817]">{topic.title}</span>
                    </div>
                    <div className="font-mono text-xs text-[#5C5549]">
                      Average: <strong className="text-[#1A1817]">{avgMastery}%</strong>
                    </div>
                  </div>

                  {/* Stacked Cohort Segment Bar */}
                  <div className="h-3 w-full bg-[#EAE4D8] rounded-full overflow-hidden flex">
                    <div
                      className="bg-[#2D6A4F] h-full transition-all"
                      style={{ width: `${(masteredCount / students.length) * 100}%` }}
                      title={`${masteredCount} Mastered`}
                    />
                    <div
                      className="bg-[#C57D36] h-full transition-all"
                      style={{ width: `${(developingCount / students.length) * 100}%` }}
                      title={`${developingCount} Developing`}
                    />
                    <div
                      className="bg-[#8C2828] h-full transition-all"
                      style={{ width: `${(strugglingCount / students.length) * 100}%` }}
                      title={`${strugglingCount} Critical Gap`}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-[#7A7265]">
                    <span>{masteredCount} Mastered</span>
                    <span>{developingCount} Developing</span>
                    <span className="text-[#8C2828]">{strugglingCount} Need Guidance</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (4 cols): Pedagogical Briefing & Live Evidence */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pedagogical Briefing Card */}
          <div className="bg-[#FAF7F2] rounded-xl border border-[#DFD7CB] p-6 space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#C57D36] font-semibold">
              <Lightbulb className="w-4 h-4" />
              <span>Instructional Briefing</span>
            </div>

            <h4 className="font-editorial text-lg font-bold text-[#1A1817]">
              Addressing the "Denominator Addition" Trap
            </h4>

            <p className="text-xs text-[#5C5549] leading-relaxed">
              7 of your scholars are calculating <span className="font-mono bg-[#FAF0E4] px-1 py-0.5 rounded text-[#1A1817]">1/4 + 1/4 = 2/8</span>. They treat numerator and denominator as separate independent integers.
            </p>

            <div className="p-3 bg-white rounded-lg border border-[#E6DFD3] text-xs text-[#4A453D] space-y-1">
              <div className="font-semibold text-[#1A1817] font-mono text-[11px] uppercase">
                Recommended Whiteboard Prompt
              </div>
              <p className="italic text-[#5C5549]">
                "If you eat one slice of a 4-slice pizza, and your friend eats one slice of the same pizza, how much did you eat together? Did the pizza suddenly grow into 8 slices?"
              </p>
            </div>
          </div>

          {/* Chronological Observation Stream */}
          <div className="bg-white rounded-xl border border-[#E0D8CC] p-5 space-y-4 shadow-xs">
            <div className="border-b border-[#EFEAE2] pb-2 flex items-center justify-between">
              <h4 className="font-editorial text-base font-bold text-[#1A1817]">
                Live Attempt Stream
              </h4>
              <span className="font-mono text-[10px] text-[#7A7265]">Chronological</span>
            </div>

            <div className="divide-y divide-[#F2EDE4]">
              {recentClassAttempts.map((attempt) => {
                const s = students.find(st => st.id === attempt.studentId);
                return (
                  <div key={attempt.id} className="py-2.5 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1A1817]">
                        {s?.displayName || 'Scholar'}
                      </span>
                      <span className="font-mono text-[10px] text-[#8C8377]">
                        {new Date(attempt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#5C5549] flex items-center justify-between">
                      <span>Submitted: <code className="font-mono">{attempt.submittedAnswer}</code></span>
                      <span className={`font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        attempt.isCorrect ? 'bg-[#E8F4EE] text-[#1B4332]' : 'bg-[#FEEBEB] text-[#8C2828]'
                      }`}>
                        {attempt.isCorrect ? 'Correct' : 'Misconception'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
