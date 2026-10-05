import React, { useState, useEffect } from 'react';
import {
  Compass,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Zap,
  Bookmark,
  Layers,
  HelpCircle
} from 'lucide-react';
import { PlaygroundRole, PlaygroundComparison } from '../types';

export const PlaygroundView: React.FC = () => {
  // Roles the user does / side hats
  const [roles, setRoles] = useState<PlaygroundRole[]>(() => {
    const saved = localStorage.getItem('truefit_playground_roles');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'r1',
        title: 'Freelance Technical Writer',
        description: 'Writing developer documentation, tutorials, and architecture case studies for SaaS startups.',
        skills: ['Technical Documentation', 'Markdown / Docusaurus', 'API Reference Guides', 'Developer Education']
      },
      {
        id: 'r2',
        title: 'Indie Hacker & UI Prototyper',
        description: 'Building micro-SaaS tools from scratch with interactive prototypes and rapid user feedback.',
        skills: ['Figma Prototyping', 'Product Analytics', 'User Research', 'Landing Page Copywriting']
      }
    ];
  });

  // Additional side skills
  const [sideSkills, setSideSkills] = useState<string[]>(() => {
    const saved = localStorage.getItem('truefit_playground_skills');
    if (saved) return JSON.parse(saved);
    return ['Technical Copywriting', 'Figma Design Systems', 'Python Scripting', 'SEO & Content Marketing', 'Community Discord Moderation'];
  });

  // New role form inputs
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleSkills, setNewRoleSkills] = useState('');
  const [showAddRole, setShowAddRole] = useState(false);

  // New side skill input
  const [newSideSkillInput, setNewSideSkillInput] = useState('');

  // Target Job for Comparison
  const [targetJobTitle, setTargetJobTitle] = useState('Staff Developer Advocate');
  const [targetCompany, setTargetCompany] = useState('Developer Platform');
  const [targetJobText, setTargetJobText] = useState(
    `We are looking for a Staff Developer Advocate to write in-depth technical documentation, build open-source full-stack example repos, and speak with engineering communities about scalable cloud primitives. Must have strong written communication and ability to explain complex distributed systems simply.`
  );

  // Comparison result
  const [activeComparison, setActiveComparison] = useState<PlaygroundComparison | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Saved comparisons
  const [savedComparisons, setSavedComparisons] = useState<PlaygroundComparison[]>(() => {
    const saved = localStorage.getItem('truefit_playground_comparisons');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('truefit_playground_roles', JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem('truefit_playground_skills', JSON.stringify(sideSkills));
  }, [sideSkills]);

  useEffect(() => {
    localStorage.setItem('truefit_playground_comparisons', JSON.stringify(savedComparisons));
  }, [savedComparisons]);

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) return;
    const splitSkills = newRoleSkills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newRole: PlaygroundRole = {
      id: `role-${Date.now()}`,
      title: newRoleTitle.trim(),
      description: newRoleDesc.trim() || 'Custom alternate role / side project focus.',
      skills: splitSkills.length > 0 ? splitSkills : ['Project Leadership', 'Domain Strategy']
    };

    setRoles([...roles, newRole]);
    setNewRoleTitle('');
    setNewRoleDesc('');
    setNewRoleSkills('');
    setShowAddRole(false);
  };

  const handleDeleteRole = (id: string) => {
    setRoles(roles.filter((r) => r.id !== id));
  };

  const handleAddSideSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSideSkillInput.trim()) return;
    if (!sideSkills.includes(newSideSkillInput.trim())) {
      setSideSkills([...sideSkills, newSideSkillInput.trim()]);
    }
    setNewSideSkillInput('');
  };

  const handleRemoveSideSkill = (skill: string) => {
    setSideSkills(sideSkills.filter((s) => s !== skill));
  };

  const handleRunComparison = () => {
    if (!targetJobText.trim()) return;
    setIsComparing(true);

    setTimeout(() => {
      // Collect all playground skills
      const allPlaygroundSkills = Array.from(
        new Set([...sideSkills, ...roles.flatMap((r) => r.skills)])
      );

      // Check overlaps with job text
      const lowerJob = targetJobText.toLowerCase();
      const matched = allPlaygroundSkills.filter((s) =>
        lowerJob.includes(s.toLowerCase()) ||
        s.toLowerCase().split(' ').some((part) => part.length > 3 && lowerJob.includes(part))
      );

      const score = Math.min(94, Math.max(58, 65 + matched.length * 7));

      const comparison: PlaygroundComparison = {
        id: `comp-${Date.now()}`,
        targetJobTitle,
        targetCompany,
        jobText: targetJobText,
        matchScore: score,
        transferableStrengths:
          matched.length > 0
            ? matched
            : ['Technical Documentation & Content Synthesis', 'Rapid UI Prototyping', 'Cross-Domain Communication'],
        bridgingGaps: [
          'High-throughput conference keynote speaking or recorded public portfolio',
          'Production-level benchmark comparisons for marketing assets'
        ],
        strategicPivotAdvice: `When applying for ${targetJobTitle} with your background as a ${roles[0]?.title || 'Multi-disciplinary Builder'}, frame your transition as a massive superpower: you don't just write fluff—you have real production architectural instincts combined with proven communication depth.`,
        createdAt: new Date().toISOString()
      };

      setActiveComparison(comparison);
      setSavedComparisons((prev) => [comparison, ...prev]);
      setIsComparing(false);
    }, 400);
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
            <span>Playground Sandbox</span>
            <span aria-hidden="true">·</span>
            <span className="text-teal-700 dark:text-teal-400 font-semibold">Separate From Main Career Pipeline</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 tracking-tight">
            Side Skills &amp; Alternate Role Playground
          </h1>

          <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
            Most builders have skills that don’t fit neatly onto a single corporate resume—like freelance writing, community leadership, UI prototyping, or side projects. Use this sandbox to document other roles and compare against different jobs without changing your main career profile.
          </p>
        </div>
      </div>

      {/* 2-Column: Left (Your Roles & Skills), Right (Compare with Target Job) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Alternate Roles & Side Skills Vault */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Roles You Do / Side Hats */}
          <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                  Alternate Roles &amp; Side Hats ({roles.length})
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Projects, freelance roles, or hobbies you excel at
                </p>
              </div>

              <button
                onClick={() => setShowAddRole(!showAddRole)}
                className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddRole ? 'Cancel' : 'Add Role'}</span>
              </button>
            </div>

            {/* Add Role Form */}
            {showAddRole && (
              <form onSubmit={handleAddRole} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3 animate-fadeIn">
                <div>
                  <label className="block text-[11px] font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Role Title (e.g. Technical Copywriter, Community Organizer)
                  </label>
                  <input
                    type="text"
                    required
                    value={newRoleTitle}
                    onChange={(e) => setNewRoleTitle(e.target.value)}
                    placeholder="Role title..."
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Brief Description
                  </label>
                  <input
                    type="text"
                    value={newRoleDesc}
                    onChange={(e) => setNewRoleDesc(e.target.value)}
                    placeholder="What you do in this hat..."
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newRoleSkills}
                    onChange={(e) => setNewRoleSkills(e.target.value)}
                    placeholder="e.g. Editing, SEO, User Interviews"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 text-xs font-medium hover:opacity-90"
                  >
                    Save Alternate Role
                  </button>
                </div>
              </form>
            )}

            {/* Roles List */}
            <div className="space-y-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 space-y-2 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                        {role.title}
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        {role.description}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove role"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {role.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Skills Vault */}
          <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h2 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                Other Transferable Skills ({sideSkills.length})
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Secondary capabilities outside your day-to-day title
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 min-h-[50px]">
              {sideSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 shadow-2xs"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSideSkill(skill)}
                    className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs ml-0.5 cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddSideSkill} className="flex gap-2">
              <input
                type="text"
                value={newSideSkillInput}
                onChange={(e) => setNewSideSkillInput(e.target.value)}
                placeholder="Add skill (e.g. Prompt Engineering, Video Editing)..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 text-xs font-medium"
              >
                + Add
              </button>
            </form>
          </div>

        </div>

        {/* Right: Compare against an Alternative Job */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                <Compass className="w-4 h-4" />
                <span>Pivot &amp; Cross-Discipline Comparison</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 dark:text-stone-100 mt-1">
                Compare Your Side Skills with a Target Job
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                Paste any job description you are curious about to see how your non-traditional skills map over.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Target Role Title
                </label>
                <input
                  type="text"
                  value={targetJobTitle}
                  onChange={(e) => setTargetJobTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Job Description Text
              </label>
              <textarea
                rows={4}
                value={targetJobText}
                onChange={(e) => setTargetJobText(e.target.value)}
                placeholder="Paste alternative role description here..."
                className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 font-sans leading-relaxed"
              />
            </div>

            <button
              onClick={handleRunComparison}
              disabled={isComparing || !targetJobText.trim()}
              className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              {isComparing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Mapping Transferable Skills...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Analyze Transferable Match</span>
                </>
              )}
            </button>
          </div>

          {/* Comparison Result */}
          {activeComparison && (
            <div className="bg-white dark:bg-[#1C1A18] border-2 border-teal-800/40 dark:border-teal-500/40 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-400">
                    Pivot Alignment Result
                  </span>
                  <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100 mt-0.5">
                    {activeComparison.targetJobTitle} at {activeComparison.targetCompany}
                  </h3>
                </div>

                <div className="flex items-baseline gap-1 font-mono text-2xl font-bold text-teal-800 dark:text-teal-400 tabular-nums">
                  <span>{activeComparison.matchScore}%</span>
                  <span className="text-xs font-normal text-stone-400">match</span>
                </div>
              </div>

              {/* Transferable Strengths */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Your Transferable Superpowers in this Role:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeComparison.transferableStrengths.map((str, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-950 dark:text-emerald-200"
                    >
                      ✓ {str}
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Pivot Advice */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 space-y-1.5">
                <div className="text-xs font-semibold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Strategic Positioning Advice for this Pivot:</span>
                </div>
                <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  {activeComparison.strategicPivotAdvice}
                </p>
              </div>

              {/* Bridging Gaps */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Key gap to bridge before applying:
                </div>
                <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-400">
                  {activeComparison.bridgingGaps.map((gap, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-stone-400">·</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
