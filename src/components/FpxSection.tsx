/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check } from "lucide-react";
import { Bank } from "../types";
import { BANKS } from "../paymentData";

interface FpxSectionProps {
  selectedBankId: string;
  onSelectBank: (id: string) => void;
}

export default function FpxSection({ selectedBankId, onSelectBank }: FpxSectionProps) {
  return (
    <div id="fpx-section" className="space-y-4 animate-in fade-in duration-200">
      <p className="text-xs text-on-surface-variant leading-relaxed">
        Select your preferred bank to proceed with the secure FPX online redirection.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {BANKS.map((bank: Bank) => {
          const isSelected = selectedBankId === bank.id;
          return (
            <button
              key={bank.id}
              onClick={() => onSelectBank(bank.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer relative origin-center hover:scale-[1.01] ${isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-outline-variant/60 hover:border-primary/50 hover:bg-surface-container-low"
                }`}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-white">
                  <Check size={11} strokeWidth={3} />
                </span>
              )}
              <img
                alt={bank.name}
                className="h-10 w-auto object-contain mb-1.5 px-2"
                src={bank.logo}
                referrerPolicy="no-referrer"
              />
              <span className={`text-xs font-semibold ${isSelected ? "text-primary" : "text-on-surface"}`}>
                {bank.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
