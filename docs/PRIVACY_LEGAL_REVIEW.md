# Nischint Privacy And Legal Review Checklist

Nischint handles sensitive care, location, and family-contact information. This checklist is a pre-launch review artifact for pilots and college evaluation. It is not legal advice; a real deployment should be reviewed by a qualified privacy/legal professional.

## Consent And Transparency

- Confirm the senior or authorized family member understands what data is collected.
- Separate consent for live location, emergency-card visibility, caregiver access, and voice features.
- Show who can see location and emergency notes inside the app.
- Provide a clear way to pause consent and request export or deletion.

## Data Collected

- Senior profile: name, language, home address, emergency note, calming message, safe-zone settings.
- Care circle: caregiver names, roles, phone/email, alert permissions, access level.
- Safety activity: check-ins, lost mode, reminders, notes, location status, alerts, consent logs.
- Technical data: session cookie, provider delivery status, monitoring events.

## Third Parties

- Twilio for SMS alerts.
- WhatsApp Cloud API for WhatsApp alerts when approved.
- Browser geolocation, speech synthesis, speech recognition, vibration, and notifications.
- Groq, Gemini, OpenRouter, or OpenAI for optional calm guidance.
- Vercel and database provider for hosting and storage.

## Legal Review Topics

- GDPR, India's DPDP Act, and HIPAA-adjacent safeguards where applicable.
- Location-data retention limits and deletion timelines.
- Emergency disclaimer wording and escalation limitations.
- Caregiver account authorization and revocation.
- Third-party data processing agreements.
- Incident response process for failed alerts or unauthorized access.

## Minimum Pilot Approval

- Use only volunteers and test contacts.
- Do not enter real medical records beyond a minimal emergency note.
- Keep verified phone numbers limited to pilot caregivers.
- Explain that Nischint is care-support software, not emergency dispatch.
- Record pilot feedback without exposing private health/location data.
