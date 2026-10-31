import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../../lib/db';
import { StudentTopicProgress, Attempt, Recommendation, TeacherIntervention, InterventionType } from '../../types';
import { detectRepeatedMisconceptions } from '../../engine/misconceptions';
import { ENGINE_CONFIG } from '../../engine/config';
import { MISCONCEPTIONS } from '../../data/curriculum/fractions';
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  PlusCircle,
  BookOpen,
  Award,
  ChevronRight,
  X,
  FileText
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

  // Intervention modal state
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Folio Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-4">
        <Link
          to="/teacher/students"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#5C5549] hover:text-[#1A1817] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Scholar Ledger</span>
        </Link>
        <span className="font-mono text-[11px] text-[#7A7265]">
          Scholar Dossier · Ref ID #{student.id}
        </span>
      </div>

      {/* 2. Scholar Dossier Header */}
      <section className="bg-white rounded-xl border border-[#E0D8CC] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="w-14 h-14 rounded-full bg-[#1A1817] text-[#FAF7F2] font-editorial font-bold text-2xl flex items-center justify-center shrink-0">
              {student.displayName.split(' ').map(n => n[0]).join('')}
            </span>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1A1817]">
                  {student.displayName}
                </h1>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#F4EFE6] text-[#5C5549] font-semibold">
                  Roll #{String(topics.length > 0 ? (db.getStudents().findIndex(st => st.id === student.id) + 1) : 1).padStart(2, '0')}
                </span>
                <span className={`font-mono text-xs px-2 py-0.5 rounded font-semibold ${
                  avgMastery >= 75
                    ? 'bg-[#E8F4EE] text-[#1B4332]'
                    : avgMastery < 55
                    ? 'bg-[#FEEBEB] text-[#8C2828]'
                    : 'bg-[#FAF1E4] text-[#C57D36]'
                }`}>
                  {avgMastery >= 75 ? 'Advanced' : avgMastery < 55 ? 'Requires Attention' : 'Developing'}
                </span>
              </div>
              <p className="font-mono text-xs text-[#7A7265]">
                {student.email} · Class 7-B Mathematics · {attempts.length} Logged Practice Attempts
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowInterventionModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1B4332] text-white hover:bg-[#112F23] text-xs font-semibold transition-all shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Assign Teacher Intervention</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Rationale Callout */}
        {activeRecommendation && (
          <div className="p-5 rounded-lg bg-[#FAF7F2] border border-[#E6DFD3] space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-[#C57D36] font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>Diagnostic Finding & Recommended Next Step</span>
            </div>
            <div className="font-editorial text-lg font-bold text-[#1A1817]">
              {activeRecommendation.title}
            </div>
            <p className="text-xs sm:text-sm text-[#5C5549] leading-relaxed">
              {activeRecommendation.explanation}
            </p>
          </div>
        )}
      </section>

      {/* 3. Dossier Navigation Tabs */}
      <div className="border-b border-[#E8E2D8] flex items-center gap-4 text-xs font-mono">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`py-2.5 px-3 border-b-2 font-semibold transition-colors ${
            activeTab === 'matrix'
              ? 'border-[#1A1817] text-[#1A1817]'
              : 'border-transparent text-[#7A7265] hover:text-[#1A1817]'
          }`}
        >
          01 Concept Mastery Matrix
        </button>
        <button
          onClick={() => setActiveTab('misconceptions')}
          className={`py-2.5 px-3 border-b-2 font-semibold transition-colors ${
            activeTab === 'misconceptions'
              ? 'border-[#1A1817] text-[#1A1817]'
              : 'border-transparent text-[#7A7265] hover:text-[#1A1817]'
          }`}
        >
          02 Misconception Evidence ({repeatedMisconceptions.length})
        </button>
        <button
          onClick={() => setActiveTab('interventions')}
          className={`py-2.5 px-3 border-b-2 font-semibold transition-colors ${
            activeTab === 'interventions'
              ? 'border-[#1A1817] text-[#1A1817]'
              : 'border-transparent text-[#7A7265] hover:text-[#1A1817]'
          }`}
        >
          03 Interventions ({interventions.length})
        </button>
        <button
          onClick={() => setActiveTab('attempts')}
          className={`py-2.5 px-3 border-b-2 font-semibold transition-colors ${
            activeTab === 'attempts'
              ? 'border-[#1A1817] text-[#1A1817]'
              : 'border-transparent text-[#7A7265] hover:text-[#1A1817]'
          }`}
        >
          04 Attempt Chronology ({attempts.length})
        </button>
      </div>

      {/* 4. Tab Content */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((topic) => {
            const prog = progressList.find(p => p.topicId === topic.id);
            const score = prog ? prog.masteryScore : 0;
            const isMastered = prog?.status === 'mastered';

            return (
              <div key={topic.id} className="bg-white rounded-xl border border-[#E0D8CC] p-6 space-y-4 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-semibold text-[#8C8377]">
                      Module 0{topic.sequenceOrder}
                    </span>
                    <h3 className="font-editorial text-lg font-bold text-[#1A1817]">
                      {topic.title}
                    </h3>
                  </div>
                  <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                    score >= ENGINE_CONFIG.THRESHOLDS.MASTERED ? 'bg-[#E8F4EE] text-[#1B4332]' : 'bg-[#FAF1E4] text-[#C57D36]'
                  }`}>
                    {score}% Mastery
                  </span>
                </div>

                <p className="text-xs text-[#5C5549] leading-relaxed">
                  {topic.description}
                </p>

                <div className="pt-2 border-t border-[#EFEAE2] flex items-center justify-between text-xs font-mono text-[#7A7265]">
                  <span>Status: <strong className="text-[#1A1817]">{prog ? prog.status.replace('_', ' ') : 'Not Started'}</strong></span>
                  <span>Attempts: {prog ? prog.totalAttempts : 0}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'misconceptions' && (
        <div className="bg-white rounded-xl border border-[#E0D8CC] p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E8E2D8] pb-3">
            <h3 className="font-editorial text-lg font-bold text-[#1A1817]">
              Detected Misconception Patterns
            </h3>
            <p className="text-xs text-[#7A7265] mt-0.5">
              Deterministic rule matches identified from student answer inputs.
            </p>
          </div>

          {repeatedMisconceptions.length === 0 ? (
            <p className="text-xs text-[#7A7265] py-8 text-center">No recurring misconceptions detected for this student.</p>
          ) : (
            <div className="space-y-4">
              {repeatedMisconceptions.map(({ code, count, name }) => {
                const misc = MISCONCEPTIONS[code];
                return (
                  <div key={code} className="p-4 rounded-lg bg-[#FFF5F5] border border-[#FCD4D4] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-editorial text-base font-bold text-[#8C2828]">
                        {name}
                      </span>
                      <span className="font-mono text-xs text-[#8C2828] bg-white px-2 py-0.5 rounded border border-[#FCD4D4]">
                        Triggered {count} times
                      </span>
                    </div>
                    <p className="text-xs text-[#5C5549] leading-relaxed">
                      {misc ? misc.description : 'Misconception identified in attempts.'}
                    </p>
                    {misc && (
                      <div className="p-2.5 bg-white rounded text-xs text-[#4A453D]">
                        <strong className="text-[#1A1817]">Pedagogical Remedy: </strong>
                        <span>{misc.remedialConcept}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'interventions' && (
        <div className="bg-white rounded-xl border border-[#E0D8CC] p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E8E2D8] pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-editorial text-lg font-bold text-[#1A1817]">
                Teacher Instructional Interventions
              </h3>
              <p className="text-xs text-[#7A7265] mt-0.5">
                Actions assigned by teacher Sunita to guide this student.
              </p>
            </div>
            <button
              onClick={() => setShowInterventionModal(true)}
              className="px-3 py-1.5 rounded bg-[#1B4332] text-white text-xs font-medium hover:bg-[#112F23]"
            >
              + Add Intervention
            </button>
          </div>

          {interventions.length === 0 ? (
            <p className="text-xs text-[#7A7265] py-8 text-center">No interventions currently recorded for this student.</p>
          ) : (
            <div className="divide-y divide-[#EFEAE2]">
              {interventions.map((item) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-editorial font-bold text-sm text-[#1A1817] capitalize">
                        {item.interventionType.replace('_', ' ')}
                      </span>
                      <span className={`font-mono text-[10px] px-2 py-0.2 rounded font-semibold ${
                        item.status === 'completed'
                          ? 'bg-[#E8F4EE] text-[#1B4332]'
                          : 'bg-[#FAF1E4] text-[#C57D36]'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C5549]">{item.interventionNote}</p>
                    <span className="font-mono text-[10px] text-[#8C8377]">
                      Assigned on: {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(item.id, item.status)}
                    className="px-3 py-1.5 rounded border border-[#DCD5C9] bg-[#FAF7F2] hover:bg-[#F2EDE4] text-xs font-semibold text-[#1A1817] shrink-0"
                  >
                    {item.status === 'completed' ? 'Reopen Action' : 'Mark Completed'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'attempts' && (
        <div className="bg-white rounded-xl border border-[#E0D8CC] p-6 shadow-xs space-y-4">
          <div className="border-b border-[#E8E2D8] pb-3">
            <h3 className="font-editorial text-lg font-bold text-[#1A1817]">
              Chronological Question Attempts
            </h3>
            <p className="text-xs text-[#7A7265] mt-0.5">
              Every practice attempt recorded in LocalStorage with evaluation metrics.
            </p>
          </div>

          <div className="divide-y divide-[#EFEAE2]">
            {attempts.map((attempt) => (
              <div key={attempt.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-medium text-[#1A1817]">
                    Question #{attempt.questionId}
                  </div>
                  <div className="text-[11px] text-[#5C5549] font-mono">
                    Answer: <code>{attempt.submittedAnswer}</code> · Hints used: {attempt.hintUsed ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded ${
                    attempt.isCorrect ? 'bg-[#E8F4EE] text-[#1B4332]' : 'bg-[#FEEBEB] text-[#8C2828]'
                  }`}>
                    {attempt.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                  <div className="font-mono text-[10px] text-[#8C8377] mt-0.5">
                    {new Date(attempt.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for creating a new intervention */}
      {showInterventionModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E0D8CC] shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <h3 className="font-editorial text-lg font-bold text-[#1A1817]">
                Assign Teacher Intervention for {student.displayName}
              </h3>
              <button
                onClick={() => setShowInterventionModal(false)}
                className="text-[#8C8377] hover:text-[#1A1817]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIntervention} className="space-y-4 text-xs">
              <div>
                <label className="font-mono uppercase text-[10px] text-[#7A7265] font-semibold block mb-1">
                  Target Topic
                </label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full p-2 rounded border border-[#DCD5C9] bg-white text-[#1A1817] focus:outline-none"
                >
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>
                      Module 0{t.sequenceOrder}: {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono uppercase text-[10px] text-[#7A7265] font-semibold block mb-1">
                  Strategy Type
                </label>
                <select
                  value={interventionType}
                  onChange={(e) => setInterventionType(e.target.value as InterventionType)}
                  className="w-full p-2 rounded border border-[#DCD5C9] bg-white text-[#1A1817] focus:outline-none"
                >
                  <option value="assign_remedial">Assign Remedial Practice Questions</option>
                  <option value="one_on_one">1-on-1 Concept Explanation</option>
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
                  value={interventionNote}
                  onChange={(e) => setInterventionNote(e.target.value)}
                  className="w-full p-2.5 rounded border border-[#DCD5C9] bg-white text-[#1A1817] focus:outline-none placeholder-[#9C958C]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setShowInterventionModal(false)}
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
