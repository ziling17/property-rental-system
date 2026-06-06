/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MatchResult } from '../types';

interface ReasoningSectionProps {
  match: MatchResult;
}

export default function ReasoningSection({ match }: ReasoningSectionProps) {
  // Map dynamic index to descriptive standard category headers
  const getReasonHeader = (index: number) => {
    switch (index) {
      case 0: return 'Optimal Financial Health';
      case 1: return 'Lifestyle Compatibility';
      case 2: return 'Landlord Reliability';
      default: return 'Matching Attribute';
    }
  };

  return (
    <section className="mt-16 bg-surface-container-low p-6 md:p-8 rounded-2xl border border-surface-container-high">
      <h2 className="text-xl md:text-2xl font-bold text-on-surface mb-8 font-sans">
        Why this is {match.overallScore >= 85 ? 'an "Excellent Match"' : match.overallScore >= 70 ? 'a "Good Match"' : 'a compatible choice'}
      </h2>
      <div className="space-y-6">
        {match.reasons.map((reason, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center font-bold text-sm">
              {index + 1}
            </div>
            <div>
              <h4 className="text-base font-bold text-on-surface mb-1 font-sans">
                {getReasonHeader(index)}
              </h4>
              <p className="text-sm font-sans text-on-surface-variant leading-relaxed">
                {reason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
