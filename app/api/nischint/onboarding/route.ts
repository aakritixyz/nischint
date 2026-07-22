import {
  type CareContact,
  type PatientProfile,
  updateOnboarding,
} from "../../../../lib/nischintStore";
import { persistOnboarding } from "../../../../lib/nischintPersistence";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    patient?: Partial<PatientProfile>;
    contacts?: CareContact[];
  } | null;

  if (!payload) {
    return Response.json({ error: "Invalid onboarding payload" }, { status: 400 });
  }

  const state = updateOnboarding(payload);
  await persistOnboarding(state);

  return Response.json({ state });
}
