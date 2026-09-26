import React from 'react';
import {
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
  ExternalLink,
} from 'lucide-react';
import type { Module, BookmarkItem } from '../../types/studyGuide';

interface ModuleAccordionProps {
  module: Module;
  isBookmarked: boolean;
  onToggleBookmark: (item: BookmarkItem) => void;
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
  isBookmarked,
  onToggleBookmark,
}) => {
  const IconComponent = MODULE_ICONS[module.iconName] || Layers;

  const moduleBookmarkItem: BookmarkItem = {
    id: `module-${module.id}`,
    type: 'module',
    targetId: module.id,
    title: `${module.code} — ${module.title}`,
    subtitle: module.dayRange,
  };

  const handleOpenModule = () => {
    window.open(`/student/courses/module/${module.id}`, '_blank');
  };

  return (
    <div
      id={`module-card-${module.id}`}
      onClick={handleOpenModule}
      className="border border-slate-200 hover:border-cyan-400 rounded-3xl bg-white shadow-xs overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:ring-2 hover:ring-cyan-400/20 cursor-pointer group"
    >
      {/* Module Card Content */}
      <div className="p-5 lg:p-6 bg-gradient-to-r from-slate-50/90 via-white to-slate-50/50 group-hover:bg-cyan-50/20 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Icon, Code, Title & Description */}
          <div className="flex items-start gap-4">
            {/* Module Icon Badge */}
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${module.color} text-white flex items-center justify-center font-black text-lg shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
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
                <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-lg">
                  {module.days.length} Submodules
                </span>
              </div>

              <h2 className="text-lg lg:text-xl font-extrabold text-slate-800 tracking-tight leading-snug group-hover:text-cyan-700 transition-colors">
                {module.title}
              </h2>
              <p className="text-xs lg:text-sm text-slate-500 font-medium">
                {module.subtitle}
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div
            className="flex items-center justify-end gap-3 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
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
              onClick={handleOpenModule}
              className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-all cursor-pointer shadow-2xs"
              title="Open module in new tab"
            >
              <ExternalLink size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
