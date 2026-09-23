import apiClient from './client';
import type {
  Attendance,
  AdminAttendanceRecord,
  AttendanceFilters,
  AdminAttendanceStats,
  AttendanceRegularisation,
  RegularisationFormData,
  TimesheetEntry,
  TimesheetFormEntry,
  ApiResponse,
  PaginatedResponse,
} from '../types';

/**
 * Fetch all attendance records for admin with filtering and stats.
 */
export async function getAdminAttendance(
  filters: AttendanceFilters = {}
): Promise<PaginatedResponse<AdminAttendanceRecord> & { stats: AdminAttendanceStats }> {
  const params: Record<string, string | number> = {};

  if (filters.search) params.search = filters.search;
  if (filters.profile_id) params.profile_id = filters.profile_id;
  if (filters.user_type && filters.user_type !== 'all') params.user_type = filters.user_type;
  if (filters.role && filters.role !== 'all') params.role = filters.role;
  if (filters.date) params.date = filters.date;
  if (filters.start_date) params.start_date = filters.start_date;
  if (filters.end_date) params.end_date = filters.end_date;
  if (filters.status && filters.status !== 'all') params.status = filters.status;
  if (filters.page) params.page = filters.page;
  if (filters.per_page) params.per_page = filters.per_page;

  const res = await apiClient.get<
    ApiResponse<AdminAttendanceRecord[]> & {
      stats: AdminAttendanceStats;
      meta: PaginatedResponse<AdminAttendanceRecord>['meta'];
    }
  >('/attendance', { params });

  return {
    data: res.data.data ?? [],
    stats: res.data.stats ?? {
      total_records: 0,
      active_count: 0,
      completed_count: 0,
      total_minutes: 0,
      total_hours_formatted: '0h 0min',
    },
    meta: res.data.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: null,
      to: null,
    },
  };
}

// ─── Attendance Status ────────────────────────────────────────────────────────

/**
 * Get the current check-in status for the authenticated user.
 * Returns the active Attendance record (or null if not checked in).
 * Includes holiday & weekend status.
 */
export async function getAttendanceStatus(): Promise<{
  checked_in: boolean;
  already_completed_today: boolean;
  is_holiday?: boolean;
  holiday?: { id: string; title: string; description: string | null; date: string } | null;
  is_weekend?: boolean;
  can_check_in?: boolean;
  data: Attendance | null;
}> {
  const res = await apiClient.get<
    ApiResponse<Attendance> & {
      checked_in: boolean;
      already_completed_today: boolean;
      is_holiday?: boolean;
      holiday?: { id: string; title: string; description: string | null; date: string } | null;
      is_weekend?: boolean;
      can_check_in?: boolean;
    }
  >('/attendance/status');
  return {
    checked_in: res.data.checked_in,
    already_completed_today: res.data.already_completed_today ?? false,
    is_holiday: res.data.is_holiday ?? false,
    holiday: res.data.holiday ?? null,
    is_weekend: res.data.is_weekend ?? false,
    can_check_in: res.data.can_check_in ?? true,
    data: res.data.data ?? null,
  };
}

// ─── Check-In ────────────────────────────────────────────────────────────────

/**
 * Check in the authenticated user. Returns the new Attendance record.
 */
export async function checkIn(): Promise<Attendance> {
  const res = await apiClient.post<ApiResponse<Attendance>>('/attendance/check-in');
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || 'Check-in failed');
  }
  return res.data.data;
}

// ─── Check-Out ───────────────────────────────────────────────────────────────

/**
 * Check out the authenticated user. Returns the completed Attendance record
 * with check_out_at and total_duration_minutes populated.
 */
export async function checkOut(): Promise<Attendance> {
  const res = await apiClient.post<ApiResponse<Attendance>>('/attendance/check-out');
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || 'Check-out failed');
  }
  return res.data.data;
}

// ─── Timesheet ────────────────────────────────────────────────────────────────

/**
 * Submit timesheet entries for a completed attendance session.
 * Converts the UI form format (hours + minutes fields) to duration_minutes.
 */
export async function submitTimesheet(
  attendanceId: string,
  entries: TimesheetFormEntry[]
): Promise<TimesheetEntry[]> {
  const payload = entries.map((e) => ({
    task: e.task,
    task_description: e.task_description || null,
    duration_minutes: e.hours * 60 + e.minutes,
  }));

  const res = await apiClient.post<ApiResponse<TimesheetEntry[]>>(
    `/attendance/${attendanceId}/timesheet`,
    { entries: payload }
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || 'Failed to submit timesheet');
  }
  return res.data.data;
}

/**
 * Fetch personal attendance history for student/employee with stats.
 */
export async function getMyAttendanceHistory(
  filters: { start_date?: string; end_date?: string; date?: string; page?: number; per_page?: number } = {}
): Promise<
  PaginatedResponse<AdminAttendanceRecord> & {
    stats: {
      total_records: number;
      completed_count: number;
      absent_count: number;
      total_minutes: number;
      total_hours_formatted: string;
    };
  }
> {
  const res = await apiClient.get<
    ApiResponse<AdminAttendanceRecord[]> & {
      stats: {
        total_records: number;
        completed_count: number;
        absent_count: number;
        total_minutes: number;
        total_hours_formatted: string;
      };
      meta: PaginatedResponse<AdminAttendanceRecord>['meta'];
    }
  >('/attendance/my-history', { params: filters });

  return {
    data: res.data.data ?? [],
    stats: res.data.stats ?? {
      total_records: 0,
      completed_count: 0,
      absent_count: 0,
      total_minutes: 0,
      total_hours_formatted: '0h 0min',
    },
    meta: res.data.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: null,
      to: null,
    },
  };
}

// ─── Attendance Regularisation ───────────────────────────────────────────────

/**
 * Fetch regularisation requests for the authenticated user.
 */
export async function getUserRegularisations(): Promise<AttendanceRegularisation[]> {
  const res = await apiClient.get<ApiResponse<AttendanceRegularisation[]>>(
    '/attendance/regularisations'
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to fetch regularisation requests');
  }
  return res.data.data ?? [];
}

/**
 * Submit a regularisation request.
 */
export async function submitRegularisation(
  data: RegularisationFormData
): Promise<AttendanceRegularisation> {
  const res = await apiClient.post<ApiResponse<AttendanceRegularisation>>(
    '/attendance/regularisations',
    data
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || 'Failed to submit regularisation request');
  }
  return res.data.data;
}

/**
 * Fetch regularisation requests for Admin review.
 */
export async function getAdminRegularisations(
  filters: { status?: string; search?: string; role?: string; date?: string; page?: number; per_page?: number } = {}
): Promise<PaginatedResponse<AttendanceRegularisation>> {
  const res = await apiClient.get<
    ApiResponse<AttendanceRegularisation[]> & { meta: PaginatedResponse<AttendanceRegularisation>['meta'] }
  >('/admin/regularisations', { params: filters });

  return {
    data: res.data.data ?? [],
    meta: res.data.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: null,
      to: null,
    },
  };
}

/**
 * Admin approves a regularisation request.
 */
export async function approveRegularisation(id: string): Promise<AttendanceRegularisation> {
  const res = await apiClient.post<ApiResponse<AttendanceRegularisation>>(
    `/admin/regularisations/${id}/approve`
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || 'Failed to approve regularisation request');
  }
  return res.data.data;
}

/**
 * Admin rejects a regularisation request.
 */
export async function rejectRegularisation(
  id: string,
  admin_remarks?: string
): Promise<AttendanceRegularisation> {
  const res = await apiClient.post<ApiResponse<AttendanceRegularisation>>(
    `/admin/regularisations/${id}/reject`,
    { admin_remarks }
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || 'Failed to reject regularisation request');
  }
  return res.data.data;
}
