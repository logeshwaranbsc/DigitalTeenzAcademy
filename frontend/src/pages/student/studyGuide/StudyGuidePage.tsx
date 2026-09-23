import { useState, useMemo } from 'react';
import { useStudyGuideProgress } from '../../../hooks/useStudyGuideProgress';
import { MODULES_DATA } from '../../../data/digitalMarketingData';
import { CourseHeader } from '../../../components/studyGuide/CourseHeader';
import { ModuleAccordion } from '../../../components/studyGuide/ModuleAccordion';
import { FlashcardsSection } from '../../../components/studyGuide/FlashcardsSection';
import { DailyPlannerSection } from '../../../components/studyGuide/DailyPlannerSection';
import { ReferenceLinksSection } from '../../../components/studyGuide/ReferenceLinksSection';
import { SearchBar } from '../../../components/studyGuide/SearchBar';
import { BookmarksView } from '../../../components/studyGuide/BookmarksView';
import { BookOpen, HelpCircle, Calendar, Link2, Bookmark, ChevronsDown, ChevronsUp } from 'lucide-react';

type TabType = 'guide' | 'flashcards' | 'planner' | 'references' | 'bookmarks';

export default function StudyGuidePage() {
  const {
    dayNotes,
    bookmarks,
    saveDayNote,
    toggleBookmark,
    isBookmarked,
  } = useStudyGuideProgress();

  const [activeTab, setActiveTab] = useState<TabType>('guide');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Accordion state: which module and which day is open
  const [expandedModuleIds, setExpandedModuleIds] = useState<number[]>([1]); // default Module 1 open
  const [expandedDayId, setExpandedDayId] = useState<number | null>(1); // default Day 1 open

  const toggleModuleExpand = (moduleId: number) => {
    setExpandedModuleIds((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [moduleId] // single module expansion mode
    );
  };

  const toggleDayExpand = (dayNumber: number) => {
    setExpandedDayId((prev) => (prev === dayNumber ? null : dayNumber));
  };

  const handleExpandAll = () => {
    setExpandedModuleIds(MODULES_DATA.map((m) => m.id));
    setExpandedDayId(1);
  };

  const handleCollapseAll = () => {
    setExpandedModuleIds([]);
    setExpandedDayId(null);
  };

  const handleNavigateToDay = (targetDayNumber: number) => {
    setActiveTab('guide');
    const targetModule = MODULES_DATA.find((m) =>
      m.days.some((d) => d.dayNumber === targetDayNumber)
    );

    if (targetModule) {
      setExpandedModuleIds([targetModule.id]);
      setExpandedDayId(targetDayNumber);

      setTimeout(() => {
        const el = document.getElementById(`day-accordion-${targetDayNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  // Search filtering across modules & days
  const filteredModules = useMemo(() => {
    if (!searchTerm.trim()) return MODULES_DATA;
    const term = searchTerm.toLowerCase();

    return MODULES_DATA.map((module) => {
      const matchingDays = module.days.filter((day) => {
        const inTitle = day.title.toLowerCase().includes(term);
        const inSummary = day.summary.toLowerCase().includes(term);
        const inSections = day.contentSections.some(
          (s) => s.title.toLowerCase().includes(term) || (typeof s.content === 'string' && s.content.toLowerCase().includes(term))
        );
        const inTask = day.practiceTask.title.toLowerCase().includes(term) || day.practiceTask.description.toLowerCase().includes(term);
        return inTitle || inSummary || inSections || inTask;
      });

      const moduleMatches =
        module.title.toLowerCase().includes(term) ||
        module.subtitle.toLowerCase().includes(term) ||
        module.description.toLowerCase().includes(term) ||
        matchingDays.length > 0;

      return moduleMatches
        ? {
            ...module,
            days: matchingDays.length > 0 ? matchingDays : module.days,
          }
        : null;
    }).filter(Boolean) as typeof MODULES_DATA;
  }, [searchTerm]);

  const searchResultCount = useMemo(() => {
    if (!searchTerm.trim()) return 0;
    return filteredModules.reduce((acc, m) => acc + m.days.length, 0);
  }, [filteredModules, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* 1. Course Header */}
      <CourseHeader />

      {/* 2. Navigation Tabs & Search Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen size={16} />
            <span>Course Accordions</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'flashcards'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HelpCircle size={16} />
            <span>42 Flashcards</span>
          </button>

          <button
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'planner'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar size={16} />
            <span>30-Day Planner</span>
          </button>

          <button
            onClick={() => setActiveTab('references')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'references'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Link2 size={16} />
            <span>Reference Links</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'bookmarks'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bookmark size={16} />
            <span>My Bookmarks ({bookmarks.length})</span>
          </button>
        </div>

        {/* Global Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          resultCount={searchTerm ? searchResultCount : undefined}
        />
      </div>

      {/* 3. Main View Tab Content */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          {/* Expand / Collapse Controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {filteredModules.length} Modules Available
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExpandAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <ChevronsDown size={14} />
                <span>Expand All</span>
              </button>
              <button
                onClick={handleCollapseAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <ChevronsUp size={14} />
                <span>Collapse All</span>
              </button>
            </div>
          </div>

          {/* Module Accordions List */}
          <div className="space-y-6">
            {filteredModules.map((module) => (
              <ModuleAccordion
                key={module.id}
                module={module}
                isExpanded={expandedModuleIds.includes(module.id)}
                onToggleExpand={() => toggleModuleExpand(module.id)}
                dayNotes={dayNotes}
                isBookmarked={isBookmarked(`module-${module.id}`)}
                onToggleBookmark={toggleBookmark}
                onSaveDayNote={saveDayNote}
                expandedDayId={expandedDayId}
                onToggleDayExpand={toggleDayExpand}
                isBookmarkedItem={isBookmarked}
              />
            ))}

            {filteredModules.length === 0 && (
              <div className="text-center p-12 bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm">
                No matching module or day found for "{searchTerm}". Try clearing your search query.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'flashcards' && <FlashcardsSection />}

      {activeTab === 'planner' && <DailyPlannerSection />}

      {activeTab === 'references' && <ReferenceLinksSection />}

      {activeTab === 'bookmarks' && (
        <BookmarksView
          bookmarks={bookmarks}
          onRemoveBookmark={toggleBookmark}
          onNavigateToDay={handleNavigateToDay}
        />
      )}
    </div>
  );
}
