/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Shield, User, Heart, Send, Calendar, CheckSquare, Dumbbell, Wifi, Compass, Settings, AlertTriangle, CheckCircle, Calculator } from 'lucide-react';
import { Property, Inquiry } from '../types';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
  onBookInquiry: (inquiry: Inquiry) => void;
}

export const HomePropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  isSaved,
  onToggleSave,
  onBookInquiry,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stability' | 'compatibility' | 'book'>('overview');

  // States for Smart Compatibility Calculator
  const [income, setIncome] = useState<string>('12000');
  const [occupants, setOccupants] = useState<number>(2);
  const [showScore, setShowScore] = useState(false);

  // States for book inquiry form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState(`Hi Puan Sri/Dato/Mr, I'm very interested in Pavilion Residences and would love to schedule a property intelligence inspection. Please let me know your availability!`);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle inquiry submission
  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !date) {
      alert('Please fill out all required fields');
      return;
    }
    const inquiry: Inquiry = {
      propertyId: property.id,
      propertyName: property.name,
      name,
      email,
      date,
      message,
    };
    onBookInquiry(inquiry);
    setFormSubmitted(true);
  };

  // Perform calculation for rent compatibility
  const calculateCompatibility = () => {
    const monthlyIncome = parseFloat(income);
    if (isNaN(monthlyIncome) || monthlyIncome <= 0) return null;

    const rentRatio = (property.price / monthlyIncome) * 100;
    let score = 100;
    let status: 'Perfect Fit' | 'Highly Compatible' | 'Stretched' | 'High Risk' = 'Perfect Fit';
    let alertMessage = '';
    let statusColor = '';

    if (rentRatio <= 25) {
      score = 98;
      status = 'Perfect Fit';
      statusColor = 'text-green-600 bg-green-50 border-green-200';
      alertMessage = 'Excellent budget parity! Your rent is well within the 25% savings tier, which guarantees premier long-term security.';
    } else if (rentRatio <= 35) {
      score = 88;
      status = 'Highly Compatible';
      statusColor = 'text-blue-600 bg-blue-50 border-blue-200';
      alertMessage = 'Steady fit. Your monthly rent claims between 26% and 35% of your declared income, which aligns comfortably with general property recommendations.';
    } else if (rentRatio <= 45) {
      score = 65;
      status = 'Stretched';
      statusColor = 'text-amber-600 bg-amber-50 border-amber-200';
      alertMessage = 'Fidelity boundaries stretched. Rent consumes over 35% of income. If taking this unit, we recommend utilizing deposit protection insurance.';
    } else {
      score = 35;
      status = 'High Risk';
      statusColor = 'text-red-600 bg-red-50 border-red-200';
      alertMessage = 'Severe risk warning. Rent constitutes more than 45% of gross income, raising vulnerability indicators. Consider properties under RM ' + (monthlyIncome * 0.35).toFixed(0);
    }

    return { score: Math.round(score), rentRatio: rentRatio.toFixed(1), status, alertMessage, statusColor };
  };

  const currentResult = calculateCompatibility();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Dark overlay with blur effect */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Main Dialog card */}
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full z-10 max-h-[90vh] flex flex-col md:flex-row transition-all border border-outline-variant/30">

        {/* Left Side: Property Visuals & Summary */}
        <div className="w-full md:w-1/2 relative bg-slate-100 flex flex-col justify-end min-h-[300px] md:min-h-0">
          <img
            src={property.image}
            alt={property.name}
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent" />

          {/* Top visual controls */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 h-10 w-10 rounded-full bg-slate-900/40 hover:bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer border border-white/20"
            title="Go back"
          >
            <X size={20} />
          </button>

          <button
            onClick={(e) => onToggleSave(e, property.id)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-slate-900/40 hover:bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer border border-white/20"
            title={isSaved ? "Remove from saved" : "Save list"}
          >
            <Heart size={20} className={isSaved ? "fill-red-500 text-red-500" : ""} />
          </button>

          {/* Absolute Bottom banner overlay */}
          <div className="relative p-6 text-white z-10 space-y-2">
            <div className="flex gap-2">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">
                Stability Score: {property.stabilityScore}%
              </span>
              {property.isVerified && (
                <span className="bg-primary text-white text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">
                  Verified Landlord
                </span>
              )}
            </div>

            <h2 className="font-bold text-2xl md:text-3xl leading-tight">
              {property.name}
            </h2>

            <p className="text-slate-200 text-sm font-medium flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-amber-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {property.location}
            </p>

            <div className="flex gap-4 pt-2 text-xs border-t border-white/20 text-slate-300">
              <span className="flex items-center gap-1 font-semibold">{property.bedrooms} Bed</span>
              <span className="flex items-center gap-1 font-semibold">{property.bathrooms} Bath</span>
              <span className="flex items-center gap-1 font-semibold">{property.sqft?.toLocaleString()} sqft</span>
              <span className="ml-auto text-amber-400 font-bold text-base">RM {property.price}/mo</span>
            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Informational Dashboard */}
        <div className="w-full md:w-1/2 flex flex-col h-full overflow-hidden bg-white max-h-[85vh] md:max-h-[90vh]">
          {/* Tab Selection Row */}
          <div className="flex border-b border-outline-variant/30 shrink-0 overflow-x-auto whitespace-nowrap bg-slate-50">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-grow md:flex-initial px-4 py-3.5 text-xs font-bold tracking-wider uppercase transition-all border-b-2 cursor-pointer ${activeTab === 'overview'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/40'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('stability')}
              className={`flex-grow md:flex-initial px-4 py-3.5 text-xs font-bold tracking-wider uppercase transition-all border-b-2 cursor-pointer ${activeTab === 'stability'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/40'
                }`}
            >
              Stability Analytics
            </button>
            <button
              onClick={() => setActiveTab('compatibility')}
              className={`flex-grow md:flex-initial px-4 py-3.5 text-xs font-bold tracking-wider uppercase transition-all border-b-2 cursor-pointer flex items-center gap-1 justify-center ${activeTab === 'compatibility'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/40'
                }`}
            >
              <Calculator size={14} />
              Rent Checker
            </button>
            <button
              onClick={() => setActiveTab('book')}
              className={`flex-grow md:flex-initial px-4 py-3.5 text-xs font-bold tracking-wider uppercase transition-all border-b-2 cursor-pointer ${activeTab === 'book'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/40'
                }`}
            >
              Book Viewing
            </button>
          </div>

          {/* Active Informational Content Body */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6">

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About the Property</h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    {property.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vetted Landlord</h4>
                  <div className="bg-slate-50 border border-outline-variant/30 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {property.landlordName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{property.landlordName}</p>
                        <p className="text-xs text-slate-500 font-medium">Verified Account Representative</p>
                      </div>
                    </div>
                    <div className="bg-green-100 border border-green-200 text-green-800 text-[10px] font-bold px-2 py-1 rounded">
                      ID CONFIRMED
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.features?.map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100/80 text-slate-700 text-xs px-3 py-1.5 rounded-xl border border-outline-variant/20 font-medium hover:bg-slate-100"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Secure policy highlight (SDG 9 related infrastructure benefits) */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-sm">
                  <div className="text-primary shrink-0 mt-0.5">
                    <Shield size={20} className="fill-primary/10" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-semibold text-slate-900">Proprietary Security Guard Insurance</h5>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      This listing is backed by MySewa Security Guard insurance protecting up to RM 10,000 of security deposits under absolute legal trust.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: STABILITY BREAKDOWN */}
            {activeTab === 'stability' && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2 text-center md:text-left">
                  <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1 shadow-sm">
                    <Sparkles size={12} className="fill-amber-500 text-amber-600" />
                    Overall Trust Score: {property.stabilityScore}%
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium pt-2">
                    Our platform computes reliability using public ledger audits, background record checks, and landlord history.
                  </p>
                </div>

                {/* Progress bars parameters */}
                <div className="space-y-5">

                  {/* Landlord Rating */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-700">Landlord Response & Escrow History</span>
                      <span className="text-primary">{property.stabilityBreakdown?.landlordRating}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-primary rounded-full transition-all duration-1000"
                        style={{ width: `${property.stabilityBreakdown?.landlordRating}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">Response guarantees and deposit return speed indexes</p>
                  </div>

                  {/* Legal Compliance */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-700">Legal Compliance & Strata Registration</span>
                      <span className="text-primary">{property.stabilityBreakdown?.legalCompliance}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-primary rounded-full transition-all duration-1000"
                        style={{ width: `${property.stabilityBreakdown?.legalCompliance}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">Ownership matches, verified lease history, and strata board audits</p>
                  </div>

                  {/* Deposit Safety */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-700">Protected Escrow Deposit Protection</span>
                      <span className="text-primary">{property.stabilityBreakdown?.depositSafety}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-primary rounded-full transition-all duration-1000"
                        style={{ width: `${property.stabilityBreakdown?.depositSafety}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">Escrow backed guarantee holding protection status compliance</p>
                  </div>

                  {/* Maintenance Score */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-700">Strata State & Building Maintenance Score</span>
                      <span className="text-primary">{property.stabilityBreakdown?.maintenanceScore}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-primary rounded-full transition-all duration-1000"
                        style={{ width: `${property.stabilityBreakdown?.maintenanceScore}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">Building safety, lift operations quality, and plumbing audit records</p>
                  </div>

                  {/* Neighborhood safety */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-700">SDG 9 Digital Connection & Regional Security</span>
                      <span className="text-primary">{property.stabilityBreakdown?.neighborhoodSafety}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-primary rounded-full transition-all duration-1000"
                        style={{ width: `${property.stabilityBreakdown?.neighborhoodSafety}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">LRT accessibility, green indices, low local crime rate records</p>
                  </div>

                </div>
              </div>
            )}

            {/* TAB: SMART COMPATIBILITY CALCULATOR */}
            {activeTab === 'compatibility' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-50 border border-outline-variant/30 rounded-2xl p-4 text-center">
                  <h4 className="font-bold text-sm text-slate-800">Dynamic Rental Parity Calculator</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Calculate your budget parameters and compute personalized financial fit indicators instantly.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Monthly Income (RM)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 text-sm">
                        RM
                      </div>
                      <input
                        type="number"
                        value={income}
                        onChange={(e) => {
                          setIncome(e.target.value);
                          setShowScore(true);
                        }}
                        placeholder="e.g. 8000"
                        className="w-full h-10 pl-10 pr-3 border border-outline-variant rounded-xl text-sm font-semibold focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Occupants count</label>
                    <select
                      value={occupants}
                      onChange={(e) => {
                        setOccupants(parseInt(e.target.value) || 1);
                        setShowScore(true);
                      }}
                      className="w-full h-10 px-3 border border-outline-variant rounded-xl text-sm font-semibold focus:ring-1 focus:ring-primary focus:outline-none"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 Occupants</option>
                      <option value="3">3 Occupants</option>
                      <option value="4">4+ Occupants</option>
                    </select>
                  </div>
                </div>

                {income && currentResult ? (
                  <div className="space-y-4 border-t border-outline-variant/20 pt-4">
                    <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-xl border border-outline-variant/30">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Vetting Status</p>
                        <p className="text-lg font-bold text-slate-800 mt-1">{currentResult.status}</p>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">Rent claim ratio: <strong className="text-slate-800">{currentResult.rentRatio}%</strong> of income</p>
                      </div>

                      {/* Round dynamic score circle */}
                      <div className="h-16 w-16 rounded-full bg-slate-100 flex flex-col items-center justify-center border-2 border-primary/20 shrink-0">
                        <span className="text-sm font-bold text-primary">{currentResult.score}</span>
                        <span className="text-[8px] font-bold text-slate-400">FIT RATIO</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-outline-variant/40 bg-white shadow-sm flex gap-3 text-xs leading-relaxed text-slate-600 font-medium">
                      <div className="text-amber-500 mt-0.5 shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block mb-0.5">MySewa Data Insight:</span>
                        {currentResult.alertMessage}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    Please provide an income amount to calculate parity fit.
                  </div>
                )}
              </div>
            )}

            {/* TAB: BOOK A VIEWING */}
            {activeTab === 'book' && (
              <div className="space-y-4 animate-fade-in">
                {formSubmitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="h-16 w-16 bg-green-50 text-green-600 border border-green-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle size={32} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-lg text-slate-800">Viewing Proposal Dispatched!</h4>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto font-medium">
                        Your property inspection proposal has successfully registered with Databank trust systems. Vetted representative <strong className="text-slate-700">{property.landlordName}</strong> will contact you via email soon.
                      </p>
                    </div>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      Book another inspection slot
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitInquiry} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rachel Tan"
                        className="w-full h-10 px-3 border border-outline-variant rounded-xl text-sm font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rachel@student.um.edu.my"
                        className="w-full h-10 px-3 border border-outline-variant rounded-xl text-sm font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Move-in Date *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                          <Calendar size={16} />
                        </div>
                        <input
                          type="date"
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full h-10 px-3 border border-outline-variant rounded-xl text-sm font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Your Message to Landlord Representative</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-outline-variant rounded-xl text-sm font-medium focus:ring-1 focus:ring-primary focus:outline-none resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-11 bg-primary hover:bg-primary-container text-white font-bold rounded-xl shadow-sm text-sm flex items-center justify-center gap-2 active:scale-95 duration-150 transition-all cursor-pointer"
                    >
                      <Send size={15} />
                      <span>Submit Proposal Vetting</span>
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

          {/* Dialog Action bar */}
          <div className="p-4 bg-slate-50 border-t border-outline-variant/35 flex items-center justify-between shrink-0">
            <div className="text-xs">
              <span className="text-slate-400 block font-semibold leading-none">Vetted Pricing</span>
              <strong className="text-lg text-primary font-bold">RM {property.price.toLocaleString()}</strong> <span className="text-slate-500">/ mo</span>
            </div>

            <button
              onClick={() => {
                setActiveTab('book');
              }}
              className="px-6 h-10 bg-primary-container hover:bg-primary text-white hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 duration-150 cursor-pointer"
            >
              Express Inquiry
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
