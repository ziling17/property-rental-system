/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckCircle2 } from "lucide-react";
import { Wallet } from "../types";
import { WALLETS } from "../paymentData";

interface WalletSectionProps {
  selectedWalletId: string;
  onSelectWallet: (id: string) => void;
}

export default function WalletSection({ selectedWalletId, onSelectWallet }: WalletSectionProps) {
  return (
    <div id="wallet-section" className="space-y-4 animate-in fade-in duration-200">
      <p className="text-xs text-on-surface-variant leading-relaxed">
        Choose your preferred mobile e-wallet. You will be redirected to confirm payment using your mobile application.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {WALLETS.map((wallet: Wallet) => {
          const isSelected = selectedWalletId === wallet.id;
          return (
            <div
              key={wallet.id}
              onClick={() => onSelectWallet(wallet.id)}
              className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                  ? "border-primary bg-primary/5"
                  : "border-outline-variant/60 hover:border-primary/50 hover:bg-surface-container-low"
                }`}
            >
              <img
                alt={wallet.name}
                className="h-8 mr-4 w-auto object-contain"
                src={wallet.logo}
                referrerPolicy="no-referrer"
              />
              <span className={`text-sm font-bold ${isSelected ? "text-primary" : "text-on-surface"}`}>
                {wallet.name}
              </span>
              <div className="ml-auto">
                <CheckCircle2
                  className={`transition-all ${isSelected ? "text-primary opacity-100" : "text-outline-variant/40 opacity-0"}`}
                  size={20}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
