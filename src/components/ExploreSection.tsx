/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Property, RenterProfile } from '../types';
import { Search, SlidersHorizontal, ArrowUpDown, ShieldCheck, Bed, Bath, ArrowUpRight, Scale } from 'lucide-react';

interface ExploreSectionProps {
  properties: Property[];
  profile: RenterProfile;
  calculateScore: (property: Property) => number;
  onSelectProperty: (property: Property) => void;
  setTab: (tab: 'match' | 'compare' | 'explore') => void;
}

export default function ExploreSection({
  properties,
  calculateScore,
  onSelectProperty,
  setTab
}: ExploreSectionProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'match' | 'price-asc' | 'price-desc' | 'rating'>('match');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Filter properties
  const filteredProperties = properties
    .filter((prop) => {
      const matchSearch = prop.name.toLowerCase().includes(search.toLowerCase()) || 
                          prop.address.toLowerCase().includes(search.toLowerCase());
      const matchVerified = !verifiedOnly || prop.isVerified;
      return matchSearch && matchVerified;
    })
    .sort((a, b) => {
      if (sortBy === 'match') {
        return calculateScore(b) - calculateScore(a);
      }
      if (sortBy === 'price-asc') {
        return a.rent - b.rent;
      }
      if (sortBy === 'price-desc') {
        return b.rent - a.rent;
      }
      if (sortBy === 'rating') {
        return b.landlordRating - a.landlordRating;
      }
      return 0;
    });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Search and Filters Header */}
      <div className="bg-surface-container-low p-6 rounded-2xl border border-surface-container-high flex flex-col md:flex-row justify-between gap-4 items-stretch md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/80" />
          <input
            type="text"
            placeholder="Search communities, street names, boroughs, and zipcodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-surface-container-high rounded-xl text-xs font-sans text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Verified filter */}
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`cursor-pointer px-4 py-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              verifiedOnly 
                ? 'bg-primary text-on-primary border-primary' 
                : 'bg-surface-container-lowest text-on-surface-variant border-surface-container-high hover:border-surface-container-highest'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Landlord Only
          </button>

          {/* Sorter */}
          <div className="relative flex items-center bg-surface-container-lowest border border-surface-container-high rounded-xl px-3.5 py-3">
            <ArrowUpDown className="w-3.5 h-3.5 text-on-surface-variant mr-2" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-on-surface focus:outline-none border-none cursor-pointer pr-4"
            >
              <option value="match">Sort by: Compatibility Score</option>
              <option value="price-asc">Sort by: Rent (Low to High)</option>
              <option value="price-desc">Sort by: Rent (High to Low)</option>
              <option value="rating">Sort by: Landlord Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">
            Available Rental Units ({filteredProperties.length})
          </h2>
          <span className="text-xs text-on-surface-variant font-sans">
            Reflecting active verified rental data pipelines
          </span>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-surface-container-high">
            <p className="text-sm text-on-surface-variant">No listings match your search criteria.</p>
            <button
              onClick={() => { setSearch(''); setVerifiedOnly(false); }}
              className="mt-4 text-xs font-bold text-primary hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((prop) => {
              const score = calculateScore(prop);
              return (
                <div 
                  key={prop.id}
                  className="bg-surface-container-lowest border border-surface-container-high hover:border-surface-container-highest rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={prop.image}
                      alt={prop.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {prop.isVerified && (
                        <span className="bg-primary text-on-primary text-[9px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                          Verified Property
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm ${
                        score >= 85 
                          ? 'bg-emerald-50 text-emerald-700 font-bold' 
                          : score >= 70 
                          ? 'bg-amber-50 text-amber-700' 
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {score}% Smart Match
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-bold text-on-surface hover:text-primary transition-colors cursor-pointer"
                            onClick={() => { onSelectProperty(prop); setTab('match'); }}>
                          {prop.name}
                        </h3>
                        <span className="text-sm font-extrabold text-primary">${prop.rent}</span>
                      </div>
                      
                      <p className="text-[11px] text-on-surface-variant mb-4 truncate font-sans">
                        {prop.address}
                      </p>
                      
                      <p className="text-xs text-on-surface-variant font-sans line-clamp-2 leading-relaxed mb-5 min-h-[32px]">
                        {prop.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs font-medium text-on-surface-variant/90 border-t border-surface-container pb-4 pt-4">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-primary" /> {prop.bedrooms} Bed
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-primary" /> {prop.bathrooms} Bath
                        </span>
                        <span className="flex items-center gap-1">
                          <Scale className="w-3.5 h-3.5 text-primary" /> {prop.size} sq ft
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => { onSelectProperty(prop); setTab('match'); }}
                      className="cursor-pointer border border-primary/20 bg-primary/5 hover:bg-primary text-primary hover:text-on-primary font-bold py-3 text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-1 mt-auto w-full"
                    >
                      Assess Dynamic Compatibility <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
