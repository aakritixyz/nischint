export const productionArchitecture = {
  applications: [
    {
      name: "Senior App",
      target: "senior.nischint.app",
      purpose: "Ultra-simple PWA with large-touch safety actions and voice-first support.",
    },
    {
      name: "Family Dashboard",
      target: "family.nischint.app",
      purpose: "Caregiver command center for alerts, location, notes, reminders, and consent.",
    },
    {
      name: "Admin Portal",
      target: "admin.nischint.app",
      purpose: "Operations, analytics, audit review, and care-team management.",
    },
    {
      name: "Public Landing",
      target: "nischint.app",
      purpose: "Public product story, onboarding, and trust information.",
    },
  ],
  services: [
    "API Gateway",
    "Auth Service",
    "Location Service",
    "Alert Service",
    "Profile Service",
    "AI Service",
    "Notification Service",
    "Audit Service",
  ],
  cloud: {
    primaryRegion: "AWS Mumbai ap-south-1",
    disasterRecovery: "AWS Singapore failover",
    database: "Aurora PostgreSQL primary, read replicas, Redis, Timestream, MongoDB",
    realtime: "WebSockets, Redis pub/sub, SSE, SQS, SNS, EventBridge",
    edge: "CloudFront, S3, Lambda@Edge",
  },
  technicalStack: {
    seniorApp: [
      "React Native with Expo for a future native senior app",
      "Zustand for simple local state",
      "React Navigation with senior-friendly transitions",
      "React Native Voice, background geolocation, Expo Notifications, and offline persistence",
    ],
    familyDashboard: [
      "Next.js App Router for the family and admin web surfaces",
      "React Query plus Zustand for server/client state",
      "shadcn/ui, Tailwind CSS, Mapbox GL JS, Socket.io, Recharts, React Hook Form, and Zod",
    ],
    backend: [
      "Node.js and TypeScript services behind an API gateway",
      "OpenAPI documentation, Zod validation, OAuth 2.0/JWT auth, Redis-backed rate limits, and structured Winston logs",
      "ECS Fargate, AWS App Mesh, Cloud Map, and Application Load Balancers for service operation",
    ],
    data: [
      "Aurora PostgreSQL 15 with Prisma, Prisma Migrate, PgBouncer, and point-in-time recovery",
      "Amazon Timestream for location, alert, and vitals history",
      "Redis for sessions, realtime status, rate limits, and pub/sub",
    ],
    integrations: [
      "Twilio SMS, WhatsApp Business API, AWS SES, Firebase Cloud Messaging, and Expo Notifications",
      "Google Maps geocoding, reverse geocoding, Places, and Distance Matrix APIs",
      "FHIR, pharmacy, telemedicine, Apple HealthKit, and Google Fit integrations after core safety validation",
    ],
  },
  securityCompliance: {
    encryption: "TLS 1.3 in transit, AES-256 at rest, AWS KMS rotation, and stronger controls for location and health data.",
    access: "MFA for primary caregivers, RBAC for senior/caregiver/medical/admin roles, short sensitive-operation sessions, device registration, and session revocation.",
    privacy: "Granular consent, one-click withdrawal, data export, deletion requests, visible access logs, minimization, anonymized analytics, and immutable revocation logs.",
    complianceTargets: ["GDPR", "HIPAA-ready controls", "India DPDP Act", "SOC 2 Type II", "ISO 27001", "ISO 27701"],
  },
  operations: {
    performanceTargets: [
      "API p95 under 100ms for common requests",
      "Initial page load under 2 seconds",
      "Location update to caregiver dashboard under 5 seconds",
      "Emergency alert delivery under 10 seconds",
      "Voice command response under 1 second",
    ],
    observability: [
      "Sentry or equivalent error tracking",
      "CloudWatch metrics and logs",
      "Distributed tracing with AWS X-Ray",
      "PagerDuty for critical alerts and Slack/email digests for lower-severity alerts",
    ],
    deployment: [
      "GitHub protected main branch",
      "CI pipeline: lint, test, build, security scan, deploy",
      "Blue-green and canary releases with feature flags",
      "Automated rollback for failed releases",
    ],
    reliability: [
      "99.9% overall uptime target",
      "99.99% emergency-service target",
      "Multi-AZ primary deployment with Singapore DR",
      "RPO 5 minutes and RTO 30 minutes for critical services",
    ],
  },
  seniorUxPrinciples: [
    "Maximum three actions per senior screen",
    "48px minimum touch targets and 80px primary safety buttons",
    "No destructive action without confirmation",
    "Progressive disclosure for complex caregiver settings",
    "Simple bilingual language with voice fallback",
  ],
  currentMvpMapping: [
    "Single Vercel PWA simulates the Senior App and Family Dashboard.",
    "Next.js API routes stand in for gateway, alert, profile, AI, audit, and notification services.",
    "Neon/Postgres stores live care state while provider keys enable AI and Twilio SMS.",
    "The Privacy tab exposes production readiness until a real Admin Portal exists.",
  ],
};
