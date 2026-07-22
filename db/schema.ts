import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const patients = sqliteTable("patients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  preferredLanguage: text("preferred_language").notNull().default("English"),
  homeAddress: text("home_address").notNull(),
  emergencyInfo: text("emergency_info").notNull().default(""),
  safeZoneName: text("safe_zone_name").notNull().default("Home area"),
  safeZoneLatitude: real("safe_zone_latitude"),
  safeZoneLongitude: real("safe_zone_longitude"),
  safeZoneRadiusMeters: integer("safe_zone_radius_meters").notNull().default(500),
  calmingMessage: text("calming_message").notNull().default("Stay calm. Your family has been notified."),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const caregivers = sqliteTable("caregivers", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  canReceiveAlerts: integer("can_receive_alerts", { mode: "boolean" })
    .notNull()
    .default(true),
  createdAt: text("created_at").notNull(),
});

export const checkIns = sqliteTable("check_ins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: text("patient_id").notNull(),
  status: text("status").notNull(),
  note: text("note").notNull().default(""),
  createdAt: text("created_at").notNull(),
});

export const alerts = sqliteTable("alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: text("patient_id").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
  resolvedAt: text("resolved_at"),
});

export const locations = sqliteTable("locations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: text("patient_id").notNull(),
  label: text("label").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  safeZoneStatus: text("safe_zone_status").notNull().default("inside"),
  batteryLevel: integer("battery_level"),
  networkStatus: text("network_status").notNull().default("online"),
  createdAt: text("created_at").notNull(),
});

export const caregiverNotes = sqliteTable("caregiver_notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: text("patient_id").notNull(),
  author: text("author").notNull(),
  note: text("note").notNull(),
  createdAt: text("created_at").notNull(),
});

export const reminders = sqliteTable("reminders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: text("patient_id").notNull(),
  title: text("title").notNull(),
  time: text("time").notNull(),
  category: text("category").notNull().default("routine"),
  escalationMinutes: integer("escalation_minutes").notNull().default(15),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
});

export const caregiverInvites = sqliteTable("caregiver_invites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: text("patient_id").notNull(),
  name: text("name").notNull(),
  phoneOrEmail: text("phone_or_email").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
  acceptedAt: text("accepted_at"),
});

export const privacyRequests = sqliteTable("privacy_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: text("patient_id").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("queued"),
  createdAt: text("created_at").notNull(),
});
