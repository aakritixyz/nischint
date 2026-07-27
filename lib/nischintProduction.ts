type ProductionCheck = {
  id: string;
  label: string;
  ready: boolean;
  detail: string;
};

function aiReady() {
  return (
    hasEnv("GROQ_API_KEY") ||
    hasEnv("GEMINI_API_KEY") ||
    hasEnv("OPENROUTER_API_KEY") ||
    hasEnv("OPENAI_API_KEY")
  );
}

function advancedAiReady() {
  return hasEnv("GROQ_API_KEY") && hasEnv("GEMINI_API_KEY") && hasEnv("OPENROUTER_API_KEY");
}

function supabaseAuthReady() {
  return (
    (hasEnv("SUPABASE_URL") || hasEnv("NEXT_PUBLIC_SUPABASE_URL")) &&
    (hasEnv("SUPABASE_ANON_KEY") || hasEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"))
  );
}

function hasEnv(key: string) {
  return Boolean(process.env[key]?.trim());
}

export function getProductionAudit() {
  const checks: ProductionCheck[] = [
    {
      id: "database",
      label: "Durable database",
      ready: hasEnv("DATABASE_URL"),
      detail: hasEnv("DATABASE_URL")
        ? "DATABASE_URL is configured for persistent care state."
        : "Demo state is in memory. Add Neon, Supabase, or Vercel Postgres for real families.",
    },
    {
      id: "auth",
      label: "Caregiver authentication",
      ready:
        hasEnv("NISCHINT_SESSION_SECRET") ||
        hasEnv("AUTH_SECRET") ||
        hasEnv("NEXTAUTH_SECRET") ||
        hasEnv("CLERK_SECRET_KEY") ||
        supabaseAuthReady(),
      detail:
        hasEnv("NISCHINT_SESSION_SECRET") ||
        hasEnv("AUTH_SECRET") ||
        hasEnv("NEXTAUTH_SECRET") ||
        hasEnv("CLERK_SECRET_KEY") ||
        supabaseAuthReady()
          ? "Caregiver authentication is configured with signed sessions and optional Supabase Auth."
          : "Demo access code is active. Add NISCHINT_SESSION_SECRET and SUPABASE_URL/SUPABASE_ANON_KEY for production.",
    },
    {
      id: "sms",
      label: "Verified SMS alerts",
      ready:
        hasEnv("TWILIO_ACCOUNT_SID") &&
        hasEnv("TWILIO_AUTH_TOKEN") &&
        hasEnv("TWILIO_FROM_NUMBER"),
      detail: "Twilio requires account SID, auth token, sender number, and verified caregiver numbers.",
    },
    {
      id: "whatsapp",
      label: "WhatsApp alerts",
      ready:
        hasEnv("WHATSAPP_ACCESS_TOKEN") &&
        hasEnv("WHATSAPP_PHONE_NUMBER_ID") &&
        hasEnv("WHATSAPP_TEMPLATE_NAME"),
      detail: "WhatsApp Cloud API requires access token, phone number ID, verified recipients, and an approved template name for production.",
    },
    {
      id: "ai",
      label: "AI calming guidance",
      ready: aiReady(),
      detail: aiReady()
        ? "Groq, Gemini, OpenRouter, or OpenAI guidance credentials are configured."
        : "Fallback calm guidance is active. Add GROQ_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY, or OPENAI_API_KEY.",
    },
    {
      id: "advanced-ai",
      label: "Advanced AI capability map",
      ready: advancedAiReady(),
      detail: advancedAiReady()
        ? "Voice, orchestration, planning, and screenshot verification providers are configured."
        : "Add GEMINI_API_KEY, GROQ_API_KEY, and OPENROUTER_API_KEY to unlock the full AI stack.",
    },
    {
      id: "privacy",
      label: "Consent and audit trail",
      ready: true,
      detail: "The app records consent actions, privacy requests, and caregiver events in the care timeline.",
    },
    {
      id: "geofence",
      label: "Safe-zone distance logic",
      ready: true,
      detail: "Location updates use radius-based distance checks when home/safe-zone coordinates exist.",
    },
  ];

  const readyCount = checks.filter((check) => check.ready).length;

  return {
    mode: readyCount >= checks.length - 1 ? "production-ready" : "demo-hardened",
    readyCount,
    totalCount: checks.length,
    checks,
    nextSteps: checks
      .filter((check) => !check.ready)
      .map((check) => check.detail)
      .slice(0, 4),
  };
}
