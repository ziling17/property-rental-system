import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo, FormEvent } from 'react';
import {
    Home, Compass, Search, Building2, ChevronLeft, ChevronRight, Star, ShieldCheck, CheckCircle2,
    Wallet, Plus, X, FileText, Check, MapPin, Calendar, Mail, Phone, Info, Sparkles, Trash2, AlertCircle,
    Clock, ArrowUpRight, User, Activity, Calculator, Lock, ThumbsUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RentalProperty as Property, RentalBooking, INITIAL_PROPERTIES, INITIAL_BOOKINGS, BookingStatus, EscrowStatus } from '../rentalData';
import Header from '../components/Header';

export default function RentalHistory() {
    const navigate = useNavigate();
    const userProfile = (() => {
        const saved = localStorage.getItem('mysewa_session');
        return saved ? JSON.parse(saved) : null;
    })();

    // Navigation
    const [currentTab, setCurrentTab] = useState<'rentals' | 'browse' | 'search' | 'sdg'>('rentals');

    // Bookings and Properties state (persisted via localStorage)
    const [bookings, setBookings] = useState<RentalBooking[]>(() => {
        const saved = localStorage.getItem('mysewa_bookings');
        return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    });

    const [properties, setProperties] = useState<Property[]>(() => {
        const saved = localStorage.getItem('mysewa_properties');
        return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
    });

    useEffect(() => {
        localStorage.setItem('mysewa_bookings', JSON.stringify(bookings));
    }, [bookings]);

    useEffect(() => {
        localStorage.setItem('mysewa_properties', JSON.stringify(properties));
    }, [properties]);

    // Modal and Dialog States
    const [selectedBooking, setSelectedBooking] = useState<RentalBooking | null>(null);
    const [reviewBooking, setReviewBooking] = useState<RentalBooking | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [bookingWizardProperty, setBookingWizardProperty] = useState<Property | null>(null);
    const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);

    // Search & Filters for My Rentals Tab
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSlug, setFilterSlug] = useState<'All' | 'Active' | 'Completed' | 'Cancelled'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    // Search Properties Filter States
    const [browseSearch, setBrowseSearch] = useState('');
    const [browseCity, setBrowseCity] = useState<string>('All');
    const [maxPrice, setMaxPrice] = useState<number>(8000);
    const [onlySdg, setOnlySdg] = useState<boolean>(false);

    // Leave Review Inputs
    const [ratingInput, setRatingInput] = useState(5);
    const [reviewTextInput, setReviewTextInput] = useState('');

    // Add Custom Rental Inputs
    const [newPropTitle, setNewPropTitle] = useState('');
    const [newPropAddress, setNewPropAddress] = useState('');
    const [newPropCity, setNewPropCity] = useState('Kuala Lumpur');
    const [newPropRent, setNewPropRent] = useState(2000);
    const [newPropDeposit, setNewPropDeposit] = useState(2000);
    const [newPropDuration, setNewPropDuration] = useState('12 Months');
    const [newPropStartDate, setNewPropStartDate] = useState('Jun 2026');
    const [newPropStatus, setNewPropStatus] = useState<BookingStatus>('Active');
    const [newPropImgIdx, setNewPropImgIdx] = useState(0);
    const [newLandlordName, setNewLandlordName] = useState('Sarah Jenkins');
    const [newLandlordEmail, setNewLandlordEmail] = useState('sarah.j@mysewa-escrow.org');

    // Affordability Calculator Inputs
    const [monthlyIncome, setMonthlyIncome] = useState<number>(7500);
    const [budgetRatio, setBudgetRatio] = useState<number>(30); // 30% rule

    // Smart Draft Assistant
    const [tenantMsgType, setTenantMsgType] = useState('maintenance');
    const [customMsgDraft, setCustomMsgDraft] = useState('');
    const [generatedDraft, setGeneratedDraft] = useState('');
    const [draftCopied, setDraftCopied] = useState(false);

    // Rent Property Form Inputs
    const [signerName, setSignerName] = useState('');
    const [leaseMoveInDate, setLeaseMoveInDate] = useState('Oct 2026');
    const [leaseDuration, setLeaseDuration] = useState('12 Months');

    // Preset recommended image choices for custom rentals
    const propertyImgPresets = [
        { name: 'Penthouse', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJSVRpo0ecWBAGyuRndVy9L5Ti_E6TVUqcR1FaZAFQlA4UdEWRKwJDoU1hQIwidRXK-K-btUAz8SWuIAbv0up7ifhsBQht5qloAJrf0vx20i0buZUHZ5YFjQNru95jiTBRiDlFKqkKb4BSxvlJ1IZfZby-chb0XRbOYRbsg16bylPPWBeOIqM1_csfXnRDBiNrtbICV_h9ku2TsCeWmAK1xGWd8yQLooEkAvvqASql5XDqJGm4rka61kVYetHdK7oap_7C3A3Ezp8' },
        { name: 'Cosy Flat', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA8a2Vunaf0oeosqAWGeGdNNE_ikEJ8EeXEwt_OCQ-FI0GKVl2sBZVVw5gAGABWiS7EiGcfApMMeVATNQkWjm_fFvzbDa6rAx5idkEiBxmqSNI-7oMBAtU3x6loNPKZwoQBKquPi1XGJmrtqMuBzAxEeXSmPidPGpemDuKBSnVXMoB31zYZNCfwzx7bZDLFj8o_ncBp3123V05ixqPdlSaEqXUtaXcmVn8oqchHo4YLRcJHRxKL_iEAl20EDYrMLCuXcYCoY9XcLU' },
        { name: 'Kitchen view', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjVWldtuIzpToKsgkaRuSEgn8SrrWylP4Tv5juR3u5IQlQ_xwoTd0FRZR4dOWeJQKPkJyNzgXDihkgvkvVfYYVngXUc_2wAvfG4_VpiyRKiwg_0qUOaHM54J7TD2tonmeYNbVk1kyspomFU9h9U2kEzRRxhVyOyM_e8pfClZutfv9Ql0IefAOZ-k_DaO1cY2_EdLrwVgu9aWACbAIZi9nPSAh4Jq4F5vdwemjO-HQaQrjqfc507vchQTbUt4FQqPug9ZW1AZHsht8' },
        { name: 'Complex', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY7SkgH05SuyrJzDBmCmasvulAU7f0aAnLtuvh3bnDBGIjBAn30jt9hP96jLnVsZhlD_oXTY65APY6j52_3QhJnQUk7AX18DB_koZ-GN6mzMd7GKsO1_zlrnU7QYlu3XhoqlKDWDm37p2lzimydMPPnhlzc88lfvkTy70GWsNkcUaoqxI3gFcl_mL8XGNZvsb24YzPBvwDWZeD8jRBoaACCRr5AUxHy6kO0MKNJ-iI3iPM6MIWHSl5xRkFLptXvun781WV12d5VEI' },
        { name: 'Modern House', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop' },
        { name: 'Warm Living', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600&auto=format&fit=crop' }
    ];

    // Dynamic statistics calculations
    const totalRentalsCount = bookings.length;

    const completedRentalsCount = bookings.filter(b => b.status === 'Completed').length;

    const activeDepositSum = useMemo(() => {
        return bookings
            .filter(b => b.status === 'Active' || b.status === 'Scheduled')
            .reduce((sum, b) => sum + b.depositAmt, 0);
    }, [bookings]);

    // Cities extracted for filter dropdowns
    const availableCities = useMemo(() => {
        const list = new Set(properties.map(p => p.city));
        return ['All', ...Array.from(list)];
    }, [properties]);

    // Filtering for rentals tab
    const filteredBookings = useMemo(() => {
        let result = [...bookings];

        // Status filter
        if (filterSlug !== 'All') {
            result = result.filter(b => b.status === filterSlug);
        }

        // Name search
        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                b =>
                    b.propertyTitle.toLowerCase().includes(q) ||
                    b.propertyAddress.toLowerCase().includes(q)
            );
        }

        return result;
    }, [bookings, filterSlug, searchQuery]);

    // Paginated bookings (4 per page)
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
    const paginatedBookings = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredBookings.slice(start, start + itemsPerPage);
    }, [filteredBookings, currentPage]);

    // Filtering for browse properties tab
    const filteredProperties = useMemo(() => {
        return properties.filter(p => {
            const title = p.title ?? '';
            const address = p.address ?? '';
            const matchesSearch = title.toLowerCase().includes(browseSearch.toLowerCase()) ||
                address.toLowerCase().includes(browseSearch.toLowerCase());
            const matchesCity = browseCity === 'All' || p.city === browseCity;
            const matchesPrice = p.rent <= maxPrice;
            const matchesSdg = !onlySdg || p.sdgAligned;
            return matchesSearch && matchesCity && matchesPrice && matchesSdg;
        });
    }, [properties, browseSearch, browseCity, maxPrice, onlySdg]);

    // Handle page resets on filter adjustments
    useEffect(() => {
        setCurrentPage(1);
    }, [filterSlug, searchQuery]);

    // Affordability recommendation calculations
    const recommendedMaxRent = useMemo(() => {
        return Math.round((monthlyIncome * (budgetRatio / 100)));
    }, [monthlyIncome, budgetRatio]);

    const affordableProperties = useMemo(() => {
        return properties.filter(p => p.rent <= recommendedMaxRent);
    }, [properties, recommendedMaxRent]);

    // Handle leave review action
    const handleOpenReview = (booking: RentalBooking) => {
        setReviewBooking(booking);
        setRatingInput(booking.rating || 5);
        setReviewTextInput(booking.reviewText || '');
    };

    const submitReview = () => {
        if (!reviewBooking) return;

        setBookings(prev =>
            prev.map(b => {
                if (b.id === reviewBooking.id) {
                    return {
                        ...b,
                        rating: ratingInput,
                        reviewText: reviewTextInput,
                        reviewDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    };
                }
                return b;
            })
        );

        // Update global properties rating too if listed
        setProperties(prev =>
            prev.map(p => {
                if (p.title === reviewBooking.propertyTitle) {
                    const newCount = p.reviewsCount + (reviewBooking.rating ? 0 : 1);
                    const newRating = Math.round((((p.rating * p.reviewsCount) + ratingInput) / newCount) * 10) / 10;
                    return {
                        ...p,
                        rating: newRating,
                        reviewsCount: newCount
                    };
                }
                return p;
            })
        );

        setReviewBooking(null);
    };

    // Submit adding new rental from FAB
    const handleAddNewRental = (e: FormEvent) => {
        e.preventDefault();
        if (!newPropTitle || !newPropAddress) return;

        const newBookingId = 'book-' + (bookings.length + 1) + '-' + Math.floor(Math.random() * 100);
        const newBooking: RentalBooking = {
            id: newBookingId,
            propertyId: 'custom-' + Math.floor(Math.random() * 1000),
            propertyTitle: newPropTitle,
            propertyAddress: newPropAddress,
            propertyImgUrl: propertyImgPresets[newPropImgIdx].url,
            startDate: newPropStartDate,
            endDate: newPropStatus === 'Active' ? 'Present' : 'N/A',
            duration: newPropDuration,
            rent: Number(newPropRent),
            depositAmt: Number(newPropDeposit),
            status: newPropStatus,
            escrowStatus: newPropStatus === 'Active' ? 'Held' : newPropStatus === 'Scheduled' ? 'Pending' : 'Released',
            landlordName: newLandlordName,
            landlordEmail: newLandlordEmail,
            escrowVerifiedId: 'ESC-SEWA-' + Math.floor(100000 + Math.random() * 900000) + '-' + newPropCity.substring(0, 2).toUpperCase()
        };

        setBookings([newBooking, ...bookings]);
        setShowAddModal(false);

        // Reset input fields
        setNewPropTitle('');
        setNewPropAddress('');
        setNewPropRent(2000);
        setNewPropDeposit(2000);
    };

    // Handle rental creation from Browse Property Rent Button
    const handleRentPropertyClick = (property: Property) => {
        setBookingWizardProperty(property);
        setWizardStep(1);
        setSignerName('');
    };

    const handleCompleteRentalBooking = () => {
        if (!bookingWizardProperty) return;

        // Insert new booking
        const newBookingId = 'book-' + (bookings.length + 1) + '-' + Math.floor(Math.random() * 100);
        const newBooking: RentalBooking = {
            id: newBookingId,
            propertyId: bookingWizardProperty.id,
            propertyTitle: bookingWizardProperty.title,
            propertyAddress: bookingWizardProperty.address,
            propertyImgUrl: bookingWizardProperty.imgUrl,
            startDate: leaseMoveInDate,
            endDate: 'Present',
            duration: leaseDuration,
            rent: bookingWizardProperty.rent,
            depositAmt: bookingWizardProperty.deposit,
            status: 'Active',
            escrowStatus: 'Held',
            landlordName: bookingWizardProperty.landlordName,
            landlordEmail: bookingWizardProperty.landlordEmail,
            escrowVerifiedId: 'ESC-SEWA-' + Math.floor(100000 + Math.random() * 900000) + '-' + bookingWizardProperty.city.substring(0, 2).toUpperCase()
        };

        setBookings([newBooking, ...bookings]);
        setWizardStep(3); // Show Success Screen
    };

    // Smart message drafting for active modals
    const handleGenerateTemplateDraft = (booking: RentalBooking) => {
        let msg = '';
        if (tenantMsgType === 'maintenance') {
            msg = `Dear ${booking.landlordName},\n\nI am writing to log a maintenance request for my unit at ${booking.propertyAddress}. I have noticed an issue with the kitchen plumbing leaking slightly. Could you please schedule a technician to take a look?\n\nBecause this rental is managed on MySewa, we appreciate logging this into our secure timeline. Thank you!\n\nBest regards,\nTenant of ${booking.propertyTitle}`;
        } else if (tenantMsgType === 'extension') {
            msg = `Dear ${booking.landlordName},\n\nMy current lease term for ${booking.propertyTitle} is coming up for renewal soon. I would love to extend my booking under the same terms. MySewa escrow deposit structure has made our relation extremely secure and convenient!\n\nLet me know your availability to discuss next contract details.\n\nBest regards,\nTenant`;
        } else {
            msg = `Dear ${booking.landlordName},\n\nI am reaching out to confirm that MySewa verified escrow ID ${booking.escrowVerifiedId} represents RM ${booking.depositAmt.toLocaleString()} held in secure deposit for my stay at ${booking.propertyTitle}. Please verify the move-out ledger accordingly.\n\nSincerely,\nTenant`;
        }
        setGeneratedDraft(msg);
        setDraftCopied(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedDraft);
        setDraftCopied(true);
        setTimeout(() => setDraftCopied(false), 2000);
    };

    return (
        <div className="bg-background text-on-background font-sans min-h-screen flex flex-col justify-between">

            {/* Top Navigation Bar */}
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

            {/* Main Content Arena */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-6 md:py-10">

                {/* TAB 1: RENTAL HISTORY TABLE (My Rentals Dashboard) */}
                {currentTab === 'rentals' && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {/* Header Section */}
                        <header>
                            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Secure Housing Ledger</span>
                            <h1 className="font-sans text-3xl md:text-4xl font-extrabold text-on-surface mt-2 tracking-tight">Rental History</h1>
                            <p className="font-sans text-base text-on-surface-variant mt-1.5 max-w-2xl">
                                Manage your past bookings, track active rentals, and securely monitor escrow security deposits.
                            </p>
                        </header>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Stat 1 */}
                            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-surface-container-high flex items-center gap-4 hover:shadow-md transition-shadow">
                                <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                    <Building2 className="h-6 w-6 stroke-[2]" />
                                </div>
                                <div>
                                    <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Total Rentals</p>
                                    <p className="text-2xl font-bold text-on-surface">{totalRentalsCount} Properties</p>
                                </div>
                            </div>

                            {/* Stat 2 */}
                            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-surface-container-high flex items-center gap-4 hover:shadow-md transition-shadow">
                                <div className="bg-tertiary-container text-tertiary bg-yellow-500/10 p-3 rounded-lg">
                                    <CheckCircle2 className="h-6 w-6 stroke-[2]" />
                                </div>
                                <div>
                                    <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Verified Stays</p>
                                    <p className="text-2xl font-bold text-on-surface">{completedRentalsCount} Completed</p>
                                </div>
                            </div>

                            {/* Stat 3 */}
                            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-surface-container-high flex items-center gap-4 hover:shadow-md transition-shadow">
                                <div className="bg-red-500/10 p-3 rounded-lg text-red-600">
                                    <Wallet className="h-6 w-6 stroke-[2]" />
                                </div>
                                <div>
                                    <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Active Deposits</p>
                                    <p className="text-2xl font-bold text-on-surface">RM {activeDepositSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </div>

                        {/* Controls Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-surface-container-low p-2.5 rounded-xl border border-surface-container border-dashed">

                            {/* Category Slugs */}
                            <div className="flex overflow-x-auto gap-1 bg-surface-container-low scrollbar-none">
                                {(['All', 'Active', 'Completed', 'Cancelled'] as const).map(slug => (
                                    <button
                                        key={slug}
                                        onClick={() => setFilterSlug(slug)}
                                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filterSlug === slug
                                            ? 'bg-white text-primary shadow-xs'
                                            : 'text-on-surface-variant hover:text-on-surface hover:bg-white/50'
                                            }`}
                                    >
                                        {slug}
                                    </button>
                                ))}
                            </div>

                            {/* In-Table Search Input */}
                            <div className="relative">
                                <Search className="h-4.5 w-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                                <input
                                    type="text"
                                    placeholder="Search by property..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full md:w-64 pl-9 pr-4 py-2 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-xs text-on-surface font-medium placeholder-on-surface-variant/60"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Ledger Listing Card & Table */}
                        <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead className="bg-surface-container-low border-b border-surface-container-high">
                                        <tr>
                                            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Property</th>
                                            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Duration</th>
                                            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Monthly Rent</th>
                                            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
                                            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-surface-container-high md:text-sm">
                                        {paginatedBookings.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-5 py-12 text-center text-on-surface-variant">
                                                    <AlertCircle className="h-8 w-8 text-outline mx-auto mb-2" />
                                                    <p className="font-semibold text-sm">No rental records found</p>
                                                    <p className="text-xs mt-1">Try resetting your filters or search keywords.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedBookings.map((booking) => (
                                                <tr
                                                    key={booking.id}
                                                    className="hover:bg-surface-bright/50 transition-colors group cursor-pointer"
                                                    onClick={() => setSelectedBooking(booking)}
                                                >
                                                    {/* Property Details Column */}
                                                    <td className="px-5 py-4.5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-surface-container-high shadow-xs">
                                                                <img
                                                                    src={booking.propertyImgUrl}
                                                                    alt={booking.propertyTitle}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-on-surface text-sm flex items-center gap-1.5">
                                                                    {booking.propertyTitle}
                                                                    {booking.status === 'Active' && (
                                                                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                    )}
                                                                </p>
                                                                <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1 mt-0.5">
                                                                    <MapPin className="h-3.5 w-3.5 text-outline shrink-0" />
                                                                    {booking.propertyAddress}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Duration Column */}
                                                    <td className="px-5 py-4.5">
                                                        <div className="font-medium text-xs md:text-sm text-on-surface">
                                                            {booking.startDate} - {booking.endDate}
                                                        </div>
                                                        <div className="text-xs text-primary font-semibold mt-0.5 flex items-center gap-1">
                                                            <Clock className="h-3 w-3 shrink-0" />
                                                            {booking.duration === 'Ongoing' ? 'Ongoing Term' : booking.duration}
                                                        </div>
                                                    </td>

                                                    {/* Rent Column */}
                                                    <td className="px-5 py-4.5 font-bold text-on-surface">
                                                        RM {booking.rent.toLocaleString()}/mo
                                                    </td>

                                                    {/* Status Pill Column */}
                                                    <td className="px-5 py-4.5">
                                                        {booking.status === 'Active' && (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/25">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />
                                                                Active
                                                            </span>
                                                        )}

                                                        {booking.status === 'Completed' && (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300">
                                                                Completed
                                                            </span>
                                                        )}

                                                        {booking.status === 'Scheduled' && (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-amber-700 border border-amber-200">
                                                                Scheduled
                                                            </span>
                                                        )}

                                                        {booking.status === 'Cancelled' && (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                                                                Cancelled
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Custom Actions depending on mockup specifications */}
                                                    <td className="px-5 py-4.5 text-right font-medium" onClick={(e) => e.stopPropagation()}>
                                                        {booking.status === 'Active' && (
                                                            <button
                                                                onClick={() => setSelectedBooking(booking)}
                                                                className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-xs active:scale-95 duration-100"
                                                            >
                                                                View Details
                                                            </button>
                                                        )}

                                                        {booking.status === 'Completed' && !booking.rating && (
                                                            <div className="flex justify-end gap-1.5">
                                                                <button
                                                                    onClick={() => handleOpenReview(booking)}
                                                                    className="px-3.5 py-1.5 border border-primary text-primary rounded-lg text-xs font-bold hover:bg-primary/5 transition-all outline-none"
                                                                >
                                                                    Review
                                                                </button>
                                                                <button
                                                                    onClick={() => setSelectedBooking(booking)}
                                                                    className="px-3.5 py-1.5 bg-surface-container-low text-on-surface rounded-lg text-xs font-bold hover:bg-surface-container-high transition-all"
                                                                >
                                                                    Details
                                                                </button>
                                                            </div>
                                                        )}

                                                        {booking.status === 'Completed' && booking.rating && (
                                                            <div className="flex justify-end gap-0.5 text-amber-500">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-4 w-4 ${i < (booking.rating || 0) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}

                                                        {booking.status === 'Cancelled' && (
                                                            <span className="text-xs text-on-surface-variant font-semibold">
                                                                {booking.refundDate ? `Refunded ${booking.refundDate}` : 'Fully Refunded'}
                                                            </span>
                                                        )}

                                                        {booking.status === 'Scheduled' && (
                                                            <div className="flex justify-end gap-1.5">
                                                                <button
                                                                    onClick={() => {
                                                                        // Simulated cancellation
                                                                        if (window.confirm('Are you sure you want to cancel this scheduled rental? The deposit will be immediately returned from our digital escrow smart system.')) {
                                                                            setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'Cancelled', escrowStatus: 'Refunded', refundDate: 'Today' } : b));
                                                                        }
                                                                    }}
                                                                    className="text-xs text-red-600 hover:text-red-800 font-bold px-2 py-1"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => setSelectedBooking(booking)}
                                                                    className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold"
                                                                >
                                                                    Escrow
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table pagination & Footer matching mockup */}
                            <div className="px-5 py-4 bg-surface-container-low border-t border-surface-container-high flex flex-col md:flex-row justify-between items-center gap-4">
                                <p className="text-xs font-medium text-on-surface-variant">
                                    Showing {filteredBookings.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} historical rentals
                                </p>

                                {totalPages > 1 && (
                                    <div className="flex gap-1.5">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            className="w-8.5 h-8.5 flex items-center justify-center rounded-lg border border-outline-variant bg-white disabled:opacity-40 hover:bg-surface-container-low transition-all text-on-surface-variant"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>

                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-8.5 h-8.5 flex items-center justify-center rounded-lg font-semibold text-xs transition-all ${currentPage === i + 1
                                                    ? 'bg-primary text-white shadow-xs'
                                                    : 'border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container-low'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            className="w-8.5 h-8.5 flex items-center justify-center rounded-lg border border-outline-variant bg-white disabled:opacity-40 hover:bg-surface-container-low transition-all text-on-surface-variant"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SDG Infrastructure Trust Block */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="bg-primary/5 rounded-xl p-5 border border-primary/15 flex gap-4">
                                <div className="text-primary shrink-0">
                                    <ShieldCheck className="h-8 w-8 stroke-[1.5]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-on-surface tracking-tight mb-1">Secure Escrow Safe Ledger</h3>
                                    <p className="text-xs text-on-surface-variant leading-relaxed">
                                        All deposits are held in a secure, digital escrow trust, protecting both landlords and tenants against lease disputes. Deposit recovery timelines are tracked in real-time.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-amber-600/5 rounded-xl p-5 border border-amber-500/15 flex gap-4">
                                <div className="text-amber-700 shrink-0">
                                    <Activity className="h-8 w-8 stroke-[1.5]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-on-surface tracking-tight mb-1">SDG Goal 9 Alignment</h3>
                                    <p className="text-xs text-on-surface-variant leading-relaxed">
                                        By designing resilient, digital leasing infrastructure with cryptographic deposit codes, MySewa contributes to sustainable industry development and minimizes financial transaction frictions of civic lodging.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* TAB 2: BROWSE LISTINGS */}
                {currentTab === 'browse' && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <header className="mb-6">
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                <Compass className="h-3 w-3" />
                                <span>Verified Escrow Properties</span>
                            </div>
                            <h1 className="text-3xl font-extrabold text-on-surface mt-2">Explore Available Rentals</h1>
                            <p className="text-sm text-on-surface-variant max-w-xl.5 mt-2">
                                Browse sustainable housing aligned with green standards. Every listing is verified and backed by integrated escrow deposit protection instantly.
                            </p>
                        </header>

                        {/* Filter Section */}
                        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Search Keywords</label>
                                <div className="relative">
                                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                                    <input
                                        type="text"
                                        placeholder="Loft, Chelsea, Garden..."
                                        value={browseSearch}
                                        onChange={(e) => setBrowseSearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-1.8 bg-white border border-outline-variant rounded-lg text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Select City</label>
                                <select
                                    value={browseCity}
                                    onChange={(e) => setBrowseCity(e.target.value)}
                                    className="w-full bg-white border border-outline-variant rounded-lg py-1.8 px-3 text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
                                >
                                    {availableCities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Max Monthly Rent</label>
                                    <span className="text-xs font-bold text-primary">RM {maxPrice.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="500"
                                    max="10000"
                                    step="100"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-full accent-primary h-1.5 bg-gray-250 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="flex items-center gap-2 mt-4 md:mt-0 md:justify-center">
                                <input
                                    type="checkbox"
                                    id="sdg-only"
                                    checked={onlySdg}
                                    onChange={(e) => setOnlySdg(e.target.checked)}
                                    className="rounded text-primary focus:ring-primary h-4 w-4 border-outline"
                                />
                                <label htmlFor="sdg-only" className="text-xs font-semibold text-on-surface cursor-pointer select-none">
                                    Only Aligned with SDG 9
                                </label>
                            </div>
                        </div>

                        {/* Properties Listings Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProperties.length === 0 ? (
                                <div className="col-span-full py-12 text-center bg-white rounded-xl border border-surface-container-high">
                                    <AlertCircle className="h-10 w-10 text-outline mx-auto mb-2" />
                                    <p className="font-semibold text-sm text-on-surface">No properties match your current filters</p>
                                    <button
                                        onClick={() => { setBrowseSearch(''); setBrowseCity('All'); setMaxPrice(4000); setOnlySdg(false); }}
                                        className="text-xs text-primary font-bold mt-2 hover:underline"
                                    >
                                        Reset all filters
                                    </button>
                                </div>
                            ) : (
                                filteredProperties.map(property => (
                                    <motion.div
                                        layout
                                        key={property.id}
                                        className="bg-surface-container-lowest rounded-xl border border-surface-container-high overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between"
                                    >
                                        <div>
                                            {/* Image Frame */}
                                            <div className="relative aspect-video overflow-hidden bg-gray-100">
                                                <img
                                                    src={property.imgUrl}
                                                    alt={property.title}
                                                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                                                />
                                                <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 items-end">
                                                    {property.sdgAligned && (
                                                        <span className="text-[10px] font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                            <Sparkles className="h-3 w-3 inline-block" />
                                                            SDG 9 Green
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] font-bold bg-primary text-white px-2.5 py-1 rounded-full shadow-sm">
                                                        Escrow Guarded
                                                    </span>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3.5 pt-6">
                                                    <p className="text-lg font-bold text-white tracking-tight">{property.title}</p>
                                                    <p className="text-white/80 text-xs flex items-center gap-1 mt-0.5 font-medium">
                                                        <MapPin className="h-3.5 w-3.5 text-white/90 shrink-0" />
                                                        {property.address}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Content Container */}
                                            <div className="p-4.5 space-y-3.5">
                                                <div className="flex justify-between items-center">
                                                    <div className="text-lg font-extrabold text-on-surface">
                                                        RM {property.rent.toLocaleString()}<span className="text-xs text-on-surface-variant font-medium"> / month</span>
                                                    </div>

                                                    <div className="flex items-center gap-1 text-xs">
                                                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                                        <span className="font-bold text-on-surface">{property.rating}</span>
                                                        <span className="text-on-surface-variant font-medium">({property.reviewsCount} verified stays)</span>
                                                    </div>
                                                </div>

                                                <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                                                    {property.description}
                                                </p>

                                                {/* Amenities Tags */}
                                                <div className="flex flex-wrap gap-1.5">
                                                    {property.amenities.map(amenity => (
                                                        <span key={amenity} className="text-[10px] font-bold bg-surface-container-low border border-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-md">
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Action Footer */}
                                        <div className="p-4.5 border-t border-surface-container-high bg-surface-container-low/30 flex items-center justify-between">
                                            <div className="text-left">
                                                <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Required Escrow</p>
                                                <p className="text-xs font-bold text-on-surface">RM {property.deposit.toLocaleString()} (Refundable)</p>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { setSelectedProperty(property); }}
                                                    className="px-3.5 py-2 hover:bg-surface-container-low text-on-surface-variant rounded-lg text-xs font-bold transition-all border border-outline-variant"
                                                >
                                                    More Info
                                                </button>
                                                <button
                                                    onClick={() => handleRentPropertyClick(property)}
                                                    className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/95 transition-all shadow-xs"
                                                >
                                                    Rent &amp; Save
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}

                {/* TAB 3: SEARCH PLANNER & AFFORDABILITY ESTIMATOR */}
                {currentTab === 'search' && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        <header className="mb-6">
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-yellow-500/10 px-3 py-1 rounded-full">Intelligent Budget Planner</span>
                            <h1 className="text-3xl font-extrabold text-on-surface mt-2">Rental Affordability Planner</h1>
                            <p className="text-sm text-on-surface-variant max-w-xl mt-1">
                                Estimate how much you should reasonably spend on rent and discover secure properties that align with both your paycheck budget and ESG metrics.
                            </p>
                        </header>

                        {/* Smart Affordability Calculator Dashboard */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Inputs Box */}
                            <div className="lg:col-span-1 bg-surface-container-lowest p-6 rounded-xl border border-surface-container-high shadow-xs space-y-5">
                                <div className="flex items-center gap-2 pb-3 border-b border-surface-container-high">
                                    <Calculator className="h-5 w-5 text-primary" />
                                    <h3 className="font-bold text-on-surface text-base">Affordability Inputs</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Estimated Monthly Income (RM)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant font-sans">RM</span>
                                            <input
                                                type="number"
                                                value={monthlyIncome}
                                                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                                                className="w-full pl-9 pr-3 py-2 bg-white border border-outline-variant rounded-lg text-sm font-bold text-on-surface focus:ring-1 focus:ring-primary outline-none"
                                            />
                                        </div>
                                        <p className="text-[10px] text-on-surface-variant mt-1.5 leading-normal">Enter your total household net take-home salary.</p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Salary Aliquot Ratio</label>
                                            <span className="text-xs font-bold text-primary">{budgetRatio}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="15"
                                            max="50"
                                            step="5"
                                            value={budgetRatio}
                                            onChange={(e) => setBudgetRatio(Number(e.target.value))}
                                            className="w-full accent-primary h-1.5 bg-gray-250 rounded-lg cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] text-on-surface-variant mt-1">
                                            <span>15% (Strict)</span>
                                            <span>30% (Standard)</span>
                                            <span>50% (Heavy)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                    <p className="text-xs font-bold text-primary uppercase tracking-wide">Plan Formula</p>
                                    <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                                        The <strong>30% Rule</strong> is globally recognized as the limit of healthy household spending on housing without burdening other healthcare or safety needs.
                                    </p>
                                </div>
                            </div>

                            {/* Recommendation Analysis */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Result Hero Panel */}
                                <div className="bg-primary text-white p-6 rounded-2xl shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    {/* Subtle Background Art */}
                                    <div className="absolute right-0 bottom-0 opacity-10 text-[100px] leading-none pointer-events-none select-none font-extrabold translate-y-6">
                                        SDG9
                                    </div>

                                    <div className="space-y-1.5">
                                        <p className="text-xs uppercase font-bold tracking-widest text-white/80">Affordable Rent Ceiling</p>
                                        <p className="text-4xl font-extrabold tracking-tight">RM {recommendedMaxRent.toLocaleString()}<span className="text-lg font-medium text-white/80"> / mo</span></p>
                                        <p className="text-xs text-white/80 max-w-sm mt-1.5">
                                            Properties costing less than this amount represent healthy financial sustainability for your current income profile.
                                        </p>
                                    </div>

                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-left w-full md:w-auto shrink-0 space-y-1">
                                        <div className="text-xs uppercase font-bold text-white/85">Ideal Security Deposit</div>
                                        <div className="text-xl font-extrabold">RM {recommendedMaxRent.toLocaleString()}</div>
                                        <div className="text-[10px] text-white/70">Verified digitally on MySewa ledger</div>
                                    </div>
                                </div>

                                {/* Affordable Matches */}
                                <div>
                                    <h3 className="font-bold text-on-surface text-base mb-4 flex items-center gap-2">
                                        <ThumbsUp className="h-4.5 w-4.5 text-emerald-500" />
                                        Affordable Properties matching your plan ({affordableProperties.length})
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {affordableProperties.map(p => (
                                            <div
                                                key={p.id}
                                                className="bg-white p-3.5 rounded-xl border border-surface-container-high shadow-xs hover:border-primary/40 transition-colors flex gap-3 cursor-pointer"
                                                onClick={() => { setSelectedProperty(p); }}
                                            >
                                                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                                                    <img src={p.imgUrl} alt={p.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="space-y-1 flex-grow">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="font-bold text-on-surface text-xs md:text-sm leading-tight">{p.title}</h4>
                                                        <span className="text-xs font-bold text-primary font-mono">RM {p.rent}/mo</span>
                                                    </div>
                                                    <p className="text-[11px] text-on-surface-variant line-clamp-1">{p.address}</p>
                                                    <div className="flex items-center justify-between pt-1">
                                                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                                            Under budget
                                                        </span>
                                                        <span className="text-[10px] text-on-surface font-semibold hover:underline flex items-center gap-0.5">
                                                            View details
                                                            <ArrowUpRight className="h-3 w-3" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Informational Section */}
                                <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high shadow-xs space-y-3">
                                    <h4 className="font-bold text-sm text-on-surface flex items-center gap-2">
                                        <Info className="h-4 w-4 text-primary" />
                                        Leveraging SDG 9 for Digital Civic Housing Infrastructure
                                    </h4>
                                    <p className="text-xs text-on-surface-variant leading-relaxed">
                                        Under standard property technology networks, renting a house demands extensive paperwork, background checking bureaus, and third-party validation brokers. Resilient housing digital platforms (as outlined in UN Sustainable Development Goal 9 on resilient infrastructure and fostering innovation) significantly lower transactional overhead. MySewa implements a direct-to-escrow contract signature which removes administrative middle charges, bringing secure renting to low and middle-income groups safely.
                                    </p>
                                </div>

                            </div>

                        </div>
                    </motion.div>
                )}

                {/* TAB 4: SDG 9 ALIGNMENT DETAILS */}
                {currentTab === 'sdg' && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        <header className="mb-6">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">UN SDGs &amp; PropTech</span>
                            <h1 className="text-3xl font-extrabold text-on-surface mt-2">Sustainable Infrastructure Audit</h1>
                            <p className="text-sm text-on-surface-variant max-w-xl.5 mt-1.5">
                                MySewa is deliberately architected to respond to United Nations Sustainable Development Goal 9, optimizing industry trust, digital innovation, and secure housing infrastructure.
                            </p>
                        </header>

                        {/* Content Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Card 1 */}
                            <div className="bg-white p-6 rounded-xl border border-surface-container-high shadow-xs space-y-3 hover:translate-y-[-2px] transition-transform">
                                <span className="text-4xl font-extrabold text-primary">01</span>
                                <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">Target 9.1: Safe &amp; Reliable Access</h3>
                                <p className="text-xs text-on-surface-variant leading-relaxed">
                                    By providing a secure digital property database, we ensure equitable access to affordable rental agreements. Our transparent historical pricing blocks predatory housing inflationary manipulation and ensures verifiable consumer records.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white p-6 rounded-xl border border-surface-container-high shadow-xs space-y-3 hover:translate-y-[-2px] transition-transform">
                                <span className="text-4xl font-extrabold text-amber-500">02</span>
                                <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">Target 9.3: Equal Financial Access</h3>
                                <p className="text-xs text-on-surface-variant leading-relaxed">
                                    Traditional high-friction deposit brokers exclude vulnerable tenants. Digital escrow ledgers (guaranteeing immediate release and protection in standard credit files) lower the collateral requirements for credit-worthy renters worldwide.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white p-6 rounded-xl border border-surface-container-high shadow-xs space-y-3 hover:translate-y-[-2px] transition-transform">
                                <span className="text-4xl font-extrabold text-emerald-500">03</span>
                                <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">Target 9.4: Clean &amp; Retrofitted Housing</h3>
                                <p className="text-xs text-on-surface-variant leading-relaxed">
                                    Our system verifies and labels properties employing green technologies, such as solar grid assists, energy-saving star appliances, rainwater filters, and low-VOC paints as shown on our verified status listings.
                                </p>
                            </div>

                        </div>

                        {/* Impact stats */}
                        <div className="bg-surface-container p-6 rounded-xl border border-surface-container-high text-center">
                            <h3 className="font-bold text-on-surface text-base mb-1">Impact Under MySewa Smart Verification</h3>
                            <p className="text-xs text-on-surface-variant mb-6">Global metrics tracked from integrated lease accounts</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <div className="text-3xl font-extrabold text-primary">100%</div>
                                    <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Escrow Deposit Safety</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-3xl font-extrabold text-emerald-600">84%</div>
                                    <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Green Retrofit Alignment</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-3xl font-extrabold text-amber-700">6x</div>
                                    <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Friction reduction rate</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-3xl font-extrabold text-on-surface">RM 245k</div>
                                    <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-semibold">Total Escrow Processed</div>
                                </div>
                            </div>
                        </div>

                        {/* visual callout */}
                        <div className="bg-surface-container-lowest p-6 rounded-xl border border-dashed border-primary/45 flex flex-col md:flex-row items-center gap-6 justify-between">
                            <div className="space-y-1.5 md:max-w-xl">
                                <h3 className="font-bold text-on-surface text-base">Want to register a certified green property?</h3>
                                <p className="text-xs text-on-surface-variant leading-relaxed">
                                    If you are a landlord employing green electrical systems, recycling water reservoirs, or smart-meter digital networks, you can declare your asset for our custom eco-verified certification.
                                </p>
                            </div>
                            <button
                                onClick={() => { setShowAddModal(true); setNewPropStatus('Active'); }}
                                className="px-5 py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/95 transition-all shadow-md shrink-0 focus:outline-none"
                            >
                                Launch Green Registration
                            </button>
                        </div>
                    </motion.div>
                )}

            </main>

            {/* FOOTER SECTION matching style variables */}
            <footer className="bg-surface-dim dark:bg-inverse-surface border-t border-surface-container-high transition-colors mt-12 py-10">
                <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop gap-6 text-center md:text-left text-xs text-on-surface-variant font-medium">
                    <div className="space-y-1">
                        <div className="font-sans text-sm font-extrabold text-on-surface flex items-center justify-center md:justify-start gap-1.5">
                            <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
                            MySewa
                        </div>
                        <p className="max-w-sm leading-relaxed">
                            &copy; {new Date().getFullYear()} MySewa. Designed under green prop-tech mandates aligned with United Nations SDG 9 (Industry, Innovation, and Infrastructure).
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <span onClick={() => { setCurrentTab('sdg'); }} className="hover:text-primary cursor-pointer transition-colors font-bold underline">SDG 9 Alignment Info</span>
                        <span onClick={() => { setCurrentTab('browse'); }} className="hover:text-primary cursor-pointer transition-colors">Browse Marketplace</span>
                        <a href="#" className="hover:text-primary transition-colors">Privacy Framework</a>
                        <a href="#" className="hover:text-primary transition-colors">Escrow Terms</a>
                        <a href="mailto:support@mysewa-escrow.org" className="hover:text-primary transition-colors">Contact</a>
                    </div>
                </div>
            </footer>

            {/* VIEW DETAILS DRAWER / MODAL OVERLAY */}
            <AnimatePresence>
                {selectedBooking && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Background Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBooking(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                        />

                        {/* Modal Body */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 border border-surface-container-highest max-h-[90vh] flex flex-col"
                        >
                            <div className="relative overflow-hidden shrink-0 aspect-[2.3] bg-gray-550 flex items-end">
                                <img
                                    src={selectedBooking.propertyImgUrl}
                                    alt={selectedBooking.propertyTitle}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="absolute top-4 right-4 h-8.5 w-8.5 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 border border-white/20 transition-all focus:outline-none"
                                >
                                    <X className="h-5.5 w-5.5" />
                                </button>

                                <div className="p-5 relative space-y-1 text-white">
                                    <div className="flex gap-2 items-center text-xs">
                                        <span className="bg-primary px-2.5 py-0.5 rounded font-bold text-[10px]">VERIFIED ESCROW LEDGER</span>
                                        <span className="bg-white/15 px-2.5 py-0.5 rounded font-mono text-[10px] border border-white/10 flex items-center gap-1">
                                            <Lock className="h-3 w-3 inline" />
                                            {selectedBooking.escrowVerifiedId}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-extrabold tracking-tight mt-1">{selectedBooking.propertyTitle}</h3>
                                    <p className="text-white/80 text-xs flex items-center gap-1 font-medium">
                                        <MapPin className="h-3.5 w-3.5 text-white/90 shrink-0" />
                                        {selectedBooking.propertyAddress}
                                    </p>
                                </div>
                            </div>

                            {/* Scrollable details */}
                            <div className="p-5 overflow-y-auto space-y-6 flex-grow text-xs md:text-sm">

                                {/* Contract Specs */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-low p-4 rounded-xl border border-surface-container font-medium text-on-surface">
                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Monthly Rent</span>
                                        <span className="text-base font-extrabold">RM {selectedBooking.rent.toLocaleString()}</span>
                                    </div>

                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Security Escrow</span>
                                        <span className="text-base font-extrabold text-primary">RM {selectedBooking.depositAmt.toLocaleString()}</span>
                                    </div>

                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Start Date</span>
                                        <span className="text-sm font-bold">{selectedBooking.startDate}</span>
                                    </div>

                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Term Limit</span>
                                        <span className="text-sm font-bold">{selectedBooking.duration}</span>
                                    </div>
                                </div>

                                {/* Landlord Contact Card & Escrow Status */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Landlord contact */}
                                    <div className="border border-surface-container-high rounded-xl p-4 space-y-2.5 bg-white">
                                        <h4 className="font-bold text-xs uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
                                            <User className="h-4 w-4 text-primary shrink-0" />
                                            Property Landlord
                                        </h4>
                                        <div className="space-y-1.5 text-xs text-on-surface">
                                            <div className="font-extrabold text-sm">{selectedBooking.landlordName}</div>
                                            <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                                                <Mail className="h-3.5 w-3.5 text-outline" />
                                                {selectedBooking.landlordEmail}
                                            </div>
                                            <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                                                <Phone className="h-3.5 w-3.5 text-outline" />
                                                +1 (555) 0192 (Sewa certified)
                                            </div>
                                        </div>
                                    </div>

                                    {/* Escrow status */}
                                    <div className="border border-surface-container-high rounded-xl p-4 space-y-2 bg-white flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-xs uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
                                                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                                                MySewa Escrow State
                                            </h4>
                                            <div className="mt-1.5 flex items-center gap-2">
                                                {selectedBooking.escrowStatus === 'Held' && (
                                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-bold text-xs flex items-center gap-1 border border-primary/20">
                                                        🛡️ Locked Deposit
                                                    </span>
                                                )}
                                                {selectedBooking.escrowStatus === 'Released' && (
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-bold text-xs flex items-center gap-1 border border-slate-300">
                                                        ✓ Released safely
                                                    </span>
                                                )}
                                                {selectedBooking.escrowStatus === 'Refunded' && (
                                                    <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full font-bold text-xs flex items-center gap-1 border border-red-200">
                                                        ✕ Deposit Refunded
                                                    </span>
                                                )}
                                                {selectedBooking.escrowStatus === 'Pending' && (
                                                    <span className="px-3 py-1 bg-yellow-50 text-amber-700 rounded-full font-bold text-xs flex items-center gap-1 border border-amber-200">
                                                        🕒 Trust validation
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-[10.5px] text-on-surface-variant leading-tight">
                                            This deposit is managed exclusively inside MySewa smart systems, blocking withholding fraud and unauthorized leasing claims.
                                        </p>
                                    </div>
                                </div>

                                {/* Interactive Landlord Draft helper console */}
                                {selectedBooking.status === 'Active' && (
                                    <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container space-y-3.5">
                                        <h4 className="font-bold text-xs uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
                                            <Sparkles className="h-4.5 w-4.5 text-primary" />
                                            Smart Tenant Communication Drafter
                                        </h4>

                                        <p className="text-[10px] text-on-surface-variant mt-1.5 leading-snug">
                                            Generate verified communications for your landlord regarding this active lease. Ready to copy and dispatch instantly.
                                        </p>

                                        <div className="flex gap-2">
                                            <select
                                                value={tenantMsgType}
                                                onChange={(e) => setTenantMsgType(e.target.value)}
                                                className="bg-white border border-outline-variant p-2 rounded-lg text-xs font-semibold focus:outline-none"
                                            >
                                                <option value="maintenance">Maintenance Service Log</option>
                                                <option value="extension">Inquire Lease Extension</option>
                                                <option value="escrow">Verify escrow secure ID</option>
                                            </select>

                                            <button
                                                onClick={() => handleGenerateTemplateDraft(selectedBooking)}
                                                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95 transition-all outline-none"
                                            >
                                                Generate Message Template
                                            </button>
                                        </div>

                                        {generatedDraft && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="space-y-2"
                                            >
                                                <textarea
                                                    rows={6}
                                                    value={generatedDraft}
                                                    onChange={(e) => setGeneratedDraft(e.target.value)}
                                                    className="w-full bg-white border border-outline-variant rounded-lg p-3 text-xs font-mono text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                />
                                                <div className="text-right">
                                                    <button
                                                        onClick={copyToClipboard}
                                                        className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 transition-all rounded-md text-xs font-semibold inline-flex items-center gap-1"
                                                    >
                                                        {draftCopied ? <Check className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                                                        {draftCopied ? "Copied!" : "Copy Draft"}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                )}

                                {/* Payment History and Verification Ledger logs */}
                                <div className="space-y-3 shrink-0">
                                    <h4 className="font-bold text-xs uppercase text-on-surface-variant tracking-wider">Digital Contract Ledger Events</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center bg-white p-2 border border-surface-container-high rounded-lg text-xs">
                                            <div className="flex items-center gap-2 font-medium">
                                                <Check className="h-4 w-4 bg-emerald-100 text-emerald-800 rounded-full p-0.5 shrink-0" />
                                                <span>Security Deposit Transferred to Escrow</span>
                                            </div>
                                            <span className="text-outline font-semibold">Verified</span>
                                        </div>

                                        <div className="flex justify-between items-center bg-white p-2 border border-surface-container-high rounded-lg text-xs">
                                            <div className="flex items-center gap-2 font-medium">
                                                <Check className="h-4 w-4 bg-emerald-100 text-emerald-800 rounded-full p-0.5" />
                                                <span>Digital Signature Authenticated</span>
                                            </div>
                                            <span className="text-outline font-semibold">Verified</span>
                                        </div>

                                        {selectedBooking.status === 'Completed' && (
                                            <div className="flex justify-between items-center bg-white p-2 border border-surface-container-high rounded-lg text-xs">
                                                <div className="flex items-center gap-2 font-medium">
                                                    <Check className="h-4 w-4 bg-emerald-100 text-emerald-800 rounded-full p-0.5" />
                                                    <span>Tenant Check-out Inspection Approved &amp; Deposit Disbursed</span>
                                                </div>
                                                <span className="text-outline font-semibold">Released</span>
                                            </div>
                                        )}

                                        {selectedBooking.status === 'Cancelled' && (
                                            <div className="flex justify-between items-center bg-white p-2 border border-surface-container-high rounded-lg text-xs">
                                                <div className="flex items-center gap-2 font-medium">
                                                    <X className="h-4 w-4 bg-red-100 text-red-800 rounded-full p-0.5" />
                                                    <span>Booking Voided &amp; Funds Refunded</span>
                                                </div>
                                                <span className="text-red-700 font-semibold">{selectedBooking.refundDate}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* DETAILED PROPERTY CARD MODAL (For Browse tab info) */}
            <AnimatePresence>
                {selectedProperty && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProperty(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative z-11 border border-surface-container-highest max-h-[85vh] flex flex-col"
                        >
                            <div className="relative overflow-hidden aspect-[2] shrink-0">
                                <img src={selectedProperty.imgUrl} alt={selectedProperty.title} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => setSelectedProperty(null)}
                                    className="absolute top-4 right-4 h-8.5 w-8.5 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-all border border-white/10"
                                >
                                    <X className="h-5.5 w-5.5" />
                                </button>
                                <div className="absolute top-2.5 left-2.5">
                                    {selectedProperty.sdgAligned && (
                                        <span className="bg-emerald-500 text-white px-2.5 py-1 text-[10px] font-bold rounded-full">
                                            ✓ SDG 9 Green Compliant
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-5 overflow-y-auto space-y-5 text-xs md:text-sm flex-grow">
                                <div>
                                    <h3 className="text-xl font-black text-on-surface">{selectedProperty.title}</h3>
                                    <p className="text-on-surface-variant flex items-center gap-1 mt-1">
                                        <MapPin className="h-4.5 w-4.5 text-outline" />
                                        {selectedProperty.address}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 bg-surface-container-low p-4 rounded-xl text-on-surface font-semibold text-center border border-surface-container">
                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-on-surface-variant">Monthly Rent</span>
                                        <span className="text-lg font-black text-primary">RM {selectedProperty.rent.toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-on-surface-variant">Refundable Deposit</span>
                                        <span className="text-lg font-black text-on-surface">RM {selectedProperty.deposit.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <h4 className="font-bold text-xs uppercase text-on-surface-variant tracking-wider">Property Overview</h4>
                                    <p className="text-on-surface-variant leading-relaxed font-normal">{selectedProperty.description}</p>
                                </div>

                                <div className="space-y-1.5">
                                    <h4 className="font-bold text-xs uppercase text-on-surface-variant tracking-wider">Certified Amenities</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedProperty.amenities.map(amenity => (
                                            <span key={amenity} className="text-[10px] font-bold bg-primary/5 text-primary border border-primary/10 px-3 py-1 rounded-full">
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-surface-container-high pt-4.5 flex justify-between items-center shrink-0">
                                    <div className="text-left">
                                        <p className="text-[10px] text-on-surface-variant uppercase font-bold">Landlord Contact</p>
                                        <p className="text-xs font-bold text-on-surface">{selectedProperty.landlordName}</p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            const prop = selectedProperty;
                                            setSelectedProperty(null);
                                            handleRentPropertyClick(prop);
                                        }}
                                        className="px-5 py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/95 transition-all outline-none shadow-xs"
                                    >
                                        Initiate Security Deposit Escrow
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* LEAVE REVIEW MODAL */}
            <AnimatePresence>
                {reviewBooking && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            style={{ backdropFilter: 'blur(3px)' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setReviewBooking(null)}
                            className="absolute inset-0 bg-black/60"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 15 }}
                            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 p-5 space-y-4 border border-surface-container-highest"
                        >
                            <div className="flex justify-between items-center pb-2.5 border-b border-surface-container-high">
                                <h3 className="font-bold text-on-surface text-base">Write Secure Stay Review</h3>
                                <button
                                    onClick={() => setReviewBooking(null)}
                                    className="text-outline hover:text-on-surface"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="text-center space-y-2">
                                <p className="text-xs text-on-surface-variant">
                                    Rate your verified checkout experience at <span className="font-bold text-on-surface">{reviewBooking.propertyTitle}</span>. Your review is stored securely in the feedback registry.
                                </p>

                                {/* Interactive Star clicker */}
                                <div className="flex justify-center gap-1 py-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRatingInput(star)}
                                            className="focus:outline-none focus:scale-110 active:scale-95 duration-100 transition-all cursor-pointer"
                                        >
                                            <Star
                                                className={`h-7 w-7 ${star <= ratingInput ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 font-medium">Comments &amp; Landlord rating</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Describe cleanliness, transit safety, heating, and escrow deposit return convenience..."
                                        value={reviewTextInput}
                                        onChange={(e) => setReviewTextInput(e.target.value)}
                                        className="w-full bg-white border border-outline-variant rounded-lg p-2.5 text-xs text-on-surface outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-medium"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setReviewBooking(null)}
                                        className="flex-1 py-2 text-xs font-bold border border-outline-variant text-on-surface-variant rounded-lg hover:bg-surface-container-low transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={submitReview}
                                        className="flex-1 py-1.8 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95 transition-all shadow-xs"
                                    >
                                        Publish Verified Review
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ADD NEW RENTAL (FAB MODAL triggered by PLUS FAB) */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-surface-container-highest max-h-[90vh] flex flex-col"
                        >
                            <div className="p-4 bg-primary text-white flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-2">
                                    <Plus className="h-5 w-5" />
                                    <h3 className="font-extrabold text-sm uppercase tracking-wider">Register Secure Rental Ledger Entry</h3>
                                </div>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-white/80 hover:text-white border border-white/20 hover:border-white/40 h-7 w-7 rounded-full flex items-center justify-center"
                                >
                                    <X className="h-4.5 w-4.5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddNewRental} className="p-5 overflow-y-auto space-y-4 text-xs md:text-sm flex-grow">
                                <p className="text-xs text-on-surface-variant leading-relaxed select-none">
                                    Fill in your custom booking coordinates to record inside the visual tracking desk. An official verified transaction code is securely simulated instantly upon execution.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Property Name *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Skyline Loft"
                                            value={newPropTitle}
                                            onChange={(e) => setNewPropTitle(e.target.value)}
                                            className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">City Location *</label>
                                        <select
                                            value={newPropCity}
                                            onChange={(e) => setNewPropCity(e.target.value)}
                                            className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs font-medium focus:outline-none"
                                        >
                                            <option value="Kuala Lumpur">Kuala Lumpur</option>
                                            <option value="Penang">Penang</option>
                                            <option value="Johor Bahru">Johor Bahru</option>
                                            <option value="Selangor">Selangor</option>
                                            <option value="Sabah">Sabah</option>
                                            <option value="Sarawak">Sarawak</option>
                                            <option value="Perak">Perak</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Street Address *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Bangsar, Kuala Lumpur"
                                        value={newPropAddress}
                                        onChange={(e) => setNewPropAddress(e.target.value)}
                                        className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Monthly Rent (RM) *</label>
                                        <input
                                            type="number"
                                            required
                                            value={newPropRent}
                                            onChange={(e) => setNewPropRent(Number(e.target.value))}
                                            className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-primary outline-none text-right"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Security Deposit (RM) *</label>
                                        <input
                                            type="number"
                                            required
                                            value={newPropDeposit}
                                            onChange={(e) => setNewPropDeposit(Number(e.target.value))}
                                            className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-primary outline-none text-right"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Lease status *</label>
                                        <select
                                            value={newPropStatus}
                                            onChange={(e) => setNewPropStatus(e.target.value as BookingStatus)}
                                            className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs font-medium focus:outline-none"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Scheduled">Scheduled</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Start Date</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Oct 2023"
                                            value={newPropStartDate}
                                            onChange={(e) => setNewPropStartDate(e.target.value)}
                                            className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Lease duration</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 12 Months"
                                            value={newPropDuration}
                                            onChange={(e) => setNewPropDuration(e.target.value)}
                                            className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Image selection presets */}
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Preset Property Image</label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {propertyImgPresets.map((img, idx) => (
                                            <button
                                                type="button"
                                                key={img.name}
                                                onClick={() => setNewPropImgIdx(idx)}
                                                className={`aspect-square rounded-lg overflow-hidden border-2 relative transition-all ${newPropImgIdx === idx ? 'border-primary scale-105 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
                                                    }`}
                                            >
                                                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white py-0.5 truncate text-center leading-none">
                                                    {img.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-surface-container-low p-4 rounded-xl space-y-3.5 border border-surface-container">
                                    <h4 className="font-bold text-xs uppercase text-on-surface-variant tracking-wider">Landlord Ledger Authentication</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-on-surface-variant mb-1">Landlord Name</label>
                                            <input
                                                type="text"
                                                value={newLandlordName}
                                                onChange={(e) => setNewLandlordName(e.target.value)}
                                                className="w-full bg-white border border-outline-variant rounded-lg p-1.8 text-xs font-medium focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-on-surface-variant mb-1">Email validation</label>
                                            <input
                                                type="email"
                                                value={newLandlordEmail}
                                                onChange={(e) => setNewLandlordEmail(e.target.value)}
                                                className="w-full bg-white border border-outline-variant rounded-lg p-1.8 text-xs font-medium focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2.5 pt-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-2.5 text-xs font-bold border border-outline-variant text-on-surface-variant rounded-lg hover:bg-surface-container-low transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-1.8 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95 transition-all shadow-md"
                                    >
                                        Lock Registry Entry
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* RENT LEASE BOOKING DIALOG WIZARD (When they click booking for Browse Listings) */}
            <AnimatePresence>
                {bookingWizardProperty && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setBookingWizardProperty(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-surface-container-highest max-h-[90vh] flex flex-col"
                        >
                            <div className="bg-primary text-white p-4 flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-2">
                                    <Lock className="h-4.5 w-4.5" />
                                    <h3 className="font-extrabold text-[12px] uppercase tracking-wider">Secure Escrow Safe Setup</h3>
                                </div>
                                <button
                                    onClick={() => setBookingWizardProperty(null)}
                                    className="text-white/80 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Step 1: Overview and details */}
                            {wizardStep === 1 && (
                                <div className="p-5 space-y-4 overflow-y-auto text-xs md:text-sm flex-grow">
                                    <div className="flex gap-3 bg-primary/5 p-3.5 rounded-xl border border-primary/10">
                                        <img src={bookingWizardProperty.imgUrl} className="w-16 h-16 object-cover rounded-lg shrink-0 border border-surface-container-high" alt={bookingWizardProperty.title} />
                                        <div className="space-y-0.5">
                                            <h4 className="font-bold text-on-surface text-sm leading-snug">{bookingWizardProperty.title}</h4>
                                            <p className="text-on-surface-variant font-medium flex items-center gap-0.5">
                                                <MapPin className="h-3.5 w-3.5 text-outline" />
                                                {bookingWizardProperty.address}
                                            </p>
                                            <p className="text-primary font-bold text-xs mt-1">Rent: RM {bookingWizardProperty.rent.toLocaleString()}/mo</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3.5">
                                        <h5 className="font-bold text-[11px] uppercase text-on-surface-variant tracking-wider">Review Escrow Terms</h5>
                                        <div className="p-3 bg-surface-container-low font-medium text-xs text-on-surface space-y-2.5 rounded-lg border border-surface-container leading-relaxed">
                                            <div className="flex justify-between">
                                                <span>Required Security Deposit:</span>
                                                <span className="font-bold text-primary font-mono">RM {bookingWizardProperty.deposit.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Platform Escrow Broker Fee:</span>
                                                <span className="font-semibold text-emerald-600">Free (RM 0)</span>
                                            </div>
                                            <div className="flex justify-between border-t border-surface-container-high pt-2.5 font-bold font-sans">
                                                <span>Total Due Locked in Trust:</span>
                                                <span>RM {bookingWizardProperty.deposit.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <p className="text-[10.5px] text-on-surface-variant leading-relaxed">
                                            By initiating this escrow booking, MySewa locks your security deposit in a secure, audited trust registry. This will be automatically disbursed back to you post-agreement or released instantly to the landlord based on verified move-out event validations.
                                        </p>
                                    </div>

                                    <div className="flex gap-2.5 pt-2 shrink-0">
                                        <button
                                            onClick={() => setBookingWizardProperty(null)}
                                            className="flex-1 py-2 text-xs font-bold border border-outline-variant text-on-surface-variant rounded-lg hover:bg-surface-container-low transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => setWizardStep(2)}
                                            className="flex-1 py-1.8 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95 transition-all shadow-xs"
                                        >
                                            Authenticate Escrow
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Signature and confirm */}
                            {wizardStep === 2 && (
                                <div className="p-5 space-y-4 overflow-y-auto text-xs md:text-sm flex-grow">
                                    <h4 className="font-bold text-xs uppercase text-on-surface-variant tracking-wider">Sign Legal Escrow Agreement</h4>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Confirm Intended Move-In Date</label>
                                            <select
                                                value={leaseMoveInDate}
                                                onChange={(e) => setLeaseMoveInDate(e.target.value)}
                                                className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs font-semibold focus:outline-none"
                                            >
                                                <option value="Oct 2026">October 2026</option>
                                                <option value="Nov 2026">November 2026</option>
                                                <option value="Dec 2026">December 2026</option>
                                                <option value="Jan 2027">January 2027</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Contract Term Length</label>
                                            <select
                                                value={leaseDuration}
                                                onChange={(e) => setLeaseDuration(e.target.value)}
                                                className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs font-semibold focus:outline-none"
                                            >
                                                <option value="12 Months">12 Months (Standard Lease Term)</option>
                                                <option value="6 Months">6 Months (Temporary Stay Term)</option>
                                                <option value="24 Months">24 Months (Two Year Locked Term)</option>
                                                <option value="Ongoing">Ongoing (Month-to-Month flex)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Tenant Full Digital Signature Name *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Type legal name to sign agreement digitally"
                                                value={signerName}
                                                onChange={(e) => setSignerName(e.target.value)}
                                                className="w-full bg-white border-2 border-dashed border-outline-variant rounded-lg p-2 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                                            />
                                            <p className="text-[10px] text-on-surface-variant mt-1.5 leading-snug">
                                                By signing, you warrant compliance with standard state tenant covenants of reasonable habitation.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2.5 pt-2 shrink-0">
                                        <button
                                            onClick={() => setWizardStep(1)}
                                            className="flex-1 py-2 text-xs font-bold border border-outline-variant text-on-surface-variant rounded-lg hover:bg-surface-container-low transition-all font-semibold"
                                        >
                                            Back
                                        </button>
                                        <button
                                            disabled={!signerName.trim()}
                                            onClick={handleCompleteRentalBooking}
                                            className="flex-1 py-1.8 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95 disabled:opacity-50 transition-all shadow-xs"
                                        >
                                            Sign &amp; Complete Booking
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Success Screen */}
                            {wizardStep === 3 && (
                                <div className="p-6 text-center space-y-5 text-xs md:text-sm shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                                        <Check className="h-6 w-6 stroke-[3]" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <h4 className="font-extrabold text-on-surface text-lg">Digital Escrow Booking Confirmed!</h4>
                                        <p className="text-xs text-on-surface-variant">
                                            Congratulations! Your deposit of <span className="font-bold text-on-surface">RM {bookingWizardProperty.deposit.toLocaleString()}</span> was verified and locked successfully in the public escrow safety trust registry.
                                        </p>
                                    </div>

                                    <div className="p-3 bg-surface-container-low border border-dashed border-primary/20 rounded-xl space-y-1 text-left font-semibold">
                                        <div className="text-[9px] uppercase text-outline">Smart Escrow Registry Code</div>
                                        <div className="text-xs font-mono text-primary flex items-center gap-1">
                                            <Lock className="h-3 w-3 shrink-0" />
                                            ESC-SEWA-{Math.floor(100000 + Math.random() * 900000)}-{bookingWizardProperty.city.substring(0, 2).toUpperCase()}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setBookingWizardProperty(null);
                                            setCurrentTab('rentals'); // Move to History to see updated item!
                                        }}
                                        className="w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/95 transition-all shadow-xs"
                                    >
                                        Go to My Rental History Ledger
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* FLOATING ACTION BUTTON (FAB) FOR REGISTER CUSTOM BOOKING */}
            <button
                onClick={() => {
                    setShowAddModal(true);
                    // Set initial standard fields
                    setNewPropStartDate('Scheduled Jun 2026');
                    setNewPropStatus('Scheduled');
                }}
                title="Start New Rental"
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-105 active:scale-95 z-40 outline-none"
            >
                <Plus className="h-6.5 w-6.5 stroke-[2.5]" />
            </button>

        </div>
    );
}
