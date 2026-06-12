import { supabase } from './supabase';
import { DBUser } from './database.types';
import { UserSession, UserRole } from '../types';

// ----------------------------------------------------------------
// AUTH
// ----------------------------------------------------------------

export async function signUp(
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<{ session: UserSession | null; error: string | null }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role }, // consumed by handle_new_user() trigger
    },
  });

  if (error) return { session: null, error: error.message };
  if (!data.user) return { session: null, error: 'Sign up failed' };

  return {
    session: { email, name, role },
    error: null,
  };
}

export async function signIn(
  email: string,
  password: string
): Promise<{ session: UserSession | null; error: string | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { session: null, error: error.message };
  if (!data.user) return { session: null, error: 'Sign in failed' };

  const profile = await getUserProfile(data.user.id);
  if (!profile) return { session: null, error: 'Profile not found' };

  return {
    session: { email: profile.email, name: profile.name, role: profile.role },
    error: null,
  };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function getCurrentSession(): Promise<UserSession | null> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  const profile = await getUserProfile(data.user.id);
  if (!profile) return null;

  return { email: profile.email, name: profile.name, role: profile.role };
}

// ----------------------------------------------------------------
// PROFILE
// ----------------------------------------------------------------

export async function getUserProfile(userId: string): Promise<DBUser | null> {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data as DBUser;
}

export async function getUserProfileByEmail(email: string): Promise<DBUser | null> {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data as DBUser;
}

export interface ProfileUpdateInput {
  name?: string;
  phone?: string;
  avatar_url?: string;
  description?: string;
}

export async function updateUserProfile(userId: string, updates: ProfileUpdateInput): Promise<boolean> {
  const { error } = await supabase.from('users').update(updates).eq('id', userId);
  if (error) {
    console.error('Error updating profile:', error);
    return false;
  }
  return true;
}

export async function updatePassword(newPassword: string): Promise<boolean> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    console.error('Error updating password:', error);
    return false;
  }
  return true;
}
