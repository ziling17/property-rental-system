import { supabase } from './supabase';
import { DBBooking, DBPropertyFull } from './database.types';
import { mapDBBookingToRentalBooking } from './mappers';
import { RentalBooking, EscrowStatus, BookingStatus } from '../types';

const PROPERTY_SELECT_FOR_BOOKING = `
  *,
  property_images (id, property_id, image_url, sort_order),
  property_amenities ( property_id, amenity_id, amenities (id, name, icon_name, category) ),
  property_not_included (id, property_id, name, icon_name),
  property_stability_breakdown (*),
  property_category_ratings (*),
  property_nearby_sites (id, property_id, site_name),
  users:landlord_id (id, name, email, phone, avatar_url, joined_at, is_superhost, description)
`;

// ----------------------------------------------------------------
// READ
// ----------------------------------------------------------------

/** Fetch all bookings for a tenant, mapped for RentalHistory / TenantDashboard */
export async function getBookingsByTenant(tenantId: string): Promise<RentalBooking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`*, properties (${PROPERTY_SELECT_FOR_BOOKING})`)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return (data as any[])
    .filter((row) => row.properties)
    .map((row) =>
      mapDBBookingToRentalBooking(row as DBBooking, row.properties as DBPropertyFull)
    );
}

/** Fetch all bookings for a given property (landlord view) */
export async function getBookingsByProperty(propertyId: string): Promise<DBBooking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching property bookings:', error);
    return [];
  }
  return data as DBBooking[];
}

export async function getBookingById(id: string): Promise<DBBooking | null> {
  const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
  if (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
  return data as DBBooking;
}

// ----------------------------------------------------------------
// CREATE
// ----------------------------------------------------------------

export interface NewBookingInput {
  property_id: string;
  tenant_id: string;
  start_date: string;
  end_date: string;
  duration_months: number;
  rent: number;
  deposit_amount: number;
  first_month_rent: number;
  utility_deposit?: number;
  total_payment: number;
  status?: BookingStatus;
  escrow_status?: EscrowStatus;
}

export async function createBooking(input: NewBookingInput): Promise<string | null> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...input,
      status: input.status ?? 'Scheduled',
      escrow_status: input.escrow_status ?? 'Pending',
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('Error creating booking:', error);
    return null;
  }
  return data.id as string;
}

// ----------------------------------------------------------------
// UPDATE
// ----------------------------------------------------------------

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<boolean> {
  const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
  if (error) {
    console.error('Error updating booking status:', error);
    return false;
  }
  return true;
}

export async function updateEscrowStatus(
  id: string,
  escrowStatus: EscrowStatus,
  escrowVerifiedId?: string
): Promise<boolean> {
  const updates: Partial<DBBooking> = { escrow_status: escrowStatus };
  if (escrowVerifiedId) updates.escrow_verified_id = escrowVerifiedId;
  if (escrowStatus === 'Refunded') updates.refund_date = new Date().toISOString().split('T')[0];

  const { error } = await supabase.from('bookings').update(updates).eq('id', id);
  if (error) {
    console.error('Error updating escrow status:', error);
    return false;
  }
  return true;
}

export async function submitBookingReview(
  id: string,
  rating: number,
  reviewText: string
): Promise<boolean> {
  const { error } = await supabase
    .from('bookings')
    .update({
      rating,
      review_text: reviewText,
      review_date: new Date().toISOString().split('T')[0],
    })
    .eq('id', id);

  if (error) {
    console.error('Error submitting booking review:', error);
    return false;
  }
  return true;
}

export async function cancelBooking(id: string): Promise<boolean> {
  return updateBookingStatus(id, 'Cancelled');
}
