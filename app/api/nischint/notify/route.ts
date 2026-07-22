import { sendCareNotification } from "../../../../lib/nischintProviders";
import { getCareState } from "../../../../lib/nischintStore";
import { simulateNotification } from "../../../../lib/nischintStore";

const channels = new Set(["sms", "whatsapp", "push"]);

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    channel?: "sms" | "whatsapp" | "push";
  } | null;

  if (!payload?.channel || !channels.has(payload.channel)) {
    return Response.json(
      { error: "channel must be sms, whatsapp, or push" },
      { status: 400 }
    );
  }

  const state = simulateNotification(payload.channel);
  const delivery = await sendCareNotification(payload.channel, getCareState());

  return Response.json({
    state,
    delivery: delivery.detail,
    delivered: delivery.delivered,
  });
}
