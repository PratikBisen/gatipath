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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top back navigation */}
      <button
        onClick={() => navigate('/student/dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#5C5549] hover:text-[#1A1817] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Study Desk</span>
      </button>

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-[#E0D8CC] p-6 sm:p-8 shadow-xs space-y-2">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#1B4332] font-semibold">
          <BookOpen className="w-4 h-4" />
          <span>Concept Guide · Module 0{topic.sequenceOrder}</span>
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1817]">
          {topic.title}
        </h1>
        <p className="text-sm sm:text-base text-[#5C5549] leading-relaxed">
          {lesson.summary}
        </p>
      </div>

      {/* Visual Model Demonstration */}
      <div className="bg-white rounded-xl border border-[#E0D8CC] p-6 sm:p-8 shadow-xs space-y-5">
        <h2 className="font-editorial text-xl font-bold text-[#1A1817]">
          Visual Mental Model
        </h2>
        <p className="text-xs sm:text-sm text-[#5C5549] leading-relaxed">
          {lesson.visualDescription}
        </p>

        {topic.id === 'topic-3' ? (
          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-3.5 rounded-lg border border-[#E0D8CC]">
                <span className="font-mono text-xs font-semibold text-[#1B4332] block text-center mb-1">
                  1/4 + 1/4 = 2/4 (One Half)
                </span>
                <FractionBar
                  totalParts={4}
                  shadedParts={[1, 2]}
                  labels={['1/4', '1/4', '', '']}
                  subLabel="Combine 2 quarter-slices = 1/2 of the whole"
                />
              </div>
              <div className="bg-white p-3.5 rounded-lg border border-[#E0D8CC]">
                <span className="font-mono text-xs font-semibold text-[#1A1817] block text-center mb-1">
                  Simplifying 2/4 to 1/2
                </span>
                <FractionBar
                  totalParts={2}
                  shadedParts={[1]}
                  labels={['1/2', '']}
                  subLabel="Exact same amount of area"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex justify-center">
            <FractionBar
              totalParts={6}
              shadedParts={[1, 2, 3]}
              labels={['1/6', '2/6', '3/6', '', '', '']}
              subLabel="3 equal pieces out of 6 = 1/2 of bar"
            />
          </div>
        )}

        {/* Core Golden Rule Box */}
        <div className="p-4 bg-[#FAF3EB] rounded-xl border border-[#E8D4BE] flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-[#C57D36] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#C57D36]">
              Fundamental Mathematical Law
            </h4>
            <p className="text-xs sm:text-sm text-[#4A453D] leading-relaxed font-serif">
              {lesson.keyRule}
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Worked Examples */}
      <div className="bg-white rounded-xl border border-[#E0D8CC] p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="font-editorial text-xl font-bold text-[#1A1817]">
          Step-by-Step Worked Example
        </h2>

        {lesson.workedExamples.map((example, idx) => (
          <div key={idx} className="space-y-4">
            <div className="p-3.5 bg-[#FAF7F2] rounded-lg border border-[#E8E2D8] font-mono text-xs text-[#1A1817] font-semibold">
              Problem: {example.problem}
            </div>

            <div className="space-y-2.5">
              {example.stepByStep.map((step, sIdx) => (
                <div key={sIdx} className="flex items-start gap-3 text-xs sm:text-sm text-[#4A453D]">
                  <div className="w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                    {sIdx + 1}
                  </div>
                  <p className="leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#E8F4EE] rounded-lg border border-[#B7D8C4] text-xs sm:text-sm font-semibold text-[#1B4332] flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-[#1B4332] shrink-0" />
              <span>Final Solution: {example.result}</span>
            </div>

            {example.caution && (
              <div className="p-3 bg-[#FFF5F5] rounded-lg border border-[#FCD4D4] text-xs text-[#8C2828] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#8C2828] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Pitfall to Avoid: </span>
                  <span>{example.caution}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Action */}
      <div className="bg-white rounded-xl border border-[#E0D8CC] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-editorial text-base font-bold text-[#1A1817]">Ready to test your understanding?</h4>
          <p className="text-xs text-[#5C5549] mt-0.5">
            Answer questions tailored to your level. The engine adapts in real-time.
          </p>
        </div>
        <button
          onClick={() => navigate(`/solve/${topic.id}`)}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1B4332] text-white text-xs font-semibold rounded-lg hover:bg-[#112F23] transition-all shadow-xs shrink-0"
        >
          <span>Continue to Practice (Solve)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
