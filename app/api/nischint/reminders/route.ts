import { persistReminder } from "../../../../lib/nischintPersistence";
import { addReminder } from "../../../../lib/nischintStore";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    title?: string;
    time?: string;
    category?: "medicine" | "appointment" | "routine";
    escalationMinutes?: number;
  } | null;

  if (!payload?.title?.trim() || !payload.time?.trim()) {
    return Response.json(
      { error: "title and time are required" },
      { status: 400 }
    );
  }

  const reminder = {
    title: payload.title.trim(),
    time: payload.time.trim(),
    category: payload.category ?? "routine",
    escalationMinutes: payload.escalationMinutes ?? 15,
  };
  const state = addReminder(reminder);
  await persistReminder(state, reminder);

  return Response.json({ state });
}
