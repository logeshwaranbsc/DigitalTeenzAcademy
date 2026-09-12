import { supabase } from '../lib/supabase';
import apiClient from './client';
import type { Profile, ApiResponse } from '../types';

/**
 * Login with Supabase email/password
 */
export async function loginWithSupabase(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Fetch the authenticated user's application profile from Laravel
 */
export async function getProfile(): Promise<Profile> {
  const response = await apiClient.post<ApiResponse<Profile>>('/auth/profile');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch profile');
  }
  return response.data.data;
}

/**
 * Logout from Supabase
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Send password reset email via Supabase
 */
export async function forgotPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}
