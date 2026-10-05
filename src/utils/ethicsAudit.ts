import { EthicsAudit, EthicsAuditItem } from '../types';

interface BiasPattern {
  regex: RegExp;
  category: EthicsAuditItem['category'];
  biasType: string;
  eeocRiskLevel: EthicsAuditItem['eeocRiskLevel'];
  whyItMatters: string;
  inclusiveAlternative: string;
}

const BIAS_PATTERNS: BiasPattern[] = [
  // 1. Gender-Coded / Hyper-Masculine Language
  {
    regex: /\b(rockstar|rock\s*star|ninja|guru|wizard|jedi|badass|crush\s*it|dominate|aggressive|killer\s*instinct)\b/i,
    category: 'Gender-Coded Language',
    biasType: 'Hyper-masculine competitive phrasing',
    eeocRiskLevel: 'Moderate',
    whyItMatters: 'Studies in workplace psychology demonstrate that terms like "rockstar", "ninja", or "dominate" reduce application rates among women and candidates who value collaborative team culture over individual bravado.',
    inclusiveAlternative: 'Replace with "collaborative engineer who solves complex problems through clear communication and teamwork".'
  },
  {
    regex: /\b(manpower|man\s*hours|chairman|craftsman)\b/i,
    category: 'Gender-Coded Language',
    biasType: 'Gender-specific nouns',
    eeocRiskLevel: 'Low',
    whyItMatters: 'Gendered nouns implicitly frame the default worker as male, subtly diminishing psychological safety for female and non-binary applicants.',
    inclusiveAlternative: 'Use gender-neutral equivalents like "workforce", "engineering hours", "chair / lead", and "artisan / specialist".'
  },

  // 2. Age Bias & Generational Exclusion (ADEA / EEOC)
  {
    regex: /\b(digital\s*native|young\s*and\s*hungry|fresh\s*grad(uate)?\s*energy|youthful|energetic\s*grads?)\b/i,
    category: 'Age Bias / Seniority Exclusion',
    biasType: 'Ageist proxy language',
    eeocRiskLevel: 'Elevated',
    whyItMatters: 'The EEOC strictly advises that phrasing like "digital native" or "young and hungry" risks violating the Age Discrimination in Employment Act (ADEA) by signaling an unlawful preference for workers under 40.',
    inclusiveAlternative: 'Replace with "curious problem solver with a passion for continuous learning and technology".'
  },
  {
    regex: /\b(overqualified|too\s*experienced|no\s*more\s*than\s*\d+\s*years)\b/i,
    category: 'Age Bias / Seniority Exclusion',
    biasType: 'Artificial seniority cap',
    eeocRiskLevel: 'Elevated',
    whyItMatters: 'Setting maximum experience caps often acts as a disguised barrier against older candidates seeking career shifts or stability.',
    inclusiveAlternative: 'Specify the required core competencies rather than capping maximum years of prior experience.'
  },

  // 3. Cultural & Neurodiversity Exclusion
  {
    regex: /\b(culture\s*fit|cultural\s*fit|fit\s*in\s*with\s*the\s*boys)\b/i,
    category: 'Cultural / Neurodiversity Exclusion',
    biasType: 'Subjective affinity bias',
    eeocRiskLevel: 'Moderate',
    whyItMatters: '"Cultural fit" frequently turns into a shield for affinity bias (hiring people who share the same background, hobbies, or demographics), rather than hiring for diverse viewpoints.',
    inclusiveAlternative: 'Shift from "culture fit" to "culture add": focus on how a candidate brings complementary skills, perspectives, and values.'
  },
  {
    regex: /\b(native\s*english\s*speaker|accent-free|mother\s*tongue)\b/i,
    category: 'Cultural / Neurodiversity Exclusion',
    biasType: 'National origin & linguistic barrier',
    eeocRiskLevel: 'Elevated',
    whyItMatters: 'The EEOC strictly prohibits requiring "native English" unless fluency level is a genuine, documented business necessity. It excludes talented bilingual and international professionals.',
    inclusiveAlternative: 'Use "strong written and verbal communication skills in English".'
  },
  {
    regex: /\b(thick\s*skin|survive\s*our\s*feedback|not\s*for\s*the\s*faint\s*of\s*heart|work\s*hard\s*play\s*hard)\b/i,
    category: 'Cultural / Neurodiversity Exclusion',
    biasType: 'Hostile communication / Burnout culture indicator',
    eeocRiskLevel: 'Moderate',
    whyItMatters: 'Demanding "thick skin" frequently masks a culture of unmanaged psychological safety or harsh personal criticism, which disproportionately impacts neurodivergent candidates.',
    inclusiveAlternative: 'Describe your actual feedback ritual: "We practice constructive, kind peer code reviews with clear guidelines".'
  },

  // 4. Ableist / Physical Demands without BFOQ
  {
    regex: /\b(lift\s*(up\s*to\s*)?\d+\s*lbs|stand\s*for\s*(extended|long)\s*periods|physically\s*fit)\b/i,
    category: 'Ableist / Physical Demands',
    biasType: 'Unjustified physical requirements',
    eeocRiskLevel: 'Elevated',
    whyItMatters: 'Including heavy lifting or standing requirements in software, design, or desk-based roles violates ADA accessibility principles by disqualifying candidates with physical disabilities.',
    inclusiveAlternative: 'Remove physical demands unless they are an essential, daily task (Bona Fide Occupational Qualification).'
  },

  // 5. Credential Inflation / Socioeconomic Barriers
  {
    regex: /\b(top-tier\s*university|ivy\s*league|pedigree|strictly\s*accredited\s*4-year)\b/i,
    category: 'Credential Inflation',
    biasType: 'Socioeconomic elitism',
    eeocRiskLevel: 'Moderate',
    whyItMatters: 'Requiring elite university degrees over proven real-world projects excludes talented self-taught developers, bootcamp alumni, and candidates from underprivileged backgrounds.',
    inclusiveAlternative: 'Use "Degree in related technical field or equivalent hands-on professional experience".'
  }
];

export function runClientSideEthicsAudit(jobText: string): EthicsAudit {
  const detectedItems: EthicsAuditItem[] = [];

  for (const pattern of BIAS_PATTERNS) {
    const match = jobText.match(pattern.regex);
    if (match) {
      // Find full surrounding sentence or phrase
      const matchIndex = match.index || 0;
      const start = Math.max(0, jobText.lastIndexOf('.', matchIndex) + 1);
      let end = jobText.indexOf('.', matchIndex + match[0].length);
      if (end === -1) end = jobText.length;
      const excerpt = jobText.slice(start, end).trim() || match[0];

      detectedItems.push({
        category: pattern.category,
        flaggedText: excerpt,
        biasType: pattern.biasType,
        eeocRiskLevel: pattern.eeocRiskLevel,
        whyItMatters: pattern.whyItMatters,
        inclusiveAlternative: pattern.inclusiveAlternative
      });
    }
  }

  // Deduplicate by category
  const uniqueItems = detectedItems.filter(
    (item, index, self) => index === self.findIndex((t) => t.flaggedText === item.flaggedText)
  );

  let score = 95;
  for (const item of uniqueItems) {
    if (item.eeocRiskLevel === 'Elevated') score -= 15;
    else if (item.eeocRiskLevel === 'Moderate') score -= 8;
    else score -= 4;
  }
  score = Math.max(35, Math.min(98, score));

  const rating =
    score >= 85
      ? 'Highly Inclusive'
      : score >= 65
      ? 'Moderate Concern'
      : 'Significant Bias Signals';

  const summary =
    uniqueItems.length === 0
      ? 'This job description uses clean, neutral, and objective language aligned with EEOC and modern DEI fair hiring principles.'
      : `TrueFit detected ${uniqueItems.length} potentially exclusionary phrasing pattern${
          uniqueItems.length === 1 ? '' : 's'
        }. While likely unintentional, these patterns may inadvertently reduce applicant diversity or create legal exposure under EEOC and ADEA standards.`;

  return {
    overallInclusivityScore: score,
    inclusivityRating: rating,
    summary,
    items: uniqueItems,
    eeocComplianceNotes:
      'Under the U.S. Equal Employment Opportunity Commission (EEOC) and international fair-hiring frameworks, job announcements must articulate job-related qualifications (BFOQs) without chilling interest based on gender, age, disability, or national origin.'
  };
}
