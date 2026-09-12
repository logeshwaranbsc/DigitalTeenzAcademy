import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../api/users';
import type { DashboardStats } from '../../types';
import {
  Users,
  BookOpen,
  Briefcase,
  UserCheck,
  UserX,
  Loader2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

const statCards = [
  {
    key: 'total_users' as const,
    label: 'Total Users',
    icon: Users,
    gradient: 'from-indigo-500 to-purple-600',
    bgLight: 'bg-indigo-50',
    textColor: 'text-indigo-700',
  },
  {
    key: 'total_students' as const,
    label: 'Total Students',
    icon: BookOpen,
    gradient: 'from-cyan-500 to-blue-600',
    bgLight: 'bg-cyan-50',
    textColor: 'text-cyan-700',
  },
  {
    key: 'total_employees' as const,
    label: 'Total Employees',
    icon: Briefcase,
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  {
    key: 'active_users' as const,
    label: 'Active Users',
    icon: UserCheck,
    gradient: 'from-emerald-500 to-green-600',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-700',
  },
  {
    key: 'inactive_users' as const,
    label: 'Inactive Users',
    icon: UserX,
    gradient: 'from-slate-500 to-slate-700',
    bgLight: 'bg-slate-100',
    textColor: 'text-slate-700',
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-10">
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700">Failed to load dashboard</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-sm text-slate-500 mt-1">Real-time school management statistics</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map(({ key, label, icon: Icon, gradient, bgLight, textColor }) => (
          <div
            key={key}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 ${bgLight} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${textColor}`} />
              </div>
              <div className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {stats ? stats[key] : 0}
            </p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick info section */}
      <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Quick Actions</h3>
        <p className="text-sm text-slate-500 mb-4">
          Manage your school's users, students, and employees from the sidebar navigation.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <Users className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-indigo-700">Manage Users</p>
              <p className="text-xs text-indigo-500">View, create, and edit user accounts</p>
            </div>
          </a>
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
            <TrendingUp className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-sm font-medium text-slate-700">All data is live</p>
              <p className="text-xs text-slate-500">Statistics reflect current database state</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
