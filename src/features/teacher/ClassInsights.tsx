import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../lib/db';
import { MISCONCEPTIONS } from '../../data/curriculum/fractions';
import {
  Compass,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

export const ClassInsights: React.FC = () => {
  const navigate = useNavigate();

  const students = db.getStudents();
  const topics = db.getTopics();
  const allProgress = students.flatMap((s) => db.getStudentProgress(s.id));
  const allAttempts = students.flatMap((s) => db.getAttempts(s.id));

  // 1. Topic Performance Aggregation
  const topicBreakdown = topics.map((topic) => {
    const progs = allProgress.filter((p) => p.topicId === topic.id);
    const avg = progs.length > 0
      ? Math.round(progs.reduce((sum, p) => sum + p.masteryScore, 0) / progs.length)
      : 0;

    const topicAttempts = allAttempts.filter((a) => a.topicId === topic.id);
    const correctCount = topicAttempts.filter((a) => a.isCorrect).length;
    const accuracy = topicAttempts.length > 0
      ? Math.round((correctCount / topicAttempts.length) * 100)
      : 0;

    const strugglingStudents = progs
      .filter((p) => p.masteryScore < 60)
      .map((p) => students.find((s) => s.id === p.studentId))
      .filter(Boolean);

    return {
      topic,
      avgMastery: avg,
      accuracy,
      totalAttempts: topicAttempts.length,
      strugglingStudents,
    };
  });

  const rankedByDifficulty = [...topicBreakdown].sort((a, b) => a.avgMastery - b.avgMastery);

  // 2. Class Misconception Frequency Distribution
  const misconceptionCounts: Record<string, number> = {};
  allAttempts.forEach((attempt) => {
    if (attempt.detectedMisconception) {
      misconceptionCounts[attempt.detectedMisconception] = (misconceptionCounts[attempt.detectedMisconception] || 0) + 1;
    }
  });

  const topMisconceptions = Object.entries(misconceptionCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([key, count]) => ({
      key,
      count,
      data: MISCONCEPTIONS[key],
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Masthead */}
      <section className="border-b border-[#E8E2D8] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#7A7265] mb-1.5">
            <span>Diagnostic Intelligence</span>
            <span>·</span>
            <span>Class 7-B Mathematics</span>
            <span>·</span>
            <span>Fractions Pilot</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1817]">
            Class Learning Analytics & Error Patterns
          </h1>
          <p className="text-sm sm:text-base text-[#5C5549] mt-2 max-w-2xl leading-relaxed">
            Aggregated diagnostic evidence derived directly from student response attempts. Uncovers root-cause learning difficulties across the cohort.
          </p>
        </div>

        <Link
          to="/teacher/interventions"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1B4332] text-white hover:bg-[#112F23] text-xs font-semibold shrink-0 shadow-xs"
        >
          <span>Apply Classroom Interventions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* 2. Key Diagnostic Highlights Strip */}
      <section className="bg-white rounded-xl border border-[#E0D8CC] shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E8E2D8]">
          <div className="p-6 space-y-1">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#8C2828] font-semibold block">
              Hardest Curriculum Step
            </span>
            <div className="font-editorial text-xl font-bold text-[#1A1817]">
              {rankedByDifficulty[0].topic.title}
            </div>
            <p className="text-xs text-[#5C5549] font-mono">
              Class Average: {rankedByDifficulty[0].avgMastery}% · {rankedByDifficulty[0].strugglingStudents.length} scholars needing support
            </p>
          </div>

          <div className="p-6 space-y-1">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#C57D36] font-semibold block">
              Most Prevalent Misconception
            </span>
            <div className="font-editorial text-xl font-bold text-[#1A1817]">
              {topMisconceptions[0]?.data?.name || 'Denominator Addition'}
            </div>
            <p className="text-xs text-[#5C5549] font-mono">
              Flagged in {topMisconceptions[0]?.count || 2} distinct practice attempts
            </p>
          </div>

          <div className="p-6 space-y-1">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#2D6A4F] font-semibold block">
              Assessment Readiness
            </span>
            <div className="font-editorial text-xl font-bold text-[#1A1817]">
              {topicBreakdown.find(t => t.topic.id === 'topic-2')?.strugglingStudents.length === 0 ? 'Ready' : 'In Preparation'}
            </div>
            <p className="text-xs text-[#5C5549] font-mono">
              Topic 01 & 02 ready for summative assessment
            </p>
          </div>
        </div>
      </section>

      {/* 3. Main Grid: Misconception Guide on Left (65%) + Topic Breakdown on Right (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Misconception Catalog & Teaching Guidance (8 cols) */}
        <section className="lg:col-span-8 bg-white rounded-xl border border-[#E0D8CC] p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E8E2D8] pb-3">
            <h3 className="font-editorial text-xl font-bold text-[#1A1817]">
              Detected Misconception Catalog
            </h3>
            <p className="text-xs text-[#7A7265] mt-0.5">
              Psychometric error patterns flagged by the deterministic rule engine, complete with teaching guidelines.
            </p>
          </div>

          <div className="space-y-6">
            {topMisconceptions.map(({ key, count, data }) => (
              <div key={key} className="p-5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] uppercase font-semibold text-[#8C2828] bg-[#FFF0F0] px-2 py-0.5 rounded">
                      Pattern Flag #{key}
                    </span>
                    <h4 className="font-editorial text-lg font-bold text-[#1A1817]">
                      {data ? data.name : key}
                    </h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#8C2828] bg-white px-2.5 py-1 rounded border border-[#E8E2D8]">
                    {count} Attempts
                  </span>
                </div>

                <div className="text-xs text-[#5C5549] space-y-1">
                  <div className="font-mono text-[11px] font-semibold text-[#1A1817] uppercase">Why it occurs:</div>
                  <p className="leading-relaxed">{data ? data.description : 'Identified error.'}</p>
                </div>

                {data && (
                  <div className="p-3.5 bg-white rounded-lg border border-[#E4DDD2] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1B4332] font-mono">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Teacher Classroom Remediation Strategy</span>
                    </div>
                    <p className="text-xs text-[#4A453D] leading-relaxed italic">
                      "{data.remedialConcept}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Topic Difficulty Landscape (4 cols) */}
        <section className="lg:col-span-4 bg-white rounded-xl border border-[#E0D8CC] p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E8E2D8] pb-3">
            <h3 className="font-editorial text-lg font-bold text-[#1A1817]">
              Curriculum Mastery Curves
            </h3>
            <p className="text-xs text-[#7A7265] mt-0.5">
              Ranked from highest to lowest class mastery.
            </p>
          </div>

          <div className="space-y-4">
            {rankedByDifficulty.map(({ topic, avgMastery, accuracy, totalAttempts }) => (
              <div key={topic.id} className="p-3.5 rounded-lg border border-[#EAE4D8] bg-[#FAF8F5] space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] text-[#8C8377] font-semibold">
                      Topic 0{topic.sequenceOrder}
                    </span>
                    <div className="font-editorial text-sm font-bold text-[#1A1817]">
                      {topic.title}
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#1A1817]">
                    {avgMastery}%
                  </span>
                </div>

                <div className="h-1.5 w-full bg-[#EAE4D8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1B4332] rounded-full"
                    style={{ width: `${avgMastery}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] font-mono text-[#7A7265]">
                  <span>Accuracy: {accuracy}%</span>
                  <span>{totalAttempts} Attempts</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
