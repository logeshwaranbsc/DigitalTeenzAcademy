import { useState, useEffect } from 'react';
import {
  getUserRegularisations,
  submitRegularisation,
} from '../api/attendance';
import type { AttendanceRegularisation } from '../types';
import {
  X,
  Clock,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Send,
  History,
  PlusCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RegulariseModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  onSuccess?: () => void;
}

export default function RegulariseModal({
  isOpen,
  onClose,
  defaultDate,
  onSuccess,
}: RegulariseModalProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');

  // Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(defaultDate || todayStr);
  const [checkInTime, setCheckInTime] = useState('09:00');
  const [checkOutTime, setCheckOutTime] = useState('17:00');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // History State
  const [history, setHistory] = useState<AttendanceRegularisation[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (defaultDate) {
      setDate(defaultDate);
    }
  }, [defaultDate]);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getUserRegularisations();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load regularisation history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error('Please select the absent date');
      return;
    }
    if (!checkInTime || !checkOutTime) {
      toast.error('Please enter check-in and check-out times');
      return;
    }

    setSubmitting(true);
    try {
      await submitRegularisation({
        date,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        reason: reason.trim() || undefined,
      });

      toast.success('Regularisation request submitted to Admin!');
      setReason('');
      fetchHistory();
      if (onSuccess) onSuccess();
      setActiveTab('history');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : 'Submission failed');
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-200" />
              Regularise Attendance
            </h3>
            <p className="text-xs text-indigo-100 mt-0.5">
              Submit a correction request for an absent date or expired check-in session
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-100 bg-slate-50 flex gap-4 text-xs font-semibold flex-shrink-0">
          <button
            onClick={() => setActiveTab('form')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'form'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            New Request
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              fetchHistory();
            }}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <History className="w-4 h-4" />
            My Requests ({history.length})
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Absent Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Absent Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    max={todayStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Check-In & Check-Out Times */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Actual Check-In Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Actual Check-Out Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Reason / Comment */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason / Comment (Optional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={3}
                    placeholder="Provide a brief explanation for regularisation (e.g. Forgot to check out, system auto-expired)..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Submit Request
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {loadingHistory ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                  <p className="text-xs text-slate-500">Loading requests...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium">No regularisation requests submitted yet</p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        {item.date}
                      </span>
                      {item.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}
                      {item.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved (Marked Present)
                        </span>
                      )}
                      {item.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-slate-600 border-t border-slate-200/60">
                      <div>
                        <span className="text-slate-400">Requested Check-In:</span>{' '}
                        <span className="font-medium text-slate-700">
                          {new Date(item.requested_check_in_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Requested Check-Out:</span>{' '}
                        <span className="font-medium text-slate-700">
                          {new Date(item.requested_check_out_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {item.reason && (
                      <p className="text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200/60 mt-1">
                        "{item.reason}"
                      </p>
                    )}

                    {item.status === 'rejected' && item.admin_remarks && (
                      <div className="p-2.5 bg-red-50/80 border border-red-200 rounded-lg text-red-700 mt-2">
                        <span className="font-semibold">Admin Remarks:</span> {item.admin_remarks}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
