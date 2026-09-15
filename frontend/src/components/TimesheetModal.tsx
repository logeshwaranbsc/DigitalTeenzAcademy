import { useState, useCallback, useId } from 'react';
import {
  X,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ClipboardList,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Attendance, TimesheetFormEntry } from '../types';
import { submitTimesheet } from '../api/attendance';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function minutesToHM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function formatDatetime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-IN', { dateStyle: 'long' });
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface TimesheetModalProps {
  attendance: Attendance | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

// ─── Default blank entry ──────────────────────────────────────────────────────

function blankEntry(key: string): TimesheetFormEntry {
  return { _key: key, task: '', task_description: '', hours: 0, minutes: 0 };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TimesheetModal({
  attendance,
  isOpen,
  onClose,
  onSubmitted,
}: TimesheetModalProps) {
  const uid = useId();
  const [entries, setEntries] = useState<TimesheetFormEntry[]>([
    blankEntry(`${uid}-0`),
  ]);
  const [submitting, setSubmitting] = useState(false);

  // ── Entry management ───────────────────────────────────────────────────────

  const addEntry = useCallback(() => {
    setEntries((prev) => [
      ...prev,
      blankEntry(`${uid}-${Date.now()}`),
    ]);
  }, [uid]);

  const removeEntry = useCallback((key: string) => {
    setEntries((prev) => prev.filter((e) => e._key !== key));
  }, []);

  const updateEntry = useCallback(
    (key: string, field: keyof TimesheetFormEntry, value: string | number) => {
      setEntries((prev) =>
        prev.map((e) => (e._key === key ? { ...e, [field]: value } : e))
      );
    },
    []
  );

  // ── Derived values ─────────────────────────────────────────────────────────

  const totalTimesheetMinutes = entries.reduce(
    (sum, e) => sum + e.hours * 60 + e.minutes,
    0
  );
  const sessionMinutes = attendance?.total_duration_minutes ?? 0;
  const diffMinutes = Math.abs(totalTimesheetMinutes - sessionMinutes);
  const timesheetMatchesSession =
    sessionMinutes > 0 && Math.abs(totalTimesheetMinutes - sessionMinutes) <= 5;

  // ── Validation ─────────────────────────────────────────────────────────────

  const validate = (): string | null => {
    if (entries.length === 0) return 'Add at least one task entry.';
    for (const e of entries) {
      if (!e.task.trim()) return 'Each entry must have a task name.';
      if (e.hours * 60 + e.minutes <= 0) {
        return `Entry "${e.task || 'unnamed'}" must have a duration greater than 0.`;
      }
    }
    if (totalTimesheetMinutes <= 0) return 'Total timesheet duration must be greater than 0.';
    return null;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    if (!attendance) return;

    setSubmitting(true);
    try {
      await submitTimesheet(attendance.id, entries);
      toast.success('Timesheet submitted successfully! 🎉');
      setEntries([blankEntry(`${uid}-reset`)]);
      onSubmitted();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : 'Failed to submit timesheet');
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  if (!isOpen || !attendance) return null;

  const sessionDurationHuman = sessionMinutes > 0
    ? minutesToHM(sessionMinutes)
    : '—';

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15,23,42,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="timesheet-modal-title"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '760px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#fff',
            borderRadius: '20px',
            boxShadow:
              '0 25px 60px rgba(15,23,42,0.18), 0 4px 16px rgba(15,23,42,0.08)',
            pointerEvents: 'all',
            animation: 'slideUp 0.25s ease',
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '20px 24px 16px',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ClipboardList size={20} style={{ color: '#fff' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h2
                id="timesheet-modal-title"
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                Timesheet Entry
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>
                Log what you worked on during this session
              </p>
            </div>
            <button
              id="btn-close-timesheet"
              onClick={onClose}
              style={{
                padding: '6px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#f1f5f9';
                (e.currentTarget as HTMLButtonElement).style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Session Summary ── */}
          <div
            style={{
              margin: '16px 24px',
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              border: '1px solid #bae6fd',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '12px',
            }}
          >
            {[
              {
                icon: Calendar,
                label: 'Date',
                value: formatDate(attendance.check_in_at),
                color: '#0284c7',
              },
              {
                icon: Clock,
                label: 'Check-In',
                value: formatDatetime(attendance.check_in_at),
                color: '#0284c7',
              },
              {
                icon: Clock,
                label: 'Check-Out',
                value: attendance.check_out_at
                  ? formatDatetime(attendance.check_out_at)
                  : '—',
                color: '#0284c7',
              },
              {
                icon: CheckCircle2,
                label: 'Total Duration',
                value: sessionDurationHuman,
                color: '#059669',
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    marginBottom: '3px',
                  }}
                >
                  <Icon size={12} style={{ color }} />
                  <span
                    style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    {label}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* ── Task Entries ── */}
          <div style={{ padding: '0 24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#1e293b',
                }}
              >
                Tasks
              </h3>
              <button
                id="btn-add-timesheet-row"
                onClick={addEntry}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(99,102,241,0.3)',
                  background: 'rgba(99,102,241,0.06)',
                  color: '#6366f1',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'rgba(99,102,241,0.12)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'rgba(99,102,241,0.06)';
                }}
              >
                <Plus size={13} />
                Add Task
              </button>
            </div>

            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.5fr 140px 36px',
                gap: '8px',
                padding: '6px 8px',
                background: '#f8fafc',
                borderRadius: '8px',
                marginBottom: '6px',
              }}
            >
              {['Task', 'Description', 'Duration', ''].map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {entries.map((entry, idx) => (
                <div
                  key={entry._key}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.5fr 140px 36px',
                    gap: '8px',
                    alignItems: 'start',
                    padding: '8px',
                    borderRadius: '10px',
                    border: '1px solid #f1f5f9',
                    background: '#fff',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#f1f5f9';
                  }}
                >
                  {/* Task name */}
                  <input
                    id={`timesheet-task-${idx}`}
                    type="text"
                    placeholder="e.g. Development"
                    value={entry.task}
                    onChange={(e) => updateEntry(entry._key, 'task', e.target.value)}
                    style={inputStyle}
                  />

                  {/* Description */}
                  <input
                    id={`timesheet-desc-${idx}`}
                    type="text"
                    placeholder="Brief description…"
                    value={entry.task_description}
                    onChange={(e) =>
                      updateEntry(entry._key, 'task_description', e.target.value)
                    }
                    style={inputStyle}
                  />

                  {/* Duration */}
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <input
                        id={`timesheet-hours-${idx}`}
                        type="number"
                        min={0}
                        max={23}
                        placeholder="0"
                        value={entry.hours || ''}
                        onChange={(e) =>
                          updateEntry(
                            entry._key,
                            'hours',
                            Math.max(0, Math.min(23, parseInt(e.target.value) || 0))
                          )
                        }
                        style={{ ...inputStyle, paddingRight: '22px' }}
                      />
                      <span style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>h</span>
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <input
                        id={`timesheet-mins-${idx}`}
                        type="number"
                        min={0}
                        max={59}
                        placeholder="0"
                        value={entry.minutes || ''}
                        onChange={(e) =>
                          updateEntry(
                            entry._key,
                            'minutes',
                            Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                          )
                        }
                        style={{ ...inputStyle, paddingRight: '26px' }}
                      />
                      <span style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>min</span>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    id={`btn-remove-row-${idx}`}
                    onClick={() => removeEntry(entry._key)}
                    disabled={entries.length <= 1}
                    style={{
                      padding: '6px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      cursor: entries.length <= 1 ? 'not-allowed' : 'pointer',
                      color: entries.length <= 1 ? '#cbd5e1' : '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s',
                      marginTop: '2px',
                    }}
                    onMouseEnter={(e) => {
                      if (entries.length > 1) {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          'rgba(239,68,68,0.08)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    }}
                    title="Remove row"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* ── Total row ── */}
            <div
              style={{
                marginTop: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                background:
                  totalTimesheetMinutes === 0
                    ? '#f8fafc'
                    : timesheetMatchesSession
                    ? 'rgba(16,185,129,0.06)'
                    : 'rgba(245,158,11,0.06)',
                border:
                  totalTimesheetMinutes === 0
                    ? '1px solid #e2e8f0'
                    : timesheetMatchesSession
                    ? '1px solid rgba(16,185,129,0.2)'
                    : '1px solid rgba(245,158,11,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {timesheetMatchesSession ? (
                  <CheckCircle2 size={15} style={{ color: '#10b981' }} />
                ) : totalTimesheetMinutes > 0 ? (
                  <AlertTriangle size={15} style={{ color: '#f59e0b' }} />
                ) : (
                  <Clock size={15} style={{ color: '#94a3b8' }} />
                )}
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                  Timesheet Total
                </span>
                {sessionMinutes > 0 && totalTimesheetMinutes > 0 && !timesheetMatchesSession && (
                  <span style={{ fontSize: '12px', color: '#f59e0b' }}>
                    ({diffMinutes}m {totalTimesheetMinutes > sessionMinutes ? 'over' : 'under'} session time)
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color:
                    timesheetMatchesSession
                      ? '#10b981'
                      : totalTimesheetMinutes > 0
                      ? '#f59e0b'
                      : '#94a3b8',
                }}
              >
                {totalTimesheetMinutes > 0 ? minutesToHM(totalTimesheetMinutes) : '0m'}
              </span>
            </div>

            {/* ── Hint ── */}
            {sessionMinutes > 0 && !timesheetMatchesSession && totalTimesheetMinutes > 0 && (
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                Your session was <strong>{minutesToHM(sessionMinutes)}</strong>. You can still submit even if the totals differ.
              </p>
            )}
          </div>

          {/* ── Footer actions ── */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              padding: '16px 24px 20px',
              borderTop: '1px solid #f1f5f9',
              marginTop: '16px',
            }}
          >
            <button
              id="btn-cancel-timesheet"
              onClick={onClose}
              disabled={submitting}
              style={{
                padding: '8px 20px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: '#fff',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#fff';
              }}
            >
              Cancel
            </button>
            <button
              id="btn-submit-timesheet"
              onClick={handleSubmit}
              disabled={submitting || entries.length === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 20px',
                borderRadius: '10px',
                border: 'none',
                background:
                  submitting
                    ? 'rgba(99,102,241,0.6)'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
                transition: 'all 0.15s',
              }}
            >
              {submitting ? (
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <CheckCircle2 size={14} />
              )}
              {submitting ? 'Submitting…' : 'Submit Timesheet'}
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

// ─── Shared input style ───────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 8px',
  borderRadius: '7px',
  border: '1px solid #e2e8f0',
  fontSize: '13px',
  color: '#1e293b',
  outline: 'none',
  background: '#f8fafc',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};
