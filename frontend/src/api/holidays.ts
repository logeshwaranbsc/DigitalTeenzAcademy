import client from './client';
import type { ApiResponse, Holiday, HolidayFormData } from '../types';

export interface GetHolidaysParams {
  year?: number;
  month?: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Fetch organization holidays (available to all authenticated users).
 */
export async function getHolidays(params?: GetHolidaysParams): Promise<Holiday[]> {
  const res = await client.get<ApiResponse<Holiday[]>>('/holidays', { params });
  return res.data.data || [];
}

/**
 * Create a new holiday (Admin only).
 */
export async function createHoliday(data: HolidayFormData): Promise<Holiday> {
  const res = await client.post<ApiResponse<Holiday>>('/holidays', data);
  if (!res.data.data) {
    throw new Error(res.data.message || 'Failed to create holiday');
  }
  return res.data.data;
}

/**
 * Update an existing holiday (Admin only).
 */
export async function updateHoliday(id: string, data: Partial<HolidayFormData>): Promise<Holiday> {
  const res = await client.put<ApiResponse<Holiday>>(`/holidays/${id}`, data);
  if (!res.data.data) {
    throw new Error(res.data.message || 'Failed to update holiday');
  }
  return res.data.data;
}

/**
 * Delete a holiday (Admin only).
 */
export async function deleteHoliday(id: string): Promise<void> {
  await client.delete<ApiResponse<void>>(`/holidays/${id}`);
}
