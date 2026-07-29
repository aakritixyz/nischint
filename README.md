# Nischint

**Nischint** means peace of mind. It is a mobile-first elder safety and family care companion built for moments when an older adult feels confused, lost, unwell, or unable to explain what they need.

Nischint is not just a memory app. It focuses on real-time support: one-tap help, voice commands, caregiver alerts, reminders, safe-zone awareness, and consent-first privacy controls.

## Project Pitch

During stressful moments, an elderly person should not have to navigate a complicated app. Nischint gives the senior a calm screen with large actions like **I feel lost**, **I need help**, **I am okay**, and **I took medicine**. It gives caregivers the context they need: location status, emergency notes, alerts, reminders, care-circle contacts, and activity history.

> Nischint supports older adults during vulnerable moments by giving them simple guidance, family contact, location sharing, reminders, and real-time caregiver alerts.

## Copyable Video Script

### 1. Opening

**Show:** Nischint homepage or start screen.

**Speak:**

Hi, this is Nischint, a real-time safety and care companion for elderly people and families. The idea is simple: during moments of confusion, stress, or being lost, the senior should not have to navigate a complicated app. Nischint gives them large, clear actions, voice assistance, family alerts, and caregiver visibility in one mobile-first experience.

### 2. Problem

**Show:** Senior view with the big action buttons.

**Speak:**

Many elderly people, especially those living independently, may forget where they are, miss medicine, or feel unsure about asking for help. In that moment, small buttons and complicated screens are not useful. So Nischint focuses on calm, readable, accessible emergency support.

### 3. Onboarding

**Show:** Login/setup screen, language toggle, and voice option.

**Speak:**

First, a caregiver can set up the senior profile. The app supports English and Hindi, and voice assistance can be turned on for users who may not be comfortable reading. This makes the experience more inclusive for elderly users.

### 4. Senior Safety Flow

**Show:** Senior tab or main senior screen.

**Speak:**

This is the senior-facing screen. It shows the current status, location context, and simple actions like I feel lost, I am okay, I need help, and I took medicine. The buttons are intentionally large and easy to tap on a phone.

### 5. Lost Mode

**Show:** Press **I feel lost**.

**Speak:**

If the senior feels lost, they can press one big button. Nischint activates lost mode, gives calm instructions, shares the saved care context, and alerts the caregiver. The person does not need to type or explain anything in panic.

### 6. Voice Command

**Show:** Tap **Voice command** and say “I feel lost” or “I need help”.

**Speak:**

Nischint also supports voice commands. For example, the user can say I feel lost or mujhe madad chahiye. The app records the command, transcribes it using Groq Whisper, detects the intent, and triggers the correct action. This is useful for seniors who may struggle with reading or touch navigation.

### 7. Check-Ins

**Show:** Press **I am okay** and **I took medicine**.

**Speak:**

Daily check-ins are also supported. The senior can quickly mark that they are safe, need help, or have taken medicine. These updates are saved in the care history so family members can stay informed without constantly calling.

### 8. Location And Safe Zone

**Show:** Location tab and safe-zone section.

**Speak:**

The location section shows whether the person is inside or outside their usual safe area. The app uses safe-zone logic, so caregivers can understand if a loved one may have wandered beyond a familiar area.

### 9. Care Circle

**Show:** Care circle or emergency contacts tab.

**Speak:**

Caregivers and trusted contacts can be added to the care circle. Nischint uses verified numbers for alerts, so safety messages are not accidentally sent to unknown people.

### 10. Alerts

**Show:** SMS or WhatsApp alert controls/status.

**Speak:**

For alerts, Nischint supports SMS through Twilio and has WhatsApp Cloud API integration prepared. SMS is the primary reliable alert channel, while WhatsApp can be used with approved Meta templates.

### 11. Reminders

**Show:** Reminders tab.

**Speak:**

The reminders section helps with daily routines like medicine, walks, hydration, or appointments. This makes Nischint useful not only in emergencies, but also for everyday care.

### 12. Notes And Family Handoff

**Show:** Notes tab.

**Speak:**

Family members can add caregiver notes, like whether the person ate, seemed calm, or needs a follow-up. This helps with handoff between family members, neighbors, or doctors.

### 13. Privacy

**Show:** Privacy tab.

**Speak:**

Because this app handles sensitive data like location and emergency information, Nischint is consent-first. It includes privacy requests, consent logs, and audit history. Location sharing happens only with permission.

### 14. Backend And Tech Stack

**Show:** Monitoring endpoint, GitHub, or Vercel dashboard.

**Speak:**

Technically, Nischint is built with Next.js, React, TypeScript, Tailwind CSS, API routes, PostgreSQL with Drizzle ORM, Twilio for SMS alerts, Groq for voice transcription, Gemini for AI support, and Vercel for deployment. The backend stores care state, reminders, notes, consent logs, and alert events.

### 15. Closing

**Show:** Main app screen again.

**Speak:**

Nischint is designed for real moments when someone needs help immediately. It gives seniors a simple way to stay calm and reach family, while giving caregivers the context they need to respond quickly. For a college showcase, it demonstrates accessibility, AI, backend integration, safety workflows, and meaningful real-world impact.

## What To Show In The Video

1. Start screen and Nischint branding.
2. Caregiver login/setup.
3. English/Hindi language toggle.
4. Voice guidance toggle.
5. Main senior screen.
6. Press **I feel lost**.
7. Use **Voice command** and say “I need help” or “mujhe madad chahiye”.
8. Show read-aloud response.
9. Press **I am okay**.
10. Show Location / safe-zone tab.
11. Show Reminders tab.
12. Show Care circle contacts.
13. Show Notes / family handoff.
14. Show Privacy / consent audit.
15. Show `/api/nischint/monitoring` for backend proof.

## Features

- Mobile-first senior safety interface
- Caregiver signup/login with signed session cookies
- Caregiver signup creates a secure family access path for the showcase flow
- Optional Supabase Auth support
- Persistent care state with PostgreSQL when `DATABASE_URL` is configured
- Big **I feel lost** lost-mode flow
- **I am okay**, **I need help**, and **I took medicine** check-ins
- English/Hindi UI and spoken guidance
- Voice commands with Groq transcription and AI-backed intent detection
- Twilio SMS alerts
- WhatsApp Cloud API template support
- Verified caregiver number protection with `VERIFIED_CAREGIVER_NUMBERS`
- Location sharing and safe-zone status logic
- Reminders for medicine and routine care
- Care-circle contacts and caregiver roles
- Family notes and handoff history
- Privacy requests, consent log, and audit trail
- Monitoring endpoint for provider and care-state health
- PWA manifest and service worker

## Tech Stack

- **Frontend:** Next.js App Router, React, TypeScript
- **Styling:** CSS, Tailwind setup
- **Backend:** Next.js API routes
- **Database:** PostgreSQL with Drizzle ORM schema and JSON care-state persistence
- **Auth:** Built-in caregiver auth with signed sessions, optional Supabase Auth
- **Alerts:** Twilio SMS, WhatsApp Cloud API
- **AI:** Groq Whisper for voice transcription, Gemini for AI support, OpenRouter/OpenAI hooks for optional planning/guidance
- **Deployment:** Vercel
- **Testing:** Next production build plus Node test runner

## Public Pages And Main Routes

- `/` - main Nischint app
- `/care` - caregiver information
- `/demo` - app walkthrough
- `/privacy` - privacy policy
- `/about` - about and roadmap
- `/contact` - contact page
- `/faq` - FAQ
- `/api/nischint/monitoring` - provider/care-state health
- `/api/nischint/production` - production readiness audit

## Important API Routes

- `/api/nischint/state`
- `/api/nischint/lost-mode`
- `/api/nischint/check-in`
- `/api/nischint/location`
- `/api/nischint/notify`
- `/api/nischint/voice-command`
- `/api/nischint/guidance`
- `/api/nischint/reminders`
- `/api/nischint/notes`
- `/api/nischint/consent`
- `/api/nischint/privacy`
- `/api/nischint/signup`
- `/api/nischint/login`
- `/api/nischint/logout`
- `/api/nischint/me`

## Run Locally

Clone or open the project folder:

```bash
cd /Users/Dell/Documents/Codex/2026-07-22/nischint
```

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Production-style local run:

```bash
npm run build
npm start
```

Run checks:

```bash
npm run lint
npm test
```

## Git Commands

Add and commit local changes:

```bash
git add .
git commit -m "Update Nischint showcase docs"
```

Push to GitHub:

```bash
git push
```

Vercel redeploys automatically after pushing to the connected `main` branch.

## Required Environment Variables For Best Showcase

Do not add blank env vars. Add only keys for which you have real values.

```env
DATABASE_URL=...
NISCHINT_SESSION_SECRET=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=...
VERIFIED_CAREGIVER_NUMBERS=+919210067119
GROQ_API_KEY=...
GROQ_TRANSCRIPTION_MODEL=whisper-large-v3-turbo
GEMINI_API_KEY=...
GEMINI_VOICE_MODEL=gemini-2.5-flash
```

Optional Supabase Auth:

```env
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

Optional WhatsApp:

```env
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_TEMPLATE_NAME=hello_world
WHATSAPP_TEMPLATE_LANGUAGE=en_US
```

For Meta's default `hello_world` template, do **not** set `WHATSAPP_TEMPLATE_HAS_BODY_PARAM`. Set it only when your approved custom template has one body variable:

```env
WHATSAPP_TEMPLATE_HAS_BODY_PARAM=true
```

Optional AI/provider tuning:

```env
AI_PROVIDER=groq
GROQ_GUIDANCE_MODEL=openai/gpt-oss-20b
GEMINI_GUIDANCE_MODEL=gemini-2.5-pro
GEMINI_LIVE_MODEL=gemini-2.5-flash-native-audio
GROQ_ORCHESTRATION_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
GROQ_SCREENSHOT_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
OPENROUTER_API_KEY=...
OPENROUTER_PLANNER_MODEL=best-available
OPENAI_API_KEY=...
```

## AI Capability Map

| Capability | Model | Provider |
| --- | --- | --- |
| Voice conversation + intent detection | `gemini-2.5-flash-native-audio` | Gemini Live WebSocket |
| Voice transcription for browser audio | `whisper-large-v3-turbo` | Groq REST API |
| Orchestration + content drafting | `meta-llama/llama-4-scout-17b-16e-instruct` | Groq REST API |
| Per-round action planning | `best-available` | OpenRouter REST API |
| Screenshot verification | `meta-llama/llama-4-scout-17b-16e-instruct` | Groq REST API |

## Vercel Deployment

Recommended settings:

- **Framework preset:** Next.js
- **Root directory:** `./`
- **Install command:** `npm install`
- **Build command:** `npm run build`
- **Output directory:** `.next`

After changing environment variables:

1. Go to Vercel project settings.
2. Add/update the env vars.
3. Go to Deployments.
4. Redeploy the latest deployment.
5. Check `/api/nischint/monitoring`.

## Showcase Test Flow

1. Open the live URL or local URL on mobile.
2. Login or create a caregiver account.
3. Choose English/Hindi and keep voice guidance on.
4. Tap **Voice command** and say “I feel lost”.
5. Confirm lost mode activates.
6. Tap **I am okay** to show a safe check-in.
7. Tap **Voice command** and say “dawa le li”.
8. Confirm medicine check-in is recorded.
9. Open Location, Reminders, Care circle, Notes, and Privacy tabs.
10. Open `/api/nischint/monitoring` to show backend/provider status.

## Docs

- [Production architecture](docs/PRODUCTION_ARCHITECTURE.md)
- [Technical implementation roadmap](docs/TECHNICAL_IMPLEMENTATION.md)
- [Privacy and legal review checklist](docs/PRIVACY_LEGAL_REVIEW.md)
- [Pilot test plan](docs/PILOT_TEST_PLAN.md)

## Production readiness And College Showcase Status

Nischint is ready for a college project showcase as a polished, working MVP. It demonstrates accessibility, AI, backend integration, SMS/WhatsApp provider hooks, caregiver authentication, privacy-first consent, and a meaningful real-world safety workflow.

## Safety Note

Nischint is not medical advice, an emergency-response service, or a replacement for professional care. For real-family production use, it still needs formal legal/privacy review, monitored emergency failure handling, WhatsApp business approval if WhatsApp is used, and field testing with real caregivers and older adults.
