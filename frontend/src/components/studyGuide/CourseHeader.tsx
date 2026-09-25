import React from 'react';
import {
  BookOpen,
  Calendar,
  Layers,
  Wrench,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { COURSE_STATS } from '../../data/digitalMarketingData';

export const CourseHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50/70 to-purple-50/80 rounded-3xl p-6 lg:p-8 text-slate-900 shadow-sm relative overflow-hidden border border-indigo-100/90">
      <div className="relative z-10 flex flex-col justify-between gap-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200/80 text-blue-900 text-xs font-bold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Academic Study Guide</span>
          </div>

          <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            📘 {COURSE_STATS.title}
          </h1>

          <p className="text-slate-600 text-sm lg:text-base font-medium leading-relaxed italic">
            "{COURSE_STATS.subtitle}"
          </p>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-slate-800">
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>{COURSE_STATS.totalModules} Modules</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>{COURSE_STATS.totalDays} Days</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>{COURSE_STATS.totalTopics} Topics</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
              <Wrench className="w-4 h-4 text-emerald-600" />
              <span>{COURSE_STATS.totalTools} Tools</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
              <HelpCircle className="w-4 h-4 text-rose-600" />
              <span>{COURSE_STATS.totalFlashcards} Flashcards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
