import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MODULES_DATA } from '../../../data/digitalMarketingData';
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
  GraduationCap,
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

        {/* Right Controls: Portal Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-2xs">
              <GraduationCap size={18} />
            </div>
            <span className="text-xs font-black text-slate-900">Digital Teenz</span>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="w-full px-4 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto relative z-10">
        {/* STREAM OF ALL TOPICS INSIDE THIS MODULE */}
        <div className="space-y-12">
          {module.days.map((day, idx) => (
            <React.Fragment key={day.id}>
              <SubmoduleTopicSection
                day={day}
                isBookmarked={false}
                onToggleBookmark={() => {}}
                isBookmarkedSection={() => false}
                imageSrc={idx === 0 ? moduleImage : undefined}
              />
            </React.Fragment>
          ))}
        </div>
      </main>
    </div>
  );
}
