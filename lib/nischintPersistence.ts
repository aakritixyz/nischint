import { env } from "cloudflare:workers";
import type { CareContact, CareState, CheckIn, LocationState } from "./nischintStore";
import { getCareState } from "./nischintStore";

type D1Statement = {
  bind: (...values: unknown[]) => {
    run: () => Promise<unknown>;
    first: <T = Record<string, unknown>>() => Promise<T | null>;
    all: <T = Record<string, unknown>>() => Promise<{ results?: T[] }>;
  };
  run: () => Promise<unknown>;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
  all: <T = Record<string, unknown>>() => Promise<{ results?: T[] }>;
};

type D1Binding = {
  prepare: (query: string) => D1Statement;
};

function getD1() {
  return (env as unknown as { DB?: D1Binding }).DB;
}

async function bestEffort(work: (db: D1Binding) => Promise<void>) {
  const db = getD1();
  if (!db) return;

  try {
    await work(db);
  } catch {
    // The in-memory prototype should keep working if local D1 is unavailable.
  }
}

export async function persistOnboarding(state: CareState) {
  await bestEffort(async (db) => {
    const now = new Date().toISOString();
    await db
      .prepare(
        `INSERT OR REPLACE INTO patients
        (id, name, preferred_language, home_address, emergency_info, safe_zone_name, safe_zone_latitude, safe_zone_longitude, safe_zone_radius_meters, calming_message, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE((SELECT created_at FROM patients WHERE id = ?), ?), ?)`
      )
      .bind(
        state.patientId,
        state.patient.name,
        state.patient.preferredLanguage,
        state.patient.homeAddress,
        state.patient.emergencyInfo,
        state.patient.safeZoneName,
        state.patient.safeZoneLatitude,
        state.patient.safeZoneLongitude,
        state.patient.safeZoneRadiusMeters,
        state.patient.calmingMessage,
        state.patientId,
        now,
        now
      )
      .run();

    for (const contact of state.contacts) {
      await db
        .prepare(
          `INSERT OR REPLACE INTO caregivers
          (id, patient_id, name, role, phone, email, can_receive_alerts, created_at)
          VALUES (?, ?, ?, ?, ?, '', true, ?)`
        )
        .bind(
          `${state.patientId}-${contact.name.toLowerCase().replaceAll(" ", "-")}`,
          state.patientId,
          contact.name,
          contact.role,
          contact.phone,
          now
        )
        .run();
    }
  });
}

export async function loadPersistedState() {
  const db = getD1();
  const fallback = getCareState();
  if (!db) return fallback;

  try {
    const patient = await db
      .prepare("SELECT * FROM patients WHERE id = ?")
      .bind(fallback.patientId)
      .first<Record<string, unknown>>();

    const contacts = await db
      .prepare("SELECT name, role, phone FROM caregivers WHERE patient_id = ? ORDER BY created_at DESC LIMIT 8")
      .bind(fallback.patientId)
      .all<CareContact>();

    const checkIns = await db
      .prepare("SELECT status, note, created_at FROM check_ins WHERE patient_id = ? ORDER BY created_at DESC LIMIT 5")
      .bind(fallback.patientId)
      .all<Record<string, unknown>>();

    const alerts = await db
      .prepare("SELECT type, status, message, created_at FROM alerts WHERE patient_id = ? ORDER BY created_at DESC LIMIT 5")
      .bind(fallback.patientId)
      .all<Record<string, unknown>>();

    const locations = await db
      .prepare("SELECT label, latitude, longitude, safe_zone_status, battery_level, network_status FROM locations WHERE patient_id = ? ORDER BY created_at DESC LIMIT 1")
      .bind(fallback.patientId)
      .all<Record<string, unknown>>();

    const notes = await db
      .prepare("SELECT author, note FROM caregiver_notes WHERE patient_id = ? ORDER BY created_at DESC LIMIT 8")
      .bind(fallback.patientId)
      .all<Record<string, unknown>>();

    const state = fallback;

    if (patient) {
      state.patient = {
        name: String(patient.name ?? state.patient.name),
        preferredLanguage: String(patient.preferred_language ?? state.patient.preferredLanguage),
        homeAddress: String(patient.home_address ?? state.patient.homeAddress),
        emergencyInfo: String(patient.emergency_info ?? state.patient.emergencyInfo),
        safeZoneName: String(patient.safe_zone_name ?? state.patient.safeZoneName),
        safeZoneLatitude: numberOrNull(patient.safe_zone_latitude),
        safeZoneLongitude: numberOrNull(patient.safe_zone_longitude),
        safeZoneRadiusMeters: Number(patient.safe_zone_radius_meters ?? state.patient.safeZoneRadiusMeters),
        calmingMessage: String(patient.calming_message ?? state.patient.calmingMessage),
      };
    }

    if (contacts.results?.length) {
      state.contacts = contacts.results.map((contact) => ({
        ...contact,
        tone: "Care",
      }));
    }

    if (locations.results?.[0]) {
      const latest = locations.results[0];
      state.location = {
        label: String(latest.label ?? state.location.label),
        latitude: numberOrNull(latest.latitude),
        longitude: numberOrNull(latest.longitude),
        safeZoneStatus:
          latest.safe_zone_status === "outside" ? "outside" : "inside",
        batteryLevel: numberOrNull(latest.battery_level),
        networkStatus:
          latest.network_status === "offline" || latest.network_status === "weak"
            ? latest.network_status
            : "online",
      };
    }

    if (notes.results?.length) {
      state.notes = notes.results.map((note) => `${note.author}: ${note.note}`);
    }

    state.events = [
      ...(alerts.results ?? []).map((alert, index) => ({
        id: index + 1,
        type: "lost-mode",
        message: String(alert.message ?? "Alert updated."),
        createdAt: String(alert.created_at ?? new Date().toISOString()),
      })),
      ...(checkIns.results ?? []).map((checkIn, index) => ({
        id: index + 100,
        type: "check-in",
        message: `Check-in recorded: ${String(checkIn.status ?? "ok")}.`,
        createdAt: String(checkIn.created_at ?? new Date().toISOString()),
      })),
    ].slice(0, 12);

    return state;
  } catch {
    return fallback;
  }
}

function numberOrNull(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export async function persistCheckIn(state: CareState, checkIn: CheckIn) {
  await bestEffort(async (db) => {
    await db
      .prepare(
        "INSERT INTO check_ins (patient_id, status, note, created_at) VALUES (?, ?, ?, ?)"
      )
      .bind(state.patientId, checkIn, "", new Date().toISOString())
      .run();
  });
}

export async function persistLostMode(state: CareState, active: boolean) {
  await bestEffort(async (db) => {
    await db
      .prepare(
        "INSERT INTO alerts (patient_id, type, status, message, created_at, resolved_at) VALUES (?, 'lost-mode', ?, ?, ?, ?)"
      )
      .bind(
        state.patientId,
        active ? "active" : "resolved",
        active
          ? "Lost-mode alert sent with location and emergency information."
          : "Lost-mode alert resolved by caregiver.",
        new Date().toISOString(),
        active ? null : new Date().toISOString()
      )
      .run();
  });
}

export async function persistLocation(
  state: CareState,
  location: Partial<LocationState>
) {
  await bestEffort(async (db) => {
    await db
      .prepare(
        `INSERT INTO locations
        (patient_id, label, latitude, longitude, safe_zone_status, battery_level, network_status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        state.patientId,
        state.location.label,
        location.latitude ?? state.location.latitude,
        location.longitude ?? state.location.longitude,
        state.location.safeZoneStatus,
        state.location.batteryLevel,
        state.location.networkStatus,
        new Date().toISOString()
      )
      .run();
  });
}

export async function persistCaregiverNote(state: CareState, note: string) {
  await bestEffort(async (db) => {
    await db
      .prepare(
        "INSERT INTO caregiver_notes (patient_id, author, note, created_at) VALUES (?, ?, ?, ?)"
      )
      .bind(state.patientId, "Asha", note, new Date().toISOString())
      .run();
  });
}

export async function persistReminder(
  state: CareState,
  reminder: { title: string; time: string; category: string; escalationMinutes: number }
) {
  await bestEffort(async (db) => {
    await db
      .prepare(
        `INSERT INTO reminders
        (patient_id, title, time, category, escalation_minutes, active, created_at)
        VALUES (?, ?, ?, ?, ?, true, ?)`
      )
      .bind(
        state.patientId,
        reminder.title,
        reminder.time,
        reminder.category,
        reminder.escalationMinutes,
        new Date().toISOString()
      )
      .run();
  });
}

export async function persistInvite(
  state: CareState,
  invite: { name: string; phoneOrEmail: string; role: string }
) {
  await bestEffort(async (db) => {
    await db
      .prepare(
        `INSERT INTO caregiver_invites
        (patient_id, name, phone_or_email, role, status, created_at, accepted_at)
        VALUES (?, ?, ?, ?, 'pending', ?, NULL)`
      )
      .bind(
        state.patientId,
        invite.name,
        invite.phoneOrEmail,
        invite.role,
        new Date().toISOString()
      )
      .run();
  });
}

export async function persistPrivacyRequest(
  state: CareState,
  type: "export" | "delete"
) {
  await bestEffort(async (db) => {
    await db
      .prepare(
        "INSERT INTO privacy_requests (patient_id, type, status, created_at) VALUES (?, ?, 'queued', ?)"
      )
      .bind(state.patientId, type, new Date().toISOString())
      .run();
  });
}
