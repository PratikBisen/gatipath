import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../lib/db';
import { StudentTopicProgress, Attempt, Recommendation, TeacherIntervention, InterventionType } from '../../types';
import { MasteryBadge } from '../../components/ui/MasteryBadge';
import { detectRepeatedMisconceptions } from '../../engine/misconceptions';
import { MISCONCEPTIONS } from '../../data/curriculum/fractions';
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ClipboardList,
  Clock,
  Sparkles,
  PlusCircle,
  UserCheck
} from 'lucide-react';

export const StudentDetail: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const student = db.getStudent(studentId || 'student-aarav') || db.getStudents()[0];
  const topics = db.getTopics();

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
  };

  const handleToggleStatus = (interventionId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'in_progress' : 'completed';
    db.updateInterventionStatus(interventionId, nextStatus);
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/teacher/students')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-charcoal transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Student Roster</span>
      </button>

      {/* Student Profile Header */}
      <div className="bg-white rounded-2xl border border-borderSoft p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-subtle text-primary font-heading font-bold text-xl flex items-center justify-center border border-primary/20 shrink-0">
            {student.avatarSeed}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-heading font-bold text-charcoal">
                {student.displayName}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-canvas text-charcoal-muted border border-borderSoft">
                Class {student.classLevel}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
              {student.email} · Preferred Language: English · Demo ID: {student.id}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowInterventionModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-sm self-start md:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Assign Teacher Intervention</span>
        </button>
      </div>

      {/* Active Diagnostic & Recommendation Box */}
      {activeRecommendation && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-primary/20 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-primary text-white shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Engine Diagnostic & Recommendation for Teacher Review
              </span>
              <h3 className="text-base font-bold text-charcoal">
                {activeRecommendation.title}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                {activeRecommendation.explanation}
              </p>
              {activeRecommendation.misconceptionTag && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-warning-light text-warning text-xs font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>
                    Detected Misconception Pattern: {activeRecommendation.misconceptionTag.replace(/_/g, ' ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid: Topic Mastery Breakdown + Misconceptions Detected */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Topic Mastery Status */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-heading font-bold text-charcoal">
            Topic-Wise Mastery Matrix
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topics.map(topic => {
              const prog = progressList.find(p => p.topicId === topic.id);
              const score = prog ? prog.masteryScore : 0;
              const isMastered = prog?.status === 'mastered';
              const attemptsCount = attempts.filter(a => a.topicId === topic.id).length;

              return (
                <div
                  key={topic.id}
                  className="bg-white rounded-xl border border-borderSoft p-5 shadow-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-charcoal-muted uppercase">
                      Topic {topic.sequenceOrder}
                    </span>
                    <MasteryBadge score={score} size="sm" />
                  </div>

                  <h4 className="text-sm font-bold text-charcoal">
                    {topic.title}
                  </h4>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-charcoal-muted">
                      <span>Understanding</span>
                      <span className="font-semibold text-charcoal">{score}%</span>
                    </div>
                    <div className="h-2 w-full bg-canvas rounded-full overflow-hidden border border-borderSoft">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(4, score)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] text-charcoal-muted pt-1 border-t border-borderSoft">
                    <span>{attemptsCount} questions attempted</span>
                    <span>Status: {prog?.status.replace(/_/g, ' ') || 'not started'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Question Attempt History */}
          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-heading font-bold text-charcoal">
              Detailed Question Attempt Log
            </h2>

            <div className="bg-white rounded-xl border border-borderSoft divide-y divide-borderSoft shadow-card overflow-hidden">
              {attempts.length === 0 ? (
                <p className="p-6 text-xs text-charcoal-muted text-center">
                  No recorded attempts for this student yet.
                </p>
              ) : (
                attempts.map(attempt => {
                  const question = db.getQuestion(attempt.questionId);
                  const topic = db.getTopic(attempt.topicId);

                  return (
                    <div key={attempt.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-charcoal-muted">
                        <span className="font-semibold text-charcoal">
                          {topic?.title || 'Question Attempt'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{attempt.timeTakenSeconds}s</span>
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-medium text-charcoal">
                        {question?.questionText || 'Practice question'}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded ${
                            attempt.isCorrect
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-rose-50 text-rose-800'
                          }`}
                        >
                          {attempt.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Correct {attempt.hintUsed ? '(Hint used)' : ''}</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Incorrect</span>
                            </>
                          )}
                        </span>

                        {attempt.detectedMisconception && (
                          <span className="px-2 py-0.5 rounded bg-warning-light text-warning font-medium">
                            Flagged: {attempt.detectedMisconception.replace(/_/g, ' ')}
                          </span>
                        )}

                        <span className="text-charcoal-muted text-[11px]">
                          Submitted answer: {attempt.submittedAnswer.replace('opt-', 'Option ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Teacher Interventions & Misconception Insights */}
        <div className="space-y-6">
          {/* Active Teacher Interventions */}
          <div className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-charcoal">
              Teacher Actions & Interventions
            </h2>

            <div className="bg-white rounded-xl border border-borderSoft p-4 shadow-card space-y-3">
              {interventions.length === 0 ? (
                <p className="text-xs text-charcoal-muted text-center py-4">
                  No active teacher interventions assigned.
                </p>
              ) : (
                interventions.map(int => {
                  const intTopic = db.getTopic(int.topicId);
                  const isCompleted = int.status === 'completed';

                  return (
                    <div
                      key={int.id}
                      className={`p-3 rounded-lg border text-xs space-y-2 transition-all ${
                        isCompleted
                          ? 'bg-canvas border-borderSoft opacity-75'
                          : 'bg-emerald-50/40 border-primary/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary capitalize">
                          {int.interventionType.replace(/_/g, ' ')}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isCompleted
                              ? 'bg-canvas text-charcoal-muted'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {int.status}
                        </span>
                      </div>

                      <p className="text-charcoal font-medium">
                        {int.interventionNote}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-borderSoft/60 text-[11px] text-charcoal-muted">
                        <span>Topic: {intTopic?.title || 'Fractions'}</span>
                        <button
                          onClick={() => handleToggleStatus(int.id, int.status)}
                          className="font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{isCompleted ? 'Mark Pending' : 'Mark Completed'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Detected Misconceptions Summary */}
          <div className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-charcoal">
              Detected Misconception Patterns
            </h2>

            <div className="bg-white rounded-xl border border-borderSoft p-4 shadow-card space-y-3">
              {repeatedMisconceptions.length === 0 ? (
                <p className="text-xs text-charcoal-muted text-center py-4">
                  No persistent misconceptions recorded.
                </p>
              ) : (
                repeatedMisconceptions.map(m => {
                  const meta = MISCONCEPTIONS[m.code];
                  return (
                    <div key={m.code} className="p-3 bg-canvas rounded-lg border border-borderSoft text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-charcoal">{meta?.name || m.name}</span>
                        <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded font-semibold text-[10px]">
                          {m.count} {m.count === 1 ? 'instance' : 'instances'}
                        </span>
                      </div>
                      <p className="text-charcoal-muted text-[11px] leading-relaxed">
                        {meta?.whyItHappens}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Intervention Modal */}
      {showInterventionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-borderSoft max-w-lg w-full p-6 shadow-floating space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-borderSoft">
              <h3 className="text-base font-heading font-bold text-charcoal">
                Assign Teacher Intervention for {student.displayName}
              </h3>
              <button
                onClick={() => setShowInterventionModal(false)}
                className="text-charcoal-muted hover:text-charcoal text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIntervention} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Target Curriculum Topic
                </label>
                <select
                  value={selectedTopicId}
                  onChange={e => setSelectedTopicId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-borderSoft bg-canvas text-charcoal focus:border-primary outline-none"
                >
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>
                      Topic {t.sequenceOrder}: {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Intervention Strategy
                </label>
                <select
                  value={interventionType}
                  onChange={e => setInterventionType(e.target.value as InterventionType)}
                  className="w-full text-xs p-2.5 rounded-lg border border-borderSoft bg-canvas text-charcoal focus:border-primary outline-none"
                >
                  <option value="assign_remedial">Assign Targeted Remedial Activity</option>
                  <option value="one_on_one">One-on-One Teacher Guidance Session</option>
                  <option value="peer_buddy">Pair with Peer Buddy for Guided Practice</option>
                  <option value="exempt">Advance to Next Challenge</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Teacher Guidance Note (Visible to Student)
                </label>
                <textarea
                  rows={3}
                  value={interventionNote}
                  onChange={e => setInterventionNote(e.target.value)}
                  placeholder="e.g., Focus on visual fraction strips for 1/4 + 1/4 before attempting unlike denominators."
                  className="w-full text-xs p-2.5 rounded-lg border border-borderSoft bg-canvas text-charcoal focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderSoft">
                <button
                  type="button"
                  onClick={() => setShowInterventionModal(false)}
                  className="px-4 py-2 text-xs font-medium text-charcoal-muted hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover shadow-sm"
                >
                  Save & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
