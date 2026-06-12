// src/pages/LandlordDashboard.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DashboardView from '../components/LandlordDashboardView';
import PropertiesView from '../components/LandlordPropertiesView';
import LeasesView from '../components/LandlordLeasesView';
import PaymentsView from '../components/LandlordPaymentsView';
import InquiryDetailModal from '../components/InquiryDetailModal';
import AccountSettingsModal from '../components/AccountSettingsModal';
import { Plus } from 'lucide-react';

import {
    LandlordProfile,
    Property,
    Lease,
    Payment,
    Inquiry,
    ChatMessage,
    InquiryStatus,
    LeaseStatus,
    PaymentStatus
} from '../types';

import {
    INITIAL_PROFILE,
    INITIAL_PROPERTIES,
    INITIAL_LEASES,
    INITIAL_PAYMENTS,
    INITIAL_INQUIRIES
} from '../landlordData';

export default function LandlordDashboard() {
    const navigate = useNavigate();

    const userProfile = (() => {
        try {
            const saved = localStorage.getItem('mysewa_session');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    })();

    // Navigation State
    const [currentTab, setCurrentTab] = useState<string>('dashboard');

    // Core Data States
    const [profile, setProfile] = useState<LandlordProfile>(() => {
        try {
            const s = localStorage.getItem('mysewa_landlord_profile');
            return s ? JSON.parse(s) : INITIAL_PROFILE;
        } catch { return INITIAL_PROFILE; }
    });

    const [properties, setProperties] = useState<Property[]>(() => {
        try {
            const s = localStorage.getItem('mysewa_landlord_properties');
            return s ? JSON.parse(s) : INITIAL_PROPERTIES;
        } catch { return INITIAL_PROPERTIES; }
    });

    const [leases, setLeases] = useState<Lease[]>(() => {
        try {
            const s = localStorage.getItem('mysewa_landlord_leases');
            return s ? JSON.parse(s) : INITIAL_LEASES;
        } catch { return INITIAL_LEASES; }
    });

    const [payments, setPayments] = useState<Payment[]>(() => {
        try {
            const s = localStorage.getItem('mysewa_landlord_payments');
            return s ? JSON.parse(s) : INITIAL_PAYMENTS;
        } catch { return INITIAL_PAYMENTS; }
    });

    const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
        try {
            const s = localStorage.getItem('mysewa_landlord_inquiries');
            return s ? JSON.parse(s) : INITIAL_INQUIRIES;
        } catch { return INITIAL_INQUIRIES; }
    });

    // Modal States
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
    const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);

    // Persist to localStorage
    const saveToStorage = (key: string, data: any) => {
        try { localStorage.setItem(key, JSON.stringify(data)); }
        catch (e) { console.error(`Failed to save ${key}:`, e); }
    };

    useEffect(() => { saveToStorage('mysewa_landlord_profile', profile); }, [profile]);
    useEffect(() => { saveToStorage('mysewa_landlord_properties', properties); }, [properties]);
    useEffect(() => { saveToStorage('mysewa_landlord_leases', leases); }, [leases]);
    useEffect(() => { saveToStorage('mysewa_landlord_payments', payments); }, [payments]);
    useEffect(() => { saveToStorage('mysewa_landlord_inquiries', inquiries); }, [inquiries]);

    // ── Profile ────────────────────────────────────────────────────────

    const handleSaveProfile = (updated: LandlordProfile) => {
        setProfile(updated);
    };

    // ── Properties ─────────────────────────────────────────────────────

    const handleAddProperty = (newProp: Property) => {
        setProperties(prev => [newProp, ...prev]);
    };

    const handleUpdateProperty = (updated: Property) => {
        setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
    };

    const handleDeleteProperty = (id: string) => {
        if (window.confirm('Remove this property? Associated lease records are retained.')) {
            setProperties(prev => prev.filter(p => p.id !== id));
        }
    };

    // ── Leases ─────────────────────────────────────────────────────────

    const handleAddLease = (newLease: Lease) => {
        setLeases(prev => [newLease, ...prev]);
        const target = properties.find(p => p.id === newLease.propertyId);
        if (target && newLease.status === 'Active') {
            handleUpdateProperty({
                ...target,
                occupiedUnits: Math.min(target.units, target.occupiedUnits + 1)
            });
        }
    };

    const handleUpdateLeaseStatus = (id: string, nextStatus: LeaseStatus) => {
        const target = leases.find(l => l.id === id);
        setLeases(prev => prev.map(l => l.id === id ? { ...l, status: nextStatus } : l));

        if (target) {
            const prop = properties.find(p => p.id === target.propertyId);
            if (prop) {
                if (nextStatus === 'Active' && target.status !== 'Active') {
                    handleUpdateProperty({
                        ...prop,
                        occupiedUnits: Math.min(prop.units, prop.occupiedUnits + 1)
                    });
                } else if (
                    (nextStatus === 'Expired' || nextStatus === 'Terminated') &&
                    target.status === 'Active'
                ) {
                    handleUpdateProperty({
                        ...prop,
                        occupiedUnits: Math.max(0, prop.occupiedUnits - 1)
                    });
                }
            }
        }
    };

    const handleDeleteLease = (id: string) => {
        if (window.confirm('Delete this lease agreement?')) {
            setLeases(prev => prev.filter(l => l.id !== id));
        }
    };

    // ── Payments ───────────────────────────────────────────────────────

    const handleAddPayment = (newPay: Payment) => {
        setPayments(prev => [newPay, ...prev]);
    };

    const handleUpdatePaymentStatus = (id: string, newStatus: PaymentStatus) => {
        setPayments(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    };

    const handleDeletePayment = (id: string) => {
        if (window.confirm('Delete this payment record?')) {
            setPayments(prev => prev.filter(p => p.id !== id));
        }
    };

    // ── Inquiries ──────────────────────────────────────────────────────

    const handleOpenInquiry = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry);
        setIsInquiryModalOpen(true);
        if (inquiry.status === 'unread') {
            setInquiries(prev =>
                prev.map(i => i.id === inquiry.id ? { ...i, status: 'read' as InquiryStatus } : i)
            );
        }
    };

    const handleSendReply = (inquiryId: string, replyText: string) => {
        const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            sender: 'landlord',
            text: replyText,
            timestamp: 'Just now'
        };
        setInquiries(prev => prev.map(inq => {
            if (inq.id !== inquiryId) return inq;
            const updated = {
                ...inq,
                status: 'replied' as InquiryStatus,
                content: replyText,
                messages: [...inq.messages, newMsg]
            };
            setSelectedInquiry(updated);
            return updated;
        }));
    };

    const unreadCount = inquiries.filter(i => i.status === 'unread').length;

    return (
        <div className="min-h-screen flex flex-col justify-between bg-slate-50/50">
            <Header
                onNavigate={() => navigate('/home')}
                activeSection={currentTab}
                setCurrentTab={setCurrentTab}
                userProfile={userProfile
                    ? { name: userProfile.name, score: 0, role: userProfile.role }
                    : null}
            />

            <main className="flex-grow pt-10 pb-16 px-6 md:px-16 max-w-7xl mx-auto w-full">

                {currentTab === 'dashboard' && (
                    <>
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
                        <DashboardView
                            profile={profile}
                            properties={properties}
                            leases={leases}
                            payments={payments}
                            inquiries={inquiries}
                            onEditBioClick={() => setIsAccountSettingsOpen(true)}
                            onAddPropertyClick={() => navigate('/add-property')}
                            onAccountSettingsClick={() => setIsAccountSettingsOpen(true)}
                            onOpenInquiry={handleOpenInquiry}
                        />
                    </>
                )}

                {currentTab === 'properties' && (
                    <PropertiesView
                        properties={properties}
                        onAddProperty={handleAddProperty}
                        onUpdateProperty={handleUpdateProperty}
                        onDeleteProperty={handleDeleteProperty}
                    />
                )}

            </main>

            <Footer onNavigate={() => navigate('/home')} />

            {/* Mobile FAB */}
            <button
                onClick={() => navigate('/add-property')}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-40 active:scale-95"
                aria-label="Add Property"
            >
                <Plus size={24} />
            </button>

            <InquiryDetailModal
                inquiry={selectedInquiry}
                isOpen={isInquiryModalOpen}
                onClose={() => { setIsInquiryModalOpen(false); setSelectedInquiry(null); }}
                onSendReply={handleSendReply}
            />

            <AccountSettingsModal
                profile={profile}
                isOpen={isAccountSettingsOpen}
                onClose={() => setIsAccountSettingsOpen(false)}
                onSaveProfile={handleSaveProfile}
            />
        </div>
    );
}