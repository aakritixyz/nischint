import {
  type CheckIn,
  recordCheckIn,
} from "../../../../lib/nischintStore";
import { persistCheckIn } from "../../../../lib/nischintPersistence";

const allowedCheckIns = new Set<CheckIn>(["ok", "help", "medicine"]);

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    checkIn?: CheckIn;
  } | null;

  if (!payload?.checkIn || !allowedCheckIns.has(payload.checkIn)) {
    return Response.json(
      { error: "checkIn must be ok, help, or medicine" },
      { status: 400 }
    );
  }

  const state = recordCheckIn(payload.checkIn);
  await persistCheckIn(state, payload.checkIn);

  return Response.json({ state });
}
