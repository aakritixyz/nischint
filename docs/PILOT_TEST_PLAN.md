# Nischint Pilot Test Plan

Use this plan before showing Nischint to real families or judges. The goal is to verify that the app is understandable, mobile-friendly, and honest about alert delivery.

## Pilot Scope

- 2-3 caregiver volunteers.
- 1-2 senior-facing testers using a phone-sized screen.
- Test with sample data first.
- Use only verified SMS/WhatsApp recipients.

## Test Scenarios

1. Create a caregiver account.
2. Login with the caregiver account.
3. Press **I feel lost** and confirm lost mode appears.
4. Share live location and deny GPS once to verify the failure message.
5. Send SMS and WhatsApp alerts with verified and unverified numbers.
6. Add a medicine reminder.
7. Add a caregiver note.
8. Toggle location and emergency-card consent.
9. Request data export and deletion.
10. Check `/api/nischint/monitoring` for delivery failures and provider health.

## Pass Criteria

- Main actions are reachable in one or two taps on mobile.
- Touch targets feel large enough for older adults.
- No provider failure is shown as successful delivery.
- The Privacy tab clearly explains what family can see.
- Voice guidance can be turned off before entering the app.
- A caregiver can understand the latest alert without reading the whole page.

## Issues To Record

- Confusing text.
- Button too small or too close to another button.
- Voice command misunderstood.
- GPS permission unclear.
- Alert delivery failure.
- Slow page load.
- Anything that causes panic or uncertainty.

## Final Pilot Decision

Do not use with real care situations until verified alert delivery, caregiver authorization, consent records, and emergency fallback instructions are reviewed and tested.
