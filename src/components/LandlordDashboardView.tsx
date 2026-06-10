import { useState } from 'react';
import { Pencil, Settings, Plus, Home, PieChart, DollarSign, Wrench, ArrowRight, Check } from 'lucide-react';
import { LandlordProfile, Inquiry, Property, Lease, Payment } from '../types';

interface DashboardViewProps {
  profile: LandlordProfile;
  properties: Property[];
  leases: Lease[];
  payments: Payment[];
  inquiries: Inquiry[];
  onEditBioClick: () => void;
  onAddPropertyClick: () => void;
  onAccountSettingsClick: () => void;
  onOpenInquiry: (inquiry: Inquiry) => void;
}

export default function DashboardView({
  profile,
  properties,
  leases,
  payments,
  inquiries,
  onEditBioClick,
  onAddPropertyClick,
  onAccountSettingsClick,
  onOpenInquiry
}: DashboardViewProps) {
  const [isEditingMiniBio, setIsEditingMiniBio] = useState(false);
  const [miniBioText, setMiniBioText] = useState(profile.bio);

  // Dynamic derivations based on stored properties/leases
  const totalPropertiesCount = properties.length;
  const totalUnits = properties.reduce((acc, p) => acc + p.units, 0);
  const totalOccupied = properties.reduce((acc, p) => acc + p.occupiedUnits, 0);
  const occupancyPercentage = totalUnits > 0 ? ((totalOccupied / totalUnits) * 100).toFixed(1) : '0';

  // Calculate Monthly Revenue based on properties monthlyRent * occupied units
  const calculatedMonthlyRevenue = (properties.reduce((acc, p) => 
    p.status === 'Active' ? acc + (p.monthlyRent * (p.occupiedUnits || 1)) : acc, 0) / 1000
  ).toFixed(1);

  // Unread inquiries count
  const unreadInquiriesCount = inquiries.filter(i => i.status === 'unread').length;

  const handleSaveMiniBio = () => {
    profile.bio = miniBioText; // save directly back to parent state via reference
    setIsEditingMiniBio(false);
  };

  return (
    <div className="space-y-12">
      {/* Landlord Header Card */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group cursor-pointer" onClick={onAccountSettingsClick}>
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-blue-50 overflow-hidden shadow-xl hover:ring-4 hover:ring-blue-100 transition-all duration-300">
              <img 
                alt="Sarah Jenkins profile" 
                className="w-full h-full object-cover" 
                src={profile.avatarUrl}
                referrerPolicy="no-referrer"
              />
            </div>
            <button className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer">
              <Pencil size={18} />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{profile.name}</h1>
            <p className="text-lg text-gray-500 font-medium mt-1">{profile.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
              {profile.isVerified && (
                <span className="bg-blue-100/80 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold select-none">
                  Verified Landlord
                </span>
              )}
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold select-none">
                Member since {profile.membershipYear}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            id="dash-settings-btn"
            onClick={onAccountSettingsClick}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl text-slate-700 font-semibold text-sm hover:bg-gray-50 transition-all active:scale-98 shadow-xs cursor-pointer"
          >
            <Settings size={16} />
            Account Settings
          </button>
          <button 
            id="dash-add-property-btn"
            onClick={onAddPropertyClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-98 cursor-pointer"
          >
            <Plus size={16} />
            Add Property
          </button>
        </div>
      </div>

      {/* Main Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Me Section with full live inline-editing edit toggle */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-950">About Me</h3>
              {!isEditingMiniBio ? (
                <button 
                  id="edit-bio-toggle-btn"
                  onClick={() => setIsEditingMiniBio(true)}
                  className="text-blue-600 font-semibold text-sm flex items-center gap-1.5 hover:underline cursor-pointer"
                >
                  <Pencil size={15} /> Edit
                </button>
              ) : (
                <button 
                  id="save-bio-toggle-btn"
                  onClick={handleSaveMiniBio}
                  className="bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-xs py-1 px-3 rounded-lg flex items-center gap-1 hover:bg-blue-100 cursor-pointer"
                >
                  <Check size={14} /> Save
                </button>
              )}
            </div>
            
            {!isEditingMiniBio ? (
              <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            ) : (
              <div className="space-y-3">
                <textarea
                  id="inline-textarea-bio"
                  value={miniBioText}
                  onChange={(e) => setMiniBioText(e.target.value)}
                  rows={4}
                  className="w-full text-sm rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none"
                />
              </div>
            )}
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Total Properties */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 min-h-[160px]">
              <div className="flex justify-between items-start mb-4">
                <span className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Home size={22} />
                </span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50/50 px-2.5 py-1 rounded-full">
                  +{totalPropertiesCount - 4 >= 0 ? totalPropertiesCount - 4 : 2} this month
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Total Properties</p>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-1">{totalPropertiesCount}</h2>
              </div>
            </div>

            {/* Occupancy Rate */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 min-h-[160px]">
              <div className="flex justify-between items-start mb-4">
                <span className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <PieChart size={22} />
                </span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                  92% Average
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Occupancy Rate</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h2 className="text-3xl font-extrabold text-slate-900">{occupancyPercentage}%</h2>
                  <span className="text-emerald-600 text-xs font-bold flex items-center gap-0.5">
                    ~1.2%
                  </span>
                </div>
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 min-h-[160px]">
              <div className="flex justify-between items-start mb-4">
                <span className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <DollarSign size={22} />
                </span>
                <span className="text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                  Target met
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Monthly Revenue</p>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-1">${calculatedMonthlyRevenue}k</h2>
              </div>
            </div>

            {/* Maintenance Tasks */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 min-h-[160px]">
              <div className="flex justify-between items-start mb-4">
                <span className="p-3 bg-red-50 text-red-600 rounded-xl">
                  <Wrench size={22} />
                </span>
                <span className="text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                  Urgent: 2
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Maintenance Tasks</p>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-1">8</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3) - Recent Inquiries */}
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-900">Recent Inquiries</h3>
            {unreadInquiriesCount > 0 && (
              <span className="bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
                {unreadInquiriesCount}
              </span>
            )}
          </div>
          <div className="bg-blue-50/40 p-6 rounded-2xl space-y-6 border border-blue-100/50 flex-grow flex flex-col justify-between min-h-[420px]">
            <div className="space-y-6">
              {inquiries.map((inq) => (
                <div 
                  key={inq.id} 
                  className="pb-4 border-b border-blue-100/40 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-semibold text-sm text-slate-900">{inq.senderName}</h5>
                    <span className="text-xs text-gray-400 font-medium">{inq.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed italic line-clamp-2 mt-1">
                    "{inq.content}"
                  </p>
                  <div className="mt-3.5 flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-white border border-blue-100/50 rounded-xl text-xs font-semibold text-slate-800 shadow-3xs">
                      {inq.propertyName}
                    </span>
                    <button 
                      id={`reply-btn-${inq.id}`}
                      onClick={() => onOpenInquiry(inq)}
                      className="text-blue-600 font-semibold text-xs hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      Reply <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-blue-100/40">
              <button 
                id="manage-inquiries-btn"
                onClick={() => onOpenInquiry(inquiries[0])}
                className="w-full py-2.5 bg-white border-2 border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 rounded-xl font-semibold text-sm transition-all shadow-xs cursor-pointer"
              >
                Manage All Inquiries
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
