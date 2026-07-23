# Nischint

**Nischint** means *carefree* or *peace of mind*. This project is a mobile-first dementia safety companion designed for moments when an older adult feels confused, lost, or unable to explain what they need.

Instead of being only a memory-preservation app, Nischint focuses on real-time support: helping the person stay calm, helping family understand what is happening, and making emergency actions simple enough to use under stress.

## Why This Matters

Dementia can make ordinary situations suddenly unsafe. A person may forget where they are, struggle to call family, miss medicine, wander outside a safe area, or panic because they cannot remember what to do next.

Nischint is built around one core idea:

> During confusion, the app should reduce decisions, not add more.

The patient-facing side keeps actions large, gentle, and direct. The caregiver-facing side gives family the context they need quickly: location status, check-ins, emergency info, reminders, notes, and alert history.

## Core Use Case

When a person feels lost, they can press **I feel lost**. Nischint then demonstrates a safety flow that can:

1. Turn on lost mode.
2. Show calming guidance.
3. Surface the saved home address and medical context.
4. Share live location after browser permission.
5. Queue a caregiver alert through simulated or real providers.
6. Update the caregiver view with safe-zone and event status.

## Features Built

### Patient View

- Big **I feel lost** emergency button
- **I am okay**, **I need help**, and **I took medicine** check-ins
- Saved home address and current location label
- Emergency medical information card
- One-tap caregiver call link
- Calming family voice-message simulation
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

### Backend/API Routes

Nischint includes Next.js API routes for:

- Care state: `/api/nischint/state`
- Lost mode: `/api/nischint/lost-mode`
- Check-ins: `/api/nischint/check-in`
- Location updates: `/api/nischint/location`
- Notifications: `/api/nischint/notify`
- Guidance: `/api/nischint/guidance`
- Onboarding: `/api/nischint/onboarding`
- Notes: `/api/nischint/notes`
- Reminders: `/api/nischint/reminders`
- Invites: `/api/nischint/invites`
- Privacy requests: `/api/nischint/privacy`

Without provider keys, the app still works as a polished demo and simulates delivery. With real credentials, the provider layer is ready to connect to SMS, WhatsApp, and AI guidance.

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **UI:** React, CSS, Tailwind entry setup
- **Persistence shape:** Drizzle schema included
- **Deployment:** Vercel-ready
- **PWA:** Web app manifest and service worker
- **Providers:** Twilio SMS, WhatsApp Cloud API, and OpenAI guidance hooks

## Demo Flow

1. Open the app on a phone-sized screen.
2. Press **I feel lost**.
3. Watch the patient view enter help mode.
4. Press **Share live location** and allow GPS permission.
5. Send a simulated SMS, WhatsApp, or push alert.
6. Toggle **Large text** or **High contrast**.
7. Add a reminder and caregiver note.
8. Show the caregiver live view and event history.

This makes the project easy to explain in a presentation:

> Nischint supports people with dementia during moments of confusion by giving them simple guidance, family contact, live location sharing, and real-time caregiver alerts.

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
| `TWILIO_ACCOUNT_SID` | Twilio account SID for SMS alerts |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_FROM_NUMBER` | Twilio sender number |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp Cloud API token |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp sender phone number ID |
| `OPENAI_API_KEY` | Optional AI-generated calming guidance |

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

## Important Safety Note

Nischint is currently a polished MVP for demos, portfolios, and judged project presentations. It is not medical advice, an emergency-response service, or a replacement for professional care.

Before using it with real families, the project needs:

1. Secure production database storage.
2. Authentication and caregiver roles.
3. Verified caregiver phone numbers.
4. Real SMS/WhatsApp provider credentials.
5. Consent-based location sharing.
6. Privacy and health-data compliance review.
7. Clear emergency escalation policies.
8. Field testing with caregivers and accessibility feedback from older adults.

## Future Improvements

- Caregiver login and family-specific dashboards
- Real persistent patient profiles
- Medication adherence escalation
- Safer geofencing with configurable zones
- Audio recording/upload for real family voice notes
- Multilingual patient guidance in Hindi and English
- Caregiver notification preferences
- Admin audit logs and consent history
- Better offline emergency card support

## Project Status

Nischint is ready to deploy as a meaningful MVP. It demonstrates the full care flow clearly, has a professional mobile-first interface, and includes backend routes for the main safety actions.
