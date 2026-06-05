/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  RefreshCw, 
  Compass, 
  ShieldCheck, 
  Train, 
  Maximize2, 
  Tv, 
  Wind, 
  Home, 
  Layers, 
  Bed, 
  Bath, 
  AlertTriangle,
  Flame,
  Check
} from 'lucide-react';
import { PropertyFilter } from '../types';

interface FilterPanelProps {
  filters: PropertyFilter;
  onFilterChange: (filters: PropertyFilter) => void;
  availableLocations: string[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  availableLocations,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(true); // Default open to showcase the comprehensive system

  const updateFilter = <K extends keyof PropertyFilter>(key: K, value: PropertyFilter[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter('searchQuery', e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilter('location', e.target.value);
  };

  const resetFilters = () => {
    onFilterChange({
      searchQuery: '',
      location: '',
      minPrice: 1000,
      maxPrice: 6000,
      minStability: 0,
      bedrooms: '',
      bathrooms: '',
      propertyType: 'Any',
      furnishing: 'Any',
      transitFriendlyOnly: false,
      isVerifiedOnly: false,
      minSqft: 200,
      maxSqft: 2500,
      selectedAmenities: [],
    });
  };

  // Toggle checklist amenities helper
  const handleToggleAmenity = (amenity: string) => {
    const list = [...(filters.selectedAmenities || [])];
    if (list.includes(amenity)) {
      updateFilter('selectedAmenities', list.filter(item => item !== amenity));
    } else {
      updateFilter('selectedAmenities', [...list, amenity]);
    }
  };

  const amenitiesOptions = [
    { label: 'Infinity Pool', matches: ['Pool', 'infinity'] },
    { label: 'Gym & Fitness', matches: ['Gym', 'Pilates'] },
    { label: 'High-speed Fiber', matches: ['Fiber', 'Internet'] },
    { label: '24/7 Security guard', matches: ['Security', '3 Tier'] },
    { label: 'Smart Home Hub', matches: ['Smart'] },
    { label: 'Direct Mall Access', matches: ['Mall'] },
    { label: 'Private Elevator', matches: ['Elevator'] },
    { label: 'Dedicated Parking', matches: ['Parking'] }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/30 mb-8 transition-all">
      <div className="space-y-6">
        
        {/* Row 1: Quick Search Input & Primary Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          
          {/* Main Keyword Input */}
          <div className="relative w-full lg:flex-grow">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={handleTextChange}
              placeholder="Search by city, neighborhood, or building name..."
              className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-outline-variant/40 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm text-sm text-slate-800"
            />
          </div>

          {/* Location Area Selector */}
          <div className="relative w-full lg:w-60 shrink-0">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <MapPin size={18} />
            </div>
            <select
              value={filters.location}
              onChange={handleLocationChange}
              className="w-full h-12 pl-12 pr-8 bg-slate-50 border border-outline-variant/40 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm text-xs text-slate-800 appearance-none cursor-pointer"
            >
              <option value="">All Regions</option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <Compass size={16} />
            </div>
          </div>

          {/* Quick Filter buttons */}
          <div className="flex gap-2 w-full lg:w-auto shrink-0 justify-end">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`h-12 px-5 rounded-2xl flex items-center gap-2 text-xs font-bold border transition-all cursor-pointer ${
                showAdvanced 
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-outline-variant'
              }`}
            >
              <SlidersHorizontal size={16} />
              <span>Advanced Audits</span>
            </button>
            
            <button
              onClick={resetFilters}
              className="h-12 w-12 rounded-2xl bg-slate-50 border border-outline-variant/60 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
              title="Reset all filters to defaults"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* COMPREHENSIVE FILTER CONSOLE (ADVANCED PANELS) */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-100/80 animate-slide-down">
            
            {/* 1. PRICE & BUDGETING MODULE (MIN & MAX RANGE) */}
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <DollarSign size={14} className="text-slate-400" /> Rent Budget / Mo
                </span>
                <span className="font-bold text-primary">
                  RM {(filters.minPrice || 1000).toLocaleString()} - {(filters.maxPrice || 6000).toLocaleString()}+
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Min Rent</span>
                    <input 
                      type="number"
                      value={filters.minPrice || ''}
                      onChange={(e) => updateFilter('minPrice', parseInt(e.target.value) || 0)}
                      placeholder="e.g. 1500"
                      className="w-full h-9 px-2 bg-white text-xs border border-outline-variant/50 rounded-lg focus:outline-none font-semibold text-slate-700"
                    />
                  </div>
                  <div className="text-slate-300 pt-4 font-bold text-xs">to</div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Max Rent</span>
                    <input 
                      type="number"
                      value={filters.maxPrice || ''}
                      onChange={(e) => updateFilter('maxPrice', parseInt(e.target.value) || 10000)}
                      placeholder="e.g. 6000"
                      className="w-full h-9 px-2 bg-white text-xs border border-outline-variant/50 rounded-lg focus:outline-none font-semibold text-slate-700"
                    />
                  </div>
                </div>

                {/* Range Slider controls */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
                    <span>Min Limit: RM 1,000</span>
                    <span>Max Limit: RM 10,000</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="10000"
                    step="250"
                    value={filters.maxPrice || 6000}
                    onChange={(e) => updateFilter('maxPrice', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </div>

            {/* 2. DENSITY REQUIREMENT (BEDROOMS & BATHROOMS) */}
            <div className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              {/* Row Bedrooms */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Bed size={14} className="text-slate-400" /> Bedrooms Preference
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {['', '1', '2', '3', '4'].map((bed) => (
                    <button
                      key={bed}
                      type="button"
                      onClick={() => updateFilter('bedrooms', bed)}
                      className={`h-9 px-3.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex-grow ${
                        filters.bedrooms === bed
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-white text-slate-600 border-outline-variant hover:bg-slate-50'
                      }`}
                    >
                      {bed === '' ? 'Any' : `${bed} BR`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row Bathrooms */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Bath size={14} className="text-slate-400" /> Bathrooms count
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {['', '1', '2', '3'].map((bath) => (
                    <button
                      key={bath}
                      type="button"
                      onClick={() => updateFilter('bathrooms', bath)}
                      className={`h-9 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex-grow ${
                        filters.bathrooms === bath
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-white text-slate-600 border-outline-variant hover:bg-slate-50'
                      }`}
                    >
                      {bath === '' ? 'Any' : `${bath} Bath`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. SIZE METRIC MODULE (SQFT SIZE RANGE) */}
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Maximize2 size={14} className="text-slate-400" /> Built-up Area Size (sqft)
              </span>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Min Size</span>
                  <div className="relative">
                    <input 
                      type="number"
                      value={filters.minSqft || ''}
                      onChange={(e) => updateFilter('minSqft', parseInt(e.target.value) || 0)}
                      placeholder="e.g. 500"
                      className="w-full h-10 px-3 pr-8 bg-white text-xs border border-outline-variant/60 rounded-xl focus:outline-none font-semibold text-slate-700"
                    />
                    <span className="absolute inset-y-0 right-2.5 flex items-center text-[10px] text-slate-400 font-bold">sf</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Max Size</span>
                  <div className="relative">
                    <input 
                      type="number"
                      value={filters.maxSqft || ''}
                      onChange={(e) => updateFilter('maxSqft', parseInt(e.target.value) || 3000)}
                      placeholder="e.g. 1800"
                      className="w-full h-10 px-3 pr-8 bg-white text-xs border border-outline-variant/60 rounded-xl focus:outline-none font-semibold text-slate-700"
                    />
                    <span className="absolute inset-y-0 right-2.5 flex items-center text-[10px] text-slate-400 font-bold">sf</span>
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
                Standard studies link human emotional satisfaction with proportional space parameters matching smart SDG layout grids.
              </p>
            </div>

            {/* 4. STRUCTURAL PREFERENCE (PROPERTY TYPE & FURNISHING) */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              {/* Property types list */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Home size={14} className="text-slate-400" /> Building Type
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {['Any', 'Condo', 'Apartment', 'Landed', 'Studio'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updateFilter('propertyType', t)}
                      className={`h-9 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex-grow ${
                        (filters.propertyType || 'Any') === t
                          ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                          : 'bg-white text-slate-600 border-outline-variant hover:bg-slate-50'
                      }`}
                    >
                      {t === 'Any' ? 'All Types' : t === 'Condo' ? 'Condominium' : t === 'Landed' ? 'Landed' : t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Furnishing categories */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={14} className="text-slate-400" /> Furnishing status
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {['Any', 'Fully', 'Partially', 'Unfurnished'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => updateFilter('furnishing', f)}
                      className={`h-9 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex-grow ${
                        (filters.furnishing || 'Any') === f
                          ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                          : 'bg-white text-slate-600 border-outline-variant hover:bg-slate-50'
                      }`}
                    >
                      {f === 'Any' ? 'All' : f === 'Fully' ? 'Fully Furnished' : f === 'Partially' ? 'Partially' : f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. AUDITED SECURITY & VETTING FLOOR (MINIMUM STABILITY) */}
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={14} className="text-slate-500 fill-amber-400/20" /> Audited Stability Floor
              </span>
              <p className="text-[10px] text-slate-500 font-medium">
                Sourced from predictive indices spanning lock escrow deposits, clean government title match history, and emergency response.
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {[0, 90, 93, 96].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => updateFilter('minStability', score)}
                    className={`h-9 px-3 rounded-xl text-[11px] font-bold border transition-all flex-grow cursor-pointer ${
                      filters.minStability === score
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white text-slate-600 border-outline-variant hover:bg-slate-50'
                    }`}
                  >
                    {score === 0 ? 'No Minimum' : `${score}%+ Index`}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. ADVANCED SYSTEM TOGGLES (COMPLIANCE CERTIFICATION & TRANSIT) */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 bg-primary/[0.03] p-4.5 rounded-2xl border border-primary/10">
              
              <div className="space-y-2">
                <span className="block text-[11px] font-bold text-primary uppercase tracking-widest">Trust Registry Filters</span>
                
                <div className="space-y-2.5">
                  <label className="flex items-start gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filters.transitFriendlyOnly || false}
                      onChange={(e) => updateFilter('transitFriendlyOnly', e.target.checked)}
                      className="text-primary focus:ring-primary h-4.5 w-4.5 rounded border-outline-variant bg-white accent-primary cursor-pointer mt-0.5"
                    />
                    <div>
                      <span className="font-bold flex items-center gap-1 text-slate-800">
                        <Train size={14} className="text-primary" /> Direct Transit Connection
                      </span>
                      <p className="text-[10px] text-slate-400 font-medium leading-tight">Must reside within 500 meters of operational LRT/MRT rapid train stations.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filters.isVerifiedOnly || false}
                      onChange={(e) => updateFilter('isVerifiedOnly', e.target.checked)}
                      className="text-primary focus:ring-primary h-4.5 w-4.5 rounded border-outline-variant bg-white accent-primary cursor-pointer mt-0.5"
                    />
                    <div>
                      <span className="font-bold flex items-center gap-1 text-slate-800">
                        <ShieldCheck size={14} className="text-primary" /> Vetted Landlord Passport
                      </span>
                      <p className="text-[10px] text-slate-400 font-medium leading-tight">Restrict solely to owners who have passed ID facial matching and background criteria.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* 7. AMENITIES REQUIREMENT CHECKBOX MODULE */}
              <div className="space-y-2">
                <span className="block text-[11px] font-bold text-primary uppercase tracking-widest">
                  Required Condo Premium Facilities
                </span>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {amenitiesOptions.map((facility) => {
                    const isChecked = (filters.selectedAmenities || []).includes(facility.label);
                    return (
                      <button
                        key={facility.label}
                        type="button"
                        onClick={() => handleToggleAmenity(facility.label)}
                        className={`h-8 px-2.5 rounded-lg border text-left flex items-center justify-between font-semibold transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-primary/10 border-primary text-primary shadow-sm'
                            : 'bg-white border-outline-variant/50 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{facility.label}</span>
                        {isChecked && <Check size={12} className="stroke-[3] shrink-0 text-primary ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
