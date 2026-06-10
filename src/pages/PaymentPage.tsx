/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PropertyDashboard from "../components/PropertyDashboard";
import CardForm from "../components/CardForm";
import FpxSection from "../components/FpxSection";
import WalletSection from "../components/WalletSection";
import MessageToHost from "../components/MessageToHost";
import RentalSummary from "../components/RentalSummary";
import PaymentSuccess from "../components/PaymentSuccess";
import SupportModal from "../components/SupportModal";
import { PROPERTIES } from "../paymentData";
import { UserSession, Property, PaymentMethod, CardDetails, PaymentStatus } from "../types";

export default function PaymentPage() {
    const navigate = useNavigate();

    const [session] = useState<UserSession | null>(() => {
        const saved = localStorage.getItem('mysewa_session');
        return saved ? JSON.parse(saved) : null;
    });

    const userProfile = session ? { name: session.name, score: 0, role: session.role } : null;
    const userEmail = session?.email ?? "dingziling88@gmail.com";

    // Navigation and active views
    const [activeView, setActiveView] = useState<"listings" | "checkout" | "receipt">("checkout");
    const [selectedProperty, setSelectedProperty] = useState<Property>(PROPERTIES[0]);

    // Payment method and status state
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");

    // Input states
    const [cardDetails, setCardDetails] = useState<CardDetails>({
        cardholderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        saveCard: true,
    });

    const [selectedBankId, setSelectedBankId] = useState<string>("maybank");
    const [selectedWalletId, setSelectedWalletId] = useState<string>("grabpay");
    const [messageToHost, setMessageToHost] = useState<string>("");

    // Error validation states
    const [errors, setErrors] = useState<Partial<Record<keyof CardDetails, string>>>({});

    // Overlay triggers
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    // Form field modification handler
    const handleCardDetailsChange = (updated: Partial<CardDetails>) => {
        setCardDetails(prev => {
            const merged = { ...prev, ...updated };
            // Clear specific error immediate upon correction
            const key = Object.keys(updated)[0] as keyof CardDetails;
            if (errors[key]) {
                setErrors(prevErr => {
                    const cpy = { ...prevErr };
                    delete cpy[key];
                    return cpy;
                });
            }
            return merged;
        });
    };

    // Switch billing tabs
    const handleSwitchTab = (method: PaymentMethod) => {
        setPaymentMethod(method);
        setErrors({});
    };

    // Property Selection Redirect
    const handleSelectPropertyAndCheckout = (property: Property) => {
        setSelectedProperty(property);
        setActiveView("checkout");
        setPaymentStatus("idle");
    };

    // Validation Check prior to Redirection
    const validateCardForm = (): boolean => {
        const errs: Partial<Record<keyof CardDetails, string>> = {};
        if (!cardDetails.cardholderName.trim()) {
            errs.cardholderName = "Cardholder's full name is required";
        } else if (cardDetails.cardholderName.trim().length < 3) {
            errs.cardholderName = "Please provide your full legal name";
        }

        if (!cardDetails.cardNumber.trim()) {
            errs.cardNumber = "Card number is required";
        } else if (cardDetails.cardNumber.replace(/\s/g, "").length < 16) {
            errs.cardNumber = "Card number must correspond to 16 digits";
        }

        if (!cardDetails.expiryDate.trim()) {
            errs.expiryDate = "Expiry is required";
        } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)) {
            errs.expiryDate = "Use format MM/YY (e.g. 12/28)";
        }

        if (!cardDetails.cvv.trim()) {
            errs.cvv = "CVV essential";
        } else if (cardDetails.cvv.length < 3) {
            errs.cvv = "Must be 3 digits";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // Pay Now submission
    const handleSubmitPayment = () => {
        if (paymentMethod === "card") {
            const isValid = validateCardForm();
            if (!isValid) {
                return;
            }
        }

        // Begin Simulated multi-stage Trust-Guard escrow pipeline
        setPaymentStatus("verifying");

        setTimeout(() => {
            setPaymentStatus("securing");

            setTimeout(() => {
                setPaymentStatus("completed");
                setActiveView("receipt");
            }, 1500);
        }, 1500);
    };

    const handleResetCheckout = () => {
        // Return back to listings selection index
        setActiveView("listings");
        setPaymentStatus("idle");
        setCardDetails({
            cardholderName: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            saveCard: true,
        });
        setErrors({});
    };

    return (
        <div className="min-h-screen bg-background text-on-background font-sans flex flex-col antialiased">
            {/* Top Navigator */}
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

            {/* Main Container */}
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-16 py-10 md:py-16">

                {/* VIEW 1: Listings Browser */}
                {activeView === "listings" && (
                    <PropertyDashboard
                        selectedProperty={selectedProperty}
                        onSelectProperty={handleSelectPropertyAndCheckout}
                    />
                )}

                {/* VIEW 2: MySewa Core Checkout Screen */}
                {activeView === "checkout" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Zone: Tab forms and information */}
                        <div className="lg:col-span-7 space-y-6">

                            {/* Checkout Title with dynamic back capability */}
                            <div className="flex items-center gap-3 mb-1">
                                <button
                                    type="button"
                                    onClick={() => setActiveView("listings")}
                                    className="p-1.5 hover:bg-surface-container-low rounded-full hover:text-primary text-on-surface-variant transition-all cursor-pointer"
                                    title="Return to property slider"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <h1 className="font-sans text-3xl font-black text-on-surface tracking-tight">
                                    Checkout
                                </h1>
                            </div>

                            {/* Payment Methods Outer Wrapper */}
                            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/15 overflow-hidden custom-shadow">
                                {/* Visual Tab bars */}
                                <div className="flex border-b border-outline-variant/20 relative">
                                    <button
                                        onClick={() => handleSwitchTab("card")}
                                        className={`flex-1 py-4 text-center text-xs font-bold font-sans transition-all cursor-pointer ${paymentMethod === "card"
                                            ? "text-primary border-b-2 border-primary"
                                            : "text-on-surface-variant hover:bg-surface-container-low opacity-80"
                                            }`}
                                    >
                                        Credit/Debit Card
                                    </button>
                                    <button
                                        onClick={() => handleSwitchTab("fpx")}
                                        className={`flex-1 py-4 text-center text-xs font-bold font-sans transition-all cursor-pointer ${paymentMethod === "fpx"
                                            ? "text-primary border-b-2 border-primary"
                                            : "text-on-surface-variant hover:bg-surface-container-low opacity-80"
                                            }`}
                                    >
                                        FPX Online Banking
                                    </button>
                                    <button
                                        onClick={() => handleSwitchTab("wallet")}
                                        className={`flex-1 py-4 text-center text-xs font-bold font-sans transition-all cursor-pointer ${paymentMethod === "wallet"
                                            ? "text-primary border-b-2 border-primary"
                                            : "text-on-surface-variant hover:bg-surface-container-low opacity-80"
                                            }`}
                                    >
                                        E-Wallet
                                    </button>
                                </div>

                                {/* Switchable billing card content panel */}
                                <div className="p-6">
                                    {paymentMethod === "card" && (
                                        <CardForm
                                            cardDetails={cardDetails}
                                            onChange={handleCardDetailsChange}
                                            errors={errors}
                                        />
                                    )}

                                    {paymentMethod === "fpx" && (
                                        <FpxSection
                                            selectedBankId={selectedBankId}
                                            onSelectBank={(id) => setSelectedBankId(id)}
                                        />
                                    )}

                                    {paymentMethod === "wallet" && (
                                        <WalletSection
                                            selectedWalletId={selectedWalletId}
                                            onSelectWallet={(id) => setSelectedWalletId(id)}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Message to Host section */}
                            <MessageToHost
                                message={messageToHost}
                                onChangeMessage={(msg) => setMessageToHost(msg)}
                            />

                            {/* Secure Trust PCI Indicators layout */}
                            <div className="flex flex-wrap items-center gap-6 py-2 border-t border-outline-variant/15 select-none text-on-surface-variant/70">
                                <div className="flex items-center gap-1.5">
                                    <Shield size={16} className="text-primary" />
                                    <span className="text-[11px] font-semibold">PCI DSS Compliant</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Shield size={16} className="text-primary" />
                                    <span className="text-[11px] font-semibold">256-bit AES Encryption</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Shield size={16} className="text-primary" />
                                    <span className="text-[11px] font-semibold">Secure Payment Gateway</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Invoice Panel Column */}
                        <RentalSummary
                            property={selectedProperty}
                            paymentStatus={paymentStatus}
                            onSubmitPayment={handleSubmitPayment}
                            onOpenSupport={() => setIsSupportOpen(true)}
                        />
                    </div>
                )}

                {/* VIEW 3: Payment receipts secure view */}
                {activeView === "receipt" && (
                    <PaymentSuccess
                        property={selectedProperty}
                        paymentMethod={paymentMethod}
                        cardDetails={cardDetails}
                        selectedBankId={selectedBankId}
                        selectedWalletId={selectedWalletId}
                        messageToHost={messageToHost}
                        onReset={handleResetCheckout}
                    />
                )}
            </main>

            {/* Sustainable Development goal compliant Footer */}
            <Footer onNavigate={() => { }} />

            {/* Trust-Guard customer support dialog overlay */}
            {isSupportOpen && (
                <SupportModal
                    onClose={() => setIsSupportOpen(false)}
                    userEmail={userEmail}
                />
            )}

            {/* Simulated Escrow Custody Loader Overlay */}
            {paymentStatus !== "idle" && paymentStatus !== "completed" && (
                <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border border-outline-variant/30 shadow-2xl animate-in zoom-in-95 duration-200 space-y-5">
                        <div className="flex justify-center relative">
                            <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-primary/25 opacity-75" />
                            <div className="relative h-12 w-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                                <Shield size={24} className="animate-pulse" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <h3 className="font-sans text-sm font-black text-on-surface uppercase tracking-wide">
                                Securing Trust-Guard Escrow
                            </h3>
                            <p className="text-xs text-on-surface-variant font-medium">
                                {paymentStatus === "verifying"
                                    ? "Running dual-channel 256-bit tokenized safety sweeps..."
                                    : "Establishing secure custody with Malaysian trust directives..."
                                }
                            </p>
                        </div>

                        {/* Simulated stage meter bar */}
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-primary h-full rounded-full transition-all duration-1500"
                                style={{ width: paymentStatus === "verifying" ? "45%" : "85%" }}
                            />
                        </div>

                        <p className="text-[10px] text-on-surface-variant/50 font-mono">
                            Do not close window or go back. Compliance security loops are active.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
