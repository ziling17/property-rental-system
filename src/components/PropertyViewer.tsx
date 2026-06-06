/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Property, RenterProfile } from '../types';
import { Bed, Bath, Hash, CheckSquare, Award, Compass, Trees, Heart, User, Sparkles } from 'lucide-react';
import { AMENITY_LABELS } from '../smartMatchData';

interface PropertyViewerProps {
  properties: Property[];
  selectedProperty: Property;
  onSelectProperty: (property: Property) => void;
  profile: RenterProfile;
  calculateScore: (property: Property) => number;
}

export default function PropertyViewer({
  properties,
  selectedProperty,
  onSelectProperty,
  calculateScore
}: PropertyViewerProps) {
  return (
    <div className="mt-16 space-y-8">
      {/* Property Selector Tabs */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" /> Browse MySewa Properties
            </h2>
            <p className="text-xs text-on-surface-variant font-sans mt-0.5">
              Select any property to view real-time smart compatibility analysis.
            </p>
          </div>
          <span className="text-xs font-semibold text-primary/80 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            {properties.length} Active Listings
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {properties.map((prop) => {
            const isSelected = prop.id === selectedProperty.id;
            const score = calculateScore(prop);

            return (
              <button
                key={prop.id}
                onClick={() => onSelectProperty(prop)}
                className={`text-left p-3.5 rounded-xl border transition-all duration-300 relative cursor-pointer flex flex-col justify-between h-[100px] ${isSelected
                    ? 'border-primary bg-primary/[0.04] ring-1 ring-primary shadow-xs'
                    : 'border-surface-container-high bg-surface-container-lowest hover:bg-surface-container-low hover:border-surface-container-highest'
                  }`}
              >
                <div>
                  <h4 className="text-xs font-bold truncate text-on-surface leading-tight">
                    {prop.name}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant/80 mt-1">
                    ${prop.rent.toLocaleString()}/mo
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${score >= 85
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20'
                      : score >= 70
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                    {score}% Match
                  </span>
                  {prop.isVerified && <Award className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Property Detail Card (The Skyline Residences style) */}
      <div className="bg-white border border-surface-container-high rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-xs">
        <div className="md:w-2/5 h-64 md:h-auto overflow-hidden relative min-h-[300px]">
          <img
            alt={selectedProperty.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            src={selectedProperty.image}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {selectedProperty.isVerified && (
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-on-primary text-xs px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider shadow-md">
                Verified Property
              </span>
            </div>
          )}
        </div>

        <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-on-surface mb-2 font-sans tracking-tight">
            {selectedProperty.name}
          </h3>
          <p className="text-xs text-on-surface-variant mb-4 font-sans font-medium">
            {selectedProperty.address}
          </p>
          <p className="text-sm font-sans text-on-surface-variant mb-6 leading-relaxed">
            {selectedProperty.description}
          </p>

          {/* Dimension specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-primary/10 rounded-lg text-primary">
                <Bed className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold text-on-surface font-sans">
                {selectedProperty.bedrooms} Bedrooms
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-primary/10 rounded-lg text-primary">
                <Bath className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold text-on-surface font-sans">
                {selectedProperty.bathrooms} Bathrooms
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-primary/10 rounded-lg text-primary">
                <Hash className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold text-on-surface font-sans">
                {selectedProperty.size.toLocaleString()} sq ft
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-primary/10 rounded-lg text-primary">
                <Trees className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold text-on-surface font-sans">
                {selectedProperty.isLowTrafficZone ? 'Quiet Zone' : 'Active Zone'}
              </span>
            </div>
          </div>

          {/* Amenities checklist breakdown */}
          <div className="mb-8 border-t border-surface-container py-4">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2.5 block">
              Property Amenities & Utilities
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedProperty.features.map(feat => (
                <span
                  key={feat}
                  className="bg-surface-container text-primary font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-primary" />
                  {AMENITY_LABELS[feat] || feat}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-surface-container">
            <div className="text-center sm:text-left">
              <div className="flex items-end gap-1 justify-center sm:justify-start">
                <span className="text-3xl font-extrabold text-primary leading-none">
                  ${selectedProperty.rent.toLocaleString()}
                </span>
                <span className="text-xs font-sans text-on-surface-variant">/ month</span>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-1 font-mono">
                Utilities approx: +${selectedProperty.utilities}/mo
              </p>
            </div>

            <div className="flex gap-2.5 w-full sm:w-auto">
              <button
                id="btn-select-property-submit"
                onClick={() => alert(`Outstanding! You have selected ${selectedProperty.name}. Our agent will contact you shortly regarding secure deposit verification.`)}
                className="cursor-pointer bg-primary text-on-primary px-6 py-3.5 rounded-xl text-sm font-bold hover:bg-primary-container transition-all active:scale-95 text-center flex-1 sm:flex-initial"
              >
                Select this Property
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
