import { useEffect, useState, useCallback } from 'react';
import {
  getAdminAttendance,
  getAdminRegularisations,
  approveRegularisation,
  rejectRegularisation,
} from '../../api/attendance';
import { getUsers } from '../../api/users';
import type {
  AdminAttendanceRecord,
  AdminAttendanceStats,
  AttendanceFilters,
  AttendanceRegularisation,
  PaginationMeta,
  Profile,
  TimesheetEntry,
} from '../../types';
import {
  Clock,
  Search,
  Calendar,
  Filter,
  UserCheck,
  User,
  CheckCircle2,
  XCircle,
  ListTodo,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  Briefcase,
  FileText,
  AlertCircle,
  Check,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<'attendance' | 'regularisations'>('attendance');

  // Attendance Records State
  const [records, setRecords] = useState<AdminAttendanceRecord[]>([]);
  const [stats, setStats] = useState<AdminAttendanceStats>({
    total_records: 0,
    active_count: 0,
    completed_count: 0,
    total_minutes: 0,
    total_hours_formatted: '0h 0min',
  });
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: null,
    to: null,
  });
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState<Profile[]>([]);

  // Attendance Filter state
  const [filters, setFilters] = useState<AttendanceFilters>({
    search: '',
    profile_id: '',
    role: 'all',
    status: 'all',
    date: '',
    start_date: '',
    end_date: '',
    page: 1,
    per_page: 15,
  });

  // Selected timesheet modal
  const [selectedRecord, setSelectedRecord] = useState<AdminAttendanceRecord | null>(null);

  // Regularisations State
  const [regularisations, setRegularisations] = useState<AttendanceRegularisation[]>([]);
  const [regStatusFilter, setRegStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Reject Modal State
  const [rejectModalItem, setRejectModalItem] = useState<AttendanceRegularisation | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [rejecting, setRejecting] = useState(false);

  // Load available users for filter dropdown
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await getUsers({ per_page: 100 });
        setUsersList(res.data);
      } catch (err) {
        console.error('Failed to load users for filter:', err);
      }
    }
    loadUsers();
  }, []);

  // Fetch attendance records
  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminAttendance(filters);
      setRecords(res.data);
      setStats(res.stats);
      setMeta(res.meta);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch regularisation requests
  const fetchRegularisations = useCallback(async () => {
    setLoadingRegs(true);
    try {
      const res = await getAdminRegularisations({ status: regStatusFilter });
      setRegularisations(res.data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load regularisation requests');
    } finally {
      setLoadingRegs(false);
    }
  }, [regStatusFilter]);

  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchAttendance();
    } else {
      fetchRegularisations();
    }
  }, [activeTab, fetchAttendance, fetchRegularisations]);

  // Handle Approve
  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await approveRegularisation(id);
      toast.success('Regularisation request approved! Attendance marked as Present.');
      fetchRegularisations();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to approve request');
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Reject Submit
  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem) return;

    setRejecting(true);
    try {
      await rejectRegularisation(rejectModalItem.id, rejectRemarks);
      toast.success('Regularisation request rejected.');
      setRejectModalItem(null);
      setRejectRemarks('');
      fetchRegularisations();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to reject request');
    } finally {
      setRejecting(false);
    }
  };

  // Handle Filter Changes
  const handleFilterChange = (key: keyof AttendanceFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? (value as number) : 1,
    }));
  };

  // Quick Date Presets
  const applyPreset = (preset: 'today' | 'yesterday' | 'this_week' | 'this_month' | 'clear') => {
    const today = new Date();
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    if (preset === 'clear') {
      setFilters((prev) => ({
        ...prev,
        date: '',
        start_date: '',
        end_date: '',
        page: 1,
      }));
      return;
    }

    if (preset === 'today') {
      setFilters((prev) => ({
        ...prev,
        date: formatDate(today),
        start_date: '',
        end_date: '',
        page: 1,
      }));
      return;
    }

    if (preset === 'yesterday') {
      const yest = new Date(today);
      yest.setDate(today.getDate() - 1);
      setFilters((prev) => ({
        ...prev,
        date: formatDate(yest),
        start_date: '',
        end_date: '',
        page: 1,
      }));
      return;
    }

    if (preset === 'this_week') {
      const first = today.getDate() - today.getDay();
      const firstDay = new Date(today.setDate(first));
      setFilters((prev) => ({
        ...prev,
        date: '',
        start_date: formatDate(firstDay),
        end_date: formatDate(new Date()),
        page: 1,
      }));
      return;
    }

    if (preset === 'this_month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setFilters((prev) => ({
        ...prev,
        date: '',
        start_date: formatDate(firstDay),
        end_date: formatDate(new Date()),
        page: 1,
      }));
      return;
    }
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      profile_id: '',
      role: 'all',
      status: 'all',
      date: '',
      start_date: '',
      end_date: '',
      page: 1,
      per_page: 15,
    });
  };

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.profile_id) ||
    (filters.role && filters.role !== 'all') ||
    (filters.status && filters.status !== 'all') ||
    Boolean(filters.date) ||
    Boolean(filters.start_date) ||
    Boolean(filters.end_date);

  const formatDateTime = (isoStr?: string | null) => {
    if (!isoStr) return '—';
    const date = new Date(isoStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pendingCount = regularisations.filter((r) => r.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Title & Nav Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-indigo-600" />
            Attendance Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track, filter, and manage check-in sessions, timesheets, and regularisation requests
          </p>
        </div>

        <button
          onClick={activeTab === 'attendance' ? fetchAttendance : fetchRegularisations}
          disabled={loading || loadingRegs}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-xl transition shadow-sm self-start sm:self-auto"
        >
          <RotateCcw className={`w-4 h-4 ${loading || loadingRegs ? 'animate-spin text-indigo-600' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm border text-sm font-semibold">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${
            activeTab === 'attendance'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          Attendance Records
        </button>
        <button
          onClick={() => setActiveTab('regularisations')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition relative ${
            activeTab === 'regularisations'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          Regularisation Requests
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-amber-500 text-white font-bold rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'attendance' ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Records</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total_records}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Active Now
                </p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stats.active_count}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed Sessions</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stats.completed_count}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Hours Worked</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total_hours_formatted}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Filter className="w-4 h-4 text-indigo-600" />
                <span>Filter Attendance Records</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear all filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Search User</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Name or email..."
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Select Specific User</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={filters.profile_id || ''}
                    onChange={(e) => handleFilterChange('profile_id', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition appearance-none"
                  >
                    <option value="">All Users</option>
                    {usersList.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.first_name} {u.last_name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">User Role</label>
                <select
                  value={filters.role || 'all'}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Student</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Status</label>
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active (Checked In)</option>
                  <option value="completed">Completed (Checked Out)</option>
                  <option value="absent">Absent (Auto-Expired)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">From Date / Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={filters.start_date || filters.date || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (filters.end_date) {
                          handleFilterChange('start_date', val);
                          handleFilterChange('date', '');
                        } else {
                          handleFilterChange('date', val);
                        }
                      }}
                      className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">To Date (Optional)</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={filters.end_date || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && filters.date) {
                          setFilters((prev) => ({
                            ...prev,
                            start_date: prev.date,
                            date: '',
                            end_date: val,
                            page: 1,
                          }));
                        } else {
                          handleFilterChange('end_date', val);
                        }
                      }}
                      className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Quick Presets:</span>
                <button
                  onClick={() => applyPreset('today')}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition"
                >
                  Today
                </button>
                <button
                  onClick={() => applyPreset('yesterday')}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition"
                >
                  Yesterday
                </button>
                <button
                  onClick={() => applyPreset('this_week')}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition"
                >
                  This Week
                </button>
                <button
                  onClick={() => applyPreset('this_month')}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition"
                >
                  This Month
                </button>
              </div>
            </div>
          </div>

          {/* Main Attendance Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-sm text-slate-500 font-medium">Fetching attendance records...</p>
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">No attendance records found</h3>
                <p className="text-sm text-slate-500 max-w-md mt-1">
                  {hasActiveFilters
                    ? 'Try adjusting your search criteria or date filters.'
                    : 'No check-in or check-out sessions have been logged yet.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[12px] uppercase font-bold tracking-wider text-slate-500">
                      <th className="py-3.5 px-5">User Details</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Check-In Time</th>
                      <th className="py-3.5 px-4">Check-Out Time</th>
                      <th className="py-3.5 px-4">Duration</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-5 text-right">Timesheet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {records.map((rec) => {
                      const profile = rec.profile;
                      const name = profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown User';
                      const initials = profile ? `${profile.first_name[0]}${profile.last_name[0]}` : 'U';
                      const role = rec.user_type || profile?.role || 'student';

                      const timesheetCount = rec.timesheet_entries?.length || 0;

                      return (
                        <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                                {initials}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 leading-tight">{name}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{profile?.email || '—'}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            {role === 'student' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200/60">
                                <BookOpen className="w-3 h-3" />
                                Student
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                                <Briefcase className="w-3 h-3" />
                                Employee
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700">
                            {formatDateTime(rec.check_in_at)}
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700">
                            {rec.check_out_at ? (
                              formatDateTime(rec.check_out_at)
                            ) : rec.status === 'absent' ? (
                              <span className="text-red-500 text-xs font-semibold">Unclosed (Absent)</span>
                            ) : (
                              <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                In Progress
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap font-semibold text-slate-800">
                            {rec.total_duration_human || (rec.status === 'active' ? 'Live...' : '—')}
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            {rec.status === 'active' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Active
                              </span>
                            )}
                            {rec.status === 'completed' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                Completed / Present
                              </span>
                            )}
                            {rec.status === 'absent' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                                Absent
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-5 whitespace-nowrap text-right">
                            <button
                              onClick={() => setSelectedRecord(rec)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
                            >
                              <ListTodo className="w-3.5 h-3.5" />
                              Timesheet ({timesheetCount})
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && meta.last_page > 1 && (
              <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                  Showing <span className="font-semibold text-slate-700">{meta.from || 0}</span> to{' '}
                  <span className="font-semibold text-slate-700">{meta.to || 0}</span> of{' '}
                  <span className="font-semibold text-slate-700">{meta.total}</span> records
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={meta.current_page <= 1}
                    onClick={() => handleFilterChange('page', meta.current_page - 1)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-semibold text-slate-700 px-2">
                    Page {meta.current_page} of {meta.last_page}
                  </span>

                  <button
                    disabled={meta.current_page >= meta.last_page}
                    onClick={() => handleFilterChange('page', meta.current_page + 1)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Regularisations Management View */
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold text-slate-800">Filter Status:</span>
              <div className="flex gap-1">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setRegStatusFilter(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition ${
                      regStatusFilter === st
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loadingRegs ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-sm text-slate-500 font-medium">Loading regularisation requests...</p>
              </div>
            ) : regularisations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <AlertCircle className="w-12 h-12 text-slate-300 mb-2" />
                <h3 className="text-base font-semibold text-slate-800">No regularisation requests</h3>
                <p className="text-sm text-slate-500 max-w-md mt-1">
                  There are no regularisation requests matching status "{regStatusFilter}".
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[12px] uppercase font-bold tracking-wider text-slate-500">
                      <th className="py-3.5 px-5">User Details</th>
                      <th className="py-3.5 px-4">Absent Date</th>
                      <th className="py-3.5 px-4">Requested Check-In</th>
                      <th className="py-3.5 px-4">Requested Check-Out</th>
                      <th className="py-3.5 px-4">Reason</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {regularisations.map((reg) => {
                      const profile = reg.profile;
                      const name = profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown';
                      const initials = profile ? `${profile.first_name[0]}${profile.last_name[0]}` : 'U';

                      return (
                        <tr key={reg.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                                {initials}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 leading-tight">{name}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{profile?.email || '—'}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap font-bold text-slate-800">
                            {reg.date}
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700">
                            {formatDateTime(reg.requested_check_in_at)}
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700">
                            {formatDateTime(reg.requested_check_out_at)}
                          </td>

                          <td className="py-4 px-4 max-w-xs truncate text-slate-600 text-xs italic">
                            {reg.reason ? `"${reg.reason}"` : '—'}
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            {reg.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                Pending
                              </span>
                            )}
                            {reg.status === 'approved' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Approved
                              </span>
                            )}
                            {reg.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                                Rejected
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-5 whitespace-nowrap text-right">
                            {reg.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  disabled={processingId === reg.id}
                                  onClick={() => handleApprove(reg.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-sm disabled:opacity-50"
                                >
                                  {processingId === reg.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5" />
                                  )}
                                  Approve
                                </button>
                                <button
                                  disabled={processingId === reg.id}
                                  onClick={() => {
                                    setRejectModalItem(reg);
                                    setRejectRemarks('');
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl transition"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Reviewed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timesheet Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-indigo-200" />
                  Timesheet Details
                </h3>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Logged tasks for {selectedRecord.profile?.first_name} {selectedRecord.profile?.last_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div>
                <span className="font-medium text-slate-500">Check In:</span>{' '}
                <span className="font-semibold text-slate-700">
                  {formatDateTime(selectedRecord.check_in_at)}
                </span>
              </div>
              <div>
                <span className="font-medium text-slate-500">Duration:</span>{' '}
                <span className="font-bold text-indigo-600">
                  {selectedRecord.total_duration_human || '—'}
                </span>
              </div>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {!selectedRecord.timesheet_entries || selectedRecord.timesheet_entries.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">No timesheet entries logged</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedRecord.timesheet_entries.map((ts: TimesheetEntry, idx: number) => (
                    <div
                      key={ts.id || idx}
                      className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 text-sm">{ts.task}</span>
                        <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md">
                          {ts.duration_human}
                        </span>
                      </div>
                      {ts.task_description && (
                        <p className="text-xs text-slate-600 whitespace-pre-line">
                          {ts.task_description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Reject Remarks Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-red-600 text-white flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Reject Regularisation Request
              </h3>
              <button
                onClick={() => setRejectModalItem(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                Are you sure you want to reject the regularisation request for{' '}
                <strong className="text-slate-800">
                  {rejectModalItem.profile?.first_name} {rejectModalItem.profile?.last_name}
                </strong>{' '}
                on <strong className="text-slate-800">{rejectModalItem.date}</strong>?
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Rejection / Remarks (Optional)
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={3}
                    placeholder="Enter rejection remarks..."
                    value={rejectRemarks}
                    onChange={(e) => setRejectRemarks(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalItem(null)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rejecting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition shadow-md disabled:opacity-50"
                >
                  {rejecting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
