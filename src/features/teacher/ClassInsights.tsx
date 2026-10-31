import React from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/db';
import { MasteryBadge } from '../../components/ui/MasteryBadge';
import { MISCONCEPTIONS } from '../../data/curriculum/fractions';
import {
  Compass,
  AlertTriangle,
  TrendingUp,
  Award,
  Users,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ClassInsights: React.FC = () => {
  const navigate = useNavigate();

  const students = db.getStudents();
  const topics = db.getTopics();
  const allProgress = students.flatMap(s => db.getStudentProgress(s.id));
  const allAttempts = students.flatMap(s => db.getAttempts(s.id));

  // 1. Topic Performance Aggregation
  const topicBreakdown = topics.map(topic => {
    const progs = allProgress.filter(p => p.topicId === topic.id);
    const avg = progs.length > 0
      ? Math.round(progs.reduce((sum, p) => sum + p.masteryScore, 0) / progs.length)
      : 0;

    const topicAttempts = allAttempts.filter(a => a.topicId === topic.id);
    const correctCount = topicAttempts.filter(a => a.isCorrect).length;
    const accuracy = topicAttempts.length > 0
      ? Math.round((correctCount / topicAttempts.length) * 100)
      : 0;

    const strugglingStudents = progs.filter(p => p.masteryScore < 60).map(p => {
      return students.find(s => s.id === p.studentId);
    }).filter(Boolean);

    return {
      topic,
      avgMastery: avg,
      accuracy,
      totalAttempts: topicAttempts.length,
      strugglingStudents
    };
  });

  // Sort topics by difficulty (lowest mastery = hardest)
  const rankedByDifficulty = [...topicBreakdown].sort((a, b) => a.avgMastery - b.avgMastery);

  // 2. Class Misconception Frequency Distribution
  const misconceptionCounts: Record<string, number> = {};
  for (const a of allAttempts) {
    if (!a.isCorrect && a.detectedMisconception) {
      misconceptionCounts[a.detectedMisconception] = (misconceptionCounts[a.detectedMisconception] || 0) + 1;
    }
  }

  const sortedMisconceptions = Object.entries(misconceptionCounts)
    .map(([code, count]) => ({
      code,
      count,
      name: MISCONCEPTIONS[code]?.name || code.replace(/_/g, ' '),
      why: MISCONCEPTIONS[code]?.whyItHappens || '',
      remedy: MISCONCEPTIONS[code]?.remedialConcept || ''
    }))
    .sort((a, b) => b.count - a.count);

  // 3. Student Grouping: Struggling vs Advanced
  const strugglingGroup = students.filter(s => {
    const sProgs = db.getStudentProgress(s.id);
    const avg = sProgs.length > 0
      ? sProgs.reduce((acc, p) => acc + p.masteryScore, 0) / topics.length
      : 0;
    return avg < 55;
  });

  const advancedGroup = students.filter(s => {
    const sProgs = db.getStudentProgress(s.id);
    const avg = sProgs.length > 0
      ? sProgs.reduce((acc, p) => acc + p.masteryScore, 0) / topics.length
      : 0;
    return avg >= 75;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Class Diagnostics & Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal">
          Class 7-B Insights
        </h1>
        <p className="text-sm text-charcoal-muted mt-1">
          Evidence-based learning analytics derived directly from student response attempts and curriculum progressions.
        </p>
      </div>

      {/* Top 3 Metric Callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-borderSoft shadow-card space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
            Hardest Curriculum Step
          </span>
          <h3 className="text-lg font-bold font-heading text-charcoal truncate">
            {rankedByDifficulty[0]?.topic.title || 'Addition & Subtraction'}
          </h3>
          <p className="text-xs text-rose-700 font-medium">
            Class Average: {rankedByDifficulty[0]?.avgMastery || 0}% ({rankedByDifficulty[0]?.strugglingStudents.length || 0} students needing help)
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-borderSoft shadow-card space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
            Most Frequent Misconception
          </span>
          <h3 className="text-lg font-bold font-heading text-charcoal truncate">
            {sortedMisconceptions[0]?.name || 'Denominator Addition Error'}
          </h3>
          <p className="text-xs text-amber-800 font-medium">
            Recorded {sortedMisconceptions[0]?.count || 0} times across class attempts
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-borderSoft shadow-card space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
            Students Ready for Enrichment
          </span>
          <h3 className="text-lg font-bold font-heading text-primary">
            {advancedGroup.length} of {students.length} Students
          </h3>
          <p className="text-xs text-charcoal-muted">
            Demonstrating ≥ 75% curriculum mastery
          </p>
        </div>
      </div>

      {/* Grid: Misconceptions Frequency & Student Groupings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Misconceptions Table */}
        <div className="bg-white rounded-xl border border-borderSoft p-6 shadow-card space-y-4">
          <div>
            <h2 className="text-base font-heading font-bold text-charcoal">
              Class-Wide Misconception Catalog
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Specific thinking errors detected by deterministic evaluation rules.
            </p>
          </div>

          <div className="space-y-3">
            {sortedMisconceptions.map(item => (
              <div
                key={item.code}
                className="p-4 bg-canvas rounded-lg border border-borderSoft space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-charcoal">
                    {item.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-xs">
                    {item.count} attempts
                  </span>
                </div>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  <span className="font-semibold text-charcoal">Why it occurs: </span>
                  {item.why}
                </p>
                <p className="text-xs text-primary leading-relaxed bg-white p-2.5 rounded border border-primary/20">
                  <span className="font-semibold">Recommended Teacher Explanation: </span>
                  {item.remedy}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Student Groupings for Differentiated Instruction */}
        <div className="space-y-6">
          {/* Needing Support Group */}
          <div className="bg-white rounded-xl border border-rose-200/80 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-heading font-bold text-rose-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-700" />
                  <span>Foundational Remedial Group</span>
                </h3>
                <p className="text-xs text-rose-800/80 mt-0.5">
                  Students requiring targeted intervention or prerequisite revision.
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                {strugglingGroup.length} students
              </span>
            </div>

            <div className="divide-y divide-borderSoft">
              {strugglingGroup.map(s => {
                const sProg = db.getStudentProgress(s.id);
                const avg = sProg.length > 0
                  ? Math.round(sProg.reduce((sum, p) => sum + p.masteryScore, 0) / topics.length)
                  : 0;

                return (
                  <div
                    key={s.id}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-semibold text-charcoal">{s.displayName}</h5>
                      <span className="text-[11px] text-charcoal-muted">Overall: {avg}%</span>
                    </div>
                    <button
                      onClick={() => navigate(`/teacher/student/${s.id}`)}
                      className="px-2.5 py-1 text-xs font-medium rounded border border-borderSoft bg-canvas hover:bg-white text-charcoal"
                    >
                      Inspect Profile
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Advanced / Enrichment Group */}
          <div className="bg-white rounded-xl border border-emerald-200/80 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-heading font-bold text-emerald-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-700" />
                  <span>Enrichment & Extension Group</span>
                </h3>
                <p className="text-xs text-emerald-800/80 mt-0.5">
                  Students ready for challenging word problems and multi-step fraction arithmetic.
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {advancedGroup.length} students
              </span>
            </div>

            <div className="divide-y divide-borderSoft">
              {advancedGroup.map(s => {
                const sProg = db.getStudentProgress(s.id);
                const avg = sProg.length > 0
                  ? Math.round(sProg.reduce((sum, p) => sum + p.masteryScore, 0) / topics.length)
                  : 0;

                return (
                  <div
                    key={s.id}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-semibold text-charcoal">{s.displayName}</h5>
                      <span className="text-[11px] text-charcoal-muted">Overall: {avg}%</span>
                    </div>
                    <button
                      onClick={() => navigate(`/teacher/student/${s.id}`)}
                      className="px-2.5 py-1 text-xs font-medium rounded border border-borderSoft bg-canvas hover:bg-white text-charcoal"
                    >
                      Inspect Profile
                    </button>
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
