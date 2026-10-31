import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../lib/db';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { MasteryBadge } from '../../components/ui/MasteryBadge';
import { StatusPill } from '../../components/ui/StatusPill';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Avatar } from '../../components/ui/Avatar';
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Award,
  ArrowRight,
  ClipboardList,
  Clock,
  Sparkles,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  BarChart3
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();

  const teacher = db.getTeacher();
  const classRoom = db.getClassRoom();
  const students = db.getStudents();
  const topics = db.getTopics();

  // Compute live class statistics from persistent records
  const allProgress = students.flatMap(s => db.getStudentProgress(s.id));
  const allAttempts = students.flatMap(s => db.getAttempts(s.id));
  const allInterventions = db.getTeacherInterventions();
  const pendingInterventions = allInterventions.filter(i => i.status === 'pending');

  // Categorize students based on mastery and recent misconception events
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

    return {
      student: s,
      avgMastery,
      attemptsCount: sAttempts.length,
      needsAttention,
      recentFlaggedAttempt,
      activeRec,
      progressList: sProg
    };
  });

  const needingAttention = studentSummaries.filter(s => s.needsAttention);
  const progressingWell = studentSummaries.filter(s => !s.needsAttention);

  // Topic mastery averages
  const topicStats = topics.map(t => {
    const tProgs = allProgress.filter(p => p.topicId === t.id);
    const avgScore = tProgs.length > 0
      ? Math.round(tProgs.reduce((sum, p) => sum + p.masteryScore, 0) / tProgs.length)
      : 0;
    const strugglingCount = tProgs.filter(p => p.masteryScore < 60).length;

    return {
      topic: t,
      avgScore,
      strugglingCount,
      attemptsTotal: allAttempts.filter(a => a.topicId === t.id).length
    };
  });

  const mostChallengingTopic = [...topicStats].sort((a, b) => b.strugglingCount - a.strugglingCount)[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 7.1 Welcome & Classroom Context Header */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-subtle text-primary text-[11px] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Teacher Command · {classRoom.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-charcoal tracking-tight">
            Good morning, {teacher.displayName}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1 leading-relaxed max-w-2xl">
            Here is how your Class 7-B students are progressing in Mathematics fractions. {needingAttention.length} students have identified concept gaps requiring intervention.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/teacher/students')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-2xs transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Open Student Roster</span>
          </button>
          <button
            onClick={() => navigate('/teacher/interventions')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-canvas-subtle text-charcoal text-xs font-medium rounded-lg border border-border hover:bg-canvas transition-colors"
          >
            <ClipboardList className="w-4 h-4 text-charcoal-muted" />
            <span>
              Interventions ({pendingInterventions.length} pending)
            </span>
          </button>
        </div>
      </div>

      {/* 7.2 Key Performance Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Students Enrolled"
          value={students.length}
          subtext="Class 7-B Mathematics (100% active)"
          badge={{ text: 'Active Class', variant: 'info' }}
          icon={Users}
          variant="default"
          onClick={() => navigate('/teacher/students')}
        />

        <StatCard
          label="Need Guidance"
          value={needingAttention.length}
          subtext={`${needingAttention.length} students with flagged concept errors`}
          badge={{ text: 'Action Needed', variant: 'danger' }}
          icon={AlertTriangle}
          variant="danger"
          onClick={() => navigate('/teacher/students')}
        />

        <StatCard
          label="On Pace / Advanced"
          value={progressingWell.length}
          subtext="Demonstrating mastery & readiness for challenge"
          badge={{ text: 'On Target', variant: 'success' }}
          icon={TrendingUp}
          variant="success"
          onClick={() => navigate('/teacher/students')}
        />

        <StatCard
          label="Hardest Topic"
          value={mostChallengingTopic ? mostChallengingTopic.topic.title.replace(' of Fractions', '') : 'Addition'}
          subtext={`${mostChallengingTopic?.strugglingCount || 0} students currently below 60%`}
          badge={{ text: 'Curriculum Focus', variant: 'warning' }}
          icon={Award}
          variant="warning"
          onClick={() => navigate('/teacher/insights')}
        />
      </div>

      {/* Main Grid: Student Guidance (2 Cols) + Topic Mastery & Activity (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7.3 Students Requiring Teacher Guidance */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader
              title="Students Requiring Teacher Guidance"
              subtitle="Ranked by detected misconception patterns and prerequisite bottlenecks."
              action={
                <Link
                  to="/teacher/students"
                  className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
                >
                  <span>View All ({students.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              }
            />

            <div className="divide-y divide-border">
              {needingAttention.length === 0 ? (
                <div className="p-8 text-center text-xs text-charcoal-muted">
                  All students are currently progressing on pace.
                </div>
              ) : (
                needingAttention.map(({ student, avgMastery, recentFlaggedAttempt, activeRec }) => {
                  const errorTag = recentFlaggedAttempt?.detectedMisconception || activeRec?.misconceptionTag;
                  const readableError = errorTag ? errorTag.replace(/_/g, ' ') : null;

                  return (
                    <div
                      key={student.id}
                      className="p-5 hover:bg-canvas-subtle/50 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <Avatar
                          name={student.displayName}
                          seed={student.avatarSeed}
                          size="md"
                          status="attention"
                        />
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-heading font-bold text-charcoal">
                              {student.displayName}
                            </h4>
                            <span className="text-xs text-charcoal-muted">·</span>
                            <MasteryBadge score={avgMastery} size="xs" />
                            {readableError && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200/80 capitalize">
                                {readableError}
                              </span>
                            )}
                          </div>

                          {/* Full unclipped rationale */}
                          <p className="text-xs text-charcoal font-medium leading-relaxed">
                            {activeRec ? activeRec.title : 'Targeted Concept Support'}
                          </p>
                          <p className="text-xs text-charcoal-muted leading-relaxed">
                            {activeRec
                              ? activeRec.explanation
                              : 'Student requires teacher review for prerequisite concept mastery.'}
                          </p>

                          {/* Action Pill */}
                          <div className="pt-1 flex items-center gap-2">
                            <span className="text-[11px] text-charcoal-muted font-medium">
                              Suggested action:
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary-subtle px-2 py-0.5 rounded-md">
                              <Lightbulb className="w-3 h-3" />
                              <span>{activeRec?.suggestedActionLabel || 'Review Concept'}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="self-end md:self-start shrink-0 pt-1">
                        <button
                          onClick={() => navigate(`/teacher/student/${student.id}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-primary-subtle text-primary border border-primary/30 hover:border-primary text-xs font-semibold rounded-lg shadow-2xs transition-all"
                        >
                          <span>Inspect Profile</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <CardFooter>
              <span>Teachers retain full authority to assign or override remedial actions.</span>
              <button
                onClick={() => navigate('/teacher/interventions')}
                className="font-semibold text-primary hover:underline"
              >
                Manage Interventions
              </button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Col: 7.4 Class Topic Mastery + Live Student Activity Feed */}
        <div className="space-y-6">
          {/* Class Topic Mastery Card */}
          <Card>
            <CardHeader
              title="Class Topic Mastery"
              subtitle="Real curriculum performance across Class 7 fractions."
              action={
                <Link
                  to="/teacher/insights"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
                >
                  <span>Analytics</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              }
            />

            <CardContent className="space-y-4">
              {topicStats.map(({ topic, avgScore, strugglingCount, attemptsTotal }) => (
                <div key={topic.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-charcoal truncate max-w-[180px]">
                      {topic.sequenceOrder}. {topic.title}
                    </span>
                    <span className="font-bold text-charcoal tabular-nums">
                      {avgScore}%
                    </span>
                  </div>

                  <ProgressBar
                    value={avgScore}
                    target={85}
                    size="sm"
                    semantic={true}
                  />

                  <div className="flex justify-between items-center text-[10px] text-charcoal-muted">
                    <span>{attemptsTotal} student attempts</span>
                    <span className={strugglingCount > 0 ? 'text-amber-800 font-semibold' : 'text-charcoal-muted'}>
                      {strugglingCount} needing support
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>

            <CardFooter>
              <Link
                to="/teacher/insights"
                className="w-full text-center text-xs font-semibold text-primary hover:text-primary-hover flex items-center justify-center gap-1"
              >
                <span>View Full Diagnostic Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardFooter>
          </Card>

          {/* Real Recent Activity Stream */}
          <Card>
            <CardHeader
              title="Recent Student Activity"
              subtitle="Live chronological stream of classroom submissions."
            />

            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {allAttempts.slice(0, 4).map((att) => {
                  const student = students.find(s => s.id === att.studentId);
                  const topic = topics.find(t => t.id === att.topicId);

                  return (
                    <div key={att.id} className="p-3.5 px-5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                            att.isCorrect
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {att.isCorrect ? '✓' : '✗'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-charcoal truncate">
                            {student?.displayName || 'Student'}
                          </p>
                          <p className="text-[11px] text-charcoal-muted truncate">
                            {topic?.title || 'Fractions'} · {att.timeTakenSeconds}s
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          att.isCorrect
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}
                      >
                        {att.isCorrect ? (att.hintUsed ? 'With Hint' : 'Independent') : 'Incorrect'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
