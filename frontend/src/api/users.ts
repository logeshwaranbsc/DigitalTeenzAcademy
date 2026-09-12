import apiClient from './client';
import type {
  Profile,
  UserFormData,
  ApiResponse,
  PaginatedResponse,
  UserFilters,
  DashboardStats,
} from '../types';

/**
 * Get paginated users list with optional filters
 */
export async function getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<Profile>> {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.role) params.append('role', filters.role);
  if (filters.status) params.append('status', filters.status);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.per_page) params.append('per_page', String(filters.per_page));

  const response = await apiClient.get<PaginatedResponse<Profile>>(`/users?${params.toString()}`);
  return response.data;
}

/**
 * Get a single user by ID
 */
export async function getUser(id: string): Promise<Profile> {
  const response = await apiClient.get<ApiResponse<Profile>>(`/users/${id}`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch user');
  }
  return response.data.data;
}

/**
 * Create a new user (admin only — creates Supabase Auth + profile)
 */
export async function createUser(data: UserFormData): Promise<Profile> {
  const response = await apiClient.post<ApiResponse<Profile>>('/users', data);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to create user');
  }
  return response.data.data;
}

/**
 * Update an existing user
 */
export async function updateUser(id: string, data: Partial<UserFormData>): Promise<Profile> {
  const response = await apiClient.put<ApiResponse<Profile>>(`/users/${id}`, data);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to update user');
  }
  return response.data.data;
}

/**
 * Soft-delete a user
 */
export async function deleteUser(id: string): Promise<void> {
  const response = await apiClient.delete<ApiResponse>(`/users/${id}`);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete user');
  }
}

/**
 * Activate or deactivate a user
 */
export async function updateUserStatus(id: string, status: 'active' | 'inactive'): Promise<Profile> {
  const response = await apiClient.patch<ApiResponse<Profile>>(`/users/${id}/status`, { status });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to update user status');
  }
  return response.data.data;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch dashboard stats');
  }
  return response.data.data;
}
