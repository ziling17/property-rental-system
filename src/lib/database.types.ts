// Raw row types matching the Supabase Postgres schema exactly.
// These mirror your SQL tables column-for-column (snake_case).

export interface DBUser {
  id: string;
  email: string;
  name: string;
  role: 'tenant' | 'landlord';
  avatar_url: string | null;
  phone: string | null;
  joined_at: string;
  is_superhost: boolean;
  description: string | null;
}

export interface DBProperty {
  id: string;
  landlord_id: string | null;
  name: string;
  unit: string | null;
  description: string | null;
  about: string[] | null;
  address: string | null;
  neighborhood: string | null;
  city: string;
  monthly_rent: number;
  security_deposit: number;
  utility_deposit: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number | null;
  property_type:
    | 'Condominium'
    | 'Landed House'
    | 'Apartment'
    | 'Studio'
    | 'Townhouse'
    | 'Duplex'
    | null;
  furnishing: 'Fully' | 'Partially' | 'Unfurnished' | null;
  status: 'Vacant' | 'Occupied' | 'Maintenance';
  is_verified: boolean;
  sdg_aligned: boolean;
  transit_friendly: boolean;
  stability_score: number | null;
  rating: number | null;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

export interface DBPropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  sort_order: number;
}

export interface DBAmenity {
  id: string;
  name: string;
  icon_name: string | null;
  category: string | null;
}

export interface DBPropertyAmenity {
  property_id: string;
  amenity_id: string;
  amenities?: DBAmenity;
}

export interface DBPropertyNotIncluded {
  id: string;
  property_id: string;
  name: string;
  icon_name: string | null;
}

export interface DBStabilityBreakdown {
  property_id: string;
  landlord_rating: number | null;
  legal_compliance: number | null;
  deposit_safety: number | null;
  maintenance_score: number | null;
  neighborhood_safety: number | null;
}

export interface DBCategoryRatings {
  property_id: string;
  cleanliness: number | null;
  accuracy: number | null;
  communication: number | null;
  check_in: number | null;
  location: number | null;
  value: number | null;
}

export interface DBNearbySite {
  id: string;
  property_id: string;
  site_name: string;
}

export interface DBLease {
  id: string;
  property_id: string;
  tenant_id: string | null;
  tenant_name: string | null;
  tenant_email: string | null;
  tenant_phone: string | null;
  start_date: string;
  end_date: string;
  deposit_amount: number | null;
  auto_renew: boolean;
  status: 'Active' | 'Expired' | 'Terminated';
}

export interface DBBooking {
  id: string;
  property_id: string;
  tenant_id: string | null;
  start_date: string;
  end_date: string;
  duration_months: number | null;
  rent: number;
  deposit_amount: number;
  first_month_rent: number | null;
  utility_deposit: number;
  total_payment: number | null;
  status: 'Active' | 'Completed' | 'Cancelled' | 'Scheduled';
  escrow_status: 'Held' | 'Released' | 'Refunded' | 'Pending';
  escrow_verified_id: string | null;
  refund_date: string | null;
  rating: number | null;
  review_text: string | null;
  review_date: string | null;
  created_at: string;
}

export interface DBMaintenanceIssue {
  id: string;
  property_id: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  date: string;
}

export interface DBPayment {
  id: string;
  property_id: string;
  booking_id: string | null;
  tenant_id: string | null;
  amount: number;
  due_date: string;
  paid_date: string | null;
  status: 'Paid' | 'Pending' | 'Overdue';
  payment_method: string | null;
  invoice_no: string;
}

export interface DBReview {
  id: string;
  property_id: string;
  user_id: string | null;
  stars: number;
  comment: string | null;
  stay_duration: string | null;
  created_at: string;
}

export interface DBSavedListing {
  user_id: string;
  property_id: string;
  saved_at: string;
}

export interface DBInquiry {
  id: string;
  property_id: string;
  name: string;
  email: string;
  message: string | null;
  created_at: string;
}

// Full nested shape returned by getProperties() / getPropertyById()
export interface DBPropertyFull extends DBProperty {
  property_images: DBPropertyImage[];
  property_amenities: DBPropertyAmenity[];
  property_not_included: DBPropertyNotIncluded[];
  property_stability_breakdown: DBStabilityBreakdown | DBStabilityBreakdown[] | null;
  property_category_ratings: DBCategoryRatings | DBCategoryRatings[] | null;
  property_nearby_sites: DBNearbySite[];
  reviews?: (DBReview & { users: { name: string; avatar_url: string | null } | null })[];
  users?: DBUser | null; // landlord
}
