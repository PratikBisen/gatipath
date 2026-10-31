import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../lib/db';
import { StudentTopicProgress, Attempt, Recommendation, TeacherIntervention, InterventionType } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { MasteryBadge } from '../../components/ui/MasteryBadge';
import { StatusPill } from '../../components/ui/StatusPill';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { detectRepeatedMisconceptions } from '../../engine/misconceptions';
import { MISCONCEPTIONS } from '../../data/curriculum/fractions';
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ClipboardList,
  Clock,
  Sparkles,
  PlusCircle,
  UserCheck,
  BookOpen,
  Compass,
  Award,
  ChevronRight,
  TrendingUp,
  Lightbulb
} from 'lucide-react';

export const StudentDetail: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const student = db.getStudent(studentId || 'student-aarav') || db.getStudents()[0];
  const topics = db.getTopics();

  const [activeTab, setActiveTab] = useState<'matrix' | 'attempts' | 'interventions' | 'misconceptions'>('matrix');
  const [progressList, setProgressList] = useState<StudentTopicProgress[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [interventions, setInterventions] = useState<TeacherIntervention[]>([]);

  // Intervention modal / form state
  const [showInterventionModal, setShowInterventionModal] = useState<boolean>(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('topic-3');
  const [interventionType, setInterventionType] = useState<InterventionType>('assign_remedial');
  const [interventionNote, setInterventionNote] = useState<string>('');

  const loadData = () => {
    setProgressList(db.getStudentProgress(student.id));
    setAttempts(db.getAttempts(student.id));
    setRecommendations(db.getRecommendations(student.id));
    setInterventions(db.getTeacherInterventions().filter(i => i.studentId === student.id));
  };

  useEffect(() => {
    loadData();
  }, [student.id]);

  const repeatedMisconceptions = detectRepeatedMisconceptions(attempts);
  const activeRecommendation = recommendations.find(r => r.status === 'active') || recommendations[0];

  const avgMastery = progressList.length > 0
    ? Math.round(progressList.reduce((acc, p) => acc + p.masteryScore, 0) / topics.length)
    : 0;

  const handleCreateIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interventionNote.trim()) return;

    db.createIntervention({
      teacherId: 'teacher-sunita',
      studentId: student.id,
      topicId: selectedTopicId,
      interventionType,
      interventionNote: interventionNote.trim(),
      status: 'pending'
    });

    setInterventionNote('');
    setShowInterventionModal(false);
    loadData();
    setActiveTab('interventions');
  };

  const handleToggleStatus = (interventionId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'in_progress' : 'completed';
    db.updateInterventionStatus(interventionId, nextStatus);
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/teacher/students')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-charcoal transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Student Roster</span>
      </button>

      {/* Student Profile Header Card */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar
            name={student.displayName}
            seed={student.avatarSeed}
            size="xl"
            status={avgMastery < 55 ? 'attention' : 'active'}
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-heading font-extrabold text-charcoal tracking-tight">
                {student.displayName}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-canvas-subtle text-charcoal-muted border border-border font-medium">
                Class {student.classLevel} · Section B
              </span>
              <MasteryBadge score={avgMastery} size="sm" />
            </div>
            <p className="text-xs text-charcoal-muted mt-1">
              {student.email} · Preferred Language: English · Registered Demo Student
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          <button
            onClick={() => setShowInterventionModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-2xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Assign Teacher Action</span>
          </button>
        </div>
      </div>

      {/* Diagnostic Callout: "What is this student struggling with & what should I do next?" */}
      {activeRecommendation && (
        <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-200/80 rounded-xl p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-primary text-white shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Diagnostic Summary & Actionable Recommendation
                </span>
                <h3 className="text-sm sm:text-base font-heading font-bold text-charcoal">
                  {activeRecommendation.title}
                </h3>
                <p className="text-xs text-charcoal-muted leading-relaxed max-w-3xl">
                  {activeRecommendation.explanation}
                </p>
                {activeRecommendation.misconceptionTag && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded mt-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Identified Error: {activeRecommendation.misconceptionTag.replace(/_/g, ' ')}</span>
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowInterventionModal(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-2xs transition-colors shrink-0"
            >
              <span>Assign This Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="border-b border-border flex items-center gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`py-3 px-3.5 font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'matrix'
              ? 'border-primary text-primary'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Topic Mastery Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('attempts')}
          className={`py-3 px-3.5 font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'attempts'
              ? 'border-primary text-primary'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Question Attempt Log ({attempts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('interventions')}
          className={`py-3 px-3.5 font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'interventions'
              ? 'border-primary text-primary'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Teacher Actions ({interventions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('misconceptions')}
          className={`py-3 px-3.5 font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'misconceptions'
              ? 'border-primary text-primary'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Misconceptions ({repeatedMisconceptions.length})</span>
        </button>
      </div>

      {/* TAB 1: Topic Mastery Matrix */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => {
            const prog = progressList.find((p) => p.topicId === topic.id);
            const score = prog ? prog.masteryScore : 0;
            const topicAttempts = attempts.filter((a) => a.topicId === topic.id);
            const isMastered = prog?.status === 'mastered';

            return (
              <Card key={topic.id} className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-canvas-subtle border border-border text-[11px] font-bold flex items-center justify-center text-charcoal">
                      {topic.sequenceOrder}
                    </span>
                    <h3 className="text-sm font-heading font-bold text-charcoal">
                      {topic.title}
                    </h3>
                  </div>
                  <MasteryBadge score={score} size="xs" />
                </div>

                <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed">
                  {topic.description}
                </p>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs text-charcoal-muted">
                    <span>Understanding Level</span>
                    <span className="font-bold text-charcoal tabular-nums">{score}%</span>
                  </div>
                  <ProgressBar value={score} target={85} size="sm" />
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-charcoal-muted">
                  <span>{topicAttempts.length} questions attempted</span>
                  <span className="capitalize font-medium">
                    Status: {prog?.status.replace(/_/g, ' ') || 'not started'}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* TAB 2: Attempt Log & Questions */}
      {activeTab === 'attempts' && (
        <Card>
          <CardHeader
            title="Question Attempt Log"
            subtitle="Chronological record of student responses, time taken, hint usage, and mathematical evaluations."
          />
          <div className="divide-y divide-border">
            {attempts.length === 0 ? (
              <div className="p-8 text-center text-xs text-charcoal-muted">
                No recorded attempts for this student yet.
              </div>
            ) : (
              attempts.map((att) => {
                const question = db.getQuestion(att.questionId);
                const topic = db.getTopic(att.topicId);

                return (
                  <div key={att.id} className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-charcoal-muted">
                      <span className="font-semibold text-charcoal">
                        {topic?.title || 'Practice Question'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{att.timeTakenSeconds}s</span>
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-medium text-charcoal">
                      {question?.questionText || 'Practice question'}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-[11px] ${
                          att.isCorrect
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {att.isCorrect ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Correct {att.hintUsed ? '(with hint · 70 pts)' : '(independent · 100 pts)'}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Incorrect</span>
                          </>
                        )}
                      </span>

                      {att.detectedMisconception && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 capitalize">
                          Flagged: {att.detectedMisconception.replace(/_/g, ' ')}
                        </span>
                      )}

                      <span className="text-[11px] text-charcoal-muted">
                        Submitted: {att.submittedAnswer.replace('opt-', 'Option ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}

      {/* TAB 3: Teacher Interventions */}
      {activeTab === 'interventions' && (
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Assigned Teacher Interventions"
              subtitle="Custom instructional actions assigned to this student."
              action={
                <button
                  onClick={() => setShowInterventionModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-2xs transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Assign Action</span>
                </button>
              }
            />

            <div className="divide-y divide-border">
              {interventions.length === 0 ? (
                <div className="p-8 text-center text-xs text-charcoal-muted">
                  No teacher interventions assigned to this student yet.
                </div>
              ) : (
                interventions.map((int) => {
                  const intTopic = db.getTopic(int.topicId);
                  const isCompleted = int.status === 'completed';

                  return (
                    <div
                      key={int.id}
                      className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        isCompleted ? 'bg-canvas-subtle/30 opacity-75' : 'bg-surface'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary capitalize text-xs">
                            {int.interventionType.replace(/_/g, ' ')}
                          </span>
                          <span className="text-charcoal-muted text-xs">·</span>
                          <span className="text-xs text-charcoal-muted">
                            Topic: {intTopic?.title || 'Fractions'}
                          </span>
                          <StatusPill status={int.status} size="xs" />
                        </div>

                        <p className="text-xs sm:text-sm text-charcoal font-medium">
                          {int.interventionNote}
                        </p>

                        <span className="text-[11px] text-charcoal-muted block">
                          Assigned: {new Date(int.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleStatus(int.id, int.status)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all shrink-0 self-start sm:self-center ${
                          isCompleted
                            ? 'bg-canvas border-border text-charcoal-muted hover:text-charcoal'
                            : 'bg-primary text-white border-transparent hover:bg-primary-hover shadow-2xs'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'Re-open' : 'Mark Completed'}</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: Detected Misconceptions */}
      {activeTab === 'misconceptions' && (
        <Card>
          <CardHeader
            title="Misconception Patterns"
            subtitle="System-flagged thinking errors identified across this student's response history."
          />
          <div className="divide-y divide-border">
            {repeatedMisconceptions.length === 0 ? (
              <div className="p-8 text-center text-xs text-charcoal-muted">
                No repeated misconception patterns recorded for this student.
              </div>
            ) : (
              repeatedMisconceptions.map((m) => {
                const meta = MISCONCEPTIONS[m.code];
                return (
                  <div key={m.code} className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-heading font-bold text-charcoal">
                        {meta?.name || m.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                        {m.count} {m.count === 1 ? 'instance' : 'instances'}
                      </span>
                    </div>

                    <p className="text-xs text-charcoal-muted leading-relaxed">
                      <span className="font-semibold text-charcoal">Why it happens: </span>
                      {meta?.whyItHappens}
                    </p>

                    <div className="p-3 rounded-lg bg-primary-subtle border border-primary/20 text-xs text-charcoal leading-relaxed">
                      <span className="font-semibold text-primary">Recommended Teacher Explanation: </span>
                      {meta?.remedialConcept}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}

      {/* Intervention Modal */}
      <Modal
        isOpen={showInterventionModal}
        onClose={() => setShowInterventionModal(false)}
        title={`Assign Intervention for ${student.displayName}`}
        subtitle="This action will be added to the student's learning profile and active recommendations."
      >
        <form onSubmit={handleCreateIntervention} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-charcoal mb-1">
              Target Curriculum Topic
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-canvas text-charcoal focus:border-primary outline-none"
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  Topic {t.sequenceOrder}: {t.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-charcoal mb-1">
              Intervention Strategy
            </label>
            <select
              value={interventionType}
              onChange={(e) => setInterventionType(e.target.value as InterventionType)}
              className="w-full p-2.5 rounded-lg border border-border bg-canvas text-charcoal focus:border-primary outline-none"
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
              value={interventionNote}
              onChange={(e) => setInterventionNote(e.target.value)}
              placeholder="e.g. Focus on visual fraction strips for 1/4 + 1/4 before attempting unlike denominators."
              className="w-full p-2.5 rounded-lg border border-border bg-canvas text-charcoal focus:border-primary outline-none leading-relaxed"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={() => setShowInterventionModal(false)}
              className="px-4 py-2 font-medium text-charcoal-muted hover:text-charcoal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover shadow-2xs"
            >
              Save & Notify Student
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
