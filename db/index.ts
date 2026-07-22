export function getDatabaseUrl() {
  return process.env.DATABASE_URL ?? null;
}

export function requireDatabaseUrl() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not configured. Add Neon, Supabase, or Vercel Postgres on Vercel to enable durable persistence."
    );
  }

  return databaseUrl;
}
