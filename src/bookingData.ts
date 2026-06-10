import { BookingProperty } from './types';

export const PROPERTIES: BookingProperty[] = [
    {
        id: 'luminary',
        name: 'Luminary Heights Residence',
        rating: 4.9,
        location: 'Downtown District, Sector 9',
        beds: 2,
        baths: 2,
        sqft: 1240,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYoPda8qXXfoXun8_9uJbe7cf5bEtDdThL5PpxqC0muxz2eGrwCVlpdbjAgacY4gj0Lhnc9roYF1L8wY5Up3nyVGxtYneJajQPaoRmoX2IulS5tZo82Xq-EaMSKN03hHXyj9nFj9UciYjjgU0Ti35Bg9knDgwlA03MJnIEduiIn5_LdDK8lzoLEsVgU61xb_7IeGfIMmGbAwoatraUDUfrTE13KGHR3HZKIibr3lLk4rCF0AjylPpzywgBrWhwUVRWxrQj0Lrrs38',
        monthlyRent: 2450.00,
        securityDeposit: 2450.00,
        utilityDeposit: 1225.00
    },
    {
        id: 'horizon',
        name: 'Horizon Oceanview Apartment',
        rating: 4.8,
        location: 'Bayside Marina, Block C',
        beds: 3,
        baths: 2,
        sqft: 1450,
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        monthlyRent: 3200.00,
        securityDeposit: 3200.00,
        utilityDeposit: 1600.00
    },
    {
        id: 'loft',
        name: 'Metropolitan Urban Loft',
        rating: 4.7,
        location: 'Arts District, Zone 4',
        beds: 1,
        baths: 1,
        sqft: 850,
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        monthlyRent: 1800.00,
        securityDeposit: 1800.00,
        utilityDeposit: 900.00
    }
];

export const SUGGESTED_QUESTIONS = [
    'How does the refundable security deposit work?',
    'What is the minimum lease duration?',
    'What are the community rules at Luminary Heights?',
    'Tell me more about the SDG 9 alignment of MySewa.'
];

export const ADVISOR_RESPONSES: Record<string, string> = {
    deposit: 'The Security Deposit (RM 2,450.00) and Utility Deposit (RM 1,225.00) are fully refundable at the end of your lease term, subject to the property status inspection. They are held securely in a regulatory-compliant escrow account protected by bank-grade encryption to ensure high trust.',
    duration: 'The minimum lease duration is 6 months. For Luminary Heights Residence, standard bookings of 12 months are pre-approved by the landlord. If you select a date range lower than 6 months, our system blocks confirmation to comply with local council guidelines.',
    rules: 'At Luminary Heights Residence, active community guidelines require quiet hours from 10:00 PM to 8:00 AM, strict garbage disposal at designated chutes, and pre-scheduled access for visiting hours for the swimming pool and wellness center.',
    sdg: 'MySewa is proudly aligned with United Nations Sustainable Development Goal 9 (Industry, Innovation, and Infrastructure). We build trusted, paperless digital infrastructure for the rental market to eliminate high agency fees and provide inclusive and equitable urban housing access for everyone.',
    default: 'Thank you for reaching out! I am your MySewa rental advisor. I can help answer questions regarding your leasing duration, refundable security/utility deposits, verified properties, and the landlord verification process. What would you like to know?'
};
