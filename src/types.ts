export interface Property {
  id: string;
  name: string;
  location: string;
  city: string;
  price: number;
  beds: number;
  baths: number;
  sizeSqft: number;
  stabilityScore: number;
  image: string;
  description: string;
  amenities: string[];
  nearbySites: string[];
  type: 'condo' | 'apartment' | 'suite' | 'residence';
  // New fields from HomeDashboard
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  landlordName?: string;
  isVerified?: boolean;
  stabilityBreakdown?: StabilityBreakdown;
  features?: string[];
  propertyType?: 'Condo' | 'Apartment' | 'Landed' | 'Studio';
  furnishing?: 'Fully' | 'Partially' | 'Unfurnished';
  transitFriendly?: boolean;
}

export interface UserPreferences {
  maxBudget: number;
  city: string;
  beds: number;
  baths: number;
  priority: 'stability' | 'affordability' | 'space' | 'luxury';
}

export interface StabilityInputs {
  incomeToRentRatio: number; // 1 to 5
  employmentStatus: string; // 'employed', 'self-employed', 'student', 'retired'
  leaseDuration: number; // in months
  payOnTimeHistory: 'always' | 'mostly' | 'sometimes';
  hasReference: boolean;
}

export interface ConsultationMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export interface UserSession {
  email: string;
  role: 'tenant' | 'landlord';
  name: string;
}


export interface StabilityBreakdown {
  landlordRating: number;
  legalCompliance: number;
  depositSafety: number;
  maintenanceScore: number;
  neighborhoodSafety: number;
}

export interface PropertyFilter {
  searchQuery: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  minStability: number;
  bedrooms: string;
  bathrooms: string;
  propertyType: string;
  furnishing: string;
  transitFriendlyOnly: boolean;
  isVerifiedOnly: boolean;
  minSqft: number;
  maxSqft: number;
  selectedAmenities: string[];
}

export interface SavedListing {
  propertyId: string;
  savedAt: string;
}

export interface Inquiry {
  propertyId: string;
  propertyName: string;
  name: string;
  email: string;
  date: string;
  message: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export type UserRole = 'tenant' | 'landlord';