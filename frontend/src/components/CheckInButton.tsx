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
    alreadyCompletedToday,
    isHoliday,
    holidayInfo,
    isWeekend,
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

        {/* Check-Out button — enabled only after 8 hours */}
        <button
          id="btn-check-out"
          onClick={handleCheckOut}
          disabled={!is8HoursComplete || checkingOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '10px',
            border: !is8HoursComplete
              ? '1px solid rgba(148,163,184,0.3)'
              : '1px solid rgba(245,158,11,0.35)',
            background: !is8HoursComplete
              ? 'rgba(148,163,184,0.08)'
              : checkingOut
              ? 'rgba(245,158,11,0.08)'
              : 'rgba(245,158,11,0.12)',
            color: !is8HoursComplete ? '#94a3b8' : '#d97706',
            fontSize: '13px',
            fontWeight: 600,
            cursor: (!is8HoursComplete || checkingOut) ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            outline: 'none',
            opacity: !is8HoursComplete ? 0.65 : 1,
          }}
          title={!is8HoursComplete ? 'Check-out is available after 8 hours of work' : 'Check Out'}
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

  // ── Holiday state ──────────────────────────────────────────────────────────

  if (isHoliday) {
    return (
      <div
        title={holidayInfo?.description || 'Today is an organization holiday'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '10px',
          border: '1px solid rgba(99,102,241,0.3)',
          background: 'rgba(99,102,241,0.1)',
          color: '#4f46e5',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        <Clock size={14} style={{ color: '#6366f1', flexShrink: 0 }} />
        <span>Holiday: {holidayInfo?.title || 'Organization Holiday'}</span>
      </div>
    );
  }

  // ── Non-working day (Weekend) state ────────────────────────────────────────

  if (isWeekend) {
    return (
      <div
        title="Check-in is not active on weekends"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '10px',
          border: '1px solid rgba(148,163,184,0.3)',
          background: 'rgba(148,163,184,0.1)',
          color: '#64748b',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        <Clock size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
        <span>Weekend (Non-Working Day)</span>
      </div>
    );
  }

  // ── Already completed today ─────────────────────────────────────────────

  if (alreadyCompletedToday) {
    return (
      <div
        title="You have already checked in and out today"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '10px',
          border: '1px solid rgba(16,185,129,0.2)',
          background: 'rgba(16,185,129,0.06)',
          color: '#059669',
          fontSize: '13px',
          fontWeight: 600,
          opacity: 0.85,
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        <CheckCircle size={14} style={{ color: '#10b981', flexShrink: 0 }} />
        <span style={{ color: '#047857' }}>Done for today</span>
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
