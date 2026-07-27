import { cookies } from "next/headers";
import postgres from "postgres";

import { getCareState } from "./nischintStore";

const COOKIE_NAME = "nischint_session";
const DEMO_ACCESS_CODE = "2486";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;
const encoder = new TextEncoder();

type CaregiverAccount = {
  id: string;
  name: string;
  identifier: string;
  phone: string;
  role: string;
  accessLevel: "owner" | "backup" | "clinical";
  passwordHash: string;
  createdAt: string;
};

type SupabaseAuthUser = {
  id?: string;
  email?: string;
  phone?: string;
  user_metadata?: {
    name?: string;
    role?: string;
    accessLevel?: "owner" | "backup" | "clinical";
  };
};

type SupabaseAuthResponse = {
  access_token?: string;
  user?: SupabaseAuthUser;
  error?: string;
  msg?: string;
};

export type CaregiverSession = {
  patientId: string;
  caregiverName: string;
  role: string;
  accessLevel: "owner" | "backup" | "clinical";
  issuedAt: number;
};

const authStore = globalThis as typeof globalThis & {
  nischintAuthSql?: postgres.Sql;
  nischintAuthTableReady?: Promise<void>;
  nischintCaregiverAccounts?: CaregiverAccount[];
};

function getSessionSecret() {
  return (
    process.env.NISCHINT_SESSION_SECRET ??
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "nischint-local-demo-secret"
  );
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url?.trim() || !anonKey?.trim()) return null;
  return {
    url: url.replace(/\/$/, ""),
    anonKey,
  };
}

function getSql() {
  if (!process.env.DATABASE_URL?.trim()) return null;

  if (!authStore.nischintAuthSql) {
    authStore.nischintAuthSql = postgres(process.env.DATABASE_URL, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: process.env.DATABASE_URL.includes("sslmode=disable") ? false : "require",
    });
  }

  return authStore.nischintAuthSql;
}

async function ensureAccountTable(sql: postgres.Sql) {
  authStore.nischintAuthTableReady ??= sql`
    create table if not exists nischint_caregiver_accounts (
      id text primary key,
      patient_id text not null,
      name text not null,
      identifier text not null unique,
      phone text not null default '',
      role text not null,
      access_level text not null,
      password_hash text not null,
      created_at timestamptz not null default now()
    )
  `.then(() => undefined);
  await authStore.nischintAuthTableReady;
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

async function signPayload(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Buffer.from(signature).toString("base64url");
}

async function sealSession(session: CaregiverSession) {
  const payload = encodeBase64Url(JSON.stringify(session));
  const signature = await signPayload(payload);
  return `${payload}.${signature}`;
}

function normalizeIdentifier(identifier: string) {
  return identifier.trim().toLowerCase();
}

function accountMemoryStore() {
  authStore.nischintCaregiverAccounts ??= [];
  return authStore.nischintCaregiverAccounts;
}

async function hashPassword(password: string, salt = crypto.randomUUID()) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: encoder.encode(salt),
      iterations: 120000,
    },
    key,
    256
  );
  return `${salt}.${Buffer.from(bits).toString("base64url")}`;
}

async function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedHash] = passwordHash.split(".");
  if (!salt || !storedHash) return false;
  const nextHash = await hashPassword(password, salt);
  return nextHash === passwordHash;
}

async function setSessionFromAccount(account: {
  name: string;
  role: string;
  accessLevel: "owner" | "backup" | "clinical";
}) {
  const session: CaregiverSession = {
    patientId: getCareState().patientId,
    caregiverName: account.name,
    role: account.role,
    accessLevel: account.accessLevel,
    issuedAt: Date.now(),
  };
  const jar = await cookies();
  jar.set(COOKIE_NAME, await sealSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return session;
}

function identifierPayload(identifier: string) {
  return identifier.includes("@")
    ? { email: normalizeIdentifier(identifier) }
    : { phone: identifier.replace(/[^\d+]/g, "") };
}

function sessionProfileFromSupabase(
  fallbackName: string,
  user?: SupabaseAuthUser
) {
  return {
    name: user?.user_metadata?.name ?? fallbackName,
    role: user?.user_metadata?.role ?? "Primary caregiver",
    accessLevel: user?.user_metadata?.accessLevel ?? "owner",
  };
}

async function signupWithSupabase(payload: {
  name: string;
  identifier: string;
  phone?: string;
  password: string;
}) {
  const config = supabaseConfig();
  if (!config) return null;

  const response = await fetch(`${config.url}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      authorization: `Bearer ${config.anonKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      ...identifierPayload(payload.identifier),
      password: payload.password,
      data: {
        name: payload.name,
        phone: payload.phone,
        role: "Primary caregiver",
        accessLevel: "owner",
      },
    }),
  });

  const data = (await response.json().catch(() => ({}))) as SupabaseAuthResponse;
  if (!response.ok || data.error || data.msg) {
    return {
      ok: false as const,
      error: data.error ?? data.msg ?? "Supabase signup failed.",
    };
  }

  return {
    ok: true as const,
    session: await setSessionFromAccount(
      sessionProfileFromSupabase(payload.name, data.user)
    ),
  };
}

async function loginWithSupabase(identifier: string, password: string) {
  const config = supabaseConfig();
  if (!config || !identifier || !password) return null;

  const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      authorization: `Bearer ${config.anonKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      ...identifierPayload(identifier),
      password,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as SupabaseAuthResponse;
  if (!response.ok || !data.access_token) return null;

  return setSessionFromAccount(
    sessionProfileFromSupabase(identifier.split("@")[0] || "Caregiver", data.user)
  );
}

export async function createCaregiverAccount(payload: {
  name: string;
  identifier: string;
  phone?: string;
  password: string;
}) {
  const identifier = normalizeIdentifier(payload.identifier);
  const name = payload.name.trim();
  const phone = payload.phone?.trim() ?? "";

  if (!name || !identifier || payload.password.length < 8) {
    return {
      ok: false as const,
      error: "Enter a name, phone or email, and an 8+ character password.",
    };
  }

  const supabaseSignup = await signupWithSupabase({
    name,
    identifier,
    phone,
    password: payload.password,
  });
  if (supabaseSignup) return supabaseSignup;

  const account: CaregiverAccount = {
    id: crypto.randomUUID(),
    name,
    identifier,
    phone,
    role: "Primary caregiver",
    accessLevel: "owner",
    passwordHash: await hashPassword(payload.password),
    createdAt: new Date().toISOString(),
  };

  const sql = getSql();
  if (sql) {
    try {
      await ensureAccountTable(sql);
      await sql`
        insert into nischint_caregiver_accounts
          (id, patient_id, name, identifier, phone, role, access_level, password_hash, created_at)
        values
          (${account.id}, ${getCareState().patientId}, ${account.name}, ${account.identifier}, ${account.phone}, ${account.role}, ${account.accessLevel}, ${account.passwordHash}, ${account.createdAt})
      `;
      return { ok: true as const, session: await setSessionFromAccount(account) };
    } catch {
      return { ok: false as const, error: "Caregiver account already exists or could not be saved." };
    }
  }

  const accounts = accountMemoryStore();
  if (accounts.some((existing) => existing.identifier === identifier)) {
    return { ok: false as const, error: "Caregiver account already exists." };
  }
  accounts.push(account);
  return { ok: true as const, session: await setSessionFromAccount(account) };
}

async function findCaregiverAccount(identifier: string) {
  const normalized = normalizeIdentifier(identifier);
  const sql = getSql();

  if (sql) {
    await ensureAccountTable(sql);
    const rows = await sql<{
      name: string;
      role: string;
      access_level: "owner" | "backup" | "clinical";
      password_hash: string;
    }[]>`
      select name, role, access_level, password_hash
      from nischint_caregiver_accounts
      where identifier = ${normalized}
      limit 1
    `;
    const row = rows[0];
    if (!row) return null;
    return {
      name: row.name,
      role: row.role,
      accessLevel: row.access_level,
      passwordHash: row.password_hash,
    };
  }

  return accountMemoryStore().find((account) => account.identifier === normalized) ?? null;
}

async function unsealSession(value: string | undefined) {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expectedSignature = await signPayload(payload);
  if (signature !== expectedSignature) return null;

  try {
    const session = JSON.parse(decodeBase64Url(payload)) as CaregiverSession;
    const isExpired = Date.now() - session.issuedAt > SESSION_MAX_AGE_SECONDS * 1000;
    return isExpired ? null : session;
  } catch {
    return null;
  }
}

export async function createCaregiverSession(
  accessCode: string,
  quickDemo = false,
  credentials?: { identifier?: string; password?: string }
) {
  if (credentials?.identifier && credentials.password) {
    const supabaseSession = await loginWithSupabase(
      credentials.identifier,
      credentials.password
    );
    if (supabaseSession) return supabaseSession;

    const account = await findCaregiverAccount(credentials.identifier);
    if (account && await verifyPassword(credentials.password, account.passwordHash)) {
      return setSessionFromAccount(account);
    }
  }

  if (!quickDemo && accessCode.trim() !== DEMO_ACCESS_CODE) return null;

  const state = getCareState();
  const caregiver =
    state.contacts.find((contact) => contact.accessLevel === "owner") ?? state.contacts[0];
  const session: CaregiverSession = {
    patientId: "demo-patient",
    caregiverName: caregiver?.name ?? "Asha",
    role: caregiver?.role ?? "Primary caregiver",
    accessLevel: caregiver?.accessLevel ?? "owner",
    issuedAt: Date.now(),
  };
  const jar = await cookies();
  jar.set(COOKIE_NAME, await sealSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return session;
}

export async function getCaregiverSession() {
  const jar = await cookies();
  return unsealSession(jar.get(COOKIE_NAME)?.value);
}

export async function clearCaregiverSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
