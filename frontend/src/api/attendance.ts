import apiClient from './client';
import type {
  Attendance,
  TimesheetEntry,
  TimesheetFormEntry,
  ApiResponse,
} from '../types';

// ─── Attendance Status ────────────────────────────────────────────────────────

/**
 * Get the current check-in status for the authenticated user.
 * Returns the active Attendance record (or null if not checked in).
 * Call this on page load to restore the live timer.
 */
export async function getAttendanceStatus(): Promise<{
  checked_in: boolean;
  data: Attendance | null;
}> {
  const res = await apiClient.get<
    ApiResponse<Attendance> & { checked_in: boolean }
  >('/attendance/status');
  return {
    checked_in: res.data.checked_in,
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
 * Fetch timesheet entries for a specific attendance session.
 */
export async function getTimesheet(attendanceId: string): Promise<TimesheetEntry[]> {
  const res = await apiClient.get<ApiResponse<TimesheetEntry[]>>(
    `/attendance/${attendanceId}/timesheet`
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to fetch timesheet');
  }
  return res.data.data ?? [];
}
