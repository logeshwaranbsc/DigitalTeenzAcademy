import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Layers,
  Compass,
  UserCheck,
  Video,
  Search,
  DollarSign,
  Globe,
  Briefcase,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import type { Module, BookmarkItem } from '../../types/studyGuide';
import { DayAccordion } from './DayAccordion';

interface ModuleAccordionProps {
  module: Module;
  isExpanded: boolean;
  onToggleExpand: () => void;
  dayNotes: Record<number, string>;
  isBookmarked: boolean;
  onToggleBookmark: (item: BookmarkItem) => void;
  onSaveDayNote: (dayNumber: number, note: string) => void;
  expandedDayId: number | null;
  onToggleDayExpand: (dayNumber: number) => void;
  isBookmarkedItem: (id: string) => boolean;
}

const MODULE_ICONS: Record<string, React.ElementType> = {
  Compass,
  UserCheck,
  Video,
  Search,
  DollarSign,
  Globe,
  Briefcase,
};

export const ModuleAccordion: React.FC<ModuleAccordionProps> = ({
  module,
  isExpanded,
  onToggleExpand,
  dayNotes,
  isBookmarked,
  onToggleBookmark,
  onSaveDayNote,
  expandedDayId,
  onToggleDayExpand,
  isBookmarkedItem,
}) => {
  const IconComponent = MODULE_ICONS[module.iconName] || Layers;

  const moduleBookmarkItem: BookmarkItem = {
    id: `module-${module.id}`,
    type: 'module',
    targetId: module.id,
    title: `${module.code} — ${module.title}`,
    subtitle: module.dayRange,
  };

  return (
    <div
      id={`module-card-${module.id}`}
      className={`border rounded-3xl bg-white shadow-sm overflow-hidden transition-all duration-300 ${
        isExpanded
          ? 'border-cyan-300 ring-2 ring-cyan-500/10 shadow-md'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Module Header Card */}
      <div
        onClick={onToggleExpand}
        className="p-5 lg:p-6 bg-gradient-to-r from-slate-50/90 via-white to-slate-50/50 hover:bg-slate-100/60 cursor-pointer select-none transition-colors border-b border-slate-100"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Title & Badge */}
          <div className="flex items-start gap-4">
            {/* Module Icon Badge */}
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${module.color} text-white flex items-center justify-center font-black text-lg shadow-md flex-shrink-0`}
            >
              <IconComponent size={22} />
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-slate-900 text-white tracking-wider">
                  {module.code}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  {module.dayRange}
                </span>
              </div>

              <h2 className="text-lg lg:text-xl font-extrabold text-slate-800 tracking-tight leading-snug">
                {module.title}
              </h2>
              <p className="text-xs lg:text-sm text-slate-500 font-medium">
                {module.subtitle}
              </p>
            </div>
          </div>

          {/* Controls Right Column */}
          <div className="flex items-center justify-end gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleBookmark(moduleBookmarkItem)}
              className={`p-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isBookmarked
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark Module'}
            >
              {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>

            <div
              onClick={onToggleExpand}
              className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {isExpanded ? <ChevronDown size={22} /> : <ChevronRight size={22} />}
            </div>
          </div>
        </div>
      </div>

      {/* Module Days List (When Expanded) */}
      {isExpanded && (
        <div className="p-4 lg:p-6 bg-slate-50/50 space-y-4">
          <p className="text-xs text-slate-500 font-medium italic border-b border-slate-200/60 pb-3">
            {module.description}
          </p>

          <div className="space-y-3">
            {module.days.map((day) => (
              <DayAccordion
                key={day.dayNumber}
                day={day}
                savedNote={dayNotes[day.dayNumber] || ''}
                isBookmarked={isBookmarkedItem(`day-${day.dayNumber}`)}
                onSaveNote={onSaveDayNote}
                onToggleBookmark={onToggleBookmark}
                isExpanded={expandedDayId === day.dayNumber}
                onToggleExpand={() => onToggleDayExpand(day.dayNumber)}
                isBookmarkedSection={isBookmarkedItem}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
