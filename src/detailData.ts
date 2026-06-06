import { DetailProperty } from './types';
export const DETAIL_PROPERTIES: DetailProperty[] = [
    {
        id: "skyline-penthouse",
        name: "The Skyline Penthouse",
        location: "Bangsar Heights, Kuala Lumpur, 59100",
        verified: true,
        monthlyRent: 12500,
        bedrooms: "3 BHK",
        size: "2,450 sqft",
        deposit: 35000,
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCYHJU58UwYlFgWnUc8Ez2sV3_TOqEiG_ZiNPtzAXHQe9j4s25f6SFtXT3122lKsY21xSrR_XsjKjnzZlX7gYycqrwEGCuR6vhCDcXvg_WuVEzvZ3s32_2qrm0Ul7AIeKuqEBTwbHRRvu0koP8azwyaKO5jCVhnvPZDQfnG8II6SadlyJlEWJnH15Ml_M3dX2MVps5pFoisB3HlEjlFmNLODNO41dmBJHUQw3lNgW_67oRgM2A4fd4szeRGgNOFij-APbBmAnOObAQ",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ0ql9n7hoJniuZ7K-RB3c9CV1u9Zg08xH7I_I1AVZx5-twJ08HoSKUvLHTGNbjzCw9hBiQvN-oiVKRlT8Mc9b7LqHsR5HcMNhXioK1VZVeIu5_URrveydlAANttEbtRZeDk-ylOQ6JXdMyhSnyxTcxczDabCUDgaKa1PctpDwxeekbitRn1d4LaEm1ZL5-u2RcaqO046SchMWWZoXHuoYuLwJ8oCL7V2vRgIfd6MiAWn5JRN322NOj6Q0ZiJy8DN3O7ErtX94m2E",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuC2iIgqP9YAFyVTBQIQYBpTUVgqG-TtRFca2f8PA1I3r3iw8CPdwlpwdx2IvTGNOlfEitlDYmZa0X1B0RsoRUCJZVY0pnKcq0QwvIcaHynwoYquV1UcucqMmy9BSEZU2ND6f6zD07XP--bfPp4LwV4Yo-c9M79fR7fzDbXSw57I4LhKypBY6C6K8R5IVsmuP_QNF8voJJY27vrR2mP_WJd9me5ZDsB8hhWBVEE9HEFxUXv_ygUEDNbtyI7IdmOoiqse0LDkscecZwA",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBydQH2pcJ_LcpzZr08lE-89qZKKAuQX_9yhjUaL85pdX5YMsS_CAASyktFWJlXRnRusfsGiXpyIOYJUgUlGSKw9W9DtYTO1mV9FvvrUGHrsYcilIT90drd11ohKxxJPWqzd0OYqBg7UtPW0mMnFrqMmYBIQC01iDxxDwhe27YLPhSd6g74OWuojBw0HlAT1K1YvRgrudS4m1V1dZHa6ua0Vx9YhcK_Z2FqbpuNUdivXSPj0pbD-fK1XeiQYuO3azzDyOEMgIAENsQ",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD1tGW3jMS2AAhlnjQrZdn9Zyb0_a6KCmjmDFQaZx7HZKnCEcJAwD1XnNd1VUFzma5wYHriOl0ncManWZX2bnX80xofMToWWKeoseUA4-UBZKB08zc69z2PRyQEjfdCGmQCI2fmCIqToq_OWx2xdiCnjKX0fGwnuWhJGYQ0TXJt5aZC2_W1LdqpcubyXgE2lUmjwbpGdkOrhgwstkDs3zyulMMr5xfU-dGtFBCoE12iwaC1C6QMwd4BqAkM5vJEmgOhWidL1RQqsLo"
        ],
        host: {
            name: "Vikram Malhotra",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ2aHsB6JDsjMDogSENgM_F1BGkStufdwr0cax2wIUr4ysV5Jd5ejjsUGMRNwtM42dg3chj36U6xLv1ykvJtSyDn7YRWcdr1puuXmytt9ZkfQPWvQmSgjw0SinNnK-X6YTNkYDlTmy3sGL3g0ZDejXRxyPQ-ACYgDNHAmD8KaY8pIxmWcGRT9yK6IvgJnFS31VVHhwBS-H9bVol8T5Bo4q4vCacyKNTFFgiMiBZIAwFpCiE4OEAbkoVzGBhhz5XNYHRnuE6jIbJF4",
            joined: "2021",
            superhost: true,
            description: "Professional landlord with 5+ years experience. Committed to sustainable urban living and high-trust community experiences."
        },
        about: [
            "Experience elevated living in this meticulously designed penthouse. Featuring panoramic views of the Arabian Sea, this home combines industrial modernity with community warmth. Aligned with SDG 9 principles, the building utilizes smart infrastructure for energy efficiency and high-speed connectivity, ensuring a stable environment for modern professionals.",
            "The penthouse offers an expansive open-floor plan with double-height ceilings in the living area, imported Italian marble flooring throughout, and a private wraparound terrace perfect for sunset views. Every detail has been curated to provide a seamless transition between work and leisure."
        ],
        amenities: [
            {
                category: "Bathroom",
                items: [
                    { name: "Standalone Soaking Tub", iconName: "Bath" },
                    { name: "Rain Shower with pressure control", iconName: "ShowerHead" },
                    { name: "Hair dryer", iconName: "Wind" },
                    { name: "High-end organic toiletries", iconName: "Sparkles" },
                    { name: "Heated towel rack", iconName: "Flame" },
                    { name: "Drying rack", iconName: "Disc" }
                ]
            },
            {
                category: "Bedroom and laundry",
                items: [
                    { name: "In-unit washer & dryer", iconName: "WashingMachine" },
                    { name: "Iron & steaming board", iconName: "SquareDot" },
                    { name: "Premium Egyptian cotton linens", iconName: "Layers" },
                    { name: "Room-darkening shades", iconName: "Moon" },
                    { name: "Walk-in closet hangers", iconName: "FolderHeart" },
                    { name: "Extra pillows and blankets", iconName: "BedDouble" }
                ]
            },
            {
                category: "Entertainment",
                items: [
                    { name: "75\" 4K Smart TV with Surround Sound", iconName: "Tv" },
                    { name: "Sonos Multi-room Audio System", iconName: "Speaker" },
                    { name: "Premium Netflix & Disney+ accounts", iconName: "Tv2" },
                    { name: "PlayStation 5 console with dual controllers", iconName: "Gamepad2" },
                    { name: "Books and high-end board games", iconName: "BookOpen" }
                ]
            },
            {
                category: "Heating and cooling",
                items: [
                    { name: "Central AC with smart thermostats", iconName: "Snowflake" },
                    { name: "Ceiling fans in all rooms", iconName: "Fan" },
                    { name: "Energy-efficient air filters", iconName: "ShieldAlert" },
                    { name: "Ambient underfloor heating", iconName: "Flame" }
                ]
            },
            {
                category: "Internet and office",
                items: [
                    { name: "Gigabit Fiber WiFi (6E enabled)", iconName: "Wifi" },
                    { name: "Dedicated ergonomic workspace", iconName: "Laptop" },
                    { name: "Custom design desk lamp with USB ports", iconName: "Lightbulb" },
                    { name: "Back-up UPS power for routers", iconName: "Zap" },
                    { name: "Color laser multifunction printer", iconName: "Printer" },
                    { name: "Soundproof folding divider wall", iconName: "Sliders" }
                ]
            },
            {
                category: "Kitchen and dining",
                items: [
                    { name: "Gourmet chef's kitchen", iconName: "ChefHat" },
                    { name: "Nespresso Coffee Station", iconName: "Coffee" },
                    { name: "Built-in microwave & oven", iconName: "Microwave" },
                    { name: "Dishwasher with quiet cycle", iconName: "FolderOpen" },
                    { name: "Sub-Zero smart wine cooler", iconName: "GlassWater" },
                    { name: "Full cutlery, spice racks & culinary oils", iconName: "Salad" }
                ]
            },
            {
                category: "Outdoor and building",
                items: [
                    { name: "Private landscaped 600 sqft terrace", iconName: "Palmtree" },
                    { name: "24/7 Premium Concierge and Doorman", iconName: "UserCheck" },
                    { name: "2 reserved underground parking bays", iconName: "Car" },
                    { name: "LEED Platinum energy classification", iconName: "Leaf" },
                    { name: "Rooftop infinity swimming pool access", iconName: "Waves" },
                    { name: "High-speed multi-generator lift backup", iconName: "ArrowUpDown" }
                ]
            }
        ],
        allAmenitiesCount: 42,
        notIncluded: [
            { name: "Smoke alarm", iconName: "SmokeFree" },
            { name: "Carbon monoxide alarm", iconName: "FlameKindling" },
            { name: "Barbecue utensils", iconName: "CookingPot" }
        ],
        metrics: {
            stability: 92,
            match: 88
        },
        categoryRatings: {
            cleanliness: 5.0,
            accuracy: 5.0,
            communication: 5.0,
            checkIn: 4.9,
            location: 4.9,
            value: 4.9
        },
        reviews: [
            {
                id: "rev-01",
                name: "Priya Sharma",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJVBB_Y5OpuDysuXjcLuNhldP50cIK-2mpR9ikBLFoZp2FYcBaw6cZuu9KlpABGBD1wC-IY2m1JN4H7ZtFfrUJ2hRAWd-bP7EeA071XZ439tAAJhvDvLmSqZYBs6HKyCIKcDxPcrfd1SsVug4710p8g9HZbVr9sshv9LMJjSQEmrBhJC6qKXjdISSsbWjdXjdd0XijM6PWrWliIAxVtGyOBzIeqoRKAn_BNzRx3ZCgCiyX6DxFnIp5cNjXaI9yfdrbJlJ0ekEFD-M",
                date: "May 2024",
                duration: "Stayed 6 months",
                stars: 5,
                comment: "The view is absolutely unmatched. Vikram is a fantastic host who really understands the needs of remote workers. The fiber internet was incredibly stable throughout my stay."
            },
            {
                id: "rev-02",
                name: "Rahul Mehta",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzUvydlyP1q6pKppS2DECcgukYH9mtLNr83rH0Kyv9arXTYc11Okv-mvkYHpaON5yFnveuT0EglbNI2KGqaxlNdY_TpgBqMKaf6FmUEZtDPTN28kVy81To4xkGsFShPkAu8rARt9mcIJF8K18oImhdxGDU-faFLJJ6rU390U1ub9xeQ9bSfhL4HMhF926ctFBDMkJ34dl4yMhqgP4Gyk_OS14nvvBVGLQWwlOQDC46ic-o6QBzGpkiqNmEO0_MqS9rhrkIOn2oY6Y",
                date: "April 2024",
                duration: "Stayed 1 year",
                stars: 5,
                comment: "Exceptional property management. Any minor maintenance issue was resolved within hours. The building infrastructure is very premium and well-maintained."
            },
            {
                id: "rev-03",
                name: "Ananya Iyer",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
                date: "March 2024",
                duration: "Stayed 3 months",
                stars: 5,
                comment: "Stunning interiors and a highly functional layout. Aligned with LEED parameters which was a huge draw for me! The community spaces in the building are very premium."
            },
            {
                id: "rev-04",
                name: "Vikram Sen",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
                date: "January 2024",
                duration: "Stayed 8 months",
                stars: 5,
                comment: "A magnificent home that is both cozy and high-tech. The smart thermostat and Sonos sound systems made hosting weekend dinners a complete breeze. Highly recommend."
            }
        ]
    },
    {
        id: "worli-seaface-villa",
        name: "The Batu Ferringhi Ocean Villa",
        location: "Batu Ferringhi, Penang, 11100",
        verified: true,
        monthlyRent: 18000,
        bedrooms: "4 BHK",
        size: "3,800 sqft",
        deposit: 50000,
        images: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
        ],
        host: {
            name: "Rohini Deshmukh",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80",
            joined: "2019",
            superhost: true,
            description: "Conservation advocate and luxury real-estate curator. Dedicated to introducing tenants to the best heritage and ocean sunset spots of Penang."
        },
        about: [
            "Enjoy uninterrupted, 180-degree ocean front views of the iconic Andaman Sea. This massive luxury villa combines coastal relaxation with state-of-the-art backup engines and dual fiber lines.",
            "The layout includes a fully automated smart kitchen, triple-height lounge, custom private gym, and a temperature-controlled terrace plunge pool."
        ],
        amenities: [
            {
                category: "Bathroom",
                items: [
                    { name: "Steam Shower & Infrared Sauna", iconName: "ShowerHead" },
                    { name: "Jacuzzi Spa Bath with ocean view", iconName: "Bath" },
                    { name: "Premium French toiletries", iconName: "Sparkles" }
                ]
            },
            {
                category: "Bedroom and laundry",
                items: [
                    { name: "Master suite with king premium bed", iconName: "Layers" },
                    { name: "Dual LG Smart Washers & Dryers", iconName: "WashingMachine" }
                ]
            },
            {
                category: "Internet and office",
                items: [
                    { name: "Dual-redundant Gigabit corporate lease lines", iconName: "Wifi" },
                    { name: "Soundproof conference studio", iconName: "Laptop" }
                ]
            }
        ],
        allAmenitiesCount: 38,
        notIncluded: [
            { name: "Barbecue utensils", iconName: "CookingPot" }
        ],
        metrics: {
            stability: 95,
            match: 82
        },
        categoryRatings: {
            cleanliness: 4.9,
            accuracy: 4.8,
            communication: 5.0,
            checkIn: 5.0,
            location: 5.0,
            value: 4.7
        },
        reviews: [
            {
                id: "rev-v1",
                name: "Abhishek Goel",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
                date: "February 2024",
                duration: "Stayed 1 year",
                stars: 5,
                comment: "Absolutely unmatched luxury. Waking up to the Sound of the waves Crashing against Batu Ferringhi seaface is a spiritual experience. Rohini was a gracious and communicative landlord."
            }
        ]
    },
    {
        id: "juhu-boulevard-studio",
        name: "The Gurney Drive Smart Studio",
        location: "Gurney Drive, Georgetown, Penang, 10250",
        verified: true,
        monthlyRent: 6500,
        bedrooms: "1 BHK",
        size: "850 sqft",
        deposit: 15000,
        images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
        ],
        host: {
            name: "Meera Fernandez",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
            joined: "2022",
            superhost: false,
            description: "Architect and eco-minimalism enthusiast. Passionate about designing spaces that maximize airflow, visual art, and green carbon reduction."
        },
        about: [
            "An award-winning smart studio just steps from Gurney Drive coastal promenade. Engineered specifically for single tech-nomads or creative writers seeking extreme quiet, high-integrity design, and efficient utility footprints.",
            "The apartment operates fully on solar-microgrid offset models and showcases bespoke custom crafted furniture, integrated projector entertainment, and modular workspaces."
        ],
        amenities: [
            {
                category: "Bathroom",
                items: [
                    { name: "Japanese bidet with smart settings", iconName: "Bath" },
                    { name: "Rain shower with greywater filtration", iconName: "ShowerHead" }
                ]
            },
            {
                category: "Internet and office",
                items: [
                    { name: "Super-high-speed 1.2Gbps WiFi 6E router", iconName: "Wifi" },
                    { name: "Height-adjustable electric standing desk", iconName: "Laptop" }
                ]
            }
        ],
        allAmenitiesCount: 22,
        notIncluded: [
            { name: "Smoke alarm", iconName: "SmokeFree" },
            { name: "Carbon monoxide alarm", iconName: "FlameKindling" }
        ],
        metrics: {
            stability: 89,
            match: 94
        },
        categoryRatings: {
            cleanliness: 4.8,
            accuracy: 5.0,
            communication: 4.9,
            checkIn: 4.9,
            location: 4.8,
            value: 5.0
        },
        reviews: [
            {
                id: "rev-s1",
                name: "Kabir Roy",
                avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&h=120&q=80",
                date: "April 2024",
                duration: "Stayed 4 months",
                stars: 5,
                comment: "This studio represents the future of smart urban living. The integration of high-speed tech with sustainable appliances is flawlessly executed. Promenade access is a lovely bonus!"
            }
        ]
    }
];