import React, { useState } from 'react';
import { Users, Copy, Check, ExternalLink } from 'lucide-react';
import { ApplicationCard, UserProfile } from '../types';

interface NetworkNudgeModalProps {
  application: ApplicationCard | null;
  onClose: () => void;
  userProfile: UserProfile;
}

export const NetworkNudgeModal: React.FC<NetworkNudgeModalProps> = ({
  application,
  onClose,
  userProfile,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!application) return null;

  const company = application.company;
  const roleTitle = application.roleTitle;

  const archetypes = [
    {
      title: 'Direct Hiring Manager Archetype',
      targetSearch: `site:linkedin.com/in "${company}" ("Engineering Manager" OR "Head of Engineering")`,
      why: 'Holds the headcount budget and feels the pain of the open role daily.',
      template: `Hi [Name], I noticed your team at ${company} is expanding the ${roleTitle} group. I’ve been researching how your platform handles high concurrency and recently built a focused 4-hour micro-service addressing that exact bottleneck. Would love to share the architecture writeup with you if you have 5 mins, purely for feedback. No pressure at all—appreciate what you're building!`,
    },
    {
      title: 'Future Peer / Senior IC Archetype',
      targetSearch: `site:linkedin.com/in "${company}" ("Senior Engineer" OR "Staff Engineer")`,
      why: 'Will be in your loop; peers love meeting builders who don’t ask for favors but share high-craft prototypes.',
      template: `Hi [Name], loved following your team’s recent technical changes at ${company}. I’m currently diving deep into ${application.targetSkillGap || 'distributed telemetry and resilience'} and wanted to ask: what’s the biggest unexpected architectural surprise you ran into when scaling that system? Always eager to learn from engineers in the trenches.`,
    },
    {
      title: 'Technical Talent Partner / Recruiter',
      targetSearch: `site:linkedin.com/in "${company}" ("Technical Recruiter" OR "Talent Partner")`,
      why: 'Wants qualified candidates who won’t fail technical screens.',
      template: `Hi [Name], I recently applied for the ${roleTitle} role at ${company} (Application ID / email: ${userProfile.name}). I know your inbox gets flooded, so to make evaluation straightforward, I prepared a 1-page architecture breakdown and public repo demonstrating the core system requirements: [Link]. Excited about the roadmap!`,
    },
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1C1A18] rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
              <span>Targeted Strategic Networking</span>
            </div>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mt-1">
              Network Nudge: {company}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          Cold messages that say &ldquo;I&apos;d love to pick your brain&rdquo; get ignored. TrueFit crafts non-cringe outreach templates that offer immediate value and reference your completed 4-hour upskilling projects.
        </p>

        <div className="space-y-4">
          {archetypes.map((arch, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <span className="font-semibold text-xs text-stone-900 dark:text-stone-100 block">
                    {arch.title}
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Why target: {arch.why}
                  </span>
                </div>

                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(arch.targetSearch)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-100 font-medium underline"
                >
                  <span>Search on LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="bg-white dark:bg-stone-800/80 p-3 rounded-lg border border-stone-200/70 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
                &ldquo;{arch.template}&rdquo;
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleCopy(arch.template, idx)}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3 text-stone-500 dark:text-stone-400" />}
                  <span>{copiedIdx === idx ? 'Copied' : 'Copy Template'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
