import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Target,
  FileText,
  Link2,
} from 'lucide-react';
import type { StudyDay, BookmarkItem } from '../../types/studyGuide';
import { StudyContentSection } from './StudyContentSection';

interface DayAccordionProps {
  day: StudyDay;
  isBookmarked: boolean;
  onToggleBookmark: (item: BookmarkItem) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isBookmarkedSection: (id: string) => boolean;
}

export const DayAccordion: React.FC<DayAccordionProps> = ({
  day,
  isBookmarked,
  onToggleBookmark,
  isExpanded,
  onToggleExpand,
  isBookmarkedSection,
}) => {
  const dayBookmarkItem: BookmarkItem = {
    id: `day-${day.dayNumber}`,
    type: 'day',
    targetId: day.dayNumber,
    title: `Day ${day.dayNumber}: ${day.title}`,
    subtitle: day.moduleTitle,
  };

  return (
    <div
      id={`day-accordion-${day.dayNumber}`}
      className={`border rounded-2xl transition-all duration-200 overflow-hidden bg-white shadow-2xs ${
        isExpanded
          ? 'border-cyan-300 ring-2 ring-cyan-500/10'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Day Header */}
      <div
        onClick={onToggleExpand}
        className="w-full p-4 lg:p-5 flex items-center justify-between cursor-pointer select-none gap-4 hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <span className="text-slate-400 hover:text-slate-700 transition-colors">
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </span>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-xs font-black flex-shrink-0 shadow-2xs">
            D{day.dayNumber}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Day {day.dayNumber}
              </span>
            </div>
            <h3 className="text-sm lg:text-base font-bold text-slate-800 truncate tracking-tight">
              {day.title}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleBookmark(dayBookmarkItem)}
            className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
              isBookmarked
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Bookmark Day'}
          >
            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded Content Body */}
      {isExpanded && (
        <div className="p-4 lg:p-6 border-t border-slate-100 space-y-6 bg-slate-50/30">
          {/* Day Summary */}
          <div className="bg-cyan-50/60 border border-cyan-100 rounded-xl p-4 text-xs lg:text-sm text-cyan-950 font-medium">
            💡 <strong className="font-bold text-cyan-900">Day Overview:</strong> {day.summary}
          </div>

          {/* Study Content Sub-Accordions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <FileText size={14} className="text-cyan-600" />
              <span>Study Content</span>
            </div>

            {day.contentSections.map((sec) => (
              <StudyContentSection
                key={sec.id}
                section={sec}
                dayNumber={day.dayNumber}
                isBookmarked={isBookmarkedSection(`sec-${sec.id}`)}
                onToggleBookmark={onToggleBookmark}
                defaultExpanded={true}
              />
            ))}
          </div>

          {/* Practice Task Box */}
          <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/60 border border-indigo-100 rounded-2xl p-4 lg:p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Practice Task — {day.practiceTask.title}</span>
            </div>

            <p className="text-xs lg:text-sm text-slate-700 leading-relaxed font-medium">
              {day.practiceTask.description}
            </p>

            <div className="bg-white/90 rounded-xl p-3.5 border border-indigo-100/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Action Steps:
              </span>
              <ul className="space-y-2">
                {day.practiceTask.actionSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reference Links Section (if any day level links) */}
          {day.referenceLinks && day.referenceLinks.length > 0 && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                <Link2 size={14} className="text-purple-600" />
                <span>🔗 Reference Links</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {day.referenceLinks.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{ref.title}</p>
                      {ref.subtitle && (
                        <p className="text-[11px] text-slate-500 truncate">{ref.subtitle}</p>
                      )}
                    </div>

                    {ref.hasLink && ref.url ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors flex-shrink-0"
                      >
                        <span>View</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No link</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
