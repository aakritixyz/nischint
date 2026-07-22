import { setLostMode } from "../../../../lib/nischintStore";
import { persistLostMode } from "../../../../lib/nischintPersistence";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    active?: boolean;
  } | null;

  if (typeof payload?.active !== "boolean") {
    return Response.json(
      { error: "active must be a boolean" },
      { status: 400 }
    );
  }

  const state = setLostMode(payload.active);
  await persistLostMode(state, payload.active);

  return Response.json({ state });
}
