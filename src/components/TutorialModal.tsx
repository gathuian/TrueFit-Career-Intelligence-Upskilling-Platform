import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Target,
  Zap,
  Mic,
  Compass,
  Briefcase,
  BookOpen,
  X
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDecipher: () => void;
}

const STEPS = [
  {
    stepNumber: '01',
    title: 'Decode the Job & Uncover the Truth',
    subtitle: 'Move beyond HR buzzwords to what actually drives the hire',
    icon: Sparkles,
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400',
    description:
      'Job postings are usually full of generic corporate boilerplate. TrueFit uses intelligent semantic analysis to decode what the hiring manager actually cares about, discovers unwritten seniority rules, benchmarks the real salary, and audits for potentially biased language (EEOC / DEI checks).',
    takeaway: 'Plain-English insight: You will know what problem the team is actually hiring someone to fix.'
  },
  {
    stepNumber: '02',
    title: 'The Skill Bridge: Pinpoint Real Gaps',
    subtitle: 'Know exactly where you stand without guessing',
    icon: Target,
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400',
    description:
      'TrueFit compares your candidate background against the decoded job. You get a clear match percentage, pitch advice for the skills you already have, and a prioritized list of the 2-3 critical gaps that could block an interview.',
    takeaway: 'Plain-English insight: No vague "you need more experience". You see exactly which technical topics matter.'
  },
  {
    stepNumber: '03',
    title: 'The Accelerator: 4-Hour Micro-Projects',
    subtitle: 'Prove missing skills in 4 hours instead of 40-hour video courses',
    icon: Zap,
    color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400',
    description:
      'Hiring managers rarely care about course certificates. Instead, TrueFit generates a focused 4-hour portfolio project designed in that specific company’s domain, complete with an Architecture Decision Record (ADR) and exact interview scripts.',
    takeaway: 'Plain-English insight: In one afternoon, you build real code to link on your resume or in follow-up emails.'
  },
  {
    stepNumber: '04',
    title: 'Mock Interview Simulator',
    subtitle: 'Practice with an AI interviewer tuned to the job’s implicit needs',
    icon: Mic,
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400',
    description:
      'Test your answers using voice dictation or typing. TrueFit listens to your response and gives you instant feedback on what the hiring manager subconsciously heard, what worked, and how to frame trade-offs like a senior leader.',
    takeaway: 'Plain-English insight: Safe practice where you can fail and refine your story before the real call.'
  },
  {
    stepNumber: '05',
    title: 'Side-Quest Playground: Compare Other Skills & Roles',
    subtitle: 'Experiment with pivots without disturbing your primary pipeline',
    icon: Compass,
    color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-400',
    description:
      'Have side skills like technical writing, UI design, indie hacking, or community management? Use the Playground to compare alternate hats against different jobs without polluting your primary job applications.',
    takeaway: 'Plain-English insight: Explore "What if I pivoted?" in a completely separate sandbox.'
  },
  {
    stepNumber: '06',
    title: 'Career CRM & Strategic Outreach',
    subtitle: 'Track your pipeline, write non-cringe emails, and analyze rejections',
    icon: Briefcase,
    color: 'text-stone-700 bg-stone-100 dark:bg-stone-800 dark:text-stone-300',
    description:
      'Track your roles in a Kanban board. Generate tone-calibrated follow-up drafts and network outreach templates. If you get rejected, run a "Rejection Autopsy" to diagnose the hidden signals and adjust your roadmap.',
    takeaway: 'Plain-English insight: Turn rejection into a clear tactical adjustment for your next opportunity.'
  }
];

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onStartDecipher,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const step = STEPS[currentStepIndex];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
      onStartDecipher();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1C1A18] rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Interactive Guide
            </span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
              Step {currentStepIndex + 1} of {STEPS.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
            title="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Dots */}
        <div className="flex items-center gap-2">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStepIndex(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === currentStepIndex
                  ? 'w-8 bg-stone-900 dark:bg-stone-100'
                  : 'w-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-400'
              }`}
              title={`Go to Step ${i + 1}`}
            />
          ))}
        </div>

        {/* Current Step Body */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${step.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-stone-400 dark:text-stone-500 font-semibold">
                STEP {step.stepNumber}
              </div>
              <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100 font-normal">
                {step.title}
              </h2>
            </div>
          </div>

          <p className="text-xs font-medium text-stone-500 dark:text-stone-400 italic">
            {step.subtitle}
          </p>

          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-900/60 p-4 rounded-xl border border-stone-100 dark:border-stone-800/80">
            {step.description}
          </p>

          <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
            <strong>Key Benefit: </strong>
            {step.takeaway}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800/80">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-30 disabled:hover:text-stone-600 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-xs text-stone-500 dark:text-stone-400 hover:underline"
            >
              Skip tour
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>{currentStepIndex === STEPS.length - 1 ? 'Start Using TrueFit' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300 dark:text-amber-600" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
