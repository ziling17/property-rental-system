import { useState } from 'react';
import { ShieldCheck, HelpCircle, ArrowRight, RefreshCw, CheckCircle2, UserCheck } from 'lucide-react';
import { StabilityInputs } from '../types';

interface StabilityCalculatorProps {
  onCalculate: (score: number) => void;
  currentScore: number | null;
}

export default function StabilityCalculator({ onCalculate, currentScore }: StabilityCalculatorProps) {
  const [inputs, setInputs] = useState<StabilityInputs>({
    incomeToRentRatio: 3, // default: 3x rent
    employmentStatus: 'employed',
    leaseDuration: 12, // 12 months
    payOnTimeHistory: 'always',
    hasReference: true
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const calculateScore = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      // Logic-driven calculation of reliability rating
      let baseScore = 75;

      // 1. Income Multiplier (Max +10)
      if (inputs.incomeToRentRatio >= 4) baseScore += 10;
      else if (inputs.incomeToRentRatio === 3) baseScore += 7;
      else if (inputs.incomeToRentRatio === 2) baseScore += 3;
      else baseScore -= 5; // <2x is risky

      // 2. Employment status (Max +5)
      if (inputs.employmentStatus === 'employed') baseScore += 5;
      else if (inputs.employmentStatus === 'retired') baseScore += 3;
      else if (inputs.employmentStatus === 'self-employed') baseScore += 2;
      
      // 3. Rental History duration (Max +10)
      if (inputs.leaseDuration >= 24) baseScore += 10;
      else if (inputs.leaseDuration >= 12) baseScore += 7;
      else baseScore += 3;

      // 4. Pay History (Max +15)
      if (inputs.payOnTimeHistory === 'always') baseScore += 15;
      else if (inputs.payOnTimeHistory === 'mostly') baseScore += 8;
      else baseScore -= 10; // "sometimes" reduces score

      // 5. Landlord Reference (Max +5)
      if (inputs.hasReference) baseScore += 10;

      // Bound between 60 and 99
      const calculatedResult = Math.min(Math.max(baseScore, 60), 99);
      onCalculate(calculatedResult);
      setIsCalculating(false);
    }, 900);
  };

  return (
    <section className="py-20 bg-white border-t border-brand-border/40" id="stability-calculator-section">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Static Info Block */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-brand-light-blue py-1.5 px-3.5 rounded-full border border-brand-border/80">
              <ShieldCheck className="w-4 h-4 text-brand-primary" />
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                Platform Verification Core
              </span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight leading-tight">
              Test Your <span className="text-brand-primary">Stability Score</span> In Real Time
            </h2>
            
            <p className="text-base text-brand-dark-text leading-relaxed">
              Our unique Stability Scoring reduces the need for expensive upfront security deposits. By calculating and validating your lease fidelity metrics, we provide landlords with a robust measure of trust.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 font-bold text-sm">1</div>
                <div>
                  <h4 className="text-sm font-bold text-brand-dark">Input Your Lease History</h4>
                  <p className="text-xs text-brand-dark-text">Fill in details regarding employment security and previous lease commitment tenures.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 font-bold text-sm">2</div>
                <div>
                  <h4 className="text-sm font-bold text-brand-dark">Verify Core Financial Ratios</h4>
                  <p className="text-xs text-brand-dark-text">Compare your monthly gross secure income relative to standard rental bracket thresholds.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 font-bold text-sm">3</div>
                <div>
                  <h4 className="text-sm font-bold text-brand-dark">Generate Approved Lease Pass</h4>
                  <p className="text-xs text-brand-dark-text">Instantly show landlords you are a high-trust matching tenant, reducing deposit requirements.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Block */}
          <div className="lg:col-span-7">
            <div className="bg-[#f8f9ff] rounded-3xl p-6 md:p-8 border border-brand-border/85 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-brand-dark border-b border-brand-border/60 pb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-brand-primary" />
                Eligibility Estimator Wizard
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Employment Status */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                    Employment Security
                  </span>
                  <select
                    value={inputs.employmentStatus}
                    onChange={(e) => setInputs({ ...inputs, employmentStatus: e.target.value })}
                    className="w-full bg-white text-brand-dark font-sans h-11 px-3 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    id="calc-employment"
                  >
                    <option value="employed">Full-Time Salaried Employed</option>
                    <option value="self-employed">Self-Employed / Entrepreneur</option>
                    <option value="retired">Retired / Asset Income</option>
                    <option value="student">Student / Co-signer Guaranteed</option>
                  </select>
                </div>

                {/* Gross Income-to-Rent multiplier */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                    Income to rent Ratio
                  </span>
                  <select
                    value={inputs.incomeToRentRatio}
                    onChange={(e) => setInputs({ ...inputs, incomeToRentRatio: parseInt(e.target.value) })}
                    className="w-full bg-white text-brand-dark font-sans h-11 px-3 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    id="calc-ratio"
                  >
                    <option value="4">Income is 4x or more of rental target</option>
                    <option value="3">Income is exactly 3x of rental target</option>
                    <option value="2">Income is roughly 2x of rental target</option>
                    <option value="1">Income is less than 2x of rental target</option>
                  </select>
                </div>

                {/* Average Lease Duration */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                    Avg Lease Hold Tenure
                  </span>
                  <select
                    value={inputs.leaseDuration}
                    onChange={(e) => setInputs({ ...inputs, leaseDuration: parseInt(e.target.value) })}
                    className="w-full bg-white text-brand-dark font-sans h-11 px-3 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    id="calc-duration"
                  >
                    <option value="24">Stayed 2+ consecutive years per home</option>
                    <option value="12">Stayed 1 year consecutively per home</option>
                    <option value="6">Under 12 months / Moving frequently</option>
                  </select>
                </div>

                {/* Rental payment promptness */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                    On-time payment record
                  </span>
                  <select
                    value={inputs.payOnTimeHistory}
                    onChange={(e) => setInputs({ ...inputs, payOnTimeHistory: e.target.value as any })}
                    className="w-full bg-white text-brand-dark font-sans h-11 px-3 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    id="calc-payment"
                  >
                    <option value="always">Always on time / No prior deficits</option>
                    <option value="mostly">Mostly on time / occasional grace-period usage</option>
                    <option value="sometimes">Sometimes delayed / seasonal variations</option>
                  </select>
                </div>

                {/* Landlord Reference Toggle */}
                <div className="md:col-span-2 bg-white p-4 rounded-xl border border-brand-border flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-brand-dark">Written Landlord Reference Letter</h4>
                    <p className="text-[11px] text-brand-dark-text">Does a previous landlord verify your rental accountability in writing?</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inputs.hasReference}
                      onChange={(e) => setInputs({ ...inputs, hasReference: e.target.checked })}
                      className="sr-only peer"
                      id="calc-reference-toggle"
                    />
                    <div className="w-11 h-6 bg-brand-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                  </label>
                </div>

              </div>

              {/* Action buttons + Result */}
              <div className="pt-4 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={calculateScore}
                  disabled={isCalculating}
                  className="w-full sm:w-auto bg-brand-primary text-white font-bold h-12 px-6 rounded-xl hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  id="calc-submit-btn"
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing Records...
                    </>
                  ) : (
                    <>
                      Calculate My Score
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {currentScore !== null && (
                  <div className="flex items-center gap-4 bg-brand-yellow/30 border border-[#eab308]/20 px-5 py-2.5 rounded-xl text-brand-dark animate-scale-up w-full sm:w-auto justify-between sm:justify-start">
                    <div>
                      <p className="text-[10px] uppercase font-extrabold text-brand-dark-text">Your Stability Estimate</p>
                      <h4 className="text-xl font-extrabold text-[#735c00] flex items-center gap-1">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        {currentScore} Score
                      </h4>
                    </div>
                    <div className="bg-white/80 px-2.5 py-1 rounded font-bold text-[10px] text-emerald-700 border border-emerald-600/20 uppercase">
                      VERIFIED PASS
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
