import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Target,
  BookOpen,
} from 'lucide-react';
import { PLANNER_DATA } from '../../data/digitalMarketingData';

export const DailyPlannerSection: React.FC = () => {
  const [openDayNum, setOpenDayNum] = useState<number | null>(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-600" />
            <h2 className="text-xl font-bold text-slate-800">30-Day Daily Planner</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Structured daily roadmap detailing study tasks and hands-on practice assignments.
          </p>
        </div>
      </div>

      {/* Accordion Rows for Days 1 to 30 */}
      <div className="space-y-3">
        {PLANNER_DATA.map((pDay) => {
          const isOpen = openDayNum === pDay.dayNumber;

          return (
            <div
              key={pDay.dayNumber}
              className={`border rounded-2xl bg-white shadow-2xs overflow-hidden transition-all ${
                isOpen
                  ? 'border-cyan-300 ring-2 ring-cyan-500/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                onClick={() => setOpenDayNum(isOpen ? null : pDay.dayNumber)}
                className="p-4 flex items-center justify-between cursor-pointer select-none gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-slate-400">
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </span>

                  <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                    D{pDay.dayNumber}
                  </span>

                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {pDay.moduleCode} • Day {pDay.dayNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 truncate">
                      {pDay.title}
                    </h4>
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-cyan-700 uppercase tracking-wider">
                      <BookOpen size={14} />
                      <span>Study Task</span>
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed">
                      {pDay.studyTask}
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-700 uppercase tracking-wider">
                      <Target size={14} />
                      <span>Practice Assignment</span>
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed">
                      {pDay.practiceTask}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
