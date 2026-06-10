/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ChangeEvent } from "react";
import { CreditCard, Eye, EyeOff, Info } from "lucide-react";
import { CardDetails } from "../types";

interface CardFormProps {
  cardDetails: CardDetails;
  onChange: (details: Partial<CardDetails>) => void;
  errors: Partial<Record<keyof CardDetails, string>>;
}

export default function CardForm({ cardDetails, onChange, errors }: CardFormProps) {
  const [showCvv, setShowCvv] = useState(false);
  const [showCvvTooltip, setShowCvvTooltip] = useState(false);

  // Auto formats card numbers with spaces every 4 digits
  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) {
      value = value.substring(0, 16);
    }
    const matches = value.match(/\d{1,4}/g);
    const formatted = matches ? matches.join(" ") : "";
    onChange({ cardNumber: formatted });
  };

  // Auto formats expiry with slash e.g. MM/YY
  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) {
      value = value.substring(0, 4);
    }
    
    // Add slash automatically
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    onChange({ expiryDate: value });
  };

  const handleCvvChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) {
      value = value.substring(0, 3);
    }
    onChange({ cvv: value });
  };

  const isVisa = cardDetails.cardNumber.startsWith("4");
  const isMastercard = cardDetails.cardNumber.startsWith("5");

  return (
    <div id="card-form" className="space-y-4 animate-in fade-in duration-200">
      {/* Title & brand images */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          Card Details
        </span>
        <div className="flex gap-2 items-center">
          <img
            alt="Visa"
            className={`h-5 transition-all duration-300 ${
              isMastercard ? "opacity-30 scale-95" : "opacity-100 scale-100"
            }`}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6pPrhWyhOgVVzdB-4KphKN4KrLsn0V5NhQ7Vcsqk8ZlKoLsmpnp9fxi1sc6ImT4f9dA8B9IW2XKzlaOFgngXy_N2Q-OiZL5LCFcGvwtfDMEVuKVSlMUBS4Fm6pK2qNe8Vq1hiCTXgucn8a_RVbhFdAKbKaXj9V82r68BG08hVcseW_79etKVVGQSFzARQMURgTcXhf3vZtGfbsOxCPw4Z2mmrKsoWbPkXYzF_4sBBkPXi7GxeIfk858vgKW4_PnJS2Iq-yiuuJGc"
          />
          <img
            alt="Mastercard"
            className={`h-5 transition-all duration-300 ${
              isVisa ? "opacity-30 scale-95" : "opacity-100 scale-100"
            }`}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuArrgGgyLjFqe3mWOJp3xB8Rt5UN39cplZOJ0VMXRPcPQcvrB6bRBOImRhO67O08Na1LEcbDlzxcmngEhNRGw6kVlIIdAZp6mo-pC4OvcItIFOhab2tNcbgqHY9ltZq_jRKe8m464Wrpu5AFfU_D7n2MMe29hxcbuF7fV3mxC7gAZuW57ZgF7eQYV5L-Tef3oYi8dKC31qH5UlHo37DtEiorKp8ZkXKK6qs_5m3gsfavp_A8Zmug4QkMoLdZe9GlpuNA6_DbSqgHxc"
          />
        </div>
      </div>

      {/* Cardholder Name */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-on-surface-variant">
          Cardholder Name
        </label>
        <input
          type="text"
          value={cardDetails.cardholderName}
          onChange={(e) => onChange({ cardholderName: e.target.value })}
          className={`w-full h-11 px-4 rounded-xl border ${
            errors.cardholderName ? "border-rose-500 bg-rose-50/20" : "border-outline-variant/65 bg-surface-container-low"
          } focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all text-sm outline-none`}
          placeholder="Full name on card"
        />
        {errors.cardholderName && (
          <p className="text-xs text-rose-500 mt-0.5">{errors.cardholderName}</p>
        )}
      </div>

      {/* Card Number */}
      <div className="space-y-1 relative">
        <label className="block text-xs font-semibold text-on-surface-variant">
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            value={cardDetails.cardNumber}
            onChange={handleCardNumberChange}
            className={`w-full h-11 pl-4 pr-11 rounded-xl border ${
              errors.cardNumber ? "border-rose-500 bg-rose-50/20" : "border-outline-variant/65 bg-surface-container-low"
            } focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all text-sm outline-none`}
            placeholder="0000 0000 0000 0000"
          />
          <CreditCard className="absolute right-4 top-3 text-on-surface-variant/50" size={18} />
        </div>
        {errors.cardNumber && (
          <p className="text-xs text-rose-500 mt-0.5">{errors.cardNumber}</p>
        )}
      </div>

      {/* Expiry & CVV */}
      <div className="grid grid-cols-2 gap-4">
        {/* Expiry Date */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-on-surface-variant">
            Expiry Date
          </label>
          <input
            type="text"
            value={cardDetails.expiryDate}
            onChange={handleExpiryChange}
            className={`w-full h-11 px-4 rounded-xl border ${
              errors.expiryDate ? "border-rose-500 bg-rose-50/20" : "border-outline-variant/65 bg-surface-container-low"
            } focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all text-sm outline-none`}
            placeholder="MM/YY"
          />
          {errors.expiryDate && (
            <p className="text-xs text-rose-500 mt-0.5">{errors.expiryDate}</p>
          )}
        </div>

        {/* CVV */}
        <div className="space-y-1 relative">
          <label className="block text-xs font-semibold text-on-surface-variant flex items-center gap-1">
            CVV
          </label>
          <div className="relative">
            <input
              type={showCvv ? "text" : "password"}
              value={cardDetails.cvv}
              onChange={handleCvvChange}
              className={`w-full h-11 pl-4 pr-12 rounded-xl border ${
                errors.cvv ? "border-rose-500 bg-rose-50/20" : "border-outline-variant/65 bg-surface-container-low"
              } focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all text-sm outline-none`}
              placeholder="***"
            />
            
            {/* Eye toggle + info buttons */}
            <div className="absolute right-3 top-2.5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowCvv(!showCvv)}
                className="text-on-surface-variant/40 hover:text-on-surface transition-colors cursor-pointer"
              >
                {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              
              <button
                type="button"
                onMouseEnter={() => setShowCvvTooltip(true)}
                onMouseLeave={() => setShowCvvTooltip(false)}
                onClick={() => setShowCvvTooltip(!showCvvTooltip)}
                className="text-on-surface-variant/40 hover:text-primary transition-colors cursor-pointer"
              >
                <Info size={16} />
              </button>
            </div>
            
            {showCvvTooltip && (
              <div 
                id="cvv-tooltip"
                className="absolute right-0 bottom-12 w-48 bg-slate-900 text-white rounded-lg p-2 text-[10px] leading-relaxed shadow-lg border border-slate-700/50 z-50 animate-in fade-in slide-in-from-bottom-2 duration-100"
              >
                The 3-digit CVV code can be found on the back of your payment card, typically adjacent to your signature zone.
              </div>
            )}
          </div>
          {errors.cvv && (
            <p className="text-xs text-rose-500 mt-0.5">{errors.cvv}</p>
          )}
        </div>
      </div>

      {/* Save card checkbox */}
      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          id="saveCard"
          checked={cardDetails.saveCard}
          onChange={(e) => onChange({ saveCard: e.target.checked })}
          className="w-4.5 h-4.5 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
        />
        <label
          htmlFor="saveCard"
          className="text-xs text-on-surface-variant font-medium select-none cursor-pointer"
        >
          Save card details for future payments
        </label>
      </div>
    </div>
  );
}
