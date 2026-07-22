import { persistPrivacyRequest } from "../../../../lib/nischintPersistence";
import { getCareState, queuePrivacyRequest } from "../../../../lib/nischintStore";

export async function GET() {
  const state = getCareState();
  return Response.json({
    export: {
      patient: state.patient,
      location: state.location,
      contacts: state.contacts,
      reminders: state.reminders,
      notes: state.notes,
      events: state.events,
    },
  });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    type?: "export" | "delete";
  } | null;

  if (payload?.type !== "export" && payload?.type !== "delete") {
    return Response.json(
      { error: "type must be export or delete" },
      { status: 400 }
    );
  }

  const state = queuePrivacyRequest(payload.type);
  await persistPrivacyRequest(state, payload.type);

  return Response.json({ state });
}
