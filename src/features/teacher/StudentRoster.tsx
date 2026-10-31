import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/db';
import { MasteryBadge } from '../../components/ui/MasteryBadge';
import { Users, Search, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const StudentRoster: React.FC = () => {
  const navigate = useNavigate();

  const students = db.getStudents();
  const topics = db.getTopics();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'struggling' | 'mastered'>('all');

  const studentData = students.map(s => {
    const progs = db.getStudentProgress(s.id);
    const avg = progs.length > 0
      ? Math.round(progs.reduce((acc, p) => acc + p.masteryScore, 0) / topics.length)
      : 0;

    const attempts = db.getAttempts(s.id);
    const hasError = attempts.slice(0, 3).some(a => !a.isCorrect && a.detectedMisconception);
    const isStruggling = avg < 55 || hasError;

    return {
      student: s,
      avgMastery: avg,
      isStruggling,
      progs
    };
  });

  const filtered = studentData.filter(item => {
    const matchesSearch = item.student.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterMode === 'struggling') return item.isStruggling;
    if (filterMode === 'mastered') return item.avgMastery >= 75;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Class Roster</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal">
            Class 7-B Students ({students.length})
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Topic-wise mastery and individual learning profiles.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search student..."
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-borderSoft bg-white text-charcoal focus:border-primary outline-none w-44"
            />
          </div>

          <div className="inline-flex rounded-lg border border-borderSoft bg-canvas p-0.5 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'all' ? 'bg-white text-charcoal shadow-xs' : 'text-charcoal-muted'
              }`}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setFilterMode('struggling')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'struggling' ? 'bg-white text-rose-800 shadow-xs' : 'text-charcoal-muted'
              }`}
            >
              Needs Support
            </button>
            <button
              onClick={() => setFilterMode('mastered')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'mastered' ? 'bg-white text-emerald-800 shadow-xs' : 'text-charcoal-muted'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>
      </div>

      {/* Students Table / Grid */}
      <div className="bg-white rounded-xl border border-borderSoft shadow-card overflow-hidden">
        <div className="divide-y divide-borderSoft">
          {filtered.map(({ student, avgMastery, isStruggling, progs }) => (
            <div
              key={student.id}
              onClick={() => navigate(`/teacher/student/${student.id}`)}
              className="p-4 sm:p-5 hover:bg-canvas/50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-canvas border border-borderSoft text-charcoal font-heading font-bold text-sm flex items-center justify-center shrink-0">
                  {student.avatarSeed}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-charcoal">
                      {student.displayName}
                    </h3>
                    <MasteryBadge score={avgMastery} size="sm" />
                    {isStruggling && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Needs Attention</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    {student.email} · Class {student.classLevel}
                  </p>
                </div>
              </div>

              {/* Topic chips */}
              <div className="flex items-center gap-2 self-start md:self-center flex-wrap">
                {topics.map(t => {
                  const p = progs.find(item => item.topicId === t.id);
                  const score = p ? p.masteryScore : 0;
                  const isDone = p?.status === 'mastered';

                  return (
                    <div
                      key={t.id}
                      className="px-2.5 py-1 rounded bg-canvas border border-borderSoft text-[11px] flex items-center gap-1"
                      title={`${t.title}: ${score}%`}
                    >
                      <span className="font-semibold text-charcoal">T{t.sequenceOrder}:</span>
                      <span
                        className={
                          score >= 75
                            ? 'text-primary font-bold'
                            : score >= 50
                            ? 'text-amber-800 font-medium'
                            : 'text-charcoal-muted'
                        }
                      >
                        {score}%
                      </span>
                      {isDone && <CheckCircle2 className="w-3 h-3 text-primary" />}
                    </div>
                  );
                })}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/teacher/student/${student.id}`);
                  }}
                  className="p-1.5 rounded-lg border border-borderSoft hover:bg-white text-charcoal-muted hover:text-charcoal ml-2 shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
