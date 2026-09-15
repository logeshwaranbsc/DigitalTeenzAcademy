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
      // Immediately set current elapsed
      setElapsedSeconds(getElapsed(checkInAt));

      // Clear any existing timer
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
        const { checked_in, already_completed_today, data } = await getAttendanceStatus();

        if (cancelled) return;

        if (checked_in && data) {
          setAttendance(data);
          setIsCheckedIn(true);
          startTimer(data.check_in_at);
        }

        setAlreadyCompletedToday(already_completed_today);
      } catch (err) {
        if (!cancelled) {
          // Non-fatal: user may not be a student/employee (e.g. admin)
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
      setAlreadyCompletedToday(true); // lock check-in for the rest of the day
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
