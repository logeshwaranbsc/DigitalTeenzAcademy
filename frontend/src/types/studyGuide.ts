export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface ReferenceLink {
  id: string;
  title: string;
  subtitle?: string;
  url?: string;
  category?: string;
  hasLink: boolean;
}

export interface ContentSection {
  id: string;
  title: string;
  type: 'text' | 'table' | 'checklist' | 'callout' | 'calloutText' | 'flow' | 'reference_list';
  content?: string | string[];
  table?: TableData;
  checklist?: { label: string; items: string[] }[];
  calloutText?: string;
  flowSteps?: string[];
  referenceLinks?: ReferenceLink[];
}

export interface StudyDay {
  id: number;
  dayNumber: number;
  moduleId: number;
  moduleTitle: string;
  title: string;
  summary: string;
  contentSections: ContentSection[];
  practiceTask: {
    title: string;
    description: string;
    actionSteps: string[];
  };
  referenceLinks: ReferenceLink[];
}

export interface Module {
  id: number;
  code: string; // e.g. "M1"
  title: string;
  subtitle: string;
  dayRange: string; // e.g. "Days 1–4"
  startDay: number;
  endDay: number;
  description: string;
  iconName: string;
  color: string; // theme accent color
  days: StudyDay[];
}

export interface Flashcard {
  id: number;
  moduleId: number;
  moduleCode: string;
  moduleTitle: string;
  question: string;
  answer: string;
}

export interface PlannerDay {
  dayNumber: number;
  moduleId: number;
  moduleCode: string;
  title: string;
  studyTask: string;
  practiceTask: string;
}

export interface BookmarkItem {
  id: string;
  type: 'module' | 'day' | 'section' | 'flashcard';
  targetId: number | string;
  title: string;
  subtitle?: string;
}

export interface StudentProgressState {
  completedDays: number[]; // array of completed day numbers
  dayNotes: Record<number, string>; // dayNumber -> note content
  bookmarks: BookmarkItem[];
  flashcardStatus: Record<number, 'know' | 'need_review'>; // flashcardId -> status
  lastVisitedDay: number;
}
