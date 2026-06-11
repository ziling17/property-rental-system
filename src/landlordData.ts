import { Property, PaymentTransaction } from './types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    name: 'The Grandview Heights',
    unit: 'Unit B-22-05',
    neighborhood: 'Mont Kiara',
    city: 'Kuala Lumpur',
    monthlyRent: 3500,
    status: 'Occupied',
    beds: 3,
    baths: 2,
    sqft: 1450,
    propertyType: 'Condominium',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-v328G4CFVkK9S5kQhb869c_C0gP0dZXIdO6z8P4S92JRZc7UyFWGkoeDyLiOPQAOvrAOltUP7ssduts9MVdq-wqNTJcUm1sAiqOBc03lR0QS8zLNx2nZsIUGJzW6EJlGHoRjrkWhsZ8Y_X4jZe5M8GUJ31HWrbjHbV0-LIWUSVaWH_wT4ecRn9Rs1fy-vzrz90mfyjM_fduVblWaBtag_Fwv01gte1a7aDYugNOoVGdyCmP_MVtW6OcNMYN0VEgrNGmdnEU0Cu8',
    description: 'A luxurious modern condominium tower at sunset. Features premium glass balconies, custom fittings, and sleek white concrete lines with gorgeous high-floor community views.',
    lease: {
      tenantName: 'Sarah Lim',
      tenantEmail: 'sarah.lim@example.com',
      tenantPhone: '+60 12-345 6789',
      startDate: '2025-01-15',
      endDate: '2026-01-14',
      depositAmount: 7000,
      autoRenew: true,
      status: 'Active'
    },
    maintenanceIssues: [
      { id: 'm-1', title: 'AC Water Dripping in Master Bedroom', status: 'In Progress', date: '2026-06-08', priority: 'Medium' }
    ]
  },
  {
    id: 'prop-2',
    name: 'Sapphire Residences',
    unit: 'Unit 12-03',
    neighborhood: 'Bangsar South',
    city: 'Kuala Lumpur',
    monthlyRent: 2800,
    status: 'Vacant',
    beds: 2,
    baths: 2,
    sqft: 1050,
    propertyType: 'Condominium',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4taBFSfPCaHrD2xI-QWpFwZ8qJlxf79IM53fem4-jDe71uxHlyI8_9AahFZgRAG1q_eDPUz-jov1RwIohXtHOT0JcSfEbTWGI8O7pckM0Gcm7uiuIRnPiGj6RwJydJq06TQ7zTXEj8OMDOx416O0zTkBKCZ6V3uFrbge_oidK5sL6eXCkZn2MV_iF8jweYz0R_S-cHyTYQQUeCTzkn97odSpskuPKlu_xa-9KTjT8fa5Qda6RWdBZlOv-6fa6yEtoJpvvvIG-t2E',
    description: 'A premium minimalist residential apartment with large floor-to-ceiling windows overlooking a green park. Fully furnished in modern grey-tones and sleek timber finishes.',
    maintenanceIssues: []
  },
  {
    id: 'prop-3',
    name: 'Emerald Meadows',
    unit: 'No. 45, Jalan Emerald 2',
    neighborhood: 'Shah Alam',
    city: 'Selangor',
    monthlyRent: 4200,
    status: 'Occupied',
    beds: 4,
    baths: 3,
    sqft: 2200,
    propertyType: 'Landed House',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5dOWyBM-h92ibqucUedkusJace3MrNozX6c7jqS8Nb6ZmgmazNEs3tXxrdHjDA-bltdpFfIarklRZlYbzrEFGba7j-L8vGooM8njsj7qhYIoJdcXaSRrwOPZX2lwQ9_w1hrBAatVqRu5qJCZNfjjFOy-gMmJNAHCvWoda4S21KVf9pJaugmUSBHwm05L1pK84DBEDeVoeXBuLSYZO5M9_W-viB0TsAipSWctV5mA45D8iFvwoFkbWz99U3siwU-sekaCG5zk7yII',
    description: 'An elegant double-story terraced house featuring a contemporary garden and secure automated gate. Perfect for families looking for peaceful premium living inside a guarded estate.',
    lease: {
      tenantName: 'Farhan Azman',
      tenantEmail: 'farhan.azman@example.com',
      tenantPhone: '+60 17-654 3210',
      startDate: '2024-08-01',
      endDate: '2026-07-31',
      depositAmount: 8400,
      autoRenew: false,
      status: 'Active'
    },
    maintenanceIssues: []
  },
  {
    id: 'prop-4',
    name: 'Symphony Hills Townhouse',
    unit: 'Lot 12A, Phase 2',
    neighborhood: 'Cyberjaya',
    city: 'Selangor',
    monthlyRent: 3100,
    status: 'Occupied',
    beds: 3,
    baths: 3,
    sqft: 1800,
    propertyType: 'Landed House',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEjYmTJWrZLCBeh3cIV4Z3ki3mrj06GFxL6GdqF5r7Cx3O5jPuzrRf3gtGSdNJyf4ZqTPFCAgRESVkn7SUVKF-1dnsfTFqYnuDJXcRreEZmNKwuXnJLH5cwe4lmwsxX_Q-asrVZKXQRTD2sZU-eRhNqLQjmd4jBZW2-W9PpdQrECifkuKL0yCh6Hv5D3KzKBdEMvnN2PiVNtW4Hnobl9teVY_QGg_S2k8eNsTnCM6jYwCoZYsHmrxtKMzCjYlXa9WMkATuRVs3Xl0',
    description: 'Charming modern townhouse with lush surrounding landscaping, state-of-the-art smart security system, and close proximity to top schools and international enterprise hubs.',
    lease: {
      tenantName: 'Daniel Tan',
      tenantEmail: 'daniel.tan@example.com',
      tenantPhone: '+60 13-987 6543',
      startDate: '2025-03-01',
      endDate: '2026-02-28',
      depositAmount: 6200,
      autoRenew: true,
      status: 'Active'
    },
    maintenanceIssues: []
  },
  {
    id: 'prop-5',
    name: 'Verdana Suites',
    unit: 'Unit C-10-12',
    neighborhood: 'Dutamas',
    city: 'Kuala Lumpur',
    monthlyRent: 2500,
    status: 'Vacant',
    beds: 1,
    baths: 1,
    sqft: 750,
    propertyType: 'Studio',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaI6gbEbMdlbvTqco-C3OW3Kc0IOW2ICC46psz2-bmNuZYPmUUJYGfTvfsl-37wkwDSYwImHMRbzYE0wZ1Bxvx6oAxsoSvM32RGyyqOfgj7CIs4roX303q43KnIXVpi4ED7b5AoNeIH4zk1y5d1q2uQrGAu2lTDG275OvOvk6WLcL83ZAFvAmP80oztbvIKM4KnwbKmKnfIEajq07IFKJ1_C6yJpJvMKEqEkRZaXmGNRpQOBsuknqnN5sMHTm4BiSjCoABrV2VuEY',
    description: 'An elegant designer studio apartment optimized with intelligent layout separators. Features high-end appliances, walk-in shower suite, and close link to Solaris Dutamas shopping district.',
    maintenanceIssues: []
  },
  {
    id: 'prop-6',
    name: 'The Peak Heights',
    unit: 'Penthouse A-39-01',
    neighborhood: 'Bukit Damansara',
    city: 'Kuala Lumpur',
    monthlyRent: 6500,
    status: 'Maintenance',
    beds: 4,
    baths: 4,
    sqft: 2800,
    propertyType: 'Condominium',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-v328G4CFVkK9S5kQhb869c_C0gP0dZXIdO6z8P4S92JRZc7UyFWGkoeDyLiOPQAOvrAOltUP7ssduts9MVdq-wqNTJcUm1sAiqOBc03lR0QS8zLNx2nZsIUGJzW6EJlGHoRjrkWhsZ8Y_X4jZe5M8GUJ31HWrbjHbV0-LIWUSVaWH_wT4ecRn9Rs1fy-vzrz90mfyjM_fduVblWaBtag_Fwv01gte1a7aDYugNOoVGdyCmP_MVtW6OcNMYN0VEgrNGmdnEU0Cu8',
    description: 'A spectacular sky penthouse in Bukit Damansara undergoing routine system upgrade and wooden deck polish. Offering complete 360-degree city views with secure personal lift lobby access.',
    maintenanceIssues: [
      { id: 'm-2', title: 'Hardwood Deck Polish of Balcony', status: 'In Progress', date: '2026-06-05', priority: 'Low' }
    ]
  },
  {
    id: 'prop-7',
    name: 'Casa Bella Villa',
    unit: 'No. 8, Jalan Vista 1',
    neighborhood: 'Damansara Heights',
    city: 'Kuala Lumpur',
    monthlyRent: 5200,
    status: 'Occupied',
    beds: 5,
    baths: 4,
    sqft: 3400,
    propertyType: 'Landed House',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5dOWyBM-h92ibqucUedkusJace3MrNozX6c7jqS8Nb6ZmgmazNEs3tXxrdHjDA-bltdpFfIarklRZlYbzrEFGba7j-L8vGooM8njsj7qhYIoJdcXaSRrwOPZX2lwQ9_w1hrBAatVqRu5qJCZNfjjFOy-gMmJNAHCvWoda4S21KVf9pJaugmUSBHwm05L1pK84DBEDeVoeXBuLSYZO5M9_W-viB0TsAipSWctV5mA45D8iFvwoFkbWz99U3siwU-sekaCG5zk7yII',
    description: 'Sublime Mediterranean-styled property in ultra-exclusive residential street. Featuring standard smart security networks, outdoor swimming pool deck, and generous garden margins.',
    lease: {
      tenantName: 'Julian Rivers',
      tenantEmail: 'julian@riverscorp.com',
      tenantPhone: '+60 11-409 8812',
      startDate: '2024-11-01',
      endDate: '2026-10-31',
      depositAmount: 10400,
      autoRenew: true,
      status: 'Active'
    },
    maintenanceIssues: []
  },
  {
    id: 'prop-8',
    name: 'Bayview Condominium',
    unit: 'Unit A-15-08',
    neighborhood: 'Tanjung Tokong',
    city: 'Penang',
    monthlyRent: 2900,
    status: 'Occupied',
    beds: 3,
    baths: 2,
    sqft: 1250,
    propertyType: 'Condominium',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaI6gbEbMdlbvTqco-C3OW3Kc0IOW2ICC46psz2-bmNuZYPmUUJYGfTvfsl-37wkwDSYwImHMRbzYE0wZ1Bxvx6oAxsoSvM32RGyyqOfgj7CIs4roX303q43KnIXVpi4ED7b5AoNeIH4zk1y5d1q2uQrGAu2lTDG275OvOvk6WLcL83ZAFvAmP80oztbvIKM4KnwbKmKnfIEajq07IFKJ1_C6yJpJvMKEqEkRZaXmGNRpQOBsuknqnN5sMHTm4BiSjCoABrV2VuEY',
    description: 'Gorgeous ocean-view property with cool marine ventilation breeze. Placed inside high-security gated development within steps of Straits Quay marina retail.',
    lease: {
      tenantName: 'Mei Ling Ooi',
      tenantEmail: 'meiling.ooi@example.com',
      tenantPhone: '+60 19-332 5599',
      startDate: '2023-05-10',
      endDate: '2026-05-09',
      depositAmount: 5800,
      autoRenew: false,
      status: 'Active'
    },
    maintenanceIssues: []
  },
  {
    id: 'prop-9',
    name: 'Sentral Residence',
    unit: 'Unit E-17-02',
    neighborhood: 'KL Sentral',
    city: 'Kuala Lumpur',
    monthlyRent: 3800,
    status: 'Vacant',
    beds: 2,
    baths: 2,
    sqft: 1100,
    propertyType: 'Apartment',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4taBFSfPCaHrD2xI-QWpFwZ8qJlxf79IM53fem4-jDe71uxHlyI8_9AahFZgRAG1q_eDPUz-jov1RwIohXtHOT0JcSfEbTWGI8O7pckM0Gcm7uiuIRnPiGj6RwJydJq06TQ7zTXEj8OMDOx416O0zTkBKCZ6V3uFrbge_oidK5sL6eXCkZn2MV_iF8jweYz0R_S-cHyTYQQUeCTzkn97odSpskuPKlu_xa-9KTjT8fa5Qda6RWdBZlOv-6fa6yEtoJpvvvIG-t2E',
    description: 'Incredible transport-oriented development located right by the main transit hub. Complete with sleek kitchen island, dual master wardrobes, and a premium infinity pool.',
    maintenanceIssues: []
  },
  {
    id: 'prop-10',
    name: 'Damansara Park Vista',
    unit: 'Unit D-08-01',
    neighborhood: 'Mutiara Damansara',
    city: 'Kuala Lumpur',
    monthlyRent: 3400,
    status: 'Occupied',
    beds: 3,
    baths: 2,
    sqft: 1300,
    propertyType: 'Apartment',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEjYmTJWrZLCBeh3cIV4Z3ki3mrj06GFxL6GdqF5r7Cx3O5jPuzrRf3gtGSdNJyf4ZqTPFCAgRESVkn7SUVKF-1dnsfTFqYnuDJXcRreEZmNKwuXnJLH5cwe4lmwsxX_Q-asrVZKXQRTD2sZU-eRhNqLQjmd4jBZW2-W9PpdQrECifkuKL0yCh6Hv5D3KzKBdEMvnN2PiVNtW4Hnobl9teVY_QGg_S2k8eNsTnCM6jYwCoZYsHmrxtKMzCjYlXa9WMkATuRVs3Xl0',
    description: 'Lovely modern family condo situated right next to standard parks, international shopping super-centers, and family friendly pedestrian walks.',
    lease: {
      tenantName: 'Zulkipli Harun',
      tenantEmail: 'zul.harun@outlook.com',
      tenantPhone: '+60 16-224 8101',
      startDate: '2025-06-01',
      endDate: '2026-05-31',
      depositAmount: 6800,
      autoRenew: true,
      status: 'Active'
    },
    maintenanceIssues: []
  },
  {
    id: 'prop-11',
    name: 'Tropicana Heights',
    unit: 'Lot 55, Park Lane',
    neighborhood: 'Kajang',
    city: 'Selangor',
    monthlyRent: 2600,
    status: 'Occupied',
    beds: 3,
    baths: 3,
    sqft: 1650,
    propertyType: 'Landed House',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5dOWyBM-h92ibqucUedkusJace3MrNozX6c7jqS8Nb6ZmgmazNEs3tXxrdHjDA-bltdpFfIarklRZlYbzrEFGba7j-L8vGooM8njsj7qhYIoJdcXaSRrwOPZX2lwQ9_w1hrBAatVqRu5qJCZNfjjFOy-gMmJNAHCvWoda4S21KVf9pJaugmUSBHwm05L1pK84DBEDeVoeXBuLSYZO5M9_W-viB0TsAipSWctV5mA45D8iFvwoFkbWz99U3siwU-sekaCG5zk7yII',
    description: 'Beautiful double-fronted multi-generational smart home in Kajang. Guarded community with dedicated running circuits and biological park zones.',
    lease: {
      tenantName: 'Karthik Rao',
      tenantEmail: 'karthik.rao@gmail.com',
      tenantPhone: '+60 14-888 2341',
      startDate: '2025-02-15',
      endDate: '2026-02-14',
      depositAmount: 5200,
      autoRenew: true,
      status: 'Active'
    },
    maintenanceIssues: []
  },
  {
    id: 'prop-12',
    name: 'Aria Luxury Apartments',
    unit: 'Unit C-29-10',
    neighborhood: 'KLCC',
    city: 'Kuala Lumpur',
    monthlyRent: 4800,
    status: 'Vacant',
    beds: 2,
    baths: 2,
    sqft: 1150,
    propertyType: 'Condominium',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4taBFSfPCaHrD2xI-QWpFwZ8qJlxf79IM53fem4-jDe71uxHlyI8_9AahFZgRAG1q_eDPUz-jov1RwIohXtHOT0JcSfEbTWGI8O7pckM0Gcm7uiuIRnPiGj6RwJydJq06TQ7zTXEj8OMDOx416O0zTkBKCZ6V3uFrbge_oidK5sL6eXCkZn2MV_iF8jweYz0R_S-cHyTYQQUeCTzkn97odSpskuPKlu_xa-9KTjT8fa5Qda6RWdBZlOv-6fa6yEtoJpvvvIG-t2E',
    description: 'Ultra-exclusive residential high-rise walking distance to Twin Towers. Crafted with organic materials, floor-to-ceiling windows, and dynamic skyline balconies.',
    maintenanceIssues: []
  }
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-1',
    propertyId: 'prop-1',
    propertyName: 'The Grandview Heights',
    tenantName: 'Sarah Lim',
    amount: 3500,
    dueDate: '2026-06-15',
    status: 'Pending',
    invoiceNo: 'INV-2026-001'
  },
  {
    id: 'tx-2',
    propertyId: 'prop-3',
    propertyName: 'Emerald Meadows',
    tenantName: 'Farhan Azman',
    amount: 4200,
    dueDate: '2026-06-01',
    paidDate: '2026-05-30',
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    invoiceNo: 'INV-2026-002'
  },
  {
    id: 'tx-3',
    propertyId: 'prop-4',
    propertyName: 'Symphony Hills Townhouse',
    tenantName: 'Daniel Tan',
    amount: 3100,
    dueDate: '2026-06-01',
    paidDate: '2026-06-01',
    status: 'Paid',
    paymentMethod: 'Online FPX',
    invoiceNo: 'INV-2026-003'
  },
  {
    id: 'tx-4',
    propertyId: 'prop-7',
    propertyName: 'Casa Bella Villa',
    tenantName: 'Julian Rivers',
    amount: 5200,
    dueDate: '2026-06-05',
    paidDate: '2026-06-04',
    status: 'Paid',
    paymentMethod: 'Credit Card',
    invoiceNo: 'INV-2026-004'
  },
  {
    id: 'tx-5',
    propertyId: 'prop-8',
    propertyName: 'Bayview Condominium',
    tenantName: 'Mei Ling Ooi',
    amount: 2900,
    dueDate: '2026-05-15',
    paidDate: '2026-05-14',
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    invoiceNo: 'INV-2026-005'
  },
  {
    id: 'tx-6',
    propertyId: 'prop-10',
    propertyName: 'Damansara Park Vista',
    tenantName: 'Zulkipli Harun',
    amount: 3400,
    dueDate: '2026-06-01',
    status: 'Overdue',
    invoiceNo: 'INV-2026-006'
  },
  {
    id: 'tx-7',
    propertyId: 'prop-11',
    propertyName: 'Tropicana Heights',
    tenantName: 'Karthik Rao',
    amount: 2600,
    dueDate: '2026-06-15',
    status: 'Pending',
    invoiceNo: 'INV-2026-007'
  }
];

export const PROPERTY_TYPE_PRESETS = [
  { value: 'Condominium', label: 'Condominium' },
  { value: 'Landed House', label: 'Landed House' },
  { value: 'Apartment', label: 'Apartment' },
  { value: 'Studio', label: 'Studio' }
];

export const IMAGE_PRESETS = [
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-v328G4CFVkK9S5kQhb869c_C0gP0dZXIdO6z8P4S92JRZc7UyFWGkoeDyLiOPQAOvrAOltUP7ssduts9MVdq-wqNTJcUm1sAiqOBc03lR0QS8zLNx2nZsIUGJzW6EJlGHoRjrkWhsZ8Y_X4jZe5M8GUJ31HWrbjHbV0-LIWUSVaWH_wT4ecRn9Rs1fy-vzrz90mfyjM_fduVblWaBtag_Fwv01gte1a7aDYugNOoVGdyCmP_MVtW6OcNMYN0VEgrNGmdnEU0Cu8',
    label: 'Modern Luxury Tower (Sunset)'
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4taBFSfPCaHrD2xI-QWpFwZ8qJlxf79IM53fem4-jDe71uxHlyI8_9AahFZgRAG1q_eDPUz-jov1RwIohXtHOT0JcSfEbTWGI8O7pckM0Gcm7uiuIRnPiGj6RwJydJq06TQ7zTXEj8OMDOx416O0zTkBKCZ6V3uFrbge_oidK5sL6eXCkZn2MV_iF8jweYz0R_S-cHyTYQQUeCTzkn97odSpskuPKlu_xa-9KTjT8fa5Qda6RWdBZlOv-6fa6yEtoJpvvvIG-t2E',
    label: 'Minimalist Interior Suite'
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5dOWyBM-h92ibqucUedkusJace3MrNozX6c7jqS8Nb6ZmgmazNEs3tXxrdHjDA-bltdpFfIarklRZlYbzrEFGba7j-L8vGooM8njsj7qhYIoJdcXaSRrwOPZX2lwQ9_w1hrBAatVqRu5qJCZNfjjFOy-gMmJNAHCvWoda4S21KVf9pJaugmUSBHwm05L1pK84DBEDeVoeXBuLSYZO5M9_W-viB0TsAipSWctV5mA45D8iFvwoFkbWz99U3siwU-sekaCG5zk7yII',
    label: 'Elegant Double-Story Terrace'
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEjYmTJWrZLCBeh3cIV4Z3ki3mrj06GFxL6GdqF5r7Cx3O5jPuzrRf3gtGSdNJyf4ZqTPFCAgRESVkn7SUVKF-1dnsfTFqYnuDJXcRreEZmNKwuXnJLH5cwe4lmwsxX_Q-asrVZKXQRTD2sZU-eRhNqLQjmd4jBZW2-W9PpdQrECifkuKL0yCh6Hv5D3KzKBdEMvnN2PiVNtW4Hnobl9teVY_QGg_S2k8eNsTnCM6jYwCoZYsHmrxtKMzCjYlXa9WMkATuRVs3Xl0',
    label: 'Townhouse Exterior'
  }
];

import {
  LandlordProfile, Lease, Payment, Inquiry
} from './types';

export const INITIAL_PROFILE: LandlordProfile = {
  name: 'Ahmad Razif',
  email: 'ahmad.razif@example.com',
  phone: '+60 12-888 0001',
  bio: 'Experienced landlord managing residential properties across Klang Valley and Penang.',
  avatarUrl: '',
};

export const INITIAL_LEASES: Lease[] = [
  {
    id: 'lease-1',
    propertyId: 'prop-1',
    propertyName: 'The Grandview Heights',
    tenantName: 'Sarah Lim',
    tenantEmail: 'sarah.lim@example.com',
    tenantPhone: '+60 12-345 6789',
    startDate: '2025-01-15',
    endDate: '2026-01-14',
    monthlyRent: 3500,
    depositAmount: 7000,
    autoRenew: true,
    status: 'Active',
  },
  {
    id: 'lease-2',
    propertyId: 'prop-3',
    propertyName: 'Emerald Meadows',
    tenantName: 'Farhan Azman',
    tenantEmail: 'farhan.azman@example.com',
    tenantPhone: '+60 17-654 3210',
    startDate: '2024-08-01',
    endDate: '2026-07-31',
    monthlyRent: 4200,
    depositAmount: 8400,
    autoRenew: false,
    status: 'Active',
  },
  // add more as needed, mirroring properties with lease objects
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    propertyId: 'prop-1',
    propertyName: 'The Grandview Heights',
    tenantName: 'Sarah Lim',
    amount: 3500,
    dueDate: '2026-06-15',
    status: 'Pending',
    invoiceNo: 'INV-2026-001',
  },
  {
    id: 'pay-2',
    propertyId: 'prop-3',
    propertyName: 'Emerald Meadows',
    tenantName: 'Farhan Azman',
    amount: 4200,
    dueDate: '2026-06-01',
    paidDate: '2026-05-30',
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    invoiceNo: 'INV-2026-002',
  },
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    propertyId: 'prop-2',
    propertyName: 'Sapphire Residences',
    tenantName: 'Ali Hassan',
    tenantEmail: 'ali.hassan@example.com',
    subject: 'Viewing Request',
    content: 'Hi, I would like to schedule a viewing this weekend.',
    status: 'unread',
    date: '2026-06-10',
    messages: [
      {
        id: 'msg-1',
        sender: 'tenant',
        text: 'Hi, I would like to schedule a viewing this weekend.',
        timestamp: '2026-06-10 09:30',
      },
    ],
  },
];