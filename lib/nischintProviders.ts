import type { CareState } from "./nischintStore";

type ProviderEnv = {
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM_NUMBER?: string;
  WHATSAPP_ACCESS_TOKEN?: string;
  WHATSAPP_PHONE_NUMBER_ID?: string;
  OPENAI_API_KEY?: string;
};

function providerEnv() {
  return {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_FROM_NUMBER: process.env.TWILIO_FROM_NUMBER,
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  } satisfies ProviderEnv;
}

export async function sendCareNotification(
  channel: "sms" | "whatsapp" | "push",
  state: CareState
) {
  const caregiver = state.contacts[0];
  const message = `Nischint alert: ${state.patient.name} may need help near ${state.location.label}. Home: ${state.patient.homeAddress}.`;

  if (channel === "sms") {
    return sendSms(caregiver?.phone ?? "", message);
  }

  if (channel === "whatsapp") {
    return sendWhatsApp(caregiver?.phone ?? "", message);
  }

  return {
    delivered: false,
    detail: "Browser push is requested on the client; server push credentials are not configured.",
  };
}

async function sendSms(to: string, body: string) {
  const vars = providerEnv();
  if (!vars.TWILIO_ACCOUNT_SID || !vars.TWILIO_AUTH_TOKEN || !vars.TWILIO_FROM_NUMBER) {
    return {
      delivered: false,
      detail: "SMS simulated. Add Twilio env vars for real delivery.",
    };
  }

  const auth = btoa(`${vars.TWILIO_ACCOUNT_SID}:${vars.TWILIO_AUTH_TOKEN}`);
  const form = new URLSearchParams({
    To: to,
    From: vars.TWILIO_FROM_NUMBER,
    Body: body,
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${vars.TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        authorization: `Basic ${auth}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: form,
    }
  );

  return {
    delivered: response.ok,
    detail: response.ok ? "SMS sent through Twilio." : "Twilio SMS request failed.",
  };
}

async function sendWhatsApp(to: string, body: string) {
  const vars = providerEnv();
  if (!vars.WHATSAPP_ACCESS_TOKEN || !vars.WHATSAPP_PHONE_NUMBER_ID) {
    return {
      delivered: false,
      detail: "WhatsApp simulated. Add WhatsApp Cloud API env vars for real delivery.",
    };
  }

  const response = await fetch(
    `https://graph.facebook.com/v21.0/${vars.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${vars.WHATSAPP_ACCESS_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    }
  );

  return {
    delivered: response.ok,
    detail: response.ok
      ? "WhatsApp message sent through Cloud API."
      : "WhatsApp message request failed.",
  };
}

export async function generateGuidanceWithAi(prompt: string) {
  const vars = providerEnv();
  if (!vars.OPENAI_API_KEY) return null;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${vars.OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: prompt,
      max_output_tokens: 180,
    }),
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as {
    output_text?: string;
  };
  return payload.output_text ?? null;
}
