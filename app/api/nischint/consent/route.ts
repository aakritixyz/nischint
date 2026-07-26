import { recordConsent } from "../../../../lib/nischintStore";
import { persistConsent } from "../../../../lib/nischintPersistence";

const scopes = new Set(["location", "emergency-card", "caregiver-access"]);

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    scope?: "location" | "emergency-card" | "caregiver-access";
    allowed?: boolean;
    actor?: string;
  } | null;

  if (!payload?.scope || !scopes.has(payload.scope) || typeof payload.allowed !== "boolean") {
    return Response.json(
      { error: "scope must be location, emergency-card, or caregiver-access and allowed must be boolean" },
      { status: 400 }
    );
  }

  const state = recordConsent(payload.scope, payload.allowed, payload.actor ?? "Asha");
  await persistConsent(state);

  return Response.json({ state });
}
