/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bed, Bath, Maximize, Heart, Sparkles, CheckCircle } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  isSaved,
  onToggleSave,
}) => {
  // Determine color matching for stability scores
  const getStabilityColorClass = (score: number) => {
    if (score >= 95) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (score >= 90) return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    return 'bg-blue-50 text-blue-800 border-blue-200';
  };

  return (
    <div
      onClick={() => onSelect(property)}
      className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col h-full transform hover:-translate-y-1 overflow-hidden"
    >
      {/* Property Hero Image with overlay tags */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={property.image}
          alt={property.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            // fallback image if the hotlink fails or blocks
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80';
          }}
        />
        
        {/* Heart icon button */}
        <button
          onClick={(e) => onToggleSave(e, property.id)}
          className="absolute top-3 left-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-on-surface-variant hover:text-red-500 shadow-sm hover:scale-110 active:scale-95 duration-150 transition-all z-10"
          title={isSaved ? "Remove from bookmarks" : "Save this listing"}
        >
          <Heart size={16} className={isSaved ? "fill-red-500 text-red-500" : "text-slate-600"} />
        </button>

        {/* Dynamic Stability Score badge */}
        <div className="absolute top-3 right-3">
          <div className={`font-semibold text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm border ${getStabilityColorClass(property.stabilityScore)}`}>
            <Sparkles size={12} className="fill-current animate-pulse text-amber-600" />
            <span>{property.stabilityScore}% Stability</span>
          </div>
        </div>

        {/* Verification badge */}
        {property.isVerified && (
          <div className="absolute bottom-3 left-3 bg-primary/90 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-[2px]">
            <CheckCircle size={10} className="fill-white text-primary" />
            <span>Verified Landlord</span>
          </div>
        )}
      </div>

      {/* Property Details portion */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Title & Price */}
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors truncate" title={property.name}>
              {property.name}
            </h3>
            <span className="text-primary font-bold text-lg shrink-0">
              RM {property.price.toLocaleString()}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center text-on-surface-variant text-sm gap-1 mb-4">
            <span className="text-outline">
              {/* Manual Material Icon Fallback using simple layout or SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </span>
            <span className="truncate">{property.location}</span>
          </div>
          
          {/* Description snippet */}
          <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Specifications block matching footer ratios */}
        <div className="flex gap-4 border-t border-outline-variant/30 pt-4 mt-auto justify-between text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1">
            <Bed size={15} className="text-slate-400" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={15} className="text-slate-400" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize size={15} className="text-slate-400" />
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
};
