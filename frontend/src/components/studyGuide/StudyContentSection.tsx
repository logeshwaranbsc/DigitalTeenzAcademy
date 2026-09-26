import React from 'react';
import {
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Search,
  FileText,
  Share2,
  Mail,
  DollarSign,
  Users,
  ShieldCheck,
} from 'lucide-react';
import type { ContentSection, BookmarkItem } from '../../types/studyGuide';

interface StudyContentSectionProps {
  section: ContentSection;
  dayNumber?: number;
  isBookmarked?: boolean;
  onToggleBookmark?: (item: BookmarkItem) => void;
  defaultExpanded?: boolean;
  hideTitle?: boolean;
}

export const StudyContentSection: React.FC<StudyContentSectionProps> = ({
  section,
  hideTitle = false,
}) => {
  return (
    <div className={hideTitle ? "space-y-2 pt-0" : "space-y-4 pt-1"}>
      {/* Section Title Header */}
      {!hideTitle && (
        <div className="pb-1">
          <h4 className="text-base lg:text-lg font-black text-slate-900 tracking-tight">
            {section.title}
          </h4>
        </div>
      )}

      {/* Content Body */}
      <div className="space-y-5 text-base lg:text-lg text-slate-800 leading-relaxed">
        {/* Text Content */}
        {section.content && (
          <div className="prose prose-slate max-w-none text-slate-700 text-base lg:text-lg leading-relaxed whitespace-pre-line font-normal">
            {section.content}
          </div>
        )}

        {/* Callout Box */}
        {section.calloutText && (
          <div className="bg-amber-50/90 border-l-4 border-amber-500 rounded-r-xl p-4 flex items-start gap-3 text-slate-800 shadow-2xs border border-amber-200/70">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs lg:text-sm font-medium whitespace-pre-line">
              {section.calloutText}
            </div>
          </div>
        )}

        {/* Table Content */}
        {section.table && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs my-3 bg-white">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-100 text-slate-900 text-xs font-black uppercase tracking-wider border-b border-slate-200">
                  {section.table.headers.map((head, idx) => {
                    const isTwoCol = section.table!.headers.length === 2;
                    return (
                      <th
                        key={idx}
                        className={`p-3.5 lg:p-4 ${
                          isTwoCol
                            ? idx === 0
                              ? 'w-2/5 lg:w-1/3'
                              : 'w-3/5 lg:w-2/3 pl-8 lg:pl-16'
                            : ''
                        }`}
                      >
                        {head}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs lg:text-sm text-slate-700 font-medium">
                {section.table.rows.map((row, rIdx) => {
                  const isTwoCol = row.length === 2;
                  return (
                    <tr key={rIdx} className="hover:bg-slate-50/90 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`p-3.5 lg:p-4 leading-normal ${
                            cIdx === 0 ? 'font-bold text-slate-900' : 'text-slate-700'
                          } ${isTwoCol && cIdx === 1 ? 'pl-8 lg:pl-16' : ''}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Feature Cards Grid (Core Channels & Checklists) matching reference design */}
        {section.checklist && (
          <div className="space-y-6 my-3">
            {section.checklist.map((group, gIdx) => {
              const showGroupLabel =
                Boolean(group.label) &&
                group.label.toLowerCase().trim() !== section.title.toLowerCase().trim() &&
                section.checklist!.length > 1;

              return (
                <div key={gIdx} className="space-y-4">
                  {showGroupLabel && (
                    <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles size={14} className="text-cyan-600" />
                      <span>{group.label}</span>
                    </h5>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((item, iIdx) => {
                    const hasColon = item.includes(':');
                    const parts = item.split(':');
                    const title = hasColon ? parts[0].trim() : item;
                    const description = hasColon ? parts.slice(1).join(':').trim() : '';
                    const numStr = String(iIdx + 1).padStart(2, '0');

                    // Pick icon based on channel keyword
                    let IconComponent: React.ElementType = CheckCircle2;
                    const lowerTitle = title.toLowerCase();
                    if (lowerTitle.includes('seo')) IconComponent = Search;
                    else if (lowerTitle.includes('content')) IconComponent = FileText;
                    else if (lowerTitle.includes('social')) IconComponent = Share2;
                    else if (lowerTitle.includes('email')) IconComponent = Mail;
                    else if (lowerTitle.includes('paid') || lowerTitle.includes('ad')) IconComponent = DollarSign;
                    else if (lowerTitle.includes('affiliate') || lowerTitle.includes('influencer')) IconComponent = Users;
                    else if (lowerTitle.includes('quality') || lowerTitle.includes('trust')) IconComponent = ShieldCheck;

                    return (
                      <div
                        key={iIdx}
                        className="bg-white border border-slate-200/90 rounded-2xl p-5 lg:p-6 shadow-2xs hover:shadow-md hover:border-slate-400 transition-all duration-300 flex flex-col justify-between space-y-4 group"
                      >
                        {/* Top Row: Icon pill on left, Amber/Gold number tag on right */}
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
                            <IconComponent size={18} />
                          </div>

                          <span className="text-amber-600 font-black text-sm lg:text-base tracking-wider">
                            {numStr}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-1.5 min-w-0">
                          <h6 className="text-sm lg:text-base font-black text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                            {title}
                          </h6>
                          {description && (
                            <p className="text-xs lg:text-sm text-slate-600 font-medium leading-relaxed">
                              {description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

        {/* Flow Diagram */}
        {section.flowSteps && (
          <div className="space-y-4 my-3">
            {(() => {
              const steps = section.flowSteps.filter(
                (s) => s.trim() !== '↓' && s.trim() !== '→' && s.trim() !== '->'
              );
              const count = steps.length;
              const gridCols =
                count <= 3
                  ? 'grid-cols-1 md:grid-cols-3'
                  : count === 4
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

              return (
                <div className={`grid ${gridCols} gap-4`}>
                  {steps.map((rawStep, idx) => {
                    // Remove leading "1. ", "2. ", etc. if present
                    const cleanStep = rawStep.replace(/^\d+[\.\)]\s*/, '').trim();

                    const hasColon = cleanStep.includes(':');
                    const parts = cleanStep.split(':');
                    const title = hasColon ? parts[0].trim() : cleanStep;
                    const description = hasColon ? parts.slice(1).join(':').trim() : '';
                    const numStr = String(idx + 1).padStart(2, '0');

                    return (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200/90 rounded-2xl p-5 lg:p-6 shadow-2xs hover:shadow-md hover:border-slate-400 transition-all duration-300 flex flex-col justify-between space-y-4 group"
                      >
                        {/* Top Row: Step Tag on left, Number tag on right */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 shadow-2xs">
                            Step {numStr}
                          </span>
                          <span className="text-amber-600 font-black text-sm lg:text-base tracking-wider">
                            {numStr}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-1.5 min-w-0">
                          <h6 className="text-sm lg:text-base font-black text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                            {title}
                          </h6>
                          {description && (
                            <p className="text-xs lg:text-sm text-slate-600 font-medium leading-relaxed">
                              {description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* Full-View Reference Link Showcase Cards */}
        {section.referenceLinks && section.referenceLinks.length > 0 && (
          <div className="space-y-4 pt-2">
            <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-amber-600" />
              <span>Reference Profiles & Visual Examples</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.referenceLinks.map((ref) => (
                <a
                  key={ref.id}
                  href={ref.hasLink && ref.url ? ref.url : '#'}
                  target={ref.hasLink && ref.url ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!ref.hasLink || !ref.url) e.preventDefault();
                  }}
                  className={`group relative flex flex-col justify-between rounded-3xl border transition-all duration-300 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                    ref.hasLink && ref.url
                      ? 'bg-white border-amber-200/80 hover:border-amber-400 cursor-pointer'
                      : 'bg-slate-50 border-slate-200 opacity-80 cursor-default'
                  }`}
                >
                  {/* Top Image */}
                  <div className="w-full h-48 sm:h-52 bg-slate-100 overflow-hidden relative border-b border-slate-100">
                    {ref.imageUrl ? (
                      <img
                        src={ref.imageUrl}
                        alt={ref.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <ExternalLink className="w-10 h-10 opacity-50" />
                      </div>
                    )}
                  </div>

                  {/* Middle Content & Bottom Link */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                    <div className="space-y-2">
                      {/* Soft Pill Badge */}
                      <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
                        {ref.subtitle || 'Reference Profile'}
                      </span>

                      {/* Card Title */}
                      <h6 className="text-base font-black text-slate-900 group-hover:text-amber-700 transition-colors leading-snug">
                        {ref.title}
                      </h6>

                      {/* Subtitle / Description / Link URL */}
                      {ref.url && (
                        <p className="text-xs text-slate-500 font-medium leading-relaxed truncate">
                          {ref.url}
                        </p>
                      )}
                    </div>

                    {/* Bottom Action Link */}
                    <div className="pt-2 flex items-center justify-between text-xs font-extrabold text-slate-800 group-hover:text-amber-700 transition-colors">
                      {ref.hasLink && ref.url ? (
                        <div className="flex items-center gap-1.5">
                          <span>View Reference</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                          <HelpCircle size={14} /> No link available
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
