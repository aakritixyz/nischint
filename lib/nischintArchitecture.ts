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
