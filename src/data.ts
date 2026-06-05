/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HomeProperty {
  id: string;
  name: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  stabilityScore: number;
  image: string;
  description: string;
  landlordName: string;
  isVerified: boolean;
  stabilityBreakdown: {
    landlordRating: number;
    legalCompliance: number;
    depositSafety: number;
    maintenanceScore: number;
    neighborhoodSafety: number;
  };
  features: string[];
  propertyType?: string;
  furnishing?: string;
  transitFriendly?: boolean;
}


export const DEFAULT_PROPERTIES: HomeProperty[] = [
  {
    id: 'pavilion-residences',
    name: 'Pavilion Residences',
    location: 'Bukit Bintang, KL',
    price: 4500,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    stabilityScore: 98,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI2WJIVZyEOzeiZO4eOhoI_v4fYCAqhTxDR7JT_McCB_SHDdkCL85XdGSpp9Sy6AnusuMGe1fXzGS_-lUYqTLa8OdsjP1_y-gxAryiGBSB4Yczv3BqOOXLHSftcdeUPq_vaAbno-ad56EV92bx3tbq3FBJCcVdeRgzGbPtJGUrlN6G7zV0X_XxiAu94H1mojKd8uC3m2VB2CkIU5eiq8NkZ22pEeoRQsRsQB77Ko6hXIxgYb_W9bqbHkDKLsI178-SRXo40xqiCi8',
    description: 'A sun-drenched, high-end residence nestled right above the Pavilion KL mall. It offers unmatched proximity to top shopping, gourmet dining, and rapid rail transit, rendering it highly stable and desirable for modern city living.',
    landlordName: 'Dato\' Tan Kok Seng',
    isVerified: true,
    stabilityBreakdown: {
      landlordRating: 99,
      legalCompliance: 98,
      depositSafety: 100,
      maintenanceScore: 97,
      neighborhoodSafety: 96
    },
    features: ['Fully Furnished', 'Above Shopping Mall', 'Infinity Pool', '24/7 Concierge Service', 'Direct LRT/MRT Connection'],
    propertyType: 'Condo',
    furnishing: 'Fully',
    transitFriendly: true
  },
  {
    id: 'the-capers',
    name: 'The Capers',
    location: 'Sentul East, KL',
    price: 2800,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1450,
    stabilityScore: 94,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmNPfwoMAR5mD4zZieQDOkb_L9m6WrMhIECFnv6DycOniyTJsngowY9x7s9XZRwskEbXVvyaTi3iS4hcUUHB7zlfSnqmJqps1PXhXtqQeuhwevXYm8hfVbDkNEFJw5TNHhOxw--0Q_dX9PdLBDRNTqauZd-Fjv7-8ruFNis8-DpjRQhtkgeZs5hgd5b7haGQXRfd-Fo7LqJNU-_Yq5xoHcXCeUobYaQraZyKw1FyB1uMVIj0-lvySrh9vS-SFgnY_EEXTf4CC_hMs',
    description: 'Featuring iconic architectural curves, The Capers stands out in the heart of Sentul East. Experience modern, minimalist kitchens, expansive floorplans, and exceptional vertical gardens that optimize space and airflow.',
    landlordName: 'Amiruddin Bin Halim',
    isVerified: true,
    stabilityBreakdown: {
      landlordRating: 93,
      legalCompliance: 95,
      depositSafety: 94,
      maintenanceScore: 92,
      neighborhoodSafety: 96
    },
    features: ['Architectural Icon', 'Gym & Pilates Deck', 'Fiber Internet Ready', 'Skypark Bridges', '3 Tier Security'],
    propertyType: 'Apartment',
    furnishing: 'Partially',
    transitFriendly: false
  },
  {
    id: 'nadi-bangsar',
    name: 'Nadi Bangsar',
    location: 'Bangsar South, KL',
    price: 3200,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    stabilityScore: 91,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwkIcwdl-CMEvprDceKnoQ_ulJfBoxzx2TFOrc93gTUDQN7wlfV6dqJx4GZpOD7-m1T9kBsuMWpE4RiDCTGtJv4pAZ4Y6nAS5724XITT-yhUS3s21JnwHgro7X_tpN_IxGfD6-WnVoLgVKBO0rtlkqsyzLPcA_ugxv8ouOMIy3me5jyqe1DoQJxB4XANIiTelqRAI2hV0qOzH88jD6YCxz5BC7CrojcEQk4ka8pHdPcuTOS_K4oRXd4jPkt6PdgUzBhnI2vF_Xn3M',
    description: 'A sleek studio/loft styled with modern Scandinavian aesthetics. Perfect for single professionals who want the energy of Bangsar combined with peace, security, and smart energy optimization systems supporting regional SDG initiatives.',
    landlordName: 'Rachel Henderson',
    isVerified: true,
    stabilityBreakdown: {
      landlordRating: 90,
      legalCompliance: 92,
      depositSafety: 91,
      maintenanceScore: 89,
      neighborhoodSafety: 93
    },
    features: ['Scandinavian Loft Design', 'Eco-friendly Energy Systems', 'Rooftop Lounge', 'Walking distance to LRT', 'Underground Parking'],
    propertyType: 'Studio',
    furnishing: 'Fully',
    transitFriendly: true
  },
  {
    id: 'skyworld-residence',
    name: 'SkyWorld Residence',
    location: 'Setapak, KL',
    price: 2400,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1100,
    stabilityScore: 96,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsnj2JBqkrJrcvi6dGq0GirP78YleRfpxCvtMQcGij8AlmMcxG0koy5TEawjsglnwgp1lx-UbfLT8eaZxs1-Spw9w7sz7UmmtxpKysRLDRK0sceZkm5eD-LrQaQHmU5ai10H86ByBevay8Npyd9WoHO4KYzBZ4rZgik7JMxksSN9ZQpZzDEvUzNFXRFCHdxmk-iGFTBKB-qTh-Zf0Ed3_AIXFgBVvcLVOak0ltA_zJckOxNgWrOK1W4bRu6sZVkFwwab3wrI5ujI4',
    description: 'Boasting panoramic views of the city skyline, SkyWorld Residence in Setapak represents premium affordable leasing. High compliance ratings, solid infrastructure, and extensive family-friendly facilities make this a trusted community favorite.',
    landlordName: 'Lim Wei Chang',
    isVerified: true,
    stabilityBreakdown: {
      landlordRating: 97,
      legalCompliance: 96,
      depositSafety: 98,
      maintenanceScore: 95,
      neighborhoodSafety: 94
    },
    features: ['Panoramic Skyline Views', ' Olympic Pool', 'Kids Water Play Area', 'Co-working Spaces', 'High Security Guard Audit'],
    propertyType: 'Condo',
    furnishing: 'Unfurnished',
    transitFriendly: false
  },
  {
    id: 'kia-peng-villas',
    name: 'Kia Peng Suites',
    location: 'KLCC, KL',
    price: 5900,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1350,
    stabilityScore: 97,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: 'An elegant suite with proximity directly to Petronas Towers. Perfect structure, highly vetted management committee, complete legal security and deposit guarantee structure.',
    landlordName: 'Puan Sri Sofia',
    isVerified: true,
    stabilityBreakdown: {
      landlordRating: 98,
      legalCompliance: 99,
      depositSafety: 96,
      maintenanceScore: 98,
      neighborhoodSafety: 95
    },
    features: ['Near KLCC Park', 'Private Elevator Lobby', 'Smart Home System', 'Luxury Bathhouse', 'Infinity Pool', 'Gym & Pilates Deck'],
    propertyType: 'Studio',
    furnishing: 'Partially',
    transitFriendly: true
  }
];

// Fallback images array for custom listed properties to maintain visual cohesiveness
export const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
];
