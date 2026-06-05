import { useState } from 'react';
import { Sparkles, MapPin, Bed, ArrowRight, CheckCircle, RefreshCw, Send, HelpCircle } from 'lucide-react';
import { Property, UserPreferences } from '../types';
import { PROPERTIES } from '../propertiesData';

interface MatchWizardProps {
  onPropertySelect: (property: Property) => void;
}

export default function MatchWizard({ onPropertySelect }: MatchWizardProps) {
  const [prefs, setPrefs] = useState<UserPreferences>({
    maxBudget: 4000,
    city: 'Kuala Lumpur',
    beds: 2,
    baths: 2,
    priority: 'stability'
  });

  const [matchedResults, setMatchedResults] = useState<{ property: Property; score: number }[] | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  const performMatching = () => {
    setIsMatching(true);

    setTimeout(() => {
      // Calculate a personalized compatibility rating for all properties
      const matches = PROPERTIES.map(prop => {
        let compatibilityScore = 100;

        // 1. Budget Deviation penalty
        if (prop.price > prefs.maxBudget) {
          const overage = prop.price - prefs.maxBudget;
          // penalty proportional to overage
          compatibilityScore -= Math.min((overage / 100) * 8, 45);
        } else {
          // positive matching bonus if within budget
          compatibilityScore += 5;
        }

        // 2. City match bonus
        const cityMatch = prop.city.toLowerCase() === prefs.city.toLowerCase() || 
                          prop.location.toLowerCase().includes(prefs.city.toLowerCase());
        if (cityMatch) {
          compatibilityScore += 10;
        } else {
          compatibilityScore -= 30; // major reduction if wrong state
        }

        // 3. Bed count deviation
        const bedDiff = Math.abs(prop.beds - prefs.beds);
        compatibilityScore -= bedDiff * 15;

        // 4. Align with priorities
        if (prefs.priority === 'stability') {
          // stability priority boosts properties with better stability scores
          compatibilityScore += (prop.stabilityScore - 90) * 1.5;
        } else if (prefs.priority === 'affordability') {
          // affordability boosts cheaper choices
          if (prop.price < 3000) compatibilityScore += 15;
          else compatibilityScore -= 10;
        } else if (prefs.priority === 'space') {
          // space boosts larger size
          if (prop.sizeSqft >= 1100) compatibilityScore += 15;
        } else if (prefs.priority === 'luxury') {
          if (prop.price >= 4000) compatibilityScore += 20;
        }

        // Cap score between 35 and 99
        const finalScore = Math.min(Math.max(Math.round(compatibilityScore), 35), 99);

        return {
          property: prop,
          score: finalScore
        };
      })
      .filter(match => match.score > 55) // only show relevant matches
      .sort((a, b) => b.score - a.score); // highest match first

      setMatchedResults(matches.slice(0, 3)); // show top 3 recommendations
      setIsMatching(false);
    }, 850);
  };

  return (
    <section className="py-20 bg-brand-light-blue border-t border-brand-border/40" id="match-wizard-section">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1 bg-brand-primary/10 py-1 px-3 rounded-full mb-3 text-brand-primary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            AI-POWERED MATCHMAKER
          </div>
          <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight">
            Find Your 100% Match Instantously
          </h2>
          <p className="text-sm md:text-base text-brand-dark-text pt-2 leading-relaxed">
            Specify your desired rental budget, location, layout features, and matching focus to find certified vacancies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Preferences Entry panel */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-brand-border/60 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-brand-dark flex items-center gap-1.5 border-b border-brand-border/60 pb-3">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              Customize Rental Preferences
            </h3>

            {/* Target Budget Option */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                Target Monthly Budget
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[2500, 3500, 4500].map(budget => (
                  <button
                    key={budget}
                    onClick={() => setPrefs({ ...prefs, maxBudget: budget })}
                    className={`h-10 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      prefs.maxBudget === budget
                        ? 'bg-brand-primary border-brand-primary text-white shadow-sm'
                        : 'bg-white border-brand-border text-brand-dark hover:bg-brand-light-blue'
                    }`}
                  >
                    RM {budget.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Preference Option */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                Preferred Area
              </span>
              <div className="grid grid-cols-3 gap-2">
                {['Kuala Lumpur', 'Penang', 'Johor Bahru'].map(loc => (
                  <button
                    key={loc}
                    onClick={() => setPrefs({ ...prefs, city: loc })}
                    className={`h-11 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      prefs.city === loc
                        ? 'bg-brand-primary border-brand-primary text-white shadow-sm'
                        : 'bg-white border-brand-border text-brand-dark hover:bg-brand-light-blue'
                    }`}
                  >
                    {loc.split(' ')[0]} {/* Show short label */}
                  </button>
                ))}
              </div>
            </div>

            {/* Bed Preference Option */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                Bedrooms Layout
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => setPrefs({ ...prefs, beds: cnt })}
                    className={`h-10 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      prefs.beds === cnt
                        ? 'bg-brand-primary border-brand-primary text-white shadow-sm'
                        : 'bg-white border-brand-border text-brand-dark hover:bg-brand-light-blue'
                    }`}
                  >
                    {cnt} {cnt === 1 ? 'Bedroom' : 'Bedrooms'}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Priority Preference Option */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                Matching Priority focus
              </span>
              <select
                value={prefs.priority}
                onChange={(e) => setPrefs({ ...prefs, priority: e.target.value as any })}
                className="w-full bg-white text-brand-dark font-sans h-11 px-3 rounded-xl border border-brand-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 cursor-pointer"
                id="wizard-priority-select"
              >
                <option value="stability">High Stability Rating & Trust verified landlords</option>
                <option value="affordability">Best Affordability Value / Budget-Friendly</option>
                <option value="space">Spacious layouts & larger square-footages first</option>
                <option value="luxury">Luxury amenities, top-tier floor heights & scenery</option>
              </select>
            </div>

            <button
              onClick={performMatching}
              disabled={isMatching}
              className="w-full bg-brand-primary text-white font-bold h-12 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              id="wizard-trigger-match-btn"
            >
              {isMatching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running Smart Match Alg...
                </>
              ) : (
                <>
                  Generate Match Reports
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Matches Output Panel */}
          <div className="lg:col-span-7">
            {isMatching ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-brand-border/60 shadow-sm h-[400px] flex flex-col justify-center items-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-brand-light-blue border-t-brand-primary animate-spin" />
                  <Sparkles className="w-6 h-6 text-brand-yellow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h4 className="text-base font-bold text-brand-dark pt-2">Running Multi-vector Smart Matches</h4>
                <p className="text-xs text-brand-dark-text max-w-xs leading-relaxed">
                  Comparing budget deviations, layout compatibility, transit scoring and verification logs...
                </p>
              </div>
            ) : matchedResults ? (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center px-2">
                  <h4 className="text-sm font-bold text-brand-dark uppercase tracking-wider">
                    Recommended Match results
                  </h4>
                  <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 py-1 px-2.5 rounded-full">
                    Top {matchedResults.length} matches discovered
                  </span>
                </div>

                {matchedResults.length > 0 ? (
                  <div className="space-y-4">
                    {matchedResults.map(({ property, score }) => (
                      <div
                        key={property.id}
                        onClick={() => onPropertySelect(property)}
                        className="bg-white rounded-2xl p-4 border border-brand-border/60 hover:border-brand-primary/50 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 cursor-pointer relative overflow-hidden group"
                        id={`wizard-match-${property.id}`}
                      >
                        {/* Img */}
                        <div className="w-full sm:w-36 h-32 rounded-xl overflow-hidden bg-brand-light-blue shrink-0">
                          <img
                            src={property.image}
                            alt={property.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Text and Matches */}
                        <div className="flex-1 flex flex-col justify-between py-0.5 space-y-2">
                          <div className="space-y-1">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-base font-bold text-brand-dark group-hover:text-brand-primary transition-colors line-clamp-1">
                                {property.name}
                              </h4>
                              <div className="bg-emerald-50 text-emerald-700 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-600/10 flex items-center gap-0.5 shrink-0">
                                {score}% compatibility match
                              </div>
                            </div>

                            <p className="flex items-center gap-1 text-xs text-brand-dark-text font-bold">
                              <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                              {property.location}
                            </p>
                          </div>

                          <p className="text-xs text-brand-dark-text/90 line-clamp-2">
                            {property.description}
                          </p>

                          <div className="flex justify-between items-center pt-2 border-t border-brand-border/50 text-[11px] text-brand-dark-text font-bold">
                            <span className="text-brand-primary font-extrabold text-sm">
                              RM {property.price.toLocaleString()} / mo
                            </span>
                            <div className="flex gap-3">
                              <span>{property.beds} Bed</span>
                              <span>{property.baths} Bath</span>
                              <span>{property.sizeSqft} sqft</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-8 text-center border">
                    <p className="text-sm font-bold text-brand-dark">No closely compatible properties found</p>
                  </div>
                )}
              </div>
            ) : (
              /* Hero call-to-action placeholder */
              <div className="bg-white rounded-3xl p-12 text-center border border-brand-border/60 shadow-sm h-[400px] flex flex-col justify-center items-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary border-4 border-brand-light-blue shadow-inner animate-bounce">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h4 className="text-lg font-bold text-brand-dark">Uncover Your Match Compatibility Score</h4>
                  <p className="text-xs text-brand-dark-text leading-relaxed">
                    Adjust your location requirements, bedroom specs, priorities, and budget goals, then hit "Generate Match Reports." We will search and score real vacancies instantly.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
