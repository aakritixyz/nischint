import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, root), "utf8");
}

test("Nischint page contains the launch-ready product experience", async () => {
  const page = await readProjectFile("app/page.tsx");

  assert.match(page, /Nischint/);
  assert.match(page, /Step 1 of 3/);
  assert.match(page, /Demo mode/);
  assert.match(page, /Start setup/);
  assert.match(page, /Already set up/);
  assert.match(page, /type="password"/);
  assert.match(page, /Use demo code 2486/);
  assert.match(page, /enterNischint\("demo", false\)/);
  assert.match(page, /enterNischint\("senior", true\)/);
  assert.match(page, /Skip to quick demo/);
  assert.match(page, /aria-pressed={language === "en"}/);
  assert.match(page, /aria-pressed={onboardingVoiceAssist}/);
  assert.match(page, /aria-pressed={voiceTone === tone.id}/);
  assert.match(page, /Voice comfort/);
  assert.match(page, /Calm/);
  assert.match(page, /Energetic/);
  assert.match(page, /Consent stays visible/);
  assert.match(page, /tabRail/);
  assert.match(page, /role="tab"/);
  assert.match(page, /Main safety screen/);
  assert.match(page, /nischint-has-entered/);
  assert.match(page, /caregiverSession/);
  assert.match(page, /api\/nischint\/login/);
  assert.match(page, /api\/nischint\/logout/);
  assert.match(page, /Signed in as/);
  assert.match(page, /Keep voice guidance on/);
  assert.match(page, /Use buttons only/);
  assert.match(page, /Elder safety & family care/);
  assert.match(page, /I feel lost/);
  assert.match(page, /Emergency/);
  assert.match(page, /Simulate emergency/);
  assert.match(page, /Reset demo/);
  assert.match(page, /Offline mode/);
  assert.match(page, /Escalation timeline/);
  assert.match(page, /Three calm steps/);
  assert.match(page, /Family FAQ/);
  assert.match(page, /Preferences/);
  assert.match(page, /screenAnnouncement/);
  assert.match(page, /Share live location/);
  assert.match(page, /Consent-first design/);
  assert.match(page, /Demo-ready, not medical advice/);
  assert.match(page, /Production safety layer/);
  assert.match(page, /productionAudit/);
  assert.match(page, /Production readiness checklist/);
  assert.match(page, /Production architecture roadmap/);
  assert.match(page, /Senior app, family dashboard, admin portal/);
  assert.match(page, /api\/nischint\/architecture/);
  assert.match(page, /Consent audit/);
  assert.match(page, /updateConsent/);
  assert.match(page, /Caregiver access code/);
  assert.match(page, /contactPhone/);
  assert.match(page, /AI Care Assistant/);
  assert.match(page, /Generated calm support/);
  assert.match(page, /Regenerate guidance/);
  assert.match(page, /Read AI guidance/);
  assert.match(page, /Why this suggestion/);
  assert.match(page, /aiCapabilities/);
  assert.match(page, /signalRail/);
  assert.match(page, /हिंदी/);
  assert.match(page, /SpeechSynthesisUtterance/);
  assert.match(page, /webkitSpeechRecognition/);
  assert.match(page, /commandIntent/);
  assert.match(page, /I did not understand that/);
  assert.match(page, /wakeLock/);
  assert.match(page, /activateLostMode/);
  assert.doesNotMatch(page, /Groq, Gemini, and OpenRouter power calm support/);
  assert.doesNotMatch(page, /Lost-mode support/);
  assert.doesNotMatch(page, /Choose the language and voice comfort level first/);
  assert.doesNotMatch(page, /Choose simple preferences before opening Nischint/);
  assert.doesNotMatch(page, /CareAnchor|Making Every Memory Matter|SkeletonPreview/);
});

test("metadata and PWA manifest are branded for Nischint", async () => {
  const [layout, manifestText, styles, serviceWorker] = await Promise.all([
    readProjectFile("app/layout.tsx"),
    readProjectFile("public/manifest.webmanifest"),
    readProjectFile("app/globals.css"),
    readProjectFile("public/sw.js"),
  ]);
  const manifest = JSON.parse(manifestText);

  assert.match(layout, /Nischint | Elder Safety Companion/);
  assert.match(layout, /openGraph/);
  assert.equal(manifest.name, "Nischint");
  assert.equal(manifest.theme_color, "#8f6f7d");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.orientation, "portrait-primary");
  assert.match(manifest.description, /Bilingual/);
  assert.match(styles, /Bilingual voice assistance/);
  assert.match(styles, /heroWordmark/);
  assert.match(styles, /assistPanel/);
  assert.match(styles, /welcomeGate/);
  assert.match(styles, /welcomeMeta/);
  assert.match(styles, /loginCard/);
  assert.match(styles, /loginHeader/);
  assert.match(styles, /loginError/);
  assert.match(styles, /setupProgress/);
  assert.match(styles, /comfortGroup/);
  assert.match(styles, /welcomeVoiceGroup/);
  assert.doesNotMatch(styles, /welcomeLiveStack/);
  assert.doesNotMatch(styles, /welcomeSignalStrip/);
  assert.match(styles, /stickyEmergency/);
  assert.match(styles, /tabPanel\[hidden\]/);
  assert.match(styles, /tabRail/);
  assert.match(styles, /timelineCard/);
  assert.match(styles, /auditGrid/);
  assert.match(styles, /readinessMeter/);
  assert.match(styles, /contactPhone/);
  assert.match(styles, /aiCareCard/);
  assert.match(styles, /aiCapabilityRow/);
  assert.match(styles, /aiActionRow/);
  assert.match(styles, /architectureCard/);
  assert.match(styles, /white-space: nowrap/);
  assert.match(styles, /max-width: 420px/);
  assert.match(styles, /content-visibility/);
  assert.match(serviceWorker, /nischint-offline-v3/);
});

test("production hardening backend pieces exist", async () => {
  const [
    productionRoute,
    architectureRoute,
    aiCapabilitiesRoute,
    consentRoute,
    loginRoute,
    logoutRoute,
    meRoute,
    authLib,
    persistenceLib,
    providersLib,
    productionLib,
    architectureLib,
    store,
    schema,
    architectureDoc,
    technicalDoc,
    readme,
    packageJson,
  ] = await Promise.all([
    readProjectFile("app/api/nischint/production/route.ts"),
    readProjectFile("app/api/nischint/architecture/route.ts"),
    readProjectFile("app/api/nischint/ai-capabilities/route.ts"),
    readProjectFile("app/api/nischint/consent/route.ts"),
    readProjectFile("app/api/nischint/login/route.ts"),
    readProjectFile("app/api/nischint/logout/route.ts"),
    readProjectFile("app/api/nischint/me/route.ts"),
    readProjectFile("lib/nischintAuth.ts"),
    readProjectFile("lib/nischintPersistence.ts"),
    readProjectFile("lib/nischintProviders.ts"),
    readProjectFile("lib/nischintProduction.ts"),
    readProjectFile("lib/nischintArchitecture.ts"),
    readProjectFile("lib/nischintStore.ts"),
    readProjectFile("db/schema.ts"),
    readProjectFile("docs/PRODUCTION_ARCHITECTURE.md"),
    readProjectFile("docs/TECHNICAL_IMPLEMENTATION.md"),
    readProjectFile("README.md"),
    readProjectFile("package.json"),
  ]);

  assert.match(productionRoute, /getProductionAudit/);
  assert.match(architectureRoute, /productionArchitecture/);
  assert.match(aiCapabilitiesRoute, /getAiCapabilityMap/);
  assert.match(consentRoute, /recordConsent/);
  assert.match(loginRoute, /createCaregiverSession/);
  assert.match(logoutRoute, /clearCaregiverSession/);
  assert.match(meRoute, /getCaregiverSession/);
  assert.match(authLib, /nischint_session/);
  assert.match(authLib, /crypto\.subtle/);
  assert.match(authLib, /httpOnly/);
  assert.match(persistenceLib, /postgres/);
  assert.match(persistenceLib, /nischint_care_state/);
  assert.match(persistenceLib, /jsonb/);
  assert.match(persistenceLib, /hydrateCareState/);
  assert.match(providersLib, /GROQ_API_KEY/);
  assert.match(providersLib, /GEMINI_API_KEY/);
  assert.match(providersLib, /OPENROUTER_API_KEY/);
  assert.match(providersLib, /gemini-2\.5-flash-native-audio/);
  assert.match(providersLib, /llama-4-maverick/);
  assert.match(providersLib, /OPENROUTER_PLANNER_MODEL/);
  assert.match(providersLib, /GROQ_SCREENSHOT_MODEL/);
  assert.match(providersLib, /api\.groq\.com/);
  assert.match(providersLib, /generativelanguage\.googleapis\.com/);
  assert.match(providersLib, /meta-llama\/llama-4-scout-17b-16e-instruct/);
  assert.match(providersLib, /gemini-2\.5-pro/);
  assert.match(productionLib, /DATABASE_URL/);
  assert.match(productionLib, /NISCHINT_SESSION_SECRET/);
  assert.match(productionLib, /GROQ_API_KEY/);
  assert.match(productionLib, /GEMINI_API_KEY/);
  assert.match(productionLib, /OPENROUTER_API_KEY/);
  assert.match(productionLib, /Advanced AI capability map/);
  assert.match(productionLib, /TWILIO_ACCOUNT_SID/);
  assert.match(architectureLib, /Senior App/);
  assert.match(architectureLib, /Family Dashboard/);
  assert.match(architectureLib, /AWS Mumbai/);
  assert.match(architectureLib, /React Native/);
  assert.match(architectureLib, /React Query/);
  assert.match(architectureLib, /Prisma Migrate/);
  assert.match(architectureLib, /GDPR/);
  assert.match(architectureLib, /99\.99% emergency-service target/);
  assert.match(packageJson, /"postgres"/);
  assert.match(store, /accessLevel/);
  assert.match(store, /hydrateCareState/);
  assert.match(store, /consentLog/);
  assert.match(schema, /consentLogs/);
  assert.match(architectureDoc, /Target Multi-App Architecture/);
  assert.match(architectureDoc, /Senior UX Guardrails/);
  assert.match(architectureDoc, /Technical Implementation Direction/);
  assert.match(technicalDoc, /Technical Implementation Roadmap/);
  assert.match(technicalDoc, /React Native 0\.73/);
  assert.match(technicalDoc, /Twilio SMS/);
  assert.match(technicalDoc, /WCAG 2\.1 AAA/);
  assert.match(technicalDoc, /RPO 5 minutes/);
  assert.match(readme, /Production readiness/);
  assert.match(readme, /PRODUCTION_ARCHITECTURE/);
  assert.match(readme, /TECHNICAL_IMPLEMENTATION/);
  assert.match(readme, /signed session/);
  assert.match(readme, /Groq/);
  assert.match(readme, /Gemini/);
  assert.match(readme, /OpenRouter/);
  assert.match(readme, /Gemini Live WebSocket/);
  assert.match(readme, /Screenshot verification/);
});
