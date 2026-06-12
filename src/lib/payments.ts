import { supabase } from './supabase';
import { DBPayment } from './database.types';
import { PaymentTransaction } from '../types';
import { mapDBPaymentToPaymentTransaction } from './mappers';

// ----------------------------------------------------------------
// READ
// ----------------------------------------------------------------

/** Fetch all payment transactions for a landlord's properties */
export async function getPaymentsByLandlord(landlordId: string): Promise<PaymentTransaction[]> {
  const { data, error } = await supabase
    .from('payments')
    .select(
      `*, properties!inner(name, landlord_id), users:tenant_id(name)`
    )
    .eq('properties.landlord_id', landlordId)
    .order('due_date', { ascending: false });

  if (error) {
    console.error('Error fetching landlord payments:', error);
    return [];
  }

  return (data as any[]).map((row) =>
    mapDBPaymentToPaymentTransaction(
      row as DBPayment,
      row.properties?.name ?? '',
      row.users?.name ?? ''
    )
  );
}

/** Fetch all payments for a tenant */
export async function getPaymentsByTenant(tenantId: string): Promise<PaymentTransaction[]> {
  const { data, error } = await supabase
    .from('payments')
    .select(`*, properties(name)`)
    .eq('tenant_id', tenantId)
    .order('due_date', { ascending: false });

  if (error) {
    console.error('Error fetching tenant payments:', error);
    return [];
  }

  return (data as any[]).map((row) =>
    mapDBPaymentToPaymentTransaction(row as DBPayment, row.properties?.name ?? '', '')
  );
}

export async function getPaymentsByProperty(propertyId: string): Promise<DBPayment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('property_id', propertyId)
    .order('due_date', { ascending: false });

  if (error) {
    console.error('Error fetching property payments:', error);
    return [];
  }
  return data as DBPayment[];
}

// ----------------------------------------------------------------
// CREATE / UPDATE
// ----------------------------------------------------------------

export interface NewPaymentInput {
  property_id: string;
  booking_id?: string;
  tenant_id?: string;
  amount: number;
  due_date: string;
  payment_method?: string;
  invoice_no: string;
}

export async function createPayment(input: NewPaymentInput): Promise<string | null> {
  const { data, error } = await supabase
    .from('payments')
    .insert({ ...input, status: 'Pending' })
    .select('id')
    .single();

  if (error || !data) {
    console.error('Error creating payment:', error);
    return null;
  }
  return data.id as string;
}

export async function markPaymentPaid(id: string, paymentMethod?: string): Promise<boolean> {
  const updates: Partial<DBPayment> = {
    status: 'Paid',
    paid_date: new Date().toISOString().split('T')[0],
  };
  if (paymentMethod) updates.payment_method = paymentMethod;

  const { error } = await supabase.from('payments').update(updates).eq('id', id);
  if (error) {
    console.error('Error marking payment paid:', error);
    return false;
  }
  return true;
}

export async function markOverduePayments(): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('payments')
    .update({ status: 'Overdue' })
    .eq('status', 'Pending')
    .lt('due_date', today);

  if (error) console.error('Error marking overdue payments:', error);
}
