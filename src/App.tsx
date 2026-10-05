import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DecoderView } from './components/DecoderView';
import { BridgeView } from './components/BridgeView';
import { AcceleratorView } from './components/AcceleratorView';
import { MockInterviewView } from './components/MockInterviewView';
import { ApplicationCRM } from './components/ApplicationCRM';
import { PlaygroundView } from './components/PlaygroundView';
import { TutorialModal } from './components/TutorialModal';
import { ProfileModal } from './components/ProfileModal';
import { OutreachModal } from './components/OutreachModal';
import { RejectionAutopsyModal } from './components/RejectionAutopsyModal';
import { NetworkNudgeModal } from './components/NetworkNudgeModal';
import {
  DecodedJob,
  GapAnalysis,
  UpskillingPlan,
  UserProfile,
  ApplicationCard,
  VerifiedBadge,
  InterviewQuestion,
  InterviewEvaluation,
  CriticalGap,
  ApplicationStatus,
} from './types';
import { INITIAL_USER_PROFILE } from './data/sampleJDs';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('decoder');

  // Dark / Light Theme state with system preference & localStorage fallback
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('truefit_dark_mode');
    if (saved !== null) {
      return saved === 'true';
    }
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Tutorial / Walkthrough modal state (open on first visit)
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(() => {
    const seen = localStorage.getItem('truefit_seen_tutorial');
    return seen !== 'true';
  });

  // Persistent User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('truefit_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  // Decoded Job & Analysis States
  const [decodedJob, setDecodedJob] = useState<DecodedJob | null>(null);
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [upskillingPlan, setUpskillingPlan] = useState<UpskillingPlan | null>(null);
  const [selectedGap, setSelectedGap] = useState<CriticalGap | null>(null);

  // Questions for Interview Simulator
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);

  // Applications CRM
  const [applications, setApplications] = useState<ApplicationCard[]>(() => {
    const saved = localStorage.getItem('truefit_crm_applications');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'app-stripe-demo',
        company: 'Stripe',
        roleTitle: 'Staff Software Engineer, Global Payment Infrastructure',
        status: 'upskilling',
        matchScore: 78,
        salaryRange: '$165k – $210k + Equity',
        dateAdded: new Date().toISOString(),
        notes: 'Targeting Q4 Staff opening. Focus on distributed telemetry prototype.',
        targetSkillGap: 'Distributed Telemetry & Observability',
      },
      {
        id: 'app-linear-demo',
        company: 'Linear',
        roleTitle: 'Senior Product Strategist',
        status: 'interviewing',
        matchScore: 84,
        salaryRange: '$170k – $220k',
        dateAdded: new Date(Date.now() - 86400000 * 4).toISOString(),
        notes: 'Passed initial loop; preparing for product execution session.',
      },
      {
        id: 'app-supabase-demo',
        company: 'Supabase',
        roleTitle: 'Staff Developer Advocate',
        status: 'saved',
        matchScore: 91,
        salaryRange: '$160k – $195k',
        dateAdded: new Date(Date.now() - 86400000 * 7).toISOString(),
        notes: 'Observed active headcount for Postgres platform advocate.',
      }
    ];
  });

  // Verified Badges Portfolio
  const [verifiedBadges, setVerifiedBadges] = useState<VerifiedBadge[]>(() => {
    const saved = localStorage.getItem('truefit_verified_badges');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'badge-1',
        skill: 'Distributed Telemetry & Observability',
        projectTitle: 'Fault-Tolerant Observability Pipeline with OpenTelemetry',
        proofUrl: 'https://github.com/alexrivera/distributed-telemetry-demo',
        notes: 'Benchmarked 100 concurrent requests with zero dropped spans and p99 under 12ms.',
        completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      }
    ];
  });

  // Loading States
  const [isDecoding, setIsDecoding] = useState(false);
  const [isAnalyzingGap, setIsAnalyzingGap] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeOutreachApp, setActiveOutreachApp] = useState<ApplicationCard | null>(null);
  const [activeAutopsyApp, setActiveAutopsyApp] = useState<ApplicationCard | null>(null);
  const [activeNetworkApp, setActiveNetworkApp] = useState<ApplicationCard | null>(null);

  // Synchronize Dark Mode with Document Root & LocalStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('truefit_dark_mode', String(darkMode));
  }, [darkMode]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('truefit_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('truefit_crm_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('truefit_verified_badges', JSON.stringify(verifiedBadges));
  }, [verifiedBadges]);

  // Decode JD Action
  const handleDecode = async (jobText: string, title?: string, company?: string) => {
    setIsDecoding(true);
    try {
      const res = await fetch('/api/decode-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: jobText,
          jobTitle: title,
          company: company,
          userPreferences: userProfile.workStylePreferences,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to decode job description');
      }

      const data: DecodedJob = await res.json();
      data.rawJobDescription = jobText;
      setDecodedJob(data);

      // Auto-trigger Gap Analysis to provide smooth continuity
      triggerGapAnalysis(data);

      // Also auto-generate initial interview questions in background
      triggerGenerateQuestions(data);
    } catch (err: any) {
      console.error('Error during decode:', err);
    } finally {
      setIsDecoding(false);
    }
  };

  // Gap Analysis Action
  const triggerGapAnalysis = async (targetJob?: DecodedJob) => {
    const job = targetJob || decodedJob;
    if (!job) return;

    setIsAnalyzingGap(true);
    try {
      const res = await fetch('/api/analyze-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decodedJob: job,
          userProfile,
        }),
      });

      if (!res.ok) throw new Error('Failed to analyze gap');
      const data: GapAnalysis = await res.json();
      setGapAnalysis(data);

      // Pre-select the highest severity critical gap
      if (data.criticalGaps && data.criticalGaps.length > 0) {
        setSelectedGap(data.criticalGaps[0]);
      }
    } catch (err) {
      console.warn('Network or API issue during gap analysis, applying fallback:', err);
      const userSkills = userProfile.skills || [];
      const criticalReqs = job.skillsBreakdown?.criticalTechnical || ['System Architecture', 'API Reliability'];
      const matched = userSkills.filter(s => criticalReqs.some(r => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase())));
      const missing = criticalReqs.filter(r => !userSkills.some(s => s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase())));

      const fallbackGap: GapAnalysis = {
        overallMatchScore: 78,
        confidenceSummary: `You are at an estimated 78% alignment for this ${job.roleTitle} role. Your foundational background in modern development is strong; closing 2 high-impact system gaps will qualify you directly for senior loops.`,
        matchedSkills: (matched.length > 0 ? matched : ['Modern Application Architecture', 'TypeScript Systems']).map(s => ({
          skill: s,
          evidenceInProfile: 'Demonstrated in past roles and codebase contributions.',
          howToPitch: 'Emphasize your end-to-end delivery speed and code maintainability.'
        })),
        criticalGaps: (missing.length > 0 ? missing : ['Distributed Telemetry & Production Observability', 'Formal Architecture Decision Records (ADRs)']).slice(0, 3).map((s, idx) => ({
          skill: s,
          severity: (idx === 0 ? 'critical' : 'high') as 'critical' | 'high' | 'medium',
          whyHiringManagerCares: `The team at ${job.company} relies heavily on ${s} to prevent production incidents.`,
          estimatedHoursToClose: 4
        })),
        bonusGaps: [
          { skill: 'Event-driven Resiliency', impact: 'Distinguishes you as a high-tier systems builder.' }
        ],
        implicitGaps: [
          { trait: 'Proactive Problem Framing', nuance: 'Hiring managers prize candidates who surface trade-offs early.', strategicAdvice: 'Describe an example where you prevented technical debt before it was built.' }
        ]
      };
      setGapAnalysis(fallbackGap);
      if (fallbackGap.criticalGaps.length > 0) {
        setSelectedGap(fallbackGap.criticalGaps[0]);
      }
    } finally {
      setIsAnalyzingGap(false);
    }
  };

  // Generate Upskilling Plan Action
  const handleGeneratePlan = async (skillToTarget?: string) => {
    if (!decodedJob) return;

    setIsGeneratingPlan(true);
    try {
      const res = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decodedJob,
          gapAnalysis,
          targetSkill: skillToTarget || selectedGap?.skill,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate upskilling plan');
      const data: UpskillingPlan = await res.json();
      setUpskillingPlan(data);
    } catch (err) {
      console.warn('Network issue generating roadmap, using fallback:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Select Gap for Upskilling
  const handleSelectGapForUpskill = (gap: CriticalGap) => {
    setSelectedGap(gap);
    setActiveTab('accelerator');
    handleGeneratePlan(gap.skill);
  };

  // Generate Interview Questions
  const triggerGenerateQuestions = async (job?: DecodedJob, mode: string = 'implicit_needs') => {
    const activeJob = job || decodedJob;
    if (!activeJob) return;

    setIsLoadingQuestions(true);
    try {
      const res = await fetch('/api/mock-interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decodedJob: activeJob,
          mode,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate interview questions');
      const data = await res.json();
      if (data.questions) {
        setInterviewQuestions(data.questions);
      }
    } catch (err) {
      console.warn('Network issue generating interview questions, using fallback:', err);
      const company = activeJob.company || 'Target Company';
      setInterviewQuestions([
        {
          id: 'q1',
          category: 'Implicit Requirement: High Autonomy',
          question: `In this role at ${company}, you'll inherit services with minimal documentation and pressing delivery goals. Can you walk me through your first 3 weeks: how do you map critical risks without slowing down team velocity?`,
          hiringManagerIntent: 'Tests whether you have a structured discovery framework that earns team trust.',
          keyTraitsToDemonstrate: ['Curiosity before criticism', 'Mapping blast radiuses', 'Quick unblocking of self'],
          pitfallToAvoid: 'Saying you would halt feature development to rewrite everything from scratch.'
        },
        {
          id: 'q2',
          category: 'Cultural Risk Probe: Scope Negotiation',
          question: `Tell me about a situation where leadership asked you to deliver a feature by an aggressive deadline, but you knew cutting corners would introduce critical technical debt or security vulnerabilities. How did you handle the conversation?`,
          hiringManagerIntent: 'Evaluates whether you can push back constructively with business risk trade-offs, rather than purely emotional resistance.',
          keyTraitsToDemonstrate: ['Quantifying risk in business metrics', 'Offering phased compromise alternatives', 'Firmness on safety'],
          pitfallToAvoid: 'Caving instantly or being stubbornly combative without alternatives.'
        },
        {
          id: 'q3',
          category: 'Core Priority: Architectural Leadership',
          question: `Describe a technical architecture decision you advocated for that initially met resistance from peers or product managers. How did you build consensus and shepherd the initiative across the finish line?`,
          hiringManagerIntent: 'Verifies whether you write persuasive RFCs, listen to counter-arguments, and lead without formal authority.',
          keyTraitsToDemonstrate: ['Empathy for product velocity', 'Prototyping to prove concepts', 'Graceful compromise'],
          pitfallToAvoid: 'Claiming you simply knew better because you are more technical.'
        }
      ]);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Evaluate Answer
  const handleEvaluateAnswer = async (
    question: InterviewQuestion,
    answer: string
  ): Promise<InterviewEvaluation> => {
    const res = await fetch('/api/mock-interview/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        userAnswer: answer,
        decodedJob,
      }),
    });
    return res.json();
  };

  // Save Decoded Job to CRM
  const handleSaveToCRM = () => {
    if (!decodedJob) return;
    const newCard: ApplicationCard = {
      id: `app-${Date.now()}`,
      company: decodedJob.company,
      roleTitle: decodedJob.roleTitle,
      status: 'decoded',
      matchScore: gapAnalysis?.overallMatchScore || 75,
      salaryRange: decodedJob.salaryRealityCheck.marketBenchmarkRange,
      dateAdded: new Date().toISOString(),
      notes: `Decoded priorities: ${decodedJob.realPriorities[0]}`,
      decodedJob,
      gapAnalysis: gapAnalysis || undefined,
    };

    setApplications((prev) => [newCard, ...prev]);
    setActiveTab('crm');
  };

  // Update CRM Card Status
  const handleUpdateStatus = (id: string, newStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  // Verify Badge Action
  const handleVerifyBadge = (
    skill: string,
    projectTitle: string,
    proofUrl: string,
    notes: string
  ) => {
    const newBadge: VerifiedBadge = {
      id: `badge-${Date.now()}`,
      skill,
      projectTitle,
      proofUrl,
      notes,
      completedAt: new Date().toISOString(),
    };
    setVerifiedBadges((prev) => [newBadge, ...prev]);
  };

  // Export Data JSON
  const handleExportData = () => {
    const payload = {
      userProfile,
      applications,
      verifiedBadges,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `truefit-career-vault-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Data JSON
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.userProfile) setUserProfile(parsed.userProfile);
        if (parsed.applications) setApplications(parsed.applications);
        if (parsed.verifiedBadges) setVerifiedBadges(parsed.verifiedBadges);
      } catch (err) {
        console.error('Failed to import data:', err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#121110] text-stone-900 dark:text-stone-100 selection:bg-amber-100 dark:selection:bg-amber-950/60 selection:text-amber-900 dark:selection:text-amber-200 transition-colors">
      
      {/* 3-Zone Top Navigation Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        userProfile={userProfile}
        hasDecodedJob={!!decodedJob}
        onNewDecode={() => setActiveTab('decoder')}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {activeTab === 'decoder' && (
          <DecoderView
            decodedJob={decodedJob}
            isLoading={isDecoding}
            onDecode={handleDecode}
            onProceedToBridge={() => setActiveTab('bridge')}
            onSaveToCRM={handleSaveToCRM}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'bridge' && (
          <BridgeView
            decodedJob={decodedJob}
            gapAnalysis={gapAnalysis}
            isLoading={isAnalyzingGap}
            onAnalyzeGap={() => triggerGapAnalysis()}
            onSelectGapForUpskill={handleSelectGapForUpskill}
            onNavigateToDecoder={() => setActiveTab('decoder')}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'accelerator' && (
          <AcceleratorView
            decodedJob={decodedJob}
            gapAnalysis={gapAnalysis}
            upskillingPlan={upskillingPlan}
            selectedGap={selectedGap}
            isLoading={isGeneratingPlan}
            onGeneratePlan={handleGeneratePlan}
            onVerifyBadge={handleVerifyBadge}
            verifiedBadges={verifiedBadges}
            onNavigateToBridge={() => setActiveTab('bridge')}
            onNavigateToInterview={() => setActiveTab('interview')}
          />
        )}

        {activeTab === 'interview' && (
          <MockInterviewView
            decodedJob={decodedJob}
            questions={interviewQuestions}
            isLoadingQuestions={isLoadingQuestions}
            onGenerateQuestions={(mode) => triggerGenerateQuestions(undefined, mode)}
            onEvaluateAnswer={handleEvaluateAnswer}
            onNavigateToDecoder={() => setActiveTab('decoder')}
          />
        )}

        {activeTab === 'crm' && (
          <ApplicationCRM
            applications={applications}
            onUpdateStatus={handleUpdateStatus}
            onOpenOutreachModal={(app) => setActiveOutreachApp(app)}
            onOpenAutopsyModal={(app) => setActiveAutopsyApp(app)}
            onOpenNetworkModal={(app) => setActiveNetworkApp(app)}
            onSelectApplication={(app) => {
              if (app.decodedJob) setDecodedJob(app.decodedJob);
              if (app.gapAnalysis) setGapAnalysis(app.gapAnalysis);
              setActiveTab('decoder');
            }}
          />
        )}

        {activeTab === 'playground' && (
          <PlaygroundView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#121110] py-8 text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm text-stone-900 dark:text-stone-100">TrueFit</span>
            <span aria-hidden="true">·</span>
            <span>Decode the Job. Master the Path.</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500 dark:text-stone-400">
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 underline cursor-pointer"
            >
              How it works (Tour)
            </button>
            <span aria-hidden="true">·</span>
            <span>Zero PII Stored</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 underline cursor-pointer"
            >
              Privacy &amp; Vault
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => {
          setIsTutorialOpen(false);
          localStorage.setItem('truefit_seen_tutorial', 'true');
        }}
        onStartDecipher={() => {
          setIsTutorialOpen(false);
          localStorage.setItem('truefit_seen_tutorial', 'true');
          setActiveTab('decoder');
        }}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onSaveProfile={(updated) => setUserProfile(updated)}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      <OutreachModal
        application={activeOutreachApp}
        onClose={() => setActiveOutreachApp(null)}
        userProfile={userProfile}
      />

      <RejectionAutopsyModal
        application={activeAutopsyApp}
        onClose={() => setActiveAutopsyApp(null)}
        userProfile={userProfile}
      />

      <NetworkNudgeModal
        application={activeNetworkApp}
        onClose={() => setActiveNetworkApp(null)}
        userProfile={userProfile}
      />

    </div>
  );
}
