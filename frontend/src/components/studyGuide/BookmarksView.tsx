import React from 'react';
import { Bookmark, Trash2, ArrowUpRight } from 'lucide-react';
import type { BookmarkItem } from '../../types/studyGuide';

interface BookmarksViewProps {
  bookmarks: BookmarkItem[];
  onRemoveBookmark: (item: BookmarkItem) => void;
  onNavigateToDay: (dayNumber: number) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  onRemoveBookmark,
  onNavigateToDay,
}) => {
  if (bookmarks.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Bookmark size={24} />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Bookmarks Saved Yet</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Click the bookmark icon 🔖 next to any module, study day, or content section to save it here for quick review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          My Saved Bookmarks ({bookmarks.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                {b.type}
              </span>
              <h4 className="text-sm font-bold text-slate-800 mt-1">{b.title}</h4>
              {b.subtitle && (
                <p className="text-xs text-slate-500 mt-0.5">{b.subtitle}</p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {typeof b.targetId === 'number' && (
                <button
                  onClick={() => onNavigateToDay(Number(b.targetId))}
                  className="p-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 transition-colors"
                  title="Jump to item"
                >
                  <ArrowUpRight size={16} />
                </button>
              )}

              <button
                onClick={() => onRemoveBookmark(b)}
                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Remove bookmark"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
