import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { LandlordProfile } from '../types';

interface AccountSettingsModalProps {
  profile: LandlordProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (updated: LandlordProfile) => void;
}

export default function AccountSettingsModal({
  profile,
  isOpen,
  onClose,
  onSaveProfile
}: AccountSettingsModalProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [bio, setBio] = useState(profile.bio);
  const [isVerified, setIsVerified] = useState(profile.isVerified);
  const [membershipYear, setMembershipYear] = useState(profile.membershipYear);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name,
      email,
      avatarUrl: avatarUrl?.trim() || null,
      membershipYear,
      isVerified
    });
    onClose();
  };

  const avatarsList = [
    { name: 'Sarah (Default)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgG-iejlgpClYnT3HvWHKbYVWGBl3Z647e_vvGXw8wmASFqeyNx0QoTSA76CHi_jmWeSqz9EhKeclYjmfKX7GgHtUokA0RXi8JlEmsBSKi_n2pIXYIR8SccoK-LiKhb2HUULHim3m5BB9Ic163CQqe5cveZWW6Rq4TuwsmAhBu5JSsIlyMdcPltpu7Rl44RsWEloKT-qe1L4QEgg9PVACTFB9O_0ZO5wX68hb-RWnAgYxuT_2LBdtbBWEfX2BLt2TwSSLHbH1vDMM' },
    { name: 'Professional Male', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80' },
    { name: 'Professional Female', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
    { name: 'Elegant Studio', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
      <div
        id="account-settings-modal-content"
        className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full flex flex-col"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
          <h3 className="font-bold text-gray-900 text-lg">Account & Landlord Settings</h3>
          <button
            id="close-account-modal-btn"
            onClick={onClose}
            className="p-1 px-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Profile Image</label>
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-600 shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-blue-600 bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                  {name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 flex-1">
                {avatarsList.map((avatar, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(avatar.url)}
                    className={`text-xs border text-left p-1.5 rounded-lg font-medium truncate hover:border-blue-500 hover:bg-blue-50/20 cursor-pointer ${avatarUrl === avatar.url ? 'border-blue-600 bg-blue-50/40 text-blue-700' : 'border-gray-200 text-gray-600'
                      }`}
                  >
                    {avatar.name}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="mt-3 w-full text-xs text-gray-400 font-mono bg-gray-50 border border-gray-200 p-2 rounded-lg"
              placeholder="Or paste an image URL..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Name</label>
              <input
                id="profile-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email Address</label>
              <input
                id="profile-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Member Since (Year)</label>
              <input
                type="number"
                required
                value={membershipYear}
                onChange={(e) => setMembershipYear(parseInt(e.target.value) || 2019)}
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Landlord Badge</label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700 bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full select-none">Verified Landlord</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">About Me (Bio)</label>
            <textarea
              id="profile-bio-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full text-sm rounded-xl border border-gray-200 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
              placeholder="Tell tenants about yourself..."
            />
          </div>

          <div className="flex gap-2 justify-end pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="save-profile-btn"
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Check size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
