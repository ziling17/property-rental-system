import { supabase } from './supabase';
import { DBInquiry, DBReview } from './database.types';
import { Inquiry, SavedListing, DetailReview } from '../types';
import { mapDBInquiryToInquiry } from './mappers';

// ----------------------------------------------------------------
// REVIEWS
// ----------------------------------------------------------------

export async function getReviewsByProperty(propertyId: string): Promise<DetailReview[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, users:user_id(name, avatar_url)')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return (data as any[]).map((r) => ({
    id: r.id,
    name: r.users?.name ?? 'Anonymous',
    avatar: r.users?.avatar_url ?? '',
    date: r.created_at,
    duration: r.stay_duration ?? '',
    stars: r.stars,
    comment: r.comment ?? '',
  }));
}

export interface NewReviewInput {
  property_id: string;
  user_id: string;
  stars: number;
  comment?: string;
  stay_duration?: string;
}

export async function addReview(input: NewReviewInput): Promise<string | null> {
  const { data, error } = await supabase.from('reviews').insert(input).select('id').single();

  if (error || !data) {
    console.error('Error adding review:', error);
    return null;
  }

  // Recalculate property's aggregate rating + review count
  await recalculatePropertyRating(input.property_id);

  return data.id as string;
}

async function recalculatePropertyRating(propertyId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('stars')
    .eq('property_id', propertyId);

  if (error || !data) return;

  const count = data.length;
  const avg = count > 0 ? data.reduce((sum, r: any) => sum + r.stars, 0) / count : 0;

  await supabase
    .from('properties')
    .update({ rating: Math.round(avg * 10) / 10, reviews_count: count })
    .eq('id', propertyId);
}

// ----------------------------------------------------------------
// SAVED LISTINGS
// ----------------------------------------------------------------

export async function getSavedListings(userId: string): Promise<SavedListing[]> {
  const { data, error } = await supabase
    .from('saved_listings')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching saved listings:', error);
    return [];
  }

  return (data as any[]).map((row) => ({
    propertyId: row.property_id,
    savedAt: row.saved_at,
  }));
}

export async function saveListing(userId: string, propertyId: string): Promise<boolean> {
  const { error } = await supabase
    .from('saved_listings')
    .insert({ user_id: userId, property_id: propertyId });

  if (error) {
    console.error('Error saving listing:', error);
    return false;
  }
  return true;
}

export async function unsaveListing(userId: string, propertyId: string): Promise<boolean> {
  const { error } = await supabase
    .from('saved_listings')
    .delete()
    .eq('user_id', userId)
    .eq('property_id', propertyId);

  if (error) {
    console.error('Error unsaving listing:', error);
    return false;
  }
  return true;
}

export async function toggleSavedListing(userId: string, propertyId: string): Promise<boolean> {
  const { data } = await supabase
    .from('saved_listings')
    .select('*')
    .eq('user_id', userId)
    .eq('property_id', propertyId)
    .maybeSingle();

  if (data) {
    await unsaveListing(userId, propertyId);
    return false; // now unsaved
  } else {
    await saveListing(userId, propertyId);
    return true; // now saved
  }
}

// ----------------------------------------------------------------
// INQUIRIES
// ----------------------------------------------------------------

export interface NewInquiryInput {
  property_id: string;
  name: string;
  email: string;
  message?: string;
}

export async function createInquiry(input: NewInquiryInput): Promise<string | null> {
  const { data, error } = await supabase.from('inquiries').insert(input).select('id').single();

  if (error || !data) {
    console.error('Error creating inquiry:', error);
    return null;
  }
  return data.id as string;
}

export async function getInquiriesByLandlord(landlordId: string): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*, properties!inner(name, landlord_id)')
    .eq('properties.landlord_id', landlordId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inquiries:', error);
    return [];
  }

  return (data as any[]).map((row) =>
    mapDBInquiryToInquiry(row as DBInquiry, row.properties?.name ?? '')
  );
}

export async function getInquiriesByProperty(propertyId: string): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*, properties(name)')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching property inquiries:', error);
    return [];
  }

  return (data as any[]).map((row) =>
    mapDBInquiryToInquiry(row as DBInquiry, row.properties?.name ?? '')
  );
}
