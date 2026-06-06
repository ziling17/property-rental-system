/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Property, RenterProfile } from '../types';
import { Check, X, Award, HelpCircle, ArrowRight } from 'lucide-react';
import { AMENITY_LABELS } from '../smartMatchData';

interface CompareSectionProps {
  properties: Property[];
  profile: RenterProfile;
  calculateScore: (property: Property) => number;
  calculateBreakdown: (property: Property) => {
    priceScore: number;
    locationScore: number;
    preferenceScore: number;
  };
  onSelectProperty: (property: Property) => void;
  setTab: (tab: 'match' | 'compare' | 'explore') => void;
}

export default function CompareSection({
  properties,
  profile,
  calculateScore,
  calculateBreakdown,
  onSelectProperty,
  setTab
}: CompareSectionProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
            Comprehensive Property Comparison
          </h1>
          <p className="text-sm text-on-surface-variant font-sans mt-1">
            Empowering renters with mathematical confidence under the SDG 9 (Infrastructure Transparency) framework.
          </p>
        </div>
        <button
          onClick={() => setTab('match')}
          className="cursor-pointer text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary/15 transition-all flex items-center gap-1"
        >
          Back to Smart Match <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-surface-container-high shadow-xs bg-surface-container-lowest">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-surface-container bg-surface-container-low/50">
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant w-[200px]">
                Specifications
              </th>
              {properties.map((prop) => {
                const score = calculateScore(prop);
                return (
                  <th key={prop.id} className="p-6 min-w-[200px] border-l border-surface-container-high">
                    <div className="relative h-28 rounded-lg overflow-hidden mb-4">
                      <img
                        src={prop.image}
                        alt={prop.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {prop.isVerified && (
                        <span className="absolute top-2 left-2 bg-primary text-on-primary text-[9px] px-2 py-1 rounded font-bold uppercase">
                          Verified
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-on-surface leading-tight truncate">
                      {prop.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${score >= 85
                          ? 'bg-emerald-50 text-emerald-700'
                          : score >= 70
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                        {score}% Match
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-surface-container-high text-xs font-sans text-on-surface">
            {/* SCORE BREAKDOWN SEGMENT */}
            <tr className="bg-surface-container-low/20">
              <td className="p-4 font-bold text-on-surface-variant">Price Match Compatibility</td>
              {properties.map((prop) => (
                <td key={prop.id} className="p-4 border-l border-surface-container-high">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>{calculateBreakdown(prop).priceScore}%</span>
                    <span className="text-[10px] text-on-surface-variant font-medium">(40% wt)</span>
                  </div>
                </td>
              ))}
            </tr>

            <tr className="bg-surface-container-low/20">
              <td className="p-4 font-bold text-on-surface-variant">Location Compatibility</td>
              {properties.map((prop) => (
                <td key={prop.id} className="p-4 border-l border-surface-container-high">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>{calculateBreakdown(prop).locationScore}%</span>
                    <span className="text-[10px] text-on-surface-variant font-medium">(30% wt)</span>
                  </div>
                </td>
              ))}
            </tr>

            <tr className="bg-surface-container-low/20">
              <td className="p-4 font-bold text-on-surface-variant">Preference Compatibility</td>
              {properties.map((prop) => (
                <td key={prop.id} className="p-4 border-l border-surface-container-high">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>{calculateBreakdown(prop).preferenceScore}%</span>
                    <span className="text-[10px] text-on-surface-variant font-medium">(30% wt)</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* FINANCIAL STATS */}
            <tr>
              <td className="p-4 font-bold text-on-surface-variant">Monthly Rent</td>
              {properties.map((prop) => {
                const exceeds = prop.rent > profile.maxBudget;
                return (
                  <td key={prop.id} className={`p-4 border-l border-surface-container-high font-semibold ${exceeds ? 'text-rose-600' : 'text-primary'}`}>
                    ${prop.rent.toLocaleString()} / mo
                    {exceeds && <span className="block text-[9px] text-rose-500 font-normal">Exceeds limit</span>}
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="p-4 font-bold text-on-surface-variant">Utilities (Estimate)</td>
              {properties.map((prop) => (
                <td key={prop.id} className="p-4 border-l border-surface-container-high text-on-surface-variant">
                  +${prop.utilities}/mo
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold text-on-surface-variant">Rent / Income Ratio</td>
              {properties.map((prop) => {
                const ratio = Math.round((prop.rent / profile.monthlyIncome) * 100);
                return (
                  <td key={prop.id} className="p-4 border-l border-surface-container-high font-medium">
                    <span className={ratio > 30 ? 'text-rose-600' : 'text-emerald-700'}>{ratio}%</span> of gross
                  </td>
                );
              })}
            </tr>

            {/* PHYSICAL LAYOUT */}
            <tr>
              <td className="p-4 font-bold text-on-surface-variant">Bedrooms / Baths</td>
              {properties.map((prop) => (
                <td key={prop.id} className="p-4 border-l border-surface-container-high text-on-surface">
                  {prop.bedrooms} Bed / {prop.bathrooms} Bath
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold text-on-surface-variant">Property Size</td>
              {properties.map((prop) => (
                <td key={prop.id} className="p-4 border-l border-surface-container-high text-on-surface">
                  {prop.size.toLocaleString()} sq ft
                </td>
              ))}
            </tr>

            {/* COMMUTE STATS */}
            <tr>
              <td className="p-4 font-bold text-on-surface-variant">Est. Office Commute</td>
              {properties.map((prop) => {
                const exceeds = prop.commuteTimeMinutes > profile.commuteLimitMinutes;
                return (
                  <td key={prop.id} className="p-4 border-l border-surface-container-high">
                    <span className={exceeds ? 'text-rose-600 font-semibold' : 'text-on-surface font-semibold'}>
                      {prop.commuteTimeMinutes} mins
                    </span>
                    <span className="block text-[9px] text-on-surface-variant/70">Subway: {prop.transitDistanceMinutes} min walk</span>
                  </td>
                );
              })}
            </tr>

            {/* AMENITY REQUIREMENTS CHECKLIST */}
            {profile.mustHaves.length > 0 ? (
              profile.mustHaves.map((must) => (
                <tr key={must}>
                  <td className="p-4 font-medium text-[11px] text-on-surface-variant tracking-tight pl-6 flex items-center gap-1.5">
                    Requires: {AMENITY_LABELS[must] || must}
                  </td>
                  {properties.map((prop) => {
                    const hasIt = prop.features.includes(must);
                    return (
                      <td key={prop.id} className="p-4 border-l border-surface-container-high">
                        {hasIt ? (
                          <div className="flex items-center gap-1 text-emerald-600 font-bold">
                            <Check className="w-3.5 h-3.5" /> Yes
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-rose-500">
                            <X className="w-3.5 h-3.5" /> No
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 font-bold text-on-surface-variant">Core Amenities Met</td>
                {properties.map((prop) => (
                  <td key={prop.id} className="p-4 border-l border-surface-container-high font-mono text-[10px] text-on-surface-variant">
                    {prop.features.length} features listed
                  </td>
                ))}
              </tr>
            )}

            {/* TRUST LEVEL */}
            <tr>
              <td className="p-4 font-bold text-on-surface-variant">Landlord trust level</td>
              {properties.map((prop) => (
                <td key={prop.id} className="p-4 border-l border-surface-container-high">
                  <div className="flex items-center gap-1 font-semibold">
                    <span>{prop.landlordRating}★</span>
                    <span className="text-[10px] text-on-surface-variant font-normal">({prop.landlordResponseTimeHours}h reply)</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* ACTION FOOTER */}
            <tr>
              <td className="p-6 font-bold text-on-surface-variant">Engagement Action</td>
              {properties.map((prop) => (
                <td key={prop.id} className="p-6 border-l border-surface-container-high">
                  <button
                    onClick={() => {
                      onSelectProperty(prop);
                      setTab('match');
                    }}
                    className="cursor-pointer bg-primary hover:bg-primary-container text-on-primary font-bold py-2.5 px-4 rounded-xl text-xs transition-all w-full text-center shadow-xs"
                  >
                    Select & Match
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
