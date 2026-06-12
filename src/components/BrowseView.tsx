import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Sparkles,
  ArrowUpRight,
  MapPin,
  UserCheck,
  DollarSign,
  ShieldAlert,
  Star,
  Award,
  Flame,
  User,
  CheckCircle2
} from 'lucide-react';
import { Property, Profile } from '../types';

interface BrowseProps {
  properties: Property[];
  profile: Profile;
  onApplyForProperty: (propertyName: string) => void;
}

export default function BrowseView({ properties, profile, onApplyForProperty }: BrowseProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'high_rating' | 'verified_landlord' | 'budget'>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const getFilteredProperties = () => {
    switch (activeCategory) {
      case 'high_rating':
        return [...properties].sort((a, b) => b.rating - a.rating);
      case 'verified_landlord':
        return properties.filter(p => p.verified);
      case 'budget':
        return properties.filter(p => p.price <= 2500);
      default:
        return properties;
    }
  };

  const currentProperties = getFilteredProperties();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Editorial Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 flex items-center gap-1">
            <Compass className="w-4 h-4 text-blue-600" />
            Curated Collectives
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-930 mt-1">
            Explore Handpicked Sanctuaries
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-lg font-medium">
            Discover secure housing units and verified listing options curated based on community ratings and structural design metrics.
          </p>
        </div>

        {/* Category Controls Grid */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', title: 'All Listings', icon: <Compass className="w-3.5 h-3.5" /> },
            { id: 'high_rating', title: 'Top Rated', icon: <Flame className="w-3.5 h-3.5" /> },
            { id: 'verified_landlord', title: 'Trust-Verified', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
            { id: 'budget', title: 'Under $2.5K/mo', icon: <DollarSign className="w-3.5 h-3.5" /> },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${activeCategory === cat.id
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm font-extrabold'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                }`}
            >
              {cat.icon}
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Curated Bento list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {currentProperties.slice(0, 2).map((prop, idx) => (
          <div
            key={prop.id}
            onClick={() => setSelectedProperty(prop)}
            className={`cursor-pointer group relative overflow-hidden rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-lg ${idx === 0 ? 'lg:col-span-8' : 'lg:col-span-4'
              }`}
          >
            <div className="h-64 sm:h-80 bg-slate-100 overflow-hidden relative">
              <img
                src={prop.imageUrl}
                alt={prop.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Corner badge */}
              <div className="absolute top-4 left-4 flex gap-1.5 z-10">
                <span className="bg-amber-100/90 backdrop-blur-md text-amber-800 text-[10px] uppercase font-extrabold py-1 px-3 rounded-full flex items-center gap-1 border border-amber-200 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-600 fill-amber-300" />
                  Premium Choice
                </span>
                {prop.verified && (
                  <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] uppercase font-extrabold py-1 px-3 rounded-full flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                    Verified
                  </span>
                )}
              </div>

              {/* Overlaid Price Tag */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-slate-800 font-extrabold px-3 py-1.5 rounded-2xl text-xs shadow">
                ${prop.price.toLocaleString()}/mo
              </div>

              {/* Bottom text overlays */}
              <div className="absolute bottom-6 left-6 right-6 text-white z-10 space-y-2">
                <p className="text-xs font-semibold text-blue-200 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-200" />
                  {prop.location}
                </p>
                <h3 className="text-xl md:text-2xl font-extrabold tracking-tight group-hover:text-blue-200 transition-colors">
                  {prop.title}
                </h3>
                <p className="text-xs text-slate-200/95 leading-relaxed font-medium line-clamp-2 md:block hidden">
                  {prop.description}
                </p>

                {/* Micro badges on main item cards */}
                <div className="flex items-center gap-4 pt-1.5 text-xs text-slate-100 font-bold border-t border-white/10">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {prop.rating} ({prop.reviewsCount} reviews)
                  </span>
                  <span>{prop.beds} Beds · {prop.baths} Baths</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Regular catalog cards */}
        {currentProperties.slice(2).map(prop => (
          <div
            key={prop.id}
            onClick={() => setSelectedProperty(prop)}
            className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="h-48 bg-slate-100 overflow-hidden relative">
              <img
                src={prop.imageUrl}
                alt={prop.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm shadow px-2.5 py-1 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {prop.rating}
              </div>
              <div className="absolute top-3 right-3 bg-blue-600 text-white font-extrabold px-3 py-1 rounded-full text-[11px] shadow">
                ${prop.price}/mo
              </div>
            </div>

            <div className="p-5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{prop.type}</span>
              <h4 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                {prop.title}
              </h4>
              <p className="flex items-center text-xs text-slate-400 font-medium gap-1 line-clamp-1">
                <MapPin className="w-3.5 h-3.5 text-slate-300" />
                {prop.location}
              </p>

              <div className="text-xs text-slate-400 font-semibold flex gap-3 pt-2">
                <span>{prop.beds} Bedrooms</span>
                <span>•</span>
                <span>{prop.baths} Bathrooms</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Property Details Dialog Overlay */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden relative flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedProperty(null)}
                className="absolute top-4 right-4 bg-slate-900/40 text-white hover:bg-slate-900/60 transition-colors p-2 rounded-full cursor-pointer z-10 hover:skew-x-1.5 duration-100 font-bold"
              >
                ✕
              </button>

              <div className="overflow-y-auto w-full">
                {/* Hero banner image */}
                <div className="h-60 bg-slate-100 relative">
                  <img
                    src={selectedProperty.imageUrl}
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-6 text-white space-y-1">
                    <span className="bg-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow">
                      {selectedProperty.type}
                    </span>
                    <h3 className="text-2xl font-extrabold tracking-tight">{selectedProperty.title}</h3>
                  </div>
                </div>

                {/* Info and Landlord section */}
                <div className="p-6 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-slate-100">
                    <div className="text-center sm:text-left">
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Monthly Leasing</span>
                      <span className="text-2xl font-extrabold text-slate-800">${selectedProperty.price.toLocaleString()}</span>
                    </div>

                    <div className="flex gap-4 text-xs font-bold text-slate-500">
                      <div className="bg-slate-50 px-3 py-2 rounded-xl text-center border border-slate-100">
                        <span className="block text-slate-400 text-[10px] uppercase">Bedrooms</span>
                        <span className="text-slate-800 font-bold">{selectedProperty.beds}</span>
                      </div>
                      <div className="bg-slate-50 px-3 py-2 rounded-xl text-center border border-slate-100">
                        <span className="block text-slate-400 text-[10px] uppercase">Bathrooms</span>
                        <span className="text-slate-800 font-bold">{selectedProperty.baths}</span>
                      </div>
                      <div className="bg-slate-50 px-3 py-2 rounded-xl text-center border border-slate-100">
                        <span className="block text-slate-400 text-[10px] uppercase">Living Area</span>
                        <span className="text-slate-800 font-bold">{selectedProperty.sqft} sqft</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Property description</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{selectedProperty.description}</p>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Included Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.amenities.map(amenity => (
                        <span
                          key={amenity}
                          className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200/50"
                        >
                          ✓ {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Landlord information card */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedProperty.landlordAvatar}
                        alt={selectedProperty.landlordName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md bg-white"
                      />
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold leading-none mb-1">Listed by Verified Landlord</div>
                        <div className="font-extrabold text-sm text-slate-800">{selectedProperty.landlordName}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-200 shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        100% Response Rate
                      </span>
                    </div>
                  </div>

                  {/* Action block */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setSelectedProperty(null)}
                      className="w-full py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer"
                    >
                      Close Description
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProperty(null);
                        onApplyForProperty(selectedProperty.title);
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer"
                    >
                      Apply using MySewa Profile
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}