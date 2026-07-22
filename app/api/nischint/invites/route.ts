import { persistInvite } from "../../../../lib/nischintPersistence";
import { inviteCaregiver } from "../../../../lib/nischintStore";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    name?: string;
    phoneOrEmail?: string;
    role?: string;
  } | null;

  if (!payload?.name?.trim() || !payload.phoneOrEmail?.trim()) {
    return Response.json(
      { error: "name and phoneOrEmail are required" },
      { status: 400 }
    );
  }

  const invite = {
    name: payload.name.trim(),
    phoneOrEmail: payload.phoneOrEmail.trim(),
    role: payload.role?.trim() || "Caregiver",
  };
  const state = inviteCaregiver(invite);
  await persistInvite(state, invite);

  return Response.json({ state });
}
