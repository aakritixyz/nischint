# Nischint Technical Implementation Roadmap

This document describes the target production implementation for Nischint. The current deployable app is still the Vercel MVP; this roadmap explains what should be added when the project moves from demo to real field use.

## Frontend Architecture

### Senior App

| Area | Target |
| --- | --- |
| Framework | React Native 0.73+ with Expo |
| State | Zustand for simple, predictable state |
| Navigation | React Navigation with calm senior-friendly transitions |
| UI | Accessible custom components, inspired by React Native Paper patterns |
| Voice | React Native Voice for speech recognition |
| Location | Background geolocation with explicit consent |
| Notifications | Expo Notifications with critical-alert planning |
| Offline | AsyncStorage-backed offline state and queued sync |

The senior app must remain calmer than the family dashboard. The default senior screen should expose only the essential safety loop: confirm safe, ask for help, and trigger lost/emergency guidance.

### Family Dashboard

| Area | Target |
| --- | --- |
| Framework | Next.js App Router |
| State | React Query for server state, Zustand for local UI state |
| UI | shadcn/ui and Tailwind CSS |
| Maps | Mapbox GL JS or Google Maps depending on production-region needs |
| Realtime | Socket.io client or native WebSocket client |
| Analytics | Recharts for trends and timelines |
| Forms | React Hook Form with Zod validation |

The family dashboard can show more context: live status, escalation history, safe-zone events, medicine reminders, contacts, privacy/consent state, and AI-generated caregiver summaries.

## Backend Services

The MVP uses Next.js API routes. A production build should split this into focused services:

| Service | Responsibility |
| --- | --- |
| API Gateway | Routing, request policy, rate limits, and versioning |
| Auth Service | OAuth 2.0, JWT, caregiver sessions, MFA, and RBAC |
| Profile Service | Senior profile, medical context, contacts, consent |
| Location Service | GPS ingestion, geofence checks, route context |
| Alert Service | Emergency escalation and acknowledgements |
| AI Service | Voice intent, calming guidance, summaries, anomaly insights |
| Notification Service | SMS, WhatsApp, email, push, and delivery tracking |
| Audit Service | Immutable access, consent, and admin action logs |

Recommended implementation:

- Node.js and TypeScript services
- OpenAPI/Swagger documentation
- Zod request and response validation
- Redis-backed rate limiting
- Winston structured JSON logs
- ECS Fargate containers behind Application Load Balancers
- AWS Cloud Map and App Mesh for service discovery and service-to-service communication

## Data Layer

| Store | Production Role |
| --- | --- |
| Aurora PostgreSQL 15 | Users, care profiles, contacts, reminders, consent, alert records |
| Prisma | Type-safe ORM and migrations |
| PgBouncer | Efficient connection pooling |
| Amazon Timestream | Location history, alert patterns, vitals trends |
| Redis | Sessions, live status, pub/sub, rate limits |
| Document store | AI interaction notes and flexible caregiver context |
| S3 + CloudFront | Emergency documents, media, and static assets |

Retention should be strict: keep detailed GPS data only as long as needed, aggregate older trends, and support export/delete flows.

## AI And Integrations

### AI

- Voice conversation and intent detection: Gemini Live / native audio model
- Orchestration and calm text drafting: Groq-hosted Llama models
- Action planning: OpenRouter-configurable model
- Clinical or sensitive outputs: guarded templates and human review
- Pattern detection: anomaly/risk scoring only after enough consented data exists

AI must never silently make emergency decisions. It can draft guidance, classify intent, summarize status, and recommend escalation, but caregiver and emergency workflows need explicit rules and audit logs.

### Communication

- Twilio SMS for core emergency alerts
- WhatsApp Business API for richer family messaging
- AWS SES for email notifications
- Firebase Cloud Messaging / Expo Notifications for push

### Location And Care Ecosystem

- Google Maps geocoding, reverse geocoding, Places, and Distance Matrix APIs
- OpenWeatherMap for weather-based safety warnings
- FHIR/EHR integration only after compliance review
- Apple HealthKit and Google Fit after core location and alert flows are stable

## Security, Privacy, And Compliance

| Area | Requirement |
| --- | --- |
| Encryption | TLS 1.3 in transit, AES-256 at rest, AWS KMS key rotation |
| Data classes | Critical: location, emergency contacts, medical context |
| MFA | Required for primary caregivers |
| RBAC | Senior, primary caregiver, secondary caregiver, medical contact, admin |
| Sessions | Short sensitive-operation sessions, device registration, revocation |
| Consent | Granular consent, one-click withdrawal, immutable revocation log |
| Transparency | Access logs, data export, deletion requests, privacy dashboard |
| Compliance targets | GDPR, HIPAA-ready controls, India DPDP Act, SOC 2 Type II, ISO 27001 |

Before real deployment, Nischint should complete a formal threat model, privacy impact assessment, incident response plan, and third-party security review.

## Accessibility And Inclusivity

Target WCAG 2.1 AAA where practical, especially for the senior app.

- 48px minimum touch targets; 80px for primary safety actions
- Strong visible focus indicators
- Text scaling up to 200% without horizontal scrolling
- High-contrast mode and reduced-motion support
- Screen reader landmarks, labels, live regions, and logical headings
- English/Hindi support with room for regional Indian languages
- Voice fallback for users who cannot read comfortably
- Gesture alternatives for every gesture
- Consistent navigation and no surprise context changes
- Simple text, forgiving errors, and clear progress indication

## Performance And Operations

| Metric | Target |
| --- | --- |
| API latency | p95 under 100ms for common requests |
| Initial load | Under 2 seconds |
| Location update | Under 5 seconds from GPS capture to dashboard |
| Alert delivery | Under 10 seconds from trigger |
| Voice response | Under 1 second |
| Senior app memory | Under 150MB |

Operational requirements:

- GitHub protected main branch
- CI pipeline: lint, test, build, security scan, deploy
- Playwright E2E checks for emergency and caregiver flows
- Sentry or equivalent error tracking
- CloudWatch logs and metrics
- AWS X-Ray tracing
- PagerDuty critical alerts
- Blue-green deployments, canaries, feature flags, and rollback
- Multi-AZ deployment and cross-region disaster recovery
- RPO 5 minutes and RTO 30 minutes for critical services

## MVP Priority Order

1. Keep the senior app simple and mobile-first.
2. Finish real caregiver accounts and permissions.
3. Normalize database tables for profiles, contacts, events, reminders, and consent.
4. Add tested Twilio SMS alert delivery and acknowledgements.
5. Add WebSocket or SSE live status for caregivers.
6. Add export/delete privacy workflows.
7. Add high-contrast mode and accessibility QA.
8. Add provider monitoring, uptime checks, and incident playbooks.
9. Split senior/family/admin experiences after the MVP safety loop is stable.
10. Move to AWS multi-service infrastructure only when real usage demands it.
