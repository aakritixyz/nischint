import { sendCareNotification } from "../../../../lib/nischintProviders";
import { persistNotificationDelivery } from "../../../../lib/nischintPersistence";
import {
  getCareState,
  recordNotificationDelivery,
  simulateNotification,
} from "../../../../lib/nischintStore";

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

  simulateNotification(payload.channel);
  const delivery = await sendCareNotification(payload.channel, getCareState());
  const state = recordNotificationDelivery(
    payload.channel,
    delivery.delivered,
    delivery.detail
  );
  await persistNotificationDelivery(state);

  return Response.json({
    state,
    delivery: delivery.detail,
    delivered: delivery.delivered,
  });
}
