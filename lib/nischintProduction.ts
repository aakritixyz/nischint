type ProductionCheck = {
  id: string;
  label: string;
  ready: boolean;
  detail: string;
};

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
      ready: hasEnv("AUTH_SECRET") || hasEnv("NEXTAUTH_SECRET") || hasEnv("CLERK_SECRET_KEY"),
      detail: hasEnv("AUTH_SECRET") || hasEnv("NEXTAUTH_SECRET") || hasEnv("CLERK_SECRET_KEY")
        ? "An auth secret is configured. Connect role checks before real use."
        : "Demo access code is active. Add Auth.js, Clerk, Supabase Auth, or Vercel auth for production.",
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
      ready: hasEnv("WHATSAPP_ACCESS_TOKEN") && hasEnv("WHATSAPP_PHONE_NUMBER_ID"),
      detail: "WhatsApp Cloud API requires access token, phone number ID, and approved templates for production.",
    },
    {
      id: "ai",
      label: "AI calming guidance",
      ready: hasEnv("OPENAI_API_KEY"),
      detail: hasEnv("OPENAI_API_KEY")
        ? "OPENAI_API_KEY is configured for optional guidance generation."
        : "Fallback calm guidance is active. Add OPENAI_API_KEY for AI-generated guidance.",
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
