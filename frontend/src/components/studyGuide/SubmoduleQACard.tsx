import React from 'react';
import {
  HelpCircle,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Target,
  FileText,
  Sparkles,
} from 'lucide-react';
import type { StudyDay, BookmarkItem } from '../../types/studyGuide';
import { StudyContentSection } from './StudyContentSection';

interface SubmoduleQACardProps {
  day: StudyDay;
  index: number;
  isBookmarked: boolean;
  onToggleBookmark: (item: BookmarkItem) => void;
  isBookmarkedSection: (id: string) => boolean;
  imageSrc?: string;
}

export const SubmoduleQACard: React.FC<SubmoduleQACardProps> = ({
  day,
  index,
  isBookmarked,
  onToggleBookmark,
  isBookmarkedSection,
  imageSrc,
}) => {
  const dayBookmarkItem: BookmarkItem = {
    id: `day-${day.dayNumber}`,
    type: 'day',
    targetId: day.dayNumber,
    title: `Day ${day.dayNumber}: ${day.title}`,
    subtitle: day.moduleTitle,
  };

  return (
    <div id={`submodule-qa-${day.dayNumber}`} className="w-full space-y-6">
      {/* 1. QUESTION HEADER BLOCK */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-start gap-3.5 min-w-0">
          {/* Animated Question Badge */}
          <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-black text-xs lg:text-sm flex-shrink-0 shadow-sm animate-pulse-subtle">
            Q{index + 1}
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-cyan-100 text-cyan-800 tracking-wider uppercase flex items-center gap-1">
                <HelpCircle size={12} className="text-cyan-600" />
                Day {day.dayNumber} Submodule
              </span>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                Question & Answer Format
              </span>
            </div>

            <h3 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight leading-snug">
              Question: {day.title}?
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto">
          <button
            onClick={() => onToggleBookmark(dayBookmarkItem)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isBookmarked
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            <span>{isBookmarked ? 'Bookmarked' : 'Bookmark Question'}</span>
          </button>
        </div>
      </div>

      {/* 2. ANSWER OVERVIEW BLOCK */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs lg:text-sm tracking-wide">
          <CheckCircle2 size={18} className="text-emerald-500 animate-bounce-subtle" />
          <span>ANSWER & CORE CONCEPTS</span>
        </div>

        {/* Summary Callout Box */}
        <div className="bg-gradient-to-r from-cyan-50/80 via-blue-50/50 to-indigo-50/40 border border-cyan-200/80 rounded-2xl p-4 lg:p-5 text-xs lg:text-sm text-cyan-950 font-medium leading-relaxed shadow-2xs">
          💡 <strong className="font-extrabold text-cyan-900">Key Concept Overview:</strong>{' '}
          {day.summary}
        </div>
      </div>

      {/* 3. DIGITAL MARKETING IMAGE VISUAL (If image provided) */}
      {imageSrc && (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md my-4 max-h-[340px] group/img">
          <img
            src={imageSrc}
            alt={day.title}
            className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold backdrop-blur-md bg-slate-900/60 p-3 rounded-xl border border-white/20">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-400 animate-pulse" />
              <span>Digital Marketing Visual — {day.title}</span>
            </div>
            <span className="text-[10px] bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-md font-black uppercase">
              Interactive Visual
            </span>
          </div>
        </div>
      )}

      {/* 4. DETAILED STUDY SECTIONS */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <FileText size={15} className="text-cyan-600" />
          <span>Detailed Explanation & Breakdown</span>
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

      {/* 5. PRACTICE TASK BOX */}
      <div className="bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-pink-50/50 border border-indigo-200/80 rounded-2xl p-4 lg:p-5 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 text-indigo-950 font-black text-xs lg:text-sm">
          <Target className="w-4 h-4 text-indigo-600" />
          <span>PRACTICE TASK: {day.practiceTask.title}</span>
        </div>

        <p className="text-xs lg:text-sm text-slate-700 leading-relaxed font-medium">
          {day.practiceTask.description}
        </p>

        <div className="bg-white/90 rounded-xl p-3.5 border border-indigo-100 space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700">
            Action Steps to Complete:
          </span>
          <ul className="space-y-2">
            {day.practiceTask.actionSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs lg:text-sm text-slate-700 font-medium">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 shadow-2xs">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
