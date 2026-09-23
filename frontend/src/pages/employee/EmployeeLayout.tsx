import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Clock,
  Briefcase,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import toast from 'react-hot-toast';
import CheckInButton from '../../components/CheckInButton';
import TimesheetModal from '../../components/TimesheetModal';
import type { Attendance } from '../../types';

const navItems = [
  { to: '/employee/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employee/attendance', icon: Clock, label: 'Attendance & Timesheets' },
  { to: '/employee/tasks', icon: ClipboardList, label: 'My Tasks', placeholder: true },
];

export default function EmployeeLayout() {
  const { logout, profile } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Timesheet Modal state when employee checks out
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

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 transform transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-slate-800 truncate">Digital Teenz</h2>
            <p className="text-xs text-slate-500">Employee Portal</p>
          </div>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-slate-600"
            onClick={closeSidebar}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, placeholder }) => (
            <NavLink
              key={to}
              to={placeholder ? '#' : to}
              onClick={(e) => {
                if (placeholder) {
                  e.preventDefault();
                  toast('Coming soon!', { icon: '🚧' });
                }
                closeSidebar();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  !placeholder && isActive
                    ? 'bg-amber-50 text-amber-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                } ${placeholder ? 'opacity-60' : ''}`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {placeholder && (
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-medium">
                  Soon
                </span>
              )}
              {!placeholder && (
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* User info & Logout */}
        <div className="px-3 py-4 border-t border-slate-100 flex-shrink-0">
          {profile && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {profile.first_name[0]}{profile.last_name[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {profile.first_name} {profile.last_name}
                </p>
                <p className="text-xs text-slate-500 truncate">{profile.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 py-3 lg:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-slate-500 hover:text-slate-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <h1 className="text-lg font-semibold text-slate-800 truncate">Employee Portal</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Check-In / Check-Out button in top header */}
            <CheckInButton onCheckOut={handleCheckOut} />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Timesheet Modal */}
      <TimesheetModal
        attendance={timesheetAttendance}
        isOpen={timesheetOpen}
        onClose={() => setTimesheetOpen(false)}
        onSubmitted={() => {
          setTimesheetOpen(false);
          setTimesheetAttendance(null);
        }}
      />
    </div>
  );
}
