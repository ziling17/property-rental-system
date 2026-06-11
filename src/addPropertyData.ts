/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { INITIAL_PROPERTIES, INITIAL_LEASES, INITIAL_PAYMENTS, INITIAL_NOTIFICATIONS } from "./AddPropertyData";

export const INITIAL_PROPERTIES: Property[] = [
    {
        id: "prop-1",
        title: "Modern Luxury Apartment near KLCC",
        description: "Stunning high-floor luxury apartment located in the heart of Kuala Lumpur. Features panoramic city skyline views, bespoke Italian designer furniture, fully integrated smart home automation system, and premium built-in appliances. Just a 5-minute walk to Suria KLCC, LRT station, and pristine urban parks.",
        type: "Apartment",
        location: "Jalan Ampang, Kuala Lumpur, 50450",
        rent: 2500,
        bedrooms: 3,
        bathrooms: 2,
        size: 1200,
        securityDeposit: 5000,
        utilityDeposit: 1250,
        amenities: {
            bathroom: ["Hair dryer", "Bidet"],
            bedroomAndLaundry: ["Washer", "Iron"],
            entertainment: ["TV", "Exercise equipment"],
            heatingAndCooling: ["Air conditioning", "Heating"],
            homeSafety: ["Smoke alarm", "Carbon monoxide alarm", "Fire extinguisher"],
            internetAndOffice: ["Wifi", "Dedicated workspace"],
            kitchenAndDining: ["Kitchen", "Refrigerator", "Cooking basics", "Dishes and silverware", "Freezer", "Dishwasher", "Hot water kettle"],
            outdoor: ["Sun loungers"],
            parkingAndFacilities: ["Pool"],
            services: ["Host greets you"]
        },
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuUn4SYXTabKsid0B8SWiBTmGPUNJEEuydnOZZlHWJj-NlyQzxMWON6YCr24OyB_ANMWgSb2okK-UkBaFBhaMcYH8uzkcV3riok884ZsDeXASCo_dSidu41JMDox4V1a81DoGuQ1K67XzzXUY_2gijda8_R3_6Nq-Y_9KVYeapZf1xtWwH-t009Vz7M49R6uVh8TwAcuxAAPaSJH-U0IM_HrjCkdRYwoqKXTyiGTmu20QTxW3PKq7yxsqHc96tYNoLWWCWPdCN1M9Q"
        ],
        status: "Verified",
        createdAt: "2026-04-01"
    },
    {
        id: "prop-2",
        title: "Premium Cosy Studio in Bangsar South",
        description: "Charming fully-furnished studio apartment, perfect for young working professionals. Strategically located inside Bangsar South tech enclave. Equipped with super high-speed fiber internet, private laundry area, direct pedestrian bridge link to Kerinchi LRT, and surrounded by 30+ dining choices and grocery markets.",
        type: "Studio",
        location: "Bangsar South, Kuala Lumpur, 59200",
        rent: 1800,
        bedrooms: 1,
        bathrooms: 1,
        size: 550,
        securityDeposit: 3600,
        utilityDeposit: 900,
        amenities: {
            bathroom: ["Hair dryer"],
            bedroomAndLaundry: ["Washer"],
            entertainment: ["TV"],
            heatingAndCooling: ["Air conditioning"],
            homeSafety: ["Smoke alarm"],
            internetAndOffice: ["Wifi", "Dedicated workspace"],
            kitchenAndDining: ["Kitchen", "Refrigerator", "Cooking basics", "Dishes and silverware", "Hot water kettle"],
            outdoor: [],
            parkingAndFacilities: ["Pool"],
            services: []
        },
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
        ],
        status: "Verified",
        createdAt: "2026-05-15"
    },
    {
        id: "prop-3",
        title: "Rustic Double-Storey Villa in Damansara",
        description: "Elegant landed double-storey home featuring a private landscaped garden, modern open-concept kitchen layout, spacious cozy bedrooms, and high ceilings. Nestled inside a highly pristine, peaceful, gated and guarded neighborhood in Damansara Heights.",
        type: "Landed (House/Villa)",
        location: "Damansara Heights, Kuala Lumpur, 50490",
        rent: 4200,
        bedrooms: 4,
        bathrooms: 4,
        size: 2800,
        securityDeposit: 8400,
        utilityDeposit: 2100,
        amenities: {
            bathroom: ["Hair dryer", "Bidet"],
            bedroomAndLaundry: ["Washer", "Iron"],
            entertainment: ["TV", "Books and reading material"],
            heatingAndCooling: ["Air conditioning", "Heating"],
            homeSafety: ["Smoke alarm", "Carbon monoxide alarm", "Fire extinguisher", "First aid kit"],
            internetAndOffice: ["Wifi", "Dedicated workspace"],
            kitchenAndDining: ["Kitchen", "Refrigerator", "Cooking basics", "Dishes and silverware", "Freezer", "Dishwasher", "Hot water kettle", "Wine glasses", "Rice maker"],
            outdoor: ["Sun loungers"],
            parkingAndFacilities: ["Pool", "Paid parking on premises"],
            services: ["Host greets you"]
        },
        images: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
        ],
        status: "Verified",
        createdAt: "2026-03-20"
    }
];

export const INITIAL_LEASES: Lease[] = [
    {
        id: "lease-1",
        propertyId: "prop-1",
        propertyName: "Modern Luxury Apartment near KLCC",
        tenantName: "Nadia binti Ahmad",
        tenantPhone: "+60 12-345 6789",
        tenantEmail: "nadia.ahmad@gmail.com",
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        monthlyRent: 2500,
        depositPaid: true,
        status: "Active"
    },
    {
        id: "lease-2",
        propertyId: "prop-2",
        propertyName: "Premium Cosy Studio in Bangsar South",
        tenantName: "Kevin Tan",
        tenantPhone: "+60 17-654 3210",
        tenantEmail: "kevin.tan99@hotmail.com",
        startDate: "2026-06-01",
        endDate: "2027-05-31",
        monthlyRent: 1800,
        depositPaid: true,
        status: "Active"
    },
    {
        id: "lease-3",
        propertyId: "prop-3",
        propertyName: "Rustic Double-Storey Villa in Damansara",
        tenantName: "Michael Rogers",
        tenantPhone: "+60 11-2233 4455",
        tenantEmail: "m.rogers@techcorp.uk",
        startDate: "2026-07-15",
        endDate: "2027-07-14",
        monthlyRent: 4200,
        depositPaid: false,
        status: "Pending Signature"
    }
];

export const INITIAL_PAYMENTS: Payment[] = [
    {
        id: "pay-101",
        propertyName: "Modern Luxury Apartment near KLCC",
        tenantName: "Nadia binti Ahmad",
        amount: 2500,
        type: "Rent",
        status: "Paid",
        date: "2026-06-01",
        referenceNo: "TXN882093122"
    },
    {
        id: "pay-102",
        propertyName: "Premium Cosy Studio in Bangsar South",
        tenantName: "Kevin Tan",
        amount: 1800,
        type: "Rent",
        status: "Paid",
        date: "2026-06-01",
        referenceNo: "TXN774109283"
    },
    {
        id: "pay-103",
        propertyName: "Premium Cosy Studio in Bangsar South",
        tenantName: "Kevin Tan",
        amount: 3600,
        type: "Security Deposit",
        status: "Paid",
        date: "2026-05-28",
        referenceNo: "TXN774109100"
    },
    {
        id: "pay-104",
        propertyName: "Premium Cosy Studio in Bangsar South",
        tenantName: "Kevin Tan",
        amount: 900,
        type: "Utility Deposit",
        status: "Paid",
        date: "2026-05-28",
        referenceNo: "TXN774109101"
    },
    {
        id: "pay-105",
        propertyName: "Modern Luxury Apartment near KLCC",
        tenantName: "Nadia binti Ahmad",
        amount: 2500,
        type: "Rent",
        status: "Paid",
        date: "2026-05-01",
        referenceNo: "TXN881295711"
    },
    {
        id: "pay-106",
        propertyName: "Rustic Double-Storey Villa in Damansara",
        tenantName: "Michael Rogers",
        amount: 8400,
        type: "Security Deposit",
        status: "Pending",
        date: "2026-06-15",
        referenceNo: "TXN-PENDING-01"
    }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: "notif-1",
        title: "New Lease Form Created",
        message: "A draft lease has been generated for Michael Rogers on rustic villa.",
        time: "2 hours ago",
        unread: true,
        category: "booking"
    },
    {
        id: "notif-2",
        title: "Rent Payment Received",
        message: "Nadia binti Ahmad paid RM 2,500 rent for June 2026 successfully.",
        time: "Yesterday",
        unread: false,
        category: "payment"
    },
    {
        id: "notif-3",
        title: "Listing Verification Completed",
        message: "Your listing for Modern Luxury Apartment has been manually verified.",
        time: "3 days ago",
        unread: false,
        category: "verification"
    }
];
