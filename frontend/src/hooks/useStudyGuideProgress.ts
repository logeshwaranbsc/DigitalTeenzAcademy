import { useState, useCallback } from 'react';
import type { BookmarkItem } from '../types/studyGuide';

export function useStudyGuideProgress() {
  const [dayNotes, setDayNotes] = useState<Record<number, string>>({});
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  const saveDayNote = useCallback((dayNumber: number, note: string) => {
    setDayNotes((prev) => ({
      ...prev,
      [dayNumber]: note,
    }));
  }, []);

  const toggleBookmark = useCallback((item: BookmarkItem) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      return exists ? prev.filter((b) => b.id !== item.id) : [...prev, item];
    });
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((b) => b.id === id),
    [bookmarks]
  );

  return {
    dayNotes,
    bookmarks,
    saveDayNote,
    toggleBookmark,
    isBookmarked,
  };
}
