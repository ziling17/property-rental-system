/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Cpu, HardHat, TrendingUp, Building2, ShieldCheck, HelpCircle, X } from 'lucide-react';

interface Sdg9HubProps {
  onClose: () => void;
}

export default function Sdg9Hub({ onClose }: Sdg9HubProps) {
  return (
    <div id="sdg9-hub-overlay" className="fixed inset-0 bg-on-background/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div id="sdg9-hub-container" className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative border border-surface-container-high transition-soft max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface p-2 rounded-xl hover:bg-surface-container-low transition-colors"
          aria-label="Close"
          id="sdg9-close-btn"
        >
          <X size={20} />
        </button>

        {/* SDG 9 Header */}
        <div className="flex items-center gap-4 mb-6 border-b border-surface-container-high pb-4">
          <div className="bg-tertiary-container text-[#a18100] p-3 rounded-xl flex items-center justify-center shrink-0">
            <Cpu size={28} />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a18100]">
              UN Sustainable Development Goal 9
            </span>
            <h2 className="text-2xl font-bold text-on-surface">
              Industry, Innovation & Infrastructure
            </h2>
          </div>
        </div>

        {/* Sdg 9 Pillars */}
        <p className="text-on-surface-variant text-base leading-relaxed mb-6">
          MySewa applies tech modularity, micro-financial insurance, and algorithmic trust profiling to the property rental market. Here's how we bridge housing infrastructure gaps:
        </p>

        <div className="space-y-6">
          <div className="flex gap-4 items-start bg-surface-container-low p-4 rounded-xl">
            <div className="bg-primary/10 text-primary p-2.5 rounded-lg shrink-0 mt-1">
              <Building2 size={20} className="text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-on-surface text-sm mb-1">
                1. Industry: Eco-Modular Prefab Housing
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                By supporting modular prefabricated residential units like <strong>Sewa Eco-Apartments</strong>, we help reduce physical construct times by 40% and resource waste by 30%. This aligns with industrial sustainable material guidelines.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-surface-container-low p-4 rounded-xl">
            <div className="bg-tertiary/10 text-tertiary p-2.5 rounded-lg shrink-0 mt-1">
              <TrendingUp size={20} className="text-[#a18100]" />
            </div>
            <div>
              <h4 className="font-semibold text-on-surface text-sm mb-1">
                2. Innovation: The Micro-Bond Trust Engine
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Traditional deposits lock valuable tenant liquidity. MySewa unlocks this by storing tenant escrows directly in municipal infrastructure micro-bonds. This generates low-risk, green interest to subsidize both rent and local public facilities!
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-surface-container-low p-4 rounded-xl">
            <div className="bg-secondary-container/30 text-secondary p-2.5 rounded-lg shrink-0 mt-1">
              <ShieldCheck size={20} className="text-[#515354]" />
            </div>
            <div>
              <h4 className="font-semibold text-on-surface text-sm mb-1">
                3. Infrastructure: Pre-Screened Credit Inclusion
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Instead of banking credit reports that omit young or gig-economy workers, we construct a rental credit ledger evaluating continuous utility payments and carbon-minimal behavior. This builds inclusive, reliable housing opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* SDG Impact Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-surface-container-high">
          <div className="text-center p-3 bg-[#f0f9ff] rounded-xl border border-blue-100">
            <div className="text-2xl font-bold text-primary">28%</div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant mt-1">
              Lower Setup Barriers
            </div>
          </div>
          <div className="text-center p-3 bg-[#fdfaf2] rounded-xl border border-[#faf0d0]">
            <div className="text-2xl font-bold text-[#a18100]">4.8 ⭐</div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant mt-1">
              Community Reliability
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose} 
            className="bg-primary text-white hover:bg-primary-container px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
            id="sdg9-dismiss-btn"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
