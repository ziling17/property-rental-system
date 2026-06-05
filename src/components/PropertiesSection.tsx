import { useState, useMemo } from 'react';
import { MapPin, Bed, Bath, Maximize2, Zap, Search, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';
import { Property } from '../types';
import { PROPERTIES } from '../propertiesData';

interface PropertiesSectionProps {
  onPropertySelect: (property: Property) => void;
  searchKeyword: string;
  onClearSearch: () => void;
}

export default function PropertiesSection({
  onPropertySelect,
  searchKeyword,
  onClearSearch
}: PropertiesSectionProps) {
  // Filter States
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(7000);
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('score-desc');
  const [showFilters, setShowFilters] = useState(false);

  // Sync keyword from Hero
  const activeSearch = searchKeyword || localSearch;

  // Cities extracted dynamically
  const cities = useMemo(() => {
    const list = new Set(PROPERTIES.map(p => p.city));
    return ['All', ...Array.from(list)];
  }, []);

  // Filtered and Sorted list
  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter(prop => {
      // Search text match
      const searchTarget = `${prop.name} ${prop.location} ${prop.description} ${prop.amenities.join(' ')}`.toLowerCase();
      const matchesSearch = activeSearch ? searchTarget.includes(activeSearch.toLowerCase()) : true;

      // City match
      const matchesCity = selectedCity === 'All' ? true : prop.city === selectedCity;

      // Price match
      const matchesPrice = prop.price <= maxPrice;

      // Stability score match
      const matchesScore = prop.stabilityScore >= minScore;

      return matchesSearch && matchesCity && matchesPrice && matchesScore;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'score-desc') return b.stabilityScore - a.stabilityScore;
      return 0; // default
    });
  }, [activeSearch, selectedCity, maxPrice, minScore, sortBy]);

  const handleClearAll = () => {
    setLocalSearch('');
    setSelectedCity('All');
    setMaxPrice(7000);
    setMinScore(0);
    setSortBy('score-desc');
    onClearSearch();
  };

  return (
    <section className="py-20 bg-[#f8f9ff]" id="properties-section">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark mb-2">
              Featured Verified Properties
            </h2>
            <p className="text-sm md:text-base text-brand-dark-text">
              Hand-picked residences with certified high stability scores, matching your preferences.
            </p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 md:flex-initial h-11 px-4 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                showFilters 
                  ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' 
                  : 'bg-white border-brand-border text-brand-dark hover:bg-brand-light-blue'
              }`}
              id="toggle-filters-btn"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Advanced Filters
              { (selectedCity !== 'All' || maxPrice < 7000 || minScore > 0) && (
                <span className="w-2 h-2 rounded-full bg-brand-primary" />
              )}
            </button>
            
            <div className="relative flex-1 md:w-48">
              <ArrowUpDown className="w-4 h-4 text-brand-dark-text/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white text-brand-dark font-sans h-11 pl-9 pr-3 rounded-xl border border-brand-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                id="properties-sort-select"
              >
                <option value="score-desc">Top Stability Score</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sync Indicator warning if search is active */}
        {searchKeyword && (
          <div className="mb-6 flex items-center justify-between bg-brand-light-blue py-3 px-5 rounded-xl border border-brand-border">
            <p className="text-xs md:text-sm text-brand-primary font-semibold">
              Showing active results for locations matching "<span className="underline font-bold">{searchKeyword}</span>"
            </p>
            <button 
              onClick={handleClearAll}
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1 cursor-pointer"
              id="clear-search-bubble"
            >
              <X className="w-3.5 h-3.5" /> Clear Search
            </button>
          </div>
        )}

        {/* Filter Drawer / Panel */}
        {showFilters && (
          <div className="mb-8 p-6 bg-white rounded-2xl border border-brand-border/60 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in" id="filter-panel">
            
            {/* Search Input Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                Refine Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-brand-dark-text/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Keyword, beds, condo..."
                  className="w-full bg-white text-brand-dark placeholder:text-brand-dark-text/40 h-10 pl-9 pr-3 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  id="filter-refine-input"
                />
              </div>
            </div>

            {/* City Selection Tab */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                State / Location
              </label>
              <div className="flex flex-wrap gap-1.5">
                {cities.map(cty => (
                  <button
                    key={cty}
                    onClick={() => setSelectedCity(cty)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      selectedCity === cty
                        ? 'bg-brand-primary text-white shadow-sm'
                        : 'bg-brand-light-blue text-brand-primary hover:bg-brand-border/50'
                    }`}
                  >
                    {cty}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Budget Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-brand-dark uppercase tracking-wider">
                  Max Monthly Rental
                </span>
                <span className="font-extrabold text-brand-primary text-sm">
                  RM {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1500"
                max="7000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-1.5 bg-brand-light-blue rounded-lg appearance-none cursor-pointer accent-brand-primary"
                id="budget-slider"
              />
              <div className="flex justify-between text-[10px] text-brand-dark-text font-bold">
                <span>RM 1,500</span>
                <span>RM 4,000</span>
                <span>RM 7,000</span>
              </div>
            </div>

            {/* Minimum Stability Requirement Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                Verification Rating
              </label>
              <div className="flex gap-2">
                {[0, 92, 95, 98].map(score => (
                  <button
                    key={score}
                    onClick={() => setMinScore(score)}
                    className={`flex-1 h-9 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      minScore === score
                        ? 'bg-brand-yellow border-[#eab308] text-[#574500] shadow-sm'
                        : 'bg-white border-brand-border text-brand-dark hover:bg-brand-light-blue'
                    }`}
                  >
                    {score === 0 ? 'All' : `${score}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters Action Row */}
            <div className="md:col-span-4 pt-4 border-t border-brand-border/40 flex justify-between items-center">
              <p className="text-xs text-brand-dark-text font-medium">
                Showing <span className="font-bold text-brand-dark">{filteredProperties.length}</span> matching properties
              </p>
              <button
                onClick={handleClearAll}
                className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
                id="clear-all-filters"
              >
                Reset All Filters
              </button>
            </div>

          </div>
        )}

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop) => (
              <div
                key={prop.id}
                onClick={() => onPropertySelect(prop)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 border border-brand-border/40 cursor-pointer transition-all duration-300 group flex flex-col h-full"
                id={`property-card-${prop.id}`}
              >
                {/* Image & Spark/Rating Badges */}
                <div className="relative h-64 overflow-hidden bg-brand-light-blue">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={prop.image}
                    alt={prop.name}
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Reliability/Stability Score Tag */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-brand-yellow text-[#574500] px-3 py-1 rounded-full flex items-center gap-1 shadow-sm border border-brand-yellow/30">
                      <Zap className="w-3.5 h-3.5 fill-[#735c00]" />
                      <span className="text-[11px] font-extrabold">{prop.stabilityScore} Score</span>
                    </div>
                  </div>

                  {/* Pricing Badge Overlay */}
                  <div className="absolute bottom-4 left-4 bg-brand-dark/85 backdrop-blur-sm text-white py-1 px-3 rounded-lg text-xs font-bold">
                    RM {prop.price.toLocaleString()} / mo
                  </div>
                </div>

                {/* Info Fields */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-lg font-bold text-brand-dark tracking-tight line-clamp-1 group-hover:text-brand-primary transition-colors">
                        {prop.name}
                      </h3>
                      <span className="text-[10px] uppercase font-extrabold text-brand-primary bg-brand-light-blue px-2 py-0.5 rounded border border-brand-primary/10">
                        {prop.type}
                      </span>
                    </div>
                    
                    <p className="flex items-center gap-1 text-xs text-brand-dark-text font-semibold">
                      <MapPin className="w-4 h-4 text-brand-primary" />
                      {prop.location}
                    </p>
                    
                    <p className="text-xs text-brand-dark-text/90 line-clamp-2 leading-relaxed pt-1">
                      {prop.description}
                    </p>
                  </div>

                  {/* Features metadata list */}
                  <div className="flex gap-4 border-t border-brand-border/60 pt-4 mt-6 text-brand-dark-text/90 font-bold text-xs justify-between">
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-4 h-4 text-brand-primary" />
                      <span>{prop.beds} Bed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-4 h-4 text-brand-primary" />
                      <span>{prop.baths} Bath</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-brand-primary" />
                      <span>{prop.sizeSqft.toLocaleString()} sqft</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-2xl border border-brand-border/50 max-w-xl mx-auto space-y-4 shadow-sm">
            <SlidersHorizontal className="w-12 h-12 text-brand-dark-text/40 mx-auto" />
            <h3 className="text-lg font-bold text-brand-dark">No properties match your current filters</h3>
            <p className="text-sm text-brand-dark-text max-w-sm mx-auto">
              Try extending your rental budget limit, selecting another location, or lowering your stability score criteria.
            </p>
            <button
              onClick={handleClearAll}
              className="bg-brand-primary text-white font-bold h-10 px-5 rounded-lg text-sm hover:shadow-md transition-all cursor-pointer"
              id="empty-clear-btn"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
