import React from 'react';
import { MisconceptionCode } from '../../types';
import { MISCONCEPTIONS } from '../../data/curriculum/fractions';
import { FractionBar } from './FractionBar';
import { AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface MisconceptionCardProps {
  misconceptionCode: MisconceptionCode;
  onContinue: () => void;
  continueLabel?: string;
}

export const MisconceptionCard: React.FC<MisconceptionCardProps> = ({
  misconceptionCode,
  onContinue,
  continueLabel = 'Try Guided Practice Question'
}) => {
  const info = MISCONCEPTIONS[misconceptionCode];

  return (
    <div className="bg-white rounded-xl border border-warning/30 p-5 shadow-card my-4 transition-all">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-warning-light text-warning shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-warning">
              Learning Insight Detected
            </span>
          </div>
          <h3 className="text-base font-semibold text-charcoal mt-0.5">
            {info ? info.name : 'Concept Reflection'}
          </h3>
          <p className="text-sm text-charcoal-muted mt-1 leading-relaxed">
            {info ? info.whyItHappens : 'Let us review why this mathematical rule applies.'}
          </p>
        </div>
      </div>

      {/* Visual Demonstration Comparison */}
      {misconceptionCode === 'denominator_addition_error' && (
        <div className="mt-4 p-4 bg-canvas rounded-lg border border-borderSoft">
          <p className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
            Visual Comparison: Why 1/4 + 1/4 is 2/4 (1/2), NOT 2/8
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded border border-primary/20">
              <span className="text-xs font-medium text-primary block text-center mb-1">
                ✓ Correct: 1/4 + 1/4 = 2/4 (Half)
              </span>
              <FractionBar
                totalParts={4}
                shadedParts={[1, 2]}
                activeColor="#246B50"
                labels={['1/4', '1/4', '', '']}
                subLabel="2 slices out of 4 = 1/2 of whole"
              />
            </div>
            <div className="bg-white p-3 rounded border border-danger/20">
              <span className="text-xs font-medium text-danger block text-center mb-1">
                ✗ What 2/8 actually is:
              </span>
              <FractionBar
                totalParts={8}
                shadedParts={[1, 2]}
                activeColor="#B94D45"
                labels={['1/8', '1/8', '', '', '', '', '', '']}
                subLabel="2 slices out of 8 = only 1/4 of whole!"
              />
            </div>
          </div>
          <p className="text-xs text-charcoal-muted mt-2 text-center italic">
            Adding the denominators doubled the number of cuts, making the pieces smaller instead of adding them together!
          </p>
        </div>
      )}

      {/* Remedial takeaway box */}
      <div className="mt-4 p-3.5 bg-primary-subtle rounded-lg border border-primary/20 flex items-start gap-2.5">
        <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-charcoal leading-relaxed">
          <span className="font-semibold text-primary">Core Rule: </span>
          {info ? info.remedialConcept : 'Keep the denominator constant when adding or subtracting like fractions.'}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onContinue}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
        >
          <span>{continueLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
