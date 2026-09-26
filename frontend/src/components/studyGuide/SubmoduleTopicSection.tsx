import React from 'react';
import {
  Target,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import type { StudyDay, BookmarkItem } from '../../types/studyGuide';
import { StudyContentSection } from './StudyContentSection';

interface SubmoduleTopicSectionProps {
  day: StudyDay;
  isBookmarked?: boolean;
  onToggleBookmark?: (item: BookmarkItem) => void;
  isBookmarkedSection?: (id: string) => boolean;
  imageSrc?: string;
}

const SECTION_BAND_COLORS = [
  "bg-emerald-50/70 border-b border-emerald-200/60",
  "bg-sky-50/70 border-b border-sky-200/60",
  "bg-purple-50/70 border-b border-purple-200/60",
  "bg-amber-50/70 border-b border-amber-200/60",
  "bg-rose-50/70 border-b border-rose-200/60",
  "bg-teal-50/70 border-b border-teal-200/60",
  "bg-indigo-50/70 border-b border-indigo-200/60",
  "bg-orange-50/70 border-b border-orange-200/60",
  "bg-fuchsia-50/70 border-b border-fuchsia-200/60",
  "bg-cyan-50/70 border-b border-cyan-200/60",
];

export const SubmoduleTopicSection: React.FC<SubmoduleTopicSectionProps> = ({
  day,
  imageSrc,
}) => {
  const hasPracticeTask = Boolean(
    day.practiceTask?.title && day.practiceTask.actionSteps && day.practiceTask.actionSteps.length > 0
  );

  const introSection = day.contentSections[0];
  const remainingSections = day.contentSections.slice(1);

  return (
    <div id={`topic-section-${day.id}`} className="w-full">
      {/* 1. TOP INTRO BAND: QUESTION & ANSWER (LEFT) & RELATED IMAGE (RIGHT) */}
      <section className={`w-full py-8 lg:py-12 ${SECTION_BAND_COLORS[0]}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className={`grid grid-cols-1 ${imageSrc ? 'lg:grid-cols-12 gap-8 items-stretch' : 'gap-4'}`}>
            {/* Left Column: Title & Intro Explanation starting at the top */}
            <div className={imageSrc ? 'lg:col-span-7 space-y-3 flex flex-col justify-start' : 'w-full space-y-3'}>
              <div className="min-w-0">
                <h3 className="text-xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  {day.title}
                </h3>
              </div>

              {introSection && (
                <StudyContentSection
                  key={introSection.id}
                  section={introSection}
                  dayNumber={day.dayNumber}
                  defaultExpanded={true}
                  hideTitle={introSection.title.toLowerCase().trim() === day.title.toLowerCase().trim()}
                />
              )}
            </div>

            {/* Right Column: Related Image matching content height */}
            {imageSrc && (
              <div className="lg:col-span-5 flex flex-col h-full w-full">
                <div className="relative flex-1 min-h-[300px] h-full w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md group/img bg-slate-100 flex flex-col hover:shadow-2xl hover:-translate-y-1.5 hover:border-slate-300 transition-all duration-500 cursor-pointer">
                  <img
                    src={imageSrc}
                    alt={day.title}
                    className="w-full h-full flex-1 object-cover object-center group-hover/img:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-slate-900 text-xs font-bold backdrop-blur-md bg-white/95 p-2.5 rounded-xl border border-slate-200 shadow-2xs group-hover/img:shadow-md transition-shadow">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-600 animate-pulse" />
                      <span className="font-black text-xs">Digital Marketing Guide — {day.title}</span>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md font-black uppercase border border-blue-200/60">
                      Visual Guide
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. FULL-WIDTH REMAINING SECTIONS: FULL-WIDTH HORIZONTAL COLOR BANDS */}
      {remainingSections.length > 0 && (
        <>
          {remainingSections.map((sec, idx) => {
            const bandColor = SECTION_BAND_COLORS[(idx + 1) % SECTION_BAND_COLORS.length];
            return (
              <section
                key={sec.id}
                className={`w-full py-8 lg:py-12 ${bandColor}`}
              >
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                  <StudyContentSection
                    section={sec}
                    dayNumber={day.dayNumber}
                    defaultExpanded={true}
                  />
                </div>
              </section>
            );
          })}
        </>
      )}

      {/* 3. PRACTICE TASK & ACTION STEPS CARDS GRID (Only if available) */}
      {hasPracticeTask && day.practiceTask && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
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
                    className="bg-white border border-slate-200/90 rounded-2xl p-5 lg:p-6 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-400 hover:ring-2 hover:ring-blue-400/20 transition-all duration-300 flex flex-col justify-between space-y-4 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center font-bold shadow-2xs group-hover:scale-110 group-hover:bg-emerald-100 group-hover:border-emerald-300 transition-all duration-300">
                        <CheckCircle2 size={18} />
                      </div>

                      <span className="text-amber-600 font-black text-sm lg:text-base tracking-wider group-hover:scale-110 group-hover:text-amber-500 transition-transform duration-300">
                        {numStr}
                      </span>
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <h6 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                        Action Step {numStr}
                      </h6>
                      <p className="text-xs lg:text-sm text-slate-800 font-bold leading-relaxed group-hover:text-blue-900 transition-colors duration-300">
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
