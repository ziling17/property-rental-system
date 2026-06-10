import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MapPropertyCard from "../components/MapPropertyCard";
import InteractiveMap from "../components/InteractiveMap";
import MapPropertyDetailModal from "../components/MapPropertyDetailModal";
import { PROPERTIES } from "../mapData";
import { Property } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
    Search, Building, Heart, Calendar, X, UserCheck, CheckCircle2
} from "lucide-react";

export default function MapPage() {
    const navigate = useNavigate();
    const userProfile = (() => {
        const saved = localStorage.getItem('mysewa_session');
        return saved ? JSON.parse(saved) : null;
    })();
    // Master properties list state
    const [properties] = useState<Property[]>(PROPERTIES);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>("platinum-suites");
    const [activeTab, setActiveTab] = useState<"search" | "saved" | "bookings">("search");

    // Search & Filters states
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [priceFilter, setPriceFilter] = useState<string>("all"); // "all", "under-2500", "2500-3500", "over-3500"
    const [typeFilter, setTypeFilter] = useState<string>("all"); // "all", "Condominium", "Service Apartment", "Studio", "Penthouse"
    const [bedsFilter, setBedsFilter] = useState<string>("all"); // "all", "1", "2", "3"
    const [verifiedFilter, setVerifiedFilter] = useState<boolean>(false);

    // Modal control state
    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
    const [detailsProperty, setDetailsProperty] = useState<Property | null>(PROPERTIES[0]);

    // Dropdown states for filter interactive views (desktop)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // "price", "type", "beds"

    // Favorites & Booking persistence tracking (state-only for simplicity/robustness)
    const [favorites, setFavorites] = useState<string[]>(["platinum-suites", "lucentia-residences"]);
    const [bookings, setBookings] = useState<Array<{ id: string; property: Property; date: string; time: string; notes: string }>>([
        {
            id: "b1",
            property: PROPERTIES[1], // The OOAK Suites default demo booking
            date: "2026-06-15",
            time: "2:00 PM",
            notes: "Please let us know if parking is available."
        }
    ]);

    // Auth User state (Simulated but fully responsive with user's genuine metadata)
    const [user] = useState({
        email: "dingziling88@gmail.com",
        name: "Ziling Ding",
        role: "Verified Tenant",
        memberSince: "June 2026",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
    });
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
    const [activeBookingNotice, setActiveBookingNotice] = useState<string | null>(null);

    // Close dropdowns on outer click
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter properties logic in real-time
    const filteredProperties = useMemo(() => {
        return properties.filter((property) => {
            // 1. Search Query Box (Check area, title, or road location)
            if (searchQuery.trim() !== "") {
                const query = searchQuery.toLowerCase();
                const matchesQuery =
                    property.title.toLowerCase().includes(query) ||
                    property.area.toLowerCase().includes(query) ||
                    property.location.toLowerCase().includes(query);
                if (!matchesQuery) return false;
            }

            // 2. Verified filter Checkbox
            if (verifiedFilter && !property.isVerified) {
                return false;
            }

            // 3. Price Filter presets
            if (priceFilter !== "all") {
                if (priceFilter === "under-2500" && property.price >= 2500) return false;
                if (priceFilter === "2500-3500" && (property.price < 2500 || property.price > 3500)) return false;
                if (priceFilter === "over-3500" && property.price <= 3500) return false;
            }

            // 4. Property Type Filter
            if (typeFilter !== "all" && property.propertyType !== typeFilter) {
                return false;
            }

            // 5. Beds Filter
            if (bedsFilter !== "all") {
                if (bedsFilter === "3" && property.beds < 3) return false;
                if (bedsFilter !== "3" && property.beds.toString() !== bedsFilter) return false;
            }

            return true;
        });
    }, [properties, searchQuery, priceFilter, typeFilter, bedsFilter, verifiedFilter]);

    // Synchronize selecting property & scrolling card into view (important for list-map integration)
    const handleSelectPropertyId = (id: string) => {
        setSelectedPropertyId(id);
        const cardElement = document.getElementById(`property-card-${id}`);
        if (cardElement) {
            cardElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    };

    // Toggle favorite trigger
    const handleToggleFavorite = (propertyId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setFavorites((prev) =>
            prev.includes(propertyId)
                ? prev.filter((id) => id !== propertyId)
                : [...prev, propertyId]
        );
    };

    // Trigger Detail Viewer
    const handleOpenDetailModal = (property: Property) => {
        setDetailsProperty(property);
        setIsDetailsOpen(true);
    };

    // Confirm booking scheduler
    const handleConfirmBooking = (bookingData: { date: string; time: string; notes: string }) => {
        if (detailsProperty) {
            const newBooking = {
                id: `book-${Date.now()}`,
                property: detailsProperty,
                date: bookingData.date,
                time: bookingData.time,
                notes: bookingData.notes
            };
            setBookings((prev) => [newBooking, ...prev]);
            setActiveBookingNotice(`Successfully requested appointment for ${detailsProperty.title}!`);

            // Auto-dismiss notice
            setTimeout(() => {
                setActiveBookingNotice(null);
            }, 6000);
        }
    };

    // Cancel booking
    const handleCancelBooking = (bookingId: string) => {
        if (confirm("Are you sure you want to cancel this scheduled property tour?")) {
            setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        }
    };

    return (
        <div className="flex flex-col w-full h-full bg-[#f8f9ff]">

            {/* GLOBAL HEADINGS BANNER */}
            {activeBookingNotice && (
                <div className="bg-emerald-600 text-white py-2.5 px-4 text-center text-xs font-bold leading-normal flex items-center justify-center gap-2 z-50 animate-fade-in relative shadow-md">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{activeBookingNotice}</span>
                    <button onClick={() => setActiveBookingNotice(null)} className="ml-3 font-semibold underline text-[10px]">
                        Dismiss
                    </button>
                </div>
            )}

            {/* HEADER SECTION LAYOUT */}
            <Header
                mode="auth"
                onNavigate={() => navigate('/home')}
                activeSection=""
                userProfile={userProfile}
                onOpenAuth={() => navigate('/login')}
                onLogout={() => {
                    localStorage.removeItem('mysewa_session');
                    navigate('/');
                }}
            />

            {/* MAIN SCREEN INTERACTIVE SPLIT DIVISION */}
            <main className="flex-grow flex flex-col md:flex-row overflow-hidden w-full h-[calc(100vh-73px)]">

                {/* LEFT COLUMN: FILTER SEARCHES AND RESULTS (approx 40% on desktop) */}
                <section className="w-full md:w-[420px] lg:w-[480px] xl:w-[500px] bg-white border-r border-[#e6eeff] flex-shrink-0 flex flex-col h-full overflow-hidden">

                    {/* Section Header: Title, Total Results, and Tab Switches (especially on mobile) */}
                    <div className="p-5 pb-4 border-b border-slate-100 flex-shrink-0 bg-white">

                        {/* Mobile Tab Swapper */}
                        <div className="flex md:hidden bg-slate-100 p-1 rounded-xl mb-3.5">
                            <button
                                onClick={() => setActiveTab("search")}
                                className={`flex-1 py-1.5 text-center font-bold text-xs rounded-lg transition-all ${activeTab === "search" ? "bg-white text-[#2563eb] shadow-sm" : "text-slate-600"
                                    }`}
                            >
                                Search properties (KL)
                            </button>
                            <button
                                onClick={() => setActiveTab("saved")}
                                className={`flex-1 py-1.5 text-center font-bold text-xs rounded-lg transition-all ${activeTab === "saved" ? "bg-white text-[#2563eb] shadow-sm" : "text-slate-600"
                                    }`}
                            >
                                Saved ({favorites.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("bookings")}
                                className={`flex-1 py-1.5 text-center font-bold text-xs rounded-lg transition-all ${activeTab === "bookings" ? "bg-white text-[#2563eb] shadow-sm" : "text-slate-600"
                                    }`}
                            >
                                My Tours
                            </button>
                        </div>

                        {/* Results Counters Row */}
                        <div className="flex items-baseline justify-between mb-3">
                            <h1 className="font-sans font-extrabold text-[22px] text-slate-900 tracking-tight">
                                {activeTab === "search" ? "Properties in KL" : activeTab === "saved" ? "Saved Properties" : "My Tour Bookings"}
                            </h1>

                            <span className="text-[12px] font-bold text-slate-500">
                                {activeTab === "search"
                                    ? `${filteredProperties.length} results`
                                    : activeTab === "saved"
                                        ? `${favorites.length} saved units`
                                        : `${bookings.length} active tours`
                                }
                            </span>
                        </div>

                        {/* FLUID FILTER ROW (Only relevant on 'search' tab) */}
                        {activeTab === "search" && (
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                {/* Price dropdown filter button */}
                                <div className="relative">
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === "price" ? null : "price")}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-semibold transition-all ${priceFilter !== "all"
                                            ? "bg-blue-50 border-[#2563eb] text-[#2563eb]"
                                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                                            }`}
                                    >
                                        <span>Price</span>
                                        <span className="text-[10px] text-slate-400">▼</span>
                                    </button>
                                    {activeDropdown === "price" && (
                                        <div className="absolute left-0 mt-1 w-52 bg-white border border-slate-150 rounded-xl shadow-xl p-3.5 z-40 animate-fade-in">
                                            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Preset Ranges</span>
                                            <div className="flex flex-col gap-1.5">
                                                <button
                                                    onClick={() => { setPriceFilter("all"); setActiveDropdown(null); }}
                                                    className={`w-full text-left p-1.5 rounded text-xs font-semibold ${priceFilter === "all" ? "bg-blue-50 text-[#2563eb]" : "hover:bg-slate-50"}`}
                                                >
                                                    All prices
                                                </button>
                                                <button
                                                    onClick={() => { setPriceFilter("under-2500"); setActiveDropdown(null); }}
                                                    className={`w-full text-left p-1.5 rounded text-xs font-semibold ${priceFilter === "under-2500" ? "bg-blue-50 text-[#2563eb]" : "hover:bg-slate-50"}`}
                                                >
                                                    Under RM 2,500
                                                </button>
                                                <button
                                                    onClick={() => { setPriceFilter("2500-3500"); setActiveDropdown(null); }}
                                                    className={`w-full text-left p-1.5 rounded text-xs font-semibold ${priceFilter === "2500-3500" ? "bg-blue-50 text-[#2563eb]" : "hover:bg-slate-50"}`}
                                                >
                                                    RM 2,500 - RM 3,500
                                                </button>
                                                <button
                                                    onClick={() => { setPriceFilter("over-3500"); setActiveDropdown(null); }}
                                                    className={`w-full text-left p-1.5 rounded text-xs font-semibold ${priceFilter === "over-3500" ? "bg-blue-50 text-[#2563eb]" : "hover:bg-slate-50"}`}
                                                >
                                                    Over RM 3,500
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Property Type dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === "type" ? null : "type")}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-semibold transition-all ${typeFilter !== "all"
                                            ? "bg-blue-50 border-[#2563eb] text-[#2563eb]"
                                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                                            }`}
                                    >
                                        <span>Type</span>
                                        <span className="text-[10px] text-slate-400">▼</span>
                                    </button>
                                    {activeDropdown === "type" && (
                                        <div className="absolute left-0 mt-1 w-52 bg-white border border-slate-150 rounded-xl shadow-xl p-3.5 z-40 animate-fade-in">
                                            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Build Type</span>
                                            <div className="flex flex-col gap-1.5">
                                                {["all", "Condominium", "Service Apartment", "Studio", "Penthouse"].map((t) => (
                                                    <button
                                                        key={t}
                                                        onClick={() => { setTypeFilter(t); setActiveDropdown(null); }}
                                                        className={`w-full text-left p-1.5 rounded text-xs font-semibold ${typeFilter === t ? "bg-blue-50 text-[#2563eb]" : "hover:bg-slate-50"}`}
                                                    >
                                                        {t === "all" ? "All types" : t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Beds modifier pill */}
                                <div className="relative">
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === "beds" ? null : "beds")}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-semibold transition-all ${bedsFilter !== "all"
                                            ? "bg-blue-50 border-[#2563eb] text-[#2563eb]"
                                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                                            }`}
                                    >
                                        <span>Rooms</span>
                                        <span className="text-[10px] text-slate-400">▼</span>
                                    </button>
                                    {activeDropdown === "beds" && (
                                        <div className="absolute left-0 mt-1 w-52 bg-white border border-slate-150 rounded-xl shadow-xl p-3.5 z-40 animate-fade-in">
                                            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Beds Spec</span>
                                            <div className="flex flex-col gap-1.5">
                                                <button
                                                    onClick={() => { setBedsFilter("all"); setActiveDropdown(null); }}
                                                    className={`w-full text-left p-1.5 rounded text-xs font-semibold ${bedsFilter === "all" ? "bg-blue-50 text-[#2563eb]" : "hover:bg-slate-50"}`}
                                                >
                                                    Any Room Count
                                                </button>
                                                <button
                                                    onClick={() => { setBedsFilter("1"); setActiveDropdown(null); }}
                                                    className={`w-full text-left p-1.5 rounded text-xs font-semibold ${bedsFilter === "1" ? "bg-blue-50 text-[#2563eb]" : "hover:bg-slate-50"}`}
                                                >
                                                    1 Bedroom
                                                </button>
                                                <button
                                                    onClick={() => { setBedsFilter("2"); setActiveDropdown(null); }}
                                                    className={`w-full text-left p-1.5 rounded text-xs font-semibold ${bedsFilter === "2" ? "bg-blue-50 text-[#2563eb]" : "hover:bg-slate-50"}`}
                                                >
                                                    2 Bedrooms
                                                </button>
                                                <button
                                                    onClick={() => { setBedsFilter("3"); setActiveDropdown(null); }}
                                                    className={`w-full text-left p-1.5 rounded text-xs font-semibold ${bedsFilter === "3" ? "bg-blue-50 text-[#2563eb]" : "hover:bg-slate-50"}`}
                                                >
                                                    3+ Bedrooms
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Verified Toggle Chip (matches selected/active state in screenshot) */}
                                <button
                                    onClick={() => setVerifiedFilter(!verifiedFilter)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${verifiedFilter
                                        ? "bg-[#2563eb]/10 border-[#2563eb] text-[#2563eb]"
                                        : "bg-[#f8f9ff] hover:bg-slate-50 border-slate-250 text-slate-600 hover:text-slate-800"
                                        }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${verifiedFilter ? "bg-[#2563eb]" : "bg-slate-300"}`} />
                                    <span>Verified Escrow Only</span>
                                </button>

                                {/* Clear all active filters indicator */}
                                {(priceFilter !== "all" || typeFilter !== "all" || bedsFilter !== "all" || verifiedFilter || searchQuery) && (
                                    <button
                                        onClick={() => {
                                            setPriceFilter("all");
                                            setTypeFilter("all");
                                            setBedsFilter("all");
                                            setVerifiedFilter(false);
                                            setSearchQuery("");
                                        }}
                                        className="text-xs text-[#2563eb] hover:underline hover:text-blue-700 font-bold ml-1"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* DYNAMIC LIST SCROLLBODY FEED */}
                    <div className="flex-grow overflow-y-auto p-5 properties-scroll bg-slate-50/55 flex flex-col gap-4">

                        {/* 1. VIEWING SEARCH RESULTS TAB */}
                        {activeTab === "search" && (
                            <>
                                {filteredProperties.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                        <Building className="w-12 h-12 text-slate-300 mb-3" />
                                        <p className="text-slate-700 font-bold text-sm mb-1">No matching properties found</p>
                                        <p className="text-xs text-slate-400 max-w-sm mb-4">
                                            Try adjusting your budget, filters, or geographical keyword search of Kuala Lumpur.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setPriceFilter("all");
                                                setTypeFilter("all");
                                                setBedsFilter("all");
                                                setVerifiedFilter(false);
                                                setSearchQuery("");
                                            }}
                                            className="bg-blue-50 text-[#2563eb] font-bold text-xs px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 transition-all"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                ) : (
                                    filteredProperties.map((property) => (
                                        <motion.div
                                            key={property.id}
                                            layoutId={`card-container-${property.id}`}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <MapPropertyCard
                                                property={property}
                                                isSelected={property.id === selectedPropertyId}
                                                isFavorite={favorites.includes(property.id)}
                                                onSelect={() => handleSelectPropertyId(property.id)}
                                                onToggleFavorite={(e) => handleToggleFavorite(property.id, e)}
                                                onOpenDetails={() => handleOpenDetailModal(property)}
                                            />
                                        </motion.div>
                                    ))
                                )}
                            </>
                        )}

                        {/* 2. VIEWING SAVED BOOKMARKED TAB */}
                        {activeTab === "saved" && (
                            <>
                                {favorites.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                        <Heart className="w-12 h-12 text-slate-300 mb-3" />
                                        <p className="text-slate-700 font-bold text-sm mb-1">No saved properties yet</p>
                                        <p className="text-xs text-slate-400 max-w-sm">
                                            Tap the heart icon on any properties in the search explorer feed to save for later comparison.
                                        </p>
                                    </div>
                                ) : (
                                    properties
                                        .filter((p) => favorites.includes(p.id))
                                        .map((property) => (
                                            <motion.div
                                                key={`saved-${property.id}`}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <PropertyCard
                                                    property={property}
                                                    isSelected={property.id === selectedPropertyId}
                                                    isFavorite={true}
                                                    onSelect={() => handleSelectPropertyId(property.id)}
                                                    onToggleFavorite={(e) => handleToggleFavorite(property.id, e)}
                                                    onOpenDetails={() => handleOpenDetailModal(property)}
                                                />
                                            </motion.div>
                                        ))
                                )}
                            </>
                        )}

                        {/* 3. VIEWING ACTIVE TOUR BOOKINGS TAB */}
                        {activeTab === "bookings" && (
                            <>
                                {bookings.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                        <Calendar className="w-12 h-12 text-slate-300 mb-3" />
                                        <p className="text-slate-700 font-bold text-sm mb-1">No scheduled walkthroughs</p>
                                        <p className="text-xs text-slate-400 max-w-sm">
                                            Click "View Details" on individual listings to book custom viewing slots with verified agents.
                                        </p>
                                    </div>
                                ) : (
                                    bookings.map((booking) => (
                                        <motion.div
                                            key={booking.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3.5 relative overflow-hidden"
                                        >
                                            {/* Top border decoration */}
                                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2563eb]" />

                                            <div className="flex items-center gap-3.5">
                                                <img
                                                    src={booking.property.imageUrl}
                                                    alt={booking.property.title}
                                                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-slate-100 border border-slate-100"
                                                />
                                                <div>
                                                    <span className="text-[10px] text-[#2563eb] font-bold uppercase tracking-wider block">
                                                        Viewing Tour Confirmed
                                                    </span>
                                                    <h4 className="font-sans font-bold text-slate-900 text-[14px]">
                                                        {booking.property.title}
                                                    </h4>
                                                    <span className="text-slate-500 text-[11px] block">{booking.property.area} district</span>
                                                </div>
                                            </div>

                                            {/* Details row */}
                                            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg text-xs">
                                                <div>
                                                    <span className="block text-slate-400 text-[9px] font-bold uppercase">Date Slot</span>
                                                    <span className="font-bold text-slate-800">{booking.date}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-slate-400 text-[9px] font-bold uppercase">Assigned Time</span>
                                                    <span className="font-bold text-[#2563eb]">{booking.time}</span>
                                                </div>
                                            </div>

                                            {booking.notes && (
                                                <div className="text-slate-600 text-xs italic bg-slate-50/55 p-2 px-3 rounded border border-slate-100">
                                                    "{booking.notes}"
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                                                <div className="flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[10.5px] text-emerald-700 font-bold">Awaiting hand-off</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleCancelBooking(booking.id)}
                                                        className="text-xs text-rose-500 hover:text-rose-700 font-bold"
                                                    >
                                                        Cancel Tour
                                                    </button>
                                                    <span className="text-slate-300">|</span>
                                                    <button
                                                        onClick={() => handleOpenDetailModal(booking.property)}
                                                        className="text-xs text-[#2563eb] hover:underline font-bold"
                                                    >
                                                        View Specs
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </>
                        )}

                    </div>
                </section>

                {/* RIGHT COLUMN: INTERACTIVE MAP VIEW COMPONENT (approx 60% on desktop) */}
                <section className={`flex-grow h-full overflow-hidden p-0 md:p-4.5 bg-[#f8f9ff] ${activeTab !== "search" ? "hidden md:block opacity-65 pointer-events-none" : "block"}`}>
                    <InteractiveMap
                        properties={filteredProperties}
                        selectedPropertyId={selectedPropertyId}
                        onSelectProperty={handleSelectPropertyId}
                    />
                </section>

            </main>

            <Footer onNavigate={() => { }} />

            {/* DETAILED PROPERTY SHEETS INFORMATION MODAL */}
            <AnimatePresence>
                {isDetailsOpen && detailsProperty && (
                    <PropertyDetailModal
                        property={detailsProperty}
                        isOpen={isDetailsOpen}
                        onClose={() => setIsDetailsOpen(false)}
                        onConfirmBooking={handleConfirmBooking}
                    />
                )}
            </AnimatePresence>

            {/* PRE-REGISTER MODAL */}
            <AnimatePresence>
                {isAuthModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-2xl p-6.5 max-w-sm w-full text-center relative"
                        >
                            <button
                                onClick={() => setIsAuthModalOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto mb-3.5 border border-blue-100">
                                <UserCheck className="w-6 h-6" />
                            </div>

                            <h2 className="text-[17px] font-sans font-extrabold text-slate-900 mb-1">
                                Account Status Active
                            </h2>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                You are registered as **dingziling88@gmail.com**. Your tenant eligibility has been calibrated under MySewa pre-approved credit guidelines score of **94/100**.
                            </p>

                            <div className="bg-slate-50 text-[11px] p-3 text-left rounded-xl border border-slate-150 mb-4.5">
                                <div className="flex justify-between items-center mb-1 text-slate-600">
                                    <span>Name:</span>
                                    <span className="font-bold text-slate-800">{user.name}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600">
                                    <span>Registered:</span>
                                    <span className="font-bold text-slate-[#2563eb]">{user.memberSince}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsAuthModalOpen(false)}
                                className="w-full bg-[#2563eb] text-white py-2.5 rounded-xl text-xs font-bold ring-2 ring-blue-100 cursor-pointer"
                            >
                                Close Settings
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
