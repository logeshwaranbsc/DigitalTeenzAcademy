import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  RotateCcw,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getMyAttendanceHistory, getUserRegularisations } from '../api/attendance';
import type { AdminAttendanceRecord, AttendanceRegularisation } from '../types';
import RegulariseModal from './RegulariseModal';
import toast from 'react-hot-toast';

interface AttendanceDashboardSectionProps {
  userRole?: 'student' | 'employee';
}

interface DayChartData {
  dateStr: string; // YYYY-MM-DD
  dayLabel: string; // "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
  dateLabel: string; // e.g. "27"
  fullFormattedDate: string; // e.g. "Sunday, Sep 27, 2026"
  isToday: boolean;
  isFuture: boolean;
  hours: number;
  displayHoursFormatted: string;
  status: 'present' | 'absent' | 'pending_regularisation' | 'regularised' | 'holiday' | 'off';
  statusLabel: string;
  checkInAt?: string | null;
  checkOutAt?: string | null;
  regularisation?: AttendanceRegularisation;
  record?: AdminAttendanceRecord;
}

export const AttendanceDashboardSection: React.FC<AttendanceDashboardSectionProps> = () => {
  const [weekOffset, setWeekOffset] = useState(0); // 0 = this week (Sunday to Saturday)
  const [records, setRecords] = useState<AdminAttendanceRecord[]>([]);
  const [regularisations, setRegularisations] = useState<AttendanceRegularisation[]>([]);
  const [stats, setStats] = useState({
    total_records: 0,
    completed_count: 0,
    absent_count: 0,
    total_minutes: 0,
    total_hours_formatted: '0h 0min',
  });
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<DayChartData | null>(null);

  // Regularise modal
  const [regulariseOpen, setRegulariseOpen] = useState(false);
  const [selectedAbsentDate, setSelectedAbsentDate] = useState<string | undefined>(undefined);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [historyRes, regRes] = await Promise.all([
        getMyAttendanceHistory({ per_page: 60 }),
        getUserRegularisations().catch(() => []),
      ]);
      setRecords(historyRes.data || []);
      setStats(historyRes.stats || {
        total_records: 0,
        completed_count: 0,
        absent_count: 0,
        total_minutes: 0,
        total_hours_formatted: '0h 0min',
      });
      setRegularisations(regRes || []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Compute 7 days from Sunday to Saturday for the selected week
  const chartDays = useMemo(() => {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0); // Midnight of current local day

    const currentDayOfWeek = todayMidnight.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Calculate Sunday date of the active week
    const sunday = new Date(todayMidnight);
    sunday.setDate(todayMidnight.getDate() - currentDayOfWeek + (weekOffset * 7));
    sunday.setHours(0, 0, 0, 0);

    const result: DayChartData[] = [];

    // Map records and regularisations by date string YYYY-MM-DD
    const recordsByDate = new Map<string, AdminAttendanceRecord>();
    records.forEach((r) => {
      const d = r.check_in_at ? r.check_in_at.split('T')[0] : r.created_at?.split('T')[0];
      if (d) recordsByDate.set(d, r);
    });

    const regsByDate = new Map<string, AttendanceRegularisation>();
    regularisations.forEach((reg) => {
      if (reg.date) regsByDate.set(reg.date, reg);
    });

    // 7 days: 0 (Sunday) to 6 (Saturday)
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      d.setHours(0, 0, 0, 0);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dateNum = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dateNum}`;

      const isToday = d.getTime() === todayMidnight.getTime();
      const isPast = d.getTime() < todayMidnight.getTime();
      const isFuture = d.getTime() > todayMidnight.getTime();

      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' }); // Sun, Mon, Tue...
      const dateLabel = d.toLocaleDateString('en-US', { day: 'numeric' });
      const fullFormattedDate = d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const matchedRec = recordsByDate.get(dateStr);
      const matchedReg = regsByDate.get(dateStr);

      let status: DayChartData['status'] = 'off';
      let statusLabel = 'No Record';
      let hours = 0;
      let displayHoursFormatted = '0h 0m';

      if (matchedReg && matchedReg.status === 'pending') {
        // Pending regularisation: Yellow Bar!
        status = 'pending_regularisation';
        statusLabel = 'Pending Regularisation';
        if (matchedReg.requested_check_in_at && matchedReg.requested_check_out_at) {
          const inTime = new Date(matchedReg.requested_check_in_at).getTime();
          const outTime = new Date(matchedReg.requested_check_out_at).getTime();
          const diffHrs = Math.max(1, (outTime - inTime) / (1000 * 60 * 60));
          hours = Number(diffHrs.toFixed(1));
          displayHoursFormatted = `${hours}h (Requested)`;
        } else {
          hours = 8;
          displayHoursFormatted = '8h (Requested)';
        }
      } else if (
        (matchedReg && matchedReg.status === 'approved') ||
        matchedRec?.status === 'regularised'
      ) {
        // Regularised and Approved: Turns Green!
        status = 'regularised';
        statusLabel = 'Regularised (Approved)';
        if (matchedRec?.total_duration_minutes) {
          hours = Number((matchedRec.total_duration_minutes / 60).toFixed(1));
          displayHoursFormatted = matchedRec.total_duration_human || `${hours}h`;
        } else {
          hours = 8;
          displayHoursFormatted = '8h 0m';
        }
      } else if (matchedRec) {
        if (matchedRec.status === 'completed' || matchedRec.status === 'present') {
          // Present: Green Bar!
          status = 'present';
          statusLabel = 'Present';
          const mins = matchedRec.total_duration_minutes || 0;
          hours = Number((mins / 60).toFixed(1));
          displayHoursFormatted = matchedRec.total_duration_human || `${hours}h`;
        } else if (matchedRec.status === 'active') {
          status = 'present';
          statusLabel = 'Active Check-In';
          hours = 4;
          displayHoursFormatted = 'In Progress...';
        } else if (matchedRec.status === 'holiday') {
          status = 'holiday';
          statusLabel = 'Holiday';
          hours = 8;
          displayHoursFormatted = '8h (Holiday)';
        } else if (matchedRec.status === 'absent') {
          if (isToday) {
            // For today, during the day, remain empty (no red absent bar until day completes)
            status = 'off';
            statusLabel = 'Today (In Progress)';
            hours = 0;
            displayHoursFormatted = '0h (Today)';
          } else {
            // Past completed day -> Red full height
            status = 'absent';
            statusLabel = matchedReg?.status === 'rejected' ? 'Regularisation Rejected' : 'Absent';
            hours = 0;
            displayHoursFormatted = '0h (Absent)';
          }
        }
      } else {
        const dayOfWeek = d.getDay();
        // Sunday (0) is weekly holiday; Saturday (6) is a working day
        if (dayOfWeek === 0) {
          status = 'holiday';
          statusLabel = 'Sunday Holiday';
          hours = 8;
          displayHoursFormatted = '8h (Holiday)';
        } else if (isToday) {
          // TODAY: During the day, status bar remains EMPTY
          status = 'off';
          statusLabel = 'Today (Awaiting Check-In)';
          hours = 0;
          displayHoursFormatted = '0h (Today)';
        } else if (isPast) {
          // Past working day (Mon–Sat) without record -> marked as absent (Red full height)
          status = 'absent';
          statusLabel = 'Absent (No Check-In)';
          hours = 0;
          displayHoursFormatted = '0h (Absent)';
        } else {
          // Future working day
          status = 'off';
          statusLabel = 'Scheduled Working Day';
          hours = 0;
          displayHoursFormatted = '0h';
        }
      }

      result.push({
        dateStr,
        dayLabel,
        dateLabel,
        fullFormattedDate,
        isToday,
        isFuture,
        hours,
        displayHoursFormatted,
        status,
        statusLabel,
        checkInAt: matchedRec?.check_in_at || matchedReg?.requested_check_in_at,
        checkOutAt: matchedRec?.check_out_at || matchedReg?.requested_check_out_at,
        regularisation: matchedReg,
        record: matchedRec,
      });
    }

    return result;
  }, [weekOffset, records, regularisations]);

  const weekRangeLabel = useMemo(() => {
    if (chartDays.length < 7) return '';
    const first = chartDays[0];
    const last = chartDays[6];
    return `${first.dayLabel} ${first.dateLabel} — ${last.dayLabel} ${last.dateLabel}`;
  }, [chartDays]);

  // Max scale for Y-axis (minimum 8h, maximum scaled based on data)
  const maxYAxis = useMemo(() => {
    const maxHour = Math.max(...chartDays.map((d) => d.hours), 0);
    return Math.max(8, Math.ceil(maxHour + 1));
  }, [chartDays]);

  const yTicks = [
    maxYAxis,
    Math.round((maxYAxis * 3) / 4),
    Math.round(maxYAxis / 2),
    Math.round(maxYAxis / 4),
    0,
  ];

  const formatTimeStr = (iso?: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Four Stat Cards matching screenshot with hover lift */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sessions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 transition-all duration-300 flex items-center justify-between group cursor-pointer">
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              TOTAL SESSIONS
            </p>
            <p className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              {stats.total_records}
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300 shadow-2xs">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Days Attended */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1 hover:border-emerald-300 transition-all duration-300 flex items-center justify-between group cursor-pointer">
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              DAYS ATTENDED
            </p>
            <p className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              {stats.completed_count}
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300 shadow-2xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Hours Logged */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 flex items-center justify-between group cursor-pointer">
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              HOURS LOGGED
            </p>
            <p className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              {stats.total_hours_formatted}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300 shadow-2xs">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Absent Days */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1 hover:border-red-300 transition-all duration-300 flex items-center justify-between group cursor-pointer">
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              ABSENT DAYS
            </p>
            <p className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              {stats.absent_count}
            </p>
          </div>
          <div className="w-12 h-12 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-red-100 transition-all duration-300 shadow-2xs">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Daily Hours & Attendance Status Bar Chart (Sunday to Saturday) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 lg:p-7 space-y-6 hover:shadow-md transition-shadow">
        {/* Chart Header & Week Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base lg:text-lg font-black text-slate-900 tracking-tight">
                Weekly Attendance & Hours (Sunday – Saturday)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {weekRangeLabel ? `Viewing: ${weekRangeLabel}` : 'Sunday to Saturday weekly work view'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
            {/* Week Navigation (Sunday to Saturday) */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setWeekOffset((prev) => prev - 1)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition shadow-2xs cursor-pointer"
                title="Previous Week"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() => setWeekOffset(0)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${weekOffset === 0
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {weekOffset === 0 ? 'This Week (Sun–Sat)' : 'This Week'}
              </button>

              <button
                onClick={() => setWeekOffset((prev) => prev + 1)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition shadow-2xs cursor-pointer"
                title="Next Week"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="p-1.5 bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-indigo-600 rounded-xl transition cursor-pointer"
              title="Refresh Data"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Legend Row */}
        <div className="flex items-center gap-4 flex-wrap text-xs font-bold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-none bg-emerald-500 shadow-2xs inline-block" />
            <span>Present / Approved (Hours Worked)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-none bg-amber-500 shadow-2xs inline-block animate-pulse" />
            <span>Pending Regularisation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-none bg-red-500 shadow-2xs inline-block" />
            <span>Absent / Rejected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-none bg-indigo-500 shadow-2xs inline-block" />
            <span>Holiday </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-none bg-slate-200 border border-slate-300 inline-block" />
            <span>Off Day / No Log</span>
          </div>
        </div>

        {/* Main Chart Canvas Area */}
        <div className="relative pt-2">
          {/* Y-Axis Grid Lines & Label */}
          <div className="relative h-64 sm:h-72 w-full flex">
            {/* Left Y-Axis Ticks */}
            <div className="w-10 sm:w-12 h-full flex flex-col justify-between items-end pr-3 text-[11px] font-black text-slate-400 select-none pb-8">
              {yTicks.map((tickVal, idx) => (
                <span key={idx} className="leading-none">
                  {tickVal}h
                </span>
              ))}
            </div>

            {/* Bars Area with Horizontal Dashed Lines */}
            <div className="relative flex-1 h-full pb-8 flex items-end">
              {/* Horizontal Grid lines */}
              <div className="absolute inset-0 pb-8 flex flex-col justify-between pointer-events-none">
                {yTicks.map((_, idx) => (
                  <div
                    key={idx}
                    className="w-full border-b border-slate-100 border-dashed"
                  />
                ))}
              </div>

              {/* Bars Grid */}
              <div className="relative z-10 w-full h-full flex items-end justify-between gap-1.5 sm:gap-2 px-1">
                {chartDays.map((day) => {
                  const heightPercent =
                    day.status === 'absent'
                      ? 100 // Full height of the graph for absent days!
                      : day.hours > 0
                        ? Math.min(100, Math.max(10, (day.hours / maxYAxis) * 100))
                        : day.status === 'off'
                          ? 0
                          : 4;

                  // Determine bar background color styling - crisp rectangular bars
                  let barBgClass = 'bg-slate-200 hover:bg-slate-300 border-slate-300';
                  let barShadowClass = '';
                  if (day.status === 'present' || day.status === 'regularised') {
                    barBgClass =
                      'bg-gradient-to-t from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 border-emerald-400';
                    barShadowClass = 'shadow-xs hover:shadow-md';
                  } else if (day.status === 'pending_regularisation') {
                    barBgClass =
                      'bg-gradient-to-t from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 border-amber-300 animate-pulse';
                    barShadowClass = 'shadow-xs hover:shadow-md';
                  } else if (day.status === 'absent') {
                    barBgClass =
                      'bg-gradient-to-t from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 border-red-400';
                    barShadowClass = 'shadow-xs hover:shadow-md';
                  } else if (day.status === 'holiday') {
                    barBgClass =
                      'bg-gradient-to-t from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-400 border-indigo-300';
                  }

                  const isHovered = hoveredDay?.dateStr === day.dateStr;

                  return (
                    <div
                      key={day.dateStr}
                      className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      onClick={() => {
                        if (day.status === 'absent') {
                          setSelectedAbsentDate(day.dateStr);
                          setRegulariseOpen(true);
                        }
                      }}
                    >
                      {/* Floating Tooltip directly above the bar on hover */}
                      {isHovered && (
                        <div className="absolute bottom-full mb-2 z-30 pointer-events-auto bg-slate-900 text-white p-2.5 rounded-xl shadow-xl border border-slate-700 min-w-[170px] max-w-[220px] text-xs space-y-1 animate-fade-in -translate-x-1/2 left-1/2">
                          <p className="font-bold text-[11px] text-slate-200 truncate">
                            {day.fullFormattedDate}
                          </p>
                          <div className="flex items-center justify-between text-[10px] pt-0.5">
                            <span className="text-slate-400">Status:</span>
                            <span
                              className={`font-black uppercase tracking-wider ${day.status === 'present' || day.status === 'regularised'
                                ? 'text-emerald-400'
                                : day.status === 'pending_regularisation'
                                  ? 'text-amber-400'
                                  : day.status === 'absent'
                                    ? 'text-red-400'
                                    : 'text-slate-300'
                                }`}
                            >
                              {day.statusLabel}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">Hours:</span>
                            <span className="font-bold text-white">
                              {day.displayHoursFormatted}
                            </span>
                          </div>
                          {day.checkInAt && (
                            <div className="text-[10px] text-slate-300 pt-0.5 border-t border-slate-800 flex justify-between">
                              <span>In: {formatTimeStr(day.checkInAt)}</span>
                              <span>Out: {formatTimeStr(day.checkOutAt)}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Hours label on top of bar */}
                      {day.hours > 0 && (
                        <span
                          className={`text-[10px] font-black mb-1 opacity-0 group-hover:opacity-100 transition-opacity ${day.status === 'pending_regularisation'
                            ? 'text-amber-700 font-extrabold'
                            : 'text-emerald-700'
                            }`}
                        >
                          {day.hours}h
                        </span>
                      )}

                      {/* The Rectangle Bar Column */}
                      <div className="w-full max-w-[44px] h-full flex items-end justify-center">
                        {heightPercent > 0 ? (
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-none border transition-all duration-200 group-hover:brightness-105 ${barBgClass} ${barShadowClass} ${day.isToday ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
                              }`}
                          />
                        ) : (
                          <div className="w-full h-0" />
                        )}
                      </div>

                      {/* X-Axis Day Labels below the bar */}
                      <div className="absolute -bottom-7 flex flex-col items-center select-none">
                        <span
                          className={`text-[10px] sm:text-xs font-black tracking-tight ${day.isToday
                            ? 'text-indigo-600 font-black'
                            : 'text-slate-600 group-hover:text-slate-900'
                            }`}
                        >
                          {day.dayLabel}
                        </span>
                        <span
                          className={`text-[9px] sm:text-[10px] font-bold ${day.isToday ? 'text-indigo-600' : 'text-slate-400'
                            }`}
                        >
                          {day.dateLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regularise Attendance Modal */}
      <RegulariseModal
        isOpen={regulariseOpen}
        onClose={() => setRegulariseOpen(false)}
        defaultDate={selectedAbsentDate}
        onSuccess={fetchData}
      />
    </div>
  );
};
