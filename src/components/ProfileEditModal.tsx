import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Briefcase, DollarSign, MapPin, Image, Phone, CheckCircle2 } from 'lucide-react';
import { Profile } from '../types';

interface ProfileEditModalProps {
  profile: Profile;
  onSave: (updated: Profile) => void;
  onClose: () => void;
}

export default function ProfileEditModal({ profile, onSave, onClose }: ProfileEditModalProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [occupation, setOccupation] = useState(profile.occupation);
  const [phone, setPhone] = useState(profile.phone);
  const [maxBudget, setMaxBudget] = useState(profile.maxBudget.toString());
  const [locations, setLocations] = useState(profile.preferredLocations.join(', '));
  
  // Quick profile image suggestions to play with!
  const avatarSuggestions = [
    { name: 'Alex Thompson (Default)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgG-iejlgpClYnT3HvWHKbYVWGBl3Z647e_vvGXw8wmASFqeyNx0QoTSA76CHi_jmWeSqz9EhKeclYjmfKX7GgHtUokA0RXi8JlEmsBSKi_n2pIXYIR8SccoK-LiKhb2HUULHim3m5BB9Ic163CQqe5cveZWW6Rq4TuwsmAhBu5JSsIlyMdcPltpu7Rl44RsWEloKT-qe1L4QEgg9PVACTFB9O_0ZO5wX68hb-RWnAgYxuT_2LBdtbBWEfX2BLt2TwSSLHbH1vDMM' },
    { name: 'Alternative Male Professional', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
    { name: 'Alternative Female Professional', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80' },
    { name: 'Creative Executive Alternate', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: Profile = {
      ...profile,
      name,
      email,
      avatarUrl,
      occupation,
      phone,
      maxBudget: Number(maxBudget) || 1000,
      preferredLocations: locations.split(',').map(item => item.trim()).filter(Boolean)
    };
    onSave(updatedProfile);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="bg-blue-600 text-white p-5 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-lg font-bold">Edit Profile Details</h3>
            <p className="text-blue-100 text-xs">Update your credentials to showcase your identity to landlords</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-200 text-xl font-bold cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-500" /> Name
              </label>
              <input
                required
                type="text"
                className="w-full p-2 border border-slate-200 rounded-xl text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-500" /> Email Address
              </label>
              <input
                required
                type="email"
                className="w-full p-2 border border-slate-200 rounded-xl text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Occupation
              </label>
              <input
                required
                type="text"
                className="w-full p-2 border border-slate-200 rounded-xl text-sm"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-500" /> Phone number
              </label>
              <input
                required
                type="text"
                className="w-full p-2 border border-slate-200 rounded-xl text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-blue-500" /> Maximum Budget ($)
              </label>
              <input
                required
                type="number"
                className="w-full p-2 border border-slate-200 rounded-xl text-sm bg-white"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-500" /> Preferred Areas
              </label>
              <input
                required
                type="text"
                className="w-full p-2 border border-slate-200 rounded-xl text-sm"
                placeholder="Comma separated e.g. Downtown, Greenwich"
                value={locations}
                onChange={(e) => setLocations(e.target.value)}
              />
            </div>
          </div>

          {/* Profile Picture avatar selections */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Image className="w-3.5 h-3.5 text-blue-500" /> Profile Picture Source URL
            </label>
            <input
              required
              type="text"
              className="w-full p-2 border border-slate-200 rounded-xl text-xs font-mono"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />

            <div className="space-y-1.5 mt-2">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Or Select a Quick Avatar Alternative:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {avatarSuggestions.map((avatar, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(avatar.url)}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-colors cursor-pointer ${
                      avatarUrl === avatar.url 
                        ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold' 
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <img src={avatar.url} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <span className="truncate max-w-[150px] leading-none shrink-0 text-[10px]">{avatar.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 pt-4 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all cursor-pointer"
            >
              Cancel Edit
            </button>
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Profile Info
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
