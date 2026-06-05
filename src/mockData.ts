/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Property, Tenant, Invoice, MaintenanceTicket, Message } from './types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Sewa Eco-Apartments - Unit 302',
    address: '42 Greenway Blvd, Sector 9',
    rentAmount: 1200,
    depositAmount: 1200,
    status: 'occupied',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    size: '640 sq ft',
    bedrooms: 1,
    bathrooms: 1,
    tenantId: 'tenant-1'
  },
  {
    id: 'prop-2',
    title: 'SDG-9 Resilient Towers - Block B',
    address: '108 Industrial Innovation District',
    rentAmount: 1850,
    depositAmount: 1850,
    status: 'vacant',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    size: '950 sq ft',
    bedrooms: 2,
    bathrooms: 2
  },
  {
    id: 'prop-3',
    title: 'The Innovation Lofts - Unit 12A',
    address: '77 Foundry Way, Pioneer Park',
    rentAmount: 1450,
    depositAmount: 1450,
    status: 'occupied',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    size: '760 sq ft',
    bedrooms: 1,
    bathrooms: 1.5,
    tenantId: 'tenant-2'
  },
  {
    id: 'prop-4',
    title: 'Smart Tech Modular Studio',
    address: '12 Cyberport Lane, Hub South',
    rentAmount: 950,
    depositAmount: 950,
    status: 'vacant',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    size: '420 sq ft',
    bedrooms: 1,
    bathrooms: 1
  }
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Emily Vance',
    email: 'emily.vance@company.com',
    phone: '+1 (555) 349-2041',
    creditScore: 785,
    riskRating: 'Low',
    matchingScore: 98,
    approvedSDG9: true,
    rentPaidInTime: 100
  },
  {
    id: 'tenant-2',
    name: 'Ding Ziling',
    email: 'dingziling88@gmail.com',
    phone: '+1 (555) 902-8874',
    creditScore: 742,
    riskRating: 'Low',
    matchingScore: 94,
    approvedSDG9: true,
    rentPaidInTime: 95
  },
  {
    id: 'tenant-3',
    name: 'Marcus Brody',
    email: 'marcus.brody@educate.org',
    phone: '+1 (555) 732-1100',
    creditScore: 680,
    riskRating: 'Medium',
    matchingScore: 82,
    approvedSDG9: true,
    rentPaidInTime: 90
  },
  {
    id: 'tenant-4',
    name: 'Sophia Patel',
    email: 'sophia@techstartup.io',
    phone: '+1 (555) 438-9901',
    creditScore: 810,
    riskRating: 'Low',
    matchingScore: 97,
    approvedSDG9: true,
    rentPaidInTime: 100
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    propertyId: 'prop-1',
    propertyTitle: 'Sewa Eco-Apartments - Unit 302',
    tenantName: 'Emily Vance',
    amount: 1200,
    dueDate: '2026-06-01',
    status: 'Paid',
    paymentDate: '2026-05-31'
  },
  {
    id: 'inv-2',
    propertyId: 'prop-1',
    propertyTitle: 'Sewa Eco-Apartments - Unit 302',
    tenantName: 'Emily Vance',
    amount: 1200,
    dueDate: '2026-07-01',
    status: 'Pending'
  },
  {
    id: 'inv-3',
    propertyId: 'prop-3',
    propertyTitle: 'The Innovation Lofts - Unit 12A',
    tenantName: 'Ding Ziling',
    amount: 1450,
    dueDate: '2026-06-01',
    status: 'Paid',
    paymentDate: '2026-05-29'
  },
  {
    id: 'inv-4',
    propertyId: 'prop-3',
    propertyTitle: 'The Innovation Lofts - Unit 12A',
    tenantName: 'Ding Ziling',
    amount: 1450,
    dueDate: '2026-07-01',
    status: 'Pending'
  }
];

export const INITIAL_TICKETS: MaintenanceTicket[] = [
  {
    id: 'tkt-1',
    propertyId: 'prop-1',
    propertyTitle: 'Sewa Eco-Apartments - Unit 302',
    title: 'Slight HVAC airflow restriction',
    description: 'The smart environmental filter is prompting for system replacement. Air pressure decreased slightly in master bedroom.',
    priority: 'Low',
    status: 'Scheduled',
    createdAt: '2026-06-01 09:15',
    updatedAt: '2026-06-02 14:00'
  },
  {
    id: 'tkt-2',
    propertyId: 'prop-3',
    propertyTitle: 'The Innovation Lofts - Unit 12A',
    title: 'Bathroom secondary light flicker',
    description: 'One of the energy-efficient LEDs above the vanity is flickering sometimes when turning it on. No short circuit found.',
    priority: 'Low',
    status: 'Received',
    createdAt: '2026-06-03 07:30',
    updatedAt: '2026-06-03 07:30'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    senderRole: 'Landlord',
    content: 'Welcome to your rental dashboard! I have set up your lease details corresponding to SDG 9 high-durability guidelines.',
    timestamp: '2026-06-01 10:00'
  },
  {
    id: 'msg-2',
    senderRole: 'Tenant',
    content: 'Thanks! The modular setup looks great, and the power dashboard is fully integrated. I noticed the carbon-smart HVAC filter is prompting a routine schedule soon.',
    timestamp: '2026-06-02 11:30'
  },
  {
    id: 'msg-3',
    senderRole: 'Landlord',
    content: 'Perfect. I have created a maintenance ticket and scheduled our partner-tech to check it on June 4. You will get a verification alert here!',
    timestamp: '2026-06-02 12:45'
  }
];
