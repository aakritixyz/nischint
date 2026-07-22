import type { CareState, CheckIn, LocationState } from "./nischintStore";
import { getCareState } from "./nischintStore";

type PersistableReminder = {
  title: string;
  time: string;
  category: string;
  escalationMinutes: number;
};

type PersistableInvite = {
  name: string;
  phoneOrEmail: string;
  role: string;
};

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

async function bestEffort(_operation: string, _payload: unknown) {
  if (!hasDatabaseUrl()) return;

  // Vercel deployment note:
  // Add Neon/Supabase/Vercel Postgres client code here once DATABASE_URL is set.
  // The current app remains fully usable as a demo without crashing in serverless.
}

export async function loadPersistedState() {
  return getCareState();
}

export async function persistOnboarding(state: CareState) {
  await bestEffort("onboarding", state);
}

export async function persistCheckIn(state: CareState, checkIn: CheckIn) {
  await bestEffort("check-in", { patientId: state.patientId, checkIn });
}

export async function persistLostMode(state: CareState, active: boolean) {
  await bestEffort("lost-mode", { patientId: state.patientId, active });
}

export async function persistLocation(
  state: CareState,
  location: Partial<LocationState>
) {
  await bestEffort("location", { patientId: state.patientId, location });
}

export async function persistCaregiverNote(state: CareState, note: string) {
  await bestEffort("caregiver-note", { patientId: state.patientId, note });
}

export async function persistReminder(
  state: CareState,
  reminder: PersistableReminder
) {
  await bestEffort("reminder", { patientId: state.patientId, reminder });
}

export async function persistInvite(state: CareState, invite: PersistableInvite) {
  await bestEffort("invite", { patientId: state.patientId, invite });
}

export async function persistPrivacyRequest(
  state: CareState,
  type: "export" | "delete"
) {
  await bestEffort("privacy-request", { patientId: state.patientId, type });
}
