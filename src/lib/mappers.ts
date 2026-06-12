import {
  Property,
  StabilityBreakdown,
  DetailProperty,
  CategoryRatings,
  AmenityCategory,
  NotIncludedItem,
  DetailReview,
  RentalProperty,
  RentalBooking,
  LandlordProperty,
  LeaseInfo,
  MaintenanceIssue,
  PaymentTransaction,
  Inquiry,
  BookingStatus,
  EscrowStatus,
  PropertyTypeValue,
} from '../types';

import {
  DBPropertyFull,
  DBStabilityBreakdown,
  DBCategoryRatings,
  DBBooking,
  DBLease,
  DBPayment,
  DBMaintenanceIssue,
  DBInquiry,
} from './database.types';

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function firstOrNull<T>(val: T | T[] | null | undefined): T | null {
  if (!val) return null;
  return Array.isArray(val) ? val[0] ?? null : val;
}

function mapPropertyType(dbType: DBPropertyFull['property_type']): Property['propertyType'] {
  switch (dbType) {
    case 'Condominium':
      return 'Condo';
    case 'Apartment':
      return 'Apartment';
    case 'Landed House':
    case 'Townhouse':
    case 'Duplex':
      return 'Landed';
    case 'Studio':
      return 'Studio';
    default:
      return undefined;
  }
}

function mapPropertyTypeToLowercase(dbType: DBPropertyFull['property_type']): Property['type'] {
  switch (dbType) {
    case 'Condominium':
      return 'condo';
    case 'Apartment':
      return 'apartment';
    case 'Studio':
      return 'suite';
    default:
      return 'residence';
  }
}

function mapStabilityBreakdown(
  row: DBStabilityBreakdown | null
): StabilityBreakdown | undefined {
  if (!row) return undefined;
  return {
    landlordRating: row.landlord_rating ?? 0,
    legalCompliance: row.legal_compliance ?? 0,
    depositSafety: row.deposit_safety ?? 0,
    maintenanceScore: row.maintenance_score ?? 0,
    neighborhoodSafety: row.neighborhood_safety ?? 0,
  };
}

function mapCategoryRatings(row: DBCategoryRatings | null): CategoryRatings {
  return {
    cleanliness: row?.cleanliness ?? 0,
    accuracy: row?.accuracy ?? 0,
    communication: row?.communication ?? 0,
    checkIn: row?.check_in ?? 0,
    location: row?.location ?? 0,
    value: row?.value ?? 0,
  };
}

// ----------------------------------------------------------------
// Property (Browse / SmartMatch / Map cards)
// ----------------------------------------------------------------

export function mapDBPropertyToProperty(db: DBPropertyFull): Property {
  const images = (db.property_images ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order);

  const amenities = (db.property_amenities ?? [])
    .map((pa) => pa.amenities?.name)
    .filter((n): n is string => !!n);

  const nearbySites = (db.property_nearby_sites ?? []).map((s) => s.site_name);

  const stabilityBreakdown = mapStabilityBreakdown(firstOrNull(db.property_stability_breakdown));

  return {
    id: db.id,
    name: db.name,
    location: db.neighborhood ?? db.address ?? db.city,
    city: db.city,
    price: db.monthly_rent,
    beds: db.bedrooms,
    baths: db.bathrooms,
    sizeSqft: db.sqft ?? 0,
    stabilityScore: db.stability_score ?? 0,
    image: images[0]?.image_url ?? '',
    description: db.description ?? '',
    amenities,
    nearbySites,
    type: mapPropertyTypeToLowercase(db.property_type),
    bedrooms: db.bedrooms,
    bathrooms: db.bathrooms,
    sqft: db.sqft ?? undefined,
    landlordName: db.users?.name,
    isVerified: db.is_verified,
    stabilityBreakdown,
    features: amenities,
    propertyType: mapPropertyType(db.property_type),
    furnishing: db.furnishing ?? undefined,
    transitFriendly: db.transit_friendly,
  };
}

// ----------------------------------------------------------------
// DetailProperty (PropertyDetailPage)
// ----------------------------------------------------------------

export function mapDBPropertyToDetailProperty(db: DBPropertyFull): DetailProperty {
  const images = (db.property_images ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => img.image_url);

  // Group amenities by category
  const amenityMap = new Map<string, { name: string; iconName: string }[]>();
  for (const pa of db.property_amenities ?? []) {
    const a = pa.amenities;
    if (!a) continue;
    const category = a.category ?? 'General';
    if (!amenityMap.has(category)) amenityMap.set(category, []);
    amenityMap.get(category)!.push({ name: a.name, iconName: a.icon_name ?? '' });
  }
  const amenities: AmenityCategory[] = Array.from(amenityMap.entries()).map(
    ([category, items]) => ({ category, items })
  );
  const allAmenitiesCount = (db.property_amenities ?? []).length;

  const notIncluded: NotIncludedItem[] = (db.property_not_included ?? []).map((n) => ({
    name: n.name,
    iconName: n.icon_name ?? '',
  }));

  const categoryRatings = mapCategoryRatings(firstOrNull(db.property_category_ratings));

  const reviews: DetailReview[] = (db.reviews ?? []).map((r) => ({
    id: r.id,
    name: r.users?.name ?? 'Anonymous',
    avatar: r.users?.avatar_url ?? '',
    date: r.created_at,
    duration: r.stay_duration ?? '',
    stars: r.stars,
    comment: r.comment ?? '',
  }));

  return {
    id: db.id,
    name: db.name,
    location: db.neighborhood ?? db.address ?? db.city,
    verified: db.is_verified,
    monthlyRent: db.monthly_rent,
    bedrooms: String(db.bedrooms),
    size: db.sqft ? `${db.sqft} sqft` : '',
    deposit: db.security_deposit,
    images,
    host: {
      name: db.users?.name ?? 'Unknown',
      avatar: db.users?.avatar_url ?? '',
      joined: db.users?.joined_at ?? '',
      superhost: db.users?.is_superhost ?? false,
      description: db.users?.description ?? '',
    },
    about: db.about ?? [],
    amenities,
    allAmenitiesCount,
    notIncluded,
    metrics: {
      stability: db.stability_score ?? 0,
      match: 0,
    },
    categoryRatings,
    reviews,
  };
}

// ----------------------------------------------------------------
// RentalProperty (RentalSummary etc.)
// ----------------------------------------------------------------

export function mapDBPropertyToRentalProperty(db: DBPropertyFull): RentalProperty {
  const images = (db.property_images ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
  const amenities = (db.property_amenities ?? [])
    .map((pa) => pa.amenities?.name)
    .filter((n): n is string => !!n);

  return {
    id: db.id,
    title: db.name,
    address: db.address ?? '',
    city: db.city,
    description: db.description ?? '',
    rent: db.monthly_rent,
    deposit: db.security_deposit,
    imgUrl: images[0]?.image_url ?? '',
    rating: db.rating ?? 0,
    reviewsCount: db.reviews_count,
    landlordName: db.users?.name ?? '',
    landlordEmail: db.users?.email ?? '',
    landlordPhone: db.users?.phone ?? '',
    amenities,
    sdgAligned: db.sdg_aligned,
  };
}

// ----------------------------------------------------------------
// Booking -> RentalBooking (RentalHistory / TenantDashboard)
// ----------------------------------------------------------------

export function mapDBBookingToRentalBooking(
  booking: DBBooking,
  property: DBPropertyFull
): RentalBooking {
  const images = (property.property_images ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order);

  return {
    id: booking.id,
    propertyId: property.id,
    propertyTitle: property.name,
    propertyAddress: property.address ?? property.neighborhood ?? property.city,
    propertyImgUrl: images[0]?.image_url ?? '',
    startDate: booking.start_date,
    endDate: booking.end_date,
    duration: booking.duration_months ? `${booking.duration_months} months` : '',
    rent: booking.rent,
    depositAmt: booking.deposit_amount,
    status: booking.status as BookingStatus,
    escrowStatus: booking.escrow_status as EscrowStatus,
    rating: booking.rating ?? undefined,
    reviewText: booking.review_text ?? undefined,
    reviewDate: booking.review_date ?? undefined,
    landlordName: property.users?.name ?? '',
    landlordEmail: property.users?.email ?? '',
    refundDate: booking.refund_date ?? undefined,
    escrowVerifiedId: booking.escrow_verified_id ?? '',
  };
}

// ----------------------------------------------------------------
// Landlord dashboard
// ----------------------------------------------------------------

function mapDBPropertyTypeToLandlordValue(
  dbType: DBPropertyFull['property_type']
): PropertyTypeValue {
  return (dbType ?? 'Apartment') as PropertyTypeValue;
}

export function mapDBLeaseToLeaseInfo(lease: DBLease): LeaseInfo {
  return {
    tenantName: lease.tenant_name ?? '',
    tenantEmail: lease.tenant_email ?? '',
    tenantPhone: lease.tenant_phone ?? '',
    startDate: lease.start_date,
    endDate: lease.end_date,
    depositAmount: lease.deposit_amount ?? 0,
    autoRenew: lease.auto_renew,
    status: lease.status,
  };
}

export function mapDBMaintenanceIssue(issue: DBMaintenanceIssue): MaintenanceIssue {
  return {
    id: issue.id,
    title: issue.title,
    status: issue.status,
    date: issue.date,
    priority: issue.priority,
  };
}

export function mapDBPropertyToLandlordProperty(
  db: DBPropertyFull,
  activeLease?: DBLease,
  maintenanceIssues: DBMaintenanceIssue[] = []
): LandlordProperty {
  const images = (db.property_images ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);

  return {
    id: db.id,
    name: db.name,
    unit: db.unit ?? '',
    neighborhood: db.neighborhood ?? '',
    city: db.city,
    monthlyRent: db.monthly_rent,
    status: db.status,
    beds: db.bedrooms,
    baths: db.bathrooms,
    sqft: db.sqft ?? 0,
    propertyType: mapDBPropertyTypeToLandlordValue(db.property_type),
    imageUrl: images[0]?.image_url ?? '',
    description: db.description ?? '',
    lease: activeLease ? mapDBLeaseToLeaseInfo(activeLease) : undefined,
    maintenanceIssues: maintenanceIssues.map(mapDBMaintenanceIssue),
  };
}

export function mapDBPaymentToPaymentTransaction(
  payment: DBPayment,
  propertyName: string,
  tenantName: string
): PaymentTransaction {
  return {
    id: payment.id,
    propertyId: payment.property_id,
    propertyName,
    tenantName,
    amount: payment.amount,
    dueDate: payment.due_date,
    paidDate: payment.paid_date ?? undefined,
    status: payment.status,
    paymentMethod: payment.payment_method ?? undefined,
    invoiceNo: payment.invoice_no,
  };
}

export function mapDBInquiryToInquiry(inquiry: DBInquiry, propertyName: string): Inquiry {
  return {
    propertyId: inquiry.property_id,
    propertyName,
    name: inquiry.name,
    email: inquiry.email,
    date: inquiry.created_at,
    message: inquiry.message ?? '',
  };
}
