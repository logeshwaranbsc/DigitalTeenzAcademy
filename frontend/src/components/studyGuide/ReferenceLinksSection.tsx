import React from 'react';
import { ExternalLink, Link2, Camera, ShieldCheck, HelpCircle } from 'lucide-react';
import { MODULES_DATA } from '../../data/digitalMarketingData';

export const ReferenceLinksSection: React.FC = () => {
  // Aggregate all reference links from all modules and days
  const allReferences = MODULES_DATA.flatMap((module) =>
    module.days.flatMap((day) =>
      day.referenceLinks.map((ref) => ({
        ...ref,
        moduleCode: module.code,
        moduleTitle: module.title,
        dayNumber: day.dayNumber,
      }))
    )
  );

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-800">Source Reference Links</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Curated expert reference profiles and real-world case studies from the source study guide.
          </p>
        </div>
      </div>

      {/* Featured Instagram Profiles Card */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-purple-500/30 space-y-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-pink-400" />
          <h3 className="text-base font-extrabold tracking-tight">
            Module 2 — Featured Personal Brand References
          </h3>
        </div>

        <p className="text-xs text-purple-200 leading-relaxed">
          Examine these verified reference profiles to observe clarity, credibility, and content positioning in action:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <a
            href="https://www.instagram.com/dharaneetharan/reels/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center justify-between gap-3 group"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300">
                <ShieldCheck size={14} />
                <span>Identity (Clarity)</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">Dharaneetharan Reels</h4>
              <p className="text-[11px] text-slate-300">Short-form business strategy</p>
            </div>
            <span className="p-2 rounded-xl bg-purple-600 group-hover:bg-purple-500 text-white transition-colors">
              <ExternalLink size={16} />
            </span>
          </a>

          <a
            href="https://www.instagram.com/journey_with_sudhan/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center justify-between gap-3 group"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300">
                <ShieldCheck size={14} />
                <span>Identity (Clarity)</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">Journey With Sudhan</h4>
              <p className="text-[11px] text-slate-300">Career & entrepreneurship</p>
            </div>
            <span className="p-2 rounded-xl bg-purple-600 group-hover:bg-purple-500 text-white transition-colors">
              <ExternalLink size={16} />
            </span>
          </a>

          <a
            href="https://www.instagram.com/sakthivelpannerselvam6/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center justify-between gap-3 group"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                <ShieldCheck size={14} />
                <span>Credibility (Trust)</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">Sakthivel Pannerselvam</h4>
              <p className="text-[11px] text-slate-300">Business growth consulting</p>
            </div>
            <span className="p-2 rounded-xl bg-purple-600 group-hover:bg-purple-500 text-white transition-colors">
              <ExternalLink size={16} />
            </span>
          </a>

          <a
            href="https://www.instagram.com/sangeethasabishek/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center justify-between gap-3 group"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                <ShieldCheck size={14} />
                <span>Credibility (Trust)</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">Sangeetha Sabish</h4>
              <p className="text-[11px] text-slate-300">Marketing education</p>
            </div>
            <span className="p-2 rounded-xl bg-purple-600 group-hover:bg-purple-500 text-white transition-colors">
              <ExternalLink size={16} />
            </span>
          </a>
        </div>
      </div>

      {/* All Course References Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          All Module References
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allReferences.map((ref, idx) => (
            <div
              key={`${ref.id}-${idx}`}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-3"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {ref.moduleCode} • Day {ref.dayNumber}
                </span>
                <h4 className="text-sm font-bold text-slate-800">{ref.title}</h4>
                {ref.subtitle && (
                  <p className="text-xs text-slate-500 mt-0.5">{ref.subtitle}</p>
                )}
              </div>

              {ref.hasLink && ref.url ? (
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-2xs transition-colors flex-shrink-0"
                >
                  <span>View Reference</span>
                  <ExternalLink size={13} />
                </a>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <HelpCircle size={13} />
                  <span>No link</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
