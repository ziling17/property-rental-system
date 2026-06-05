/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    Sparkles,
    ShieldAlert,
    Heart,
    Compass,
    Building2,
    Search,
    CheckCircle,
    Info,
    ArrowRight,
    ShieldCheck,
    Smartphone,
    MapPin,
    Calendar,
    Trash2,
    Landmark,
    HelpCircle,
    HelpCircle as ShieldAlertIcon,
    BadgeAlert,
    Zap,
    Smile,
    X
} from 'lucide-react';


// Importing subcomponents
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { PropertyFilter, Inquiry } from '../types';
import { DEFAULT_PROPERTIES, HomeProperty } from '../data';
import { Navbar } from '../components/Navbar';
import { PropertyCard } from '../components/PropertyCard';
import { FilterPanel } from '../components/FilterPanel';
import { HomePropertyDetailModal } from '../components/HomePropertyDetailModal';
import { ListPropertyModal } from '../components/ListPropertyModal';
import { SupportChat } from '../components/SupportChat';
import { AuthModals } from '../components/AuthModals';

export default function HomeDashboard() {
    // Database state initialized with persistent localStorage
    const [properties, setProperties] = useState<HomeProperty[]>(() => {
        const saved = localStorage.getItem('mysewa_properties');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { return DEFAULT_PROPERTIES; }
        }
        return DEFAULT_PROPERTIES;
    });

    // Saved Bookmarked Property IDs state
    const [savedIds, setSavedIds] = useState<string[]>(() => {
        const saved = localStorage.getItem('mysewa_saved_properties');
        return saved ? JSON.parse(saved) : [];
    });

    // User auth state
    const [user, setUser] = useState<{ name: string; email: string; loggedIn: boolean } | null>(() => {
        const saved = localStorage.getItem('mysewa_user');
        return saved ? JSON.parse(saved) : { name: 'Ding Ziling', email: 'dingziling88@gmail.com', loggedIn: true };
    });

    // Active filters setup
    const [filters, setFilters] = useState<PropertyFilter>({
        searchQuery: '',
        location: '',
        minPrice: 1000,
        maxPrice: 6000,
        minStability: 0,
        bedrooms: '',
        bathrooms: '',
        propertyType: 'Any',
        furnishing: 'Any',
        transitFriendlyOnly: false,
        isVerifiedOnly: false,
        minSqft: 200,
        maxSqft: 2500,
        selectedAmenities: [],
    });

    const navigate = useNavigate();
    // Navigation states
    const [activeTab, setActiveTab] = useState<'browse' | 'search' | 'saved'>('browse');
    const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

    // Modal toggle states
    const [selectedProperty, setSelectedProperty] = useState<HomeProperty | null>(null);
    const [listModalOpen, setListModalOpen] = useState(false);
    const [authModalType, setAuthModalType] = useState<'login' | 'register' | null>(null);

    // Policy popup modal trigger
    const [activePolicyPopup, setActivePolicyPopup] = useState<'protection' | 'biometric' | 'sdg' | null>(null);

    // Notification Feed alert system
    const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'success' | 'info' | 'warn' }[]>([]);

    // Search section ref for fluid scroll action
    const searchSectionRef = useRef<HTMLDivElement>(null);

    // Synchronize dynamic databases with client browser Storage
    useEffect(() => {
        localStorage.setItem('mysewa_properties', JSON.stringify(properties));
    }, [properties]);

    useEffect(() => {
        localStorage.setItem('mysewa_saved_properties', JSON.stringify(savedIds));
    }, [savedIds]);

    useEffect(() => {
        localStorage.setItem('mysewa_user', JSON.stringify(user));
    }, [user]);

    // Push instant alert notification helper
    const triggerNotification = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
        const newAlert = { id: `alert-${Date.now()}`, message, type };
        setNotifications((prev) => [...prev, newAlert]);
        setTimeout(() => {
            setNotifications((prev) => prev.filter((item) => item.id !== newAlert.id));
        }, 4500);
    };

    // Add custom property list callback
    const handleAddNewProperty = (newProperty: HomeProperty) => {
        setProperties((prev) => [newProperty, ...prev]);
        setListModalOpen(false);
        triggerNotification(`Property "${newProperty.name}" listed successfully with an audited Stability Score of ${newProperty.stabilityScore}%!`, 'success');

        // Automatically select the new property details
        setTimeout(() => {
            setSelectedProperty(newProperty);
        }, 400);
    };

    // Toggle Saved Bookmarks list
    const handleToggleSaved = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const isSaved = savedIds.includes(id);
        const targetPropName = properties.find(p => p.id === id)?.name || 'Property';

        if (isSaved) {
            setSavedIds((prev) => prev.filter((item) => item !== id));
            triggerNotification(`Removed "${targetPropName}" from saved listings.`, 'info');
        } else {
            setSavedIds((prev) => [...prev, id]);
            triggerNotification(`Added "${targetPropName}" to saved listings!`, 'success');
        }
    };

    // Submit Rent Inquiry Proposal callback
    const handleBookInquiry = (inquiry: Inquiry) => {
        const historical = localStorage.getItem('mysewa_inquiries');
        const logs = historical ? JSON.parse(historical) : [];
        logs.push(inquiry);
        localStorage.setItem('mysewa_inquiries', JSON.stringify(logs));
        triggerNotification(`Inquiry proposal submitted for ${inquiry.propertyName}. Strata representative will verify soon!`, 'success');
    };

    // Suggest property inside search when chatbot suggests it
    const handleChatSuggestedProperty = (name: string) => {
        const found = properties.find((p) => p.name.toLowerCase().includes(name.toLowerCase()));
        if (found) {
            setSelectedProperty(found);
        }
    };

    const handleSearchTrigger = () => {
        navigate(`/properties?search=${filters.searchQuery}`);
    };

    // Filter listings Reactively
    const filteredProperties = properties.filter((prop) => {
        // Search query matches name or location
        const query = filters.searchQuery.toLowerCase();
        const matchQuery =
            (prop.name || '').toLowerCase().includes(query) ||
            (prop.location || '').toLowerCase().includes(query)

        // Location dropdown match
        const matchLocation = filters.location ? prop.location.includes(filters.location) : true;

        // Price range matching
        const propPrice = prop.price || 0;
        const minP = filters.minPrice !== undefined ? filters.minPrice : 0;
        const maxP = filters.maxPrice !== undefined ? filters.maxPrice : 10000;
        const matchPrice = propPrice >= minP && propPrice <= maxP;

        // Stability floor match
        const matchStability = prop.stabilityScore >= (filters.minStability || 0);

        // Rooms count match
        const matchBedrooms = filters.bedrooms ? prop.bedrooms.toString() === filters.bedrooms : true;

        // Bathrooms count match
        const matchBathrooms = filters.bathrooms ? prop.bathrooms.toString() === filters.bathrooms : true;

        // Building/Property type match
        const matchPropertyType =
            !filters.propertyType || filters.propertyType === 'Any'
                ? true
                : prop.propertyType
                    ? prop.propertyType.toLowerCase() === filters.propertyType.toLowerCase()
                    : true;

        // Furnishing match
        const matchFurnishing =
            !filters.furnishing || filters.furnishing === 'Any'
                ? true
                : prop.furnishing
                    ? prop.furnishing.toLowerCase() === filters.furnishing.toLowerCase()
                    : true;

        // Transit friendly toggle
        const matchTransit = filters.transitFriendlyOnly ? !!prop.transitFriendly : true;

        // Verified landlord passport matching
        const matchVerified = filters.isVerifiedOnly ? !!prop.isVerified : true;

        // Sqft area range checks
        const propSqft = prop.sqft || 0;
        const minS = filters.minSqft !== undefined ? filters.minSqft : 0;
        const maxS = filters.maxSqft !== undefined ? filters.maxSqft : 10000;
        const matchSqft = propSqft >= minS && propSqft <= maxS;

        // Amenities checklist matching (all of the checked ones must be matched inside features)
        const requiredAmenities = filters.selectedAmenities || [];
        const matchAmenities = requiredAmenities.every((amenity) => {
            const featureString = (prop.features || []).join(' ').toLowerCase();
            const amLower = amenity.toLowerCase();
            if (amLower.includes('pool')) return featureString.includes('pool');
            if (amLower.includes('gym')) return featureString.includes('gym') || featureString.includes('pilates');
            if (amLower.includes('internet') || amLower.includes('fiber')) return featureString.includes('fiber') || featureString.includes('internet');
            if (amLower.includes('security')) return featureString.includes('security') || featureString.includes('3 tier') || featureString.includes('guard');
            if (amLower.includes('smart')) return featureString.includes('smart');
            if (amLower.includes('mall')) return featureString.includes('mall');
            if (amLower.includes('elevator')) return featureString.includes('elevator');
            if (amLower.includes('parking')) return featureString.includes('parking');
            return featureString.includes(amLower);
        });

        return (
            matchQuery &&
            matchLocation &&
            matchPrice &&
            matchStability &&
            matchBedrooms &&
            matchBathrooms &&
            matchPropertyType &&
            matchFurnishing &&
            matchTransit &&
            matchVerified &&
            matchSqft &&
            matchAmenities
        );
    });

    // Extract unique locations for selection dropdown
    const uniqueLocations = Array.from(new Set(properties.map((p) => (p.location || '').split(',')[0].trim())));

    return (
        <div className="min-h-screen bg-surface font-sans text-on-surface flex flex-col relative transition-all">

            {/* Dynamic Floating Notification Alert Stream */}
            <div className="fixed top-20 right-6 z-[100] space-y-2 pointer-events-none max-w-sm w-full">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`pointer-events-auto p-4 rounded-2xl shadow-xl flex gap-3 text-xs font-semibold leading-relaxed animate-slide-left border ${notif.type === 'success'
                            ? 'bg-green-50 text-green-800 border-green-200'
                            : notif.type === 'info'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                    >
                        {notif.type === 'success' && <CheckCircle className="text-green-600 shrink-0" size={16} />}
                        {notif.type === 'info' && <Info className="text-blue-600 shrink-0" size={16} />}
                        {notif.type === 'warn' && <ShieldAlert className="text-amber-600 shrink-0" size={16} />}
                        <div>{notif.message}</div>
                    </div>
                ))}
            </div>

            <Header
                mode="auth"
                onNavigate={() => navigate('/')}
                activeSection=""
                userProfile={user ? { name: user.name, score: 0, role: 'tenant' } : null}
                onOpenAuth={() => navigate('/login')}
                onLogout={() => {
                    setUser(null);
                    localStorage.removeItem('mysewa_session');
                }}
            />

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-16 py-6 space-y-16">

                {/* HERO SEARCH SECTION: Find Your Next Stable Home */}
                <section className="text-center md:text-left py-12 space-y-6">
                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
                            Find Your Next <span className="text-primary">Stable</span> Home
                        </h1>
                        <p className="text-lg md:text-xl text-on-surface-variant font-medium leading-relaxed max-w-2xl">
                            Advanced analytics to ensure your rental security and long-term satisfaction. Every listing undergoes automated biometric matching and strata legal registry vetting.
                        </p>

                        {/* Quick action Search layout matching the mockup */}
                        <div className="relative w-full max-w-2xl group pt-4">
                            <div className="absolute inset-y-0 left-4 top-4 flex items-center pointer-events-none text-outline">
                                <Search size={22} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={filters.searchQuery}
                                onChange={(e) => {
                                    setFilters({ ...filters, searchQuery: e.target.value });
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSearchTrigger();
                                }}
                                placeholder="Search by city, neighborhood, or building name..."
                                className="w-full h-14 pl-12 pr-32 bg-white border border-outline-variant rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm text-sm md:text-base text-on-surface"
                            />
                            <button
                                onClick={handleSearchTrigger}
                                className="absolute right-2 top-6 bottom-2 h-10 bg-primary text-on-primary px-6 rounded-xl font-semibold text-sm hover:bg-primary-container active:scale-95 transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1"
                            >
                                <span>Search</span>
                            </button>
                        </div>

                        {/* Autocomplete fast pill tags */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-on-surface-variant font-semibold">
                            <span className="text-slate-400 uppercase tracking-widest text-[10px]">Popular Districts:</span>
                            {['Bukit Bintang', 'Sentul East', 'Bangsar South', 'Setapak'].map((district) => (
                                <button
                                    key={district}
                                    onClick={() => {
                                        setFilters({ ...filters, searchQuery: district });
                                        handleSearchTrigger();
                                        triggerNotification(`Filtering by popular area: ${district}`, 'info');
                                    }}
                                    className="bg-surface-container-low hover:bg-surface-container-high transition-all border border-outline-variant/30 px-3 py-1 rounded-full text-slate-700 cursor-pointer"
                                >
                                    {district}
                                </button>
                            ))}
                        </div>

                    </div>
                </section>

                {/* BENTO GRID: New Protection Policies / Verified Listings */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Bento Card Left (Protection Policies with hot-linked image of towers) */}
                    <div
                        onClick={() => setActivePolicyPopup('protection')}
                        className="md:col-span-2 relative overflow-hidden rounded-2xl h-64 shadow-sm group cursor-pointer border border-outline-variant/10"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent z-10 transition-opacity group-hover:opacity-90" />

                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX50PUpy_7B4HImexBm7QpIVoMyPSXcYJnhuRdg30xbG9dIYgL4TxfKKCR9TSAy6fzisvGTN8QDEigOgJzoVXh6LjOufJTPhVGCAkl8kfPIWk0fpOOyTOlCgqgO7gFWadnM1lnJKNUHLlgN18rVTyofWTIElly0z1r2yqVOY0j781Kj7tH1Zeco3znUZLlAWD3mph7C5ar95eEN5P_eZrVOBaIz5W4PD5OEqs8TRizbAGEe24YtGVFLxDtnvh4OlFTVyAm9gWVsRU"
                            alt="A luxurious modern apartment building facade at twilight"
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        />

                        <div className="relative z-20 p-6 flex flex-col justify-end h-full text-white max-w-md space-y-1.5">
                            <span className="bg-amber-400 text-slate-950 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase w-max">
                                MySewa Insurance Trust
                            </span>
                            <h2 className="font-bold text-xl md:text-2xl leading-none">
                                New Protection Policies
                            </h2>
                            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                                Every MySewa listing is now protected by our proprietary Security Guard insurance. Click to read the deposit safety criteria.
                            </p>
                        </div>
                    </div>

                    {/* Bento Card Right (Verified Yellow container with Shield user badge) */}
                    <div
                        onClick={() => setActivePolicyPopup('biometric')}
                        className="bg-tertiary-fixed rounded-2xl p-6 flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-md transition-all group border border-amber-300 min-h-[220px]"
                    >
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-amber-200 text-on-tertiary-container flex items-center justify-center font-bold">
                                {/* Custom Material Vetted User Icon using simplified SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-lg text-on-tertiary-container leading-none">
                                Verified Listings
                            </h3>
                        </div>

                        <p className="text-xs text-on-tertiary-fixed-variant leading-relaxed font-semibold">
                            100% of our featured landlords have undergone advanced biometric verification and background checks. Click to view vetting protocol specifications.
                        </p>
                    </div>

                </section>




                {/* TRUST INDICATOR SECTION: Why trust MySewa? */}
                <section className="bg-surface-container rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-outline-variant/30">
                    <div className="max-w-md space-y-2">
                        <h2 className="text-2xl font-bold text-on-surface">
                            Why trust MySewa?
                        </h2>
                        <p className="text-sm text-on-surface-variant leading-relaxed font-semibold">
                            We use blockchain-verified data to generate our Stability Scores, predicting property management quality before you sign. Locked under regional UN SDG guidelines.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">

                        <div
                            onClick={() => setActivePolicyPopup('protection')}
                            className="bg-surface-container-lowest hover:bg-slate-50 transition-all border border-outline-variant/30 px-5 py-3 rounded-2xl flex items-center gap-2.5 shadow-sm cursor-pointer"
                        >
                            <ShieldCheck size={20} className="text-primary fill-primary/10" />
                            <span className="font-semibold text-xs text-on-surface">Insured Deposits</span>
                        </div>

                        <div
                            onClick={() => setActivePolicyPopup('sdg')}
                            className="bg-surface-container-lowest hover:bg-slate-50 transition-all border border-outline-variant/30 px-5 py-3 rounded-2xl flex items-center gap-2.5 shadow-sm cursor-pointer"
                        >
                            <Landmark size={20} className="text-primary" />
                            <span className="font-semibold text-xs text-on-surface">Data-Backed Scores</span>
                        </div>

                        <div
                            onClick={() => {
                                triggerNotification('Opening Chat Assistant SewaBot to solve support queries!', 'info');
                            }}
                            className="bg-surface-container-lowest hover:bg-slate-50 transition-all border border-outline-variant/30 px-5 py-3 rounded-2xl flex items-center gap-2.5 shadow-sm cursor-pointer"
                        >
                            <Smile size={20} className="text-primary" />
                            <span className="font-semibold text-xs text-on-surface">24/7 Live Support</span>
                        </div>

                    </div>
                </section>

            </main>

            {/* FOOTER: SDG 9 compliance alignments */}
            <footer className="bg-slate-100 border-t border-outline-variant/30 mt-16 text-slate-600">
                <div className="flex flex-col md:flex-row justify-between items-center py-10 px-4 md:px-16 max-w-7xl mx-auto w-full gap-6">

                    <div className="space-y-2 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <span className="font-bold text-xl text-primary">MySewa</span>
                            <span className="bg-primary/10 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                Aligned with SDG 9
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
                            &copy; 2026 MySewa. Aligned with United Nations Sustainable Development Goal 9: Industry, Innovation, and Infrastructure. Supporting reliable urban smart rentals.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-500">
                        <button onClick={() => triggerNotification('About us: MySewa digitizes urban property intelligence under transparent trust systems. Founded in Malaysia.', 'info')} className="hover:text-primary transition-colors cursor-pointer">About</button>
                        <button onClick={() => triggerNotification('Contracts, personal identities and payment history are guarded by end-to-end trust escrow.', 'info')} className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</button>
                        <button onClick={() => triggerNotification('MySewa Terms of Service comply with local Strata housing lease laws.', 'info')} className="hover:text-primary transition-colors cursor-pointer">Terms of Use</button>
                        <button onClick={() => triggerNotification('Contact support 24/7: support@mysewa.com.my', 'info')} className="hover:text-primary transition-colors cursor-pointer">Contact</button>
                        <button onClick={() => setActivePolicyPopup('sdg')} className="underline text-primary hover:text-primary-container font-bold cursor-pointer">
                            SDG 9 Alignment Details
                        </button>
                    </div>

                </div>
            </footer>

            {/* DRAWER: Slide-Out Saved Bookmarks List */}
            {isSavedDrawerOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsSavedDrawerOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 max-w-md w-full bg-white shadow-2xl flex flex-col h-full z-10 animate-slide-left">

                        {/* Drawer Header */}
                        <div className="p-6 bg-slate-50 border-b border-outline-variant/30 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2 text-slate-800">
                                <Heart size={20} className="text-red-500 fill-red-500" />
                                <h3 className="font-bold text-lg">My Bookmarks ({savedIds.length})</h3>
                            </div>
                            <button
                                onClick={() => setIsSavedDrawerOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Bookmarks container list */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-4">
                            {savedIds.length > 0 ? (
                                properties
                                    .filter((p) => savedIds.includes(p.id))
                                    .map((p) => (
                                        <div
                                            key={p.id}
                                            onClick={() => {
                                                setSelectedProperty(p);
                                                setIsSavedDrawerOpen(false);
                                            }}
                                            className="border border-outline-variant/30 hover:border-primary/50 transition-all rounded-2xl p-3 flex gap-3 cursor-pointer group bg-slate-50/50 hover:bg-white shadow-sm"
                                        >
                                            <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                <span className="absolute bottom-1 right-1 px-1 bg-amber-500 text-slate-950 text-[8px] font-bold rounded">
                                                    {p.stabilityScore}%
                                                </span>
                                            </div>
                                            <div className="flex-grow min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <h4 className="font-bold text-xs text-slate-800 truncate group-hover:text-primary transition-colors leading-normal">{p.name}</h4>
                                                    <p className="text-[10px] text-slate-500 flex items-center gap-0.5 truncate mt-0.5">
                                                        <MapPin size={8} />
                                                        {p.location}
                                                    </p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <strong className="text-xs text-primary font-bold">RM {p.price.toLocaleString()}</strong>
                                                    <button
                                                        onClick={(e) => handleToggleSaved(e, p.id)}
                                                        className="text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                        title="Remove bookmark"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <div className="text-center py-16 text-slate-400 space-y-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
                                        <Heart size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs text-slate-700">No Saved Listings Yet</h4>
                                        <p className="text-[10px] text-slate-500 max-w-xs mx-auto pt-1 font-medium leading-relaxed">
                                            Click the small Heart icon over any property card in the search grid to secure it here for quick access!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Close actions */}
                        <div className="p-4 bg-slate-50 border-t border-outline-variant/30 shrink-0 text-center">
                            <button
                                onClick={() => setIsSavedDrawerOpen(false)}
                                className="w-full h-11 bg-primary text-white font-bold rounded-xl text-xs shadow-sm hover:bg-primary-container transition-all cursor-pointer"
                            >
                                Continue Browsing
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* MODAL: Property Details Visual Tab Dashboard */}
            {selectedProperty && (
                <HomePropertyDetailModal
                    property={selectedProperty}
                    onClose={() => setSelectedProperty(null)}
                    isSaved={savedIds.includes(selectedProperty.id)}
                    onToggleSave={handleToggleSaved}
                    onBookInquiry={handleBookInquiry}
                />
            )}

            {/* MODAL: List Property & Calculate Stability Score */}
            {listModalOpen && (
                <ListPropertyModal
                    onClose={() => setListModalOpen(false)}
                    onAddProperty={handleAddNewProperty}
                />
            )}

            {/* MODAL: Login/SignUp Gateway */}
            {authModalType && (
                <AuthModals
                    type={authModalType}
                    onClose={() => setAuthModalType(null)}
                    onSuccess={(u) => {
                        setUser(u);
                        triggerNotification(`Welcome to MySewa, verified user ${u.name}!`, 'success');
                    }}
                />
            )}

            {/* MODAL: Specialized Vetted Policy Popups */}
            {activePolicyPopup && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setActivePolicyPopup(null)} />
                    <div className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full z-10 border border-outline-variant/30 space-y-4 animate-scale-up">

                        <div className="flex justify-between items-center text-primary border-b border-outline-variant/20 pb-3">
                            <div className="flex items-center gap-1.5 font-bold text-sm tracking-wide">
                                <ShieldCheck size={18} className="fill-primary/10" />
                                <span>MySewa Policy Auditor</span>
                            </div>
                            <button onClick={() => setActivePolicyPopup(null)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        {activePolicyPopup === 'protection' && (
                            <div className="space-y-3">
                                <h4 className="font-extrabold text-base text-slate-800">Security Guard Insurance Model</h4>
                                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                    We enforce the regional security deposit mandate. MySewa places tenant security deposits inside cryptographically matching legal accounts on bank trust levels.
                                </p>
                                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] text-slate-600 leading-normal font-semibold space-y-1">
                                    <p>✓ Instant RM 10,000 protection insurance payout on illegal eviction</p>
                                    <p>✓ 48-hour cash refund guarantee if landlord breaches terms</p>
                                    <p>✓ Full legal arbitration handled directly by our panel lawyers</p>
                                </div>
                            </div>
                        )}

                        {activePolicyPopup === 'biometric' && (
                            <div className="space-y-3">
                                <h4 className="font-extrabold text-base text-slate-800">Advanced Biometric e-KYC Verification</h4>
                                <p className="text-xs text-slate-600 leading-relaxed font-bold">
                                    A strict vetting standard safeguards our platform. No unverified landlords or unvetted title deeds can list here.
                                </p>
                                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                    All users submit biometric face matching, legal government passport identifiers, and proof of property ownership strata deeds. This reduces digital leasing fraud by 99.8%.
                                </p>
                            </div>
                        )}

                        {activePolicyPopup === 'sdg' && (
                            <div className="space-y-3">
                                <h4 className="font-extrabold text-base text-slate-800 flex items-center gap-1">
                                    <Landmark size={18} className="text-primary" />
                                    UN Sustainable Development Goal 9 Alignment
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                                    Goal 9 highlights: Build resilient infrastructure, promote inclusive and sustainable industrialization, and foster innovation.
                                </p>
                                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                    MySewa innovates by digitizing and auditing apartment trust factors, guaranteeing that urban infrastructures in Kuala Lumpur operate under green, accessible, and legal security. We integrate transit accessibility and smart HVAC utility monitoring directly into our datasets.
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => setActivePolicyPopup(null)}
                            className="w-full h-10 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                        >
                            Close Auditor Window
                        </button>

                    </div>
                </div>
            )}

            {/* SewaBot Floating Support Agent Widget */}
            <SupportChat
                onSuggestPropertyByName={handleChatSuggestedProperty}
            />

        </div>
    );
}
