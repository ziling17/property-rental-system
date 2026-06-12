import { supabase } from './supabase';
import { DBLease, DBMaintenanceIssue } from './database.types';
import { LeaseInfo, MaintenanceIssue } from '../types';
import { mapDBLeaseToLeaseInfo, mapDBMaintenanceIssue } from './mappers';

// ----------------------------------------------------------------
// LEASES
// ----------------------------------------------------------------

export async function getLeaseByProperty(propertyId: string): Promise<LeaseInfo | null> {
  const { data, error } = await supabase
    .from('leases')
    .select('*')
    .eq('property_id', propertyId)
    .eq('status', 'Active')
    .maybeSingle();

  if (error) {
    console.error('Error fetching lease:', error);
    return null;
  }
  return data ? mapDBLeaseToLeaseInfo(data as DBLease) : null;
}

export async function getLeasesByLandlord(landlordId: string): Promise<(DBLease & { property_name?: string })[]> {
  const { data, error } = await supabase
    .from('leases')
    .select('*, properties!inner(name, landlord_id)')
    .eq('properties.landlord_id', landlordId);

  if (error) {
    console.error('Error fetching landlord leases:', error);
    return [];
  }

  return (data as any[]).map((row) => ({
    ...row,
    property_name: row.properties?.name,
  }));
}

export interface NewLeaseInput {
  property_id: string;
  tenant_id?: string;
  tenant_name: string;
  tenant_email: string;
  tenant_phone?: string;
  start_date: string;
  end_date: string;
  deposit_amount?: number;
  auto_renew?: boolean;
}

export async function createLease(input: NewLeaseInput): Promise<string | null> {
  const { data, error } = await supabase
    .from('leases')
    .insert({ ...input, status: 'Active' })
    .select('id')
    .single();

  if (error || !data) {
    console.error('Error creating lease:', error);
    return null;
  }

  // mark property as occupied
  await supabase.from('properties').update({ status: 'Occupied' }).eq('id', input.property_id);

  return data.id as string;
}

export async function updateLeaseStatus(
  id: string,
  status: 'Active' | 'Expired' | 'Terminated',
  propertyId?: string
): Promise<boolean> {
  const { error } = await supabase.from('leases').update({ status }).eq('id', id);
  if (error) {
    console.error('Error updating lease status:', error);
    return false;
  }

  if (propertyId && (status === 'Expired' || status === 'Terminated')) {
    await supabase.from('properties').update({ status: 'Vacant' }).eq('id', propertyId);
  }
  return true;
}

export async function toggleLeaseAutoRenew(id: string, autoRenew: boolean): Promise<boolean> {
  const { error } = await supabase.from('leases').update({ auto_renew: autoRenew }).eq('id', id);
  if (error) {
    console.error('Error updating lease auto-renew:', error);
    return false;
  }
  return true;
}

// ----------------------------------------------------------------
// MAINTENANCE ISSUES
// ----------------------------------------------------------------

export async function getMaintenanceIssuesByProperty(propertyId: string): Promise<MaintenanceIssue[]> {
  const { data, error } = await supabase
    .from('maintenance_issues')
    .select('*')
    .eq('property_id', propertyId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching maintenance issues:', error);
    return [];
  }
  return (data as DBMaintenanceIssue[]).map(mapDBMaintenanceIssue);
}

export async function getMaintenanceIssuesByLandlord(landlordId: string) {
  const { data, error } = await supabase
    .from('maintenance_issues')
    .select('*, properties!inner(name, landlord_id)')
    .eq('properties.landlord_id', landlordId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching landlord maintenance issues:', error);
    return [];
  }
  return data as any[];
}

export interface NewMaintenanceIssueInput {
  property_id: string;
  title: string;
  priority?: 'Low' | 'Medium' | 'High';
}

export async function createMaintenanceIssue(input: NewMaintenanceIssueInput): Promise<string | null> {
  const { data, error } = await supabase
    .from('maintenance_issues')
    .insert({ ...input, status: 'Pending', priority: input.priority ?? 'Medium' })
    .select('id')
    .single();

  if (error || !data) {
    console.error('Error creating maintenance issue:', error);
    return null;
  }
  return data.id as string;
}

export async function updateMaintenanceIssueStatus(
  id: string,
  status: 'Pending' | 'In Progress' | 'Resolved'
): Promise<boolean> {
  const { error } = await supabase.from('maintenance_issues').update({ status }).eq('id', id);
  if (error) {
    console.error('Error updating maintenance issue:', error);
    return false;
  }
  return true;
}
