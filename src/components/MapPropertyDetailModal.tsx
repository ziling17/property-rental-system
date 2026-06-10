import React, { useState } from "react";
import { Property } from "../types";
import { 
  X, Check, ShieldCheck, HelpCircle, User, Phone, 
  Star, Calendar, Clock, DollarSign, Calculator, ChevronRight, CheckCircle2 
} from "lucide-react";

interface PropertyDetailModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (bookingDetails: { date: string; time: string; notes: string }) => void;
}

export default function PropertyDetailModal({
  property,
  isOpen,
  onClose,
  onConfirmBooking,
}: PropertyDetailModalProps) {
  // Booking state
  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingTime, setBookingTime] = useState<string>("10:00 AM");
  const [bookingNotes, setBookingNotes] = useState<string>("");
  const [isBooked, setIsBooked] = useState<boolean>(false);

  // Financial Advisor state
  const [monthlySalary, setMonthlySalary] = useState<number>(8000);
  const [calculatedDep, setCalculatedDep] = useState({
    deposit: property.price * 2, // 2 months security deposit
    utility: property.price * 0.5, // 0.5 month utility deposit
    processing: 250, // Agreement fee
    total: property.price * 2.5 + 250
  });

  if (!isOpen) return null;

  // Render variables for income suitability checker
  const rentRatio = (property.price / (monthlySalary || 1)) * 100;
  let suitabilityLabel = "Excellent";
  let suitabilityColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (rentRatio > 40) {
    suitabilityLabel = "High Budget Risk (>40%)";
    suitabilityColor = "bg-rose-50 text-rose-700 border-rose-100";
  } else if (rentRatio > 30) {
    suitabilityLabel = "Moderate (Rent is 30-40% of salary)";
    suitabilityColor = "bg-amber-50 text-amber-700 border-amber-100";
  } else {
    suitabilityLabel = "Aesthetic Budget Fit (<30%)";
  }

  // Handle Booking
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate) {
      alert("Please select a date for the property viewing.");
      return;
    }
    onConfirmBooking({
      date: bookingDate,
      time: bookingTime,
      notes: bookingNotes
    });
    setIsBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      {/* Container Card */}
      <div 
        className="relative w-full max-w-4xl bg-white rounded-none md:rounded-3xl shadow-2xl flex flex-col my-auto max-h-full overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-20 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-[#2563eb] font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
              {property.area} Property Insight
            </span>
            {property.isVerified && (
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 font-semibold text-xs px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Escrow
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="overflow-y-auto p-6 flex-grow max-h-[85vh] md:max-h-[75vh]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Main Insights (7-cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Media banner */}
              <div className="relative w-full h-[260px] rounded-2xl overflow-hidden bg-slate-50 shadow-inner">
                <img 
                  src={property.imageUrl} 
                  alt={property.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-slate-900/75 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                  {property.propertyType}
                </div>
              </div>

              {/* General details title and specs */}
              <div>
                <h2 className="font-sans font-extrabold text-[24px] text-slate-900 leading-tight mb-2">
                  {property.title}
                </h2>
                <p className="text-[14px] text-slate-500 font-medium mb-4">
                  {property.location}
                </p>

                {/* Grid stats */}
                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">Bedrooms</span>
                    <span className="font-sans font-extrabold text-[16px] text-[#2563eb]">{property.beds} Rooms</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">Bathrooms</span>
                    <span className="font-sans font-extrabold text-[16px] text-[#2563eb]">{property.baths} Baths</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">Build-up Area</span>
                    <span className="font-sans font-extrabold text-[16px] text-[#2563eb]">{property.sqft.toLocaleString()} sqft</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-[14px] uppercase font-extrabold text-slate-800 tracking-wider mb-2">
                  About this property
                </h4>
                <p className="text-[14px] leading-relaxed text-slate-600">
                  {property.description}
                </p>
              </div>

              {/* Amenities checklist */}
              <div>
                <h4 className="text-[14px] uppercase font-extrabold text-slate-800 tracking-wider mb-3">
                  Included Amenities & Facilities
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {property.amenities.map((amenity, key) => (
                    <div key={key} className="flex items-center gap-2 text-[13px] text-slate-700 font-medium">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Landlord information card */}
              <div className="bg-blue-50/50 border border-blue-50 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={property.landlord.avatarUrl} 
                      alt={property.landlord.name} 
                      className="w-12 h-12 rounded-full object-cover border border-white shadow-sm"
                    />
                    {property.landlord.isVerified && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border border-white text-white flex items-center justify-center text-[8px] font-bold" title="Verified Landlord">
                        ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400 font-bold uppercase">Landlord</span>
                    <h5 className="font-sans font-bold text-slate-800 text-[14px]">
                      {property.landlord.name}
                    </h5>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[11px] text-slate-600 font-semibold">{property.landlord.rating} rating</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">PHONE CONTACT</span>
                  <p className="font-mono text-slate-800 text-xs font-bold bg-white px-2.5 py-1.5 rounded-lg border border-slate-100">
                    {property.landlord.phone}
                  </p>
                </div>
              </div>

            </div>

            {/* Right Interactive Sidebar forms (5-cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Trust escrow calculator box */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-5 h-5 text-[#2563eb]" />
                  <h4 className="font-sans font-bold text-slate-800 text-[15px]">
                    MySewa Trust Calculator
                  </h4>
                </div>

                {/* Subtitle / deposit details */}
                <div className="flex flex-col gap-2.5 mb-4 text-[13px]">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Monthly Rental:</span>
                    <span className="font-bold text-slate-900">RM {property.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center gap-0.5">
                      Security Deposit 
                      <span className="text-[10px] text-[#2563eb] font-semibold bg-blue-100 px-1 rounded">2 mo</span>
                    </span>
                    <span className="font-medium text-slate-800">RM {calculatedDep.deposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center gap-0.5">
                      Utility Deposit 
                      <span className="text-[10px] text-[#2563eb] font-semibold bg-blue-100 px-1 rounded">0.5 mo</span>
                    </span>
                    <span className="font-medium text-slate-800">RM {calculatedDep.utility.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Legal Agreement:</span>
                    <span className="font-medium text-slate-800">RM {calculatedDep.processing}</span>
                  </div>
                  <div className="w-full h-px border-t border-dashed border-slate-200 my-1" />
                  <div className="flex justify-between items-center font-bold text-[14px]">
                    <span className="text-slate-800">Move-in Cost (Total):</span>
                    <span className="text-[#2563eb] text-[16px]">RM {calculatedDep.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Salary fitting input */}
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-inner">
                  <label className="block text-[11px] text-slate-500 font-bold uppercase mb-1">
                    Your Net Monthly Income (RM):
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-bold font-sans text-sm">RM</span>
                    <input 
                      type="number" 
                      value={monthlySalary} 
                      onChange={(e) => setMonthlySalary(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full text-slate-800 font-bold focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Score badge fit report */}
                <div className={`mt-3 border px-3 py-2 rounded-xl flex items-center justify-between text-xs font-semibold ${suitabilityColor}`}>
                  <span>Affordability Rating:</span>
                  <span className="font-extrabold uppercase">{suitabilityLabel}</span>
                </div>
              </div>

              {/* Tour Appointment Booking */}
              <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 ring-4 ring-blue-50/40">
                <h4 className="font-sans font-bold text-slate-900 text-[16px] mb-1 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#2563eb]" />
                  Schedule A Viewing
                </h4>
                <p className="text-[12px] text-slate-500 mb-4 font-medium leading-normal">
                  Arrange a physical or live-video walkthrough of the unit. The landlord will review and confirm within 2 hours.
                </p>

                {isBooked ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 animate-bounce" />
                    <h5 className="font-sans font-bold text-emerald-800 text-[14px] mb-1">
                      Appointment Submitted!
                    </h5>
                    <p className="text-xs text-emerald-700 leading-normal mb-3">
                      Your booking request has been locked with **{property.landlord.name}** for **{bookingDate}** at **{bookingTime}**. We will ping you on your registered email.
                    </p>
                    <button
                      onClick={() => setIsBooked(false)}
                      className="text-xs text-[#2563eb] hover:underline font-bold"
                    >
                      Reschedule / Change Slot
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="flex flex-col gap-3.5">
                    {/* Date Selector */}
                    <div>
                      <label className="block text-[11px] text-slate-500 font-bold uppercase mb-1">
                        Select Viewing Date:
                      </label>
                      <input 
                        type="date" 
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl text-slate-700 text-sm font-medium border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563eb]"
                      />
                    </div>

                    {/* Time Slot Selector */}
                    <div>
                      <label className="block text-[11px] text-slate-500 font-bold uppercase mb-1">
                        Select Preferred Time:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["10:00 AM", "2:00 PM", "5:30 PM"].map((timeOption) => (
                          <button
                            type="button"
                            key={timeOption}
                            onClick={() => setBookingTime(timeOption)}
                            className={`py-2 px-1 text-center font-semibold text-xs rounded-lg border transition-all ${
                              bookingTime === timeOption
                                ? "bg-blue-50 text-[#2563eb] border-[#2563eb]"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {timeOption}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes for landlord */}
                    <div>
                      <label className="block text-[11px] text-slate-500 font-bold uppercase mb-1">
                        Add Special Notes (Optional):
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Any kids or pet considerations, preferred meeting type (video/live)..."
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-1.5 bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold text-[14px] py-3 rounded-xl transition-all shadow-md active:scale-98"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Request Free Walkthrough</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Secure Escrow protection reminder */}
              <div className="bg-emerald-50/50 border border-emerald-50 rounded-2xl p-4 flex gap-3 text-xs">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-slate-800">MySewa Secure Deposit Shield</span>
                  <p className="text-slate-600 leading-relaxed">
                    Under Malaysia property guidelines, your security deposits are held in a secure third-party escrow account. Funds are released exclusively upon successful key handover and structural inspection.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
