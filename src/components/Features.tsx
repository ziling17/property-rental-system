import { Cpu, HeartHandshake, BadgeCheck, ShieldCheck, Milestone, Landmark, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface FeaturesProps {
  userStabilityScore: number | null;
  onNavigateToCalculator: () => void;
}

export default function Features({ userStabilityScore, onNavigateToCalculator }: FeaturesProps) {
  const currentRating = userStabilityScore !== null ? userStabilityScore : 98.2;

  return (
    <section className="py-20 bg-white" id="features-section">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-dark mb-4">
            A systematic approach to living
          </h2>
          <p className="text-base text-brand-dark-text leading-relaxed">
            We leverage data-centric verified profiles to ensure every match is built on a foundation of absolute reliability and financial precision.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Smart Matching (8 columns) */}
          <div className="md:col-span-8 bg-brand-light-blue rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center overflow-hidden border border-brand-border/40 hover:shadow-md transition-all duration-300">
            <div className="flex-1 space-y-4">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-brand-dark tracking-tight">
                Smart Matching
              </h3>
              <p className="text-sm md:text-base text-brand-dark-text leading-relaxed">
                Our AI-driven engine analyzes over 20+ preference markers to connect the right tenants with the ideal properties, reducing vacancy times by 40%.
              </p>
            </div>
            
            <div className="flex-1 relative w-full h-48 md:h-60 rounded-xl overflow-hidden shadow-md">
              <img
                className="w-full h-full object-cover rounded-xl transform hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKAo70H-REMOqE2lj0YYmsSgIZVd_WVArzJ1SPeWU52yMQf1sVYtGXuQ5UkRMS8poQ4HCUUffn5m0LiMfocB9APX9idN6kBQH5lWuLOcmWiq105qCQl_r2NjIc1dnzEfnrG1qxE0KT22H8BOgoqpAHpstQFWIBT1NGRTQLtlyLAQsqoEg62YOTUvtjeirug_fhmJB8XIwHWer60GjX2RT8tooyrbQPmnpEPSMrR5r3a3d0CJFKKtXQC_rzjbx1fj4oKB8CewrJimQ"
                alt="Glowing data connection nodes grid"
              />
            </div>
          </div>

          {/* Card 2: Stability Score (4 columns) */}
          <div className="md:col-span-4 bg-brand-yellow rounded-2xl p-6 md:p-8 flex flex-col justify-between border border-[#eab308]/20 hover:shadow-md transition-all duration-300">
            <div>
              <div className="w-12 h-12 bg-[#574500]/10 rounded-xl flex items-center justify-center text-[#574500]">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-[20px] font-bold mt-4 mb-2 text-[#4e3d00] tracking-tight">
                Stability Score
              </h3>
              <p className="text-xs md:text-sm text-[#574500] leading-relaxed">
                A proprietary metric calculating financial reliability, transaction promptness, and rental history to foster trust immediately.
              </p>
            </div>

            <div className="mt-6 bg-white/40 p-4 rounded-xl backdrop-blur-sm border border-white/50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#4e3d00]">
                  {userStabilityScore !== null ? 'Your Score' : 'Reliability Rating'}
                </span>
                <span className="text-xs font-extrabold text-[#4e3d00]">
                  {currentRating}%
                </span>
              </div>
              <div className="w-full bg-[#4e3d00]/10 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#735c00] h-full rounded-full transition-all duration-1000"
                  style={{ width: `${currentRating}%` }}
                />
              </div>
              
              <button 
                onClick={onNavigateToCalculator}
                className="text-[10px] font-bold text-[#4e3d00] hover:underline flex items-center gap-1 pt-1 ml-auto cursor-pointer"
              >
                {userStabilityScore !== null ? 'Recalculate Score →' : 'Calculate your score →'}
              </button>
            </div>
          </div>

          {/* Card 3: Trusted Rentals (4 columns) */}
          <div className="md:col-span-4 bg-brand-primary text-white rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300 border border-brand-primary/20">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white/90">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">
                Trusted Rentals
              </h3>
              <p className="text-xs md:text-sm text-white/80 leading-relaxed">
                Every property listed on MySewa undergoes an exclusive, rigorous 5-point verification process by our ground team, ensuring what is shown is exactly what you get.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-yellow" />
              <span className="text-[11px] font-bold text-white/90 tracking-wide uppercase">
                Housing Authority Aligned
              </span>
            </div>
          </div>

          {/* Card 4: SDG 9 Alignment (8 columns) */}
          <div className="md:col-span-8 bg-brand-sdg9-bg rounded-2xl p-6 md:p-8 relative overflow-hidden group border border-brand-border/40 hover:shadow-md transition-all duration-300">
            <div className="relative z-10 max-w-lg space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-[#f43f5e] rounded-lg flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                  9
                </div>
                <h3 className="text-[13px] font-extrabold text-brand-dark/95 uppercase tracking-wider">
                  SDG 9 alignment
                </h3>
              </div>
              <h4 className="text-xl md:text-2xl font-bold text-brand-dark tracking-tight">
                Building Resilient Infrastructure
              </h4>
              <p className="text-sm md:text-base text-brand-dark-text leading-relaxed">
                MySewa is dedicated to UN Sustainable Development Goal 9 (Industry, Innovation, and Infrastructure) by completely digitizing the traditional rental economy, securing deposits, and fostering equitable, non-discriminatory housing lease channels across Malaysia.
              </p>
            </div>

            {/* Faint industrial wireframe background icon */}
            <div className="absolute right-[-8%] bottom-[-8%] opacity-5 group-hover:scale-105 group-hover:rotate-6 transition-all duration-700 pointer-events-none">
              <Landmark className="w-72 h-72 text-brand-primary" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
