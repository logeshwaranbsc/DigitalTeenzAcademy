import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Sparkles, Layers, HelpCircle, Calendar, Award } from 'lucide-react';
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
          <p className="text-sm text-slate-500 mt-1">Here's your student study portal</p>
        </div>
      </div>

      {/* Featured Course Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-lg border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
            <Sparkles size={13} />
            <span>Featured Academic Course</span>
          </div>
          <h3 className="text-xl lg:text-2xl font-extrabold tracking-tight">
            📘 Digital Marketing Complete Study Guide
          </h3>
          <p className="text-xs lg:text-sm text-slate-300 italic">
            "From Introduction to Freelancing — Master Digital Marketing in 30 Days"
          </p>

          <div className="flex items-center gap-3 pt-2 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1"><Layers size={14} className="text-cyan-400" /> 7 Modules</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Calendar size={14} className="text-purple-400" /> 30 Study Days</span>
            <span>•</span>
            <span className="flex items-center gap-1"><HelpCircle size={14} className="text-rose-400" /> 42 Flashcards</span>
          </div>
        </div>

        <Link
          to="/student/courses"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-md transition-all active:scale-95 z-10 flex-shrink-0"
        >
          <span>Open Study Guide</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Quick Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/student/courses"
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-cyan-300 transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 bg-cyan-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-cyan-700" />
          </div>
          <p className="text-sm font-bold text-slate-800 flex items-center justify-between">
            <span>Digital Marketing Guide</span>
            <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
          </p>
          <p className="text-xs text-slate-500 mt-0.5">30-Day interactive course & flashcards</p>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 opacity-70">
          <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-violet-700" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Schedule</p>
          <p className="text-xs text-slate-500 mt-0.5">Class timetable</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">Soon</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 opacity-70">
          <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center mb-3">
            <Award className="w-5 h-5 text-amber-700" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Grades & Certificates</p>
          <p className="text-xs text-slate-500 mt-0.5">View your completion badges</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">Soon</p>
        </div>
      </div>

      {/* Regularise Attendance Modal */}
      <RegulariseModal
        isOpen={regulariseOpen}
        onClose={() => setRegulariseOpen(false)}
      />
    </div>
  );
}

