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
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between gap-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Academic Study Guide</span>
          </div>

          <h1 className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            📘 {COURSE_STATS.title}
          </h1>

          <p className="text-slate-300 text-sm lg:text-base font-medium leading-relaxed italic">
            "{COURSE_STATS.subtitle}"
          </p>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 px-3.5 py-2 rounded-xl">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>{COURSE_STATS.totalModules} Modules</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 px-3.5 py-2 rounded-xl">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>{COURSE_STATS.totalDays} Days</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 px-3.5 py-2 rounded-xl">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{COURSE_STATS.totalTopics} Topics</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 px-3.5 py-2 rounded-xl">
              <Wrench className="w-4 h-4 text-emerald-400" />
              <span>{COURSE_STATS.totalTools} Tools</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 px-3.5 py-2 rounded-xl">
              <HelpCircle className="w-4 h-4 text-rose-400" />
              <span>{COURSE_STATS.totalFlashcards} Flashcards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
