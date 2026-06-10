/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Check, ShieldCheck, Download, Printer, Home, User, Phone, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { Property, CardDetails } from "../types";

interface PaymentSuccessProps {
  property: Property;
  paymentMethod: string;
  cardDetails: CardDetails;
  selectedBankId?: string;
  selectedWalletId?: string;
  messageToHost: string;
  onReset: () => void;
}

export default function PaymentSuccess({
  property,
  paymentMethod,
  cardDetails,
  selectedBankId,
  selectedWalletId,
  messageToHost,
  onReset,
}: PaymentSuccessProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const [keyHandoverTriggered, setKeyHandoverTriggered] = useState(false);

  const txId = `MYS-${Math.floor(100000 + Math.random() * 900000)}-KL`;
  const rent = property.firstMonthRent;
  const securityDep = rent * property.securityDepositMultiplier;
  const utilityDep = rent * property.utilityDepositMultiplier;
  const total = rent + securityDep + utilityDep;

  const getMethodLabel = () => {
    switch (paymentMethod) {
      case "card":
        const maskedNum = cardDetails.cardNumber ? `Card Ending in **${cardDetails.cardNumber.slice(-4)}` : "Credit/Debit Card";
        return maskedNum;
      case "fpx":
        return `FPX Banking (${selectedBankId?.toUpperCase() || "Bank Redirect"})`;
      case "wallet":
        return `Mobile E-Wallet (${selectedWalletId === "grabpay" ? "GrabPay" : "Touch 'n Go"})`;
      default:
        return "Secure Gateway";
    }
  };

  const handleCopy = () => {
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-3xl border border-outline-variant/20 shadow-xl overflow-hidden">
        {/* Banner with Animated Success Badge */}
        <div className="bg-emerald-650 text-white p-8 text-center relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
          
          <div className="mx-auto h-16 w-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/50 relative">
            <div className="p-3 bg-white text-emerald-600 rounded-full">
              <Check size={28} strokeWidth={3} />
            </div>
          </div>
          
          <h1 className="font-sans text-2xl font-black tracking-tight mb-1">
            Payment Completed & Escrowed!
          </h1>
          <p className="text-emerald-100 text-xs">
            Transaction Secured Under MySewa Trust-Guard Ledger
          </p>
        </div>

        {/* Receipt Body */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Securing Information Column */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5 border-b border-outline-variant/20 pb-2">
                <ShieldCheck size={16} className="text-emerald-600" /> Transaction Summary
              </h2>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-on-surface">
                  <span className="text-on-surface-variant font-medium">Receipt Ref ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-on-surface">{txId}</span>
                    <button
                      onClick={handleCopy}
                      className="text-primary hover:underline font-bold transition-all text-[11px] cursor-pointer"
                    >
                      {hasCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-on-surface">
                  <span className="text-on-surface-variant font-medium">Payment Channel</span>
                  <span className="font-semibold text-right">{getMethodLabel()}</span>
                </div>

                <div className="flex justify-between items-center text-on-surface">
                  <span className="text-on-surface-variant font-medium">Paid Timestamp</span>
                  <span className="font-semibold text-right">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZoneName: "short"
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center text-on-surface">
                  <span className="text-on-surface-variant font-medium">Compliance Seal</span>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full inline-block">
                    PCI DSS Secure 🔒
                  </span>
                </div>
              </div>
            </div>

            {/* Property details column */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5 border-b border-outline-variant/20 pb-2">
                <Home size={16} className="text-primary" /> Rental Details
              </h2>

              <div className="space-y-2 text-xs">
                <div className="flex gap-3">
                  <img
                    alt={property.name}
                    className="h-10 w-10 object-cover rounded-lg flex-shrink-0"
                    src={property.image}
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold text-on-surface text-xs leading-snug">{property.name}</h3>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">{property.location}</p>
                  </div>
                </div>

                <div className="border-t border-dashed border-outline-variant/30 pt-2 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Breakdown Sum</span>
                    <span className="font-medium text-right">
                      {`RM ${(rent).toLocaleString()} Rent + RM ${(securityDep + utilityDep).toLocaleString()} Dep`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-outline-variant/20 pt-1.5">
                    <span className="font-semibold text-on-surface">Total Cleared</span>
                    <span className="font-extrabold text-primary text-sm font-sans">
                      RM {total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Escrow Timeline Notification Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200/55 flex items-start gap-3">
            <AlertCircle size={20} className="text-primary mt-0.5 flex-shrink-0 animate-bounce" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-indigo-950">Active Escrow Holding Authorized</p>
              <p className="text-indigo-850 text-[11px] leading-relaxed">
                As part of <strong className="text-primary">MySewa Trust-Guard</strong>, your full deposit sum of <strong className="text-on-surface">RM {(securityDep + utilityDep).toLocaleString()}</strong> is secured in a designated escrow account. Funds will be released to the landlord only after you inspect the keys and authorize the commencement in-app.
              </p>
            </div>
          </div>

          {/* Host Card Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-outline-variant/30 space-y-3">
            <div className="flex items-center gap-2">
              <User size={16} className="text-on-surface-variant" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Contact Host Information</h3>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold text-sm">
                  KH
                </div>
                <div>
                  <p className="font-bold text-on-surface">Kenji Halim (Verified Host)</p>
                  <p className="text-[10px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <Phone size={10} /> +60 12-888-9932 (KL, Malaysia)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert(`Kenneth Kenji has been notified of your message:\n\n"${messageToHost || "None written."}"`)}
                className="bg-white text-primary hover:bg-slate-100 border border-outline-variant/50 px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer shadow-sm text-center"
              >
                Send Direct WhatsApp Chat
              </button>
            </div>
            
            {messageToHost && (
              <div className="p-3 bg-white rounded-xl border border-outline-variant/20">
                <p className="text-[11px] font-bold text-on-surface-variant/70 uppercase">Escrowed Draft Message:</p>
                <p className="text-xs italic text-on-surface mt-1 leading-normal">"{messageToHost}"</p>
              </div>
            )}
          </div>

          {/* Simulated Handovers & Tools */}
          <div className="flex flex-wrap items-center justify-between border-t border-outline-variant/25 pt-6 gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { window.print(); }}
                className="flex items-center gap-1.5 px-3 py-2 border border-outline-variant/40 hover:bg-slate-50 text-xs font-bold text-on-surface-variant rounded-xl cursor-pointer transition-all"
              >
                <Printer size={14} /> Print Receipt
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Voucher receipt download started in PDF format. [Simulated]");
                }}
                className="flex items-center gap-1.5 px-3 py-2 border border-outline-variant/40 hover:bg-slate-50 text-xs font-bold text-on-surface-variant rounded-xl cursor-pointer transition-all"
              >
                <Download size={14} /> Download PDF
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setKeyHandoverTriggered(true)}
                disabled={keyHandoverTriggered}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  keyHandoverTriggered
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 cursor-pointer"
                }`}
              >
                <Sparkles size={14} />
                {keyHandoverTriggered ? "Key Handover Registered!" : "Register Handover ✔"}
              </button>

              <button
                onClick={onReset}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-opacity-95 cursor-pointer shadow-md transition-all flex items-center gap-1.5"
              >
                <Home size={14} />
                Explore Properties
              </button>
            </div>
          </div>

          {keyHandoverTriggered && (
            <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 text-teal-900 text-xs leading-normal animate-in slide-in-from-bottom-2 duration-150">
              🎉 <strong>Key Handover simulated successfully!</strong> Kenji Halim and MySewa Logistics have been requested to confirm coordinate locks and verify biometric signature key boxes. Tenant move-in is approved!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
