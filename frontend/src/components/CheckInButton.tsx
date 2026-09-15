import { useEffect } from 'react';
import { LogIn, LogOut, Clock, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Attendance } from '../types';
import { useAttendance, formatElapsed } from '../hooks/useAttendance';

// ─── Props ───────────────────────────────────────────────────────────────────

interface CheckInButtonProps {
  /** Called after a successful checkout, with the completed attendance record */
  onCheckOut: (attendance: Attendance) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CheckInButton({ onCheckOut }: CheckInButtonProps) {
  const {
    isCheckedIn,
    elapsedSeconds,
    is8HoursComplete,
    loading,
    checkingIn,
    checkingOut,
    error,
    checkIn,
    checkOut,
    clearError,
  } = useAttendance();

  // Show errors as toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleCheckIn = async () => {
    await checkIn();
    toast.success('Checked in! Your session timer has started.');
  };

  const handleCheckOut = async () => {
    const record = await checkOut();
    if (record) {
      toast.success('Checked out successfully!');
      onCheckOut(record);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '10px',
          background: 'rgba(148,163,184,0.12)',
          border: '1px solid rgba(148,163,184,0.2)',
          minWidth: '110px',
          height: '36px',
        }}
      >
        <Loader2 size={14} style={{ color: '#94a3b8', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>Loading…</span>
      </div>
    );
  }

  // ── Checked-In state: Check-Out button + live timer ───────────────────────

  if (isCheckedIn) {
    const timerColor = is8HoursComplete ? '#10b981' : '#f59e0b';
    const timerBg   = is8HoursComplete ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)';
    const timerBorder = is8HoursComplete ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)';

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Live timer badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            borderRadius: '8px',
            background: timerBg,
            border: `1px solid ${timerBorder}`,
          }}
        >
          {is8HoursComplete ? (
            <CheckCircle size={13} style={{ color: timerColor, flexShrink: 0 }} />
          ) : (
            <Clock size={13} style={{ color: timerColor, flexShrink: 0 }} />
          )}
          <span
            style={{
              fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
              fontSize: '13px',
              fontWeight: 600,
              color: timerColor,
              letterSpacing: '0.04em',
            }}
          >
            {formatElapsed(elapsedSeconds)}
          </span>
          {is8HoursComplete && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: timerColor,
                background: 'rgba(16,185,129,0.15)',
                padding: '1px 5px',
                borderRadius: '4px',
                marginLeft: '2px',
              }}
            >
              8h ✓
            </span>
          )}
        </div>

        {/* Check-Out button */}
        <button
          id="btn-check-out"
          onClick={handleCheckOut}
          disabled={checkingOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(245,158,11,0.35)',
            background: checkingOut
              ? 'rgba(245,158,11,0.08)'
              : 'rgba(245,158,11,0.12)',
            color: '#d97706',
            fontSize: '13px',
            fontWeight: 600,
            cursor: checkingOut ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            if (!checkingOut) {
              (e.currentTarget as HTMLButtonElement).style.background =
                'rgba(245,158,11,0.2)';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              'rgba(245,158,11,0.12)';
          }}
          title="Check Out"
        >
          {checkingOut ? (
            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <LogOut size={14} />
          )}
          <span>{checkingOut ? 'Checking Out…' : 'Check Out'}</span>
        </button>
      </div>
    );
  }

  // ── Not checked-in state: Check-In button ─────────────────────────────────

  return (
    <button
      id="btn-check-in"
      onClick={handleCheckIn}
      disabled={checkingIn}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: '10px',
        border: '1px solid rgba(16,185,129,0.35)',
        background: checkingIn
          ? 'rgba(16,185,129,0.08)'
          : 'rgba(16,185,129,0.12)',
        color: '#059669',
        fontSize: '13px',
        fontWeight: 600,
        cursor: checkingIn ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        if (!checkingIn) {
          (e.currentTarget as HTMLButtonElement).style.background =
            'rgba(16,185,129,0.2)';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          'rgba(16,185,129,0.12)';
      }}
      title="Check In"
    >
      {checkingIn ? (
        <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        <LogIn size={14} />
      )}
      <span>{checkingIn ? 'Checking In…' : 'Check In'}</span>
    </button>
  );
}
