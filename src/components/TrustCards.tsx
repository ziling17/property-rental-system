import { Factory, ShieldAlert } from 'lucide-react';

export default function TrustCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="trust-cards-grid">
      
      {/* SDG 9 Alignment Card */}
      <div 
        className="bg-tertiary-fixed rounded-xl p-5 flex flex-col gap-3 border border-tertiary/20 shadow-sm hover:shadow-md transition-shadow duration-200"
        id="sdg-9-card"
      >
        <div className="flex items-center gap-2">
          <Factory className="w-5 h-5 text-on-tertiary-fixed-variant" />
          <span className="font-semibold text-sm tracking-wide text-on-tertiary-fixed-variant uppercase">
            SDG 9 Alignment
          </span>
        </div>
        <p className="text-xs md:text-sm text-on-tertiary-container leading-relaxed">
          Supporting <strong>Industry, Innovation, and Infrastructure</strong>. MySewa utilizes digital infrastructure to create inclusive urban housing markets.
        </p>
      </div>

      {/* Secure Processing Card */}
      <div 
        className="bg-surface-container-high rounded-xl p-5 flex flex-col gap-3 border border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-200"
        id="secure-processing-card"
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-primary fill-primary/5" />
          <span className="font-semibold text-sm tracking-wide text-primary uppercase">
            Secure Processing
          </span>
        </div>
        <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
          Your transaction is protected by bank-grade encryption. Deposits are held in a secure regulatory-compliant escrow account.
        </p>
      </div>

    </div>
  );
}
