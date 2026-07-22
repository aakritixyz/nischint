import { loadPersistedState } from "../../../../lib/nischintPersistence";

export async function GET() {
  return Response.json({ state: await loadPersistedState() });
}
