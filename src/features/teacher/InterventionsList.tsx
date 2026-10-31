import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/db';
import { TeacherIntervention, InterventionType } from '../../types';
import { ClipboardList, PlusCircle, CheckCircle2, Clock, UserCheck, ArrowRight } from 'lucide-react';

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

  const filtered = interventions.filter(i => {
    if (filter === 'pending') return i.status !== 'completed';
    if (filter === 'completed') return i.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-semibold mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Targeted Support Workflow</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal">
            Teacher Interventions
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Assign custom remedial activities, one-on-one sessions, or buddy guidance to students needing support.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-sm self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Intervention</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-borderSoft pb-3 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-charcoal text-white' : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          All Actions ({interventions.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filter === 'pending' ? 'bg-amber-600 text-white' : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          Active / Pending ({interventions.filter(i => i.status !== 'completed').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filter === 'completed' ? 'bg-primary text-white' : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          Completed ({interventions.filter(i => i.status === 'completed').length})
        </button>
      </div>

      {/* Interventions List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-borderSoft p-12 text-center">
            <p className="text-sm text-charcoal-muted">No interventions matching this filter.</p>
          </div>
        ) : (
          filtered.map(int => {
            const student = db.getStudent(int.studentId);
            const topic = db.getTopic(int.topicId);
            const isCompleted = int.status === 'completed';

            return (
              <div
                key={int.id}
                className={`bg-white rounded-xl border p-5 shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCompleted ? 'border-borderSoft opacity-80' : 'border-primary/30'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-charcoal">
                      {student?.displayName || 'Student'}
                    </span>
                    <span className="text-xs text-charcoal-muted">·</span>
                    <span className="text-xs text-charcoal-muted">
                      {topic?.title || 'Fractions'}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        isCompleted
                          ? 'bg-canvas text-charcoal-muted border border-borderSoft'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {int.status}
                    </span>
                  </div>

                  <p className="text-sm text-charcoal font-medium">
                    {int.interventionNote}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-charcoal-muted">
                    <span className="capitalize font-semibold text-primary">
                      Strategy: {int.interventionType.replace(/_/g, ' ')}
                    </span>
                    <span>·</span>
                    <span>Created: {new Date(int.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleToggle(int.id, int.status)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      isCompleted
                        ? 'bg-canvas border-borderSoft text-charcoal hover:bg-white'
                        : 'bg-primary text-white border-transparent hover:bg-primary-hover shadow-sm'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{isCompleted ? 'Re-open' : 'Mark Completed'}</span>
                  </button>

                  <button
                    onClick={() => navigate(`/teacher/student/${int.studentId}`)}
                    className="p-1.5 rounded-lg border border-borderSoft hover:bg-canvas text-charcoal-muted hover:text-charcoal"
                    title="Inspect student profile"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-borderSoft max-w-lg w-full p-6 shadow-floating space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-borderSoft">
              <h3 className="text-base font-heading font-bold text-charcoal">
                Assign New Intervention
              </h3>
              <button onClick={() => setShowModal(false)} className="text-charcoal-muted text-xs">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-borderSoft bg-canvas text-charcoal outline-none focus:border-primary"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.displayName} (Class {s.classLevel})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Target Topic</label>
                <select
                  value={selectedTopicId}
                  onChange={e => setSelectedTopicId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-borderSoft bg-canvas text-charcoal outline-none focus:border-primary"
                >
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>Topic {t.sequenceOrder}: {t.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Intervention Type</label>
                <select
                  value={strategy}
                  onChange={e => setStrategy(e.target.value as InterventionType)}
                  className="w-full text-xs p-2.5 rounded-lg border border-borderSoft bg-canvas text-charcoal outline-none focus:border-primary"
                >
                  <option value="assign_remedial">Assign Targeted Remedial Activity</option>
                  <option value="one_on_one">One-on-One Teacher Guidance Session</option>
                  <option value="peer_buddy">Pair with Peer Buddy for Guided Practice</option>
                  <option value="exempt">Advance to Next Challenge</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Teacher Instructions / Note</label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="e.g., Focus on visual fraction strips for 1/4 + 1/4 before attempting unlike denominators."
                  className="w-full text-xs p-2.5 rounded-lg border border-borderSoft bg-canvas text-charcoal outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderSoft">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-medium text-charcoal-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover shadow-sm"
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
