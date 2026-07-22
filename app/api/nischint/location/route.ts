import { updateLocation } from "../../../../lib/nischintStore";
import { persistLocation } from "../../../../lib/nischintPersistence";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    label?: string;
    latitude?: number | null;
    longitude?: number | null;
    safeZoneStatus?: "inside" | "outside";
    batteryLevel?: number | null;
    networkStatus?: "online" | "offline" | "weak";
  } | null;

  if (!payload) {
    return Response.json({ error: "Invalid location payload" }, { status: 400 });
  }

  const state = updateLocation(payload);
  await persistLocation(state, payload);

  return Response.json({ state });
}
