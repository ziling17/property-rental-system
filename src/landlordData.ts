import { Property, Lease, Payment, Inquiry, LandlordProfile } from './types';

export const INITIAL_PROFILE: LandlordProfile = {
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@example.com',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgG-iejlgpClYnT3HvWHKbYVWGBl3Z647e_vvGXw8wmASFqeyNx0QoTSA76CHi_jmWeSqz9EhKeclYjmfKX7GgHtUokA0RXi8JlEmsBSKi_n2pIXYIR8SccoK-LiKhb2HUULHim3m5BB9Ic163CQqe5cveZWW6Rq4TuwsmAhBu5JSsIlyMdcPltpu7Rl44RsWEloKT-qe1L4QEgg9PVACTFB9O_0ZO5wX68hb-RWnAgYxuT_2LBdtbBWEfX2BLt2TwSSLHbH1vDMM',
  bio: 'I am a dedicated property manager with over 5 years of experience in the urban residential market. I pride myself on maintaining high-quality living spaces and fostering positive relationships with all my tenants. My portfolio focuses on modern, sustainable developments in the central district.',
  membershipYear: 2019,
  isVerified: true
};

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    name: 'Grandview Heights',
    address: '425 Skyview Terrace, Suite 8A, Central District',
    type: 'Apartment',
    units: 10,
    occupiedUnits: 9,
    monthlyRent: 2100,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: 'Modern luxury residential building offering sweeping panoramic skyline views, custom floor plan layouts, high-end appliance packages, and 24/7 lobby security concierge.',
    amenities: ['Skyline Lounge', 'Concierge', 'Underground Parking', 'Fitness Center', 'Rooftop Deck'],
    yearBuilt: 2018
  },
  {
    id: 'prop-2',
    name: 'Willow Creek Suite',
    address: '112 Whispering Pines Rd, Unit B, Central District',
    type: 'Suite',
    units: 4,
    occupiedUnits: 3,
    monthlyRent: 1450,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    description: 'Charming pet-friendly suites nestled beside a peaceful creek preserve. Features open brick styling, hardwood floors, high ceilings, private deck access, and dedicated dog paths.',
    amenities: ['Pet Friendly Parking', 'Private Patio', 'Creek Trail Access', 'In-Unit Washer', 'Storage Locker'],
    yearBuilt: 2015
  },
  {
    id: 'prop-3',
    name: 'Emerald Plaza',
    address: '880 Prosperity Blvd, Block C, Central District',
    type: 'Commercial',
    units: 2,
    occupiedUnits: 2,
    monthlyRent: 4500,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    description: 'Premium light-filled commercial office front suited for high-exposure consulting firms, engineering offices, or medical boutiques. Excellent street access and parking arrays.',
    amenities: ['High Visibility Signage', 'High-Speed Fiber internet', 'EV Charging Station', 'Executive Conference Room'],
    yearBuilt: 2020
  },
  {
    id: 'prop-4',
    name: 'Sunset Lofts',
    address: '904 Horizon Parkway, Condo 4B, West End',
    type: 'Condo',
    units: 8,
    occupiedUnits: 8,
    monthlyRent: 1850,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    description: 'Elegant dual-level lofts in the vibrant west cultural sector, featuring concrete floor design, industrial overhead lights, smart climate automation, and soundproof insulation.',
    amenities: ['Soundproof Walls', 'Smart Automation', 'Bike Storage Vault', 'Ambient Lighting'],
    yearBuilt: 2021
  },
  {
    id: 'prop-5',
    name: 'Pine Crest Residences',
    address: '77 Forest Edge Road, Central District',
    type: 'House',
    units: 1,
    occupiedUnits: 1,
    monthlyRent: 3200,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
    description: 'Spacious suburban house with smart automated fixtures, beautiful private landscaped gardens, solar-paneled double garage, high energy rating index, and modern thermal heaters.',
    amenities: ['Solar Power Array', 'Double Garage', 'Private Garden', 'Smart Security System', 'Fireplace'],
    yearBuilt: 2017
  },
  {
    id: 'prop-6',
    name: 'Oakwood Apartments',
    address: '154 Oakwood Way, Unit 12, West End',
    type: 'Apartment',
    units: 5,
    occupiedUnits: 1,
    monthlyRent: 1600,
    status: 'Under Maintenance',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    description: 'Classic brick building being converted to high-efficiency solar units. Quiet neighborhood with close commute times to state offices and local commuter subway systems.',
    amenities: ['Underground Commuting Link', 'Storage Vault', 'Ramp Access'],
    yearBuilt: 2012
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    senderName: 'James Wilson',
    senderEmail: 'james.wilson@clientmail.com',
    propertyName: 'Grandview H.',
    propertyId: 'prop-1',
    content: "Hi, I'm interested in viewing the Grandview Heights apartment this weekend...",
    timestamp: '2h ago',
    status: 'unread',
    messages: [
      {
        id: 'msg-1-1',
        sender: 'tenant',
        text: "Hi, I'm interested in viewing the Grandview Heights apartment this weekend. Is anyone available on Saturday afternoon around 2 PM for a walkthrough?",
        timestamp: '2:15 PM'
      }
    ]
  },
  {
    id: 'inq-2',
    senderName: 'Elena Rodriguez',
    senderEmail: 'elena.r@petowners.com',
    propertyName: 'Willow Creek',
    propertyId: 'prop-2',
    content: "Is the Willow Creek Suite pet-friendly? I have a small goldendoodle...",
    timestamp: '5h ago',
    status: 'unread',
    messages: [
      {
        id: 'msg-2-1',
        sender: 'tenant',
        text: "Hi Sarah! Is the Willow Creek Suite pet-friendly? I have a small goldendoodle who is fully house-trained. Also, is there an additional pet deposit required?",
        timestamp: '11:30 AM'
      }
    ]
  },
  {
    id: 'inq-3',
    senderName: 'Michael Chen',
    senderEmail: 'mchen.biz@gmail.com',
    propertyName: 'Emerald Plaza',
    propertyId: 'prop-3',
    content: "I'm ready to sign the lease for Emerald Plaza, just need to confirm...",
    timestamp: 'Yesterday',
    status: 'read',
    messages: [
      {
        id: 'msg-3-1',
        sender: 'tenant',
        text: "Hi Sarah, I've reviewed the commercial lease contract drafted for Emerald Plaza Block C. I'm ready to sign the lease, just need to confirm if we can add a clause regarding building access on holidays.",
        timestamp: 'Yesterday, 4:45 PM'
      }
    ]
  }
];

export const INITIAL_LEASES: Lease[] = [
  {
    id: 'lease-1',
    tenantName: 'Michael Chen',
    tenantEmail: 'mchen.biz@gmail.com',
    tenantPhone: '+1 (555) 0192-383',
    propertyId: 'prop-3',
    propertyName: 'Emerald Plaza - Block C',
    unitNumber: 'Block C Office',
    startDate: '2025-01-01',
    endDate: '2028-01-01',
    monthlyRent: 4500,
    securityDeposit: 9000,
    status: 'Active'
  },
  {
    id: 'lease-2',
    tenantName: 'James Wilson',
    tenantEmail: 'james.wilson@clientmail.com',
    tenantPhone: '+1 (555) 7821-294',
    propertyId: 'prop-1',
    propertyName: 'Grandview Heights',
    unitNumber: 'Suite 8A',
    startDate: '2025-06-01',
    endDate: '2026-06-01',
    monthlyRent: 2100,
    securityDeposit: 2100,
    status: 'Pending'
  },
  {
    id: 'lease-3',
    tenantName: 'Elena Rodriguez',
    tenantEmail: 'elena.r@petowners.com',
    tenantPhone: '+1 (555) 3491-039',
    propertyId: 'prop-2',
    propertyName: 'Willow Creek Suite',
    unitNumber: 'Unit B',
    startDate: '2024-09-01',
    endDate: '2025-09-01',
    monthlyRent: 1450,
    securityDeposit: 1500,
    status: 'Active'
  },
  {
    id: 'lease-4',
    tenantName: 'David Kojo',
    tenantEmail: 'david.kojo@gmail.com',
    tenantPhone: '+1 (555) 8954-322',
    propertyId: 'prop-4',
    propertyName: 'Sunset Lofts',
    unitNumber: 'Condo 4B',
    startDate: '2024-03-01',
    endDate: '2025-03-01',
    monthlyRent: 1850,
    securityDeposit: 1850,
    status: 'Active'
  },
  {
    id: 'lease-5',
    tenantName: 'Isabella Tremblay',
    tenantEmail: 'isabella.t@me.com',
    tenantPhone: '+1 (555) 4381-998',
    propertyId: 'prop-5',
    propertyName: 'Pine Crest Residences',
    unitNumber: 'Main House',
    startDate: '2023-01-15',
    endDate: '2025-01-15',
    monthlyRent: 3200,
    securityDeposit: 3200,
    status: 'Expired'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    tenantName: 'Michael Chen',
    propertyName: 'Emerald Plaza',
    amount: 4500,
    date: '2026-06-02',
    status: 'Paid',
    method: 'Bank Transfer'
  },
  {
    id: 'pay-2',
    tenantName: 'Elena Rodriguez',
    propertyName: 'Willow Creek Suite',
    amount: 1450,
    date: '2026-06-01',
    status: 'Paid',
    method: 'Venmo'
  },
  {
    id: 'pay-3',
    tenantName: 'David Kojo',
    propertyName: 'Sunset Lofts',
    amount: 1850,
    date: '2026-06-01',
    status: 'Paid',
    method: 'Direct Deposit'
  },
  {
    id: 'pay-4',
    tenantName: 'Isabella Tremblay',
    propertyName: 'Pine Crest Residences',
    amount: 3200,
    date: '2026-05-15',
    status: 'Paid',
    method: 'Bank Transfer'
  },
  {
    id: 'pay-5',
    tenantName: 'James Wilson',
    propertyName: 'Grandview Heights',
    amount: 2100,
    date: '2026-06-10',
    dueDate: '2026-06-15',
    status: 'Pending',
    method: 'Venmo'
  },
  {
    id: 'pay-6',
    tenantName: 'John Doe',
    propertyName: 'Oakwood Apartments',
    amount: 1600,
    date: '2026-05-01',
    dueDate: '2026-05-05',
    status: 'Overdue',
    method: 'Credit Card'
  }
];
