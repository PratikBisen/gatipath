import React from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/db';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Avatar } from '../../components/ui/Avatar';
import { MISCONCEPTIONS } from '../../data/curriculum/fractions';
import {
  Compass,
  AlertTriangle,
  TrendingUp,
  Award,
  Users,
  ArrowRight,
  Sparkles,
  BarChart3,
  Lightbulb,
  CheckCircle2
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
      remedy: MISCONCEPTIONS[code]?.remedialConcept || '',
    }))
    .sort((a, b) => b.count - a.count);

  // 3. Student Grouping: Struggling vs Advanced
  const strugglingGroup = students.filter((s) => {
    const sProgs = db.getStudentProgress(s.id);
    const avg = sProgs.length > 0
      ? sProgs.reduce((acc, p) => acc + p.masteryScore, 0) / topics.length
      : 0;
    return avg < 55;
  });

  const advancedGroup = students.filter((s) => {
    const sProgs = db.getStudentProgress(s.id);
    const avg = sProgs.length > 0
      ? sProgs.reduce((acc, p) => acc + p.masteryScore, 0) / topics.length
      : 0;
    return avg >= 75;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-subtle text-primary text-[11px] font-semibold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Diagnostic Analytics & Insights</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-charcoal tracking-tight">
          Class 7-B Learning Analytics
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-1 leading-relaxed">
          Aggregated learning evidence derived directly from student response attempts and prerequisite mastery.
        </p>
      </div>

      {/* Top 3 Metric Callout Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Hardest Curriculum Step"
          value={rankedByDifficulty[0]?.topic.title.replace(' of Fractions', '') || 'Addition'}
          subtext={`Class Average: ${rankedByDifficulty[0]?.avgMastery || 0}% (${rankedByDifficulty[0]?.strugglingStudents.length || 0} students needing help)`}
          badge={{ text: 'Challenging', variant: 'danger' }}
          icon={AlertTriangle}
          variant="danger"
        />

        <StatCard
          label="Top Misconception"
          value={sortedMisconceptions[0]?.name || 'Denominator Addition Error'}
          subtext={`Recorded ${sortedMisconceptions[0]?.count || 0} times across class attempts`}
          badge={{ text: 'Frequent', variant: 'warning' }}
          icon={Award}
          variant="warning"
        />

        <StatCard
          label="Ready for Enrichment"
          value={`${advancedGroup.length} of ${students.length}`}
          subtext="Students demonstrating ≥ 75% curriculum mastery"
          badge={{ text: 'Enrichment', variant: 'success' }}
          icon={TrendingUp}
          variant="success"
        />
      </div>

      {/* Main Grid: Topic Performance Breakdown (Left) & Misconceptions Catalog (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic-Wise Breakdown */}
        <Card>
          <CardHeader
            title="Curriculum Performance by Topic"
            subtitle="Sequential mastery distribution and student success rates."
          />
          <CardContent className="space-y-5">
            {topicBreakdown.map(({ topic, avgMastery, accuracy, totalAttempts, strugglingStudents }) => (
              <div key={topic.id} className="p-4 rounded-xl bg-canvas-subtle/50 border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-heading font-bold text-charcoal">
                    Topic {topic.sequenceOrder}: {topic.title}
                  </span>
                  <span className="font-bold text-charcoal tabular-nums">
                    {avgMastery}% Mastery
                  </span>
                </div>

                <ProgressBar value={avgMastery} target={85} size="sm" />

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-charcoal-muted pt-1">
                  <span>Accuracy: <strong className="text-charcoal">{accuracy}%</strong> ({totalAttempts} attempts)</span>
                  <span className={strugglingStudents.length > 0 ? 'text-rose-700 font-semibold' : ''}>
                    {strugglingStudents.length} students below 60%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Class Misconception Frequency Distribution */}
        <Card>
          <CardHeader
            title="Detected Misconception Catalog"
            subtitle="Frequency analysis of thinking errors captured by deterministic rules."
          />
          <CardContent className="space-y-3">
            {sortedMisconceptions.map((item) => (
              <div
                key={item.code}
                className="p-4 rounded-xl bg-canvas-subtle/50 border border-border/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-heading font-bold text-charcoal">
                    {item.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                    {item.count} {item.count === 1 ? 'attempt' : 'attempts'}
                  </span>
                </div>

                <p className="text-xs text-charcoal-muted leading-relaxed">
                  <span className="font-semibold text-charcoal">Why it occurs: </span>
                  {item.why}
                </p>

                <div className="p-2.5 rounded-lg bg-surface border border-primary/20 text-xs text-charcoal leading-relaxed">
                  <span className="font-semibold text-primary">Teacher Explanation Guideline: </span>
                  {item.remedy}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Differentiated Instruction Cohorts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Remedial Cohort */}
        <Card className="border-rose-200/90">
          <CardHeader
            title="Foundational Remedial Cohort"
            subtitle="Students requiring targeted intervention or prerequisite review."
            badge={
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                {strugglingGroup.length} Students
              </span>
            }
          />
          <div className="divide-y divide-border">
            {strugglingGroup.map((s) => {
              const sProg = db.getStudentProgress(s.id);
              const avg = sProg.length > 0
                ? Math.round(sProg.reduce((sum, p) => sum + p.masteryScore, 0) / topics.length)
                : 0;

              return (
                <div
                  key={s.id}
                  className="p-4 px-5 flex items-center justify-between gap-3 text-xs hover:bg-canvas-subtle/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={s.displayName} seed={s.avatarSeed} size="sm" status="attention" />
                    <div>
                      <p className="font-semibold text-charcoal">{s.displayName}</p>
                      <p className="text-[11px] text-charcoal-muted">Curriculum Mastery: {avg}%</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/teacher/student/${s.id}`)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-primary hover:text-white hover:border-primary text-xs font-semibold text-charcoal transition-all"
                  >
                    Inspect Profile
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Enrichment Cohort */}
        <Card className="border-emerald-200/90">
          <CardHeader
            title="Enrichment & Extension Cohort"
            subtitle="Students ready for challenging word problems and advanced applications."
            badge={
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {advancedGroup.length} Students
              </span>
            }
          />
          <div className="divide-y divide-border">
            {advancedGroup.map((s) => {
              const sProg = db.getStudentProgress(s.id);
              const avg = sProg.length > 0
                ? Math.round(sProg.reduce((sum, p) => sum + p.masteryScore, 0) / topics.length)
                : 0;

              return (
                <div
                  key={s.id}
                  className="p-4 px-5 flex items-center justify-between gap-3 text-xs hover:bg-canvas-subtle/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={s.displayName} seed={s.avatarSeed} size="sm" status="active" />
                    <div>
                      <p className="font-semibold text-charcoal">{s.displayName}</p>
                      <p className="text-[11px] text-charcoal-muted">Curriculum Mastery: {avg}%</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/teacher/student/${s.id}`)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-primary hover:text-white hover:border-primary text-xs font-semibold text-charcoal transition-all"
                  >
                    Inspect Profile
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
