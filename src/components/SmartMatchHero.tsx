/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Sparkles, Award } from 'lucide-react';
import { Property, MatchResult } from '../types';

interface SmartMatchHeroProps {
  property: Property;
  match: MatchResult;
  onViewDetails: () => void;
  onCompare: () => void;
}

export default function SmartMatchHero({ property, match, onViewDetails, onCompare }: SmartMatchHeroProps) {
  const percent = match.overallScore;

  // Calculate SVG stroke parameters
  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
      <div className="lg:col-span-5 flex flex-col items-center justify-center text-center lg:text-left lg:items-start order-2 lg:order-1">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-tertiary-fixed rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-on-tertiary-fixed animate-pulse" />
          <span className="text-xs font-bold font-sans uppercase tracking-wider text-on-tertiary-fixed">
            AI-Powered Analysis
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-on-surface">
          {percent >= 85 ? 'Excellent Match Found!' : percent >= 70 ? 'Good Match Found!' : 'Fair Match Found!'}
        </h1>

        <p className="font-sans text-base md:text-lg text-on-surface-variant mb-8 max-w-xl leading-relaxed">
          Our Smart Match algorithm has analyzed over 50 key data points. {property.name} aligns nicely with your financial safety boundaries, workplace commute requirements, and lifestyle amenities.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            id="btn-hero-view-details"
            onClick={onViewDetails}
            className="cursor-pointer bg-primary text-on-primary px-8 py-4 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto"
          >
            View Full Property Details
          </button>
          <button
            id="btn-hero-compare"
            onClick={onCompare}
            className="cursor-pointer bg-surface-container-high text-primary px-8 py-4 rounded-xl text-sm font-bold hover:bg-surface-container-highest transition-all w-full sm:w-auto text-center"
          >
            Compare Properties
          </button>
        </div>
      </div>

      <div className="lg:col-span-7 flex justify-center items-center order-1 lg:order-2">
        <div className="relative w-64 h-64 md:w-[320px] md:h-[320px] flex items-center justify-center">
          {/* SVG Circular Progress Gauge */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Background Circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              className="stroke-surface-container-highest fill-none"
              strokeWidth={strokeWidth}
            />
            {/* Foreground Arc */}
            <motion.circle
              cx="100"
              cy="100"
              r={radius}
              className="stroke-primary fill-none transition-all duration-1000 ease-out"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              strokeLinecap="round"
            />
          </svg>

          {/* Inner Text Block */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-[16px] shadow-sm">
            <span className="text-[52px] md:text-[72px] font-extrabold text-primary leading-none tracking-tighter">
              {percent}
              <span className="text-2xl md:text-3xl font-bold">%</span>
            </span>
            <span className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mt-1">
              Match Score
            </span>
          </div>

          {/* Decorative Floating Icon Badge */}
          {property.isVerified && (
            <div className="absolute top-2 right-2 bg-white p-3.5 rounded-2xl shadow-lg border border-surface-container shadow-slate-900/5 animate-bounce">
              <Award className="w-6 h-6 text-on-tertiary-fixed-variant" fill="#ffe083" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
