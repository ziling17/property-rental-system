import { useState, FormEvent } from 'react';
import { X, MapPin, Bed, Bath, Maximize2, Zap, Check, ShieldCheck, Mail, Calendar, Compass, Clock, CheckCircle, Smartphone } from 'lucide-react';
import { Property } from '../types';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  userProfile: { name: string; score: number; role: 'tenant' | 'landlord' | null } | null;
}

export default function PropertyDetailModal({
  property,
  onClose,
  userProfile
}: PropertyDetailModalProps) {
  const [bookingDate, setBookingDate] = useState('');
  const [message, setMessage] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Form Submission
  const handleRequestMatch = (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setIsBooked(true);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/65 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-brand-border animate-scale-up"
        id={`property-detail-modal-${property.id}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-brand-dark flex items-center justify-center shadow-md border hover:scale-105 transition-all cursor-pointer font-extrabold"
          id="close-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero image and price */}
        <div className="relative h-64 md:h-80 bg-brand-light-blue overflow-hidden shrink-0">
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-6 left-6 text-white space-y-1">
            <div className="inline-flex items-center gap-1 bg-brand-yellow text-brand-dark px-3 py-1 rounded-full text-xs font-bold border border-brand-yellow/30 shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-[#735c00]" />
              <span className="font-extrabold">{property.stabilityScore} Stability Score</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {property.name}
            </h2>
          </div>

          <div className="absolute bottom-6 right-6 bg-brand-primary/95 text-white font-black text-lg md:text-xl py-2 px-5 rounded-2xl shadow-md border border-white/20">
            RM {property.price.toLocaleString()} <span className="text-xs font-semibold">/ month</span>
          </div>
        </div>

        {/* Details and Actions Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Life Details block (7 columns) */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Specs Summary Row */}
            <div className="flex gap-4 bg-brand-light-blue p-4 rounded-2xl border border-brand-border/60 text-brand-dark font-bold text-sm justify-between">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-brand-primary" />
                <span>{property.beds} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-4 h-4 text-brand-primary" />
                <span>{property.baths} Bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-brand-primary" />
                <span>{property.sizeSqft.toLocaleString()} sqft</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-brand-dark">About this property</h4>
              <p className="text-sm text-brand-dark-text/95 leading-relaxed">{property.description}</p>
            </div>

            {/* Listed Amenities */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-brand-dark">Certified Amenities</h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-brand-dark-text">
                {property.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-600/10">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Sites */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-brand-dark">Transit & Proximity Score</h4>
              <div className="grid grid-cols-1 gap-1.5 text-xs font-semibold text-brand-dark-text">
                {property.nearbySites.map(site => (
                  <p key={site} className="flex items-center gap-2 pl-1">
                    <Compass className="w-4 h-4 text-brand-primary shrink-0" />
                    <span>{site}</span>
                  </p>
                ))}
              </div>
            </div>

          </div>

          {/* Booking Action Column (5 columns) */}
          <div className="md:col-span-5 bg-[#f8f9ff] rounded-2xl p-5 border border-brand-border shadow-inner">
            {isBooked ? (
              <div className="text-center py-6 space-y-4 animate-scale-up">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto border-4 border-emerald-50">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold text-brand-dark">Verification Request Sent</h4>
                  <p className="text-[11px] text-brand-dark-text leading-relaxed">
                    Account matching complete. Our ground verification representative will contact you shortly to coordinate an augmented verification preview!
                  </p>
                </div>
                
                <div className="bg-white p-3 rounded-xl border border-brand-border text-left space-y-1.5">
                  <p className="text-[10px] font-bold text-brand-dark/90">Preview Summary:</p>
                  <p className="text-[11px] text-brand-dark text-slate-800 font-medium">Property: {property.name}</p>
                  {bookingDate && (
                    <p className="text-[11px] text-slate-700 font-medium">Scheduled Date: <span className="font-bold text-brand-primary">{bookingDate}</span></p>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="w-full bg-brand-primary text-white text-xs font-bold py-2 px-4 rounded-xl hover:brightness-110 cursor-pointer"
                >
                  Return to listings
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestMatch} className="space-y-4">
                <div className="border-b border-brand-border/60 pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Lease Match Booking
                  </h4>
                  <span className="text-[10px] text-slate-500 block pt-0.5">
                    Requires verified Stability Score verification pass.
                  </span>
                </div>

                {/* Display Current User State */}
                <div className="bg-white p-3.5 rounded-xl border border-brand-border space-y-1 text-xs">
                  {userProfile ? (
                    <>
                      <p className="font-extrabold text-[#735c00] flex items-center gap-1">
                        <span className="p-1 rounded bg-brand-yellow/30 text-[10px] font-black uppercase text-brand-dark mr-1">Your Profile:</span>
                        Verified Rating: {userProfile.score}%
                      </p>
                      <p className="text-[11px] text-emerald-600 font-bold">✓ Approved Deposit Reduction Eligible</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-red-500">Guest Visitor State</p>
                      <p className="text-[10px] text-brand-dark-text">Your estimated stability will be tracked using high-trust indicators.</p>
                    </>
                  )}
                </div>

                {/* Date Select */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-brand-dark uppercase tracking-wider block">
                    Ideal Verification Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-brand-dark-text/60 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-white text-brand-dark h-10 pl-9 pr-3 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      id="booking-date-input"
                    />
                  </div>
                </div>

                {/* Message Select */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-brand-dark uppercase tracking-wider block">
                    Message to Landlord
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="E.g. Hi there, I'd love to request an automated compliance match. Verified lease history is attached..."
                    className="w-full bg-white text-brand-dark p-3 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20 min-h-[80px]"
                    id="booking-message-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-brand-primary hover:brightness-110 text-white font-bold h-11 rounded-xl text-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  id="book-tour-submit"
                >
                  {isSending ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Securing Lease Match...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Request Booking / Match Match
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
