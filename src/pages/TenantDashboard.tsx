import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileView from '../components/ProfileView';
import SearchView from '../components/SearchView';
import BrowseView from '../components/BrowseView';
import ProfileEditModal from '../components/ProfileEditModal';
import SettingsModal from '../components/SettingsModal';
import { INITIAL_PROFILE, INITIAL_RENTAL_HISTORY, PROPERTIES } from '../profileData';
import { Profile, RentalHistoryItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Building2 } from 'lucide-react';

export default function TenantDashboard() {
    const navigate = useNavigate();
    const userProfile = (() => {
        const saved = localStorage.getItem('mysewa_session');
        return saved ? JSON.parse(saved) : null;
    })();

    const [activeTab, setActiveTab] = useState<'search' | 'browse' | 'profile'>('profile');

    const [profile, setProfile] = useState<Profile>(() => {
        try {
            const stored = localStorage.getItem('mysewa_profile');
            return stored ? JSON.parse(stored) : INITIAL_PROFILE;
        } catch {
            return INITIAL_PROFILE;
        }
    });

    const [rentalHistory, setRentalHistory] = useState<RentalHistoryItem[]>(() => {
        try {
            const stored = localStorage.getItem('mysewa_rental_history');
            return stored ? JSON.parse(stored) : INITIAL_RENTAL_HISTORY;
        } catch {
            return INITIAL_RENTAL_HISTORY;
        }
    });

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('mysewa_profile', JSON.stringify(profile));
    }, [profile]);

    useEffect(() => {
        localStorage.setItem('mysewa_rental_history', JSON.stringify(rentalHistory));
    }, [rentalHistory]);

    const handleApplyForProperty = (propertyName: string) => {
        const exists = rentalHistory.some(item => item.name === propertyName);
        if (!exists) {
            const newItem: RentalHistoryItem = {
                id: `h_apply_${Date.now()}`,
                name: propertyName,
                dateRange: 'Jun 2026 - Present',
                status: 'Pending',
                type: 'apartment'
            };
            setRentalHistory(prev => [newItem, ...prev]);
            setProfile(prev => ({ ...prev, trustScore: Math.min(100, prev.trustScore + 3) }));
        }
    };

    const resetAllData = () => {
        setProfile(INITIAL_PROFILE);
        setRentalHistory(INITIAL_RENTAL_HISTORY);
        localStorage.removeItem('mysewa_profile');
        localStorage.removeItem('mysewa_rental_history');
    };

    return (
        <div className="bg-[#f8f9ff] text-slate-800 min-h-screen flex flex-col font-sans">
            <Header
                mode="auth"
                onNavigate={() => navigate('/home')}
                activeSection=""
                userProfile={userProfile ? { name: userProfile.name, score: 0, role: userProfile.role } : null}
                onOpenAuth={() => navigate('/login')}
                onLogout={() => {
                    localStorage.removeItem('mysewa_session');
                    navigate('/login');
                }}
            />
            <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-16 py-10">
                {/* Top action bar */}
                <div className="flex items-center justify-between mb-8 -mt-4">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-primary transition-colors cursor-pointer"
                    >
                        <span>←</span>
                        <span>Back to Home</span>
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('mysewa_session');
                            navigate('/login');
                        }}
                        className="text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-all cursor-pointer"
                    >
                        Log Out
                    </button>
                </div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22 }}
                    >
                        {activeTab === 'profile' && (
                            <ProfileView
                                profile={profile}
                                setProfile={setProfile}
                                rentalHistory={rentalHistory}
                                setRentalHistory={setRentalHistory}
                                onOpenEditModal={() => setIsEditOpen(true)}
                                onOpenSettingsModal={() => setIsSettingsOpen(true)}
                            />
                        )}
                        {activeTab === 'search' && (
                            <SearchView
                                properties={PROPERTIES}
                                profile={profile}
                                onApplyForProperty={handleApplyForProperty}
                            />
                        )}
                        {activeTab === 'browse' && (
                            <BrowseView
                                properties={PROPERTIES}
                                profile={profile}
                                onApplyForProperty={handleApplyForProperty}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer onNavigate={() => { }} />
            <AnimatePresence>
                {isEditOpen && (
                    <ProfileEditModal
                        profile={profile}
                        onSave={(updated) => { setProfile(updated); setIsEditOpen(false); }}
                        onClose={() => setIsEditOpen(false)}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isSettingsOpen && (
                    <SettingsModal
                        profile={profile}
                        onUpdateScore={(newScore) => setProfile(prev => ({ ...prev, trustScore: newScore }))}
                        onResetData={resetAllData}
                        onClearHistory={() => setRentalHistory([])}
                        onClose={() => setIsSettingsOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}