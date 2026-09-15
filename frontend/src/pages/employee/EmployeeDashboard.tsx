import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Briefcase, LogOut, ClipboardList, Calendar, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import CheckInButton from '../../components/CheckInButton';
import TimesheetModal from '../../components/TimesheetModal';
import type { Attendance } from '../../types';

export default function EmployeeDashboard() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [timesheetAttendance, setTimesheetAttendance] = useState<Attendance | null>(null);
  const [timesheetOpen, setTimesheetOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
      navigate('/', { replace: true });
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const handleCheckOut = (attendance: Attendance) => {
    setTimesheetAttendance(attendance);
    setTimesheetOpen(true);
  };

  const handleTimesheetClose = () => {
    setTimesheetOpen(false);
  };

  const handleTimesheetSubmitted = () => {
    setTimesheetOpen(false);
    setTimesheetAttendance(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Employee Portal</h1>
              <p className="text-xs text-slate-500">Digital Teenz Academy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {profile && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {profile.first_name[0]}{profile.last_name[0]}
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {profile.first_name} {profile.last_name}
                </span>
              </div>
            )}

            {/* Check-In / Check-Out button */}
            <CheckInButton onCheckOut={handleCheckOut} />

            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome, {profile?.first_name || 'Employee'}! 👋
          </h2>
          <p className="text-sm text-slate-500 mt-1">Here's your employee dashboard</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: ClipboardList, label: 'My Tasks', desc: 'View assigned tasks', bg: 'bg-amber-50', text: 'text-amber-700' },
            { icon: Calendar, label: 'Schedule', desc: 'Work timetable', bg: 'bg-violet-50', text: 'text-violet-700' },
            { icon: BarChart3, label: 'Reports', desc: 'View reports', bg: 'bg-emerald-50', text: 'text-emerald-700' },
          ].map(({ icon: Icon, label, desc, bg, text }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-shadow">
              <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${text}`} />
              </div>
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              <p className="text-xs text-slate-400 mt-3 italic">Coming soon</p>
            </div>
          ))}
        </div>
      </main>

      {/* Timesheet Modal */}
      <TimesheetModal
        attendance={timesheetAttendance}
        isOpen={timesheetOpen}
        onClose={handleTimesheetClose}
        onSubmitted={handleTimesheetSubmitted}
      />
    </div>
  );
}
