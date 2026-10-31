import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../lib/db';
import {
  Search,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  User,
  SlidersHorizontal,
  X
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

    return {
      student: s,
      rollNumber: String(index + 1).padStart(2, '0'),
      avgMastery: avg,
      isStruggling,
      isMastered,
      attemptsCount: attempts.length,
      progs
    };
  });

  const strugglingCount = studentData.filter(s => s.isStruggling).length;
  const masteredCount = studentData.filter(s => s.isMastered).length;

  const filteredStudents = studentData.filter(({ student, isStruggling, isMastered }) => {
    const matchesSearch =
      student.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === 'struggling') return isStruggling;
    if (filterMode === 'mastered') return isMastered;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Folio Masthead */}
      <section className="border-b border-[#E8E2D8] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#7A7265] mb-1.5">
            <span>Scholar Ledger</span>
            <span>·</span>
            <span>Class 7-B Mathematics</span>
            <span>·</span>
            <span>10 Scholars Registered</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1817]">
            Individual Student Ledger
          </h1>
          <p className="text-sm sm:text-base text-[#5C5549] mt-2 max-w-2xl leading-relaxed">
            Examine individual topic mastery, assessment readiness, and misconception records. Click any row to open the student's complete diagnostic dossier.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C8377] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-8 py-2 text-xs rounded-lg border border-[#DCD5C9] bg-white text-[#1A1817] placeholder-[#9C958C] focus:outline-none focus:border-[#1A1817] w-full sm:w-56 transition-colors shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C8377] hover:text-[#1A1817]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="inline-flex rounded-lg border border-[#DCD5C9] bg-[#F7F3EB] p-0.5 text-xs font-mono">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded transition-all ${
                filterMode === 'all'
                  ? 'bg-white text-[#1A1817] font-bold shadow-xs'
                  : 'text-[#6E675B] hover:text-[#1A1817]'
              }`}
            >
              All ({studentData.length})
            </button>
            <button
              onClick={() => setFilterMode('struggling')}
              className={`px-3 py-1.5 rounded transition-all ${
                filterMode === 'struggling'
                  ? 'bg-[#8C2828] text-white font-bold shadow-xs'
                  : 'text-[#8C2828] hover:text-[#5C1616]'
              }`}
            >
              Needs Attention ({strugglingCount})
            </button>
            <button
              onClick={() => setFilterMode('mastered')}
              className={`px-3 py-1.5 rounded transition-all ${
                filterMode === 'mastered'
                  ? 'bg-[#2D6A4F] text-white font-bold shadow-xs'
                  : 'text-[#2D6A4F] hover:text-[#194030]'
              }`}
            >
              Advanced ({masteredCount})
            </button>
          </div>
        </div>
      </section>

      {/* 2. Refined Academic Ledger Table */}
      <section className="bg-white rounded-xl border border-[#E0D8CC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D8] bg-[#FAF7F2] font-mono text-[10px] uppercase tracking-wider text-[#7A7265]">
                <th className="py-3.5 px-4 font-semibold">Roll</th>
                <th className="py-3.5 px-4 font-semibold">Scholar Identity</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-3 font-semibold text-center">01 Concept</th>
                <th className="py-3.5 px-3 font-semibold text-center">02 Like Frac</th>
                <th className="py-3.5 px-3 font-semibold text-center">03 Unlike Frac</th>
                <th className="py-3.5 px-3 font-semibold text-center">04 Mult/Div</th>
                <th className="py-3.5 px-4 font-semibold text-right">Mastery</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEAE2]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#7A7265] text-xs">
                    No scholars found matching your search.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(({ student, rollNumber, avgMastery, isStruggling, isMastered, progs }) => {
                  const getTopicScore = (seq: number) => {
                    const p = progs.find(pr => pr.topicId === `topic-${seq}`);
                    return p ? p.masteryScore : 0;
                  };

                  return (
                    <tr
                      key={student.id}
                      onClick={() => navigate(`/teacher/student/${student.id}`)}
                      className="hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                    >
                      {/* Roll */}
                      <td className="py-4 px-4 font-mono text-xs text-[#8C8377] font-semibold">
                        {rollNumber}
                      </td>

                      {/* Scholar Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-[#1A1817] text-[#FAF7F2] font-editorial font-bold text-xs flex items-center justify-center shrink-0">
                            {student.displayName.split(' ').map(n => n[0]).join('')}
                          </span>
                          <div>
                            <div className="font-editorial text-sm font-bold text-[#1A1817] group-hover:text-[#1B4332] transition-colors">
                              {student.displayName}
                            </div>
                            <div className="font-mono text-[10px] text-[#7A7265]">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {isStruggling ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FEEBEB] text-[#8C2828]">
                            Needs Attention
                          </span>
                        ) : isMastered ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E8F4EE] text-[#2D6A4F]">
                            Advanced
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F4EFE6] text-[#6E675B]">
                            On Track
                          </span>
                        )}
                      </td>

                      {/* Topic 1-4 Mini Indicators */}
                      {[1, 2, 3, 4].map(seq => {
                        const score = getTopicScore(seq);
                        return (
                          <td key={seq} className="py-4 px-3 text-center">
                            <span
                              className={`font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                                score >= 80
                                  ? 'bg-[#E8F4EE] text-[#1B4332]'
                                  : score >= 50
                                  ? 'bg-[#FAF1E4] text-[#C57D36]'
                                  : score > 0
                                  ? 'bg-[#FEEBEB] text-[#8C2828]'
                                  : 'text-[#A39B8F]'
                              }`}
                            >
                              {score}%
                            </span>
                          </td>
                        );
                      })}

                      {/* Overall Mastery */}
                      <td className="py-4 px-4 text-right">
                        <span className="font-mono font-bold text-sm text-[#1A1817]">
                          {avgMastery}%
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#1B4332] group-hover:translate-x-0.5 transition-transform">
                          <span>Dossier</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
