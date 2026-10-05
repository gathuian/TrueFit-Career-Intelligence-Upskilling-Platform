import React from 'react';
import {
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  HelpCircle,
  Target,
  Zap,
  Briefcase
} from 'lucide-react';
import { DecodedJob, GapAnalysis, UserProfile, CriticalGap } from '../types';

interface BridgeViewProps {
  decodedJob: DecodedJob | null;
  gapAnalysis: GapAnalysis | null;
  isLoading: boolean;
  onAnalyzeGap: () => Promise<void>;
  onSelectGapForUpskill: (gap: CriticalGap) => void;
  onNavigateToDecoder: () => void;
  userProfile: UserProfile;
}

export const BridgeView: React.FC<BridgeViewProps> = ({
  decodedJob,
  gapAnalysis,
  isLoading,
  onAnalyzeGap,
  onSelectGapForUpskill,
  onNavigateToDecoder,
  userProfile,
}) => {
  if (!decodedJob) {
    return (
      <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-600 dark:text-stone-400">
          <Target className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100">
          No Job Decoded Yet
        </h2>
        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          Before we can map your profile and calculate precise skill gaps, we need a decoded job description.
        </p>
        <button
          onClick={onNavigateToDecoder}
          className="mt-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          Go to Step 1: Decode a Job
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Top Banner / Match Readiness Display */}
      <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
              <span>Candidate Mapping</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-900 dark:text-stone-100 font-semibold">{userProfile.name}</span>
              <span aria-hidden="true">vs</span>
              <span className="text-stone-900 dark:text-stone-100 font-semibold">{decodedJob.roleTitle} at {decodedJob.company}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 tracking-tight">
              Skill Alignment &amp; Precision Gap Analysis
            </h1>

            <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
              {gapAnalysis
                ? gapAnalysis.confidenceSummary
                : 'Run TrueFit’s semantic matcher to discover your true match percentage, verified strengths, and high-impact gaps.'}
            </p>
          </div>

          {/* Radial or Visual Match Meter */}
          <div className="flex items-center gap-4 bg-stone-50 dark:bg-stone-900/60 p-4 rounded-xl border border-stone-100 dark:border-stone-800 shrink-0">
            {gapAnalysis ? (
              <>
                <div className="relative w-18 h-18 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-stone-200 dark:text-stone-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={
                        gapAnalysis.overallMatchScore >= 75
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : gapAnalysis.overallMatchScore >= 50
                          ? 'text-amber-500 dark:text-amber-400'
                          : 'text-rose-500 dark:text-rose-400'
                      }
                      strokeDasharray={`${gapAnalysis.overallMatchScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute font-mono text-lg font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                    {gapAnalysis.overallMatchScore}%
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                    {gapAnalysis.overallMatchScore >= 75
                      ? 'Strong Foundation'
                      : gapAnalysis.overallMatchScore >= 50
                      ? 'Within Striking Distance'
                      : 'Pivot Recommended'}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    {gapAnalysis.criticalGaps.length} critical gap{gapAnalysis.criticalGaps.length === 1 ? '' : 's'} identified
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={onAnalyzeGap}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 text-white text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mapping Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-amber-600" />
                    <span>Calculate Gap Analysis</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {gapAnalysis && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Main 2-Column: Matched Strengths & Critical Gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Matched Skills & How to Pitch Them */}
            <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                    Verified Matches (Your Stronghold)
                  </h3>
                </div>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  {gapAnalysis.matchedSkills.length} aligned areas
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Skills you already possess, framed for maximum persuasion in {decodedJob.company}&apos;s context:
              </p>

              <div className="space-y-3 pt-1">
                {gapAnalysis.matchedSkills.map((match, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">
                        {match.skill}
                      </span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded font-medium border border-emerald-100 dark:border-emerald-900">
                        Strong Match
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 dark:text-stone-300">
                      <span className="text-stone-500 dark:text-stone-400 font-medium">Evidence in profile: </span>
                      {match.evidenceInProfile}
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-200">
                      <span className="font-semibold text-stone-900 dark:text-stone-100">How to pitch to hiring manager: </span>
                      {match.howToPitch}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Skill Gaps & 4-Hr Solution */}
            <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                    Critical Gaps to Close
                  </h3>
                </div>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  {gapAnalysis.criticalGaps.length} blocker{gapAnalysis.criticalGaps.length === 1 ? '' : 's'}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                These missing skills could trigger hesitation. Pick one to generate a bespoke 4-hour micro-project:
              </p>

              <div className="space-y-3 pt-1">
                {gapAnalysis.criticalGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-3 transition-all hover:bg-amber-50/60 dark:hover:bg-amber-950/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                          {gap.skill}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-stone-400" />
                            ~{gap.estimatedHoursToClose} Hours to Close
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize text-amber-800 dark:text-amber-300 font-medium">
                            {gap.severity} Priority
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectGapForUpskill(gap)}
                        className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                      >
                        <span>Build 4-Hr Project</span>
                        <ArrowRight className="w-3 h-3 text-amber-300 dark:text-amber-600" />
                      </button>
                    </div>

                    <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed bg-white/70 dark:bg-stone-900/80 p-2.5 rounded-lg border border-amber-100 dark:border-amber-900/40">
                      <span className="font-medium text-stone-900 dark:text-stone-100">Why hiring manager cares: </span>
                      {gap.whyHiringManagerCares}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Implicit Gaps & Bonus Differentiators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Implicit Nuance Gaps */}
            <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                  Implicit Nuance Gaps (The Unwritten Traits)
                </h3>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Intangibles that separate senior individual contributors from candidates who stall in committee:
              </p>

              <div className="space-y-3 pt-1">
                {gapAnalysis.implicitGaps.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800 space-y-1.5">
                    <div className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                      {item.trait}
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-300">
                      {item.nuance}
                    </div>
                    <div className="text-[11px] text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 p-2 rounded-lg font-medium">
                      Advice: {item.strategicAdvice}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bonus Gaps / Top 5% Differentiators */}
            <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                  Bonus Differentiators (Top 5% League)
                </h3>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Non-mandatory skills that justify top-bracket compensation and leadership standing:
              </p>

              <div className="space-y-3 pt-1">
                {gapAnalysis.bonusGaps.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800 space-y-1">
                    <div className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                      {item.skill}
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-300">
                      {item.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
