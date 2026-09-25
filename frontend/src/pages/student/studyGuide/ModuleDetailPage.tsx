import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MODULES_DATA } from '../../../data/digitalMarketingData';
import { useStudyGuideProgress } from '../../../hooks/useStudyGuideProgress';
import { DayAccordion } from '../../../components/studyGuide/DayAccordion';
import {
  Compass,
  UserCheck,
  Video,
  Search,
  DollarSign,
  Globe,
  Briefcase,
  Layers,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  GraduationCap,
  Layers3,
} from 'lucide-react';

const MODULE_ICONS: Record<string, React.ElementType> = {
  Compass,
  UserCheck,
  Video,
  Search,
  DollarSign,
  Globe,
  Briefcase,
};

export default function ModuleDetailPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { isBookmarked, toggleBookmark } = useStudyGuideProgress();

  const module = MODULES_DATA.find((m) => m.id === Number(moduleId));

  // Accordion state for days inside this module (default Day 1 expanded)
  const [expandedDayNumbers, setExpandedDayNumbers] = useState<number[]>(
    module?.days[0] ? [module.days[0].dayNumber] : []
  );

  const toggleDayExpand = (dayNumber: number) => {
    setExpandedDayNumbers((prev) =>
      prev.includes(dayNumber) ? prev.filter((d) => d !== dayNumber) : [...prev, dayNumber]
    );
  };

  if (!module) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-800">Module Not Found</h1>
          <p className="text-slate-500">The module you requested could not be located.</p>
          <Link
            to="/student/courses"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to All Modules</span>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = MODULE_ICONS[module.iconName] || Layers;
  const moduleBookmarkId = `module-${module.id}`;
  const isModuleBookmarked = isBookmarked(moduleBookmarkId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 w-full">
      {/* 1. Clean Top Header Bar (No Sidebar, No Dark Blue Banner) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/student/courses"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex-shrink-0"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Courses</span>
          </Link>

          <div className="h-6 w-px bg-slate-200 hidden sm:block flex-shrink-0" />

          {/* Module Title Header Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${module.color} text-white flex items-center justify-center font-black text-sm shadow-2xs flex-shrink-0`}
            >
              <IconComponent size={18} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-slate-900 text-white tracking-wider">
                  {module.code}
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md hidden md:inline">
                  {module.dayRange}
                </span>
              </div>
              <h1 className="text-base lg:text-lg font-extrabold text-slate-900 truncate tracking-tight">
                {module.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Right Controls: Portal Logo & Bookmark */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() =>
              toggleBookmark({
                id: moduleBookmarkId,
                type: 'module',
                targetId: module.id,
                title: `${module.code} — ${module.title}`,
                subtitle: module.dayRange,
              })
            }
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              isModuleBookmarked
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isModuleBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            <span className="hidden sm:inline">
              {isModuleBookmarked ? 'Bookmarked' : 'Bookmark Module'}
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
              <GraduationCap size={18} />
            </div>
            <span className="text-xs font-extrabold text-slate-800">Digital Teenz</span>
          </div>
        </div>
      </header>

      {/* 2. Submodules Accordions List in Full Screen Width */}
      <main className="w-full px-4 lg:px-8 py-6 space-y-6">
        {/* Module Sub-Header Title Row */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2 text-slate-800 font-extrabold text-lg">
            <Layers3 className="text-cyan-600" size={22} />
            <span>{module.title} — Submodules ({module.days.length} Days)</span>
          </div>
        </div>

        {/* All Submodules Rendered as Full-Screen Accordions */}
        <div className="space-y-4 w-full">
          {module.days.map((day) => (
            <DayAccordion
              key={day.dayNumber}
              day={day}
              isBookmarked={isBookmarked(`day-${day.dayNumber}`)}
              onToggleBookmark={toggleBookmark}
              isExpanded={expandedDayNumbers.includes(day.dayNumber)}
              onToggleExpand={() => toggleDayExpand(day.dayNumber)}
              isBookmarkedSection={isBookmarked}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
