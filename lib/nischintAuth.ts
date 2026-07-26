import { cookies } from "next/headers";

import { getCareState } from "./nischintStore";

const COOKIE_NAME = "nischint_session";
const DEMO_ACCESS_CODE = "2486";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;
const encoder = new TextEncoder();

export type CaregiverSession = {
  patientId: string;
  caregiverName: string;
  role: string;
  accessLevel: "owner" | "backup" | "clinical";
  issuedAt: number;
};

function getSessionSecret() {
  return (
    process.env.NISCHINT_SESSION_SECRET ??
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "nischint-local-demo-secret"
  );
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

export async function createCaregiverSession(accessCode: string, quickDemo = false) {
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
