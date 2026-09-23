import { useState, useEffect, useRef, useCallback } from 'react';
import type { Attendance } from '../types';
import {
  getAttendanceStatus,
  checkIn as apiCheckIn,
  checkOut as apiCheckOut,
} from '../api/attendance';

// ─── Constants ───────────────────────────────────────────────────────────────

const WORK_DURATION_SECONDS = 8 * 60 * 60; // 8 hours in seconds

// ─── Hook ────────────────────────────────────────────────────────────────────

interface UseAttendanceReturn {
  /** The active or just-completed attendance record */
  attendance: Attendance | null;
  /** Whether the user is currently checked in */
  isCheckedIn: boolean;
  /** True if the user already completed a session today (prevents re-check-in) */
  alreadyCompletedToday: boolean;
  /** True if today is an admin-configured holiday */
  isHoliday: boolean;
  /** Holiday details if today is a holiday */
  holidayInfo: { id: string; title: string; description: string | null; date: string } | null;
  /** True if today is a weekend */
  isWeekend: boolean;
  /** True if check-in is allowed today */
  canCheckIn: boolean;
  /** Seconds elapsed since check-in (live, updates every second) */
  elapsedSeconds: number;
  /** True once the user has worked >= 8 hours */
  is8HoursComplete: boolean;
  /** Loading state for initial fetch and actions */
  loading: boolean;
  /** Loading state for check-in action only */
  checkingIn: boolean;
  /** Loading state for check-out action only */
  checkingOut: boolean;
  /** Error message if any */
  error: string | null;
  /** Triggers check-in */
  checkIn: () => Promise<void>;
  /** Triggers check-out — returns the completed Attendance */
  checkOut: () => Promise<Attendance | null>;
  /** Clear error */
  clearError: () => void;
}

export function useAttendance(): UseAttendanceReturn {
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [alreadyCompletedToday, setAlreadyCompletedToday] = useState(false);
  const [isHoliday, setIsHoliday] = useState(false);
  const [holidayInfo, setHolidayInfo] = useState<{ id: string; title: string; description: string | null; date: string } | null>(null);
  const [isWeekend, setIsWeekend] = useState(false);
  const [canCheckIn, setCanCheckIn] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Timer helpers ──────────────────────────────────────────────────────────

  const getElapsed = useCallback((checkInAt: string): number => {
    const checkInMs = new Date(checkInAt).getTime();
    const nowMs = Date.now();
    return Math.max(0, Math.floor((nowMs - checkInMs) / 1000));
  }, []);

  const startTimer = useCallback(
    (checkInAt: string) => {
      setElapsedSeconds(getElapsed(checkInAt));

      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setElapsedSeconds(getElapsed(checkInAt));
      }, 1000);
    },
    [getElapsed]
  );

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setElapsedSeconds(0);
  }, []);

  // ── On mount: restore active session ──────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const res = await getAttendanceStatus();

        if (cancelled) return;

        if (res.checked_in && res.data) {
          setAttendance(res.data);
          setIsCheckedIn(true);
          startTimer(res.data.check_in_at);
        }

        setAlreadyCompletedToday(res.already_completed_today);
        setIsHoliday(Boolean(res.is_holiday));
        setHolidayInfo(res.holiday || null);
        setIsWeekend(Boolean(res.is_weekend));
        setCanCheckIn(res.can_check_in ?? true);
      } catch (err) {
        if (!cancelled) {
          console.warn('Attendance status check failed:', err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  // ── Check-In ──────────────────────────────────────────────────────────────

  const checkIn = useCallback(async () => {
    setCheckingIn(true);
    setError(null);
    try {
      const record = await apiCheckIn();
      setAttendance(record);
      setIsCheckedIn(true);
      startTimer(record.check_in_at);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : 'Check-in failed');
      setError(msg);
    } finally {
      setCheckingIn(false);
    }
  }, [startTimer]);

  // ── Check-Out ─────────────────────────────────────────────────────────────

  const checkOut = useCallback(async (): Promise<Attendance | null> => {
    setCheckingOut(true);
    setError(null);
    try {
      const record = await apiCheckOut();
      stopTimer();
      setAttendance(record);
      setIsCheckedIn(false);
      setAlreadyCompletedToday(true);
      return record;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : 'Check-out failed');
      setError(msg);
      return null;
    } finally {
      setCheckingOut(false);
    }
  }, [stopTimer]);

  const clearError = useCallback(() => setError(null), []);

  // ── Derived state ─────────────────────────────────────────────────────────

  const is8HoursComplete = elapsedSeconds >= WORK_DURATION_SECONDS;

  return {
    attendance,
    isCheckedIn,
    alreadyCompletedToday,
    isHoliday,
    holidayInfo,
    isWeekend,
    canCheckIn,
    elapsedSeconds,
    is8HoursComplete,
    loading,
    checkingIn,
    checkingOut,
    error,
    checkIn,
    checkOut,
    clearError,
  };
}

// ─── Utility: format seconds → HH:MM:SS ──────────────────────────────────────

export function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}
