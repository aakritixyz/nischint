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
  assert.match(page, /Set up gentle support before entering/);
  assert.match(page, /Step 1 of 3/);
  assert.match(page, /Demo mode/);
  assert.match(page, /Family login/);
  assert.match(page, /Already set up/);
  assert.match(page, /type="password"/);
  assert.match(page, /Use demo code 2486/);
  assert.match(page, /enterNischint\("demo", false\)/);
  assert.match(page, /enterNischint\("senior", true\)/);
  assert.match(page, /Skip to quick demo/);
  assert.match(page, /Voice comfort/);
  assert.match(page, /Calm/);
  assert.match(page, /Energetic/);
  assert.match(page, /Consent stays visible/);
  assert.match(page, /Next: open the Senior tab/);
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
  assert.match(page, /Consent audit/);
  assert.match(page, /updateConsent/);
  assert.match(page, /Caregiver access code/);
  assert.match(page, /contactPhone/);
  assert.match(page, /signalRail/);
  assert.match(page, /हिंदी/);
  assert.match(page, /SpeechSynthesisUtterance/);
  assert.match(page, /webkitSpeechRecognition/);
  assert.match(page, /commandIntent/);
  assert.match(page, /I did not understand that/);
  assert.match(page, /wakeLock/);
  assert.match(page, /activateLostMode/);
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
  assert.match(styles, /careIllustration/);
  assert.match(styles, /setupProgress/);
  assert.match(styles, /comfortGroup/);
  assert.match(styles, /welcomeVoiceGroup/);
  assert.match(styles, /stickyEmergency/);
  assert.match(styles, /tabPanel\[hidden\]/);
  assert.match(styles, /tabRail/);
  assert.match(styles, /timelineCard/);
  assert.match(styles, /auditGrid/);
  assert.match(styles, /readinessMeter/);
  assert.match(styles, /contactPhone/);
  assert.match(styles, /white-space: nowrap/);
  assert.match(styles, /max-width: 420px/);
  assert.match(styles, /content-visibility/);
  assert.match(serviceWorker, /nischint-offline-v3/);
});

test("production hardening backend pieces exist", async () => {
  const [
    productionRoute,
    consentRoute,
    loginRoute,
    logoutRoute,
    meRoute,
    authLib,
    persistenceLib,
    providersLib,
    productionLib,
    store,
    schema,
    readme,
    packageJson,
  ] = await Promise.all([
    readProjectFile("app/api/nischint/production/route.ts"),
    readProjectFile("app/api/nischint/consent/route.ts"),
    readProjectFile("app/api/nischint/login/route.ts"),
    readProjectFile("app/api/nischint/logout/route.ts"),
    readProjectFile("app/api/nischint/me/route.ts"),
    readProjectFile("lib/nischintAuth.ts"),
    readProjectFile("lib/nischintPersistence.ts"),
    readProjectFile("lib/nischintProviders.ts"),
    readProjectFile("lib/nischintProduction.ts"),
    readProjectFile("lib/nischintStore.ts"),
    readProjectFile("db/schema.ts"),
    readProjectFile("README.md"),
    readProjectFile("package.json"),
  ]);

  assert.match(productionRoute, /getProductionAudit/);
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
  assert.match(providersLib, /api\.groq\.com/);
  assert.match(providersLib, /generativelanguage\.googleapis\.com/);
  assert.match(providersLib, /meta-llama\/llama-4-scout-17b-16e-instruct/);
  assert.match(providersLib, /gemini-2\.5-pro/);
  assert.match(productionLib, /DATABASE_URL/);
  assert.match(productionLib, /NISCHINT_SESSION_SECRET/);
  assert.match(productionLib, /GROQ_API_KEY/);
  assert.match(productionLib, /GEMINI_API_KEY/);
  assert.match(productionLib, /TWILIO_ACCOUNT_SID/);
  assert.match(packageJson, /"postgres"/);
  assert.match(store, /accessLevel/);
  assert.match(store, /hydrateCareState/);
  assert.match(store, /consentLog/);
  assert.match(schema, /consentLogs/);
  assert.match(readme, /Production readiness/);
  assert.match(readme, /signed session/);
  assert.match(readme, /Groq/);
  assert.match(readme, /Gemini/);
});
