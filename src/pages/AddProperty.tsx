import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Building2,
    FileText,
    DollarSign,
    Plus,
    Search,
    MapPin,
    Trash2,
    Shield,
    Info,
    Image,
    Check,
    ListChecks,
    BedDouble,
    Bath,
    Maximize2,
    Calendar,
    X,
    Sparkles,
    UploadCloud,
    AlertCircle
} from "lucide-react";
import { Property, Notification, PropertyType } from "../types";
import { INITIAL_PROPERTIES, INITIAL_NOTIFICATIONS } from "../AddPropertyData";

export const AMENITY_CATEGORIES = [
    {
        key: "bathroom" as const,
        title: "Bathroom",
        items: [
            { id: "Hair dryer", label: "Hair dryer" },
            { id: "Bidet", label: "Bidet" },
            { id: "Hot water", label: "Hot water" }
        ]
    },
    {
        key: "bedroomAndLaundry" as const,
        title: "Bedroom and laundry",
        items: [
            { id: "Washer", label: "Washer" },
            { id: "Dryer", label: "Dryer" },
            { id: "Iron", label: "Iron" },
            { id: "Essentials", label: "Essentials (Towels, bed sheets, soap, toilet paper)" }
        ]
    },
    {
        key: "entertainment" as const,
        title: "Entertainment",
        items: [
            { id: "TV", label: "TV" },
            { id: "Exercise equipment", label: "Exercise equipment" },
            { id: "Books and reading material", label: "Books and reading material" }
        ]
    },
    {
        key: "heatingAndCooling" as const,
        title: "Heating and cooling",
        items: [
            { id: "Air conditioning", label: "Air conditioning" },
            { id: "Heating", label: "Heating" }
        ]
    },
    {
        key: "homeSafety" as const,
        title: "Home safety",
        items: [
            { id: "Smoke alarm", label: "Smoke alarm" },
            { id: "Carbon monoxide alarm", label: "Carbon monoxide alarm" },
            { id: "Fire extinguisher", label: "Fire extinguisher" },
            { id: "First aid kit", label: "First aid kit" },
            { id: "Exterior security cameras on property", label: "Exterior security cameras on property" }
        ]
    },
    {
        key: "internetAndOffice" as const,
        title: "Internet and office",
        items: [
            { id: "Wifi", label: "Wifi" },
            { id: "Dedicated workspace", label: "Dedicated workspace" }
        ]
    },
    {
        key: "kitchenAndDining" as const,
        title: "Kitchen and dining",
        items: [
            { id: "Kitchen", label: "Kitchen" },
            { id: "Refrigerator", label: "Refrigerator" },
            { id: "Cooking basics", label: "Cooking basics (Pots and pans, oil, salt and pepper)" },
            { id: "Dishes and silverware", label: "Dishes and silverware (Bowls, chopsticks, plates, cups, etc.)" },
            { id: "Freezer", label: "Freezer" },
            { id: "Dishwasher", label: "Dishwasher" },
            { id: "Hot water kettle", label: "Hot water kettle" },
            { id: "Wine glasses", label: "Wine glasses" },
            { id: "Rice maker", label: "Rice maker" },
            { id: "Trash compactor", label: "Trash compactor" }
        ]
    },
    {
        key: "outdoor" as const,
        title: "Outdoor",
        items: [
            { id: "Sun loungers", label: "Sun loungers" }
        ]
    },
    {
        key: "parkingAndFacilities" as const,
        title: "Parking and facilities",
        items: [
            { id: "Pool", label: "Pool" },
            { id: "Paid parking on premises", label: "Paid parking on premises" }
        ]
    },
    {
        key: "services" as const,
        title: "Services",
        items: [
            { id: "Host greets you", label: "Host greets you" }
        ]
    }
];

export default function AddProperty() {
    const navigate = useNavigate();

    const [userProfile] = useState(() => {
        try {
            const saved = localStorage.getItem('mysewa_session');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });
    // Navigation State
    const [activeTab, setActiveTab] = useState<"dashboard" | "properties" | "leases" | "payments" | "add-property">("add-property");

    // Core Data States with LocalStorage Persistence
    const [properties, setProperties] = useState<Property[]>(() => {
        const saved = localStorage.getItem("mysewa_properties");
        return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
    });

    const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

    // Sync data to LocalStorage
    useEffect(() => {
        localStorage.setItem("mysewa_properties", JSON.stringify(properties));
    }, [properties]);

    // Custom Amenities states & helpers
    const [customAmenities, setCustomAmenities] = useState<Record<string, string[]>>(() => {
        const saved = localStorage.getItem("mysewa_custom_amenities");
        return saved ? JSON.parse(saved) : {
            bathroom: [],
            bedroomAndLaundry: [],
            entertainment: [],
            heatingAndCooling: [],
            homeSafety: [],
            internetAndOffice: [],
            kitchenAndDining: [],
            outdoor: [],
            parkingAndFacilities: [],
            services: []
        };
    });

    useEffect(() => {
        localStorage.setItem("mysewa_custom_amenities", JSON.stringify(customAmenities));
    }, [customAmenities]);

    const [activeAddCategory, setActiveAddCategory] = useState<string | null>(null);
    const [newAmenityText, setNewAmenityText] = useState("");

    const handleAddCustomAmenity = (catKey: string) => {
        const trimmed = newAmenityText.trim();
        if (!trimmed) return;

        const existingPredefined = AMENITY_CATEGORIES.find(c => c.key === catKey)?.items.some(i => i.id.toLowerCase() === trimmed.toLowerCase());
        const existingCustom = (customAmenities[catKey] || []).some(i => i.toLowerCase() === trimmed.toLowerCase());

        if (existingPredefined || existingCustom) {
            showToast("This amenity already exists in this category!", "info");
            return;
        }

        setCustomAmenities(prev => ({
            ...prev,
            [catKey]: [...(prev[catKey] || []), trimmed]
        }));

        setWizardData(prev => ({
            ...prev,
            amenities: {
                ...prev.amenities,
                [catKey]: [...(prev.amenities[catKey as keyof typeof prev.amenities] || []), trimmed]
            }
        }));

        setNewAmenityText("");
        setActiveAddCategory(null);
        showToast(`Added custom amenity: "${trimmed}"`);
    };

    const getCategoryItems = (catKey: string, staticItems: { id: string; label: string }[]) => {
        const itemsMap = new Map<string, string>();

        staticItems.forEach(item => {
            itemsMap.set(item.id, item.label);
        });

        const customList = customAmenities[catKey] || [];
        customList.forEach(item => {
            if (!itemsMap.has(item)) {
                itemsMap.set(item, item);
            }
        });

        const wizardList = wizardData.amenities[catKey as keyof typeof wizardData.amenities] || [];
        wizardList.forEach(item => {
            if (!itemsMap.has(item)) {
                itemsMap.set(item, item);
            }
        });

        return Array.from(itemsMap.entries()).map(([id, label]) => ({ id, label }));
    };

    // Toast State
    const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);
    const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Property Search & Filters
    const [propertySearch, setPropertySearch] = useState("");
    const [propertyFilterType, setPropertyFilterType] = useState<string>("All");
    const [selectedPropertyDetail, setSelectedPropertyDetail] = useState<Property | null>(null);

    // New Lease Draft state
    const [isAddLeaseOpen, setIsAddLeaseOpen] = useState(false);
    const [leaseDraft, setLeaseDraft] = useState({
        propertyId: "",
        tenantName: "",
        tenantPhone: "",
        tenantEmail: "",
        startDate: "",
        endDate: "",
    });

    // New Payment Log state
    const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
    const [paymentDraft, setPaymentDraft] = useState({
        propertyName: "",
        tenantName: "",
        amount: "2000",
        type: "Rent" as "Rent" | "Security Deposit" | "Utility Deposit",
    });

    // Notification Pane toggles
    const [showNotificationsList, setShowNotificationsList] = useState(false);

    // Wizard Step Form States
    const [wizardStep, setWizardStep] = useState<number>(1);
    const [wizardData, setWizardData] = useState({
        title: "",
        description: "",
        type: "Apartment" as PropertyType,
        location: "",
        rent: "2500",
        bedrooms: "3",
        bathrooms: "2",
        size: "1200",
        securityDeposit: "5000",
        utilityDeposit: "1250",
        amenities: {
            bathroom: ["Hair dryer"],
            bedroomAndLaundry: ["Washer"],
            entertainment: ["TV"],
            heatingAndCooling: ["Air conditioning"],
            homeSafety: ["Smoke alarm"],
            internetAndOffice: ["Wifi"],
            kitchenAndDining: ["Kitchen", "Refrigerator", "Cooking basics"],
            outdoor: [] as string[],
            parkingAndFacilities: [] as string[],
            services: [] as string[]
        },
        images: [] as string[],
        agreedToTerms: true
    });

    // Mock Preset Location Map coordinates click helpers
    const handlePresetLocationPin = (point: string, address: string) => {
        setWizardData(prev => ({
            ...prev,
            location: address,
            title: prev.title || `Lovely ${prev.type} near ${point}`
        }));
        showToast(`Pinned location to ${point}!`, "info");
    };

    // Handlers for Wizard Form
    const handleNextStep = () => {
        if (wizardStep < 4) {
            if (wizardStep === 3 && wizardData.images.length === 0) {
                showToast("Please add at least one photo of your property to proceed.", "error");
                return;
            }
            setWizardStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            // Validate in step 4
            if (!wizardData.title.trim()) {
                showToast("Please provide a Property Title first", "error");
                setWizardStep(1);
                return;
            }
            if (wizardData.images.length === 0) {
                showToast("Please add at least one photo of your property.", "error");
                setWizardStep(3);
                return;
            }
            if (!wizardData.agreedToTerms) {
                showToast("You must agree to MySewa's Listing Terms.", "error");
                return;
            }

            // Publish Listing
            const newProperty: Property = {
                id: "prop-" + Date.now(),
                title: wizardData.title,
                description: wizardData.description || "No description provided.",
                type: wizardData.type,
                location: wizardData.location || "Kuala Lumpur, Malaysia",
                rent: Number(wizardData.rent) || 1200,
                bedrooms: Number(wizardData.bedrooms) || 1,
                bathrooms: Number(wizardData.bathrooms) || 1,
                size: Number(wizardData.size) || 600,
                securityDeposit: Number(wizardData.securityDeposit) || 2400,
                utilityDeposit: Number(wizardData.utilityDeposit) || 600,
                amenities: wizardData.amenities,
                images: wizardData.images,
                status: "Pending Verification",
                createdAt: new Date().toISOString().split("T")[0]
            };

            setProperties(prev => [newProperty, ...prev]);

            // Add a System Notification
            const newNotification: Notification = {
                id: "notif-" + Date.now(),
                title: "Property Submitted",
                message: `"${newProperty.title}" was submitted successfully and is queued for verification.`,
                time: "Just now",
                unread: true,
                category: "verification"
            };
            setNotifications(prev => [newNotification, ...prev]);

            showToast("Property published successfully! Queued for manual 24h verification.", "success");

            // Reset Wizard state
            setWizardStep(1);
            setWizardData({
                title: "",
                description: "",
                type: "Apartment",
                location: "",
                rent: "2500",
                bedrooms: "3",
                bathrooms: "2",
                size: "1200",
                securityDeposit: "5000",
                utilityDeposit: "1250",
                amenities: {
                    bathroom: ["Hair dryer"],
                    bedroomAndLaundry: ["Washer"],
                    entertainment: ["TV"],
                    heatingAndCooling: ["Air conditioning"],
                    homeSafety: ["Smoke alarm"],
                    internetAndOffice: ["Wifi"],
                    kitchenAndDining: ["Kitchen", "Refrigerator", "Cooking basics"],
                    outdoor: [],
                    parkingAndFacilities: [],
                    services: []
                },
                images: [],
                agreedToTerms: true
            });

            // Switch view to Properties List to see the result
            setActiveTab("properties");
        }
    };

    const handlePrevStep = () => {
        if (wizardStep > 1) {
            setWizardStep(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleCheckboxChange = (category: keyof typeof wizardData.amenities, item: string) => {
        setWizardData(prev => {
            const currentList = prev.amenities[category];
            const updatedList = currentList.includes(item)
                ? currentList.filter(i => i !== item)
                : [...currentList, item];

            return {
                ...prev,
                amenities: {
                    ...prev.amenities,
                    [category]: updatedList
                }
            };
        });
    };

    // Add default simulation image
    const addSampleImage = () => {
        const sampleImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuUn4SYXTabKsid0B8SWiBTmGPUNJEEuydnOZZlHWJj-NlyQzxMWON6YCr24OyB_ANMWgSb2okK-UkBaFBhaMcYH8uzkcV3riok884ZsDeXASCo_dSidu41JMDox4V1a81DoGuQ1K67XzzXUY_2gijda8_R3_6Nq-Y_9KVYeapZf1xtWwH-t009Vz7M49R6uVh8TwAcuxAAPaSJH-U0IM_HrjCkdRYwoqKXTyiGTmu20QTxW3PKq7yxsqHc96tYNoLWWCWPdCN1M9Q";
        if (wizardData.images.includes(sampleImage)) {
            showToast("Luxury Living Room sample already added!", "info");
            return;
        }
        setWizardData(prev => ({
            ...prev,
            images: [...prev.images, sampleImage]
        }));
        showToast("Sample photo successfully loaded into gallery.");
    };

    // Remove uploaded image from wizard
    const removeWizardImage = (index: number) => {
        setWizardData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        showToast("Photo removed from selection.");
    };

    // Draft dynamic lease confirmation
    const handleCreateLease = (e: React.FormEvent) => {
        e.preventDefault();
        if (!leaseDraft.propertyId || !leaseDraft.tenantName) {
            showToast("Please fill in basic physical property & tenant information.", "error");
            return;
        }

        const selectedProp = properties.find(p => p.id === leaseDraft.propertyId);
        if (!selectedProp) return;

        const newLease: Lease = {
            id: "lease-" + Date.now(),
            propertyId: leaseDraft.propertyId,
            propertyName: selectedProp.title,
            tenantName: leaseDraft.tenantName,
            tenantPhone: leaseDraft.tenantPhone || "+60 12-321 0000",
            tenantEmail: leaseDraft.tenantEmail || "tenant@mysewa.my",
            startDate: leaseDraft.startDate || new Date().toISOString().split("T")[0],
            endDate: leaseDraft.endDate || "2027-06-09",
            monthlyRent: selectedProp.rent,
            depositPaid: true,
            status: "Active"
        };

        setLeases(prev => [newLease, ...prev]);
        setIsAddLeaseOpen(false);

        // Create automatic initial Rent payment record
        const automaticPayment: Payment = {
            id: "pay-" + Date.now(),
            propertyName: selectedProp.title,
            tenantName: leaseDraft.tenantName,
            amount: selectedProp.rent,
            type: "Rent",
            status: "Paid",
            date: new Date().toISOString().split("T")[0],
            referenceNo: "TXN" + Math.floor(100000000 + Math.random() * 900000000)
        };
        setPayments(prev => [automaticPayment, ...prev]);

        showToast(`Lease agreement executed for ${leaseDraft.tenantName}! First month's rent auto-processed.`);
        setLeaseDraft({
            propertyId: "",
            tenantName: "",
            tenantPhone: "",
            tenantEmail: "",
            startDate: "",
            endDate: "",
        });
    };

    // Log manual utility/rent transaction
    const handleLogPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentDraft.propertyName || !paymentDraft.tenantName || !paymentDraft.amount) {
            showToast("All fields are required to log physical transactions", "error");
            return;
        }

        const newPayment: Payment = {
            id: "pay-" + Date.now(),
            propertyName: paymentDraft.propertyName,
            tenantName: paymentDraft.tenantName,
            amount: Number(paymentDraft.amount),
            type: paymentDraft.type,
            status: "Paid",
            date: new Date().toISOString().split("T")[0],
            referenceNo: "MAN" + Math.floor(100000000 + Math.random() * 900000000)
        };

        setPayments(prev => [newPayment, ...prev]);
        setIsAddPaymentOpen(false);
        showToast(`Payment of RM ${newPayment.amount} validated offline successfully!`);
        setPaymentDraft({
            propertyName: "",
            tenantName: "",
            amount: "2000",
            type: "Rent"
        });
    };

    // Delete dynamic property listing
    const handleDeleteProperty = (id: string, name: string) => {
        if (confirm(`Are you sure you want to completely de-list "${name}"? This action is permanent.`)) {
            setProperties(prev => prev.filter(p => p.id !== id));
            showToast(`"${name}" successfully de-listed.`);
            setSelectedPropertyDetail(null);
        }
    };

    // Calculations for KPI numbers in Landlord Dashboard
    const activeLeaseCount = leases.filter(l => l.status === "Active").length;
    const pendingLeaseCount = leases.filter(l => l.status === "Pending Signature").length;

    // Dynamic monthly income from Active Leases
    const calculatedRentalIncome = leases
        .filter(l => l.status === "Active")
        .reduce((sum, lease) => sum + lease.monthlyRent, 0);

    // Total collected history
    const totalCollectedAllTime = payments
        .filter(p => p.status === "Paid")
        .reduce((sum, payment) => sum + payment.amount, 0);

    return (
        <div className="min-h-screen bg-surface text-on-surface font-sans" id="mysewa-app-root">
            {/* Dynamic Toast Element */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-xl shadow-xl border text-sm font-semibold transition-all ${toast.type === "success"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : toast.type === "error"
                                ? "bg-rose-50 border-rose-200 text-rose-800"
                                : "bg-surface-container border-outline-variant text-primary"
                            }`}
                    >
                        {toast.type === "success" && <Check className="w-5 h-5 text-emerald-600 animate-bounce" />}
                        {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600 animate-pulse" />}
                        {toast.type === "info" && <Info className="w-5 h-5 text-primary" />}
                        <span>{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TopNavBar Header (Matching Design Layout) */}
            <Header
                onNavigate={() => { }}
                activeSection=""
                userProfile={userProfile ? { name: userProfile.name, score: 0, role: userProfile.role } : null}
            />

            <main className="pt-10 pb-16 min-h-screen max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between mb-8 -mt-4">
                    <button
                        onClick={() => navigate('/landlord-dashboard')}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-primary transition-colors cursor-pointer"
                    >
                        <span>←</span>
                        <span>Back to Dashboard</span>
                    </button>
                </div>

                {/* Main Wrapper */}
                <AnimatePresence mode="wait">
                    {/* TAB 1: ADD PROPERTY (FORM WIZARD SPECIFICATIONS MATCHED PERFECTLY) */}
                    {activeTab === "add-property" && (
                        <motion.div
                            key="add-property"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4"
                        >
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Flow Progress Sidebar */}
                                <aside className="lg:w-1/4">
                                    <div className="space-y-6 sticky top-28">
                                        <h1 className="text-2xl font-bold tracking-tight text-on-surface">List a Property</h1>

                                        <div className="flex flex-col gap-3">
                                            {/* Step 1 Indicator */}
                                            <div
                                                onClick={() => setWizardStep(1)}
                                                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border-l-4 transition-all duration-300 ${wizardStep === 1
                                                    ? "bg-surface-container-lowest border-primary shadow-sm"
                                                    : "bg-surface-container-low border-transparent opacity-60 text-outline"
                                                    }`}
                                                id="step-indicator-1"
                                            >
                                                <Info className={`w-5 h-5 ${wizardStep === 1 ? "text-primary" : "text-outline"}`} />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">Step 1</span>
                                                    <span className={`text-base font-semibold ${wizardStep === 1 ? "text-on-surface" : "text-outline"}`}>Basic Info</span>
                                                </div>
                                            </div>

                                            {/* Step 2 Indicator */}
                                            <div
                                                onClick={() => setWizardStep(2)}
                                                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border-l-4 transition-all duration-300 ${wizardStep === 2
                                                    ? "bg-surface-container-lowest border-primary shadow-sm"
                                                    : "bg-surface-container-low border-transparent opacity-60 text-outline"
                                                    }`}
                                                id="step-indicator-2"
                                            >
                                                <ListChecks className={`w-5 h-5 ${wizardStep === 2 ? "text-primary" : "text-outline"}`} />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">Step 2</span>
                                                    <span className={`text-base font-semibold ${wizardStep === 2 ? "text-on-surface" : "text-outline"}`}>Amenities</span>
                                                </div>
                                            </div>

                                            {/* Step 3 Indicator */}
                                            <div
                                                onClick={() => setWizardStep(3)}
                                                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border-l-4 transition-all duration-300 ${wizardStep === 3
                                                    ? "bg-surface-container-lowest border-primary shadow-sm"
                                                    : "bg-surface-container-low border-transparent opacity-60 text-outline"
                                                    }`}
                                                id="step-indicator-3"
                                            >
                                                <Image className={`w-5 h-5 ${wizardStep === 3 ? "text-primary" : "text-outline"}`} />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">Step 3</span>
                                                    <span className={`text-base font-semibold ${wizardStep === 3 ? "text-on-surface" : "text-outline"}`}>Media</span>
                                                </div>
                                            </div>

                                            {/* Step 4 Indicator */}
                                            <div
                                                onClick={() => setWizardStep(4)}
                                                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border-l-4 transition-all duration-300 ${wizardStep === 4
                                                    ? "bg-surface-container-lowest border-primary shadow-sm"
                                                    : "bg-surface-container-low border-transparent opacity-60 text-outline"
                                                    }`}
                                                id="step-indicator-4"
                                            >
                                                <Shield className={`w-5 h-5 ${wizardStep === 4 ? "text-primary" : "text-outline"}`} />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">Step 4</span>
                                                    <span className={`text-base font-semibold ${wizardStep === 4 ? "text-on-surface" : "text-outline"}`}>Review</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Trust Shield Badge */}
                                        <div className="bg-primary-fixed text-on-primary-fixed p-5 rounded-2xl space-y-2 border border-blue-100 shadow-sm">
                                            <div className="flex items-center gap-2 text-primary font-semibold">
                                                <Shield className="w-5 h-5" />
                                                <span className="text-sm tracking-wide">Secure Listing</span>
                                            </div>
                                            <p className="text-xs text-on-primary-fixed/80 leading-relaxed">
                                                Your property will be manually verified by our team within 24 hours to ensure high-quality standards.
                                            </p>
                                        </div>
                                    </div>
                                </aside>

                                {/* Form Module Input Canvas */}
                                <div className="lg:w-3/4">
                                    <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-surface-variant shadow-sm relative overflow-hidden">
                                        <form onSubmit={e => e.preventDefault()} className="space-y-6">

                                            {/* STEP 1: BASIC INFO */}
                                            {wizardStep === 1 && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="space-y-6"
                                                    id="section-1"
                                                >
                                                    <div className="border-b border-surface-variant/40 pb-4">
                                                        <h2 className="text-xl font-bold text-on-surface">Property Foundation</h2>
                                                        <p className="text-sm text-on-surface-variant mt-1">Start with the core details that help tenants find your home.</p>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-2">Property Title</label>
                                                            <input
                                                                type="text"
                                                                value={wizardData.title}
                                                                onChange={e => setWizardData({ ...wizardData, title: e.target.value })}
                                                                placeholder="e.g. Modern Luxury Apartment near KLCC"
                                                                className="w-full bg-surface border border-outline-variant rounded-xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-2">Description</label>
                                                            <textarea
                                                                value={wizardData.description}
                                                                onChange={e => setWizardData({ ...wizardData, description: e.target.value })}
                                                                placeholder="Describe the lifestyle, neighborhood, and unique features..."
                                                                className="w-full bg-surface border border-outline-variant rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-2">Property Type</label>
                                                                <select
                                                                    value={wizardData.type}
                                                                    onChange={e => setWizardData({ ...wizardData, type: e.target.value as PropertyType })}
                                                                    className="w-full bg-surface border border-outline-variant rounded-xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                                >
                                                                    <option value="Apartment">Apartment</option>
                                                                    <option value="Landed (House/Villa)">Landed (House/Villa)</option>
                                                                    <option value="Room / Shared">Room / Shared</option>
                                                                    <option value="Studio">Studio</option>
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-2">Location</label>
                                                                <div className="relative">
                                                                    <input
                                                                        type="text"
                                                                        value={wizardData.location}
                                                                        onChange={e => setWizardData({ ...wizardData, location: e.target.value })}
                                                                        placeholder="Search address or area..."
                                                                        className="w-full bg-surface border border-outline-variant rounded-xl p-4 pl-12 focus:ring-2 
                                                                                    focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                                    />
                                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Kuala Lumpur Map Pinning Feature Block */}
                                                        <div>
                                                            <div className="flex justify-between items-center mb-2">
                                                                <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider">Map Visual Locator</label>
                                                                <span className="text-[10px] text-primary bg-primary-fixed px-2 py-0.5 rounded-full font-semibold">Active Interactive Map</span>
                                                            </div>
                                                            <p className="text-xs text-on-surface-variant mb-3">Click on any target landmark region to dynamically assign coordinate addresses:</p>

                                                            <div className="bg-surface-variant rounded-2xl overflow-hidden aspect-[21/9] relative border border-outline-variant group">
                                                                <img
                                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbT53jNWlE5CFM1DQqoIEdqZpUqK7sHQ2OJbHhwjPdsRvpjsC17jsg4AgkT8L-oTI3CVLbaloa3c89k4bENJ81-a7UDOaHwig5ZQF6a9-F08tPEm8ePyvdfjWQIzixPEsM8-F6YkckQ7cl2c3LmoYmlAu6AgzDplA3Ns3fuMNP-2kkfpzRceUkk2zqW6868dL3Ee0DOVNG91dE-7nuKSEorripKP-crSoZUFflOdwaQzbkm5ZURH2h1ElCulsBKQ09ogQ5gBljYsE"
                                                                    alt="KL Landmark Map Location Pointer MySewa"
                                                                    className="w-full h-full object-cover grayscale-[10%]"
                                                                />

                                                                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/25 transition-all flex flex-wrap items-center justify-center p-4 gap-2">
                                                                    {/* Point 1: KLCC */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handlePresetLocationPin("Suria KLCC", "Jalan Ampang, Kuala Lumpur, 50450")}
                                                                        className="bg-white/95 hover:bg-primary hover:text-white text-[11px] text-slate-800 font-semibold px-3 py-1.5 rounded-full shadow-lg transition flex items-center gap-1"
                                                                    >
                                                                        <MapPin className="w-3.5 h-3.5" />
                                                                        <span>KLCC Central</span>
                                                                    </button>

                                                                    {/* Point 2: Bangsar South */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handlePresetLocationPin("Bangsar South", "Bangsar South City, Kuala Lumpur, 59200")}
                                                                        className="bg-white/95 hover:bg-primary hover:text-white text-[11px] text-slate-800 font-semibold px-3 py-1.5 rounded-full shadow-lg transition flex items-center gap-1"
                                                                    >
                                                                        <MapPin className="w-3.5 h-3.5" />
                                                                        <span>Bangsar Tech</span>
                                                                    </button>

                                                                    {/* Point 3: Damansara Heights */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handlePresetLocationPin("Damansara Heights", "Damansara Heights Luxury Residences, 50490")}
                                                                        className="bg-white/95 hover:bg-primary hover:text-white text-[11px] text-slate-800 font-semibold px-3 py-1.5 rounded-full shadow-lg transition flex items-center gap-1"
                                                                    >
                                                                        <MapPin className="w-3.5 h-3.5" />
                                                                        <span>Damansara Gardens</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* STEP 2: DETAILS & AMENITIES */}
                                            {wizardStep === 2 && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="space-y-6"
                                                    id="section-2"
                                                >
                                                    <div className="border-b border-surface-variant/40 pb-4">
                                                        <h2 className="text-xl font-bold text-on-surface">Property Specifications</h2>
                                                        <p className="text-sm text-on-surface-variant mt-1">Define the value and specific physical properties of your space.</p>
                                                    </div>

                                                    {/* Numerical Specs Grid */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-2">Monthly Rent (RM)</label>
                                                            <div className="relative">
                                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-outline">RM</span>
                                                                <input
                                                                    type="number"
                                                                    value={wizardData.rent}
                                                                    onChange={e => setWizardData({ ...wizardData, rent: e.target.value })}
                                                                    className="w-full bg-surface border border-outline-variant rounded-xl p-4 pl-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold text-slate-800"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-2">Bedrooms (BHK)</label>
                                                            <input
                                                                type="number"
                                                                value={wizardData.bedrooms}
                                                                onChange={e => setWizardData({ ...wizardData, bedrooms: e.target.value })}
                                                                className="w-full bg-surface border border-outline-variant rounded-xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold text-slate-800"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-2">Bathrooms</label>
                                                            <input
                                                                type="number"
                                                                value={wizardData.bathrooms}
                                                                onChange={e => setWizardData({ ...wizardData, bathrooms: e.target.value })}
                                                                className="w-full bg-surface border border-outline-variant rounded-xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold text-slate-800"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-2">Size (Sqft)</label>
                                                            <input
                                                                type="number"
                                                                value={wizardData.size}
                                                                onChange={e => setWizardData({ ...wizardData, size: e.target.value })}
                                                                className="w-full bg-surface border border-outline-variant rounded-xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold text-slate-800"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-2">Security Deposit (RM)</label>
                                                            <div className="relative">
                                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-outline">RM</span>
                                                                <input
                                                                    type="number"
                                                                    value={wizardData.securityDeposit}
                                                                    onChange={e => setWizardData({ ...wizardData, securityDeposit: e.target.value })}
                                                                    className="w-full bg-surface border border-outline-variant rounded-xl p-4 pl-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-2">Utility Deposit (RM)</label>
                                                            <div className="relative">
                                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-outline">RM</span>
                                                                <input
                                                                    type="number"
                                                                    value={wizardData.utilityDeposit}
                                                                    onChange={e => setWizardData({ ...wizardData, utilityDeposit: e.target.value })}
                                                                    className="w-full bg-surface border border-outline-variant rounded-xl p-4 pl-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Custom Amenities Matrix */}
                                                    <div>
                                                        <h3 className="font-semibold text-slate-900 text-sm border-b border-surface-variant pb-2 mb-4">Amenities &amp; Features checkmarks</h3>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                            {AMENITY_CATEGORIES.map(category => {
                                                                const resolvedItems = getCategoryItems(category.key, category.items);
                                                                return (
                                                                    <div key={category.key} className="p-4 rounded-xl border transition-all bg-surface-container-low border-surface-variant/40 flex flex-col justify-between">
                                                                        <div>
                                                                            <h4 className="text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-1 text-primary">
                                                                                <span>{category.title}</span>
                                                                            </h4>
                                                                            <div className="space-y-2.5">
                                                                                {resolvedItems.map(item => (
                                                                                    <label key={item.id} className="flex items-center gap-2.5 text-xs text-on-surface-variant hover:text-primary cursor-pointer select-none">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={wizardData.amenities[category.key].includes(item.id)}
                                                                                            onChange={() => handleCheckboxChange(category.key, item.id)}
                                                                                            className="rounded border-outline-variant focus:ring-offset-0 w-4.5 h-4.5 text-primary focus:ring-primary"
                                                                                        />
                                                                                        <span className="text-slate-700">
                                                                                            {item.label}
                                                                                        </span>
                                                                                    </label>
                                                                                ))}
                                                                            </div>
                                                                        </div>

                                                                        {/* Dynamic Inline Custom Amenity Input */}
                                                                        <div className="mt-4 pt-3 border-t border-dashed border-slate-200">
                                                                            {activeAddCategory === category.key ? (
                                                                                <div className="flex gap-1.5 items-center">
                                                                                    <input type="text" placeholder="e.g. Jacuzzi" value={newAmenityText} onChange={(e) => setNewAmenityText(e.target.value)} className="flex-1 min-w-0 bg-white border border-outline-variant rounded-lg px-2 py-1 text-xs text-slate-800  outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                                                                        autoFocus onKeyDown={(e) => {
                                                                                            if (e.key === "Enter") {
                                                                                                e.preventDefault();
                                                                                                handleAddCustomAmenity(category.key);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <button type="button" onClick={() => handleAddCustomAmenity(category.key)} className="bg-primary text-white p-1 rounded-lg hover:bg-primary/90 transition-colors shrink-0" title="Add Amenity"
                                                                                    >
                                                                                        <Plus className="w-3.5 h-3.5" />
                                                                                    </button>
                                                                                    <button type="button" onClick={() => {
                                                                                        setActiveAddCategory(null);
                                                                                        setNewAmenityText("");
                                                                                    }}
                                                                                        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg shrink-0" title="Cancel"
                                                                                    >
                                                                                        <X className="w-3.5 h-3.5" />
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <button type="button" onClick={() => {
                                                                                    setActiveAddCategory(category.key);
                                                                                    setNewAmenityText("");
                                                                                }}
                                                                                    className="text-primary hover:text-primary/85 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline mt-1"
                                                                                >
                                                                                    <Plus className="w-3.5 h-3.5" />
                                                                                    <span>Add dynamic amenity</span>
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* STEP 3: MEDIA UPLOAD MODULE */}
                                            {wizardStep === 3 && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="space-y-6"
                                                    id="section-3"
                                                >
                                                    <div className="border-b border-surface-variant/40 pb-4">
                                                        <h2 className="text-xl font-bold text-on-surface">Property Visuals</h2>
                                                        <p className="text-sm text-on-surface-variant mt-1">
                                                            High-quality photos increase your booking rate by up to 60%. <span className="text-rose-500 font-semibold">• At least one photo is strictly required.</span>
                                                        </p>
                                                    </div>

                                                    <div
                                                        onClick={addSampleImage}
                                                        className="border-2 border-dashed border-primary/30 rounded-2xl p-8 flex flex-col items-center text-center bg-surface transition-all hover:bg-primary-fixed/30 cursor-pointer group select-none"
                                                    >
                                                        <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                            <UploadCloud className="w-8 h-8 text-primary" />
                                                        </div>
                                                        <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2 justify-center">
                                                            <span>Drag and drop photos here</span>
                                                            <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-extrabold uppercase tracking-widest">Required</span>
                                                        </h3>
                                                        <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed mb-4">
                                                            Upload up to 10 high-resolution images. JPEG, PNG supported. Click the zone to safely pre-populate the **Luxury Living Room** sample.
                                                        </p>
                                                        <button
                                                            type="button"
                                                            className="px-5 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:bg-primary-container shadow-sm transition"
                                                        >
                                                            Add Showcase Render
                                                        </button>
                                                    </div>

                                                    {/* Selected Images List */}
                                                    <div>
                                                        <h3 className="text-xs font-semibold text-on-surface uppercase tracking-wider mb-3">Loaded Showcase Gallery ({wizardData.images.length})</h3>

                                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                            {wizardData.images.length === 0 ? (
                                                                <div className="col-span-full border border-dashed border-slate-200 p-8 rounded-xl text-center text-xs text-slate-400">
                                                                    No selected photos yet. Click above to inject a professional sample representation of MySewa KL.
                                                                </div>
                                                            ) : (
                                                                wizardData.images.map((img, idx) => (
                                                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-outline-variant group">
                                                                        <img src={img} alt="Render item" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                                                                        {idx === 0 && (
                                                                            <span className="absolute bottom-2 left-2 text-[9px] bg-slate-900/80 text-white px-2 py-0.5 rounded font-medium">Cover Hero</span>
                                                                        )}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => { e.stopPropagation(); removeWizardImage(idx); }}
                                                                            className="absolute top-2 right-2 bg-error text-on-error hover:bg-red-700 p-1 rounded-full shadow transition"
                                                                            title="Remove photo"
                                                                        >
                                                                            <X className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* STEP 4: REVIEW */}
                                            {wizardStep === 4 && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="space-y-6"
                                                    id="section-4"
                                                >
                                                    <div className="border-b border-surface-variant/40 pb-4">
                                                        <h2 className="text-xl font-bold text-on-surface">Review Your Listing</h2>
                                                        <p className="text-sm text-on-surface-variant mt-1">Double check details before launching public access.</p>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {/* Card 1: Basic Info overview */}
                                                        <div className="flex justify-between items-center p-4 bg-surface rounded-xl border border-surface-variant/70">
                                                            <div>
                                                                <p className="text-[10px] text-outline font-semibold uppercase tracking-wider">Basic Info</p>
                                                                <p className="font-bold text-slate-800 text-sm mt-0.5">{wizardData.title || "No Title Provided Yet"}</p>
                                                                <p className="text-xs text-on-surface-variant">{wizardData.type} — {wizardData.location || "No Address set"}</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => setWizardStep(1)}
                                                                className="text-xs text-primary font-semibold hover:underline"
                                                            >
                                                                Edit
                                                            </button>
                                                        </div>

                                                        {/* Card 2: Financials Info overview */}
                                                        <div className="flex justify-between items-center p-4 bg-surface rounded-xl border border-surface-variant/70">
                                                            <div>
                                                                <p className="text-[10px] text-outline font-semibold uppercase tracking-wider">Financial specifications</p>
                                                                <p className="font-bold text-slate-800 text-sm mt-0.5">RM {wizardData.rent} / month</p>
                                                                <p className="text-xs text-on-surface-variant">Deposit: Sec RM {wizardData.securityDeposit} | Util RM {wizardData.utilityDeposit}</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => setWizardStep(2)}
                                                                className="text-xs text-primary font-semibold hover:underline"
                                                            >
                                                                Edit
                                                            </button>
                                                        </div>

                                                        {/* Pro-tip helper */}
                                                        <div className="p-4 bg-tertiary-fixed/30 rounded-xl flex gap-3 border border-tertiary-fixed/60">
                                                            <Sparkles className="w-5 h-5 text-tertiary shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="text-xs font-bold text-tertiary">Pro-Tip for Kuala Lumpur Landlords</p>
                                                                <p className="text-xs text-on-tertiary-container mt-1">
                                                                    Listings with "Wi-Fi" and "Air Conditioning" active indicators statistically lease 40% quicker to tech professionals inside Bangsar and KLCC districts.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Aggrement terms */}
                                                        <div className="flex items-start gap-2.5 pt-4">
                                                            <input
                                                                id="terms-ch"
                                                                type="checkbox"
                                                                checked={wizardData.agreedToTerms}
                                                                onChange={e => setWizardData({ ...wizardData, agreedToTerms: e.target.checked })}
                                                                className="rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 mt-0.5 w-5 h-5"
                                                            />
                                                            <label htmlFor="terms-ch" className="text-xs text-on-surface-variant cursor-pointer select-none leading-relaxed">
                                                                I verify that all specified specifications are correct. I agree to MySewa's{" "}
                                                                <span className="text-primary hover:underline font-semibold">Listing Terms &amp; Fair Housing Guidelines</span> as a certified portal landlord.
                                                            </label>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Navigation Action Buttons footer */}
                                            <div className="flex items-center justify-between pt-6 border-t border-outline-variant mt-8">
                                                <button
                                                    type="button"
                                                    onClick={handlePrevStep}
                                                    disabled={wizardStep === 1}
                                                    className="px-5 py-2.5 border border-primary text-primary font-semibold text-xs rounded-xl hover:bg-primary/5 disabled:opacity-30 disabled:pointer-events-none transition"
                                                    id="prev-btn"
                                                >
                                                    Previous
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={handleNextStep}
                                                    className="px-6 py-2.5 bg-primary text-on-primary font-semibold text-xs rounded-xl hover:bg-primary-container shadow transition text-center"
                                                    id="next-btn"
                                                >
                                                    {wizardStep === 4 ? "Publish Listing" : "Next Step"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 2: PROPERTIES MANAGEMENT */}
                    {activeTab === "properties" && (
                        <motion.div
                            key="properties"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your Registered Properties</h1>
                                    <p className="text-sm text-slate-500 mt-1">Manage, verify, or update your real estate items.</p>
                                </div>

                                {/* Search Bar & Filter Selector */}
                                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                    <div className="relative flex-1 md:flex-none">
                                        <input
                                            type="text"
                                            placeholder="Search title, address..."
                                            value={propertySearch}
                                            onChange={e => setPropertySearch(e.target.value)}
                                            className="w-full md:w-60 bg-white border border-outline-variant rounded-xl py-2 px-3 pl-9 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
                                        />
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                                    </div>

                                    <select
                                        value={propertyFilterType}
                                        onChange={e => setPropertyFilterType(e.target.value)}
                                        className="bg-white border border-outline-variant rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-slate-800 font-medium"
                                    >
                                        <option value="All">All Types</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Landed (House/Villa)">Landed (House/Villa)</option>
                                        <option value="Room / Shared">Room / Shared</option>
                                        <option value="Studio">Studio</option>
                                    </select>
                                </div>
                            </div>

                            {/* Grid representation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {properties
                                    .filter(p => {
                                        const matchesSearch = p.title.toLowerCase().includes(propertySearch.toLowerCase()) || p.location.toLowerCase().includes(propertySearch.toLowerCase());
                                        const matchesType = propertyFilterType === "All" || p.type === propertyFilterType;
                                        return matchesSearch && matchesType;
                                    })
                                    .map(prop => (
                                        <div
                                            key={prop.id}
                                            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition duration-300 flex flex-col group justify-between"
                                        >
                                            {/* Cover Photo */}
                                            <div className="relative h-48 overflow-hidden bg-slate-100">
                                                <img
                                                    src={prop.images[0]}
                                                    alt={prop.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                />
                                                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm text-white ${prop.status === "Verified" ? "bg-primary" : "bg-amber-600 animate-pulse"
                                                    }`}>
                                                    {prop.status}
                                                </span>

                                                <div className="absolute top-3 right-3 flex gap-2">
                                                    <button
                                                        onClick={() => handleDeleteProperty(prop.id, prop.title)}
                                                        className="bg-white/95 text-rose-600 hover:bg-rose-600 hover:text-white p-2 rounded-xl transition shadow"
                                                        title="De-list property"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Info Panel */}
                                            <div className="p-5 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">{prop.type}</div>
                                                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-primary transition line-clamp-1">{prop.title}</h3>

                                                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        <span className="line-clamp-1">{prop.location}</span>
                                                    </div>

                                                    {/* Dimensions & facilities */}
                                                    <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 mt-3 text-slate-600">
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <BedDouble className="w-3.5 h-3.5 text-primary" />
                                                            <span className="font-medium text-[11px]">{prop.bedrooms} BHK</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <Bath className="w-3.5 h-3.5 text-primary" />
                                                            <span className="font-medium text-[11px]">{prop.bathrooms} Bath</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <Maximize2 className="w-3.5 h-3.5 text-primary" />
                                                            <span className="font-medium text-[11px]">{prop.size} sqft</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Monthly Rent</span>
                                                        <span className="text-base font-bold text-slate-800">RM {prop.rent}</span>
                                                    </div>

                                                    <button
                                                        onClick={() => setSelectedPropertyDetail(prop)}
                                                        className="text-xs text-primary bg-primary-fixed hover:bg-primary hover:text-white px-3.5 py-1.5 rounded-xl transition font-semibold"
                                                    >
                                                        Inspection Log
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                {properties.length === 0 && (
                                    <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200">
                                        <p className="text-xs text-slate-400">No properties matched search criteria or are loaded in localStorage.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 3: ACTIVE LEASES */}
                    {activeTab === "leases" && (
                        <motion.div
                            key="leases"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lease Agreements</h1>
                                    <p className="text-sm text-slate-500 mt-1">Review active tenant legal contracts and sign credentials.</p>
                                </div>

                                <button
                                    onClick={() => setIsAddLeaseOpen(true)}
                                    className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Draft New Contract</span>
                                </button>
                            </div>

                            {/* Grid representation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {leases.map(lease => (
                                    <div key={lease.id} className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
                                        <div className="flex justify-between items-start border-b pb-3 border-slate-100">
                                            <div>
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full select-none ${lease.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800 animate-pulse"
                                                    }`}>
                                                    {lease.status}
                                                </span>
                                                <h3 className="font-bold text-slate-800 text-sm mt-2">{lease.propertyName}</h3>
                                            </div>
                                            <span className="text-xs text-slate-400 font-semibold">{lease.id}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <span className="text-slate-400 uppercase tracking-widest text-[9px] block">Tenant name</span>
                                                <span className="font-bold text-slate-800 text-[13px]">{lease.tenantName}</span>
                                                <span className="text-slate-500 block text-[11px]">{lease.tenantEmail}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 uppercase tracking-widest text-[9px] block">Rent &amp; Billing</span>
                                                <span className="font-bold text-slate-800 text-[13px]">RM {lease.monthlyRent} / mo</span>
                                                <span className="text-[11px] text-slate-500 block">Deposit: {lease.depositPaid ? "Paid ✓" : "Pending Signature"}</span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-2 text-xs">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span className="text-slate-600 font-medium text-[11px]">Duration: {lease.startDate} to {lease.endDate}</span>
                                        </div>

                                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 justify-end">
                                            <button
                                                onClick={() => showToast(`Lease document ${lease.id} exported successfully.`, "info")}
                                                className="text-[11px] text-slate-600 border px-3 py-1.5 rounded-lg hover:bg-slate-50 font-semibold"
                                            >
                                                Print PDF Contract
                                            </button>
                                            <button
                                                onClick={() => showToast(`Synchronizing legal records for ${lease.tenantName}`, "success")}
                                                className="text-[11px] bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-container font-semibold"
                                            >
                                                Synchronize legal record
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 4: PAYMENTS HISTORIC LOG & FINANCIALS */}
                    {activeTab === "payments" && (
                        <motion.div
                            key="payments"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="space-y-6"
                        >
                            {/* Financial KPI panels */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold">RM</div>
                                    <div>
                                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Total Rent Processed</span>
                                        <span className="text-xl font-extrabold text-slate-800">RM {totalCollectedAllTime}</span>
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary-fixed text-primary rounded-full flex items-center justify-center font-bold">RM</div>
                                    <div>
                                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Estimated Annual Valuation</span>
                                        <span className="text-xl font-extrabold text-slate-800">RM {calculatedRentalIncome * 12}</span>
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold">✓</div>
                                    <div>
                                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Processed Transaction count</span>
                                        <span className="text-xl font-extrabold text-slate-800">{payments.length} Settlements</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                                <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">Rent Settled &amp; Transactions</h2>
                                        <p className="text-xs text-slate-500 mt-0.5">Every financial record validated automatically by MySewa.</p>
                                    </div>

                                    <button
                                        onClick={() => setIsAddPaymentOpen(true)}
                                        className="bg-primary text-white text-xs px-4 py-2 rounded-xl font-semibold hover:bg-primary-container flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Log Cash Receipt</span>
                                    </button>
                                </div>

                                {/* Table structure */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs leading-relaxed text-slate-600">
                                        <thead>
                                            <tr className="border-b uppercase text-[10px] text-slate-400 bg-slate-50">
                                                <th className="py-2.5 px-4 font-semibold">Reference</th>
                                                <th className="py-2.5 px-4 font-semibold">Property</th>
                                                <th className="py-2.5 px-4 font-semibold">Tenant</th>
                                                <th className="py-2.5 px-4 font-semibold">Type</th>
                                                <th className="py-2.5 px-4 font-semibold">Date Settled</th>
                                                <th className="py-2.5 px-4 font-semibold text-right">Settlement Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {payments.map(pay => (
                                                <tr key={pay.id} className="hover:bg-slate-50 transition">
                                                    <td className="py-3 px-4 font-mono font-medium text-slate-800">{pay.referenceNo}</td>
                                                    <td className="py-3 px-4 font-medium text-slate-800">{pay.propertyName}</td>
                                                    <td className="py-3 px-4 text-slate-500">{pay.tenantName}</td>
                                                    <td className="py-3 px-4">
                                                        <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                                                            {pay.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-400">{pay.date}</td>
                                                    <td className="py-3 px-4 text-right font-extrabold text-emerald-700">+ RM {pay.amount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 5: LANDLORD OVERVIEW / DASHBOARD */}
                    {activeTab === "dashboard" && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="space-y-6"
                        >
                            {/* Landlord Welcome banner */}
                            <div className="bg-primary text-on-primary p-6 md:p-8 rounded-2xl shadow-md border-b-4 border-primary-container relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="space-y-1 relative z-10">
                                    <h1 className="text-2xl font-bold tracking-tight">Kuala Lumpur Portal Active</h1>
                                    <p className="text-sm text-on-primary-container leading-relaxed max-w-xl">
                                        Welcome back, Ding Ziling! MySewa has successfully parsed all automatic deposit entries on your properties. Verify new lease workflows below.
                                    </p>
                                </div>

                                <button
                                    onClick={() => { setActiveTab("add-property"); setWizardStep(1); }}
                                    className="bg-white text-primary text-xs font-bold px-4 py-2.5 rounded-xl border border-white hover:bg-slate-50 transition shrink-0 flex items-center gap-1 shadow-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>List new Property</span>
                                </button>
                            </div>

                            {/* State count indicators row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Properties</span>
                                    <span className="text-2xl font-extrabold text-slate-800">{properties.length} Units</span>
                                    <div className="text-[10px] text-primary font-semibold">All listed in Kuala Lumpur</div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Monthly Cashflow</span>
                                    <span className="text-2xl font-extrabold text-slate-800">RM {calculatedRentalIncome}</span>
                                    <div className="text-[10px] text-emerald-600 font-semibold">{activeLeaseCount} active contracts</div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Collected</span>
                                    <span className="text-2xl font-extrabold text-slate-800">RM {totalCollectedAllTime}</span>
                                    <div className="text-[10px] text-slate-400 font-semibold">{payments.length} receipt settlements</div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pending Action</span>
                                    <span className="text-2xl font-extrabold text-amber-600 animate-pulse">{pendingLeaseCount} Signature</span>
                                    <div className="text-[10px] text-amber-600 font-semibold">Attention required</div>
                                </div>
                            </div>

                            {/* Lower split pane */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                {/* Visual properties status quick table */}
                                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                                    <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                                        <h3 className="text-sm font-semibold text-slate-900">Your Current Listings Portfolio</h3>
                                        <button onClick={() => setActiveTab("properties")} className="text-xs text-primary hover:underline">
                                            See all properties
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {properties.slice(0, 3).map(p => (
                                            <div key={p.id} className="flex items-center justify-between p-3.5 bg-slate-50/75 hover:bg-slate-50 rounded-xl transition border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <img src={p.images[0]} alt={p.title} className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                                                    <div>
                                                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">{p.type}</span>
                                                        <span className="font-bold text-slate-800 text-xs mt-0.5 line-clamp-1">{p.title}</span>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <span className="text-xs font-extrabold text-slate-800 block">RM {p.rent}</span>
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p.status === "Verified" ? "bg-primary-fixed text-primary" : "bg-amber-100 text-amber-700"
                                                        }`}>
                                                        {p.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Dashboard helper center panel */}
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                                            <Sparkles className="w-5 h-5 text-primary" />
                                            <span>Property Insights</span>
                                        </h3>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            MySewa's property engine analyzes similar apartment rentals daily. Tap into the listing wizard to publish high-conversion listings.
                                        </p>
                                    </div>

                                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-semibold text-primary">KLCC Market demand</span>
                                            <span className="text-xs font-bold text-primary">9.4/10 High</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full w-[94%]" />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => { setActiveTab("add-property"); setWizardStep(1); }}
                                        className="w-full bg-primary text-white text-xs font-bold py-2.5 rounded-xl hover:bg-primary-container shadow duration-200"
                                    >
                                        Draft New Rental Entry
                                    </button>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* DETAIL MODAL DRAWER OVERLAY */}
            <AnimatePresence>
                {selectedPropertyDetail && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 15 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 15 }}
                            className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col"
                        >
                            {/* Image banner */}
                            <div className="relative h-60 bg-slate-100">
                                <img src={selectedPropertyDetail.images[0]} alt={selectedPropertyDetail.title} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => setSelectedPropertyDetail(null)}
                                    className="absolute top-4 right-4 bg-slate-900/80 text-white hover:bg-slate-900 p-2 rounded-full shadow"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <span className="absolute bottom-4 left-4 text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-full shadow-sm">
                                    {selectedPropertyDetail.type} — {selectedPropertyDetail.status}
                                </span>
                            </div>

                            {/* Scrollable details container */}
                            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-6 flex-1 text-xs">
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-800">{selectedPropertyDetail.title}</h2>
                                    <div className="flex items-center gap-1 text-slate-500 mt-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{selectedPropertyDetail.location}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 border-y border-slate-100 py-4 text-center">
                                    <div>
                                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Bedrooms</span>
                                        <span className="font-extrabold text-slate-800 text-sm mt-0.5">{selectedPropertyDetail.bedrooms} BHK</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Bathrooms</span>
                                        <span className="font-extrabold text-slate-800 text-sm mt-0.5">{selectedPropertyDetail.bathrooms} Baths</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Size Dimension</span>
                                        <span className="font-extrabold text-slate-800 text-sm mt-0.5">{selectedPropertyDetail.size} Sqft</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Monthly rent</span>
                                        <span className="font-extrabold text-slate-800 text-base mt-1">RM {selectedPropertyDetail.rent}</span>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <span className="text-[10px] text-slate-400 block uppercase font-semibold font-semibold">Security/Utility Deposit</span>
                                        <span className="font-extrabold text-slate-800 text-sm mt-1">RM {selectedPropertyDetail.securityDeposit} + RM {selectedPropertyDetail.utilityDeposit}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-bold text-slate-800 text-sm">Description</h3>
                                    <p className="text-slate-600 leading-relaxed text-xs">{selectedPropertyDetail.description}</p>
                                </div>

                                {/* Amenities Block grouped premium style */}
                                <div className="space-y-4 pt-2 border-t border-slate-100">
                                    <h3 className="font-extrabold text-slate-800 text-sm">What this place offers</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {AMENITY_CATEGORIES.map(cat => {
                                            const assignedItems = selectedPropertyDetail.amenities[cat.key] || [];
                                            if (assignedItems.length === 0) return null;

                                            return (
                                                <div key={cat.key} className="space-y-2 p-3.5 rounded-xl bg-slate-50/60 border border-slate-100/80">
                                                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider">{cat.title}</h4>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {assignedItems.map((item, idx) => (
                                                            <span key={idx} className="bg-white text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200/60 flex items-center gap-1.5 shadow-xs">
                                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                                                                <span>{item}</span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Action bar inside drawer */}
                            <div className="p-4 bg-slate-50 border-t flex justify-end gap-2">
                                <button
                                    onClick={() => setSelectedPropertyDetail(null)}
                                    className="px-4 py-2 border rounded-xl hover:bg-slate-100 font-semibold text-xs"
                                >
                                    Close Inspection
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedPropertyDetail(null);
                                        setWizardData({
                                            title: selectedPropertyDetail.title,
                                            description: selectedPropertyDetail.description,
                                            type: selectedPropertyDetail.type,
                                            location: selectedPropertyDetail.location,
                                            rent: String(selectedPropertyDetail.rent),
                                            bedrooms: String(selectedPropertyDetail.bedrooms),
                                            bathrooms: String(selectedPropertyDetail.bathrooms),
                                            size: String(selectedPropertyDetail.size),
                                            securityDeposit: String(selectedPropertyDetail.securityDeposit),
                                            utilityDeposit: String(selectedPropertyDetail.utilityDeposit),
                                            amenities: selectedPropertyDetail.amenities,
                                            images: selectedPropertyDetail.images,
                                            agreedToTerms: true
                                        });
                                        setActiveTab("add-property");
                                        setWizardStep(1);
                                        showToast("Loaded property specifications for modification.");
                                    }}
                                    className="px-5 py-2 bg-primary text-white text-xs rounded-xl hover:bg-primary-container font-semibold"
                                >
                                    Edit Specifications
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DRAFT LEASE Agreement WORKFLOW popup */}
            <AnimatePresence>
                {isAddLeaseOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 15 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 15 }}
                            className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-6 relative"
                        >
                            <button
                                onClick={() => setIsAddLeaseOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-lg font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
                                <FileText className="w-5 h-5 text-primary" />
                                <span>Draft legal Lease agreement</span>
                            </h2>
                            <p className="text-xs text-slate-500 leading-normal mb-4">Attach a registered property asset to draft tenant parameters legal agreements:</p>

                            <form onSubmit={handleCreateLease} className="space-y-4 text-xs">
                                <div>
                                    <label className="block text-slate-600 font-semibold mb-1">Select Property Asset Unit</label>
                                    <select
                                        value={leaseDraft.propertyId}
                                        onChange={e => setLeaseDraft({ ...leaseDraft, propertyId: e.target.value })}
                                        className="w-full bg-slate-50 border rounded-xl p-3 outline-none"
                                        required
                                    >
                                        <option value="">-- Choose asset --</option>
                                        {properties.map(p => (
                                            <option key={p.id} value={p.id}>{p.title} (RM {p.rent}/mo)</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-600 font-semibold mb-1">Tenant Legal Fullname</label>
                                    <input
                                        type="text"
                                        value={leaseDraft.tenantName}
                                        onChange={e => setLeaseDraft({ ...leaseDraft, tenantName: e.target.value })}
                                        className="w-full bg-slate-50 border rounded-xl p-3 outline-none"
                                        placeholder="e.g. Nadia binti Ahmad"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-slate-600 font-semibold mb-1">Tenant Email</label>
                                        <input
                                            type="email"
                                            value={leaseDraft.tenantEmail}
                                            onChange={e => setLeaseDraft({ ...leaseDraft, tenantEmail: e.target.value })}
                                            className="w-full bg-slate-50 border rounded-xl p-3 outline-none"
                                            placeholder="e.g. nadia@gmail.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-600 font-semibold mb-1">Tenant Contact Phone</label>
                                        <input
                                            type="text"
                                            value={leaseDraft.tenantPhone}
                                            onChange={e => setLeaseDraft({ ...leaseDraft, tenantPhone: e.target.value })}
                                            className="w-full bg-slate-50 border rounded-xl p-3 outline-none"
                                            placeholder="+60 12-345 6789"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-slate-600 font-semibold mb-1">Agreement Start Date</label>
                                        <input
                                            type="date"
                                            value={leaseDraft.startDate}
                                            onChange={e => setLeaseDraft({ ...leaseDraft, startDate: e.target.value })}
                                            className="w-full bg-slate-50 border rounded-xl p-3 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-600 font-semibold mb-1">Agreement End Date</label>
                                        <input
                                            type="date"
                                            value={leaseDraft.endDate}
                                            onChange={e => setLeaseDraft({ ...leaseDraft, endDate: e.target.value })}
                                            className="w-full bg-slate-50 border rounded-xl p-3 outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-xl font-bold text-xs shadow mt-2 transition"
                                >
                                    Confirm &amp; Issue Agreement via Email
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LOG manual offline PAYMENT popup */}
            <AnimatePresence>
                {isAddPaymentOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 15 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 15 }}
                            className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl p-6 relative"
                        >
                            <button
                                onClick={() => setIsAddPaymentOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-lg font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
                                <DollarSign className="w-5 h-5 text-primary" />
                                <span>Log Manual Cash Transaction</span>
                            </h2>
                            <p className="text-xs text-slate-500 leading-normal mb-4">Register a payment settled offline by tenant: </p>

                            <form onSubmit={handleLogPayment} className="space-y-4 text-xs">
                                <div>
                                    <label className="block text-slate-600 font-semibold mb-1">Physical Asset Name</label>
                                    <input
                                        type="text"
                                        value={paymentDraft.propertyName}
                                        onChange={e => setPaymentDraft({ ...paymentDraft, propertyName: e.target.value })}
                                        className="w-full bg-slate-50 border rounded-xl p-3 outline-none"
                                        placeholder="e.g. Premium Cosy Studio in Bangsar South"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-600 font-semibold mb-1">Tenant Fullname</label>
                                    <input
                                        type="text"
                                        value={paymentDraft.tenantName}
                                        onChange={e => setPaymentDraft({ ...paymentDraft, tenantName: e.target.value })}
                                        className="w-full bg-slate-50 border rounded-xl p-3 outline-none"
                                        placeholder="e.g. Kevin Tan"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-slate-600 font-semibold mb-1">Settlement Amount (RM)</label>
                                        <input
                                            type="number"
                                            value={paymentDraft.amount}
                                            onChange={e => setPaymentDraft({ ...paymentDraft, amount: e.target.value })}
                                            className="w-full bg-slate-50 border rounded-xl p-3 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-600 font-semibold mb-1">Transaction Category</label>
                                        <select
                                            value={paymentDraft.type}
                                            onChange={e => setPaymentDraft({ ...paymentDraft, type: e.target.value as any })}
                                            className="w-full bg-slate-50 border rounded-xl p-3 outline-none"
                                        >
                                            <option value="Rent">Rent Payment</option>
                                            <option value="Security Deposit">Security Deposit</option>
                                            <option value="Utility Deposit">Utility Deposit</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-xl font-bold text-xs shadow mt-2 transition"
                                >
                                    Verify Payment Cash Entry
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer onNavigate={() => { }} />
        </div>
    );
}
