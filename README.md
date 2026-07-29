# Nischint

**Peace of mind, one tap away.**

Nischint is a mobile-first elder safety and family care companion for moments when an older adult feels lost, confused, unwell, or unable to explain what they need. It keeps the senior-facing experience simple and calm while giving caregivers the context they need to respond quickly.

## What It Does

Nischint helps seniors and families handle real safety moments:

- A senior can tap **I feel lost** to activate lost mode.
- A senior can say voice commands like **I need help**, **I am okay**, **I took medicine**, or **mujhe madad chahiye**.
- Caregivers can receive alert updates through SMS and prepared WhatsApp provider hooks.
- The app tracks safe-zone status, caregiver contacts, reminders, notes, consent, and recent care activity.
- The interface supports English/Hindi, read-aloud guidance, large touch targets, and mobile-first accessibility.

The goal is not to overwhelm the user with choices. During confusion, Nischint reduces decisions and gives one clear next step.

## Core Features

### Senior Safety

- Large **I feel lost** emergency button
- **I am okay**, **I need help**, and **I took medicine** check-ins
- Calm read-aloud instructions
- English/Hindi interface
- Voice command support with transcription and intent detection
- Saved home address and emergency information card
- One-tap caregiver call link
- Mobile-first layout with large, readable controls

### Caregiver Support

- Caregiver signup/login with signed session cookies
- Care-circle contacts with owner, backup, and clinical roles
- SMS alert delivery through Twilio
- WhatsApp Cloud API template support
- Verified caregiver number protection with `VERIFIED_CAREGIVER_NUMBERS`
- Safe-zone status and location-sharing flow
- Reminder creation for medicine and routines
- Family notes and handoff history
- Consent log, privacy requests, and audit trail

### Backend And Monitoring

- Persistent care state when `DATABASE_URL` is configured
- In-memory fallback when no database is present
- Production readiness endpoint
- Monitoring endpoint for provider health, delivery failures, location state, and recent events
- Public Pages for care, privacy, FAQ, about, contact, and app walkthrough routes

## Tech Stack

- **Frontend:** Next.js App Router, React, TypeScript
- **Styling:** CSS with Tailwind setup
- **Backend:** Next.js API routes
- **Database:** PostgreSQL with Drizzle ORM schema
- **Auth:** Built-in caregiver auth, signed session cookie, optional Supabase Auth
- **Alerts:** Twilio SMS and WhatsApp Cloud API
- **AI:** Groq, Gemini, OpenRouter, and optional OpenAI hooks
- **Deployment:** Vercel
- **Testing:** Next production build and Node test runner
- **PWA:** Web manifest and service worker

## AI Model Flow

Nischint uses AI only where it adds practical value:

- **Voice transcription:** Groq Whisper, default `whisper-large-v3-turbo`
- **Voice intent detection:** local Hindi/English/Hinglish rules first, then Gemini fallback
- **Calming guidance:** Groq first by default, then Gemini, then OpenAI fallback
- **Advanced capability map:** Gemini Live WebSocket, Groq REST API, OpenRouter REST API, and Groq multimodal hooks

Default model map:

| Role | Model / Provider |
| --- | --- |
| Voice transcription | `whisper-large-v3-turbo` via Groq |
| Voice conversation + intent detection | `gemini-2.5-flash-native-audio` via Gemini Live WebSocket |
| Guidance drafting | `openai/gpt-oss-20b` through Groq-compatible flow |
| Orchestration | `meta-llama/llama-4-scout-17b-16e-instruct` |
| Planning | OpenRouter, configurable |
| Screenshot verification | `meta-llama/llama-4-scout-17b-16e-instruct` via Groq |
| Fallback guidance | Gemini or OpenAI when configured |

If AI keys are missing, Nischint still works with built-in calm guidance and deterministic command rules.

## Main Routes

- `/` - main Nischint app
- `/care` - caregiver guide
- `/privacy` - privacy policy
- `/demo` - app walkthrough
- `/about` - mission and roadmap
- `/contact` - support/contact page
- `/faq` - common questions
- `/api/nischint/monitoring` - monitoring status
- `/api/nischint/production` - Production readiness audit

## Important API Routes

- `/api/nischint/state`
- `/api/nischint/lost-mode`
- `/api/nischint/check-in`
- `/api/nischint/location`
- `/api/nischint/notify`
- `/api/nischint/voice-command`
- `/api/nischint/reminders`
- `/api/nischint/notes`
- `/api/nischint/consent`
- `/api/nischint/signup`
- `/api/nischint/login`
- `/api/nischint/logout`
- `/api/nischint/me`

## Run Locally

```bash
cd /Users/Dell/Documents/Codex/2026-07-22/nischint
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Run a production-style check:

```bash
npm run build
npm start
```

Run tests:

```bash
npm run lint
npm test
```

## Environment Summary

The app runs without provider keys, but real alerts, persistence, and AI improve when these are configured:

- `DATABASE_URL` for persistent PostgreSQL care state
- `NISCHINT_SESSION_SECRET` for signed caregiver sessions
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` for SMS
- `VERIFIED_CAREGIVER_NUMBERS` for safe alert delivery
- `GROQ_API_KEY` for voice transcription and guidance
- `GROQ_TRANSCRIPTION_MODEL` for voice transcription, default `whisper-large-v3-turbo`
- `GEMINI_API_KEY` and `GEMINI_VOICE_MODEL` for AI fallback
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` for optional Supabase Auth
- `WHATSAPP_TEMPLATE_NAME` and WhatsApp credentials for optional WhatsApp alerts

Do not add blank env vars in Vercel. Add a key only when you have a real value.

## Showcase Flow

1. Open Nischint on a mobile screen.
2. Login or create a caregiver account.
3. Show English/Hindi and voice guidance.
4. Press **I feel lost**.
5. Use voice command: “I need help” or “mujhe madad chahiye”.
6. Show check-ins: **I am okay** and **I took medicine**.
7. Show Location, Reminders, Care circle, Notes, and Privacy.
8. Open `/api/nischint/monitoring` to show backend/provider health.

## Documentation

- [Production architecture](docs/PRODUCTION_ARCHITECTURE.md)
- [Technical implementation roadmap](docs/TECHNICAL_IMPLEMENTATION.md)
- [Privacy and legal review checklist](docs/PRIVACY_LEGAL_REVIEW.md)
- [Pilot test plan](docs/PILOT_TEST_PLAN.md)

## Status

Nischint is ready as a polished college showcase MVP. It demonstrates accessibility, AI voice support, backend integration, caregiver workflows, alert provider hooks, privacy-first consent, and a meaningful real-world safety use case.

## Safety Note

Nischint is not medical advice, an emergency-response service, or a replacement for professional care. Real-family production use would require legal/privacy review, verified alert delivery policies, monitored failure handling, and field testing with caregivers and older adults.
