// ─── User / Profile Types ────────────────────────────────────────────────────

export type UserRole = 'admin' | 'student' | 'employee';
export type UserStatus = 'active' | 'inactive';

export interface Profile {
  id: string;
  auth_user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: 'student' | 'employee';
  status: UserStatus;
  password?: string;
}

// ─── API Response Types ──────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── Dashboard Types ─────────────────────────────────────────────────────────

export interface DashboardStats {
  total_students: number;
  total_employees: number;
  active_users: number;
  inactive_users: number;
  total_users: number;
}

// ─── Auth Types ──────────────────────────────────────────────────────────────

export interface AuthState {
  user: import('@supabase/supabase-js').User | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
}

// ─── Filter / Query Types ────────────────────────────────────────────────────

export interface UserFilters {
  search?: string;
  role?: UserRole | '';
  status?: UserStatus | '';
  page?: number;
  per_page?: number;
}

// ─── Attendance / Check-In Types ─────────────────────────────────────────────

export type AttendanceStatus = 'active' | 'completed' | 'absent' | 'present';
export type AttendanceUserType = 'student' | 'employee';

export interface Attendance {
  id: string;
  profile_id: string;
  user_type: AttendanceUserType;
  check_in_at: string;        // ISO 8601 string
  check_out_at: string | null;
  total_duration_minutes: number | null;
  total_duration_human: string | null;
  status: AttendanceStatus;
  created_at: string;
  updated_at: string;
}

export interface AdminAttendanceRecord extends Attendance {
  profile?: {
    id: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    email: string;
    role: UserRole;
    avatar_url: string | null;
  };
  timesheet_entries?: TimesheetEntry[];
}

export interface AttendanceFilters {
  search?: string;
  profile_id?: string;
  user_type?: AttendanceUserType | '' | 'all';
  role?: AttendanceUserType | '' | 'all';
  date?: string;
  start_date?: string;
  end_date?: string;
  status?: AttendanceStatus | '' | 'all';
  page?: number;
  per_page?: number;
}

export interface AdminAttendanceStats {
  total_records: number;
  active_count: number;
  completed_count: number;
  total_minutes: number;
  total_hours_formatted: string;
}

// ─── Attendance Regularisation Types ──────────────────────────────────────────

export type RegularisationStatus = 'pending' | 'approved' | 'rejected';

export interface AttendanceRegularisation {
  id: string;
  attendance_id?: string | null;
  profile_id: string;
  date: string;
  requested_check_in_at: string;
  requested_check_out_at: string;
  requested_duration_human?: string;
  reason: string | null;
  status: RegularisationStatus;
  admin_id?: string | null;
  admin_remarks?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at?: string;
  profile?: {
    id: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    email: string;
    role: UserRole;
    avatar_url: string | null;
  };
  admin?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface RegularisationFormData {
  date: string;
  check_in_time: string;
  check_out_time: string;
  reason?: string;
}

// ─── Timesheet Types ─────────────────────────────────────────────────────────

export interface TimesheetEntry {
  id: string;
  attendance_id: string;
  profile_id: string;
  task: string;
  task_description: string | null;
  duration_minutes: number;
  duration_human: string;
  created_at: string;
  updated_at: string;
}

/** Used in the UI form before submission — no id yet */
export interface TimesheetFormEntry {
  /** Temp client-side key for React list rendering */
  _key: string;
  task: string;
  task_description: string;
  /** Hours portion (0–23) */
  hours: number;
  /** Minutes portion (0–59) */
  minutes: number;
}
