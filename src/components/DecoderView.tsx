import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Compass,
  ArrowRight,
  Shield,
  FileText,
  HelpCircle,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
  Scale,
  HeartHandshake,
  Info
} from 'lucide-react';
import { DecodedJob, UserProfile } from '../types';
import { PRESET_JDS } from '../data/sampleJDs';
import { runClientSideEthicsAudit } from '../utils/ethicsAudit';

interface DecoderViewProps {
  decodedJob: DecodedJob | null;
  isLoading: boolean;
  onDecode: (jobText: string, title?: string, company?: string) => Promise<void>;
  onProceedToBridge: () => void;
  onSaveToCRM: () => void;
  userProfile: UserProfile;
}

export const DecoderView: React.FC<DecoderViewProps> = ({
  decodedJob,
  isLoading,
  onDecode,
  onProceedToBridge,
  onSaveToCRM,
  userProfile,
}) => {
  const [inputText, setInputText] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [showAdvancedInputs, setShowAdvancedInputs] = useState(false);
  const [activeAnalysisSection, setActiveAnalysisSection] = useState<'all' | 'priorities' | 'implicit' | 'redflags' | 'ethics' | 'compensation'>('all');
  const [showPlainEnglishHelp, setShowPlainEnglishHelp] = useState(false);

  const handleSelectPreset = (presetId: string) => {
    const selected = PRESET_JDS.find((p) => p.id === presetId);
    if (selected) {
      setInputText(selected.text);
      setCustomTitle(selected.roleTitle);
      setCustomCompany(selected.company);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onDecode(inputText, customTitle, customCompany);
  };

  // Get or compute the ethics audit
  const ethicsAudit =
    decodedJob?.ethicsAudit ||
    (decodedJob?.rawJobDescription
      ? runClientSideEthicsAudit(decodedJob.rawJobDescription)
      : null);

  return (
    <div className="space-y-12">
      {/* Input Section */}
      <section className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
            <span>Career Intelligence Engine</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
              <Shield className="w-3.5 h-3.5" /> PII Scrubbing Active
            </span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setShowPlainEnglishHelp(!showPlainEnglishHelp)}
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 underline flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showPlainEnglishHelp ? 'Hide quick guide' : 'What does TrueFit do? (Simple guide)'}</span>
            </button>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
            Decode the Job. Reveal What Hiring Managers Actually Care About.
          </h1>

          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            Standard job postings are filled with HR buzzwords. TrueFit cuts through the noise in simple language to uncover the hiring manager’s real priorities, unwritten rules, salary reality, and an EEOC fair-hiring ethics audit.
          </p>

          {showPlainEnglishHelp && (
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2 text-xs text-stone-700 dark:text-stone-300 animate-fadeIn">
              <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Simple Terms Explained:</span>
              </div>
              <ul className="space-y-1.5 pl-4 list-disc text-stone-600 dark:text-stone-400">
                <li><strong>Real Priorities:</strong> What the hiring manager is actually trying to solve versus HR boilerplate lists.</li>
                <li><strong>Implicit Requirements:</strong> The unwritten rules and expectations that aren’t listed on the public post.</li>
                <li><strong>Red Flag Scanner:</strong> Warnings about unrealistic workloads, fuzzy pay, or burnout signals.</li>
                <li><strong>Ethics Audit (EEOC/DEI):</strong> Checks for accidental age, gender, or cultural bias using fair-hiring standards.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Quick Presets */}
        <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Explore with benchmarked real-world roles:
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESET_JDS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className="text-left p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40 hover:bg-white dark:hover:bg-stone-800 hover:border-stone-400 dark:hover:border-stone-700 hover:shadow-xs transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-stone-800 dark:text-stone-200 group-hover:text-stone-950 dark:group-hover:text-stone-50">
                  <span>{preset.company}</span>
                  <span className="text-[10px] text-stone-400">Sample</span>
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400 truncate mt-1">
                  {preset.roleTitle}
                </div>
                <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-1 line-clamp-1">
                  {preset.industry}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="jdInput" className="text-xs font-medium text-stone-700 dark:text-stone-300">
                Paste Job Description text
              </label>
              <button
                type="button"
                onClick={() => setShowAdvancedInputs(!showAdvancedInputs)}
                className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 underline transition-colors cursor-pointer"
              >
                {showAdvancedInputs ? 'Hide Role/Company fields' : '+ Specify Role & Company (optional)'}
              </button>
            </div>
            <textarea
              id="jdInput"
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste raw job description here... (e.g. from LinkedIn, Greenhouse, Lever, or company careers page)"
              className="w-full p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 text-sm focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 dark:focus:border-stone-600 transition-all font-sans"
              required
            />
          </div>

          {showAdvancedInputs && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Target Role Title
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Staff Software Engineer"
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-200 dark:border-stone-800 text-xs bg-stone-50 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={customCompany}
                  onChange={(e) => setCustomCompany(e.target.value)}
                  placeholder="e.g. Stripe, Figma, Linear"
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-200 dark:border-stone-800 text-xs bg-stone-50 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span>Client-side PII scrubbing</span>
              <span aria-hidden="true">·</span>
              <span>Gemini 3.8 Intelligence</span>
              <span aria-hidden="true">·</span>
              <span>EEOC Ethics Scanner</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 disabled:bg-stone-300 dark:disabled:bg-stone-800 text-white text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-stone-400 dark:border-t-stone-950 rounded-full animate-spin" />
                  <span>Decoding JD &amp; Running Ethics Audit...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 dark:text-amber-600" />
                  <span>Decode Job Description</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Decoded Output Presentation */}
      {decodedJob && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Header Summary Banner */}
          <div className="bg-stone-900 dark:bg-[#181614] border border-stone-800 text-stone-50 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
            <div className="relative z-10 space-y-4 max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300 dark:text-stone-400">
                <span className="font-semibold text-amber-300">{decodedJob.company}</span>
                <span aria-hidden="true">·</span>
                <span>{decodedJob.seniority}</span>
                <span aria-hidden="true">·</span>
                <span>Decoded with TrueFit</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white tracking-tight">
                {decodedJob.roleTitle}
              </h2>

              <p className="text-stone-300 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                {decodedJob.executiveSummary}
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={onProceedToBridge}
                  className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Step 2: Map Profile &amp; Skill Gaps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onSaveToCRM}
                  className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors border border-stone-700 cursor-pointer"
                >
                  Save to Career Tracker
                </button>
              </div>
            </div>
          </div>

          {/* Section Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
            {[
              { id: 'all', label: 'All Insights' },
              { id: 'priorities', label: 'Real Priorities' },
              { id: 'implicit', label: 'Implicit Rules' },
              { id: 'redflags', label: 'Red Flags & Risks' },
              { id: 'ethics', label: '⚖️ EEOC & Ethics Audit' },
              { id: 'compensation', label: 'Salary Reality Check' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAnalysisSection(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeAnalysisSection === tab.id
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 1. Real Priorities vs Implicit Requirements */}
          {(activeAnalysisSection === 'all' || activeAnalysisSection === 'priorities' || activeAnalysisSection === 'implicit') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Real Priorities */}
              {(activeAnalysisSection === 'all' || activeAnalysisSection === 'priorities') && (
                <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                      What the Hiring Manager Actually Wants
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Deconstructed business pain points that will decide the hire:
                  </p>
                  <div className="space-y-3 pt-1">
                    {decodedJob.realPriorities.map((priority, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                        <span className="font-mono text-xs text-stone-400 dark:text-stone-500 shrink-0">0{idx + 1}</span>
                        <span className="leading-relaxed">{priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Implicit Requirements & Hidden Expectations */}
              {(activeAnalysisSection === 'all' || activeAnalysisSection === 'implicit') && (
                <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                      Implicit Requirements (The Unwritten Rules)
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Expectations that won&apos;t be listed explicitly on the public JD:
                  </p>
                  <div className="space-y-3 pt-1">
                    {decodedJob.implicitRequirements.map((req, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">{req.item}</span>
                        </div>
                        <div className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                          <span className="font-medium text-stone-700 dark:text-stone-200">Why this matters: </span>
                          {req.why}
                        </div>
                        {req.sourceQuote && (
                          <div className="text-[11px] text-stone-400 dark:text-stone-500 italic pt-1 border-t border-stone-200/50 dark:border-stone-800/80">
                            &ldquo;{req.sourceQuote}&rdquo;
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* 2. Red Flag & Cultural Risk Scanner */}
          {(activeAnalysisSection === 'all' || activeAnalysisSection === 'redflags') && (
            <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                    JD Red Flag &amp; Risk Scanner
                  </h3>
                </div>
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  {decodedJob.redFlags.length} flagged patterns
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {decodedJob.redFlags.map((flag, idx) => {
                  const isHigh = flag.severity === 'high';
                  const isMed = flag.severity === 'medium';
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all ${
                        isHigh
                          ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20'
                          : isMed
                          ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20'
                          : 'border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                          {flag.flag}
                        </span>
                        <span className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded ${
                          isHigh
                            ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200'
                            : isMed
                            ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}>
                          {flag.severity} risk
                        </span>
                      </div>

                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed mb-2">
                        {flag.explanation}
                      </p>

                      <div className="bg-white/80 dark:bg-stone-900/80 p-2.5 rounded-lg border border-stone-200/60 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400 italic mb-2">
                        &ldquo;{flag.excerpt}&rdquo;
                      </div>

                      <div className="text-[11px] text-stone-600 dark:text-stone-300 bg-stone-100/70 dark:bg-stone-900/90 p-2.5 rounded-lg">
                        <span className="font-semibold text-stone-800 dark:text-stone-100">Tactical Interview Probe: </span>
                        {flag.recommendation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. ETHICS AUDIT VIEW (EEOC / DEI Assessment Heuristics) */}
          {(activeAnalysisSection === 'all' || activeAnalysisSection === 'ethics') && ethicsAudit && (
            <div className="bg-white dark:bg-[#1C1A18] border-2 border-stone-900/30 dark:border-stone-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="font-serif text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
                      Ethics &amp; Inclusivity Audit (EEOC / DEI Scanner)
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Evaluates language against standard EEOC (Equal Employment Opportunity Commission) fair-hiring heuristics.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-semibold text-stone-400">
                      Inclusivity Score
                    </div>
                    <div className="font-mono text-xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                      {ethicsAudit.overallInclusivityScore} / 100
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    ethicsAudit.overallInclusivityScore >= 85
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      : ethicsAudit.overallInclusivityScore >= 65
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                  }`}>
                    {ethicsAudit.inclusivityRating}
                  </span>
                </div>
              </div>

              {/* Summary note */}
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {ethicsAudit.summary}
              </div>

              {/* Flagged Bias Items */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Potentially Exclusionary Phrasing Detected ({ethicsAudit.items.length}):
                </div>

                {ethicsAudit.items.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Zero high-risk exclusionary patterns found. The language adheres to fair-hiring standards.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ethicsAudit.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/40 space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                            {item.category}
                          </span>
                          <span className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded ${
                            item.eeocRiskLevel === 'Elevated'
                              ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200'
                              : item.eeocRiskLevel === 'Moderate'
                              ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                              : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}>
                            {item.eeocRiskLevel} Risk
                          </span>
                        </div>

                        <div className="text-xs text-stone-500 dark:text-stone-400">
                          <strong>Pattern:</strong> {item.biasType}
                        </div>

                        <div className="p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-700 dark:text-stone-300 italic">
                          &ldquo;{item.flaggedText}&rdquo;
                        </div>

                        <div className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                          <span className="font-semibold text-stone-800 dark:text-stone-200">Why it matters: </span>
                          {item.whyItMatters}
                        </div>

                        <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 text-[11px] text-emerald-900 dark:text-emerald-200">
                          <span className="font-semibold">Inclusive Alternative: </span>
                          {item.inclusiveAlternative}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Compliance Guidance */}
              <div className="text-[11px] text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800 pt-3 flex items-start gap-2">
                <HeartHandshake className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <span>{ethicsAudit.eeocComplianceNotes}</span>
              </div>
            </div>
          )}

          {/* 4. Split: Salary Reality Check + Culture Fit Predictor */}
          {(activeAnalysisSection === 'all' || activeAnalysisSection === 'compensation') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Salary Reality Check */}
              <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                      Compensation Reality Check
                    </h3>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {decodedJob.salaryRealityCheck.assessment.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800 space-y-2">
                  <div className="text-xs text-stone-500 dark:text-stone-400">Market Benchmark Range</div>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                    {decodedJob.salaryRealityCheck.marketBenchmarkRange}
                  </div>
                  {decodedJob.salaryRealityCheck.disclosedRange && (
                    <div className="text-xs text-stone-500 dark:text-stone-400">
                      Disclosed in JD: <span className="text-stone-800 dark:text-stone-200 font-medium">{decodedJob.salaryRealityCheck.disclosedRange}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">Market Context: </span>
                  {decodedJob.salaryRealityCheck.insight}
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <span className="font-semibold">Leverage Strategy: </span>
                  {decodedJob.salaryRealityCheck.negotiationLeverage}
                </div>
              </div>

              {/* Culture Fit Predictor */}
              <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                      Culture &amp; Work Style Predictor
                    </h3>
                  </div>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    Alignment: <strong className="text-stone-900 dark:text-stone-100">{decodedJob.culturePredictor.workStyleMatch.matchLevel}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800">
                    <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Autonomy Level</div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
                        {decodedJob.culturePredictor.autonomyScore}%
                      </span>
                      <span className="text-[11px] text-stone-400">High Trust</span>
                    </div>
                    <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-stone-900 dark:bg-stone-100 h-1.5 rounded-full"
                        style={{ width: `${decodedJob.culturePredictor.autonomyScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800">
                    <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Execution Pace</div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
                        {decodedJob.culturePredictor.paceScore}%
                      </span>
                      <span className="text-[11px] text-stone-400">Rapid Sprint</span>
                    </div>
                    <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-amber-600 h-1.5 rounded-full"
                        style={{ width: `${decodedJob.culturePredictor.paceScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">Collaboration Cadence: </span>
                    {decodedJob.culturePredictor.collaborationStyle}
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">Psychological Safety: </span>
                    {decodedJob.culturePredictor.psychologicalSafetyEstimate}
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400">
                    <span className="font-medium text-stone-900 dark:text-stone-200">Fit with your profile: </span>
                    {decodedJob.culturePredictor.workStyleMatch.details}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Bottom Action Strip */}
          <div className="p-6 bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                Ready to see where your profile matches &amp; where the skill gaps lie?
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                We’ll map your skills against {decodedJob.company}’s requirements and generate your 4-hour roadmap.
              </p>
            </div>
            <button
              onClick={onProceedToBridge}
              className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 text-white text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap shadow-xs cursor-pointer"
            >
              <span>Map Profile &amp; Identify Gaps</span>
              <ArrowRight className="w-4 h-4 text-amber-300 dark:text-amber-600" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
