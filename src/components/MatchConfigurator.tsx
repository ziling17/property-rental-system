/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MatchingInputs } from "../types";
import LucideIcon from "./LucideIcon";

interface MatchConfiguratorProps {
  inputs: MatchingInputs;
  onUpdateInputs: (updated: Partial<MatchingInputs>) => void;
  monthlyRent: number;
}

export default function MatchConfigurator({
  inputs,
  onUpdateInputs,
  monthlyRent,
}: MatchConfiguratorProps) {
  // Compute individual factors for explanation
  const rentRatio = Math.round((monthlyRent / (inputs.monthlyIncome || 1)) * 100);
  const isRentHealthy = rentRatio <= 30;

  const commuteFactor = Math.max(0, 100 - (inputs.klccCommuteMins - 10) * 2.5);
  const sustainabilityFactor = inputs.prefersLeed ? 100 : 50;
  const financialFactor = isRentHealthy ? 100 : Math.max(0, 100 - (rentRatio - 30) * 3);
  const communityFactor = inputs.techIndustry ? 100 : 70;

  // Formatting currency in RM format
  const formatRM = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section id="match-section" className="bg-blue-50/20 p-6 rounded-2xl border border-blue-50 space-y-6">
      {/* Title & Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <LucideIcon name="Sparkles" size={24} className="text-amber-500 fill-amber-300" />
          <div>
            <h2 className="font-sans font-extrabold text-lg text-gray-950">
              Why this is a good match
            </h2>
            <p className="text-xs text-gray-500">
              Adjust parameters below to see your personalized property affinity index.
            </p>
          </div>
        </div>

        {/* Floating Quick Action indicator */}
        <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 leading-none">
          REAL-TIME INDEXING
        </span>
      </div>

      {/* Grid of Match Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Commute Efficiency */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-sans font-bold text-sm text-blue-600">Commute Efficiency</h3>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-sm ${
                commuteFactor >= 85 ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
              }`}>
                {Math.round(commuteFactor)}% Match
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              Only {inputs.klccCommuteMins} mins from your key office. Ideal for professional continuity.
            </p>
          </div>

          {/* Slider input */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
              <span>Commute Duration</span>
              <span className="text-blue-600">{inputs.klccCommuteMins} Minutes</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              value={inputs.klccCommuteMins}
              onChange={(e) => onUpdateInputs({ klccCommuteMins: Number(e.target.value) })}
              className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* Sustainability Alignment */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-sans font-bold text-sm text-blue-600">Sustainability Alignment</h3>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-sm bg-green-50 text-green-600">
                100% Verified
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Matches preference for energy-efficient properties. Fully certified LEED Platinum metrics.
            </p>
          </div>

          {/* LEED Preference Checkbox Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 select-none">
            <input
              type="checkbox"
              checked={inputs.prefersLeed}
              onChange={(e) => onUpdateInputs({ prefersLeed: e.target.checked })}
              className="rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span>Require Green Certifications (LEED)</span>
          </label>
        </div>

        {/* Financial Stability Bracket */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-sans font-bold text-sm text-blue-600">Financial Stability</h3>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-sm ${
                isRentHealthy ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              }`}>
                {rentRatio}% Of Income
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              {isRentHealthy
                ? `Rent is within the healthy budget window (${rentRatio}% of your monthly income).`
                : `Exceeds the advised 30% financial threshold index (${rentRatio}%). Careful evaluation requested.`}
            </p>
          </div>

          {/* Income text input with sliders */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase">
              Your Declared Monthly Income (RM)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputs.monthlyIncome}
                onChange={(e) => onUpdateInputs({ monthlyIncome: Math.max(1, Number(e.target.value)) })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none focus:bg-white font-bold"
              />
              <span className="text-[10px] text-gray-400 self-center font-bold flex-shrink-0">
                /month
              </span>
            </div>
          </div>
        </div>

        {/* Tech Professional Community Alignment */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-sans font-bold text-sm text-blue-600">Community Rating</h3>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-sm bg-blue-50 text-blue-600`}>
                4.8/5.0 Building Index
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Building of residents consists heavily of remote engineers, tech professionals, and creators.
            </p>
          </div>

          {/* Community Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 select-none">
            <input
              type="checkbox"
              checked={inputs.techIndustry}
              onChange={(e) => onUpdateInputs({ techIndustry: e.target.checked })}
              className="rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span>I belong to the tech/creator community</span>
          </label>
        </div>
      </div>
    </section>
  );
}
