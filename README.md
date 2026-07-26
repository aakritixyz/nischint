# Nischint

**Nischint** means *carefree* or *peace of mind*. This project is a mobile-first elder safety and family care companion designed for moments when an older adult feels confused, lost, unwell, or unable to explain what they need.

Instead of being only a memory-preservation app, Nischint focuses on real-time support: helping the person stay calm, helping family understand what is happening, and making emergency actions simple enough to use under stress.

## Why This Matters

Older adults can face moments when ordinary situations become unexpectedly unsafe. A person may feel disoriented, struggle to call family, miss medicine, move beyond a familiar area, or need support without being able to explain what is wrong.

Nischint is built around one core idea:

> During confusion, the app should reduce decisions, not add more.

The senior-facing side keeps actions large, gentle, and direct. The caregiver-facing side gives family the context they need quickly: location status, check-ins, emergency info, reminders, notes, and alert history.

## Core Use Case

When a person feels lost, they can press **I feel lost**. Nischint then demonstrates a safety flow that can:

1. Turn on lost mode.
2. Show calming guidance.
3. Surface the saved home address and medical context.
4. Share live location after browser permission.
5. Queue a caregiver alert through simulated or real providers.
6. Update the caregiver view with safe-zone and event status.

## Features Built

### Senior View

- First-screen setup for name, family access code, language, and voice preference
- Big **I feel lost** emergency button
- **I am okay**, **I need help**, and **I took medicine** check-ins
- Saved home address and current location label
- Emergency medical information card
- One-tap caregiver call link
- Real device read-aloud for the current safety screen
- English/Hindi interface and spoken guidance toggle
- Voice commands for lost mode, okay check-ins, and medicine confirmation
- Spoken family reassurance, haptic feedback, and screen wake lock during lost mode
- Large text and high contrast accessibility controls
- Mobile-first layout with large touch targets

### Caregiver View

- Live alert status
- Safe-zone map demo
- Caregiver contact list
- Reminder creation
- Caregiver invite flow
- Family handoff notes
- Recent event history
- Privacy export/delete request demo
- Consent toggles for location and emergency-card visibility
- Caregiver access-code concept
- Caregiver access levels for owner, backup, and clinical contacts
- Consent audit log for privacy-sensitive sharing changes
- Production readiness checklist for database, auth, alerts, AI, privacy, and geofence setup
- Escalation ladder for primary, backup, and doctor/neighbor handoff

### Backend/API Routes

Nischint includes Next.js API routes for:

- Care state: `/api/nischint/state`
- Lost mode: `/api/nischint/lost-mode`
- Check-ins: `/api/nischint/check-in`
- Location updates: `/api/nischint/location`
- Notifications: `/api/nischint/notify`
- Guidance: `/api/nischint/guidance`
- AI capability map: `/api/nischint/ai-capabilities`
- Onboarding: `/api/nischint/onboarding`
- Notes: `/api/nischint/notes`
- Reminders: `/api/nischint/reminders`
- Invites: `/api/nischint/invites`
- Privacy requests: `/api/nischint/privacy`
- Consent audit: `/api/nischint/consent`
- Production readiness: `/api/nischint/production`

Without provider keys, the app still works as a polished demo and simulates delivery. With real credentials, the provider layer is ready to connect to SMS, WhatsApp, and AI guidance.

## Voice And Language Accessibility

The app now starts with a simple setup screen instead of forcing voice features immediately. A family member or senior can choose English/Hindi and decide whether voice guidance should be on or whether the app should use buttons only.

The senior screen can still switch between English and Hindi and stores that preference on the device. **Listen** reads the person's name, current location, saved home address, and help instruction aloud when voice guidance is enabled. **Speak** listens for clear commands such as “I feel lost,” “I need help,” “I am okay,” “I took medicine,” “मुझे मदद चाहिए,” “घर,” or “मैं ठीक हूं.”

Voice commands intentionally use a stricter matcher so random words like “live” do not trigger lost mode. If the browser hears something unclear, Nischint shows what it heard and asks the person to try a simpler phrase. Automatic voice guidance speaks after emergency and check-in actions only when voice support is enabled. During lost mode, supported phones also vibrate and request a screen wake lock so the instructions remain visible.

Read-aloud uses the browser's speech synthesis. Voice-command availability depends on browser support and may use the browser vendor's speech service, so production privacy notices should explain that behavior.

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **UI:** React, CSS, Tailwind entry setup
- **Persistence shape:** Drizzle schema included
- **Production audit:** Environment-aware readiness endpoint
- **Deployment:** Vercel-ready
- **PWA:** Web app manifest and service worker
- **Providers:** Twilio SMS, WhatsApp Cloud API, Groq, Gemini, and OpenAI guidance hooks

## Demo Flow

1. Open the app on a phone-sized screen.
2. Choose the senior name, language, and whether voice guidance should be on.
3. Enter with the demo access code **2486**.
4. Press **I feel lost**.
5. Watch the senior view enter help mode.
6. Press **Share live location** and allow GPS permission.
7. Send a simulated SMS, WhatsApp, or push alert.
8. Switch between **English** and **Hindi**, then use **Listen** to hear the safety screen.
9. Press **Speak** and say a clear help or check-in command.
10. Add a reminder, caregiver note, and show the caregiver live view.

This makes the project easy to explain in a presentation:

> Nischint supports older adults during vulnerable moments by giving them simple guidance, family contact, location sharing, reminders, and real-time caregiver alerts.

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

For a production-style local check:

```bash
npm run build
npm start
```

## Test

```bash
npm test
```

This runs a production build and verifies the Nischint-branded launch content, metadata, and PWA manifest.

## Deploy To Vercel

1. Push this folder to GitHub.
2. Import the repository in Vercel.
3. Keep the framework preset as **Next.js**.
4. Leave environment variables empty for the demo deployment.
5. Add real environment variables only when connecting real providers.
6. Deploy.

Recommended Vercel settings:

- Root Directory: `./`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `.next`

## Environment Variables

All environment variables are optional for the demo deployment. Do not add blank variables in Vercel; add a key only when you have a real value.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Production database connection, such as Neon, Supabase, or Vercel Postgres |
| `NISCHINT_SESSION_SECRET` | Secret used to sign caregiver demo sessions |
| `TWILIO_ACCOUNT_SID` | Twilio account SID for SMS alerts |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_FROM_NUMBER` | Twilio sender number |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp Cloud API token |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp sender phone number ID |
| `GROQ_API_KEY` | Groq key for fast model-generated calming guidance |
| `GEMINI_API_KEY` | Gemini key for enrichment/model-generated calming guidance |
| `OPENROUTER_API_KEY` | OpenRouter key for configurable per-round action planning |
| `OPENAI_API_KEY` | Optional OpenAI fallback for model-generated calming guidance |
| `AI_PROVIDER` | Optional preference: `groq`, `gemini`, or `openai` |
| `GROQ_GUIDANCE_MODEL` | Optional Groq guidance model override, default `openai/gpt-oss-20b` |
| `GEMINI_GUIDANCE_MODEL` | Optional Gemini guidance model override, default `gemini-2.5-pro` |
| `GEMINI_LIVE_MODEL` | Optional voice conversation model, default `gemini-2.5-flash-native-audio` |
| `GROQ_ORCHESTRATION_MODEL` | Optional Groq drafting/orchestration model, default `meta-llama/llama-4-scout-17b-16e-instruct` |
| `GROQ_SCREENSHOT_MODEL` | Optional Groq multimodal verification model, default `meta-llama/llama-4-scout-17b-16e-instruct` |
| `OPENROUTER_PLANNER_MODEL` | Optional OpenRouter planning model, default `best-available` |

Suggested AI model map:

| Role | Model |
| --- | --- |
| Analysis | `meta-llama/llama-4-scout-17b-16e-instruct` |
| Design | `openai/gpt-oss-20b` |
| Code generation | `openai/gpt-oss-120b` |
| Optimization | `deepseek-r1-distill-llama-70b` |
| Enrichment | `gemini-2.5-pro` |

Advanced AI capability map:

| Capability | Model | Provider |
| --- | --- | --- |
| Voice conversation + intent detection | `gemini-2.5-flash-native-audio` | Gemini Live WebSocket |
| Orchestration + content drafting | `llama-4-scout` / `llama-4-maverick` | Groq REST API |
| Per-round action planning | Configurable, default best available | OpenRouter REST API |
| Screenshot verification | `llama-4-scout` multimodal | Groq REST API |

## Custom Domain

The free Vercel domain may look like:

```text
nischint-rho.vercel.app
```

That happens when `nischint.vercel.app` is already unavailable. For a cleaner public URL, buy or connect a custom domain such as:

```text
nischintcare.com
app.nischintcare.com
nischint.life
```

Then add it in Vercel under **Project Settings -> Domains** and follow the DNS instructions.

## Production Hardening Added

Nischint now includes a production-readiness layer that checks whether the deployment has durable storage, auth secrets, SMS, WhatsApp, and AI guidance configured. The UI shows which pieces are ready and what still needs provider setup.

The data model includes caregiver access levels, alert permissions, radius-based safe-zone logic, privacy requests, and consent logs. Consent toggles call a backend route so sharing changes appear in the care activity timeline.

When `DATABASE_URL` is configured, Nischint creates a `nischint_care_state` Postgres table and persists the live care profile, check-ins, reminders, notes, location status, privacy requests, and consent history as JSON state. Without `DATABASE_URL`, it safely falls back to in-memory demo state.

The family login now creates a signed session cookie through `/api/nischint/login`, restores it through `/api/nischint/me`, and clears it through `/api/nischint/logout`. The default demo code is `2486`; set `NISCHINT_SESSION_SECRET` in Vercel so demo sessions are signed with a private production value.

AI guidance prefers Groq by default when `GROQ_API_KEY` exists, then Gemini when `GEMINI_API_KEY` exists, then OpenAI when `OPENAI_API_KEY` exists. Set `AI_PROVIDER=gemini` or `AI_PROVIDER=openai` if you want to force a different first choice. The `/api/nischint/ai-capabilities` endpoint reports whether voice conversation, orchestration, planning, and screenshot verification providers are configured.

## Important Safety Note

Nischint is currently a polished MVP for demos, portfolios, and judged project presentations. It is not medical advice, an emergency-response service, or a replacement for professional care.

Before using it with real families, the project still needs:

1. Secure production database storage.
2. Full caregiver accounts through Auth.js, Clerk, Supabase Auth, or Vercel auth.
3. Verified caregiver phone numbers.
4. Real SMS/WhatsApp provider credentials.
5. Legal/privacy review for consent-based location sharing.
6. Privacy and health-data compliance review.
7. Clear emergency escalation policies.
8. Field testing with caregivers and accessibility feedback from older adults.

## Future Improvements

- Caregiver login and family-specific dashboards
- Real persistent care profiles
- Medication adherence escalation
- Production safe-zone distance logic with configurable zones
- Audio recording/upload for personalized family voice notes
- Additional regional languages and dialect testing
- Caregiver notification preferences
- Admin audit logs and consent history
- Better offline emergency card support

## Project Status

Nischint is ready to deploy as a meaningful, voice-assisted MVP. It demonstrates the care flow clearly, has a professional mobile-first interface, English/Hindi senior guidance, installable offline support, visible production-safety concepts, and backend routes for the main safety actions. Real-family use still requires production accounts, verified providers, security review, and field testing.
