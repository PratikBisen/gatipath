import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../lib/db';
import { TOPIC_LESSONS } from '../../data/curriculum/fractions';
import { FractionBar } from '../../components/visuals/FractionBar';
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  BookOpen
} from 'lucide-react';

export const LearnScreen: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const topic = db.getTopic(topicId || 'topic-1') || db.getTopics()[0];
  const lesson = TOPIC_LESSONS[topic.id] || TOPIC_LESSONS['topic-1'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top back navigation */}
      <button
        onClick={() => navigate('/student/dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-charcoal transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Learning Dashboard</span>
      </button>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-borderSoft p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Learn Stage · Topic {topic.sequenceOrder} of 4</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal">
          {topic.title}
        </h1>
        <p className="text-sm sm:text-base text-charcoal-muted mt-2 leading-relaxed">
          {lesson.summary}
        </p>
      </div>

      {/* Visual Model Demonstration */}
      <div className="bg-white rounded-xl border border-borderSoft p-6 shadow-card space-y-4">
        <h2 className="text-base font-heading font-bold text-charcoal">
          Visual Mental Model
        </h2>
        <p className="text-sm text-charcoal-muted leading-relaxed">
          {lesson.visualDescription}
        </p>

        {topic.id === 'topic-3' ? (
          <div className="p-4 bg-canvas rounded-xl border border-borderSoft space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg border border-borderSoft">
                <span className="text-xs font-semibold text-primary block text-center mb-1">
                  1/4 + 1/4 = 2/4 (One Half)
                </span>
                <FractionBar
                  totalParts={4}
                  shadedParts={[1, 2]}
                  labels={['1/4', '1/4', '', '']}
                  subLabel="Combine 2 quarter-slices = 1/2 of the whole"
                />
              </div>
              <div className="bg-white p-3 rounded-lg border border-borderSoft">
                <span className="text-xs font-semibold text-charcoal block text-center mb-1">
                  Simplifying 2/4 to 1/2
                </span>
                <FractionBar
                  totalParts={2}
                  shadedParts={[1]}
                  labels={['1/2', '']}
                  subLabel="Exact same amount of pizza!"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-canvas rounded-xl border border-borderSoft flex justify-center">
            <FractionBar
              totalParts={6}
              shadedParts={[1, 2, 3]}
              labels={['1/6', '2/6', '3/6', '', '', '']}
              subLabel="3 equal pieces out of 6 = 1/2 of bar"
            />
          </div>
        )}

        {/* Core Golden Rule Box */}
        <div className="p-4 bg-primary-subtle rounded-xl border border-primary/20 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
              Fundamental Concept Rule
            </h4>
            <p className="text-sm text-charcoal font-medium mt-0.5 leading-relaxed">
              {lesson.keyRule}
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Worked Examples */}
      <div className="bg-white rounded-xl border border-borderSoft p-6 shadow-card space-y-6">
        <h2 className="text-base font-heading font-bold text-charcoal">
          Step-by-Step Worked Example
        </h2>

        {lesson.workedExamples.map((example, idx) => (
          <div key={idx} className="space-y-4">
            <div className="p-3.5 bg-canvas rounded-lg border border-borderSoft font-mono text-sm text-charcoal font-semibold">
              Problem: {example.problem}
            </div>

            <div className="space-y-2.5">
              {example.stepByStep.map((step, sIdx) => (
                <div key={sIdx} className="flex items-start gap-3 text-xs sm:text-sm text-charcoal">
                  <div className="w-5 h-5 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {sIdx + 1}
                  </div>
                  <p className="leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs sm:text-sm font-semibold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Final Solution: {example.result}</span>
            </div>

            {example.caution && (
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Common Pitfall to Avoid: </span>
                  <span>{example.caution}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Floating Action to Practice */}
      <div className="bg-white rounded-xl border border-borderSoft p-5 shadow-floating flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-charcoal">Ready to test your understanding?</h4>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Answer questions tailored to your level. The engine adapts in real-time.
          </p>
        </div>
        <button
          onClick={() => navigate(`/solve/${topic.id}`)}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-sm shrink-0"
        >
          <span>Continue to Practice (Solve)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
