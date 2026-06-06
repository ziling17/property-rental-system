import React, { useState } from "react";
import { Property } from "../types";
import { MapPin, Bed, Bath, Maximize2, Sparkles, CheckCircle, Heart } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  key?: string;
  property: Property;
  onViewDetails: (property: Property) => void;
}

export default function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  // Determine badge styles based on design system rules
  const renderBadge = () => {
    if (property.stabilityScore >= 92) {
      return (
        <div className="absolute top-3 left-3 bg-[#ffe083] text-[#231b00] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-[#cea700]" fill="#cea700" />
          <span>{property.stabilityScore} Stability Score</span>
        </div>
      );
    } else {
      return (
        <div className="absolute top-3 left-3 bg-blue-50 text-primary border border-blue-100 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
          <CheckCircle className="w-3.5 h-3.5 text-primary" />
          <span>{property.badge || "Verified Hub"}</span>
        </div>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative h-56 overflow-hidden bg-gray-50">
        <img
          src={property.image}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {renderBadge()}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-colors ${isFavorite ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-white/80 text-[#737686] hover:bg-white"
            }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="p-5 space-y-3.5">
        <div>
          <h3 className="font-sans font-semibold text-lg text-on-surface leading-snug group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <p className="text-on-surface-variant text-sm flex items-center gap-1 mt-1 font-sans">
            <MapPin className="w-4 h-4 text-[#737686] shrink-0" />
            <span className="truncate">{property.location}</span>
          </p>
        </div>

        <div className="flex justify-between text-[#606365] text-xs py-2 border-y border-gray-100 font-sans">
          <span className="flex items-center gap-1"><Bed className="w-4 h-4 text-gray-400" /> {property.beds} Bed</span>
          <span className="flex items-center gap-1"><Bath className="w-4 h-4 text-gray-400" /> {property.baths} Bath</span>
          <span className="flex items-center gap-1"><Maximize2 className="w-4 h-4 text-gray-400" /> {property.sqft} sqft</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-primary font-bold text-xl">RM {property.price.toLocaleString()}</span>
            <span className="text-[11px] text-[#737686] font-medium uppercase tracking-wider">Per Month</span>
          </div>
          <button
            onClick={() => navigate(`/property/${property.id}`)}
            className="bg-blue-50 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm active:scale-95 duration-100 cursor-pointer"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
