import { getCaregiverSession } from "../../../../lib/nischintAuth";

export async function GET() {
  const session = await getCaregiverSession();

  return Response.json({
    authenticated: Boolean(session),
    session,
    authModel:
      "Signed caregiver session cookie for the Nischint demo. Add Auth.js, Clerk, Supabase Auth, or Vercel auth before real-family production use.",
  });
}
