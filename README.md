# Nischint

Nischint is a mobile-first dementia safety companion for moments of confusion.
It includes patient check-ins, lost-mode support, GPS sharing, caregiver alerts,
reminders, caregiver invites, accessibility controls, and provider-ready SMS,
WhatsApp, and AI guidance hooks.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy To Vercel

1. Push this folder to GitHub.
2. Import the repository in Vercel.
3. Keep the framework preset as `Next.js`.
4. Add environment variables from `.env.example` as needed.
5. Deploy.

## Custom Domain On Vercel

1. Buy or use a domain, such as `nischintcare.com`.
2. In Vercel, open the project.
3. Go to `Settings -> Domains`.
4. Add your domain or subdomain, such as `app.nischintcare.com`.
5. Follow Vercel's DNS instructions.
6. Wait for verification and SSL.

## Environment Variables

- `DATABASE_URL`: optional database connection for Neon, Supabase, or Vercel Postgres.
- `TWILIO_ACCOUNT_SID`: Twilio SMS account SID.
- `TWILIO_AUTH_TOKEN`: Twilio auth token.
- `TWILIO_FROM_NUMBER`: Twilio sender number.
- `WHATSAPP_ACCESS_TOKEN`: WhatsApp Cloud API token.
- `WHATSAPP_PHONE_NUMBER_ID`: WhatsApp sender phone number ID.
- `OPENAI_API_KEY`: AI guidance generation.

Without provider keys, Nischint still runs as a working prototype and simulates
delivery where appropriate.


## Demo Flow

1. Open Nischint on a phone-sized screen.
2. Press **I feel lost** to trigger lost mode.
3. Share live location and allow browser GPS permission.
4. Use SMS, WhatsApp, or Push to simulate caregiver notification.
5. Add a reminder and caregiver note.
6. Toggle large text or high contrast to show accessibility support.

## Production Readiness

Nischint is deployment-ready as a polished MVP. For real-world use, connect a production database, authentication provider, SMS/WhatsApp credentials, and privacy review before handling real patient data.
