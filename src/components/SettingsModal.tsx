import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, ShieldCheck, RefreshCw, Trash2, Heart, ShieldAlert, BadgeInfo } from 'lucide-react';
import { Profile } from '../types';

interface SettingsModalProps {
  profile: Profile;
  onUpdateScore: (score: number) => void;
  onResetData: () => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export default function SettingsModal({
  profile,
  onUpdateScore,
  onResetData,
  onClearHistory,
  onClose
}: SettingsModalProps) {
  const [sliderScore, setSliderScore] = useState(profile.trustScore);

  const handleApplyScore = () => {
    onUpdateScore(sliderScore);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative"
      >
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-300" />
            <h3 className="text-lg font-bold">Simulator Controls</h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-300 text-xl font-bold cursor-pointer">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Slider for adjusting Trust Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Set Trust Score (Simulated)</label>
              <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg">
                {sliderScore} / 100
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Manually force-update the score to see how badge labels shift dynamically.</p>
            <input
              type="range"
              min="30"
              max="100"
              value={sliderScore}
              onChange={(e) => setSliderScore(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
            />
            <button
              onClick={handleApplyScore}
              className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Apply Score Level
            </button>
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-3">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              Administrative Operations
            </h4>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Reset to Initial Template */}
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset all profile details, rental history, and scores back to default Alex Thompson parameters?')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="w-full flex items-center justify-between p-3 border border-slate-200 hover:border-blue-100 hover:bg-blue-50/20 rounded-xl text-left transition-all cursor-pointer"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
                    Reset App Data
                  </span>
                  <span className="block text-[10px] text-slate-400 leading-none mt-1">Restore stock Alex Thompson templates</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-blue-600">Default</span>
              </button>

              {/* Clear History ledger */}
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to clear your entire rental history feed? This will drop rented properties down to 0.')) {
                    onClearHistory();
                    onClose();
                  }
                }}
                className="w-full flex items-center justify-between p-3 border border-slate-200 hover:border-red-100 hover:bg-red-50/20 rounded-xl text-left transition-all cursor-pointer"
              >
                <div>
                  <span className="block text-xs font-bold text-red-600 flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    Wipe Rental History
                  </span>
                  <span className="block text-[10px] text-slate-400 leading-none mt-1">Clear all listed historical ledger items</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-red-600">Danger Zone</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 flex items-start gap-2 text-xs text-slate-500 leading-relaxed border border-slate-100">
            <BadgeInfo className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              MySewa Profile is built according to standard client-side state hooks. All simulation triggers and additions are stored locally via <strong className="font-semibold">localStorage</strong> for stable persistence.
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
