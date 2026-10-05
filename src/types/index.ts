export interface ImplicitRequirement {
  item: string;
  why: string;
  sourceQuote?: string;
}

export interface RedFlag {
  flag: string;
  severity: 'low' | 'medium' | 'high';
  explanation: string;
  excerpt: string;
  recommendation: string;
}

export interface SalaryRealityCheck {
  disclosedRange?: string;
  marketBenchmarkRange: string;
  assessment: 'significantly_underpaid' | 'fair_market' | 'above_market' | 'equity_heavy';
  insight: string;
  negotiationLeverage: string;
}

export interface CulturePredictor {
  autonomyScore: number;
  paceScore: number;
  collaborationStyle: string;
  psychologicalSafetyEstimate: string;
  workStyleMatch: {
    matchLevel: 'High' | 'Moderate' | 'Challenging';
    details: string;
  };
}

export interface SkillsBreakdown {
  criticalTechnical: string[];
  domainExpertise: string[];
  softAndLeadership: string[];
}

export interface EthicsAuditItem {
  category: 'Gender-Coded Language' | 'Age Bias / Seniority Exclusion' | 'Ableist / Physical Demands' | 'Cultural / Neurodiversity Exclusion' | 'Credential Inflation';
  flaggedText: string;
  biasType: string;
  eeocRiskLevel: 'Low' | 'Moderate' | 'Elevated';
  whyItMatters: string;
  inclusiveAlternative: string;
}

export interface EthicsAudit {
  overallInclusivityScore: number;
  inclusivityRating: 'Highly Inclusive' | 'Moderate Concern' | 'Significant Bias Signals';
  summary: string;
  items: EthicsAuditItem[];
  eeocComplianceNotes: string;
}

export interface DecodedJob {
  roleTitle: string;
  company: string;
  seniority: string;
  executiveSummary: string;
  realPriorities: string[];
  implicitRequirements: ImplicitRequirement[];
  redFlags: RedFlag[];
  salaryRealityCheck: SalaryRealityCheck;
  culturePredictor: CulturePredictor;
  skillsBreakdown: SkillsBreakdown;
  rawJobDescription?: string;
  ethicsAudit?: EthicsAudit;
}

export interface PlaygroundRole {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export interface PlaygroundComparison {
  id: string;
  targetJobTitle: string;
  targetCompany: string;
  jobText: string;
  matchScore: number;
  transferableStrengths: string[];
  bridgingGaps: string[];
  strategicPivotAdvice: string;
  createdAt: string;
}

export interface MatchedSkill {
  skill: string;
  evidenceInProfile: string;
  howToPitch: string;
}

export interface CriticalGap {
  skill: string;
  severity: 'critical' | 'high' | 'medium';
  whyHiringManagerCares: string;
  estimatedHoursToClose: number;
}

export interface BonusGap {
  skill: string;
  impact: string;
}

export interface ImplicitGap {
  trait: string;
  nuance: string;
  strategicAdvice: string;
}

export interface GapAnalysis {
  overallMatchScore: number;
  confidenceSummary: string;
  matchedSkills: MatchedSkill[];
  criticalGaps: CriticalGap[];
  bonusGaps: BonusGap[];
  implicitGaps: ImplicitGap[];
}

export interface ResourceItem {
  title: string;
  type: 'Article' | 'Documentation' | 'Open Source' | 'Course';
  urlOrDescription: string;
}

export interface RoadmapPhase {
  phase: string;
  timeEstimate: string;
  focusArea: string;
  actionableSteps: string[];
  recommendedResources: ResourceItem[];
}

export interface ScheduleStage {
  timebox: string;
  stage: string;
  tasks: string[];
  milestoneOutput: string;
}

export interface MicroProject {
  title: string;
  tagline: string;
  targetSkill: string;
  estimatedMinutes: number;
  scenario: string;
  techStack: string[];
  schedule: ScheduleStage[];
  deliverables: string[];
  verificationCriteria: string[];
  interviewShowcaseTip: string;
}

export interface UpskillingPlan {
  roadmap: RoadmapPhase[];
  microProject: MicroProject;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  hiringManagerIntent: string;
  keyTraitsToDemonstrate: string[];
  pitfallToAvoid: string;
}

export interface InterviewEvaluation {
  score: number;
  strengths: string[];
  subtleImpressions: string;
  missedOpportunities: string[];
  refinedResponseSuggestion: string;
}

export interface VerifiedBadge {
  id: string;
  skill: string;
  projectTitle: string;
  proofUrl: string;
  notes: string;
  completedAt: string;
}

export interface UserProfile {
  name: string;
  currentTitle: string;
  yearsExperience: number;
  summary: string;
  skills: string[];
  workStylePreferences: {
    autonomyPreference: 'High' | 'Moderate' | 'Structured';
    pacePreference: 'Async Deep Work' | 'Fast Iterative Sprints' | 'Balanced';
    minimumTargetSalary: string;
  };
  localPrivacyMode: boolean;
}

export type ApplicationStatus = 'saved' | 'decoded' | 'upskilling' | 'applied' | 'interviewing' | 'offer' | 'rejected';

export interface ApplicationCard {
  id: string;
  company: string;
  roleTitle: string;
  status: ApplicationStatus;
  matchScore: number;
  salaryRange: string;
  dateAdded: string;
  notes: string;
  targetSkillGap?: string;
  decodedJob?: DecodedJob;
  gapAnalysis?: GapAnalysis;
}

export interface RejectionAutopsyResult {
  diagnosis: {
    primaryRootCause: string;
    confidenceLevel: string;
    summary: string;
  };
  hiddenSignals: string[];
  tacticalPivot: {
    whatToStopDoing: string;
    whatToStartDoing: string;
    upskillingAdjustment: string;
  };
  reassurance: string;
}
