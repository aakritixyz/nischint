export type CheckIn = "ok" | "help" | "medicine";

export type CareContact = {
  name: string;
  role: string;
  phone: string;
  tone: string;
};

export type CareEvent = {
  id: number;
  type:
    | "check-in"
    | "lost-mode"
    | "resolved"
    | "location"
    | "onboarding"
    | "notification"
    | "caregiver-note"
    | "reminder"
    | "invite"
    | "privacy";
  message: string;
  createdAt: string;
};

export type PatientProfile = {
  name: string;
  preferredLanguage: string;
  homeAddress: string;
  emergencyInfo: string;
  safeZoneName: string;
  safeZoneLatitude: number | null;
  safeZoneLongitude: number | null;
  safeZoneRadiusMeters: number;
  calmingMessage: string;
};

export type LocationState = {
  label: string;
  latitude: number | null;
  longitude: number | null;
  safeZoneStatus: "inside" | "outside";
  batteryLevel: number | null;
  networkStatus: "online" | "offline" | "weak";
};

export type CareState = {
  patientId: string;
  patient: PatientProfile;
  location: LocationState;
  lostMode: boolean;
  checkIn: CheckIn;
  lastUpdated: string;
  contacts: CareContact[];
  notes: string[];
  reminders: Reminder[];
  invites: CaregiverInvite[];
  privacyRequests: PrivacyRequest[];
  events: CareEvent[];
};

export type Reminder = {
  id: number;
  title: string;
  time: string;
  category: "medicine" | "appointment" | "routine";
  escalationMinutes: number;
  active: boolean;
};

export type CaregiverInvite = {
  id: number;
  name: string;
  phoneOrEmail: string;
  role: string;
  status: "pending" | "accepted";
};

export type PrivacyRequest = {
  id: number;
  type: "export" | "delete";
  status: "queued" | "complete";
  createdAt: string;
};

const contacts: CareContact[] = [
  { name: "Asha", role: "Daughter", phone: "+91 98765 43210", tone: "Primary" },
  { name: "Ravi", role: "Neighbor", phone: "+91 98765 43211", tone: "Nearby" },
  { name: "Dr. Meera", role: "Doctor", phone: "+91 98765 43212", tone: "Care" },
];

const initialState: CareState = {
  patientId: "demo-patient",
  patient: {
    name: "Meera",
    preferredLanguage: "English + Hindi",
    homeAddress: "24 Willow Lane",
    emergencyInfo: "May experience confusion. Allergic to penicillin. Morning medicine at 8:30 AM.",
    safeZoneName: "Home and Rose Garden route",
    safeZoneLatitude: null,
    safeZoneLongitude: null,
    safeZoneRadiusMeters: 500,
    calmingMessage:
      "Hi Ma, I can see your location. Stay calm. I am coming to you.",
  },
  location: {
    label: "Rose Garden Park",
    latitude: null,
    longitude: null,
    safeZoneStatus: "inside",
    batteryLevel: null,
    networkStatus: "online",
  },
  lostMode: false,
  checkIn: "ok",
  lastUpdated: new Date().toISOString(),
  contacts,
  notes: ["Asha will visit after lunch.", "Ravi can help if Meera is near the park gate."],
  reminders: [
    {
      id: 1,
      title: "Morning medicine",
      time: "08:30",
      category: "medicine",
      escalationMinutes: 15,
      active: true,
    },
    {
      id: 2,
      title: "Lunch and water",
      time: "13:00",
      category: "routine",
      escalationMinutes: 20,
      active: true,
    },
  ],
  invites: [
    {
      id: 1,
      name: "Neha",
      phoneOrEmail: "neha@example.com",
      role: "Family backup",
      status: "pending",
    },
  ],
  privacyRequests: [],
  events: [
    {
      id: 1,
      type: "check-in",
      message: "Meera checked in as okay.",
      createdAt: new Date().toISOString(),
    },
  ],
};

const store = globalThis as typeof globalThis & {
  nischintCareState?: CareState;
};

function currentState() {
  if (!store.nischintCareState) {
    store.nischintCareState = structuredClone(initialState);
  }

  return store.nischintCareState;
}

function touch(state: CareState) {
  state.lastUpdated = new Date().toISOString();
}

function addEvent(state: CareState, event: Omit<CareEvent, "id" | "createdAt">) {
  const nextEvent = {
    ...event,
    id: state.events.length + 1,
    createdAt: new Date().toISOString(),
  };

  state.events = [nextEvent, ...state.events].slice(0, 16);
  state.lastUpdated = nextEvent.createdAt;
}

export function getCareState() {
  return currentState();
}

export function updateOnboarding(payload: {
  patient?: Partial<PatientProfile>;
  contacts?: CareContact[];
}) {
  const state = currentState();

  if (payload.patient) {
    state.patient = { ...state.patient, ...payload.patient };
  }

  if (payload.contacts?.length) {
    state.contacts = payload.contacts;
  }

  addEvent(state, {
    type: "onboarding",
    message: "Care profile and caregiver circle were updated.",
  });

  return state;
}

export function recordCheckIn(checkIn: CheckIn) {
  const state = currentState();
  state.lostMode = false;
  state.location.safeZoneStatus = "inside";
  state.checkIn = checkIn;

  const messages: Record<CheckIn, string> = {
    ok: `${state.patient.name} checked in as okay.`,
    help: `${state.patient.name} requested help from family.`,
    medicine: "Morning medicine was marked complete.",
  };

  addEvent(state, {
    type: "check-in",
    message: messages[checkIn],
  });

  return state;
}

export function setLostMode(active: boolean) {
  const state = currentState();
  state.lostMode = active;
  state.location.safeZoneStatus = active ? "outside" : "inside";

  addEvent(state, {
    type: active ? "lost-mode" : "resolved",
    message: active
      ? "Lost-mode alert sent with location, home address, and emergency info."
      : "Caregiver marked the alert as resolved.",
  });

  return state;
}

export function updateLocation(payload: Partial<LocationState>) {
  const state = currentState();
  const safeZoneStatus =
    typeof payload.latitude === "number" &&
    typeof payload.longitude === "number" &&
    typeof state.patient.safeZoneLatitude === "number" &&
    typeof state.patient.safeZoneLongitude === "number"
      ? distanceMeters(
          payload.latitude,
          payload.longitude,
          state.patient.safeZoneLatitude,
          state.patient.safeZoneLongitude
        ) <= state.patient.safeZoneRadiusMeters
        ? "inside"
        : "outside"
      : payload.safeZoneStatus ?? state.location.safeZoneStatus;

  state.location = {
    ...state.location,
    ...payload,
    safeZoneStatus,
  };

  addEvent(state, {
    type: "location",
    message:
      state.location.safeZoneStatus === "outside"
        ? "Location update shows the loved one outside the safe zone."
        : "Location update received inside the safe zone.",
  });

  return state;
}

function distanceMeters(
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number
) {
  const earthRadiusMeters = 6371000;
  const fromLatRad = degreesToRadians(fromLatitude);
  const toLatRad = degreesToRadians(toLatitude);
  const deltaLat = degreesToRadians(toLatitude - fromLatitude);
  const deltaLon = degreesToRadians(toLongitude - fromLongitude);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(fromLatRad) *
      Math.cos(toLatRad) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMeters * c;
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function simulateNotification(channel: "sms" | "whatsapp" | "push") {
  const state = currentState();
  addEvent(state, {
    type: "notification",
    message: `${channel.toUpperCase()} alert queued for ${state.contacts[0]?.name ?? "caregiver"}.`,
  });
  return state;
}

export function addReminder(payload: Omit<Reminder, "id" | "active">) {
  const state = currentState();
  const reminder = {
    ...payload,
    id: state.reminders.length + 1,
    active: true,
  };
  state.reminders = [reminder, ...state.reminders].slice(0, 8);
  addEvent(state, {
    type: "reminder",
    message: `${reminder.title} reminder added for ${reminder.time}.`,
  });
  return state;
}

export function inviteCaregiver(payload: Omit<CaregiverInvite, "id" | "status">) {
  const state = currentState();
  const invite = {
    ...payload,
    id: state.invites.length + 1,
    status: "pending" as const,
  };
  state.invites = [invite, ...state.invites].slice(0, 8);
  addEvent(state, {
    type: "invite",
    message: `Invite queued for ${invite.name}.`,
  });
  return state;
}

export function queuePrivacyRequest(type: "export" | "delete") {
  const state = currentState();
  const request = {
    id: state.privacyRequests.length + 1,
    type,
    status: "queued" as const,
    createdAt: new Date().toISOString(),
  };
  state.privacyRequests = [request, ...state.privacyRequests].slice(0, 6);
  addEvent(state, {
    type: "privacy",
    message:
      type === "export"
        ? "Data export request queued."
        : "Data deletion request queued for caregiver review.",
  });
  return state;
}

export function addCaregiverNote(note: string, author = "Caregiver") {
  const state = currentState();
  state.notes = [`${author}: ${note}`, ...state.notes].slice(0, 8);
  addEvent(state, {
    type: "caregiver-note",
    message: `${author} added a caregiver note.`,
  });
  return state;
}

export function getGuidance() {
  const state = currentState();

  if (state.lostMode) {
    return {
      title: "Stay still and breathe slowly",
      message: `${state.patient.calmingMessage} Your family can see your location near ${state.location.label}.`,
      steps: [
        "Stay where you are if it feels safe.",
        "Show this screen to someone nearby.",
        `Ask them to call ${state.contacts[0]?.name ?? "your caregiver"}.`,
      ],
    };
  }

  if (state.checkIn === "help") {
    return {
      title: "Help is on the way",
      message: "Your family has been told that you need support soon.",
      steps: ["Sit somewhere comfortable.", "Keep your phone nearby.", "Wait for a familiar voice or call."],
    };
  }

  return {
    title: "You are safe right now",
    message: `You are near ${state.location.label}. Your home is saved as ${state.patient.homeAddress}.`,
    steps: ["Drink some water.", "Check your next reminder.", "Call family if you feel unsure."],
  };
}

export function resetDemoState() {
  store.nischintCareState = structuredClone(initialState);
  touch(store.nischintCareState);
  return store.nischintCareState;
}
