export type EscrowStatus = 'Held' | 'Released' | 'Refunded' | 'Pending';
export type BookingStatus = 'Active' | 'Completed' | 'Cancelled' | 'Scheduled';

export interface RentalProperty {
    id: string;
    title: string;
    address: string;
    city: string;
    description: string;
    rent: number;
    deposit: number;
    imgUrl: string;
    rating: number;
    reviewsCount: number;
    landlordName: string;
    landlordEmail: string;
    landlordPhone: string;
    amenities: string[];
    sdgAligned: boolean;
}

export interface RentalBooking {
    id: string;
    propertyId: string;
    propertyTitle: string;
    propertyAddress: string;
    propertyImgUrl: string;
    startDate: string;
    endDate: string;
    duration: string;
    rent: number;
    depositAmt: number;
    status: BookingStatus;
    escrowStatus: EscrowStatus;
    rating?: number;
    reviewText?: string;
    reviewDate?: string;
    landlordName: string;
    landlordEmail: string;
    refundDate?: string;
    escrowVerifiedId: string;
}

export const INITIAL_PROPERTIES: RentalProperty[] = [
    {
        id: 'prop-1',
        title: 'Skyline Loft',
        address: 'KLCC, Kuala Lumpur',
        city: 'Kuala Lumpur',
        description: 'A modern luxury penthouse apartment exterior with floor-to-ceiling glass windows reflecting a sunset. Features high-end amenities, private terrace access, smart home system, and breathtaking skyline views of the Petronas Twin Towers. Perfect for urban explorers seeking premium accommodations.',
        rent: 2850,
        deposit: 2850,
        imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJSVRpo0ecWBAGyuRndVy9L5Ti_E6TVUqcR1FaZAFQlA4UdEWRKwJDoU1hQIwidRXK-K-btUAz8SWuIAbv0up7ifhsBQht5qloAJrf0vx20i0buZUHZ5YFjQNru95jiTBRiDlFKqkKb4BSxvlJ1IZfZby-chb0XRbOYRbsg16bylPPWBeOIqM1_csfXnRDBiNrtbICV_h9ku2TsCeWmAK1xGWd8yQLooEkAvvqASql5XDqJGm4rka61kVYetHdK7oap_7C3A3Ezp8',
        rating: 4.8,
        reviewsCount: 34,
        landlordName: 'Alexander Vance',
        landlordEmail: 'alex.vance@mysewa-escrow.org',
        landlordPhone: '+60 12-345 0192',
        amenities: ['Petronas Twin Towers view', 'Rooftop Lounge', 'Private Concierge', 'Digital Smart Lock', 'Sustainable Heating'],
        sdgAligned: true
    },
    {
        id: 'prop-2',
        title: 'Parkside Garden Flat',
        address: 'Gurney Drive',
        city: 'Penang',
        description: 'A cozy and bright minimalist studio apartment interior with white walls, light wood flooring, and large windows letting in abundant natural light. The space is well-organized with a stylish sofa and responsive climate control for SDG-level thermal comfort.',
        rent: 1900,
        deposit: 1900,
        imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA8a2Vunaf0oeosqAWGeGdNNE_ikEJ8EeXEwt_OCQ-FI0GKVl2sBZVVw5gAGABWiS7EiGcfApMMeVATNQkWjm_fFvzbDa6rAx5idkEiBxmqSNI-7oMBAtU3x6loNPKZwoQBKquPi1XGJmrtqMuBzAxEeXSmPidPGpemDuKBSnVXMoB31zYZNCfwzx7bZDLFj8o_ncBp3123V05ixqPdlSaEqXUtaXcmVn8oqchHo4YLRcJHRxKL_iEAl20EDYrMLCuXcYCoY9XcLU',
        rating: 4.6,
        reviewsCount: 19,
        landlordName: 'Elena Rostova',
        landlordEmail: 'elena.ro@mysewa-escrow.org',
        landlordPhone: '+60 19-876 7748',
        amenities: ['Solar Power Assist', 'Double Glazed Windows', 'Local Wood Crafts', 'Minimalist Kitchen'],
        sdgAligned: true
    },
    {
        id: 'prop-3',
        title: 'Metro Heights Studio',
        address: 'Bangsar, Kuala Lumpur',
        city: 'Kuala Lumpur',
        description: 'A modern kitchen with marble countertops and sleek white cabinets. Soft overhead lighting illuminates the clean surfaces and high-end energy-saving stainless steel appliances. Perfect for students and professionals seeking proximity to LRT transit loops.',
        rent: 2400,
        deposit: 2400,
        imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjVWldtuIzpToKsgkaRuSEgn8SrrWylP4Tv5juR3u5IQlQ_xwoTd0FRZR4dOWeJQKPkJyNzgXDihkgvkvVfYYVngXUc_2wAvfG4_VpiyRKiwg_0qUOaHM54J7TD2tonmeYNbVk1kyspomFU9h9U2kEzRRxhVyOyM_e8pfClZutfv9Ql0IefAOZ-k_DaO1cY2_EdLrwVgu9aWACbAIZi9nPSAh4Jq4F5vdwemjO-HQaQrjqfc507vchQTbUt4FQqPug9ZW1AZHsht8',
        rating: 4.5,
        reviewsCount: 22,
        landlordName: 'Marcus Brodie',
        landlordEmail: 'marcus.brodie@mysewa-escrow.org',
        landlordPhone: '+60 17-234 4381',
        amenities: ['Energy Star Appliances', 'Fiber Connection', 'Filtered Water Loop', 'Bike Escrow Storage'],
        sdgAligned: true
    },
    {
        id: 'prop-4',
        title: 'The Sentral Terraces',
        address: 'KL Sentral',
        city: 'Kuala Lumpur',
        description: 'Exterior view of a contemporary apartment complex with a rooftop terrace and greenery. The building features dark metal panels and large glass windows, set against a bright blue morning sky. Perfect sustainable urban design for commuter convenience.',
        rent: 2200,
        deposit: 2200,
        imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY7SkgH05SuyrJzDBmCmasvulAU7f0aAnLtuvh3bnDBGIjBAn30jt9hP96jLnVsZhlD_oXTY65APY6j52_3QhJnQUk7AX18DB_koZ-GN6mzMd7GKsO1_zlrnU7QYlu3XhoqlKDWDm37p2lzimydMPPnhlzc88lfvkTy70GWsNkcUaoqxI3gFcl_mL8XGNZvsb24YzPBvwDWZeD8jRBoaACCRr5AUxHy6kO0MKNJ-iI3iPM6MIWHSl5xRkFLptXvun781WV12d5VEI',
        rating: 4.4,
        reviewsCount: 11,
        landlordName: 'Theresa Vance',
        landlordEmail: 'theresa.v@mysewa-escrow.org',
        landlordPhone: '+60 11-8902 8901',
        amenities: ['Urban Gardens', 'LEED Certified', 'Co-working lounge', 'Rainwater Harvester'],
        sdgAligned: true
    },
    {
        id: 'prop-5',
        title: 'Mont Kiara Duplex Studio',
        address: '16 Jalan Kiara, Mont Kiara',
        city: 'Kuala Lumpur',
        description: 'Charming duplex in the heart of Mont Kiara featuring original premium brick, steel beams, and modern custom architectural character upgraded with digital safety locks and sustainable electrical layouts.',
        rent: 2800,
        deposit: 2800,
        imgUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600&auto=format&fit=crop',
        rating: 4.7,
        reviewsCount: 15,
        landlordName: 'Julian Sterling',
        landlordEmail: 'julian.sterling@mysewa-escrow.org',
        landlordPhone: '+60 13-902 2384',
        amenities: ['Exposed Brick', 'Smart Heat Regulator', 'Shared Laundry Room', 'EV Charging Spot'],
        sdgAligned: true
    },
    {
        id: 'prop-6',
        title: 'Straits Quay Residence',
        address: 'Straits Quay, Tanjung Tokong',
        city: 'Penang',
        description: 'Breathtaking ocean-front serviced apartment featuring responsive ventilation panels, a wrap-around balcony, and certified low-carbon building infrastructure.',
        rent: 3600,
        deposit: 3600,
        imgUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop',
        rating: 4.9,
        reviewsCount: 28,
        landlordName: 'Sarah Jenkins',
        landlordEmail: 'sarah.j@mysewa-escrow.org',
        landlordPhone: '+60 16-432 7711',
        amenities: ['Solar Grid', 'Smart Water Meters', 'Ocean View Deck', 'Zero-VOC Paint Work'],
        sdgAligned: true
    }
];

export const INITIAL_BOOKINGS: RentalBooking[] = [
    {
        id: 'book-1',
        propertyId: 'prop-1',
        propertyTitle: 'Skyline Loft',
        propertyAddress: 'KLCC, Kuala Lumpur',
        propertyImgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJSVRpo0ecWBAGyuRndVy9L5Ti_E6TVUqcR1FaZAFQlA4UdEWRKwJDoU1hQIwidRXK-K-btUAz8SWuIAbv0up7ifhsBQht5qloAJrf0vx20i0buZUHZ5YFjQNru95jiTBRiDlFKqkKb4BSxvlJ1IZfZby-chb0XRbOYRbsg16bylPPWBeOIqM1_csfXnRDBiNrtbICV_h9ku2TsCeWmAK1xGWd8yQLooEkAvvqASql5XDqJGm4rka61kVYetHdK7oap_7C3A3Ezp8',
        startDate: 'Oct 2023',
        endDate: 'Present',
        duration: 'Ongoing',
        rent: 2850,
        depositAmt: 2850,
        status: 'Active',
        escrowStatus: 'Held',
        landlordName: 'Alexander Vance',
        landlordEmail: 'alex.vance@mysewa-escrow.org',
        escrowVerifiedId: 'ESC-SEWA-880291-KL'
    },
    {
        id: 'book-2',
        propertyId: 'prop-2',
        propertyTitle: 'Parkside Garden Flat',
        propertyAddress: 'Gurney Drive',
        propertyImgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA8a2Vunaf0oeosqAWGeGdNNE_ikEJ8EeXEwt_OCQ-FI0GKVl2sBZVVw5gAGABWiS7EiGcfApMMeVATNQkWjm_fFvzbDa6rAx5idkEiBxmqSNI-7oMBAtU3x6loNPKZwoQBKquPi1XGJmrtqMuBzAxEeXSmPidPGpemDuKBSnVXMoB31zYZNCfwzx7bZDLFj8o_ncBp3123V05ixqPdlSaEqXUtaXcmVn8oqchHo4YLRcJHRxKL_iEAl20EDYrMLCuXcYCoY9XcLU',
        startDate: 'Aug 2022',
        endDate: 'Aug 2023',
        duration: '12 Months',
        rent: 1900,
        depositAmt: 1900,
        status: 'Completed',
        escrowStatus: 'Released',
        landlordName: 'Elena Rostova',
        landlordEmail: 'elena.ro@mysewa-escrow.org',
        escrowVerifiedId: 'ESC-SEWA-441092-PG'
    },
    {
        id: 'book-3',
        propertyId: 'prop-3',
        propertyTitle: 'Metro Heights Studio',
        propertyAddress: 'Bangsar, Kuala Lumpur',
        propertyImgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjVWldtuIzpToKsgkaRuSEgn8SrrWylP4Tv5juR3u5IQlQ_xwoTd0FRZR4dOWeJQKPkJyNzgXDihkgvkvVfYYVngXUc_2wAvfG4_VpiyRKiwg_0qUOaHM54J7TD2tonmeYNbVk1kyspomFU9h9U2kEzRRxhVyOyM_e8pfClZutfv9Ql0IefAOZ-k_DaO1cY2_EdLrwVgu9aWACbAIZi9nPSAh4Jq4F5vdwemjO-HQaQrjqfc507vchQTbUt4FQqPug9ZW1AZHsht8',
        startDate: 'Jan 2022',
        endDate: 'July 2022',
        duration: '6 Months',
        rent: 2400,
        depositAmt: 2400,
        status: 'Completed',
        escrowStatus: 'Released',
        rating: 4.5,
        reviewText: 'Incredible studio apartment! Convenient access to the LRT station, highly secure, and very respectful landlord relation.',
        reviewDate: 'Jul 29, 2022',
        landlordName: 'Marcus Brodie',
        landlordEmail: 'marcus.brodie@mysewa-escrow.org',
        escrowVerifiedId: 'ESC-SEWA-124098-KL'
    },
    {
        id: 'book-4',
        propertyId: 'prop-4',
        propertyTitle: 'The Sentral Terraces',
        propertyAddress: 'KL Sentral',
        propertyImgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY7SkgH05SuyrJzDBmCmasvulAU7f0aAnLtuvh3bnDBGIjBAn30jt9hP96jLnVsZhlD_oXTY65APY6j52_3QhJnQUk7AX18DB_koZ-GN6mzMd7GKsO1_zlrnU7QYlu3XhoqlKDWDm37p2lzimydMPPnhlzc88lfvkTy70GWsNkcUaoqxI3gFcl_mL8XGNZvsb24YzPBvwDWZeD8jRBoaACCRr5AUxHy6kO0MKNJ-iI3iPM6MIWHSl5xRkFLptXvun781WV12d5VEI',
        startDate: 'Scheduled Dec 2021',
        endDate: 'N/A',
        duration: 'N/A',
        rent: 2200,
        depositAmt: 2200,
        status: 'Cancelled',
        escrowStatus: 'Refunded',
        landlordName: 'Theresa Vance',
        landlordEmail: 'theresa.v@mysewa-escrow.org',
        refundDate: 'Jan 2, 2022',
        escrowVerifiedId: 'ESC-SEWA-992011-KL'
    },
    {
        id: 'book-5',
        propertyId: 'mock-b5',
        propertyTitle: 'Tebrau River Residence',
        propertyAddress: 'Tebrau, Johor Bahru',
        propertyImgUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=150',
        startDate: 'Nov 2020',
        endDate: 'May 2021',
        duration: '6 Months',
        rent: 2300,
        depositAmt: 2300,
        status: 'Completed',
        escrowStatus: 'Released',
        rating: 5,
        reviewText: 'Beautiful views of modern Tebrau linear water park! Seamless deposit release post-checkout.',
        reviewDate: 'Jun 1, 2021',
        landlordName: 'Sophia Ricci',
        landlordEmail: 'sophia@mysewa-escrow.org',
        escrowVerifiedId: 'ESC-SEWA-372911-JB'
    },
    {
        id: 'book-6',
        propertyId: 'mock-b6',
        propertyTitle: 'Johor Bahru Downtown Condo',
        propertyAddress: 'Jalan Wong Ah Fook, Johor Bahru',
        propertyImgUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=150',
        startDate: 'Jun 2020',
        endDate: 'Jun 2021',
        duration: '12 Months',
        rent: 2150,
        depositAmt: 2150,
        status: 'Completed',
        escrowStatus: 'Released',
        rating: 4.0,
        reviewText: 'Excellent locality and secure lockbox check-in. Strongly aligned with eco green cooling.',
        reviewDate: 'Jun 15, 2021',
        landlordName: 'Dave Miller',
        landlordEmail: 'dave@mysewa-escrow.org',
        escrowVerifiedId: 'ESC-SEWA-448291-JB'
    },
    {
        id: 'book-7',
        propertyId: 'mock-b7',
        propertyTitle: 'Damansara Heights Condo',
        propertyAddress: 'Damansara, Selangor',
        propertyImgUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=150',
        startDate: 'Mar 2019',
        endDate: 'Aug 2019',
        duration: '6 Months',
        rent: 1800,
        depositAmt: 1800,
        status: 'Completed',
        escrowStatus: 'Released',
        landlordName: 'Julianne Howard',
        landlordEmail: 'julianne@mysewa-escrow.org',
        escrowVerifiedId: 'ESC-SEWA-290019-SL'
    },
    {
        id: 'book-8',
        propertyId: 'mock-b8',
        propertyTitle: 'Kota Kinabalu Bungalow',
        propertyAddress: 'Likas, Kota Kinabalu',
        propertyImgUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=150',
        startDate: 'Jun 2019',
        endDate: 'Jun 2020',
        duration: '12 Months',
        rent: 2600,
        depositAmt: 2600,
        status: 'Completed',
        escrowStatus: 'Released',
        landlordName: 'Gary Jenkins',
        landlordEmail: 'gary@mysewa-escrow.org',
        escrowVerifiedId: 'ESC-SEWA-411292-SB'
    },
    {
        id: 'book-9',
        propertyId: 'mock-b9',
        propertyTitle: 'Subang Jaya Townhouse',
        propertyAddress: 'SS15, Subang Jaya',
        propertyImgUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=150',
        startDate: 'Sep 2020',
        endDate: 'Sep 2021',
        duration: '12 Months',
        rent: 3100,
        depositAmt: 3100,
        status: 'Completed',
        escrowStatus: 'Released',
        landlordName: 'Beatrice Vance',
        landlordEmail: 'beatrice@mysewa-escrow.org',
        escrowVerifiedId: 'ESC-SEWA-670192-SL'
    },
    {
        id: 'book-10',
        propertyId: 'mock-b10',
        propertyTitle: 'Kuching River Studio',
        propertyAddress: 'Kuching Waterfront',
        propertyImgUrl: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=150',
        startDate: 'Jun 2017',
        endDate: 'Dec 2017',
        duration: '6 Months',
        rent: 1650,
        depositAmt: 1650,
        status: 'Completed',
        escrowStatus: 'Released',
        landlordName: 'Theresa Vance',
        landlordEmail: 'theresa.v@mysewa-escrow.org',
        escrowVerifiedId: 'ESC-SEWA-880192-SR'
    },
    {
        id: 'book-11',
        propertyId: 'mock-b11',
        propertyTitle: 'Bayan Lepas Tower Suite',
        propertyAddress: 'Bayan Lepas',
        propertyImgUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=150',
        startDate: 'Oct 2024',
        endDate: 'Apr 2025',
        duration: '6 Months',
        rent: 3200,
        depositAmt: 3200,
        status: 'Scheduled',
        escrowStatus: 'Pending',
        landlordName: 'Ricardo Costa',
        landlordEmail: 'ricardo@mysewa-escrow.org',
        escrowVerifiedId: 'ESC-SEWA-773821-PG'
    },
    {
        id: 'book-12',
        propertyId: 'mock-b12',
        propertyTitle: 'Ipoh Old Town Loft',
        propertyAddress: 'Ipoh Old Town, Ipoh',
        propertyImgUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=150',
        startDate: 'Scheduled Jun 2021',
        endDate: 'N/A',
        duration: 'N/A',
        rent: 2900,
        depositAmt: 2900,
        status: 'Cancelled',
        escrowStatus: 'Refunded',
        landlordName: 'Beatrice Vance',
        landlordEmail: 'beatrice@mysewa-escrow.org',
        refundDate: 'Jul 2, 2021',
        escrowVerifiedId: 'ESC-SEWA-670198-PK'
    }
];
