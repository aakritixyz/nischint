import { createCaregiverSession } from "../../../../lib/nischintAuth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const accessCode = String(body.accessCode ?? "");
  const quickDemo = Boolean(body.quickDemo);
  const session = await createCaregiverSession(accessCode, quickDemo);

  if (!session) {
    return Response.json(
      { authenticated: false, error: "Invalid demo access code" },
      { status: 401 }
    );
  }

  return Response.json({ authenticated: true, session });
}
