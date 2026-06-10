import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  BedDouble, 
  Bath, 
  Square, 
  SlidersHorizontal, 
  Star, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  Heart,
  ChevronRight,
  ArrowRight,
  Info
} from 'lucide-react';
import { Property, Profile } from '../types';

interface SearchViewProps {
  properties: Property[];
  profile: Profile;
  onApplyForProperty: (propertyName: string) => void;
}

export default function SearchView({ properties, profile, onApplyForProperty }: SearchViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(7000);
  const [minBeds, setMinBeds] = useState<number>(0);
  
  // Selected property for custom details modal
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applyStep, setApplyStep] = useState<number>(1); // 1 = review, 2 = success
  const [favorites, setFavorites] = useState<string[]>([]);

  // Filtering Logic
  const filtered = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || prop.type === selectedType;
    const matchesPrice = prop.price <= maxPrice;
    const matchesBeds = prop.beds >= minBeds;
    return matchesSearch && matchesType && matchesPrice && matchesBeds;
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const startApplication = (prop: Property) => {
    setSelectedProperty(prop);
    setIsApplying(true);
    setApplyStep(1);
  };

  const handleApplySubmit = () => {
    if (!selectedProperty) return;
    setApplyStep(2);
    onApplyForProperty(selectedProperty.title);
  };

  const closeApplyModal = () => {
    setIsApplying(false);
    setSelectedProperty(null);
    setApplyStep(1);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none hidden md:block">
          {/* Subtle background decoration */}
          <div className="w-[450px] h-[450px] bg-white rounded-full mt-10 mr-10 blur-xl"></div>
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="bg-blue-500/30 text-blue-100 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
            Verified Housing Marketplace
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Find Pre-Approved Premium Homes
          </h2>
          <p className="text-blue-100 text-sm md:text-base mb-6 leading-relaxed">
            Your high-trust MySewa profile acts as an instant passport. Landlords can view your verified trust score of <strong className="text-white font-bold">{profile.trustScore}</strong> to fast-track approval without heavy paperwork.
          </p>

          {/* Quick Search input */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-inner">
            <div className="flex-grow flex items-center px-3 gap-2">
              <Search className="w-5 h-5 text-blue-200 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by city, neighborhood, or keywords..."
                className="bg-transparent border-none text-white placeholder-blue-200 text-sm focus:outline-none w-full outline-none"
              />
            </div>
            <button className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer shrink-0">
              Search Now
            </button>
          </div>
        </div>
      </div>

      {/* Filters Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        {/* Type Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Property Type</label>
          <div className="flex gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/60">
            {['All', 'Apartment', 'Villa'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedType === type
                    ? 'bg-white text-blue-600 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Price filter slider */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Max Monly Budget</label>
            <span className="text-xs font-bold text-blue-600">${maxPrice.toLocaleString()}/mo</span>
          </div>
          <input
            type="range"
            min="1000"
            max="7000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
            <span>$1,000/mo</span>
            <span>$4,000/mo</span>
            <span>$7,000/mo</span>
          </div>
        </div>

        {/* Bed filter */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">Minimum Bedrooms</label>
          <div className="flex justify-between bg-slate-50 p-1 rounded-xl border border-slate-200/60 font-sans">
            {[0, 1, 2, 3, 4].map((count) => (
              <button
                key={count}
                onClick={() => setMinBeds(count)}
                className={`w-10 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  minBeds === count
                    ? 'bg-white text-blue-600 shadow-sm font-extrabold'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {count === 0 ? 'Any' : `${count}+`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Results count */}
      <div className="flex justify-between items-center">
        <p className="text-slate-500 text-sm font-medium">
          Showing <span className="font-bold text-slate-800">{filtered.length}</span> premium properties found
        </p>
        {searchTerm || selectedType !== 'All' || minBeds !== 0 || maxPrice !== 7000 ? (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('All');
              setMinBeds(0);
              setMaxPrice(7000);
            }}
            className="text-xs text-blue-600 hover:underline font-bold cursor-pointer"
          >
            Clear Filters
          </button>
        ) : null}
      </div>

      {/* Properties Bento/Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400">
              <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="font-bold text-lg text-slate-700 mb-1">No homes match your filter requirements</p>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">Try widening your search terms or adjusting the budget filter.</p>
            </div>
          ) : (
            filtered.map((prop) => (
              <motion.div
                layout
                key={prop.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => startApplication(prop)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 block group overflow-hidden cursor-pointer"
              >
                {/* Promo/Image Area */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={prop.imageUrl}
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm shadow px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {prop.rating}
                  </div>
                  
                  {/* Quick badges */}
                  <button 
                    onClick={(e) => toggleFavorite(prop.id, e)}
                    className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors cursor-pointer bg-slate-900/40 text-white hover:text-red-500 hover:bg-slate-900/60"
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(prop.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 flex gap-1">
                    {prop.verified && (
                      <span className="bg-blue-600 text-white text-[10px] uppercase font-bold py-0.5 px-2.5 rounded-full shadow-sm flex items-center gap-0.5 border border-blue-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Ledger Verified
                      </span>
                    )}
                    <span className="bg-slate-900/60 text-white backdrop-blur-sm text-[10px] font-bold py-0.5 px-2.5 rounded-full">
                      {prop.type}
                    </span>
                  </div>
                </div>

                {/* Info Text */}
                <div className="p-5">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {prop.title}
                    </h4>
                    <span className="text-base font-extrabold text-slate-900 shrink-0">
                      ${prop.price.toLocaleString()}
                      <span className="text-[10px] text-slate-400 font-bold block text-right">/ month</span>
                    </span>
                  </div>

                  <p className="flex items-center text-xs text-slate-400 font-medium mb-4 gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {prop.location}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-slate-400 font-medium text-xs text-center">
                    <div className="flex items-center justify-center gap-1">
                      <BedDouble className="w-4 h-4 text-slate-400" />
                      <span>{prop.beds} Beds</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Bath className="w-4 h-4 text-slate-400" />
                      <span>{prop.baths} Baths</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prop.sqft} sqft</span>
                    </div>
                  </div>

                  {/* Curated list tags */}
                  <div className="flex flex-wrap gap-1 mt-4">
                    {prop.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Instant pass prompt */}
                  <div className="mt-5 flex items-center justify-between text-xs font-bold pt-1">
                    <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                      Match: 95%
                    </span>
                    <span className="text-slate-500 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex items-center gap-0.5">
                      Apply / view
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Application Dialog Modal */}
      <AnimatePresence>
        {isApplying && selectedProperty && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden relative"
            >
              {applyStep === 1 ? (
                <div>
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 relative">
                    <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                      <Award className="w-6 h-6 text-amber-300" />
                      Instant MySewa Lease Application
                    </h3>
                    <p className="text-blue-100 text-xs">Fast-tracking your application with security-backed credentials</p>

                    <button 
                      onClick={closeApplyModal}
                      className="absolute top-4 right-4 text-white/70 hover:text-white font-bold text-lg cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Property card summary */}
                    <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                      <img
                        src={selectedProperty.imageUrl}
                        alt={selectedProperty.title}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{selectedProperty.title}</h4>
                        <p className="text-xs text-slate-400 font-medium">{selectedProperty.location}</p>
                        <p className="text-xs font-extrabold text-blue-600 mt-1">${selectedProperty.price}/month</p>
                      </div>
                    </div>

                    {/* Passport Stats section */}
                    <div className="space-y-3">
                      <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Profile Stats Submitted
                      </h5>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          <div>
                            <span className="block text-[10px] text-slate-400 font-semibold leading-none mb-0.5">Trust Score</span>
                            <span className="text-sm font-extrabold text-slate-700">{profile.trustScore} / 100</span>
                          </div>
                        </div>
                        <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          <div>
                            <span className="block text-[10px] text-slate-400 font-semibold leading-none mb-0.5">Residence Verification</span>
                            <span className="text-sm font-extrabold text-slate-700">Verified ID</span>
                          </div>
                        </div>
                      </div>

                      {/* Warnings on lack of badges */}
                      {(!profile.idVerified || !profile.onTimePayer) && (
                        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">Improve your Match Rate!</span>
                            You can get instant pre-approval by completing additional checklist/badges like "On-time Payer" and "ID Verified" on your Profile.
                          </div>
                        </div>
                      )}
                    </div>

                    {/* About applicant quote */}
                    <div className="bg-slate-50 p-4 rounded-xl relative border-l-4 border-blue-500 italic text-xs text-slate-600 font-medium">
                      "{profile.aboutMe.substring(0, 160)}..."
                    </div>

                    {/* Apply Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={closeApplyModal}
                        className="w-full py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleApplySubmit}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer"
                      >
                        Submit Application
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm border border-emerald-100">
                    ✓
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-slate-800">Application Submitted!</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Amazing! Your verified tenant information has been securely transmitted to landlord <strong className="font-semibold text-slate-800">{selectedProperty.landlordName}</strong>. 
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl max-w-xs mx-auto border border-slate-100/80">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status on MySewa ledger</div>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold border border-amber-200 inline-block shadow-sm">
                      Pending Landlord Review
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    This unit has also been automatically listed under your <strong className="font-semibold text-slate-500">Rental History Feed</strong> as a Pending application record.
                  </p>

                  <button
                    onClick={closeApplyModal}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Back to Listings
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
