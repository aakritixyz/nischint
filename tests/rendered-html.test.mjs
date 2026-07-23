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
  assert.match(page, /Elder safety & family care/);
  assert.match(page, /I feel lost/);
  assert.match(page, /Share live location/);
  assert.match(page, /Consent-first design/);
  assert.match(page, /Demo-ready, not medical advice/);
  assert.match(page, /Production safety layer/);
  assert.match(page, /Caregiver access code/);
  assert.match(page, /signalRail/);
  assert.doesNotMatch(page, /CareAnchor|Making Every Memory Matter|SkeletonPreview/);
});

test("metadata and PWA manifest are branded for Nischint", async () => {
  const [layout, manifestText] = await Promise.all([
    readProjectFile("app/layout.tsx"),
    readProjectFile("public/manifest.webmanifest"),
  ]);
  const manifest = JSON.parse(manifestText);

  assert.match(layout, /Nischint | Elder Safety Companion/);
  assert.match(layout, /openGraph/);
  assert.equal(manifest.name, "Nischint");
  assert.equal(manifest.theme_color, "#8f6f7d");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.orientation, "portrait-primary");
});
