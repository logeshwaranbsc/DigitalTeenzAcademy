import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Calendar, Award } from 'lucide-react';
import RegulariseModal from '../../components/RegulariseModal';

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [regulariseOpen, setRegulariseOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Welcome Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome, {profile?.first_name || 'Student'}! 👋
          </h2>
          <p className="text-sm text-slate-500 mt-1">Here's your student dashboard</p>
        </div>

      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: BookOpen, label: 'My Courses', desc: 'View enrolled courses', color: 'from-cyan-500 to-blue-600', bg: 'bg-cyan-50', text: 'text-cyan-700' },
          { icon: Calendar, label: 'Schedule', desc: 'Class timetable', color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', text: 'text-violet-700' },
          { icon: Award, label: 'Grades', desc: 'View your grades', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-700' },
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

      {/* Regularise Attendance Modal */}
      <RegulariseModal
        isOpen={regulariseOpen}
        onClose={() => setRegulariseOpen(false)}
      />
    </div>
  );
}

