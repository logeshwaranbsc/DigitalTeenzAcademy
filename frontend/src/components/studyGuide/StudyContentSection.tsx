import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  AlertCircle,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import type { ContentSection, BookmarkItem } from '../../types/studyGuide';

interface StudyContentSectionProps {
  section: ContentSection;
  dayNumber: number;
  isBookmarked: boolean;
  onToggleBookmark: (item: BookmarkItem) => void;
  defaultExpanded?: boolean;
}

export const StudyContentSection: React.FC<StudyContentSectionProps> = ({
  section,
  dayNumber,
  isBookmarked,
  onToggleBookmark,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const bookmarkItem: BookmarkItem = {
    id: `sec-${section.id}`,
    type: 'section',
    targetId: section.id,
    title: section.title,
    subtitle: `Day ${dayNumber} Content Section`,
  };

  return (
    <div className="border border-slate-200/80 rounded-2xl bg-white shadow-xs overflow-hidden transition-all duration-200 hover:border-slate-300">
      {/* Sub-accordion Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3.5 bg-slate-50/70 hover:bg-slate-100/80 flex items-center justify-between cursor-pointer select-none transition-colors border-b border-slate-100"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-slate-500 hover:text-slate-800 transition-colors">
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </span>
          <h4 className="text-sm lg:text-base font-bold text-slate-800 tracking-tight">
            {section.title}
          </h4>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleBookmark(bookmarkItem)}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              isBookmarked
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Bookmark Section'}
          >
            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>
      </div>

      {/* Sub-accordion Body */}
      {isExpanded && (
        <div className="p-4 lg:p-5 space-y-4 text-sm text-slate-700 leading-relaxed">
          {/* Text Content */}
          {section.content && (
            <div className="prose prose-slate max-w-none text-slate-600 text-sm whitespace-pre-line">
              {section.content}
            </div>
          )}

          {/* Callout Box */}
          {section.calloutText && (
            <div className="bg-amber-50/80 border-l-4 border-amber-500 rounded-r-xl p-4 flex items-start gap-3 text-amber-900 shadow-2xs">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs lg:text-sm font-medium whitespace-pre-line">
                {section.calloutText}
              </div>
            </div>
          )}

          {/* Table Content */}
          {section.table && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs my-3">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    {section.table.headers.map((head, idx) => (
                      <th key={idx} className="p-3 lg:p-3.5">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs lg:text-sm text-slate-600">
                  {section.table.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 lg:p-3.5 font-normal leading-normal">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Checklist */}
          {section.checklist && (
            <div className="space-y-4 my-2">
              {section.checklist.map((group, gIdx) => (
                <div key={gIdx} className="bg-slate-50/60 rounded-xl p-4 border border-slate-100">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    {group.label}
                  </h5>
                  <ul className="space-y-2.5">
                    {group.items.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2.5 text-xs lg:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Flow Diagram */}
          {section.flowSteps && (
            <div className="bg-cyan-50/40 border border-cyan-100 rounded-2xl p-4 lg:p-5 my-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {section.flowSteps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex-1 bg-white border border-cyan-200/80 rounded-xl p-3 shadow-2xs text-center font-semibold text-xs lg:text-sm text-slate-800">
                      {step}
                    </div>
                    {idx < section.flowSteps!.length - 1 && (
                      <div className="flex justify-center text-cyan-500">
                        <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Reference Links Buttons (e.g. Dharaneetharan, Journey With Sudhan, Sakthivel Pannerselvam, Sangeetha Sabish) */}
          {section.referenceLinks && section.referenceLinks.length > 0 && (
            <div className="space-y-3 pt-2">
              {section.referenceLinks.map((ref) => (
                <div
                  key={ref.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 hover:border-purple-200 transition-colors"
                >
                  <div>
                    <h6 className="text-sm font-bold text-slate-800">{ref.title}</h6>
                    {ref.subtitle && <p className="text-xs text-slate-500 mt-0.5">{ref.subtitle}</p>}
                  </div>

                  {ref.hasLink && ref.url ? (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                    >
                      <span>View Reference</span>
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-xs font-medium">
                      <HelpCircle size={14} />
                      <span>Example reference not available</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
