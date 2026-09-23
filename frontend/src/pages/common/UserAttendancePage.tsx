import { useEffect, useState, useCallback } from 'react';
import {
  getMyAttendanceHistory,
  getUserRegularisations,
} from '../../api/attendance';
import type {
  AdminAttendanceRecord,
  AttendanceRegularisation,
  PaginationMeta,
  TimesheetEntry,
} from '../../types';
import RegulariseModal from '../../components/RegulariseModal';
import {
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ListTodo,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  X,
  FileText,
  PlusCircle,
  History,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserAttendancePage() {
  const [activeTab, setActiveTab] = useState<'attendance' | 'regularisations'>('attendance');

  // Attendance History State
  const [records, setRecords] = useState<AdminAttendanceRecord[]>([]);
  const [stats, setStats] = useState({
    total_records: 0,
    completed_count: 0,
    absent_count: 0,
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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Selected timesheet modal
  const [selectedRecord, setSelectedRecord] = useState<AdminAttendanceRecord | null>(null);

  // Regularise modal
  const [regulariseOpen, setRegulariseOpen] = useState(false);
  const [selectedAbsentDate, setSelectedAbsentDate] = useState<string | undefined>(undefined);

  // Regularisation requests history
  const [regularisations, setRegularisations] = useState<AttendanceRegularisation[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMyAttendanceHistory({ page, per_page: 15 });
      setRecords(res.data);
      setStats(res.stats);
      setMeta(res.meta);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load attendance history');
    } finally {
      setLoading(false);
    }
  }, [page]);

  const fetchRegularisations = useCallback(async () => {
    setLoadingRegs(true);
    try {
      const data = await getUserRegularisations();
      setRegularisations(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load regularisations');
    } finally {
      setLoadingRegs(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
    fetchRegularisations();
  }, [fetchHistory, fetchRegularisations]);

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

  const pendingRegsCount = regularisations.filter((r) => r.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Title & Regularise Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-indigo-600" />
            My Attendance & Timesheets
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View your attendance history, logged tasks, and submit regularisation requests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedAbsentDate(undefined);
              setRegulariseOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm rounded-xl shadow-md hover:from-indigo-700 hover:to-purple-700 transition"
          >
            <PlusCircle className="w-4.5 h-4.5" />
            Regularise Attendance
          </button>
          <button
            onClick={() => {
              fetchHistory();
              fetchRegularisations();
            }}
            disabled={loading || loadingRegs}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl transition shadow-sm"
            title="Refresh data"
          >
            <RotateCcw className={`w-4 h-4 ${loading || loadingRegs ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Sessions</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total_records}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Days Attended</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.completed_count}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hours Logged</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total_hours_formatted}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Absent Days</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.absent_count}</p>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
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
          Attendance & Timesheet Logs
        </button>
        <button
          onClick={() => setActiveTab('regularisations')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition relative ${
            activeTab === 'regularisations'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <History className="w-4 h-4" />
          Regularisation Requests ({regularisations.length})
          {pendingRegsCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-amber-500 text-white font-bold rounded-full">
              {pendingRegsCount} Pending
            </span>
          )}
        </button>
      </div>

      {activeTab === 'attendance' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-sm text-slate-500 font-medium">Fetching attendance history...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">No attendance history logged</h3>
              <p className="text-sm text-slate-500 max-w-md mt-1">
                Your check-in sessions and timesheets will appear here once you start checking in.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[12px] uppercase font-bold tracking-wider text-slate-500">
                    <th className="py-3.5 px-5">Check-In Time</th>
                    <th className="py-3.5 px-4">Check-Out Time</th>
                    <th className="py-3.5 px-4">Worked Duration</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Timesheet / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {records.map((rec) => {
                    const timesheetCount = rec.timesheet_entries?.length || 0;
                    const dateStr = rec.check_in_at ? rec.check_in_at.split('T')[0] : '';

                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-800">
                          {formatDateTime(rec.check_in_at)}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700">
                          {rec.check_out_at ? (
                            formatDateTime(rec.check_out_at)
                          ) : rec.status === 'absent' ? (
                            <span className="text-red-500 text-xs font-semibold">No Check-In (Absent)</span>
                          ) : rec.status === 'holiday' ? (
                            <span className="text-indigo-600 text-xs font-semibold">Organization Holiday</span>
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

                        <td className="py-4 px-4 whitespace-nowrap font-bold text-slate-800">
                          {rec.total_duration_human || (rec.status === 'active' ? 'Live...' : '—')}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          {rec.status === 'active' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active Now
                            </span>
                          )}
                          {(rec.status === 'completed' || rec.status === 'present') && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                              Present
                            </span>
                          )}
                          {rec.status === 'absent' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                              Absent
                            </span>
                          )}
                          {rec.status === 'regularised' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                              Regularised
                            </span>
                          )}
                          {rec.status === 'holiday' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              Holiday
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {rec.status === 'absent' && (
                              <button
                                onClick={() => {
                                  setSelectedAbsentDate(dateStr);
                                  setRegulariseOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-xl text-xs font-semibold transition"
                              >
                                <PlusCircle className="w-3.5 h-3.5" />
                                Regularise
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedRecord(rec)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
                            >
                              <ListTodo className="w-3.5 h-3.5" />
                              Tasks ({timesheetCount})
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
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
                  onClick={() => setPage(meta.current_page - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-slate-700 px-2">
                  Page {meta.current_page} of {meta.last_page}
                </span>
                <button
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() => setPage(meta.current_page + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Regularisation History Tab */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              My Regularisation Requests History
            </h3>
            <button
              onClick={() => {
                setSelectedAbsentDate(undefined);
                setRegulariseOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition"
            >
              <PlusCircle className="w-4 h-4" />
              New Regularisation
            </button>
          </div>

          {loadingRegs ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              <p className="text-xs text-slate-500">Loading requests history...</p>
            </div>
          ) : regularisations.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No regularisation requests submitted yet</p>
              <p className="text-xs text-slate-400 mt-1">
                If you missed a check-out or were marked absent, click "New Regularisation" above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {regularisations.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      Absent Date: {item.date}
                    </span>
                    {item.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Pending Admin Approval
                      </span>
                    )}
                    {item.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approved (Marked Present)
                      </span>
                    )}
                    {item.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                        <XCircle className="w-3.5 h-3.5" />
                        Rejected
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-600 border-t border-slate-200/60">
                    <div>
                      <span className="text-slate-400">Requested Check-In:</span>{' '}
                      <span className="font-medium text-slate-700">
                        {formatDateTime(item.requested_check_in_at)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Requested Check-Out:</span>{' '}
                      <span className="font-medium text-slate-700">
                        {formatDateTime(item.requested_check_out_at)}
                      </span>
                    </div>
                  </div>

                  {item.reason && (
                    <p className="text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200/60 mt-1">
                      "{item.reason}"
                    </p>
                  )}

                  {item.status === 'rejected' && item.admin_remarks && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 mt-2">
                      <span className="font-semibold">Admin Remarks:</span> {item.admin_remarks}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
                  Logged Tasks
                </h3>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Tasks submitted for session on {selectedRecord.check_in_at?.split('T')[0]}
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
                  <p className="text-sm font-medium text-slate-600">No task entries logged</p>
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

      {/* Regularise Attendance Modal */}
      <RegulariseModal
        isOpen={regulariseOpen}
        onClose={() => setRegulariseOpen(false)}
        defaultDate={selectedAbsentDate}
        onSuccess={() => {
          fetchHistory();
          fetchRegularisations();
        }}
      />
    </div>
  );
}
