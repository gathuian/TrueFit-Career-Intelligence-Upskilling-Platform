export interface PresetJD {
  id: string;
  roleTitle: string;
  company: string;
  industry: string;
  teaser: string;
  text: string;
}

export const PRESET_JDS: PresetJD[] = [
  {
    id: 'stripe-staff',
    roleTitle: 'Staff Software Engineer, Global Payment Infrastructure',
    company: 'Stripe',
    industry: 'Fintech / Distributed Systems',
    teaser: 'High-concurrency distributed transaction processing with 99.999% availability requirements.',
    text: `About Stripe:
Stripe builds economic infrastructure for the internet. Businesses of every size—from new startups to public companies like Amazon and Salesforce—use our software to accept payments and manage their businesses online.

The Role:
We are looking for an experienced Staff Software Engineer to join our Global Payment Processing Infrastructure group. You will lead technical vision for core payment routing, transaction ledger immutability, and distributed failure tolerance across multiple cloud regions.

What You'll Do:
- Architect, build, and maintain high-throughput distributed systems capable of processing hundreds of billions of dollars annually.
- Author comprehensive Architecture Decision Records (ADRs) and shepherd Request for Comments (RFCs) across multi-org engineering teams.
- Debug complex latency spikes, consensus degradation, and partition scenarios across distributed datastores under strict SLA/SLO constraints.
- Champion code review standards, observability instrumentation, and incident post-mortem retrospectives.
- Wear multiple hats when necessary during high-volume peak merchant events (Black Friday / Cyber Monday) to maintain 99.999% uptime.

Qualifications:
- 8+ years of production software engineering experience in distributed systems, backend infrastructure, or fault-tolerant transactional environments.
- Deep expertise in systems programming languages (Go, Java, Rust, or modern C++) or strong TypeScript/Node infrastructure backends.
- Proven track record leading multi-quarter technical initiatives from ambiguous requirements to production delivery.
- Experience with distributed databases (Spanner, Cassandra, CockroachDB), event-driven streaming (Kafka), and OpenTelemetry.
- Excellent written communication skills; you prefer clear documentation and async RFCs over meeting-heavy consensus.
- Comfort thriving in a fast-paced environment where priorities can pivot based on global financial regulatory changes.

Compensation & Benefits:
Competitive base salary and equity package commensurate with experience.`
  },
  {
    id: 'anthropic-frontend-ai',
    roleTitle: 'Lead Frontend Systems Engineer, AI Interfaces',
    company: 'Anthropic',
    industry: 'Frontier AI & Safety',
    teaser: 'Next-generation generative UI, streaming token protocols, and accessible human-AI interaction canvases.',
    text: `About Anthropic:
Anthropic is an AI safety and research company dedicated to building reliable, beneficial, and steerable artificial intelligence systems.

The Role:
We are seeking a Lead Frontend Systems Engineer to design and build frontier interfaces for Claude and next-generation model steering tools. You will bridge complex low-latency streaming server-sent events (SSE) with fluid, accessible, and mathematically rigorous canvas interactions.

Key Responsibilities:
- Design and engineer client-side streaming architectures that render multi-modal token streams, generative code artifacts, and interactive widgets with 60fps responsiveness.
- Collaborate closely with alignment researchers to translate behavioral safety guardrails and explainability tooltips into intuitive human interfaces.
- Build resilient offline-first caching, local state persistence, and privacy-preserving telemetry.
- Enforce strict WCAG AA/AAA accessibility standards and keyboard-first navigation patterns across all consumer and enterprise products.
- Navigate rapid iteration cycles in an ambiguous, rapidly evolving research environment.

Requirements:
- 6+ years of specialized frontend and client architecture experience (React, TypeScript, WebGL/Canvas, Next.js).
- Deep intuition for browser rendering pipelines, memory leak profiling, and Web Audio/Worker concurrency.
- Passion for AI explainability, user agency, and humane software design.
- Ability to push back on vanity design features in favor of extreme clarity, cognitive ease, and safety clarity.

Benefits:
- Market-leading compensation, equity, comprehensive health, and learning stipend.`
  },
  {
    id: 'linear-product',
    roleTitle: 'Senior Product Strategist & Workflow Lead',
    company: 'Linear',
    industry: 'High-Craft Developer Tools',
    teaser: 'Extreme craftsmanship, opinionated workflows, zero-lag desktop interfaces, and async team rituals.',
    text: `About Linear:
Linear is a tool for modern software teams to manage projects, issues, and product roadmaps. We believe modern software tools should feel magical, lightning fast, and respectful of cognitive flow.

The Opportunity:
We are looking for a Senior Product Strategist to own the evolution of our core workflow and cycle intelligence engines. You will define how modern engineering teams balance velocity, technical debt, and customer commitments without bloated management rituals.

Responsibilities:
- Conduct deep qualitative discovery with heads of engineering and product leaders to identify systemic friction points in team roadmapping.
- Define opinionated, minimalist feature specs that solve complex workflow friction with minimal interface surface area.
- Partner with design engineers to sweat every micro-interaction, keyboard shortcut, and state transition.
- Analyze usage metrics with privacy-first analytics to understand why certain workflow features achieve organic viral adoption while others stall.
- Help craft product launch narratives and changelogs that resonate with craft-obsessed engineers and designers.

Who You Are:
- 5+ years building software products, developer tools, or productivity platforms.
- Deep empathy for technical teams; you understand git workflows, CI/CD pipelines, and the nuance of sprint planning.
- Relentless focus on simplicity: your greatest pride is removing unnecessary UI elements and forms.
- Exceptional written storytelling and user research synthesis skills.
- Self-directed builder who operates best with high trust, high autonomy, and low oversight.`
  },
  {
    id: 'supabase-devrel',
    roleTitle: 'Staff Developer Advocate & Open Source Strategist',
    company: 'Supabase',
    industry: 'Open Source Cloud & Postgres',
    teaser: 'Postgres architectures, open-source community amplification, technical deep-dives, and production sample templates.',
    text: `About Supabase:
Supabase is the open source Firebase alternative. We provide developers with the full power of PostgreSQL, Authentication, Storage, Edge Functions, and Vector embeddings.

The Role:
We are seeking a Staff Developer Advocate to spearhead technical education, production architecture templates, and open-source developer engagement. You won't just write fluff blogs—you will build actual production applications, stress-test Postgres primitives, and deconstruct complex cloud architectures for millions of builders.

What You Will Do:
- Architect and open-source full-stack example applications demonstrating advanced Postgres patterns (Row Level Security, pgvector, Realtime CDC, Drizzle/Prisma integration).
- Create deep-dive technical breakdowns and video walk-throughs addressing real developer pain points.
- Act as the voice of external developers internally, partnering with database and auth core teams to file detailed bug reports and feature specs.
- Speak at top-tier engineering conferences and host technical AMAs with high authenticity and humor.

Requirements:
- 5+ years of software development experience with extensive hands-on Postgres, SQL, TypeScript, and cloud deployment knowledge.
- Proven public technical portfolio (open-source contributions, high-traffic technical articles, or recorded video tutorials).
- Strong technical empathy: you remember what it feels like to struggle with database connection pooling or complex migrations.
- High autonomy and genuine love for developer empowerment.`
  }
];

export const INITIAL_USER_PROFILE = {
  name: 'Alex Rivera',
  currentTitle: 'Senior Full-Stack Engineer',
  yearsExperience: 6,
  summary: 'Full-stack software engineer with a strong track record of shipping modern React/TypeScript web apps, Node.js API services, and relational database schemas. Passionate about design systems, accessible UI, and pragmatic system design.',
  skills: [
    'TypeScript',
    'React',
    'Node.js',
    'Next.js',
    'PostgreSQL',
    'REST & GraphQL APIs',
    'Tailwind CSS',
    'Jest / Unit Testing',
    'Docker & CI/CD Pipelines',
    'Git & Agile Workflows'
  ],
  workStylePreferences: {
    autonomyPreference: 'High' as const,
    pacePreference: 'Async Deep Work' as const,
    minimumTargetSalary: '$160,000'
  },
  localPrivacyMode: true
};
