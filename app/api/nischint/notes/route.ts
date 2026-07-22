import { addCaregiverNote } from "../../../../lib/nischintStore";
import { persistCaregiverNote } from "../../../../lib/nischintPersistence";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    note?: string;
    author?: string;
  } | null;

  const note = payload?.note?.trim();

  if (!note) {
    return Response.json({ error: "note is required" }, { status: 400 });
  }

  const state = addCaregiverNote(note, payload?.author?.trim() || "Caregiver");
  await persistCaregiverNote(state, note);

  return Response.json({ state });
}
