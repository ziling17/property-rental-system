/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RenterProfile } from '../types';
import { AMENITY_LABELS } from '../smartMatchData';
import { Sliders, X, Check, Landmark, ShieldCheck, HeartPulse } from 'lucide-react';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: RenterProfile;
  onChangeProfile: (profile: RenterProfile) => void;
}

const PRESET_PERSONAS = [
  {
    name: 'Young Professional',
    description: 'Medium-high budget, values wellness & smart amenities',
    profile: {
      monthlyIncome: 7500,
      maxBudget: 2400,
      commuteLimitMinutes: 30,
      quietEnvironmentRequired: true,
      mustHaves: ['gym', 'large-windows', 'sustainable', 'ev-charging']
    }
  },
  {
    name: 'Eco-conscious Family',
    description: 'Prioritizes spacious living, low traffic, and sustainability',
    profile: {
      monthlyIncome: 9200,
      maxBudget: 2500,
      commuteLimitMinutes: 40,
      quietEnvironmentRequired: true,
      mustHaves: ['sustainable', 'soundproofing', 'pet-friendly', 'parking', 'balcony']
    }
  },
  {
    name: 'Budget Urbanite',
    description: 'Frugal city worker prioritizing cost and transit access',
    profile: {
      monthlyIncome: 4800,
      maxBudget: 1600,
      commuteLimitMinutes: 15,
      quietEnvironmentRequired: false,
      mustHaves: ['gym', 'high-speed-wifi', 'parking']
    }
  }
];

export default function ProfileDrawer({ isOpen, onClose, profile, onChangeProfile }: ProfileDrawerProps) {
  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESET_PERSONAS[0]) => {
    onChangeProfile({ ...preset.profile });
  };

  const handleCheckFeature = (feature: string) => {
    let newMustHaves = [...profile.mustHaves];
    if (newMustHaves.includes(feature)) {
      newMustHaves = newMustHaves.filter(f => f !== feature);
    } else {
      newMustHaves.push(feature);
    }
    onChangeProfile({ ...profile, mustHaves: newMustHaves });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop overlay */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
          aria-hidden="true"
        ></div>

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md transform transition-all duration-300 ease-in-out">
            <div className="flex h-full flex-col overflow-y-scroll bg-surface-container-lowest shadow-2xl border-l border-surface-container-high">
              <div className="px-6 py-5 bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-on-surface">Renter Configuration</h2>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1 text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 space-y-8 p-6">
                {/* Preset Scenarios */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-primary" /> Quick Scenarios
                  </h3>
                  <div className="space-y-2.5">
                    {PRESET_PERSONAS.map((preset) => {
                      const isMatching =
                        profile.monthlyIncome === preset.profile.monthlyIncome &&
                        profile.maxBudget === preset.profile.maxBudget &&
                        profile.mustHaves.length === preset.profile.mustHaves.length;

                      return (
                        <button
                          key={preset.name}
                          onClick={() => handleApplyPreset(preset)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${isMatching
                              ? 'border-primary bg-surface-container text-on-surface shadow-xs font-medium'
                              : 'border-surface-container-highest hover:bg-surface-container-low text-on-surface-variant'
                            }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-on-surface text-sm">{preset.name}</span>
                            {isMatching && <Check className="w-4 h-4 text-primary" />}
                          </div>
                          <p>{preset.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Income & Budget Sliders */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
                    <Landmark className="w-3.5 h-3.5 text-primary" /> Financial Profile
                  </h3>

                  <div className="space-y-5">
                    {/* Monthly Income */}
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-on-surface-variant font-medium">Monthly Gross Income</span>
                        <span className="text-primary font-bold">${profile.monthlyIncome.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="3000"
                        max="15000"
                        step="250"
                        value={profile.monthlyIncome}
                        onChange={(e) => onChangeProfile({ ...profile, monthlyIncome: parseInt(e.target.value) })}
                        className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-on-surface-variant/70 mt-1">
                        <span>$3,000/mo</span>
                        <span>Rent threshold: ${(profile.monthlyIncome * 0.3).toFixed(0)}/mo</span>
                        <span>$15,000/mo</span>
                      </div>
                    </div>

                    {/* Maximum Rent Budget */}
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-on-surface-variant font-medium">Desired Max Rent</span>
                        <span className="text-primary font-bold">${profile.maxBudget.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="5000"
                        step="50"
                        value={profile.maxBudget}
                        onChange={(e) => onChangeProfile({ ...profile, maxBudget: parseInt(e.target.value) })}
                        className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-on-surface-variant/70 mt-1">
                        <span>$1,000/mo</span>
                        <span>(Ideal Limit)</span>
                        <span>$5,000/mo</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workplace Commute Limits */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Commute & Location Constraints
                  </h3>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-on-surface-variant font-medium">Max Ideal Commute Time</span>
                      <span className="text-primary font-bold">{profile.commuteLimitMinutes} mins</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="60"
                      step="5"
                      value={profile.commuteLimitMinutes}
                      onChange={(e) => onChangeProfile({ ...profile, commuteLimitMinutes: parseInt(e.target.value) })}
                      className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-[10px] text-on-surface-variant/70 mt-1">
                      <span>15 min sprint</span>
                      <span>60 min max</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-on-surface">Quiet Environment Required</span>
                      <p className="text-[11px] text-on-surface-variant">Prefer properties in low-traffic, quiet zones</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.quietEnvironmentRequired}
                        onChange={(e) => onChangeProfile({ ...profile, quietEnvironmentRequired: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                {/* Amenity checklist */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-primary" /> Required Amenities (Must-Haves)
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-3">
                    These items are utilized directly for preference matching calculations.
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(AMENITY_LABELS).map(([key, label]) => {
                      const isChecked = profile.mustHaves.includes(key);
                      return (
                        <label
                          key={key}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all ${isChecked
                              ? 'border-primary/50 bg-primary/5 text-on-surface font-medium'
                              : 'border-surface-container-high hover:bg-surface-container-low text-on-surface-variant'
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckFeature(key)}
                            className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4"
                          />
                          <span>{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low p-5 border-t border-surface-container-high flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-primary text-on-primary font-bold py-3 text-sm rounded-xl hover:shadow-md active:scale-95 transition-all text-center"
                >
                  Apply & Calculate Match Score
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
