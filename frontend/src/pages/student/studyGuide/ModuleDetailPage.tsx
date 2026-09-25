import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MODULES_DATA } from '../../../data/digitalMarketingData';
import { useStudyGuideProgress } from '../../../hooks/useStudyGuideProgress';
import { SubmoduleTopicSection } from '../../../components/studyGuide/SubmoduleTopicSection';
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
  Sparkles,
  BookOpen,
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

const MODULE_IMAGES: Record<number, string> = {
  1: '/assets/images/digital_marketing_overview.jpg',
  2: '/assets/images/social_media_branding.jpg',
  3: '/assets/images/social_media_branding.jpg',
  4: '/assets/images/seo_analytics_marketing.jpg',
  5: '/assets/images/seo_analytics_marketing.jpg',
  6: '/assets/images/digital_marketing_overview.jpg',
  7: '/assets/images/digital_marketing_overview.jpg',
};

export default function ModuleDetailPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { isBookmarked, toggleBookmark } = useStudyGuideProgress();

  const module = MODULES_DATA.find((m) => m.id === Number(moduleId));

  if (!module) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Module Not Found</h1>
          <p className="text-slate-500">The module you requested could not be located.</p>
          <Link
            to="/student/courses"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-black hover:bg-slate-800 transition-colors shadow-sm"
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
  const moduleImage = MODULE_IMAGES[module.id] || '/assets/images/digital_marketing_overview.jpg';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 w-full animate-fade-in relative">
      {/* 1. Top Navigation Bar Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/student/courses"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-black transition-all hover:scale-105 flex-shrink-0 shadow-2xs"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Courses</span>
          </Link>

          <div className="h-6 w-px bg-slate-200 hidden sm:block flex-shrink-0" />

          {/* Module Title Header Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${module.color} text-white flex items-center justify-center font-black text-sm shadow-md flex-shrink-0`}
            >
              <IconComponent size={18} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 tracking-wider border border-blue-200/60">
                  {module.code}
                </span>
                <span className="text-[11px] font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md hidden md:inline border border-slate-200/60">
                  {module.days.length} Topics
                </span>
              </div>
              <h1 className="text-base lg:text-lg font-black text-slate-900 truncate tracking-tight">
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
                subtitle: module.subtitle,
              })
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all hover:scale-105 ${
              isModuleBookmarked
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 shadow-2xs border border-amber-200/80'
                : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200 shadow-2xs'
            }`}
          >
            {isModuleBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            <span className="hidden sm:inline">
              {isModuleBookmarked ? 'Bookmarked' : 'Bookmark Module'}
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-2xs">
              <GraduationCap size={18} />
            </div>
            <span className="text-xs font-black text-slate-900">Digital Teenz</span>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="w-full px-4 lg:px-8 py-8 space-y-6 max-w-7xl mx-auto relative z-10">
        {/* Module Header Title Badge */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-black text-xl tracking-tight">
            <BookOpen className="text-blue-600" size={24} />
            <span>{module.code}: {module.title}</span>
          </div>
          <span className="text-xs font-black text-blue-900 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/80 shadow-2xs">
            Course Module Guide — {module.days.length} Topics
          </span>
        </div>

        {/* SINGLE UNIFIED SECTION CONTAINER */}
        <section className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 lg:p-10 shadow-lg space-y-10 relative overflow-hidden">
          {/* Clean Light Module Banner Hero */}
          <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-purple-50/80 text-slate-900 rounded-2xl p-6 lg:p-7 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-100/90">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black px-3 py-1 rounded-lg bg-blue-600 text-white tracking-wider shadow-2xs">
                  {module.code} MODULE
                </span>
                <span className="text-xs font-bold bg-white text-indigo-900 px-3 py-1 rounded-lg border border-indigo-200/60 shadow-2xs">
                  {module.days.length} Topics Included
                </span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {module.title}
              </h2>
              <p className="text-xs lg:text-sm text-slate-600 font-medium leading-relaxed">
                {module.description}
              </p>
            </div>

            <div className="w-full md:w-72 h-40 rounded-xl overflow-hidden border border-indigo-200/60 shadow-sm flex-shrink-0 relative group bg-white">
              <img
                src={moduleImage}
                alt={module.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-extrabold text-blue-900 bg-white/95 backdrop-blur-md py-1 rounded-md border border-slate-200/80 flex items-center justify-center gap-1 shadow-2xs">
                <Sparkles size={11} className="text-blue-600" />
                <span>Digital Marketing Guide</span>
              </div>
            </div>
          </div>

          {/* STREAM OF ALL TOPICS INSIDE THIS SINGLE SECTION */}
          <div className="space-y-12">
            {module.days.map((day, idx) => (
              <React.Fragment key={day.id}>
                {idx > 0 && <div className="border-t border-slate-200/90 pt-8" />}

                <SubmoduleTopicSection
                  day={day}
                  isBookmarked={isBookmarked(`topic-${day.id}`)}
                  onToggleBookmark={toggleBookmark}
                  isBookmarkedSection={isBookmarked}
                  imageSrc={idx === 0 ? moduleImage : undefined}
                />
              </React.Fragment>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
