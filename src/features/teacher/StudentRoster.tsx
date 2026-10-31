import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/db';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { MasteryBadge } from '../../components/ui/MasteryBadge';
import { StatusPill } from '../../components/ui/StatusPill';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Avatar } from '../../components/ui/Avatar';
import { SearchInput } from '../../components/ui/SearchInput';
import {
  Users,
  Search,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  PlusCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const StudentRoster: React.FC = () => {
  const navigate = useNavigate();

  const students = db.getStudents();
  const topics = db.getTopics();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'struggling' | 'mastered'>('all');

  const studentData = students.map((s, index) => {
    const progs = db.getStudentProgress(s.id);
    const avg = progs.length > 0
      ? Math.round(progs.reduce((acc, p) => acc + p.masteryScore, 0) / topics.length)
      : 0;

    const attempts = db.getAttempts(s.id);
    const hasError = attempts.slice(0, 3).some(a => !a.isCorrect && a.detectedMisconception);
    const isStruggling = avg < 55 || hasError;
    const isMastered = avg >= 75;

    let statusKey = 'developing';
    if (isStruggling) statusKey = 'needs_support';
    else if (isMastered) statusKey = 'mastered';
    else if (avg >= 65) statusKey = 'almost_mastered';

    return {
      student: s,
      rollNumber: index + 1,
      avgMastery: avg,
      statusKey,
      isStruggling,
      isMastered,
      attemptsCount: attempts.length,
      progs
    };
  });

  const strugglingCount = studentData.filter(s => s.isStruggling).length;
  const masteredCount = studentData.filter(s => s.isMastered).length;

  const filtered = studentData.filter(item => {
    const matchesSearch = item.student.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterMode === 'struggling') return item.isStruggling;
    if (filterMode === 'mastered') return item.isMastered;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-subtle text-primary text-[11px] font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Class 7-B Roster</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-charcoal tracking-tight">
            Student Performance Roster
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1 leading-relaxed">
            Monitor individual mastery, diagnose learning difficulties, and assign targeted teacher interventions.
          </p>
        </div>

        {/* Quick Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search student or email..."
            className="w-full sm:w-60"
          />

          <div className="inline-flex rounded-lg border border-border bg-canvas-subtle p-0.5 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                filterMode === 'all'
                  ? 'bg-surface text-charcoal shadow-2xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setFilterMode('struggling')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                filterMode === 'struggling'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200/60 shadow-2xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <span>Needs Support</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            </button>
            <button
              onClick={() => setFilterMode('mastered')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                filterMode === 'mastered'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-2xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <span>Advanced</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Student List / Table Card */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border bg-canvas-subtle/50 text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">
                <th className="py-3.5 px-5">Student Information</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Curriculum Mastery</th>
                <th className="py-3.5 px-4">Topic Progress</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-charcoal-muted">
                    No students match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map(({ student, rollNumber, avgMastery, statusKey, isStruggling, attemptsCount, progs }) => (
                  <tr
                    key={student.id}
                    onClick={() => navigate(`/teacher/student/${student.id}`)}
                    className="hover:bg-canvas-subtle/40 transition-colors cursor-pointer group"
                  >
                    {/* Student Info */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={student.displayName}
                          seed={student.avatarSeed}
                          size="md"
                          status={isStruggling ? 'attention' : 'none'}
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading font-bold text-sm text-charcoal group-hover:text-primary transition-colors">
                              {student.displayName}
                            </span>
                            <span className="text-[11px] text-charcoal-muted font-normal">
                              · Roll #{rollNumber}
                            </span>
                          </div>
                          <span className="text-[11px] text-charcoal-muted block">
                            {student.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusPill status={statusKey} size="sm" />
                    </td>

                    {/* Overall Mastery & Progress */}
                    <td className="py-4 px-4 min-w-[140px]">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-semibold text-charcoal tabular-nums">{avgMastery}%</span>
                          <span className="text-charcoal-muted">{attemptsCount} attempts</span>
                        </div>
                        <ProgressBar value={avgMastery} target={85} size="sm" />
                      </div>
                    </td>

                    {/* Topic Progress Chips */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {topics.map(t => {
                          const p = progs.find(item => item.topicId === t.id);
                          const score = p ? p.masteryScore : 0;
                          const isDone = p?.status === 'mastered';

                          return (
                            <div
                              key={t.id}
                              className={`px-2 py-0.5 rounded text-[11px] font-medium border flex items-center gap-1 ${
                                isDone
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : score >= 50
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-canvas text-charcoal-muted border-border'
                              }`}
                              title={`${t.title}: ${score}%`}
                            >
                              <span className="font-semibold text-[10px]">T{t.sequenceOrder}</span>
                              <span className="tabular-nums font-bold">{score}%</span>
                              {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/teacher/student/${student.id}`);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-primary hover:text-white hover:border-primary text-xs font-semibold text-charcoal transition-all shadow-2xs"
                      >
                        <span>Profile</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
