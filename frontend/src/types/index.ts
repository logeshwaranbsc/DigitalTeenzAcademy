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

export type AttendanceStatus = 'active' | 'completed';
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
