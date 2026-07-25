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
  assert.match(page, /nischint-has-entered/);
  assert.match(page, /Keep voice guidance on/);
  assert.match(page, /Use buttons only/);
  assert.match(page, /Elder safety & family care/);
  assert.match(page, /I feel lost/);
  assert.match(page, /Share live location/);
  assert.match(page, /Consent-first design/);
  assert.match(page, /Demo-ready, not medical advice/);
  assert.match(page, /Production safety layer/);
  assert.match(page, /Caregiver access code/);
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
  assert.match(styles, /welcomeVoiceGroup/);
  assert.match(serviceWorker, /nischint-offline-v3/);
});
