import React from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Target,
  FileText,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import type { StudyDay, BookmarkItem } from '../../types/studyGuide';
import { StudyContentSection } from './StudyContentSection';

interface SubmoduleTopicSectionProps {
  day: StudyDay;
  isBookmarked: boolean;
  onToggleBookmark: (item: BookmarkItem) => void;
  isBookmarkedSection: (id: string) => boolean;
  imageSrc?: string;
}

export const SubmoduleTopicSection: React.FC<SubmoduleTopicSectionProps> = ({
  day,
  isBookmarked,
  onToggleBookmark,
  isBookmarkedSection,
  imageSrc,
}) => {
  const bookmarkItem: BookmarkItem = {
    id: `topic-${day.id}`,
    type: 'day',
    targetId: day.id,
    title: day.title,
    subtitle: day.moduleTitle,
  };

  return (
    <div id={`topic-section-${day.id}`} className="w-full space-y-6 pt-2">
      {/* 1. TOPIC HEADER BLOCK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="min-w-0">
          <h3 className="text-lg lg:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            {day.title}
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          <button
            onClick={() => onToggleBookmark(bookmarkItem)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              isBookmarked
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 shadow-2xs border border-amber-200/80'
                : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200 shadow-2xs'
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            <span>{isBookmarked ? 'Bookmarked' : 'Bookmark Topic'}</span>
          </button>
        </div>
      </div>

      {/* 2. TOPIC OVERVIEW SUMMARY */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-black text-xs lg:text-sm tracking-wide">
          <BookOpen size={17} className="text-blue-600" />
          <span>TOPIC OVERVIEW</span>
        </div>

        <div className="bg-amber-50/90 text-slate-900 border border-amber-200/80 rounded-2xl p-4 lg:p-5 text-xs lg:text-sm font-medium leading-relaxed shadow-2xs">
          💡 <strong className="font-black text-amber-800">Core Concept:</strong> {day.summary}
        </div>
      </div>

      {/* 3. DIGITAL MARKETING GRAPHIC VISUAL (If available) */}
      {imageSrc && (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm my-4 max-h-[340px] group/img bg-slate-100">
          <img
            src={imageSrc}
            alt={day.title}
            className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-slate-900 text-xs font-bold backdrop-blur-md bg-white/95 p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-600 animate-pulse" />
              <span className="font-black">Digital Marketing Illustration — {day.title}</span>
            </div>
            <span className="text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md font-black uppercase border border-blue-200/60">
              Visual Guide
            </span>
          </div>
        </div>
      )}

      {/* 4. DETAILED STUDY CONTENT SECTIONS */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
          <FileText size={15} className="text-blue-600" />
          <span>Key Content & Breakdown</span>
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

      {/* 5. PRACTICE TASK & ACTION STEPS CARDS GRID */}
      {day.practiceTask && (
        <div className="space-y-4 pt-2">
          {/* Practice Task Header */}
          <div className="flex items-center gap-3 pb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center font-bold shadow-2xs">
              <Target size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-200/60">
                Practice Task Assignment
              </span>
              <h5 className="text-base font-black text-slate-900 leading-snug">
                {day.practiceTask.title}
              </h5>
            </div>
          </div>

          <p className="text-xs lg:text-sm text-slate-700 leading-relaxed font-medium">
            {day.practiceTask.description}
          </p>

          {/* Action Steps Card Grid matching reference design */}
          <div className="space-y-3 pt-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles size={14} className="text-cyan-600" />
              Action Steps to Complete
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {day.practiceTask.actionSteps.map((step, idx) => {
                const numStr = String(idx + 1).padStart(2, '0');
                return (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200/90 rounded-2xl p-5 lg:p-6 shadow-2xs hover:shadow-md hover:border-slate-400 transition-all duration-300 flex flex-col justify-between space-y-4 group"
                  >
                    {/* Top Row: Icon pill left, Amber/Gold number right */}
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
                        <CheckCircle2 size={18} />
                      </div>

                      <span className="text-amber-600 font-black text-sm lg:text-base tracking-wider">
                        {numStr}
                      </span>
                    </div>

                    {/* Action Step Description */}
                    <div className="space-y-1.5 min-w-0">
                      <h6 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                        Action Step {numStr}
                      </h6>
                      <p className="text-xs lg:text-sm text-slate-800 font-bold leading-relaxed">
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
