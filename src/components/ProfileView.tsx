import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Pencil,
  Settings,
  Calendar,
  ShieldCheck,
  CreditCard,
  Shield,
  Star,
  Sparkles,
  Check,
  User
} from 'lucide-react';
import { Profile, RentalHistoryItem } from '../types';

interface ProfileViewProps {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  rentalHistory: RentalHistoryItem[];
  setRentalHistory: React.Dispatch<React.SetStateAction<RentalHistoryItem[]>>;
  onOpenEditModal: () => void;
  onOpenSettingsModal: () => void;
}

export default function ProfileView({
  profile,
  setProfile,
  rentalHistory,
  setRentalHistory,
  onOpenEditModal,
  onOpenSettingsModal
}: ProfileViewProps) {
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState(profile.aboutMe);

  // Interactive rent payment simulator states
  const [simulationMsg, setSimulationMsg] = useState<string | null>(null);

  // Synchronize aboutText if profile changes from external edit modal
  useEffect(() => {
    setAboutText(profile.aboutMe);
  }, [profile.aboutMe]);

  const handleSaveAbout = () => {
    setProfile(prev => ({ ...prev, aboutMe: aboutText }));
    setIsEditingAbout(false);
  };

  // Badge toggle logic (influences Trust Score dynamically!)
  const toggleBadge = (badge: 'idVerified' | 'onTimePayer' | 'insuranceHolder') => {
    setProfile(prev => {
      const updatedValue = !prev[badge];
      // Calculate delta for Trust Score
      let scoreDelta = 0;
      if (badge === 'idVerified') scoreDelta = updatedValue ? 15 : -15;
      if (badge === 'onTimePayer') scoreDelta = updatedValue ? 20 : -20;
      if (badge === 'insuranceHolder') scoreDelta = updatedValue ? 10 : -10;

      const newScore = Math.min(100, Math.max(30, prev.trustScore + scoreDelta));
      return {
        ...prev,
        [badge]: updatedValue,
        trustScore: newScore
      };
    });
  };

  // Rent Payment Simulator
  const simulatePayment = () => {
    if (!profile.onTimePayer) {
      setSimulationMsg("❌ Enable the 'On-time Payer' badge first to unlock consistent payment boosts!");
      return;
    }
    setProfile(prev => {
      const nextScore = Math.min(100, prev.trustScore + 2);
      const isUpgraded = nextScore > prev.trustScore;
      setSimulationMsg(
        isUpgraded
          ? `🎉 Rent payment processed! Trust score increased by +2 (Current: ${nextScore}/100)`
          : "🏆 Brilliant! You've achieved the perfect Trust Score of 100!"
      );
      return {
        ...prev,
        trustScore: nextScore,
        monthsActive: prev.monthsActive + 1
      };
    });

    setTimeout(() => {
      setSimulationMsg(null);
    }, 4000);
  };

  // Convert Trust Score to Arc Stroke Dash offsets
  // SVG radius 70. Circumference = 2 * PI * 70 = 439.8
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (profile.trustScore / 100) * circumference;

  const getTrustLabel = (score: number) => {
    if (score >= 90) return { text: 'Excellent', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    if (score >= 80) return { text: 'Very Good', color: 'bg-green-100 text-green-800 border-green-200' };
    if (score >= 65) return { text: 'Good', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    return { text: 'Fair', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  const trustLabel = getTrustLabel(profile.trustScore);

  return (
    <div className="w-full">
      {/* Simulation Banner Notice */}
      <AnimatePresence>
        {simulationMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-12 right-12 md:left-auto md:right-16 md:max-w-md bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-md z-50 flex items-start gap-3"
          >
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 font-medium">{simulationMsg}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Area */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-100 overflow-hidden shadow-xl bg-slate-50">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <button
              onClick={onOpenEditModal}
              title="Edit Profile Image / Profile Information"
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            >
              <Pencil className="w-5 h-5" />
            </button>
          </div>

          {/* Name & Contact Info */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">{profile.name}</h1>
            <p className="text-lg text-slate-500 font-medium">{profile.email}</p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
              {profile.isVerifiedTenant && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200 shadow-sm flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" strokeWidth={2.5} />
                  Verified Tenant
                </span>
              )}
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200">
                Member since {profile.memberSinceYear}
              </span>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-100 italic">
                {profile.occupation}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenEditModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md hover:shadow-lg cursor-pointer w-full sm:w-auto text-[15px]"
          >
            <Pencil className="w-4.5 h-4.5" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* About Me Section */}
      <div className="mb-10 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500" />
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            About Me
          </h3>
          {!isEditingAbout ? (
            <button
              onClick={() => setIsEditingAbout(true)}
              className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditingAbout(false)}
                className="text-slate-500 font-semibold text-sm hover:underline cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAbout}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-700 cursor-pointer shadow-sm"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {!isEditingAbout ? (
          <p className="text-slate-600 leading-relaxed font-normal whitespace-pre-line text-base">
            {profile.aboutMe || "Write something about yourself to catch the eye of potential landlords..."}
          </p>
        ) : (
          <div className="space-y-3">
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full h-32 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-slate-700 text-base leading-relaxed"
              placeholder="Tell landlords about your rental history, workspace and requirements..."
            />
          </div>
        )}

        {/* Personal details list */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-sm">
          <div>
            <span className="block text-slate-400 font-medium uppercase tracking-wider text-[11px] mb-1">Occupation</span>
            <span className="font-semibold text-slate-700">{profile.occupation || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-slate-400 font-medium uppercase tracking-wider text-[11px] mb-1">Max Monthly Budget</span>
            <span className="font-semibold text-slate-700">${profile.maxBudget.toLocaleString()}/mo</span>
          </div>
          <div>
            <span className="block text-slate-400 font-medium uppercase tracking-wider text-[11px] mb-1">Preferred Places</span>
            <span className="font-semibold text-slate-700 gap-1 flex flex-wrap">
              {profile.preferredLocations.map((loc, idx) => (
                <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">
                  {loc}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">

        {/* Trust Score Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className={`${trustLabel.color} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border shadow-sm`}>
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
              {trustLabel.text}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-6 self-start flex items-center gap-2">
            Trust Score
          </h3>

          <div className="relative w-44 h-44 mb-6 mt-2 flex items-center justify-center">
            {/* SVG circle meter */}
            <svg className="w-full h-full transform -rotate-90">
              {/* Underlay tracking circle */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="stroke-slate-100 fill-none"
                strokeWidth="14"
              />
              {/* Dynamic filled tracking circle */}
              <motion.circle
                cx="88"
                cy="88"
                r={radius}
                className="stroke-blue-600 fill-none"
                strokeWidth="14"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeDasharray={circumference}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[52px] font-extrabold text-blue-600 leading-none">{profile.trustScore}</span>
              <span className="text-[10px] font-bold text-slate-400 mt-1 tracking-widest uppercase">OUT OF 100</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 text-center w-full">
            <div className="flex text-amber-500 gap-0.5">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              <Star className="w-5 h-5 fill-amber-500 text-amber-500 opacity-60" />
            </div>
            <p className="text-sm text-slate-500 font-medium">
              {profile.ratingValue} ({profile.reviewsCount} verified landlord reviews)
            </p>

            {/* Quick Interactive boost */}
            <button
              onClick={simulatePayment}
              className="mt-4 w-full bg-slate-50 border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Simulate Monthly Rent Payment (+2 Trust)
            </button>
          </div>
        </div>

        {/* Stats & Badge Section */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="w-full">

            {/* Months Active Stat */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:border-blue-100 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-0.5">Months Active</p>
                <p className="text-3xl font-extrabold text-slate-800">{profile.monthsActive}</p>
              </div>
            </div>

          </div>

          {/* Verification Badges list */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 shadow-inner flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-[15px] font-bold text-slate-800 mb-0.5">Account Verification Badges</h4>
                <p className="text-xs text-slate-400 font-medium">Verify credentials to maximize your trust score in the rental market</p>
              </div>
              <span className="text-[10px] font-bold uppercase bg-blue-600 text-white px-2 py-0.5 rounded-md self-center">
                Interactive
              </span>
            </div>

            <div className="flex flex-wrap gap-3 mt-auto pt-2">
              {/* ID Verified Badge */}
              <button
                onClick={() => toggleBadge('idVerified')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer text-left focus:outline-none ${profile.idVerified
                    ? 'bg-white text-slate-800 border-blue-200 shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-400 grayscale opacity-80'
                  }`}
              >
                <ShieldCheck className={`w-5 h-5 shrink-0 ${profile.idVerified ? 'text-blue-600' : 'text-slate-400'}`} strokeWidth={2.2} />
                <div>
                  <div className="text-xs font-bold leading-none mb-1">ID Verified</div>
                  <div className="text-[10px] text-slate-400">+15 pts</div>
                </div>
                {profile.idVerified && (
                  <div className="ml-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                )}
              </button>

              {/* On-time Payer Badge */}
              <button
                onClick={() => toggleBadge('onTimePayer')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer text-left focus:outline-none ${profile.onTimePayer
                    ? 'bg-white text-slate-800 border-blue-200 shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-400 grayscale opacity-80'
                  }`}
              >
                <CreditCard className={`w-5 h-5 shrink-0 ${profile.onTimePayer ? 'text-blue-600' : 'text-slate-400'}`} strokeWidth={2.2} />
                <div>
                  <div className="text-xs font-bold leading-none mb-1">On-time Payer</div>
                  <div className="text-[10px] text-slate-400">+20 pts</div>
                </div>
                {profile.onTimePayer && (
                  <div className="ml-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                )}
              </button>

              {/* Insurance Holder Badge */}
              <button
                onClick={() => toggleBadge('insuranceHolder')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer text-left focus:outline-none ${profile.insuranceHolder
                    ? 'bg-white text-slate-800 border-blue-200 shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-400 grayscale opacity-80'
                  }`}
              >
                <Shield className={`w-5 h-5 shrink-0 ${profile.insuranceHolder ? 'text-blue-600' : 'text-slate-400'}`} strokeWidth={2.2} />
                <div>
                  <div className="text-xs font-bold leading-none mb-1">Insurance Holder</div>
                  <div className="text-[10px] text-slate-400">+10 pts</div>
                </div>
                {profile.insuranceHolder && (
                  <div className="ml-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
