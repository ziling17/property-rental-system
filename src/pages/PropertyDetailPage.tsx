import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Gallery from "../components/Gallery";
import AmenitiesModal from "../components/AmenitiesModal";
import ReviewsList from "../components/ReviewsList";
import MatchConfigurator from "../components/MatchConfigurator";
import BookingCard from "../components/BookingCard";
import LucideIcon from "../components/LucideIcon";
import { DETAIL_PROPERTIES } from "../detailData";
import { useParams } from 'react-router-dom';
import { DetailProperty, MatchingInputs, CategoryRatings, DetailReview } from "../types";

export default function PropertyDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activePropertyId, setActivePropertyId] = useState<string>(id || "skyline-penthouse");
    const [properties, setProperties] = useState<DetailProperty[]>(DETAIL_PROPERTIES);
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [matchingInputs, setMatchingInputs] = useState<MatchingInputs>({
        klccCommuteMins: 12,
        prefersLeed: true,
        monthlyIncome: 44643,
        techIndustry: true,
    });
    const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

    const activeProperty = useMemo(() => {
        return properties.find((p) => p.id === activePropertyId) || properties[0];
    }, [properties, activePropertyId]);

    const isSaved = savedIds.has(activeProperty.id);

    const handleToggleSave = () => {
        const updated = new Set(savedIds);
        if (updated.has(activeProperty.id)) {
            updated.delete(activeProperty.id);
            triggerToast("Removed from saved collection.");
        } else {
            updated.add(activeProperty.id);
            triggerToast("Added to your saved collection!");
        }
        setSavedIds(updated);
    };

    const triggerToast = (message: string) => {
        setShowSuccessToast(message);
        setTimeout(() => setShowSuccessToast(null), 3000);
    };

    const updateMatchingInputs = (updated: Partial<MatchingInputs>) => {
        setMatchingInputs((prev) => ({ ...prev, ...updated }));
    };

    const handleAddReview = (newReview: DetailReview, updatedRatings: CategoryRatings) => {
        setProperties((prevProps) => {
            return prevProps.map((p) => {
                if (p.id === activePropertyId) {
                    const updatedReviews = [newReview, ...p.reviews];
                    return {
                        ...p,
                        reviews: updatedReviews,
                        categoryRatings: updatedRatings,
                        metrics: { ...p.metrics, stability: Math.min(100, p.metrics.stability + 1) },
                    };
                }
                return p;
            });
        });
        triggerToast("Your verified tenant review was submitted safely!");
    };

    const formatCurrency = (amt: number) => {
        return new Intl.NumberFormat("en-MY", {
            style: "currency",
            currency: "MYR",
            maximumFractionDigits: 0,
        }).format(amt);
    };

    const session = localStorage.getItem('mysewa_session');
    const userProfile = session ? JSON.parse(session) : null;

    return (
        <div className="min-h-screen bg-gray-50/20 font-sans flex flex-col justify-between">
            {showSuccessToast && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white rounded-xl shadow-xl px-5 py-3 border border-slate-800 z-[120] text-xs font-bold tracking-wide flex items-center gap-2">
                    <LucideIcon name="ShieldCheck" className="text-blue-400" size={16} />
                    <span>{showSuccessToast}</span>
                </div>
            )}

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

            <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-extrabold border border-blue-100">
                                Verified Property
                            </span>
                            <span className="bg-lime-50 text-lime-700 px-3 py-1 rounded-full text-xs font-extrabold border border-lime-100">
                                SDG 9 Energy Compliant
                            </span>
                        </div>
                        <h1 className="font-black text-3xl sm:text-4xl text-gray-950 tracking-tight">
                            {activeProperty.name}
                        </h1>
                        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                            <div className="flex items-center gap-1">
                                <LucideIcon name="MapPin" size={16} className="text-gray-400" />
                                <span className="font-medium text-gray-600">{activeProperty.location}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleToggleSave}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-bold shadow-xs transition-all ${isSaved ? "border-rose-200 text-rose-600 bg-rose-50/30" : "border-gray-200 text-gray-700 bg-white"
                            }`}
                    >
                        <LucideIcon name="Heart" size={16} className={isSaved ? "fill-rose-600 text-rose-600" : ""} />
                        <span>{isSaved ? "Saved" : "Save"}</span>
                    </button>
                </div>

                <Gallery images={activeProperty.images} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-100">
                            <div className="flex flex-col pl-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Rent</span>
                                <span className="text-xl font-extrabold text-blue-600">{formatCurrency(activeProperty.monthlyRent)}</span>
                            </div>
                            <div className="flex flex-col pl-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bedrooms</span>
                                <span className="text-xl font-extrabold text-gray-900">{activeProperty.bedrooms}</span>
                            </div>
                            <div className="flex flex-col pl-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit Size</span>
                                <span className="text-xl font-extrabold text-gray-900">{activeProperty.size}</span>
                            </div>
                            <div className="flex flex-col pl-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deposit</span>
                                <span className="text-xl font-extrabold text-gray-900">{formatCurrency(activeProperty.deposit)}</span>
                            </div>
                        </div>

                        <section className="flex flex-col sm:flex-row items-center sm:items-start gap-5 py-6 border-b border-gray-100">
                            <img alt="Host" className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 shadow-sm" src={activeProperty.host.avatar} />
                            <div className="space-y-1">
                                <h2 className="font-extrabold text-lg text-gray-950">Hosted by {activeProperty.host.name}</h2>
                                <p className="text-xs text-gray-500 leading-relaxed max-w-xl">{activeProperty.host.description}</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-extrabold text-lg text-gray-950">About this space</h2>
                            {activeProperty.about.map((pText, index) => (
                                <p key={index} className="text-sm text-gray-600 leading-relaxed">{pText}</p>
                            ))}
                        </section>

                        <section>
                            <h2 className="font-extrabold text-lg text-gray-950 mb-6">What this place offers</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {activeProperty.amenities.slice(0, 4).map((cat, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1.5">{cat.category}</h3>
                                        <ul className="space-y-2.5">
                                            {cat.items.slice(0, 3).map((item, itemIdx) => (
                                                <li key={itemIdx} className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                                    <LucideIcon name={item.iconName} size={15} className="text-blue-500" />
                                                    <span>{item.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8">
                                <button onClick={() => setShowAmenitiesModal(true)} className="bg-white border border-gray-200 hover:border-gray-300 px-6 py-2.5 rounded-xl font-bold text-xs text-gray-800 transition-colors">
                                    Show all {activeProperty.allAmenitiesCount} amenities
                                </button>
                            </div>
                        </section>

                        <MatchConfigurator inputs={matchingInputs} onUpdateInputs={updateMatchingInputs} monthlyRent={activeProperty.monthlyRent} />
                        <ReviewsList reviews={activeProperty.reviews} categoryRatings={activeProperty.categoryRatings} onAddReview={handleAddReview} />
                    </div>

                    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                        <BookingCard property={activeProperty} matchingInputs={matchingInputs} />
                    </div>
                </div>
            </main>

            <AmenitiesModal categories={activeProperty.amenities} totalCount={activeProperty.allAmenitiesCount} isOpen={showAmenitiesModal} onClose={() => setShowAmenitiesModal(false)} />

            <Footer onNavigate={() => { }} />
        </div>
    );
}