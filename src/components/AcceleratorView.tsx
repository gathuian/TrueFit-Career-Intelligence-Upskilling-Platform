import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  ExternalLink,
  Code2,
  BookOpen,
  Award,
  ShieldCheck,
  Send,
  ArrowRight,
  FolderGit2,
  FileCheck,
  Zap,
  Bookmark
} from 'lucide-react';
import { DecodedJob, GapAnalysis, UpskillingPlan, VerifiedBadge, CriticalGap } from '../types';

interface AcceleratorViewProps {
  decodedJob: DecodedJob | null;
  gapAnalysis: GapAnalysis | null;
  upskillingPlan: UpskillingPlan | null;
  selectedGap: CriticalGap | null;
  isLoading: boolean;
  onGeneratePlan: (skill?: string) => Promise<void>;
  onVerifyBadge: (skill: string, projectTitle: string, proofUrl: string, notes: string) => void;
  verifiedBadges: VerifiedBadge[];
  onNavigateToBridge: () => void;
  onNavigateToInterview: () => void;
}

export const AcceleratorView: React.FC<AcceleratorViewProps> = ({
  decodedJob,
  gapAnalysis,
  upskillingPlan,
  selectedGap,
  isLoading,
  onGeneratePlan,
  onVerifyBadge,
  verifiedBadges,
  onNavigateToBridge,
  onNavigateToInterview,
}) => {
  const [proofUrl, setProofUrl] = useState('');
  const [proofNotes, setProofNotes] = useState('');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [copiedTip, setCopiedTip] = useState(false);

  const targetSkill = selectedGap?.skill || gapAnalysis?.criticalGaps?.[0]?.skill || 'Production System Observability & Resilient Architecture';
  const company = decodedJob?.company || 'Target Company';

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upskillingPlan || !proofUrl.trim()) return;
    onVerifyBadge(
      upskillingPlan.microProject.targetSkill,
      upskillingPlan.microProject.title,
      proofUrl,
      proofNotes
    );
    setProofUrl('');
    setProofNotes('');
    setShowVerifyModal(false);
  };

  const isCurrentSkillVerified = verifiedBadges.some(
    (b) => b.skill.toLowerCase() === targetSkill.toLowerCase()
  );

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
              <span>The Accelerator</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-800 dark:text-amber-400 font-semibold">{company} Specific</span>
              <span aria-hidden="true">·</span>
              <span>4-Hour Portfolio Capstone</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 tracking-tight">
              Hyper-Personalized Upskilling &amp; 4-Hour Micro-Project
            </h1>

            <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
              Instead of generic 40-hour video courses that rarely impress hiring managers, TrueFit crafts an actionable 4-hour portfolio project designed to prove your competency in the exact domain of {company}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onGeneratePlan(targetSkill)}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 disabled:bg-stone-300 dark:disabled:bg-stone-800 text-white text-xs font-medium transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white dark:border-stone-400 dark:border-t-stone-950 rounded-full animate-spin" />
                  <span>Synthesizing 4-Hr Project...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-amber-600" />
                  <span>{upskillingPlan ? 'Regenerate 4-Hour Project' : 'Generate 4-Hour Project'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected target skill display */}
        <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-500 dark:text-stone-400 font-medium">Closing Skill Gap:</span>
            <span className="font-semibold text-stone-900 dark:text-stone-100 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-300">
              {targetSkill}
            </span>
          </div>

          {gapAnalysis && gapAnalysis.criticalGaps.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-stone-400 dark:text-stone-500">Switch gap:</span>
              <div className="flex flex-wrap gap-1">
                {gapAnalysis.criticalGaps.map((gap, i) => (
                  <button
                    key={i}
                    onClick={() => onGeneratePlan(gap.skill)}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                      targetSkill === gap.skill
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {gap.skill.slice(0, 22)}...
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Micro-Project & Roadmap presentation */}
      {upskillingPlan && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* 4-Hour Micro-Project Master Card */}
          <div className="bg-white dark:bg-[#1C1A18] border-2 border-stone-900 dark:border-stone-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  <Code2 className="w-4 h-4" />
                  <span>The 4-Hour Capstone Project</span>
                </div>
                <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mt-1">
                  {upskillingPlan.microProject.title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                  {upskillingPlan.microProject.tagline}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 tabular-nums">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  Estimated: 240 mins (4h)
                </span>

                {isCurrentSkillVerified ? (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Verified Ready
                  </span>
                ) : (
                  <button
                    onClick={() => setShowVerifyModal(true)}
                    className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Submit Proof &amp; Verify</span>
                  </button>
                )}
              </div>
            </div>

            {/* Scenario & Tech Stack */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <h3 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  The Real-World Company Challenge
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-900/60 p-4 rounded-xl border border-stone-100 dark:border-stone-800">
                  {upskillingPlan.microProject.scenario}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Recommended Stack
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {upskillingPlan.microProject.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 4-Hour Timeboxed Schedule */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Timeboxed Execution Blueprint (4 Hours)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {upskillingPlan.microProject.schedule.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="font-mono text-xs text-amber-800 dark:text-amber-400 font-semibold mb-1">
                        {step.timebox}
                      </div>
                      <div className="font-semibold text-stone-900 dark:text-stone-100 text-xs sm:text-sm leading-snug">
                        {step.stage}
                      </div>
                      <ul className="mt-2.5 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                        {step.tasks.map((task, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-1.5">
                            <span className="text-stone-400">·</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400">
                      <span className="font-medium text-stone-700 dark:text-stone-300">Milestone: </span>
                      {step.milestoneOutput}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Criteria & Interview Pitching Tip */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800 space-y-2">
                <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Deliverables &amp; Proof of Completion
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                  {upskillingPlan.microProject.deliverables.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    How to Drop This in Your Interview
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(upskillingPlan.microProject.interviewShowcaseTip);
                      setCopiedTip(true);
                      setTimeout(() => setCopiedTip(false), 2000);
                    }}
                    className="text-[11px] text-amber-800 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    {copiedTip ? 'Copied!' : 'Copy Script'}
                  </button>
                </div>
                <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed italic bg-white/70 dark:bg-stone-900/80 p-3 rounded-lg border border-amber-200/50 dark:border-amber-900/40">
                  &ldquo;{upskillingPlan.microProject.interviewShowcaseTip}&rdquo;
                </p>
              </div>
            </div>

            {/* Test in Simulator CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100 dark:border-stone-800">
              <div className="text-xs text-stone-500 dark:text-stone-400">
                Ready to practice pitching this project and defending your technical trade-offs?
              </div>
              <button
                onClick={onNavigateToInterview}
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Practice in Mock Interview Simulator</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300 dark:text-amber-600" />
              </button>
            </div>
          </div>

          {/* Curated Deep-Dive Roadmap */}
          <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                <BookOpen className="w-4 h-4" />
                <span>Curated Learning Pathway</span>
              </div>
              <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100 mt-1">
                Mental Models &amp; High-Leverage References
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upskillingPlan.roadmap.map((phase, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{phase.phase}</span>
                    <span className="text-stone-400 dark:text-stone-500 font-mono">{phase.timeEstimate}</span>
                  </div>

                  <div className="text-xs font-medium text-amber-800 dark:text-amber-400">
                    {phase.focusArea}
                  </div>

                  <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                    {phase.actionableSteps.map((step, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-1.5">
                        <span className="text-stone-400">·</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800 space-y-1.5">
                    <div className="text-[10px] font-semibold uppercase text-stone-400 dark:text-stone-500">
                      Recommended References
                    </div>
                    {phase.recommendedResources.map((res, rIdx) => (
                      <div key={rIdx} className="text-xs text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 p-2 rounded border border-stone-200/60 dark:border-stone-700">
                        <div className="font-medium text-stone-900 dark:text-stone-100">{res.title}</div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{res.urlOrDescription}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Badges Showcase */}
          {verifiedBadges.length > 0 && (
            <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                    Your Verified Ready Portfolio Badges ({verifiedBadges.length})
                  </h3>
                </div>
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  Ready to link in applications
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {verifiedBadges.map((badge) => (
                  <div key={badge.id} className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">{badge.skill}</span>
                      <span className="text-[10px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                        Verified {new Date(badge.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-stone-700 dark:text-stone-300 font-medium">{badge.projectTitle}</div>
                    <a
                      href={badge.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 underline"
                    >
                      <FolderGit2 className="w-3.5 h-3.5" />
                      <span>{badge.proofUrl}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Verify Proof Modal */}
      {showVerifyModal && upskillingPlan && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C1A18] rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">
                Verify Your 4-Hour Project
              </h3>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              TrueFit records your verified artifact so you can showcase proof to employers, recruiters, and peers.
            </p>

            <form onSubmit={handleVerifySubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Public GitHub Repo or Live Demo URL *
                </label>
                <input
                  type="url"
                  required
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://github.com/username/project-repo"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Key Learnings &amp; Trade-Offs (1-2 sentences)
                </label>
                <textarea
                  rows={3}
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  placeholder="e.g. Tested timeout circuit breaker under 100 concurrent requests; handled downstream latency spikes gracefully."
                  className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="px-4 py-2 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Confirm &amp; Unlock Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
