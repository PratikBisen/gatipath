import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/db';
import { TeacherIntervention, InterventionType } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { StatusPill } from '../../components/ui/StatusPill';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import {
  ClipboardList,
  PlusCircle,
  UserCheck,
  ArrowRight,
  Sparkles,
  BookOpen,
  Clock,
  Filter
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

  const filtered = interventions.filter(i => {
    if (filter === 'pending') return i.status !== 'completed';
    if (filter === 'completed') return i.status === 'completed';
    return true;
  });

  const pendingCount = interventions.filter(i => i.status !== 'completed').length;
  const completedCount = interventions.filter(i => i.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-subtle text-primary text-[11px] font-semibold mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Targeted Instructional Interventions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-charcoal tracking-tight">
            Teacher Interventions Workflow
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1 leading-relaxed">
            Assign remedial practice, one-on-one sessions, or peer buddy activities to close prerequisite learning gaps.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-2xs transition-colors self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Intervention</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            filter === 'all'
              ? 'bg-charcoal text-white shadow-2xs'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-canvas'
          }`}
        >
          All Actions ({interventions.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
            filter === 'pending'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-canvas'
          }`}
        >
          <span>Pending / Active ({pendingCount})</span>
          {pendingCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />}
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            filter === 'completed'
              ? 'bg-primary text-white shadow-2xs'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-canvas'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Interventions Listing */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <div className="p-12 text-center text-xs text-charcoal-muted">
              No interventions recorded under this filter.
            </div>
          </Card>
        ) : (
          filtered.map(int => {
            const student = db.getStudent(int.studentId);
            const topic = db.getTopic(int.topicId);
            const isCompleted = int.status === 'completed';

            return (
              <Card
                key={int.id}
                className={`p-5 transition-all ${
                  isCompleted ? 'bg-canvas-subtle/30 opacity-80' : 'hover:border-primary/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <Avatar
                      name={student?.displayName || 'Student'}
                      seed={student?.avatarSeed}
                      size="md"
                      status={isCompleted ? 'active' : 'attention'}
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-heading font-bold text-charcoal">
                          {student?.displayName || 'Student'}
                        </h3>
                        <span className="text-charcoal-muted text-xs">·</span>
                        <span className="text-xs text-charcoal-muted font-medium">
                          {topic?.title || 'Fractions'}
                        </span>
                        <StatusPill status={int.status} size="xs" />
                      </div>

                      <p className="text-xs sm:text-sm text-charcoal font-medium leading-relaxed">
                        {int.interventionNote}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-charcoal-muted pt-1">
                        <span className="capitalize font-semibold text-primary">
                          Strategy: {int.interventionType.replace(/_/g, ' ')}
                        </span>
                        <span>·</span>
                        <span>Assigned: {new Date(int.createdAt).toLocaleDateString()}</span>
                        {int.completedAt && (
                          <>
                            <span>·</span>
                            <span>Completed: {new Date(int.completedAt).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                    <button
                      onClick={() => handleToggle(int.id, int.status)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        isCompleted
                          ? 'bg-canvas border-border text-charcoal-muted hover:text-charcoal'
                          : 'bg-primary text-white border-transparent hover:bg-primary-hover shadow-2xs'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{isCompleted ? 'Mark Pending' : 'Mark Completed'}</span>
                    </button>

                    <button
                      onClick={() => navigate(`/teacher/student/${int.studentId}`)}
                      className="p-1.5 rounded-lg border border-border bg-surface hover:bg-canvas text-charcoal-muted hover:text-charcoal transition-colors"
                      title="Inspect student profile"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* New Intervention Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Assign New Teacher Intervention"
        subtitle="Specify a customized remedial, 1-on-1, or buddy instructional action."
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-charcoal mb-1">Select Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-canvas text-charcoal outline-none focus:border-primary"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.displayName} (Class {s.classLevel})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-charcoal mb-1">Target Curriculum Topic</label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-canvas text-charcoal outline-none focus:border-primary"
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  Topic {t.sequenceOrder}: {t.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-charcoal mb-1">Intervention Strategy</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as InterventionType)}
              className="w-full p-2.5 rounded-lg border border-border bg-canvas text-charcoal outline-none focus:border-primary"
            >
              <option value="assign_remedial">Assign Targeted Remedial Activity</option>
              <option value="one_on_one">One-on-One Teacher Guidance Session</option>
              <option value="peer_buddy">Pair with Peer Buddy for Guided Practice</option>
              <option value="exempt">Advance to Next Challenge</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-charcoal mb-1">
              Teacher Instructions / Note (Visible to Student)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Focus on visual fraction strips for 1/4 + 1/4 before attempting unlike denominators."
              className="w-full p-2.5 rounded-lg border border-border bg-canvas text-charcoal outline-none focus:border-primary leading-relaxed"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 font-medium text-charcoal-muted hover:text-charcoal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover shadow-2xs"
            >
              Save Intervention
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
