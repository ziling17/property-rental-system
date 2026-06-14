import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingPropertyCard from '../components/BookingPropertyCard';
import LeaseDurationPicker from '../components/LeaseDurationPicker';
import TrustCards from '../components/TrustCards';
import PaymentSummary from '../components/PaymentSummary';
import Modals from '../components/Modals';
import { PROPERTIES } from '../bookingData';
import { BookingProperty, BookingSummary } from '../types';

export default function BookingPage() {
    const navigate = useNavigate();
    const userProfile = (() => {
        const saved = localStorage.getItem('mysewa_session');
        return saved ? JSON.parse(saved) : null;
    })();
    // Selection States
    const [selectedProperty, setSelectedProperty] = useState<Property>(PROPERTIES[0]);
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(formatDate(today));
    const [endDate, setEndDate] = useState(formatDate(nextMonth));
    const [userEmail, setUserEmail] = useState<string | null>(null);

    // Modal display states
    const [activeModal, setActiveModal] = useState<'none' | 'login' | 'register' | 'success' | 'advisor' | 'terms'>('none');
    const [termsData, setTermsData] = useState<{ title: string; content: string } | undefined>(undefined);

    // Calculate lease months and billing parameters
    const getBookingSummary = (): BookingSummary => {
        if (!startDate || !endDate) {
            return {
                startDate,
                endDate,
                durationMonths: 0,
                durationDays: 0,
                isValid: false,
                warnings: ['Missing lease dates'],
                firstMonthRent: 0,
                securityDeposit: 0,
                utilityDeposit: 0,
                totalPayment: 0
            };
        }

        const start = new Date(startDate);
        const end = new Date(endDate);


        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return {
                startDate,
                endDate,
                durationMonths: 0,
                isValid: false,
                warnings: ['Invalid date format'],
                firstMonthRent: 0,
                securityDeposit: 0,
                utilityDeposit: 0,
                totalPayment: 0
            };
        }


        let yearDiff = end.getFullYear() - start.getFullYear();
        let monthDiff = end.getMonth() - start.getMonth();
        let totalMonths = yearDiff * 12 + monthDiff;

        const adjustedMonths = end.getDate() >= start.getDate()
            ? totalMonths
            : Math.max(0, totalMonths - 1);

        const durationMonths = Math.max(0, adjustedMonths);
        const durationDays = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
        const isValid = durationDays >= 30;

        const firstMonthRent = selectedProperty.monthlyRent;
        const securityDeposit = selectedProperty.securityDeposit;
        const utilityDeposit = selectedProperty.utilityDeposit;
        const totalPayment = firstMonthRent + securityDeposit + utilityDeposit;

        return {
            startDate,
            endDate,
            durationMonths,
            durationDays,
            isValid,
            warnings: isValid ? [] : ['Lease duration must be at least 30 days'],
            firstMonthRent,
            securityDeposit,
            utilityDeposit,
            totalPayment
        };
    };

    const bookingSummary = getBookingSummary();

    // Mouse move parallax atmospheric micro-interaction
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const img = document.getElementById('property-main-img');
            if (img && window.innerWidth > 768) {
                const mouseX = e.clientX / window.innerWidth - 0.5;
                const mouseY = e.clientY / window.innerHeight - 0.5;
                // Subtle move translation
                img.style.transform = `scale(1.05) translate(${mouseX * 8}px, ${mouseY * 8}px)`;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [selectedProperty]);

    // Open general platform term rules
    const handleOpenTerms = (title: string, content: string) => {
        setTermsData({ title, content });
        setActiveModal('terms');
    };

    const handleSelectProperty = (property: Property) => {
        setSelectedProperty(property);
    };

    const handleLoginSuccess = (email: string) => {
        setUserEmail(email);
    };

    const handleLogout = () => {
        setUserEmail(null);
    };

    return (
        <div className="bg-surface font-sans text-on-background min-h-screen flex flex-col antialiased">

            {/* Header TopNavBar Component */}
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

            {/* Main Structural Layout Grid */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-16 py-10 md:py-16">

                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start">

                    {/* Left Columns Column Container (7 columns) */}
                    <div className="w-full lg:col-span-7 flex flex-col gap-6">

                        {/* Confirmation Headline */}
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-1">
                            Confirm Your Booking
                        </h1>

                        {/* Property Summary Section */}
                        <BookingPropertyCard
                            selectedProperty={selectedProperty} onSelectProperty={handleSelectProperty}
                        />

                        {/* Selection Form Section */}
                        <LeaseDurationPicker
                            startDate={startDate}
                            endDate={endDate}
                            onStartDateChange={setStartDate}
                            onEndDateChange={setEndDate}
                            durationMonths={bookingSummary.durationMonths}
                            durationDays={bookingSummary.durationDays}
                            isValid={bookingSummary.isValid}
                        />

                        {/* Quality SDG & Trust Section */}
                        <TrustCards />

                    </div>

                    {/* Right Columns Sticky Sidebar (5 columns) */}
                    <div className="w-full lg:col-span-5">
                        <PaymentSummary
                            property={selectedProperty}
                            summary={bookingSummary}
                            onConfirmBooking={() => {
                                if (!userProfile) {
                                    navigate('/login');
                                } else {
                                    navigate('/payment');
                                }
                            }}
                            onOpenAdvisor={() => setActiveModal('advisor')}
                            onOpenTerms={handleOpenTerms}
                        />
                    </div>

                </div>

            </main>

            {/* Modal Overlay Controller */}
            <Modals
                activeModal={activeModal}
                onClose={() => setActiveModal('none')}
                selectedProperty={selectedProperty}
                bookingSummary={bookingSummary}
                userEmail={userEmail}
                onLoginSuccess={handleLoginSuccess}
                termsData={termsData}
            />

            {/* Footer Branding Navigation block */}
            <Footer onNavigate={() => { }} />

        </div>
    );
}
