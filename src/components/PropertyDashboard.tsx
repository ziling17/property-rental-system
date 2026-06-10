/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin, Building2, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { Property } from "../types";
import { PROPERTIES } from '../paymentData';

interface PropertyDashboardProps {
  onSelectProperty: (property: Property) => void;
  selectedProperty: Property;
}

export default function PropertyDashboard({ onSelectProperty, selectedProperty }: PropertyDashboardProps) {

  const formatValue = (val: number) => {
    return `RM ${val.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
  };

  return (
    <div id="property-dashboard" className="space-y-8 animate-in fade-in duration-300">
      {/* Editorial Headline Panel */}
      <div className="text-center sm:text-left space-y-2 border-b border-outline-variant/15 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-wider">
          <Sparkles size={11} /> Trust-Guard Property Index
        </div>
        <h1 className="font-sans text-3xl font-black text-on-surface tracking-tight">
          Select Your Secure Tenancy Listing
        </h1>
        <p className="text-sm text-on-surface-variant font-medium max-w-2xl">
          Browse vetted Malaysian rental units aligned with SDG 9. Deposits are held in verified digital escrow until key handovers occur.
        </p>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROPERTIES.map((prop: Property) => {
          const isCurrent = prop.id === selectedProperty.id;
          const totalPayable = prop.firstMonthRent + (prop.firstMonthRent * prop.securityDepositMultiplier) + (prop.firstMonthRent * prop.utilityDepositMultiplier);

          return (
            <div
              key={prop.id}
              className={`flex flex-col bg-white rounded-2xl overflow-hidden border-2 transition-all duration-350 custom-shadow hover:shadow-lg ${isCurrent
                  ? "border-primary ring-2 ring-primary/10 bg-primary/[0.01]"
                  : "border-outline-variant/50 hover:border-primary/45"
                }`}
            >
              {/* Image Banner */}
              <div className="h-48 w-full relative overflow-hidden bg-slate-100">
                <img
                  alt={prop.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  src={prop.image}
                  referrerPolicy="no-referrer"
                />

                {/* Micro Verified badge */}
                <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-550 bg-emerald-600 text-white font-bold text-[9px] uppercase tracking-wider shadow-sm">
                  ✓ Verified
                </span>

                <div className="absolute bottom-3 right-3 bg-slate-900/40 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-[11px] font-bold">
                  {formatValue(prop.firstMonthRent)} / mo
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-semibold">
                    <MapPin size={13} className="text-primary" />
                    <span>{prop.location}</span>
                  </div>
                  <h3 className="font-sans font-extrabold text-sm text-on-surface leading-tight">
                    {prop.name}
                  </h3>
                </div>

                {/* Deposits breakdown list */}
                <div className="p-3 bg-surface-container-low rounded-xl text-[11px] space-y-1">
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Security Dep ({prop.securityDepositMultiplier}x):</span>
                    <span className="font-bold text-on-surface">{formatValue(prop.firstMonthRent * prop.securityDepositMultiplier)}</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Utility Dep ({prop.utilityDepositMultiplier}x):</span>
                    <span className="font-bold text-on-surface">{formatValue(prop.firstMonthRent * prop.utilityDepositMultiplier)}</span>
                  </div>
                  <div className="flex justify-between items-center text-primary pt-1 border-t border-dashed border-outline-variant/30 font-bold">
                    <span>Est. Escrow Total:</span>
                    <span>{formatValue(totalPayable)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-emerald-50 rounded-lg text-emerald-700 text-[10px] font-bold">
                  <ShieldCheck size={14} className="flex-shrink-0" />
                  <span>Aligned with SDG 9 Infrastructure</span>
                </div>

                {/* Interactive action */}
                <button
                  type="button"
                  onClick={() => onSelectProperty(prop)}
                  className={`w-full h-10 rounded-xl font-sans text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.98] ${isCurrent
                      ? "bg-primary text-white shadow-md shadow-primary/10"
                      : "bg-surface-container-high text-primary hover:bg-primary/5 border border-primary/15"
                    }`}
                >
                  <span>{isCurrent ? "Proceed with Payment" : "Configure & Select Checkout"}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust reassurance banner in footer Dashboard */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Building2 size={24} />
          </div>
          <div>
            <p className="font-bold text-xs text-on-surface">Digital Tenancy Guarantee</p>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              MySewa provides high-trust escrow protection under Southeast Asian real-estate directives. No fees are released to landlords prior to key handover certification.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant">
          <span>● 256-bit AES</span>
          <span>● PCI-DSS Compliant</span>
        </div>
      </div>
    </div>
  );
}
