/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Banknote, MapPin, Heart } from 'lucide-react';
import { MatchResult } from '../types';

interface BentoGridProps {
  match: MatchResult;
}

export default function BentoGrid({ match }: BentoGridProps) {
  // Helper to get color classes for different ratings
  const getBadgeColors = (rating: 'Excellent' | 'Good' | 'Fair' | 'Poor') => {
    switch (rating) {
      case 'Excellent':
        return 'bg-primary/10 text-primary border border-primary/20';
      case 'Good':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Fair':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Poor':
        return 'bg-rose-50 text-rose-600 border border-rose-100';
    }
  };

  const getBarColor = (rating: 'Excellent' | 'Good' | 'Fair' | 'Poor') => {
    switch (rating) {
      case 'Excellent': return 'bg-primary';
      case 'Good': return 'bg-emerald-500';
      case 'Fair': return 'bg-amber-500';
      case 'Poor': return 'bg-rose-500';
    }
  };

  const cards = [
    {
      id: 'price-card',
      title: 'Price Match',
      score: match.priceScore,
      rating: match.priceRating,
      description: match.priceDescription,
      icon: Banknote,
    },
    {
      id: 'location-card',
      title: 'Location Match',
      score: match.locationScore,
      rating: match.locationRating,
      description: match.locationDescription,
      icon: MapPin,
    },
    {
      id: 'preference-card',
      title: 'Preference Match',
      score: match.preferenceScore,
      rating: match.preferenceRating,
      description: match.preferenceDescription,
      icon: Heart,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.id} 
            className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container-high hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-primary/15 rounded-lg group-hover:bg-primary transition-all duration-300">
                  <Icon className="w-5 h-5 text-primary group-hover:text-on-primary transition-colors" />
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold font-sans ${getBadgeColors(card.rating)}`}>
                  {card.rating}
                </span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2 font-sans">{card.title}</h3>
              <p className="text-sm font-sans text-on-surface-variant mb-6 leading-relaxed min-h-[48px]">
                {card.description}
              </p>
            </div>
            
            <div className="w-full mt-auto">
              <div className="flex justify-between text-xs font-medium text-on-surface-variant mb-1">
                <span>Compatibility Match</span>
                <span className="font-bold">{card.score}%</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(card.rating)}`}
                  style={{ width: `${card.score}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
