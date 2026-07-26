import { clearCaregiverSession } from "../../../../lib/nischintAuth";

export async function POST() {
  await clearCaregiverSession();
  return Response.json({ authenticated: false });
}
