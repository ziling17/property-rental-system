/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin, Lock, ShieldCheck, Mail } from "lucide-react";
import { Property, PaymentStatus } from "../types";

interface RentalSummaryProps {
  property: Property;
  paymentStatus: PaymentStatus;
  onSubmitPayment: () => void;
  onOpenSupport: () => void;
}

export default function RentalSummary({
  property,
  paymentStatus,
  onSubmitPayment,
  onOpenSupport,
}: RentalSummaryProps) {
  const formatCurrency = (val: number) => {
    return `RM ${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const rent = property.firstMonthRent;
  const securityDep = rent * property.securityDepositMultiplier;
  const utilityDep = rent * property.utilityDepositMultiplier;
  const total = rent + securityDep + utilityDep;

  const isIdle = paymentStatus === "idle";

  return (
    <div id="rental-summary-column" className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24 select-none">
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-outline-variant/20">
        {/* Header Title Banner */}
        <div className="p-5 bg-surface-container border-b border-outline-variant/10">
          <h2 className="font-sans text-lg font-bold text-on-surface">
            Rental Summary
          </h2>
        </div>

        {/* Property Section */}
        <div className="p-5 space-y-5">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-xl bg-secondary-container overflow-hidden flex-shrink-0 border border-outline-variant/20 custom-shadow">
              <img
                alt={property.name}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                src={property.image}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-sans font-bold text-sm text-on-surface leading-tight">
                {property.name}
              </h3>
              <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1 font-medium">
                <MapPin size={13} className="text-primary" />
                {property.location}
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-wider">
                  Verified Listing
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-outline-variant/20 pt-4 space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-on-surface">
              <span className="text-on-surface-variant font-medium">First Month Rent</span>
              <span className="font-semibold text-right">{formatCurrency(rent)}</span>
            </div>
            <div className="flex justify-between items-center text-on-surface">
              <span className="text-on-surface-variant font-medium">
                Security Deposit ({property.securityDepositMultiplier}x)
              </span>
              <span className="font-semibold text-right">{formatCurrency(securityDep)}</span>
            </div>
            <div className="flex justify-between items-center text-on-surface">
              <span className="text-on-surface-variant font-medium">
                Utility Deposit ({property.utilityDepositMultiplier}x)
              </span>
              <span className="font-semibold text-right">{formatCurrency(utilityDep)}</span>
            </div>
          </div>

          {/* Total Payable Block */}
          <div className="bg-surface-container-low border border-primary/10 p-4 rounded-2xl space-y-1">
            <div className="flex justify-between items-end">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Total Payable
              </span>
              <span className="text-xl font-extrabold text-primary animate-pulse-once">
                {formatCurrency(total)}
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant text-right leading-none">
              Includes all local bank secure verification taxes
            </p>
          </div>

          {/* Primary Pay Action Button */}
          <button
            id="pay-button"
            disabled={!isIdle}
            onClick={onSubmitPayment}
            className={`w-full h-12 text-white font-sans text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.98] cursor-pointer ${isIdle
                ? "bg-primary hover:bg-opacity-95"
                : "bg-slate-400 cursor-not-allowed"
              }`}
          >
            {isIdle ? (
              <>
                <span>Pay {formatCurrency(total)} Now</span>
                <Lock size={15} />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing Secure Redirection...</span>
              </div>
            )}
          </button>

          {/* MySewa Trust-Guard Escrow Seal */}
          <div className="flex flex-col gap-1.5 pt-2">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-outline-variant/30 custom-shadow">
              <ShieldCheck className="text-primary mt-0.5 flex-shrink-0" size={18} />
              <div className="text-[11px] leading-relaxed">
                <p className="font-bold text-on-surface">Protected by MySewa Trust-Guard</p>
                <p className="text-on-surface-variant font-medium">
                  Your security deposit rests safely in escrow until keys are officially cataloged and handed over.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Need Help footer links */}
      <div className="flex items-center justify-center gap-2 mt-1">
        <span className="text-xs text-on-surface-variant font-medium">Having trouble paying?</span>
        <button
          onClick={onOpenSupport}
          className="text-primary font-bold text-xs hover:underline cursor-pointer flex items-center gap-1 hover:text-on-primary-fixed-variant"
        >
          <Mail size={13} />
          Contact Support
        </button>
      </div>
    </div>
  );
}
