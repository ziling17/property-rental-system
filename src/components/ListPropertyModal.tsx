/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Building, Landmark, CheckCircle, Calculator, ShieldAlert, BadgeInfo } from 'lucide-react';
import { Property, StabilityBreakdown } from '../types';

interface ListPropertyModalProps {
  onClose: () => void;
  onAddProperty: (property: Property) => void;
}

export const ListPropertyModal: React.FC<ListPropertyModalProps> = ({
  onClose,
  onAddProperty,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  
  // Property Info form states
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Bukit Bintang, KL');
  const [price, setPrice] = useState('2500');
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [sqft, setSqft] = useState('1000');
  const [description, setDescription] = useState('');
  const [landlordName, setLandlordName] = useState('');
  const [propertyType, setPropertyType] = useState<'Condo' | 'Apartment' | 'Landed' | 'Studio'>('Condo');
  const [furnishing, setFurnishing] = useState<'Fully' | 'Partially' | 'Unfurnished'>('Fully');
  const [transitFriendly, setTransitFriendly] = useState<boolean>(true);

  // Vetting form states for computing Stability Score
  const [escrowDeposit, setEscrowDeposit] = useState('yes'); // yes: +20, no: 0
  const [legalDeed, setLegalDeed] = useState('yes');         // yes: +20, no: 0
  const [emergencyOnCall, setEmergencyOnCall] = useState('24h');  // 24h: +20, 48h: +10, none: 0
  const [registryMatch, setRegistryMatch] = useState('yes');   // yes: +20, no: 0
  const [passedID, setPassedID] = useState('yes');             // yes: +20, no: 0

  // Calculate scores instantly in real-time
  const computeVettedStabilityScore = (): { score: number; breakdown: StabilityBreakdown } => {
    let landlordRating = 80;
    let legalCompliance = 75;
    let depositSafety = 70;
    let maintenanceScore = 75;
    let neighborhoodSafety = 92;

    if (escrowDeposit === 'yes') {
      depositSafety = 100;
    } else {
      depositSafety = 45;
    }

    if (legalDeed === 'yes') {
      legalCompliance += 10;
    } else {
      legalCompliance -= 25;
    }

    if (emergencyOnCall === '24h') {
      maintenanceScore = 98;
      landlordRating += 10;
    } else if (emergencyOnCall === '48h') {
      maintenanceScore = 85;
      landlordRating += 5;
    } else {
      maintenanceScore = 55;
      landlordRating -= 15;
    }

    if (registryMatch === 'yes') {
      legalCompliance = Math.min(100, legalCompliance + 10);
    } else {
      legalCompliance -= 15;
    }

    if (passedID === 'yes') {
      landlordRating = Math.min(100, landlordRating + 10);
    } else {
      landlordRating -= 30;
    }

    // average the parameters
    const score = Math.round(
      (landlordRating + legalCompliance + depositSafety + maintenanceScore + neighborhoodSafety) / 5
    );

    return {
      score,
      breakdown: {
        landlordRating: Math.max(0, Math.min(100, landlordRating)),
        legalCompliance: Math.max(0, Math.min(100, legalCompliance)),
        depositSafety: Math.max(0, Math.min(100, depositSafety)),
        maintenanceScore: Math.max(0, Math.min(100, maintenanceScore)),
        neighborhoodSafety: Math.max(0, Math.min(100, neighborhoodSafety)),
      }
    };
  };

  const results = computeVettedStabilityScore();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !sqft || !landlordName) {
      alert('Please fill out all primary fields');
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Choose a stock image for listings
    const sampleImages = [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1628744501438-e6d8a2455075?auto=format&fit=crop&w=800&q=80'
    ];
    const chosenImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];

    const finalFeatures = [
      'Verified Landlord representative',
      'Audit Registered Strata Unit',
      'Fitted Kitchen Cabinets',
      'Escrow Deposit Security Vetted'
    ];
    if (emergencyOnCall === '24h') finalFeatures.push('24/7 Priority Emergency Maintenance');

    const newProperty: Property = {
      id: `property-${Date.now()}`,
      name,
      location,
      price: Math.max(1, parseFloat(price) || 2000),
      bedrooms,
      bathrooms,
      sqft: Math.max(1, parseFloat(sqft) || 900),
      stabilityScore: results.score,
      image: chosenImage,
      description: description || `Located in the prestigious ${location} area, this pristine residence has passed all security checks, background matching, and legal registries through MySewa Trust protocols. Highly spacious layout matching executive standards.`,
      landlordName,
      isVerified: passedID === 'yes',
      stabilityBreakdown: results.breakdown,
      features: finalFeatures,
      propertyType,
      furnishing,
      transitFriendly,
    };

    onAddProperty(newProperty);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Black backdrop block */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Primary Card dialog */}
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full z-10 max-h-[90vh] flex flex-col border border-outline-variant/30 animate-scale-up">
        
        {/* Header visual title menu */}
        <div className="px-6 py-4 bg-slate-50 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm">
              <Building size={16} />
            </div>
            <div>
              <h3 className="font-bold text-base text-on-surface">List Property For Audit</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                MySewa Intelligent Ledger
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dynamic step instructions */}
        <div className="bg-primary/5 px-6 py-2 border-b border-primary/10 flex justify-between text-xs text-primary font-semibold">
          <span>Step {step} of 2</span>
          <span>{step === 1 ? 'Core Listing Information' : 'Trust Registry Assessment'}</span>
        </div>

        {/* Scrollable multi-step form */}
        <div className="overflow-y-auto p-6 flex-grow space-y-4">
          
          {/* STEP 1: GENERAL INFORMATION */}
          {step === 1 && (
            <form onSubmit={handleNextStep} id="listing-form-step-1" className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Property or Condo Name *</label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bangsar Heights Residences"
                  className="w-full h-10 px-3 border border-outline-variant rounded-xl text-sm font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Location / Area *</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-10 px-3 border border-outline-variant rounded-xl text-sm font-semibold focus:ring-1 focus:ring-primary focus:outline-none bg-white"
                  >
                    <option value="Bukit Bintang, KL">Bukit Bintang, KL</option>
                    <option value="Sentul East, KL">Sentul East, KL</option>
                    <option value="Bangsar South, KL">Bangsar South, KL</option>
                    <option value="Setapak, KL">Setapak, KL</option>
                    <option value="KLCC, KL">KLCC, KL</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Rent Price (RM/mo) *</label>
                  <input 
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 2800"
                    className="w-full h-10 px-3 border border-outline-variant rounded-xl text-sm font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Bedrooms</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(parseInt(e.target.value) || 1)}
                    className="w-full h-10 px-3 border border-outline-variant rounded-xl text-sm font-semibold focus:ring-1 focus:ring-primary focus:outline-none bg-white"
                  >
                    <option value="1">1 Bed</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3 Beds</option>
                    <option value="4">4+ Beds</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Bathrooms</label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(parseInt(e.target.value) || 1)}
                    className="w-full h-10 px-3 border border-outline-variant rounded-xl text-sm font-semibold focus:ring-1 focus:ring-primary focus:outline-none bg-white"
                  >
                    <option value="1">1 Bath</option>
                    <option value="2">2 Baths</option>
                    <option value="3">3 Baths</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Sqft size *</label>
                  <input 
                    type="number"
                    required
                    value={sqft}
                    onChange={(e) => setSqft(e.target.value)}
                    placeholder="e.g. 950"
                    className="w-full h-10 px-3 border border-outline-variant rounded-xl text-sm font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full h-10 px-3 border border-outline-variant rounded-xl text-sm font-semibold focus:ring-1 focus:ring-primary focus:outline-none bg-white font-sans text-slate-800"
                  >
                    <option value="Condo">Condominium</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Landed">Landed House</option>
                    <option value="Studio">Studio / Loft</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Furnishing</label>
                  <select
                    value={furnishing}
                    onChange={(e) => setFurnishing(e.target.value as any)}
                    className="w-full h-10 px-3 border border-outline-variant rounded-xl text-sm font-semibold focus:ring-1 focus:ring-primary focus:outline-none bg-white font-sans text-slate-800"
                  >
                    <option value="Fully">Fully Furnished</option>
                    <option value="Partially">Partially Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              <div className="py-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={transitFriendly}
                    onChange={(e) => setTransitFriendly(e.target.checked)}
                    className="text-primary focus:ring-primary h-4 w-4 rounded cursor-pointer accent-primary"
                  />
                  <span>Direct Transit Connection (LRT/MRT within 500m)</span>
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Landlord Legal Represent Name *</label>
                <input 
                  type="text"
                  required
                  value={landlordName}
                  onChange={(e) => setLandlordName(e.target.value)}
                  placeholder="e.g. Lim Kok Wing"
                  className="w-full h-10 px-3 border border-outline-variant rounded-xl text-sm font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Brief Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Enter features, nearby amenities..."
                  className="w-full p-2.5 border border-outline-variant rounded-xl text-sm font-medium focus:ring-1 focus:ring-primary focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary-container text-white font-bold rounded-xl shadow-sm text-sm flex items-center justify-center gap-1.5 mt-2 active:scale-95 duration-150 transition-all cursor-pointer"
              >
                <span>Proceed to Trust Registry Vetting</span>
              </button>
            </form>
          )}

          {/* STEP 2: STABILITY SCORE VETTING */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              
              <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4 flex gap-3 text-xs">
                <div className="text-amber-500 shrink-0">
                  <BadgeInfo size={20} />
                </div>
                <div className="space-y-1">
                  <strong className="text-slate-800 font-bold block">Instant Stability Index Auditing</strong>
                  <p className="text-slate-600 leading-normal font-medium">
                    Answer these verification markers truthfully. Our proprietary smart-contract matching assigns visual scores and trust marks supporting local green ESG leasing guidelines.
                  </p>
                </div>
              </div>

              {/* Escrow Deposit Choice */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 tracking-wide">
                  1. Will you commit security deposits to a vetted Escrow account?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="escrow" 
                      value="yes" 
                      checked={escrowDeposit === 'yes'}
                      onChange={() => setEscrowDeposit('yes')}
                      className="text-primary focus:ring-primary h-4 w-4" 
                    />
                    <span>Yes, under trust deed (+20 pts)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="escrow" 
                      value="no" 
                      checked={escrowDeposit === 'no'}
                      onChange={() => setEscrowDeposit('no')}
                      className="text-primary focus:ring-primary h-4 w-4" 
                    />
                    <span>No, direct personal transfer</span>
                  </label>
                </div>
              </div>

              {/* Legal Property deed matching */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 tracking-wide">
                  2. Vetted ownership matching with local land office records?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="deed" 
                      value="yes" 
                      checked={legalDeed === 'yes'}
                      onChange={() => setLegalDeed('yes')}
                      className="text-primary focus:ring-primary h-4 w-4" 
                    />
                    <span>Yes, verified deeds (+20 pts)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="deed" 
                      value="no" 
                      checked={legalDeed === 'no'}
                      onChange={() => setLegalDeed('no')}
                      className="text-primary focus:ring-primary h-4 w-4" 
                    />
                    <span>Not matching / Joint names</span>
                  </label>
                </div>
              </div>

              {/* Emergency Response guarantees */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 tracking-wide">
                  3. Emergency on-call repair timeline commitments?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="emergency" 
                      value="24h" 
                      checked={emergencyOnCall === '24h'}
                      onChange={() => setEmergencyOnCall('24h')}
                      className="text-primary focus:ring-primary h-4 w-4" 
                    />
                    <span>Within 24 hours plumbing/electricity (+20 pts)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="emergency" 
                      value="48h" 
                      checked={emergencyOnCall === '48h'}
                      onChange={() => setEmergencyOnCall('48h')}
                      className="text-primary focus:ring-primary h-4 w-4" 
                    />
                    <span>Within 48 hours for general repairs (+10 pts)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="emergency" 
                      value="none" 
                      checked={emergencyOnCall === 'none'}
                      onChange={() => setEmergencyOnCall('none')}
                      className="text-primary focus:ring-primary h-4 w-4" 
                    />
                    <span>No priority window commitment</span>
                  </label>
                </div>
              </div>

              {/* Identity & Strata Councils */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100/80">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Strata registry match</label>
                  <select 
                    value={registryMatch} 
                    onChange={(e) => setRegistryMatch(e.target.value)}
                    className="w-full text-xs h-8 border border-outline-variant rounded-lg font-medium focus:outline-none"
                  >
                    <option value="yes">Matched strata deed</option>
                    <option value="no">Unreferenced unit</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Biometric Vetting ID</label>
                  <select 
                    value={passedID} 
                    onChange={(e) => setPassedID(e.target.value)}
                    className="w-full text-xs h-8 border border-outline-variant rounded-lg font-medium focus:outline-none"
                  >
                    <option value="yes">Passed e-KYC facial check</option>
                    <option value="no">Deferred ID check</option>
                  </select>
                </div>
              </div>

              {/* Dynamic computed score results inside modal */}
              <div className="bg-slate-50 p-4 rounded-xl border border-outline-variant/35 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Algorithmic Score</span>
                  <div className="font-bold text-xl text-amber-500 flex items-center gap-1 mt-0.5">
                    <Sparkles size={16} className="fill-amber-400" />
                    <span>{results.score}% Score</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary-container text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1 active:scale-95 duration-150"
                >
                  <CheckCircle size={14} />
                  <span>Finalize & List</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-500 hover:text-slate-800 underline block text-center"
              >
                Go back to edit core info
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
