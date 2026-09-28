import { useAuth } from '../../context/AuthContext';
import { AttendanceDashboardSection } from '../../components/AttendanceDashboardSection';

export default function StudentDashboard() {
  const { profile } = useAuth();

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Welcome, {profile?.first_name || 'Student'}! 👋
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Here's your student study portal and daily attendance tracker
          </p>
        </div>
      </div>

      {/* Attendance & Timesheets Section with Hours Worked & Status Bar Chart */}
      <AttendanceDashboardSection userRole="student" />
    </div>
  );
}

