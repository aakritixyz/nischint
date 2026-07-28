import type { CareState } from "./nischintStore";

type ProviderEnv = {
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM_NUMBER?: string;
  WHATSAPP_ACCESS_TOKEN?: string;
  WHATSAPP_PHONE_NUMBER_ID?: string;
  WHATSAPP_TEMPLATE_NAME?: string;
  WHATSAPP_TEMPLATE_LANGUAGE?: string;
  WHATSAPP_TEMPLATE_HAS_BODY_PARAM?: string;
  VERIFIED_CAREGIVER_NUMBERS?: string;
  OPENAI_API_KEY?: string;
  GROQ_API_KEY?: string;
  GEMINI_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  AI_PROVIDER?: string;
  GROQ_GUIDANCE_MODEL?: string;
  GEMINI_GUIDANCE_MODEL?: string;
  GEMINI_VOICE_MODEL?: string;
  GEMINI_LIVE_MODEL?: string;
  GROQ_ORCHESTRATION_MODEL?: string;
  GROQ_SCREENSHOT_MODEL?: string;
  OPENROUTER_PLANNER_MODEL?: string;
};

type VoiceIntent = "lost" | "ok" | "help" | "medicine";

const aiModelPlan = {
  analysis: "meta-llama/llama-4-scout-17b-16e-instruct",
  orchestration: "meta-llama/llama-4-scout-17b-16e-instruct",
  maverick: "meta-llama/llama-4-maverick-17b-128e-instruct",
  design: "openai/gpt-oss-20b",
  codeGeneration: "openai/gpt-oss-120b",
  optimization: "deepseek-r1-distill-llama-70b",
  enrichment: "gemini-2.5-pro",
  voiceConversation: "gemini-2.5-flash-native-audio",
  screenshotVerification: "meta-llama/llama-4-scout-17b-16e-instruct",
  actionPlanning: "best-available",
};

function providerEnv() {
  return {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_FROM_NUMBER: process.env.TWILIO_FROM_NUMBER,
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_TEMPLATE_NAME: process.env.WHATSAPP_TEMPLATE_NAME,
    WHATSAPP_TEMPLATE_LANGUAGE: process.env.WHATSAPP_TEMPLATE_LANGUAGE,
    WHATSAPP_TEMPLATE_HAS_BODY_PARAM: process.env.WHATSAPP_TEMPLATE_HAS_BODY_PARAM,
    VERIFIED_CAREGIVER_NUMBERS: process.env.VERIFIED_CAREGIVER_NUMBERS,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    AI_PROVIDER: process.env.AI_PROVIDER,
    GROQ_GUIDANCE_MODEL: process.env.GROQ_GUIDANCE_MODEL,
    GEMINI_GUIDANCE_MODEL: process.env.GEMINI_GUIDANCE_MODEL,
    GEMINI_VOICE_MODEL: process.env.GEMINI_VOICE_MODEL,
    GEMINI_LIVE_MODEL: process.env.GEMINI_LIVE_MODEL,
    GROQ_ORCHESTRATION_MODEL: process.env.GROQ_ORCHESTRATION_MODEL,
    GROQ_SCREENSHOT_MODEL: process.env.GROQ_SCREENSHOT_MODEL,
    OPENROUTER_PLANNER_MODEL: process.env.OPENROUTER_PLANNER_MODEL,
  } satisfies ProviderEnv;
}

function normalizeVoiceText(value: string) {
  return value
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectVoiceIntentFromText(text: string): VoiceIntent | null {
  const phrase = normalizeVoiceText(text);
  const lostWords = [
    "i feel lost",
    "i am lost",
    "im lost",
    "lost",
    "where am i",
    "take me home",
    "go home",
    "home",
    "ghar",
    "ghar jana",
    "ghar jaana",
    "mujhe ghar jana",
    "mujhe ghar jaana",
    "rasta nahi mil raha",
    "raasta nahi mil raha",
    "mujhe rasta nahi mil raha",
    "mujhe raasta nahi mil raha",
    "kho gaya",
    "kho gayi",
    "gum gaya",
    "gum gayi",
    "रास्ता",
    "घर",
    "खो",
    "गुम",
  ];
  const helpWords = [
    "help",
    "help me",
    "need help",
    "i need help",
    "emergency",
    "call family",
    "call asha",
    "madad",
    "mujhe madad chahiye",
    "मदद",
    "सहायता",
    "आपात",
  ];
  const medicineWords = [
    "medicine",
    "tablet",
    "pill",
    "took medicine",
    "i took medicine",
    "medicine done",
    "dawa",
    "dawai",
    "dava",
    "dawa le li",
    "dawai le li",
    "dawa kha li",
    "दवा",
    "गोली",
  ];
  const okayWords = [
    "okay",
    "ok",
    "i am okay",
    "i am safe",
    "safe",
    "fine",
    "theek",
    "theek hu",
    "theek hoon",
    "main theek",
    "mai theek",
    "sab theek",
    "ठीक",
    "सुरक्षित",
  ];

  if (lostWords.some((word) => phrase.includes(word))) return "lost";
  if (helpWords.some((word) => phrase.includes(word))) return "help";
  if (medicineWords.some((word) => phrase.includes(word))) return "medicine";
  if (okayWords.some((word) => phrase.includes(word))) return "ok";

  return null;
}

function geminiRestVoiceModel(vars: ProviderEnv) {
  const configuredModel = vars.GEMINI_VOICE_MODEL?.trim();
  if (!configuredModel || configuredModel.includes("native-audio")) {
    return "gemini-2.5-flash";
  }
  return configuredModel;
}

export function getAiCapabilityMap() {
  const vars = providerEnv();
  return [
    {
      id: "voice-conversation",
      label: "Voice conversation + intent detection",
      model: vars.GEMINI_LIVE_MODEL ?? aiModelPlan.voiceConversation,
      provider: "Gemini Live WebSocket",
      ready: Boolean(vars.GEMINI_API_KEY),
      env: ["GEMINI_API_KEY", "GEMINI_LIVE_MODEL"],
    },
    {
      id: "orchestration-content",
      label: "Orchestration + content drafting",
      model: vars.GROQ_ORCHESTRATION_MODEL ?? aiModelPlan.orchestration,
      provider: "Groq REST API",
      ready: Boolean(vars.GROQ_API_KEY),
      env: ["GROQ_API_KEY", "GROQ_ORCHESTRATION_MODEL"],
    },
    {
      id: "action-planning",
      label: "Per-round action planning",
      model: vars.OPENROUTER_PLANNER_MODEL ?? aiModelPlan.actionPlanning,
      provider: "OpenRouter REST API",
      ready: Boolean(vars.OPENROUTER_API_KEY),
      env: ["OPENROUTER_API_KEY", "OPENROUTER_PLANNER_MODEL"],
    },
    {
      id: "screenshot-verification",
      label: "Screenshot verification",
      model: vars.GROQ_SCREENSHOT_MODEL ?? aiModelPlan.screenshotVerification,
      provider: "Groq REST API",
      ready: Boolean(vars.GROQ_API_KEY),
      env: ["GROQ_API_KEY", "GROQ_SCREENSHOT_MODEL"],
    },
  ];
}

export async function sendCareNotification(
  channel: "sms" | "whatsapp" | "push",
  state: CareState
) {
  const caregiver = state.contacts.find((contact) => contact.canReceiveAlerts) ?? state.contacts[0];
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

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function isVerifiedRecipient(to: string, vars: ProviderEnv) {
  const allowedNumbers = vars.VERIFIED_CAREGIVER_NUMBERS?.split(",")
    .map((number) => normalizePhone(number.trim()))
    .filter(Boolean);

  if (!allowedNumbers?.length) {
    return {
      ok: false,
      detail: "Recipient verification list missing. Add VERIFIED_CAREGIVER_NUMBERS before real SMS/WhatsApp delivery.",
    };
  }

  return allowedNumbers.includes(normalizePhone(to))
    ? { ok: true, detail: "Recipient is verified." }
    : {
        ok: false,
        detail: "Recipient number is not in VERIFIED_CAREGIVER_NUMBERS.",
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
  const recipientCheck = isVerifiedRecipient(to, vars);
  if (!recipientCheck.ok) {
    return {
      delivered: false,
      detail: `SMS blocked: ${recipientCheck.detail}`,
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
  const recipientCheck = isVerifiedRecipient(to, vars);
  if (!recipientCheck.ok) {
    return {
      delivered: false,
      detail: `WhatsApp blocked: ${recipientCheck.detail}`,
    };
  }

  const templateHasBodyParam =
    vars.WHATSAPP_TEMPLATE_HAS_BODY_PARAM === "true" ||
    (Boolean(vars.WHATSAPP_TEMPLATE_NAME) && vars.WHATSAPP_TEMPLATE_NAME !== "hello_world");
  const templatePayload = vars.WHATSAPP_TEMPLATE_NAME
    ? {
        type: "template",
        template: {
          name: vars.WHATSAPP_TEMPLATE_NAME,
          language: {
            code: vars.WHATSAPP_TEMPLATE_LANGUAGE ?? "en_US",
          },
          ...(templateHasBodyParam
            ? {
                components: [
                  {
                    type: "body",
                    parameters: [{ type: "text", text: body }],
                  },
                ],
              }
            : {}),
        },
      }
    : {
        type: "text",
        text: { body },
      };

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
        to: normalizePhone(to).replace(/^\+/, ""),
        ...templatePayload,
      }),
    }
  );

  return {
    delivered: response.ok,
    detail: response.ok
      ? "WhatsApp message sent through Cloud API."
      : vars.WHATSAPP_TEMPLATE_NAME
        ? "WhatsApp template request failed. Check template name, language, parameters, and approval."
        : "WhatsApp text request failed. Use an approved template for production/outside the 24-hour window.",
  };
}

export async function generateGuidanceWithAi(prompt: string) {
  const vars = providerEnv();
  const providerPreference = vars.AI_PROVIDER?.toLowerCase();

  if (providerPreference === "gemini") {
    return (
      (await generateWithGemini(prompt, vars)) ??
      (await generateWithGroq(prompt, vars)) ??
      (await generateWithOpenAi(prompt, vars))
    );
  }

  if (providerPreference === "openai") {
    return (
      (await generateWithOpenAi(prompt, vars)) ??
      (await generateWithGroq(prompt, vars)) ??
      (await generateWithGemini(prompt, vars))
    );
  }

  return (
    (await generateWithGroq(prompt, vars)) ??
    (await generateWithGemini(prompt, vars)) ??
    (await generateWithOpenAi(prompt, vars))
  );
}

export async function detectVoiceIntentWithAi(input: {
  audioBase64: string;
  mimeType: string;
  language: "en" | "hi";
}) {
  const vars = providerEnv();
  if (!vars.GEMINI_API_KEY) {
    return {
      intent: null,
      transcript: "",
      detail: "Gemini voice intent detection is not configured.",
    };
  }

  const model = geminiRestVoiceModel(vars);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${vars.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "You are Nischint's elder safety voice detector. First transcribe the short voice command, then classify the user intent. " +
                  "Return compact JSON only with keys intent and transcript. intent must be exactly one of: lost, ok, help, medicine, unknown. " +
                  "Accept English, Hindi, and Hinglish. Be forgiving of accents and noisy phone audio. " +
                  "lost means the person is confused about location or wants home: 'I feel lost', 'where am I', 'mujhe ghar jana hai', 'raasta nahi mil raha', 'main kho gayi'. " +
                  "help means they need a caregiver but may not be lost: 'I need help', 'help me', 'mujhe madad chahiye', 'call Asha'. " +
                  "ok means safe/check-in: 'I am okay', 'I am safe', 'main theek hoon', 'sab theek hai'. " +
                  "medicine means medicine taken: 'I took medicine', 'dawa le li', 'goli kha li'. " +
                  "Prefer the closest safety intent instead of unknown unless the audio is empty or unrelated.",
              },
              {
                inlineData: {
                  mimeType: input.mimeType || "audio/webm",
                  data: input.audioBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 120,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    return {
      intent: null,
      transcript: "",
      detail: "Gemini voice command request failed.",
    };
  }

  const payload = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  let parsed: { intent?: string; transcript?: string } = {};
  try {
    parsed = JSON.parse(text) as { intent?: string; transcript?: string };
  } catch {
    parsed = { intent: "unknown", transcript: text };
  }
  const allowed = new Set(["lost", "ok", "help", "medicine"]);
  const transcript = parsed.transcript ?? "";
  const fallbackIntent = detectVoiceIntentFromText(transcript);
  return {
    intent: parsed.intent && allowed.has(parsed.intent)
      ? parsed.intent
      : fallbackIntent,
    transcript,
    detail: "Voice command processed with Gemini.",
  };
}

async function generateWithGroq(prompt: string, vars: ProviderEnv) {
  if (!vars.GROQ_API_KEY) return null;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${vars.GROQ_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: vars.GROQ_GUIDANCE_MODEL ?? aiModelPlan.design,
      messages: [
        {
          role: "system",
          content:
            "You write calm, short, safety-first guidance for older adults and caregivers. Avoid diagnosis, medical advice, panic, and long paragraphs.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.35,
      max_tokens: 180,
    }),
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return payload.choices?.[0]?.message?.content?.trim() ?? null;
}

async function generateWithGemini(prompt: string, vars: ProviderEnv) {
  if (!vars.GEMINI_API_KEY) return null;

  const model = vars.GEMINI_GUIDANCE_MODEL ?? aiModelPlan.enrichment;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${vars.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Write calm, short, safety-first guidance for an elder safety app. Avoid diagnosis and medical advice.\n\n${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 180,
        },
      }),
    }
  );

  if (!response.ok) return null;

  const payload = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
}

async function generateWithOpenAi(prompt: string, vars: ProviderEnv) {
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

export function getAiProviderSummary() {
  const vars = providerEnv();
  const readyCapabilities = getAiCapabilityMap().filter((capability) => capability.ready).length;
  if (vars.GROQ_API_KEY) {
    return `Groq ready with ${vars.GROQ_GUIDANCE_MODEL ?? aiModelPlan.design}. ${readyCapabilities}/4 AI capabilities configured.`;
  }
  if (vars.GEMINI_API_KEY) {
    return `Gemini ready with ${vars.GEMINI_GUIDANCE_MODEL ?? aiModelPlan.enrichment}. ${readyCapabilities}/4 AI capabilities configured.`;
  }
  if (vars.OPENAI_API_KEY) {
    return "OpenAI ready for optional calming guidance.";
  }
  return "Fallback calm guidance is active. Add GROQ_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY, or OPENAI_API_KEY.";
}

export function getProviderHealth() {
  const vars = providerEnv();
  return {
    sms: {
      configured: Boolean(vars.TWILIO_ACCOUNT_SID && vars.TWILIO_AUTH_TOKEN && vars.TWILIO_FROM_NUMBER),
      verifiedRecipients: Boolean(vars.VERIFIED_CAREGIVER_NUMBERS?.trim()),
    },
    whatsapp: {
      configured: Boolean(vars.WHATSAPP_ACCESS_TOKEN && vars.WHATSAPP_PHONE_NUMBER_ID),
      verifiedRecipients: Boolean(vars.VERIFIED_CAREGIVER_NUMBERS?.trim()),
      templateConfigured: Boolean(vars.WHATSAPP_TEMPLATE_NAME?.trim()),
    },
    ai: {
      configured: Boolean(vars.GROQ_API_KEY || vars.GEMINI_API_KEY || vars.OPENROUTER_API_KEY || vars.OPENAI_API_KEY),
      readyCapabilities: getAiCapabilityMap().filter((capability) => capability.ready).length,
    },
  };
}
