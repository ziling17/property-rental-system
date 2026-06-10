import { ShieldCheck, Star, MapPin, Bed, Bath, Ruler, Check } from 'lucide-react';
import { Property } from '../types';
import { PROPERTIES } from '../bookingData';

interface PropertyCardProps {
  selectedProperty: Property;
  onSelectProperty: (property: Property) => void;
}

export default function PropertyCard({ selectedProperty, onSelectProperty }: PropertyCardProps) {
  return (
    <div className="flex flex-col gap-4">

      {/* Small inline property quick-switcher to easily toggle check different layouts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <span className="text-xs font-semibold uppercase tracking-wider text-outline shrink-0">
          Listing Selection:
        </span>
        {PROPERTIES.map((property) => (
          <button
            key={property.id}
            onClick={() => onSelectProperty(property)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-1 shrink-0 ${selectedProperty.id === property.id
                ? 'bg-primary text-on-primary font-semibold shadow-sm'
                : 'bg-white border border-outline-variant text-on-surface-variant hover:border-primary hover:bg-surface-container-low'
              }`}
            id={`switch-prop-${property.id}`}
          >
            {selectedProperty.id === property.id && <Check className="w-3 h-3 stroke-[2.5]" />}
            <span>{property.name.split(' ')[0]} ({property.beds}B)</span>
          </button>
        ))}
      </div>

      {/* Main Property Summary Card */}
      <div
        className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden flex flex-col md:flex-row gap-0 group hover:shadow-md transition-shadow duration-300"
        id="property-summary-container"
      >
        {/* Left Side: Image with Parallax & Hover scalability */}
        <div className="md:w-1/3 aspect-[4/3] md:aspect-auto overflow-hidden relative">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 origin-center min-h-[160px] md:min-h-[220px]"
            src={selectedProperty.imageUrl}
            alt={selectedProperty.name}
            id="property-main-img"
          />
          <div className="absolute top-3 left-3 bg-primary text-on-primary text-xs font-bold px-2 py-1 rounded">
            RM {selectedProperty.monthlyRent.toLocaleString('en-US', { minimumFractionDigits: 0 })}/mo
          </div>
        </div>

        {/* Right Side: Details and Attributes */}
        <div className="md:w-2/3 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3.5">

              {/* Verified Property chip */}
              <span className="bg-surface-container-high text-primary px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-primary/10">
                <ShieldCheck className="w-4 h-4 text-primary fill-primary/10" />
                Verified Property
              </span>

              {/* Rating chip */}
              <div className="flex items-center gap-1 text-tertiary">
                <Star className="w-4.5 h-4.5 fill-tertiary text-tertiary" />
                <span className="font-semibold text-sm">{selectedProperty.rating}</span>
              </div>
            </div>

            {/* Title & Location details */}
            <h2 className="text-xl font-bold text-on-surface mb-2 tracking-tight group-hover:text-primary transition-colors">
              {selectedProperty.name}
            </h2>

            <p className="text-on-surface-variant text-sm flex items-center gap-1 font-medium">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{selectedProperty.location}</span>
            </p>
          </div>

          {/* Bed, Bath, Sqft Details */}
          <div className="mt-6 pt-4 border-t border-outline-variant/60 flex items-center gap-5 text-on-secondary-container">
            <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Bed className="w-5 h-5 text-primary/80" />
              <span className="text-sm font-medium">{selectedProperty.beds} Beds</span>
            </div>

            <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Bath className="w-5 h-5 text-primary/80" />
              <span className="text-sm font-medium">{selectedProperty.baths} Baths</span>
            </div>

            <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Ruler className="w-5 h-5 text-primary/80" />
              <span className="text-sm font-medium">{selectedProperty.sqft.toLocaleString()} sqft</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
