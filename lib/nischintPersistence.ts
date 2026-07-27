import type { CareState, CheckIn, LocationState } from "./nischintStore";
import { getCareState, hydrateCareState } from "./nischintStore";
import postgres from "postgres";

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
  return Boolean(process.env.DATABASE_URL?.trim());
}

const database = globalThis as typeof globalThis & {
  nischintSql?: postgres.Sql;
  nischintTableReady?: Promise<void>;
};

function getSql() {
  if (!hasDatabaseUrl()) return null;

  if (!database.nischintSql) {
    database.nischintSql = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: process.env.DATABASE_URL?.includes("sslmode=disable") ? false : "require",
    });
  }

  return database.nischintSql;
}

async function ensureStateTable(sql: postgres.Sql) {
  database.nischintTableReady ??= sql`
    create table if not exists nischint_care_state (
      patient_id text primary key,
      state jsonb not null,
      updated_at timestamptz not null default now()
    )
  `.then(() => undefined);
  await database.nischintTableReady;
}

async function saveCareState(state: CareState) {
  const sql = getSql();
  if (!sql) return;

  try {
    await ensureStateTable(sql);
    await sql`
      insert into nischint_care_state (patient_id, state, updated_at)
      values (${state.patientId}, ${sql.json(state)}, now())
      on conflict (patient_id)
      do update set state = excluded.state, updated_at = now()
    `;
  } catch (error) {
    console.error("Nischint persistence write failed", error);
  }
}

export async function loadPersistedState() {
  const sql = getSql();
  if (!sql) return getCareState();

  try {
    await ensureStateTable(sql);
    const rows = await sql<{ state: CareState }[]>`
      select state
      from nischint_care_state
      where patient_id = ${getCareState().patientId}
      limit 1
    `;
    if (rows[0]?.state) {
      return hydrateCareState(rows[0].state);
    }
    await saveCareState(getCareState());
  } catch (error) {
    console.error("Nischint persistence load failed", error);
  }

  return getCareState();
}

export async function persistOnboarding(state: CareState) {
  await saveCareState(state);
}

export async function persistCheckIn(state: CareState, checkIn: CheckIn) {
  void checkIn;
  await saveCareState(state);
}

export async function persistLostMode(state: CareState, active: boolean) {
  void active;
  await saveCareState(state);
}

export async function persistLocation(
  state: CareState,
  location: Partial<LocationState>
) {
  void location;
  await saveCareState(state);
}

export async function persistCaregiverNote(state: CareState, note: string) {
  void note;
  await saveCareState(state);
}

export async function persistReminder(
  state: CareState,
  reminder: PersistableReminder
) {
  void reminder;
  await saveCareState(state);
}

export async function persistInvite(state: CareState, invite: PersistableInvite) {
  void invite;
  await saveCareState(state);
}

export async function persistPrivacyRequest(
  state: CareState,
  type: "export" | "delete"
) {
  void type;
  await saveCareState(state);
}

export async function persistConsent(state: CareState) {
  await saveCareState(state);
}

export async function persistNotificationDelivery(state: CareState) {
  await saveCareState(state);
}
