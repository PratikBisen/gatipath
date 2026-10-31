import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../lib/db';
import { TeacherIntervention, InterventionType } from '../../types';
import {
  ClipboardList,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  X,
  User,
  BookOpen
} from 'lucide-react';

export const InterventionsList: React.FC = () => {
  const navigate = useNavigate();
  const students = db.getStudents();
  const topics = db.getTopics();

  const [interventions, setInterventions] = useState<TeacherIntervention[]>(() => {
    return db.getTeacherInterventions();
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showModal, setShowModal] = useState(false);

  // New intervention modal fields
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0]?.id || '');
  const [strategy, setStrategy] = useState<InterventionType>('assign_remedial');
  const [note, setNote] = useState('');

  const reload = () => {
    setInterventions(db.getTeacherInterventions());
  };

  const handleToggle = (id: string, current: string) => {
    const next = current === 'completed' ? 'in_progress' : 'completed';
    db.updateInterventionStatus(id, next);
    reload();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    db.createIntervention({
      teacherId: 'teacher-sunita',
      studentId: selectedStudentId,
      topicId: selectedTopicId,
      interventionType: strategy,
      interventionNote: note.trim(),
      status: 'pending'
    });

    setNote('');
    setShowModal(false);
    reload();
  };

  const filtered = interventions.filter((item) => {
    if (filter === 'pending') return item.status !== 'completed';
    if (filter === 'completed') return item.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Folio Masthead */}
      <section className="border-b border-[#E8E2D8] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#7A7265] mb-1.5">
            <span>Pedagogical Casebook</span>
            <span>·</span>
            <span>Teacher Sunita Verma</span>
            <span>·</span>
            <span>Class 7-B Mathematics</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1817]">
            Instructional Interventions Ledger
          </h1>
          <p className="text-sm sm:text-base text-[#5C5549] mt-2 max-w-2xl leading-relaxed">
            Record, track, and complete targeted pedagogical actions. Teachers remain the decisive authority while GatiPath identifies where support is needed.
          </p>
        </div>

        {/* Create Intervention Button */}
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1B4332] text-white hover:bg-[#112F23] text-xs font-semibold shrink-0 shadow-xs transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Instructional Action</span>
        </button>
      </section>

      {/* 2. Filter Toolbar */}
      <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3 text-xs font-mono">
        <div className="inline-flex rounded-lg border border-[#DCD5C9] bg-[#F7F3EB] p-0.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded transition-all ${
              filter === 'all'
                ? 'bg-white text-[#1A1817] font-bold shadow-xs'
                : 'text-[#6E675B] hover:text-[#1A1817]'
            }`}
          >
            All Actions ({interventions.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded transition-all ${
              filter === 'pending'
                ? 'bg-[#C57D36] text-white font-bold shadow-xs'
                : 'text-[#C57D36] hover:text-[#8C521E]'
            }`}
          >
            Active & Pending ({interventions.filter(i => i.status !== 'completed').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded transition-all ${
              filter === 'completed'
                ? 'bg-[#2D6A4F] text-white font-bold shadow-xs'
                : 'text-[#2D6A4F] hover:text-[#194030]'
            }`}
          >
            Completed ({interventions.filter(i => i.status === 'completed').length})
          </button>
        </div>

        <span className="font-mono text-[11px] text-[#7A7265] hidden sm:inline">
          Showing {filtered.length} entries
        </span>
      </div>

      {/* 3. Open Casebook Ledger */}
      <section className="bg-white rounded-xl border border-[#E0D8CC] shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#7A7265] space-y-2">
            <ClipboardList className="w-8 h-8 text-[#C2B7A7] mx-auto" />
            <p className="font-editorial text-base text-[#1A1817]">No interventions found in this view.</p>
            <p>Click "New Instructional Action" above to schedule targeted student guidance.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#EFEAE2]">
            {filtered.map((item) => {
              const student = students.find((s) => s.id === item.studentId);
              const topic = topics.find((t) => t.id === item.topicId);
              const isCompleted = item.status === 'completed';

              return (
                <div key={item.id} className="p-6 hover:bg-[#FAF8F5] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                    <div className="space-y-2 min-w-0">
                      {/* Scholar Info & Strategy */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-[#1A1817] text-[#FAF7F2] font-editorial font-bold text-xs flex items-center justify-center shrink-0">
                          {student?.displayName.split(' ').map(n => n[0]).join('') || 'S'}
                        </span>
                        <Link
                          to={`/teacher/student/${item.studentId}`}
                          className="font-editorial text-base font-bold text-[#1A1817] hover:text-[#1B4332] transition-colors"
                        >
                          {student?.displayName || 'Unknown Student'}
                        </Link>
                        <span className="font-mono text-[11px] text-[#7A7265]">
                          · {topic?.title || 'Fractions Module'}
                        </span>
                        <span className="font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#F4EFE6] text-[#4A453D]">
                          {item.interventionType.replace('_', ' ')}
                        </span>
                        <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isCompleted ? 'bg-[#E8F4EE] text-[#1B4332]' : 'bg-[#FAF1E4] text-[#C57D36]'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      {/* Teacher Notes */}
                      <p className="text-xs sm:text-sm text-[#5C5549] leading-relaxed pl-9">
                        {item.interventionNote}
                      </p>

                      <div className="pl-9 font-mono text-[10px] text-[#8C8377]">
                        Assigned on {new Date(item.createdAt).toLocaleDateString()} by Teacher Sunita Verma
                      </div>
                    </div>

                    {/* Action Toggle */}
                    <div className="shrink-0 sm:self-center pl-9 sm:pl-0 flex items-center gap-3">
                      <button
                        onClick={() => handleToggle(item.id, item.status)}
                        className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
                          isCompleted
                            ? 'border border-[#DCD5C9] bg-white text-[#5C5549] hover:bg-[#F2EDE4]'
                            : 'bg-[#1B4332] text-white hover:bg-[#112F23]'
                        }`}
                      >
                        {isCompleted ? 'Reopen Action' : 'Mark as Completed'}
                      </button>

                      <Link
                        to={`/teacher/student/${item.studentId}`}
                        className="p-1.5 text-[#7A7265] hover:text-[#1A1817]"
                        title="View student dossier"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal for creating a new intervention */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E0D8CC] shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <h3 className="font-editorial text-lg font-bold text-[#1A1817]">
                Record New Instructional Intervention
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#8C8377] hover:text-[#1A1817]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-mono uppercase text-[10px] text-[#7A7265] font-semibold block mb-1">
                  Target Scholar
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2.5 rounded border border-[#DCD5C9] bg-white text-[#1A1817] focus:outline-none"
                >
                  {students.map((s, idx) => (
                    <option key={s.id} value={s.id}>
                      {s.displayName} (Roll #{String(idx + 1).padStart(2, '0')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono uppercase text-[10px] text-[#7A7265] font-semibold block mb-1">
                  Target Curriculum Topic
                </label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full p-2.5 rounded border border-[#DCD5C9] bg-white text-[#1A1817] focus:outline-none"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      Module 0{t.sequenceOrder}: {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono uppercase text-[10px] text-[#7A7265] font-semibold block mb-1">
                  Pedagogical Strategy
                </label>
                <select
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value as InterventionType)}
                  className="w-full p-2.5 rounded border border-[#DCD5C9] bg-white text-[#1A1817] focus:outline-none"
                >
                  <option value="assign_remedial">Assign Remedial Practice Questions</option>
                  <option value="one_on_one">1-on-1 Concept Review</option>
                  <option value="peer_tutoring">Pair with Advanced Peer Buddy</option>
                  <option value="worksheet">Targeted Paper Worksheet</option>
                </select>
              </div>

              <div>
                <label className="font-mono uppercase text-[10px] text-[#7A7265] font-semibold block mb-1">
                  Teacher Notes / Action Plan
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Conduct a 5-minute chalkboard review on why denominators aren't added..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2.5 rounded border border-[#DCD5C9] bg-white text-[#1A1817] focus:outline-none placeholder-[#9C958C]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded border border-[#DCD5C9] text-[#5C5549] hover:bg-[#F4EFE6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#1B4332] text-white font-medium hover:bg-[#112F23]"
                >
                  Save Intervention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
