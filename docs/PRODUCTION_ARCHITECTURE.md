# Nischint Production Architecture Roadmap

This document separates the current deployable MVP from the future full-scale architecture.

## Current MVP

- Single Next.js PWA deployed on Vercel
- Senior, caregiver, demo, family, and privacy surfaces in one app
- Signed caregiver session cookie
- Postgres-backed care state through `DATABASE_URL`
- Twilio SMS provider hook
- Groq, Gemini, OpenRouter, and OpenAI AI provider hooks
- Consent and privacy audit timeline
- Production readiness endpoint

## Target Multi-App Architecture

| App | Target Domain | Purpose |
| --- | --- | --- |
| Senior App | `senior.nischint.app` | Ultra-simple large-touch safety interface |
| Family Dashboard | `family.nischint.app` | Caregiver command center |
| Admin Portal | `admin.nischint.app` | System management, analytics, audit review |
| Public Landing | `nischint.app` | Marketing, onboarding, trust information |

## Target Services

| Service | Responsibility |
| --- | --- |
| API Gateway | Routing, rate limiting, request policy |
| Auth Service | OAuth 2.0, JWT, role-based access control |
| Location Service | GPS updates, geofence engine, location history |
| Alert Service | SMS, WhatsApp, email, push escalation |
| Profile Service | Medical context, preferences, caregiver contacts |
| AI Service | Voice, intent detection, guidance, pattern analysis |
| Notification Service | Push orchestration and delivery tracking |
| Audit Service | Immutable consent and compliance logs |

## Cloud Direction

- Primary region: AWS Mumbai `ap-south-1`
- Disaster recovery: AWS Singapore failover
- Transactional data: Aurora PostgreSQL
- Dashboard reads: PostgreSQL read replicas
- Sessions/realtime fanout: Redis
- Location history and patterns: Amazon Timestream
- Notes and AI interactions: document store
- Static assets and emergency documents: S3 + CloudFront

## Real-Time Direction

- WebSocket cluster for live location
- Redis pub/sub for cross-instance fanout
- SSE for one-way alert streams
- SQS for alert escalation queues
- SNS for multi-channel delivery
- EventBridge for cross-service events

## Senior UX Guardrails

- Maximum three actions per senior screen
- Primary safety touch targets should be at least 80px
- Secondary touch targets should be at least 48px
- Avoid technical provider language in senior-facing screens
- Use English/Hindi labels with voice fallback
- Prefer guidance over error messages
- Keep caregiver/admin complexity out of the senior flow

## MVP-To-Production Path

1. Keep the current Vercel PWA as the demo and prototype surface.
2. Split `/senior`, `/family`, `/admin`, and public landing into separate route groups.
3. Move care state from JSON persistence into normalized Postgres tables.
4. Add real caregiver accounts and RBAC.
5. Add WebSocket location updates and alert acknowledgements.
6. Add immutable audit storage for consent-critical events.
7. Add wearable, medical-device, and smart-home integrations only after the core safety loop is field-tested.
