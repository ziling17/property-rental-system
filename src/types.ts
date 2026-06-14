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
  token: string;
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

export interface Host {
  name: string;
  avatar: string;
  joined: string;
  superhost: boolean;
  description: string;
}

export interface AmenityCategory {
  category: string;
  items: {
    name: string;
    iconName: string;
  }[];
}

export interface NotIncludedItem {
  name: string;
  iconName: string;
}

export interface MatchFactor {
  title: string;
  desc: string;
  type: "commute" | "sustainability" | "financial" | "community";
}

export interface DetailReview {
  id: string;
  name: string;
  avatar: string;
  date: string;
  duration: string;
  stars: number;
  comment: string;
}

export interface CategoryRatings {
  cleanliness: number;
  accuracy: number;
  communication: number;
  checkIn: number;
  location: number;
  value: number;
}

export interface MatchingInputs {
  klccCommuteMins: number;
  prefersLeed: boolean;
  monthlyIncome: number;
  techIndustry: boolean;
}

export interface DetailProperty {
  id: string;
  name: string;
  location: string;
  verified: boolean;
  monthlyRent: number;
  bedrooms: string;
  size: string;
  deposit: number;
  images: string[];
  host: Host;
  about: string[];
  amenities: AmenityCategory[];
  allAmenitiesCount: number;
  notIncluded: NotIncludedItem[];
  metrics: {
    stability: number;
    match: number;
  };
  categoryRatings: CategoryRatings;
  reviews: DetailReview[];
}

export interface BookingSummary {
  startDate: string;
  endDate: string;
  durationMonths: number;
  durationDays: number;
  isValid: boolean;
  warnings: string[];
  firstMonthRent: number;
  securityDeposit: number;
  utilityDeposit: number;
  totalPayment: number;
}

export interface BookingProperty {
  id: string;
  name: string;
  rating: number;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  monthlyRent: number;
  securityDeposit: number;
  utilityDeposit: number;
}

export interface BookingSummary {
  startDate: string;
  endDate: string;
  durationMonths: number;
  isValid: boolean;
  warnings: string[];
  firstMonthRent: number;
  securityDeposit: number;
  utilityDeposit: number;
  totalPayment: number;
}

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

// Landlord Dashboard Types
export type PropertyStatus = 'Vacant' | 'Occupied' | 'Maintenance';
export type PropertyTypeValue = 'Condominium' | 'Landed House' | 'Apartment' | 'Studio' | 'Townhouse' | 'Duplex';

export interface MaintenanceIssue {
  id: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  date: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface LeaseInfo {
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  startDate: string;
  endDate: string;
  depositAmount: number;
  autoRenew: boolean;
  status: 'Active' | 'Expired' | 'Terminated';
}

export interface LandlordProperty {
  id: string;
  name: string;
  unit: string;
  neighborhood: string;
  city: string;
  monthlyRent: number;
  status: PropertyStatus;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: PropertyTypeValue;
  imageUrl: string;
  description: string;
  lease?: LeaseInfo;
  maintenanceIssues: MaintenanceIssue[];
}

export interface PaymentTransaction {
  id: string;
  propertyId: string;
  propertyName: string;
  tenantName: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentMethod?: string;
  invoiceNo: string;
}

// Add this to types.ts

export type LeaseStatus = 'Active' | 'Pending' | 'Expired' | 'Terminated';
export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';
export type InquiryStatus = 'unread' | 'read' | 'replied';

export interface LandlordProfile {
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string;
  membershipYear: number;
  isVerified: boolean;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  units: number;
  occupiedUnits: number;
  monthlyRent: number;
  status: string;
  image: string;
  description: string;
  amenities: string[];
  yearBuilt: number;
}

export interface Lease {
  id: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: LeaseStatus;
}

export interface Payment {
  id: string;
  tenantName: string;
  propertyName: string;
  amount: number;
  date: string;
  dueDate?: string;
  status: PaymentStatus;
  method: string;
}

export interface Inquiry {
  id: string;
  senderName: string;
  senderEmail: string;
  propertyName: string;
  propertyId: string;
  content: string;
  timestamp: string;
  status: InquiryStatus;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sender: 'tenant' | 'landlord';
  text: string;
  timestamp: string;
}