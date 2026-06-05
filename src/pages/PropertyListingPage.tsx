import React, { useState, useEffect } from "react";
import { Property, Transaction } from '../types';
import PropertyCard from '../components/PropertyListingCard';
import PropertyDetailsModal from '../components/PropertyListingDetailModal';
import AICounselorPanel from '../components/AICounselorPanel';
import AddPropertyModal from '../components/AddPropertyModal';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import {
    Building, Search, Filter, RefreshCw, Plus, Shield, MessageSquare,
    HelpCircle, Sparkles, BookOpen, User, Check, X, Bell
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function PropertyListingPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Filter & Search states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("All Locations");
    const [maxPrice, setMaxPrice] = useState(10000);
    const [selectedType, setSelectedType] = useState<string>("All"); // Condo, Terrace, Bungalow, Apartment
    const [selectedMinScore, setSelectedMinScore] = useState<number | null>(null); // null, 70, 85, 95
    const [sortBy, setSortBy] = useState("Highest Match"); // Highest Match, Price Low to High, Price High to Low

    // Real estate system realistic filters
    const [bedsFilter, setBedsFilter] = useState<string>("All"); // All, 1, 2, 3, 4+
    const [bathsFilter, setBathsFilter] = useState<string>("All"); // All, 1, 2, 3+
    const [minSqft, setMinSqft] = useState<number>(0); // 0, 500, 1000, 1500, 2000
    const [onlyVerifiedLandlords, setOnlyVerifiedLandlords] = useState<boolean>(false);
    const [maxDeposit, setMaxDeposit] = useState<number>(20000);

    // UI state controllers
    const [selectedPropertyForDetails, setSelectedPropertyForDetails] = useState<Property | null>(null);
    const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
    const [isCounselorOpen, setIsCounselorOpen] = useState(true); // default open on desktop for interaction
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [searchParams] = useSearchParams();
    useEffect(() => {
        const query = searchParams.get('search');
        if (query) {
            setSearchQuery(query);
        }
    }, []);

    // Notification / Toast helper
    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 4000);
    };

    // Fetch properties and transactions from full-stack server
    const fetchData = async () => {
        setLoading(true);
        // Use mock data instead of API
        setProperties([]);
        setTransactions([]);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Update a single property object when reviews add or recalculate
    const handleRefreshProperty = (updatedProperty: Property) => {
        setProperties((prev) =>
            prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p))
        );
        setSelectedPropertyForDetails(updatedProperty);
        triggerToast(`Feedback logged! Landlord stability index is recalculated to ${updatedProperty.stabilityScore}.`);
    };

    // Append customized transaction holds onto state
    const handleAddTransaction = (newTx: any) => {
        setTransactions((prev) => [newTx, ...prev]);
        triggerToast(`Deposit of RM ${newTx.amount.toLocaleString()} successfully protected inside Smart SafePay Escrow.`);
    };

    // Append freshly listed custom housing
    const handleAddProperty = (newProp: Property) => {
        setProperties((prev) => [newProp, ...prev]);
        triggerToast(`"${newProp.title}" published! Automatic risk check calculated safety index at ${newProp.stabilityScore}.`);
    };

    // Clear filters
    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedLocation("All Locations");
        setMaxPrice(10000);
        setSelectedType("All");
        setSelectedMinScore(null);
        setBedsFilter("All");
        setBathsFilter("All");
        setMinSqft(0);
        setOnlyVerifiedLandlords(false);
        setMaxDeposit(20000);
        triggerToast("All property search parameters reset.");
    };

    // Filter application pipeline
    const filteredProperties = properties.filter((prop) => {
        // Search keyword match
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
            query === "" ||
            prop.title.toLowerCase().includes(query) ||
            prop.location.toLowerCase().includes(query) ||
            prop.details.toLowerCase().includes(query) ||
            prop.landlordName.toLowerCase().includes(query);

        // Location / Region match
        const matchesRegion =
            selectedLocation === "All Locations" ||
            prop.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
            prop.state.toLowerCase() === selectedLocation.toLowerCase();

        // Price limitation
        const matchesPrice = prop.price <= maxPrice;

        // Class type
        const matchesType =
            selectedType === "All" ||
            prop.type.toLowerCase() === selectedType.toLowerCase();

        // Stability Score
        const matchesScore =
            selectedMinScore === null ||
            prop.stabilityScore >= selectedMinScore;

        // Beds match
        const bedsNum = parseInt(prop.beds) || 0;
        const matchesBeds =
            bedsFilter === "All" ||
            (bedsFilter === "4+" ? bedsNum >= 4 : bedsNum === parseInt(bedsFilter));

        // Baths match
        const bathsNum = parseInt(prop.baths) || 0;
        const matchesBaths =
            bathsFilter === "All" ||
            (bathsFilter === "3+" ? bathsNum >= 3 : bathsNum === parseInt(bathsFilter));

        // Sqft match
        const sqftNum = parseInt(prop.sqft.replace(/,/g, "")) || 0;
        const matchesSqft = sqftNum >= minSqft;

        // Landlord verified match
        const matchesVerifiedLandlord = !onlyVerifiedLandlords || prop.landlordVerified;

        // Deposit range match
        const matchesDeposit = prop.depositRequired <= maxDeposit;

        return (
            matchesSearch &&
            matchesRegion &&
            matchesPrice &&
            matchesType &&
            matchesScore &&
            matchesBeds &&
            matchesBaths &&
            matchesSqft &&
            matchesVerifiedLandlord &&
            matchesDeposit
        );
    });

    // Sort application pipeline
    const sortedProperties = [...filteredProperties].sort((a, b) => {
        if (sortBy === "Price Low to High") {
            return a.price - b.price;
        }
        if (sortBy === "Price High to Low") {
            return b.price - a.price;
        }
        // "Highest Match" defaults to Highest Stability Score
        return b.stabilityScore - a.stabilityScore;
    });

    // Pagination bounds calculation
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedProperties.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedProperties.length / itemsPerPage) || 1;

    return (
        <div className="min-h-screen bg-background font-sans flex flex-col selection:bg-blue-100">

            {/* Dynamic Toast Alerts Notification */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -40, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#27313f] text-[#eaf1ff] px-6 py-3.5 rounded-xl shadow-xl flex items-center gap-2.5 z-50 text-xs border border-blue-500/20 max-w-md"
                    >
                        <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-medium font-sans leading-relaxed">{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top Navigation Bar Component */}
            <Header
                mode="auth"
                onNavigate={() => navigate('/home')}
                activeSection=""
                userProfile={(() => {
                    const saved = localStorage.getItem('mysewa_session');
                    return saved ? JSON.parse(saved) : null;
                })()}
                onOpenAuth={() => navigate('/login')}
                onLogout={() => {
                    localStorage.removeItem('mysewa_session');
                    navigate('/');
                }}
            />

            {/* Hero Welcome Intro Banner */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white py-12 px-6 sm:px-12 text-center relative overflow-hidden shadow-xs shrink-0 max-w-max-width mx-auto w-full">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-700/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-2xl mx-auto space-y-4 relative z-10">
                    <span className="text-xs bg-[#ffe083] text-[#231b00] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                        SDG 9 Aligned Infrastructure Goal
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans">
                        Secure Rental Ecosystem Built on Pure Trust
                    </h1>
                    <p className="text-xs md:text-sm text-blue-100 leading-relaxed max-w-xl mx-auto font-sans">
                        Protecting landlord properties and tenant deposits. Use our automated "Landlord Stability Score" & "Smart safe-pay escrow holding pools" to guarantee frictionless rental experiences.
                    </p>

                    {/* Quick Search Core layout */}
                    <div className="bg-white p-2 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-2 max-w-lg mx-auto text-[#121c2a] mt-4">
                        <div className="flex items-center gap-2 px-3 flex-grow w-full border-b md:border-b-0 md:border-r border-gray-150 py-1.5">
                            <Search className="w-4.5 h-4.5 text-[#737686] shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Search Kuala Lumpur, Penang, condos..."
                                className="bg-transparent border-none outline-hidden text-xs w-full focus:ring-0"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")}>
                                    <X className="w-3.5 h-3.5 text-gray-500" />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                setSelectedLocation("All Locations");
                                setSelectedType("All");
                                setCurrentPage(1);
                                triggerToast("Search filters refreshed!");
                            }}
                            className="bg-primary hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-lg w-full md:w-auto shrink-0 transition-colors cursor-pointer"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Container Layout */}
            <main className="max-w-max-width mx-auto px-4 md:px-8 py-8 flex-grow flex flex-col xl:flex-row gap-6 w-full">

                {/* Sidebar Filters */}
                <aside className="w-full xl:w-72 shrink-0 space-y-6">
                    <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100 space-y-5 lg:sticky lg:top-20">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <h3 className="font-sans font-bold text-base text-on-surface flex items-center gap-1.5">
                                <Filter className="w-4 h-4 text-primary" /> Properties Filter
                            </h3>
                            <button
                                onClick={handleResetFilters}
                                className="text-primary text-xs font-semibold hover:underline cursor-pointer"
                            >
                                Reset
                            </button>
                        </div>

                        {/* State Hub Location selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#434655] uppercase tracking-wide">Location Hub</label>
                            <div className="relative">
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => {
                                        setSelectedLocation(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full bg-[#f8f9ff] text-xs font-semibold border border-gray-200 rounded-xl py-2.5 px-3 appearance-none focus:ring-1 focus:ring-primary outline-hidden text-on-surface"
                                >
                                    <option value="All Locations">All Locations (Malaysia)</option>
                                    <option value="Kuala Lumpur">Kuala Lumpur</option>
                                    <option value="Selangor">Selangor</option>
                                    <option value="Penang">Penang</option>
                                    <option value="Johor Bahru">Johor Bahru</option>
                                </select>
                            </div>
                        </div>

                        {/* Price constraints sliders */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <label className="font-bold text-[#434655] uppercase tracking-wide">Max Monthly Price</label>
                                <span className="text-[#2563eb] font-bold font-mono">RM {maxPrice.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="1000"
                                max="10000"
                                step="500"
                                value={maxPrice}
                                onChange={(e) => {
                                    setMaxPrice(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="w-full accent-primary bg-gray-100 h-1 rounded-lg outline-hidden cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                                <span>RM 1,000</span>
                                <span>RM 10,000</span>
                            </div>
                        </div>

                        {/* Property Class Tag Selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#434655] uppercase tracking-wide">Property Class</label>
                            <div className="flex flex-wrap gap-1">
                                {["All", "Condo", "Terrace", "Bungalow", "Apartment"].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => {
                                            setSelectedType(item);
                                            setCurrentPage(1);
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${selectedType === item
                                            ? "bg-primary text-white shadow-xs"
                                            : "border border-gray-100 bg-[#f8f9ff] text-on-surface-variant hover:border-primary hover:text-primary"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Minimum stability rating triggers */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-1 text-xs">
                                <label className="font-bold text-[#434655] uppercase tracking-wide">Min Stability Score</label>
                                <HelpCircle className="w-3.5 h-3.5 text-primary" title="AI calculations of landlord agreement health metrics." />
                            </div>

                            <div className="grid grid-cols-3 gap-1">
                                {[70, 85, 95].map((score) => (
                                    <button
                                        key={score}
                                        type="button"
                                        onClick={() => {
                                            setSelectedMinScore(selectedMinScore === score ? null : score);
                                            setCurrentPage(1);
                                        }}
                                        className={`py-2 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer text-center ${selectedMinScore === score
                                            ? "bg-[#ffe083] text-[#231b00] border border-[#cea700] ring-1 ring-amber-300"
                                            : "border border-gray-100 bg-[#f8f9ff] text-on-surface-variant hover:border-gray-300"
                                            }`}
                                    >
                                        {score}+
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bedrooms selection */}
                        <div className="space-y-2 pt-1">
                            <label className="text-xs font-bold text-[#434655] uppercase tracking-wide">Bedrooms</label>
                            <div className="grid grid-cols-5 gap-1">
                                {["All", "1", "2", "3", "4+"].map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => {
                                            setBedsFilter(item);
                                            setCurrentPage(1);
                                        }}
                                        className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${bedsFilter === item
                                            ? "bg-primary text-white shadow-xs animate-none"
                                            : "border border-gray-100 bg-[#f8f9ff] text-on-surface-variant hover:border-gray-250 hover:bg-gray-50/50"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bathrooms selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#434655] uppercase tracking-wide">Bathrooms</label>
                            <div className="grid grid-cols-4 gap-1">
                                {["All", "1", "2", "3+"].map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => {
                                            setBathsFilter(item);
                                            setCurrentPage(1);
                                        }}
                                        className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${bathsFilter === item
                                            ? "bg-primary text-white shadow-xs animate-none"
                                            : "border border-gray-100 bg-[#f8f9ff] text-on-surface-variant hover:border-gray-250 hover:bg-gray-50/50"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size range selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#434655] uppercase tracking-wide">Min Living Area (Sqft)</label>
                            <div className="relative">
                                <select
                                    value={minSqft}
                                    onChange={(e) => {
                                        setMinSqft(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="w-full bg-[#f8f9ff] text-xs font-semibold border border-gray-200 rounded-xl py-2.5 px-3 appearance-none focus:ring-1 focus:ring-primary outline-hidden text-on-surface"
                                >
                                    <option value="0">Any Built-up Size</option>
                                    <option value="500">500+ sqft</option>
                                    <option value="1000">1,000+ sqft</option>
                                    <option value="1500">1,500+ sqft</option>
                                    <option value="2000">2,000+ sqft</option>
                                    <option value="3000">3,000+ sqft</option>
                                </select>
                            </div>
                        </div>

                        {/* Max deposit constraint */}
                        <div className="space-y-2 pb-2">
                            <div className="flex justify-between items-center text-xs">
                                <label className="font-bold text-[#434655] uppercase tracking-wide">Max Deposit Needed</label>
                                <span className="text-[#2563eb] font-bold font-mono">RM {maxDeposit.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="2000"
                                max="20000"
                                step="500"
                                value={maxDeposit}
                                onChange={(e) => {
                                    setMaxDeposit(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="w-full accent-primary bg-gray-100 h-1 rounded-lg outline-hidden cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                                <span>RM 2k</span>
                                <span>RM 20k</span>
                            </div>
                        </div>

                        {/* Host Credentials verification toggle */}
                        <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-[#434655] uppercase tracking-wide flex items-center gap-1">
                                <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
                                Verified Host
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={onlyVerifiedLandlords}
                                    onChange={(e) => {
                                        setOnlyVerifiedLandlords(e.target.checked);
                                        setCurrentPage(1);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Core Exploration section */}
                <section className="flex-grow space-y-6">

                    {/* Top header row */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100">
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-on-surface font-sans">
                                {selectedLocation === "All Locations" ? "Certified Malaysian Properties" : `Properties in ${selectedLocation}`}
                            </h2>
                            <p className="text-xs text-on-surface-variant mt-1">
                                {sortedProperties.length} secure listings found conforming with high-trust agreement standards
                            </p>
                        </div>

                        {/* Sorting criteria choice */}
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-medium text-gray-500 font-sans">Sort by:</span>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-[#f8f9ff] text-xs font-semibold border border-gray-200 rounded-lg py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-primary outline-hidden"
                                >
                                    <option>Highest Match</option>
                                    <option>Price Low to High</option>
                                    <option>Price High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Grid list or empty list wrapper */}
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center space-y-3 bg-white rounded-2xl border border-gray-100">
                            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                            <p className="text-sm font-semibold text-gray-500">Retrieving rental safety records list...</p>
                        </div>
                    ) : sortedProperties.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center space-y-2 text-center bg-white rounded-2xl border border-gray-100 p-6">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary mb-2">
                                <Search className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-bold text-on-surface">No properties match your current search.</p>
                            <p className="text-xs text-on-surface-variant max-w-sm">Try widening your budget, resetting location parameters, or reducing the minimum landlord stability score thresholds.</p>
                            <button
                                onClick={handleResetFilters}
                                className="mt-2 bg-primary hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded-lg cursor-pointer"
                            >
                                Reset Search Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentItems.map((prop) => (
                                <PropertyCard
                                    key={prop.id}
                                    property={prop}
                                    onViewDetails={setSelectedPropertyForDetails}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination bar */}
                    {!loading && sortedProperties.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 select-none">
                            <div className="text-xs text-on-surface-variant font-medium font-sans">
                                Showing page <span className="font-bold text-[#004ac6]">{currentPage}</span> of <span className="font-bold text-[#121c2a]">{totalPages}</span> ({sortedProperties.length} properties found)
                            </div>

                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    disabled={currentPage === 1}
                                    onClick={() => {
                                        setCurrentPage((c) => Math.max(1, c - 1));
                                        window.scrollTo({ top: 300, behavior: "smooth" });
                                    }}
                                    className="px-3 h-9 text-xs rounded-lg font-semibold flex items-center justify-center border border-gray-200 hover:bg-gray-100 disabled:opacity-40 cursor-pointer text-gray-500 transition-colors"
                                >
                                    &larr; Prev
                                </button>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => {
                                            setCurrentPage(i + 1);
                                            window.scrollTo({ top: 300, behavior: "smooth" });
                                        }}
                                        className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${currentPage === i + 1
                                            ? "bg-primary text-white shadow-xs"
                                            : "border border-gray-200 text-on-surface hover:bg-gray-50"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    disabled={currentPage === totalPages}
                                    onClick={() => {
                                        setCurrentPage((c) => Math.min(totalPages, c + 1));
                                        window.scrollTo({ top: 300, behavior: "smooth" });
                                    }}
                                    className="px-3 h-9 text-xs rounded-lg font-semibold flex items-center justify-center border border-gray-200 hover:bg-gray-100 disabled:opacity-40 cursor-pointer text-gray-500 transition-colors"
                                >
                                    Next &rarr;
                                </button>
                            </div>
                        </div>
                    )}

                </section>

                {/* Right Counselor Panel */}
                <AnimatePresence>
                    {isCounselorOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="w-full xl:w-96 shrink-0 space-y-4"
                        >
                            {/* Close/Toggle button */}
                            <div className="xl:sticky xl:top-20 space-y-4">
                                <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-gray-100 shadow-xs">
                                    <span className="font-bold text-xs uppercase tracking-wide text-gray-500">AI Help Desk Console</span>
                                    <button
                                        onClick={() => setIsCounselorOpen(false)}
                                        className="text-xs font-semibold text-red-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                                    >
                                        <X className="w-3.5 h-3.5" /> Close Panel
                                    </button>
                                </div>
                                <AICounselorPanel />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>

            {/* Floating Action toggle button for counselor desk if closed */}
            {!isCounselorOpen && (
                <button
                    onClick={() => {
                        setIsCounselorOpen(true);
                        triggerToast("AI Tenancy Counselor console opened.");
                    }}
                    className="fixed bottom-6 right-6 bg-[#2563eb] text-white hover:bg-blue-700 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform z-40 border-2 border-white cursor-pointer"
                >
                    <MessageSquare className="w-6 h-6 text-[#ffe083]" />
                </button>
            )}

            {/* Footer component */}
            <Footer onNavigate={() => { }} />

            {/* Side overlays / modals components triggers */}
            <AnimatePresence>
                {selectedPropertyForDetails && (
                    <PropertyDetailsModal
                        property={selectedPropertyForDetails}
                        onClose={() => setSelectedPropertyForDetails(null)}
                        onRefreshProperty={handleRefreshProperty}
                        onAddTransaction={handleAddTransaction}
                    />
                )}

                {isAddPropertyOpen && (
                    <AddPropertyModal
                        onClose={() => setIsAddPropertyOpen(false)}
                        onAddProperty={handleAddProperty}
                    />
                )}
            </AnimatePresence>

        </div>
    );
}
