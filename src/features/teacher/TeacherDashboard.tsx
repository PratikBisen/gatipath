import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../lib/db';
import { MasteryBadge } from '../../components/ui/MasteryBadge';
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Award,
  ArrowRight,
  ClipboardList,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();

  const teacher = db.getTeacher();
  const classRoom = db.getClassRoom();
  const students = db.getStudents();
  const topics = db.getTopics();

  // Compute actual class statistics from persistent records
  const allProgress = students.flatMap(s => db.getStudentProgress(s.id));
  const allAttempts = students.flatMap(s => db.getAttempts(s.id));
  const allInterventions = db.getTeacherInterventions();

  // Categorize students
  const studentSummaries = students.map(s => {
    const sProg = db.getStudentProgress(s.id);
    const avgMastery = sProg.length > 0
      ? Math.round(sProg.reduce((sum, p) => sum + p.masteryScore, 0) / topics.length)
      : 0;

    const sAttempts = db.getAttempts(s.id);
    const hasRecentErrors = sAttempts.slice(0, 3).some(a => !a.isCorrect && a.detectedMisconception);
    const needsAttention = avgMastery < 55 || hasRecentErrors;

    return {
      student: s,
      avgMastery,
      attemptsCount: sAttempts.length,
      needsAttention,
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
      strugglingCount
    };
  });

  const mostChallengingTopic = [...topicStats].sort((a, b) => b.strugglingCount - a.strugglingCount)[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Teacher Welcome Header */}
      <div className="bg-white rounded-2xl border border-borderSoft p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Teacher Command · {classRoom.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal">
            Welcome, Teacher {teacher.displayName}
          </h1>
          <p className="text-sm sm:text-base text-charcoal-muted mt-1">
            Real-time diagnostic overview of Class 7-B. Teachers remain in the driver's seat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/teacher/students')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-sm"
          >
            <Users className="w-4 h-4" />
            <span>Open Student Roster</span>
          </button>
          <button
            onClick={() => navigate('/teacher/interventions')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-canvas text-charcoal text-xs font-medium rounded-lg border border-borderSoft hover:bg-white"
          >
            <ClipboardList className="w-4 h-4 text-charcoal-muted" />
            <span>View Interventions ({allInterventions.filter(i => i.status === 'pending').length})</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-xl border border-borderSoft shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
              Enrolled Students
            </span>
            <span className="block text-2xl font-bold font-heading text-charcoal mt-1">
              {students.length}
            </span>
            <span className="text-[11px] text-charcoal-muted">Class 7-B Mathematics</span>
          </div>
          <div className="p-3 bg-canvas rounded-xl text-primary border border-borderSoft">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Needing Support */}
        <div className="bg-white p-5 rounded-xl border border-rose-200/60 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
              Needing Support
            </span>
            <span className="block text-2xl font-bold font-heading text-rose-700 mt-1">
              {needingAttention.length}
            </span>
            <span className="text-[11px] text-charcoal-muted">Prerequisite or concept gaps</span>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-700 border border-rose-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Progressing Well */}
        <div className="bg-white p-5 rounded-xl border border-emerald-200/60 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              On Pace / Advanced
            </span>
            <span className="block text-2xl font-bold font-heading text-emerald-700 mt-1">
              {progressingWell.length}
            </span>
            <span className="text-[11px] text-charcoal-muted">Meeting or exceeding targets</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700 border border-emerald-200">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Top Concept Gap */}
        <div className="bg-white p-5 rounded-xl border border-borderSoft shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
              Most Challenging Topic
            </span>
            <span className="block text-base font-bold font-heading text-charcoal mt-1 truncate max-w-[150px]">
              {mostChallengingTopic ? mostChallengingTopic.topic.title : 'Addition & Subtraction'}
            </span>
            <span className="text-[11px] text-amber-800">
              {mostChallengingTopic?.strugglingCount || 0} students below 60%
            </span>
          </div>
          <div className="p-3 bg-canvas rounded-xl text-accent border border-borderSoft">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Students Needing Attention & Topic Mastery Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Needing Attention Action Roster */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-heading font-bold text-charcoal">
                Students Requiring Teacher Guidance
              </h2>
              <p className="text-xs text-charcoal-muted">
                Identified based on repeated mistake patterns and prerequisite bottlenecks.
              </p>
            </div>
            <Link
              to="/teacher/students"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All Students</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {needingAttention.map(({ student, avgMastery, progressList }) => {
              const activeRec = db.getRecommendations(student.id)[0];
              const recentMistake = db.getAttempts(student.id).find(a => !a.isCorrect && a.detectedMisconception);

              return (
                <div
                  key={student.id}
                  className="bg-white rounded-xl border border-borderSoft p-4 hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-canvas text-charcoal font-bold text-xs flex items-center justify-center border border-borderSoft shrink-0">
                      {student.avatarSeed}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-charcoal">
                          {student.displayName}
                        </h4>
                        <MasteryBadge score={avgMastery} size="sm" />
                      </div>
                      <p className="text-xs text-rose-800 font-medium mt-0.5">
                        {recentMistake
                          ? `Flagged: ${recentMistake.detectedMisconception?.replace(/_/g, ' ')}`
                          : activeRec?.title || 'Needs practice support'}
                      </p>
                      <p className="text-[11px] text-charcoal-muted mt-0.5 line-clamp-1">
                        {activeRec ? activeRec.explanation : 'Recommended for teacher intervention review.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => navigate(`/teacher/student/${student.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
                    >
                      <span>Inspect Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Topic-wise Class Performance */}
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-bold text-charcoal">
            Class Topic Mastery
          </h2>

          <div className="bg-white rounded-xl border border-borderSoft p-5 shadow-card space-y-4">
            {topicStats.map(({ topic, avgScore, strugglingCount }) => (
              <div key={topic.id} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-charcoal truncate max-w-[170px]">
                    {topic.sequenceOrder}. {topic.title}
                  </span>
                  <span className="font-semibold text-charcoal">{avgScore}%</span>
                </div>
                <div className="h-2 w-full bg-canvas rounded-full overflow-hidden border border-borderSoft">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      avgScore >= 75
                        ? 'bg-primary'
                        : avgScore >= 55
                        ? 'bg-amber-600'
                        : 'bg-rose-600'
                    }`}
                    style={{ width: `${Math.max(4, avgScore)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-charcoal-muted">
                  <span>Class average</span>
                  <span>{strugglingCount} students needing help</span>
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-borderSoft">
              <Link
                to="/teacher/insights"
                className="text-xs font-semibold text-primary hover:underline flex items-center justify-center gap-1"
              >
                <span>View Full Class Diagnostics & Charts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
