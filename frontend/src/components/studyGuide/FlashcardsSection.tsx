import React, { useState, useMemo } from 'react';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Filter,
  Eye,
  Sparkles,
} from 'lucide-react';
import { FLASHCARDS_DATA, MODULES_DATA } from '../../data/digitalMarketingData';

export const FlashcardsSection: React.FC = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<number | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState(FLASHCARDS_DATA);

  // Filter deck by module
  const filteredCards = useMemo(() => {
    if (selectedModuleId === 'all') return deck;
    return deck.filter((c) => c.moduleId === selectedModuleId);
  }, [deck, selectedModuleId]);

  const activeCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
  };

  const handleModuleChange = (modId: number | 'all') => {
    setSelectedModuleId(modId);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="space-y-6">
      {/* Flashcards Header & Controls Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-800">42 Study Flashcards</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Test and reinforce key concepts across all 7 study modules.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Module Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700">
            <Filter size={14} className="text-slate-500" />
            <select
              value={selectedModuleId}
              onChange={(e) =>
                handleModuleChange(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="bg-transparent border-none focus:outline-none cursor-pointer font-bold text-slate-800"
            >
              <option value="all">All Modules (42 Cards)</option>
              {MODULES_DATA.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} — {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Shuffle Button */}
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title="Shuffle deck"
          >
            <Shuffle size={14} />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Flashcard Deck Card */}
      {activeCard ? (
        <div className="max-w-2xl mx-auto space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`min-h-[280px] sm:min-h-[320px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer select-none transition-all duration-500 shadow-lg border relative overflow-hidden ${
              isFlipped
                ? 'bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-900 text-white border-purple-500/40'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Top Bar of Card */}
            <div className="flex items-center justify-between text-xs">
              <span
                className={`font-bold px-3 py-1 rounded-full ${
                  isFlipped
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {activeCard.moduleCode} • Card {currentIndex + 1} of {filteredCards.length}
              </span>
            </div>

            {/* Main Content (Question or Answer) */}
            <div className="my-auto py-6 text-center space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {isFlipped ? 'Answer' : 'Question'}
              </span>

              <h3
                className={`text-lg sm:text-2xl font-extrabold tracking-tight leading-snug whitespace-pre-line ${
                  isFlipped ? 'text-purple-100' : 'text-slate-800'
                }`}
              >
                {isFlipped ? activeCard.answer : activeCard.question}
              </h3>
            </div>

            {/* Bottom Flip Hint */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 opacity-80">
              <RotateCw size={14} className="animate-spin-slow" />
              <span>Click card to {isFlipped ? 'show question' : 'flip answer'}</span>
            </div>
          </div>

          {/* Action Controls below card */}
          <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            {/* Show Answer Toggle */}
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <Eye size={16} />
              <span>{isFlipped ? 'Hide Answer' : 'Show Answer'}</span>
            </button>

            {/* Prev / Next Pagination */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Previous card"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs font-bold text-slate-500 px-2">
                {currentIndex + 1} / {filteredCards.length}
              </span>
              <button
                onClick={handleNext}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Next card"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
          No flashcards found for this selection.
        </div>
      )}
    </div>
  );
};
