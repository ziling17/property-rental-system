/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import Header from "../components/Header";
import SmartMatchHero from "../components/SmartMatchHero";
import BentoGrid from "../components/BentoGrid";
import ReasoningSection from "../components/ReasoningSection";
import PropertyViewer from "../components/PropertyViewer";
import CompareSection from "../components/CompareSection";
import ExploreSection from "../components/ExploreSection";
import Footer from "../components/Footer";
import ProfileDrawer from "../components/ProfileDrawer";
import { useNavigate } from 'react-router-dom';
import { INITIAL_PROPERTIES, DEFAULT_PROFILE, calculateMatch } from "../smartMatchData";
import { Property, RenterProfile } from "../types";

export default function SmartMatchPage() {
    const [tab, setTab] = useState<'match' | 'compare' | 'explore'>('match');
    const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
    const [profile, setProfile] = useState<RenterProfile>(DEFAULT_PROFILE);
    const [selectedProperty, setSelectedProperty] = useState<Property>(INITIAL_PROPERTIES[0]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const userProfile = (() => {
        const saved = localStorage.getItem('mysewa_session');
        return saved ? JSON.parse(saved) : null;
    })();

    // Helper score calculator for property tabs list
    const getScoreForProperty = (p: Property): number => {
        return calculateMatch(p, profile).overallScore;
    };

    // Helper breakdown score calculator for comparison tables
    const getBreakdownForProperty = (p: Property) => {
        const res = calculateMatch(p, profile);
        return {
            priceScore: res.priceScore,
            locationScore: res.locationScore,
            preferenceScore: res.preferenceScore,
        };
    };

    // Calculate compatibility for the currently selected property
    const currentMatchResult = calculateMatch(selectedProperty, profile);

    return (
        <div className="bg-background text-on-background selection:bg-primary-fixed-dim min-h-screen flex flex-col justify-between overflow-x-hidden antialiased">
            <div>
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

                <main className="max-w-[1280px] mx-auto px-6 md:px-16 py-12 w-full">
                    {tab === 'match' && (
                        <div className="space-y-12">
                            <SmartMatchHero
                                property={selectedProperty}
                                match={currentMatchResult}
                                onViewDetails={() => alert(`Details for ${selectedProperty.name}:\nLocation: ${selectedProperty.address}\nRent: $${selectedProperty.rent}/mo\nVerified Landlord scoring ${selectedProperty.landlordRating}/5★`)}
                                onCompare={() => setTab('compare')}
                            />

                            <BentoGrid match={currentMatchResult} />

                            <ReasoningSection match={currentMatchResult} />

                            <PropertyViewer
                                properties={properties}
                                selectedProperty={selectedProperty}
                                onSelectProperty={setSelectedProperty}
                                profile={profile}
                                calculateScore={getScoreForProperty}
                            />
                        </div>
                    )}

                    {tab === 'compare' && (
                        <CompareSection
                            properties={properties}
                            profile={profile}
                            calculateScore={getScoreForProperty}
                            calculateBreakdown={getBreakdownForProperty}
                            onSelectProperty={setSelectedProperty}
                            setTab={setTab}
                        />
                    )}

                    {tab === 'explore' && (
                        <ExploreSection
                            properties={properties}
                            profile={profile}
                            calculateScore={getScoreForProperty}
                            onSelectProperty={setSelectedProperty}
                            setTab={setTab}
                        />
                    )}
                </main>
            </div>

            <Footer onNavigate={() => { }} />

            {/* Renter profile settings modal drawer */}
            <ProfileDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                profile={profile}
                onChangeProfile={setProfile}
            />
        </div>
    );
}
