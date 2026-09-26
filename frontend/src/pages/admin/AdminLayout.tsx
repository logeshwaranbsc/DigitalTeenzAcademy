import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  BookOpen,
  Briefcase,
  Settings,
  LogOut,
  GraduationCap,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'User Management' },
  { to: '/admin/attendance', icon: Clock, label: 'Attendance' },
  { to: '/admin/students', icon: BookOpen, label: 'Students', placeholder: true },
  { to: '/admin/employees', icon: Briefcase, label: 'Employees', placeholder: true },
  { to: '/admin/settings', icon: Settings, label: 'Settings', placeholder: true },
];

export default function AdminLayout() {
  const { logout, profile } = useAuth();
  const navigate = useNavigate();

  // Responsive sidebar open state: default to open on desktop (>=1024px), closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
      navigate('/', { replace: true });
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 h-screen bg-white border-r border-slate-200 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
          sidebarOpen
            ? 'w-64 translate-x-0 opacity-100'
            : 'w-64 -translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-64 flex flex-col h-full flex-shrink-0">
          {/* Logo / Brand */}
          <div className="flex items-center justify-between gap-3 px-5 py-5 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="overflow-hidden">
                <h2 className="text-sm font-bold text-slate-800 truncate">Digital Teenz</h2>
                <p className="text-xs text-slate-500">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
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
                  handleNavClick();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    !placeholder && isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
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
                {!placeholder && <ChevronRight size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
              </NavLink>
            ))}
          </nav>

          {/* User info + Logout */}
          <div className="px-3 py-4 border-t border-slate-100 flex-shrink-0">
            {profile && (
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
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
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'pl-0'}`}>
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 py-3 lg:px-6 flex items-center gap-4">
          <button
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center"
            onClick={toggleSidebar}
            title={sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
            aria-label={sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          >
            {sidebarOpen ? (
              <PanelLeftClose size={22} className="text-slate-600" />
            ) : (
              <PanelLeftOpen size={22} className="text-slate-600" />
            )}
          </button>
          <h1 className="text-lg font-semibold text-slate-800 truncate">Admin Dashboard</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
