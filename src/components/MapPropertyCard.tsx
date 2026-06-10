import React from "react";
import { Property } from "../types";
import { Heart, Star, Sparkles, Building2, Eye, Calendar, ShieldCheck, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PropertyCardProps {
  property: Property;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onOpenDetails: () => void; // Trigger for modal/detail sheet view
}

export default function PropertyCard({
  property,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onOpenDetails,
}: PropertyCardProps) {
  const navigate = useNavigate();

  return (
    <div
      id={`property-card-${property.id}`}
      onClick={onSelect}
      className={`group relative flex flex-col bg-white rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${isSelected
        ? "border-[#2563eb] ring-2 ring-blue-50/70 shadow-md"
        : "border-[#e5e7eb] hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5"
        }`}
    >
      {/* Property Image & Badge Headers */}
      <div className="relative w-full h-[220px] overflow-hidden bg-slate-100">
        <img
          src={property.imageUrl}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Dynamic Badges based on type or score */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {property.isVerified && (
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-900 shadow-sm border border-slate-100">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Verified</span>
            </div>
          )}

          {property.matchScore && (
            <div className="flex items-center gap-1 bg-[#fef08a] px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-900 shadow-sm border border-[#fde047]">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
              <span>Match Score: {property.matchScore}%</span>
            </div>
          )}
        </div>

        {/* Favorite Button Overlay */}
        <button
          onClick={onToggleFavorite}
          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-150 transition-all active:scale-90 hover:bg-white z-10`}
          title={isFavorite ? "Remove from Saved" : "Save Property"}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${isFavorite
              ? "text-red-500 fill-red-500 scale-110"
              : "text-slate-600 group-hover:text-red-500"
              }`}
          />
        </button>

        {/* Subtle spec overlay overlaying the image bottom */}
        <div className="absolute bottom-2 right-2 bg-slate-900/85 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] text-white font-mono uppercase tracking-wider z-10">
          {property.propertyType}
        </div>
      </div>

      {/* Property Details Container */}
      <div className="flex flex-col p-5 flex-grow">
        {/* Row 1: Title and Price */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-sans font-bold text-slate-900 text-[18px] tracking-tight leading-tight group-hover:text-[#2563eb] transition-colors">
            {property.title}
          </h3>
          <div className="text-right flex-shrink-0">
            <span className="font-sans font-extrabold text-[#2563eb] text-[18px]">
              RM {property.price.toLocaleString()}
            </span>
            <span className="text-[12px] text-slate-500 font-medium block -mt-1">
              /mo
            </span>
          </div>
        </div>

        {/* Row 2: Location and Area */}
        <p className="flex items-center gap-1 text-[13px] text-slate-500 font-medium mb-4">
          <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="truncate" title={property.location}>
            {property.location}
          </span>
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-slate-100 mb-4" />

        {/* Row 3: Specifications and Facilities */}
        <div className="flex items-center justify-between text-[13px] text-slate-600 font-semibold mb-4">
          {/* Beds */}
          <div className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
              />
            </svg>
            <span>{property.beds} Bed{property.beds > 1 ? "s" : ""}</span>
          </div>

          {/* Baths */}
          <div className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 21v-1.5M4.5 8.25h15M10.5 3v1.5m3-1.5v1.5m-9 3h10.5a.75.75 0 01.75.75v6a3.75 3.75 0 01-3.75 3.75H10.5A3.75 3.75 0 016.75 12.75v-3.75a.75.75 0 01.75-.75z"
              />
            </svg>
            <span>{property.baths} Bath{property.baths > 1 ? "s" : ""}</span>
          </div>

          {/* Area sqft */}
          <div className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3.75v16.5m0-16.5h16.5m-16.5 0v16.5m16.5-16.5v16.5m0-16.5H3.75m16.5 16.5H3.75m16.5-16.5l-16.5 16.5"
              />
            </svg>
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Action button row */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/properties/${property.id}`);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#2563eb] text-white hover:bg-blue-700 active:bg-blue-800 text-[13px] font-bold py-2 px-3 rounded-lg transition-colors shadow-sm"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
              // Scroll map container into view if on mobile/smaller screens
              const elem = document.getElementById("map-container");
              if (elem) elem.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-blue-50 text-[#2563eb] hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
            title="Locate on Map"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
