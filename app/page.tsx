"use client";

import { useEffect, useMemo, useState } from "react";

type CheckIn = "ok" | "help" | "medicine";

type CareContact = {
  name: string;
  role: string;
  phone: string;
  tone: string;
};

type CareEvent = {
  id: number;
  type: string;
  message: string;
  createdAt: string;
};

type PatientProfile = {
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

type LocationState = {
  label: string;
  latitude: number | null;
  longitude: number | null;
  safeZoneStatus: "inside" | "outside";
  batteryLevel: number | null;
  networkStatus: "online" | "offline" | "weak";
};

type CareState = {
  patient: PatientProfile;
  location: LocationState;
  lostMode: boolean;
  checkIn: CheckIn;
  contacts: CareContact[];
  notes: string[];
  reminders: Reminder[];
  invites: CaregiverInvite[];
  privacyRequests: PrivacyRequest[];
  events: CareEvent[];
};

type Reminder = {
  id: number;
  title: string;
  time: string;
  category: "medicine" | "appointment" | "routine";
  escalationMinutes: number;
  active: boolean;
};

type CaregiverInvite = {
  id: number;
  name: string;
  phoneOrEmail: string;
  role: string;
  status: "pending" | "accepted";
};

type PrivacyRequest = {
  id: number;
  type: "export" | "delete";
  status: "queued" | "complete";
  createdAt: string;
};

type Guidance = {
  title: string;
  message: string;
  steps: string[];
};

const fallbackState: CareState = {
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
  contacts: [
    { name: "Asha", role: "Daughter", phone: "+91 98765 43210", tone: "Primary" },
    { name: "Ravi", role: "Neighbor", phone: "+91 98765 43211", tone: "Nearby" },
    { name: "Dr. Meera", role: "Doctor", phone: "+91 98765 43212", tone: "Care" },
  ],
  notes: ["Asha will visit after lunch."],
  reminders: [
    {
      id: 1,
      title: "Morning medicine",
      time: "08:30",
      category: "medicine",
      escalationMinutes: 15,
      active: true,
    },
  ],
  invites: [],
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

const defaultGuidance: Guidance = {
  title: "You are safe right now",
  message: "Your home and family contacts are saved.",
  steps: ["Breathe slowly.", "Stay where you are.", "Press I feel lost if unsure."],
};

const featureHighlights = [
  {
    title: "Emergency help",
    copy: "One large action shares location, home address, and care details with family.",
  },
  {
    title: "Daily assurance",
    copy: "Simple check-ins for medicine, routines, and moments when support is needed.",
  },
  {
    title: "Family live view",
    copy: "Caregivers see the latest alert, safe-zone status, contacts, and care notes.",
  },
  {
    title: "Calm guidance",
    copy: "Gentle steps and familiar family messages help reduce panic during confusion.",
  },
];

const serviceHighlights = [
  "Live location sharing",
  "Safe-zone demo",
  "Emergency contacts",
  "Medicine reminders",
  "Family voice note",
  "Privacy requests",
];

const advancedTiles = [
  {
    kicker: "Signal 01",
    title: "Safe-zone heartbeat",
    copy: "Live geofence status with distance logic and caregiver escalation.",
    metric: "500m",
  },
  {
    kicker: "Signal 02",
    title: "Family alert path",
    copy: "Lost mode turns one simple action into a caregiver response chain.",
    metric: "1 tap",
  },
  {
    kicker: "Signal 03",
    title: "Consent lock",
    copy: "Location, emergency card, and caregiver access stay permission-based.",
    metric: "PIN",
  },
  {
    kicker: "Signal 04",
    title: "Care routine pulse",
    copy: "Medicine, notes, reminders, and check-ins stay visible without noise.",
    metric: "8:30",
  },
];

const signalRailItems = [
  "GPS permission",
  "Safe-zone math",
  "Caregiver PIN",
  "Consent audit",
  "Escalation policy",
  "SMS fallback",
  "Offline card",
  "Family handoff",
];

const productionTiles = [
  {
    title: "Caregiver access code",
    detail: "Demo PIN 2486 models how family-only dashboards should be protected before real use.",
    accent: "Secure",
  },
  {
    title: "Consent gates",
    detail: "Location sharing and emergency info are separated so families can explain exactly what is visible.",
    accent: "Consent",
  },
  {
    title: "Escalation ladder",
    detail: "Primary caregiver first, backup contact after 10 minutes, doctor or neighbor after 20 minutes.",
    accent: "20 min",
  },
  {
    title: "Real provider path",
    detail: "The app runs as a demo today and is wired for database, SMS, WhatsApp, and AI keys later.",
    accent: "Ready",
  },
];

export default function Home() {
  const [careState, setCareState] = useState<CareState>(fallbackState);
  const [guidance, setGuidance] = useState<Guidance>(defaultGuidance);
  const [backendReady, setBackendReady] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [locationStatus, setLocationStatus] = useState("Location not shared yet");
  const [notificationStatus, setNotificationStatus] = useState("Alerts are simulated");
  const [noteDraft, setNoteDraft] = useState("");
  const [reminderTitle, setReminderTitle] = useState("Evening walk");
  const [reminderTime, setReminderTime] = useState("17:30");
  const [inviteName, setInviteName] = useState("Neha");
  const [inviteContact, setInviteContact] = useState("neha@example.com");
  const [privacyStatus, setPrivacyStatus] = useState("No privacy request queued");
  const [locationConsent, setLocationConsent] = useState(true);
  const [emergencyConsent, setEmergencyConsent] = useState(true);
  const [caregiverAccessCode, setCaregiverAccessCode] = useState("2486");

  const status = useMemo(() => {
    if (careState.lostMode) {
      return {
        label: "Caregiver alert active",
        detail: `${careState.contacts[0]?.name ?? "Family"} received location, home address, and emergency info.`,
        className: "statusAlert",
      };
    }

    if (careState.checkIn === "help") {
      return {
        label: "Help request sent",
        detail: "Family sees that support is needed soon.",
        className: "statusWatch",
      };
    }

    if (careState.checkIn === "medicine") {
      return {
        label: "Medicine confirmed",
        detail: "Morning tablet marked complete at 8:30 AM.",
        className: "statusGood",
      };
    }

    return {
      label: "All okay",
      detail: "Daily check-in complete. Safe zone is normal.",
      className: "statusGood",
    };
  }, [careState]);

  function applyState(state: CareState) {
    setCareState(state);
    setBackendReady(true);
  }

  function caregiverDialHref() {
    const phone = careState.contacts[0]?.phone.replace(/[^+\d]/g, "") ?? "";
    return phone ? `tel:${phone}` : undefined;
  }

  function safeZoneSummary() {
    if (careState.location.latitude && careState.location.longitude) {
      return careState.location.safeZoneStatus === "outside"
        ? "Outside safe zone - escalate to backup"
        : "Inside safe zone - family can monitor";
    }

    return careState.lostMode
      ? "Demo outside safe zone - alert chain active"
      : "Safe-zone ready - GPS not shared yet";
  }

  async function callApi(path: string, body?: unknown) {
    const response = await fetch(path, {
      method: body ? "POST" : "GET",
      headers: body ? { "content-type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.json() as Promise<{ state?: CareState; guidance?: Guidance; delivery?: string }>;
  }

  async function refreshGuidance() {
    try {
      const payload = await callApi("/api/nischint/guidance");
      if (payload.guidance) setGuidance(payload.guidance);
    } catch {
      setBackendReady(false);
    }
  }

  async function syncLostMode(active: boolean) {
    setCareState((state) => ({
      ...state,
      lostMode: active,
      location: {
        ...state.location,
        safeZoneStatus: active ? "outside" : "inside",
      },
    }));

    try {
      const payload = await callApi("/api/nischint/lost-mode", { active });
      if (payload.state) applyState(payload.state);
      void refreshGuidance();
    } catch {
      setBackendReady(false);
    }
  }

  async function syncCheckIn(checkIn: CheckIn) {
    setCareState((state) => ({ ...state, lostMode: false, checkIn }));

    try {
      const payload = await callApi("/api/nischint/check-in", { checkIn });
      if (payload.state) applyState(payload.state);
      void refreshGuidance();
    } catch {
      setBackendReady(false);
    }
  }

  async function saveOnboarding() {
    try {
      const payload = await callApi("/api/nischint/onboarding", {
        patient: careState.patient,
        contacts: careState.contacts,
      });
      if (payload.state) applyState(payload.state);
    } catch {
      setBackendReady(false);
    }
  }

  async function shareLocation() {
    if (!locationConsent) {
      setLocationStatus("Location consent is off");
      return;
    }

    if (!("geolocation" in navigator)) {
      setLocationStatus("GPS is unavailable on this device");
      return;
    }

    setLocationStatus("Requesting GPS permission...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const shouldSetSafeZone =
          careState.patient.safeZoneLatitude === null ||
          careState.patient.safeZoneLongitude === null;
        const location: Partial<LocationState> = {
          label: "Live phone location",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          safeZoneStatus: careState.lostMode ? "outside" : "inside",
          networkStatus: navigator.onLine ? "online" : "offline",
        };
        setLocationStatus("Live location shared with caregiver");
        if (shouldSetSafeZone) {
          setCareState((state) => ({
            ...state,
            patient: {
              ...state.patient,
              safeZoneLatitude: position.coords.latitude,
              safeZoneLongitude: position.coords.longitude,
            },
          }));
        }
        try {
          const payload = await callApi("/api/nischint/location", location);
          if (payload.state) applyState(payload.state);
        } catch {
          setBackendReady(false);
        }
      },
      () => setLocationStatus("Location permission was not granted"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  async function notifyCaregiver(channel: "sms" | "whatsapp" | "push") {
    if (channel === "push" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("Nischint alert", {
          body: `${careState.patient.name} may need support.`,
        });
      }
    }

    try {
      const payload = await callApi("/api/nischint/notify", { channel });
      if (payload.state) applyState(payload.state);
      setNotificationStatus(payload.delivery ?? `${channel} alert queued`);
    } catch {
      setBackendReady(false);
    }
  }

  async function addNote() {
    const note = noteDraft.trim();
    if (!note) return;

    setNoteDraft("");
    try {
      const payload = await callApi("/api/nischint/notes", {
        note,
        author: "Asha",
      });
      if (payload.state) applyState(payload.state);
    } catch {
      setBackendReady(false);
    }
  }

  async function addReminder() {
    try {
      const payload = await callApi("/api/nischint/reminders", {
        title: reminderTitle,
        time: reminderTime,
        category: "routine",
        escalationMinutes: 15,
      });
      if (payload.state) applyState(payload.state);
    } catch {
      setBackendReady(false);
    }
  }

  async function sendInvite() {
    try {
      const payload = await callApi("/api/nischint/invites", {
        name: inviteName,
        phoneOrEmail: inviteContact,
        role: "Family caregiver",
      });
      if (payload.state) applyState(payload.state);
    } catch {
      setBackendReady(false);
    }
  }

  async function queuePrivacy(type: "export" | "delete") {
    try {
      const payload = await callApi("/api/nischint/privacy", { type });
      if (payload.state) applyState(payload.state);
      setPrivacyStatus(
        type === "export"
          ? "Data export queued"
          : "Deletion request queued for caregiver review"
      );
    } catch {
      setBackendReady(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function loadCareState() {
      try {
        const payload = await callApi("/api/nischint/state");
        if (mounted && payload.state) applyState(payload.state);
        await refreshGuidance();
      } catch {
        if (mounted) setBackendReady(false);
      }
    }

    void loadCareState();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main
      className={`shell ${largeText ? "largeText" : ""} ${highContrast ? "highContrast" : ""}`}
    >
      <header className="topBar" aria-label="Nischint navigation">
        <a className="brandLockup" href="#nischint-title" aria-label="Nischint home">
          <span>नि</span>
          <strong>Nischint</strong>
        </a>
        <nav aria-label="Page sections">
          <a href="#care-services">Care</a>
          <a href="#live-demo">Demo</a>
          <a href="#privacy">Privacy</a>
        </nav>
      </header>

      <section className="hero" aria-labelledby="nischint-title">
        <div className="heroCopy">
          <div className="brandPill">
            <span aria-hidden="true">नि</span>
            Elder safety & family care
          </div>
          <p className="scriptName" aria-hidden="true">निश्चिंत</p>
          <h1 id="nischint-title">Nischint</h1>
          <p>
            A calm mobile-first companion for seniors who may feel confused or
            lost, and for families who need quick, clear safety updates.
          </p>
          <div className="heroActions" aria-label="Primary demo actions">
            <button
              className="primaryButton"
              type="button"
              onClick={() => void syncLostMode(true)}
            >
              I feel lost
            </button>
            <button
              className="softButton"
              type="button"
              onClick={() => void syncCheckIn("ok")}
            >
              I am safe
            </button>
          </div>
          <div className="trustStrip" aria-label="Safety highlights">
            <span><strong>24/7</strong> ready</span>
            <span><strong>PIN</strong> guarded</span>
            <span><strong>Consent</strong> first</span>
          </div>

          <div className="signalRail" aria-label="Production signal flow">
            <div>
              {[...signalRailItems, ...signalRailItems].map((item, index) => (
                <span key={item + "-" + index}>{item}</span>
              ))}
            </div>
          </div>

          <div className="motionDeck" aria-label="Live care signal tiles">
            {advancedTiles.map((tile, index) => (
              <article
                className={`motionTile motionTile${index + 1} tone${index + 1}`}
                key={tile.title}
              >
                <span>{tile.kicker}</span>
                <strong>{tile.title}</strong>
                <p>{tile.copy}</p>
                <em>{tile.metric}</em>
              </article>
            ))}
          </div>
        </div>

        <div className="phoneCard" aria-label="Senior safety screen">
          <div className="phoneTop">
            <span>Senior view</span>
            <span className={`syncPill ${backendReady ? "" : "localOnly"}`}>
              {backendReady ? "Care synced" : "Offline ready"}
            </span>
            <strong>{careState.lostMode ? "Help mode" : "Today"}</strong>
          </div>

          <div className={`statusBanner ${status.className}`}>
            <span>{status.label}</span>
            <p>{status.detail}</p>
          </div>

          <div className="orientationCard">
            <span className="smallLabel">Right now</span>
            <h2>Today, 8:30 AM</h2>
            <p>
              {careState.patient.name} is near {careState.location.label}. Home
              is saved as {careState.patient.homeAddress}.
            </p>
          </div>

          <button
            className={`lostButton ${careState.lostMode ? "isActive" : ""}`}
            type="button"
            onClick={() => void syncLostMode(true)}
          >
            <span>I feel lost</span>
            <small>Share location and alert family</small>
          </button>

          <div className="quickGrid" aria-label="Daily check in">
            <button type="button" onClick={() => void syncCheckIn("ok")}>
              <span>I am okay</span>
            </button>
            <button type="button" onClick={() => void syncCheckIn("help")}>
              <span>I need help</span>
            </button>
            <button type="button" onClick={() => void syncCheckIn("medicine")}>
              <span>I took medicine</span>
            </button>
          </div>

          <div className="emergencyCard" aria-label="Emergency information card">
            <span className="smallLabel">Show if help is needed</span>
            <h3>{careState.patient.name} may be confused</h3>
            <p>{careState.patient.emergencyInfo}</p>
            <div className="emergencyActions">
              <a href={caregiverDialHref()}>
                Call {careState.contacts[0]?.name ?? "caregiver"}
              </a>
              <button type="button" onClick={() => void notifyCaregiver("sms")}>
                Send alert
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="care-services" className="careIntro" aria-label="Nischint care services">
        <div className="sectionHeading">
          <span>How Nischint helps</span>
          <h2>Built for real moments, not just memories</h2>
        </div>
        <p>
          The app keeps the senior-facing screen very simple while giving caregivers
          the context they need: where the person is, what happened, who to
          contact, and what to do next.
        </p>
        <div className="serviceCloud" aria-label="Available care features">
          {serviceHighlights.map((service) => (
            <span className="serviceChip" key={service}>{service}</span>
          ))}
        </div>
      </section>

      <section className="featureRail" aria-label="Project strengths">
        {featureHighlights.map((feature) => (
          <article className="featureTile" key={feature.title}>
            <strong>{feature.title}</strong>
            <p>{feature.copy}</p>
          </article>
        ))}
      </section>

      <section id="live-demo" className="toolGrid" aria-label="Nischint controls">
        <article className="patientPanel">
          <div className="sectionHeading">
            <span>Senior setup</span>
            <h2>Care profile</h2>
          </div>
          <label>
            Name
            <input
              value={careState.patient.name}
              onChange={(event) =>
                setCareState((state) => ({
                  ...state,
                  patient: { ...state.patient, name: event.target.value },
                }))
              }
            />
          </label>
          <label>
            Home address
            <input
              value={careState.patient.homeAddress}
              onChange={(event) =>
                setCareState((state) => ({
                  ...state,
                  patient: { ...state.patient, homeAddress: event.target.value },
                }))
              }
            />
          </label>
          <label>
            Emergency medical info
            <textarea
              value={careState.patient.emergencyInfo}
              onChange={(event) =>
                setCareState((state) => ({
                  ...state,
                  patient: {
                    ...state.patient,
                    emergencyInfo: event.target.value,
                  },
                }))
              }
            />
          </label>
          <button className="softButton" type="button" onClick={() => void saveOnboarding()}>
            Save setup
          </button>
        </article>

        <article className="patientPanel">
          <div className="sectionHeading">
            <span>Accessibility</span>
            <h2>Easy to read</h2>
          </div>
          <div className="toggleRow">
            <button
              className={`softButton compact ${largeText ? "selected" : ""}`}
              type="button"
              onClick={() => setLargeText((value) => !value)}
            >
              Large text
            </button>
            <button
              className={`softButton compact ${highContrast ? "selected" : ""}`}
              type="button"
              onClick={() => setHighContrast((value) => !value)}
            >
              High contrast
            </button>
          </div>
          <p className="panelCopy">
            The senior view uses large touch targets, simple sentences,
            readable contrast, keyboard focus states, and reduced choices.
          </p>
        </article>

        <article className="patientPanel">
          <div className="sectionHeading">
            <span>Live safety</span>
            <h2>GPS and alerts</h2>
          </div>
          <p className="panelCopy">{locationStatus}</p>
          <button className="primaryButton" type="button" onClick={() => void shareLocation()}>
            Share live location
          </button>
          <div className="toggleRow">
            <button className="softButton compact" type="button" onClick={() => void notifyCaregiver("sms")}>
              SMS
            </button>
            <button className="softButton compact" type="button" onClick={() => void notifyCaregiver("whatsapp")}>
              WhatsApp
            </button>
            <button className="softButton compact" type="button" onClick={() => void notifyCaregiver("push")}>
              Push
            </button>
          </div>
          <p className="panelCopy">{notificationStatus}</p>
        </article>
      </section>

      <section className="dashboard" aria-label="Nischint feature demo">
        <div className="patientPanel">
          <div className="sectionHeading">
            <span>Calm guidance</span>
            <h2>{guidance.title}</h2>
          </div>
          <p className="panelCopy">{guidance.message}</p>

          <div className="stepList">
            {guidance.steps.map((step, index) => (
              <div className="stepItem" key={step}>
                <strong>{index + 1}</strong>
                <p>{step}</p>
              </div>
            ))}
          </div>

          <div className="voiceCard">
            <div>
              <span className="smallLabel">Family voice note</span>
              <h3>
                {voicePlaying ? "Playing family message" : `${careState.contacts[0]?.name ?? "Family"} says you are safe`}
              </h3>
              <p>"{careState.patient.calmingMessage}"</p>
            </div>
            <button
              className="roundButton"
              type="button"
              aria-label={voicePlaying ? "Pause voice note" : "Play voice note"}
              onClick={() => setVoicePlaying((value) => !value)}
            >
              {voicePlaying ? "II" : "Play"}
            </button>
          </div>
        </div>

        <div className="caregiverPanel">
          <div className="sectionHeading">
            <span>Caregiver live view</span>
            <h2>Family sees what matters first</h2>
          </div>

          <div className={`alertCard ${careState.lostMode ? "alertOn" : ""}`}>
            <div>
              <span className="smallLabel">Latest alert</span>
              <h3>
                {careState.lostMode
                  ? `Lost-mode alert from ${careState.patient.name}`
                  : "No emergency alerts"}
              </h3>
              <p>
                {careState.lostMode
                  ? `${careState.location.label} shared. Safe-zone boundary may have been crossed.`
                  : `${careState.patient.name} checked in. Safe zone, medicine, and routine are visible.`}
              </p>
            </div>
            <button
              className="softButton compact"
              type="button"
              onClick={() => void syncLostMode(!careState.lostMode)}
            >
              {careState.lostMode ? "Resolve" : "Demo alert"}
            </button>
          </div>

          <div className="mapCard" aria-label="Safe zone map demo">
            <div className="mapSurface">
              <span className="homeDot">Home</span>
              <span
                className={`personDot ${careState.location.safeZoneStatus === "outside" ? "outside" : ""}`}
              >
                {careState.patient.name}
              </span>
              <div className="safeRing" />
              <span className="routeLine" />
              <span className="scanBeam" />
            </div>
            <div>
              <span className="smallLabel">Safe zone</span>
              <h3>
                {careState.location.safeZoneStatus === "outside"
                  ? "Outside usual area"
                  : "Inside usual area"}
              </h3>
              <p>{safeZoneSummary()}</p>
              <p>
                {careState.location.latitude
                  ? careState.location.latitude.toFixed(4) + ", " + careState.location.longitude?.toFixed(4)
                  : careState.patient.safeZoneName + ", " + careState.patient.safeZoneRadiusMeters + "m radius"}
              </p>
            </div>
          </div>

          <div className="contactList">
            {careState.contacts.map((contact) => (
              <article key={contact.name}>
                <div>
                  <strong>{contact.name}</strong>
                  <span>{contact.role}</span>
                </div>
                <p>{contact.phone}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="productionBand" aria-label="Production safety controls">
        <div className="sectionHeading">
          <span>For real families</span>
          <h2>Production safety layer</h2>
        </div>
        <div className="productionGrid">
          {productionTiles.map((tile) => (
            <article className="productionTile" key={tile.title}>
              <em>{tile.accent}</em>
              <strong>{tile.title}</strong>
              <p>{tile.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="toolGrid" aria-label="Caregiver history and privacy">
        <article className="caregiverPanel">
          <div className="sectionHeading">
            <span>Reminders</span>
            <h2>Medicine and routine</h2>
          </div>
          <label>
            Reminder
            <input
              value={reminderTitle}
              onChange={(event) => setReminderTitle(event.target.value)}
            />
          </label>
          <label>
            Time
            <input
              type="time"
              value={reminderTime}
              onChange={(event) => setReminderTime(event.target.value)}
            />
          </label>
          <button className="softButton" type="button" onClick={() => void addReminder()}>
            Add reminder
          </button>
          <div className="eventList">
            {careState.reminders.slice(0, 4).map((reminder) => (
              <p key={reminder.id}>
                <strong>{reminder.time}</strong> {reminder.title}
              </p>
            ))}
          </div>
        </article>

        <article className="caregiverPanel">
          <div className="sectionHeading">
            <span>Care circle</span>
            <h2>Invite caregiver</h2>
          </div>
          <label>
            Name
            <input
              value={inviteName}
              onChange={(event) => setInviteName(event.target.value)}
            />
          </label>
          <label>
            Phone or email
            <input
              value={inviteContact}
              onChange={(event) => setInviteContact(event.target.value)}
            />
          </label>
          <button className="softButton" type="button" onClick={() => void sendInvite()}>
            Send invite
          </button>
          <div className="eventList">
            {careState.invites.slice(0, 3).map((invite) => (
              <p key={invite.id}>
                <strong>{invite.status}</strong> {invite.name} · {invite.role}
              </p>
            ))}
          </div>
        </article>

        <article className="caregiverPanel">
          <div className="sectionHeading">
            <span>Caregiver notes</span>
            <h2>Family handoff</h2>
          </div>
          <label>
            Add note
            <textarea
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              placeholder="Example: She had breakfast and seemed calm."
            />
          </label>
          <button className="softButton" type="button" onClick={() => void addNote()}>
            Add caregiver note
          </button>
          <div className="eventList">
            {careState.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </article>

        <article className="caregiverPanel">
          <div className="sectionHeading">
            <span>Event history</span>
            <h2>Recent care activity</h2>
          </div>
          <div className="eventList">
            {careState.events.slice(0, 6).map((event) => (
              <p key={event.id}>
                <strong>{event.type}</strong> {event.message}
              </p>
            ))}
          </div>
        </article>

        <article className="caregiverPanel noticePanel">
          <div className="sectionHeading">
            <span>Launch note</span>
            <h2>Demo-ready, not medical advice</h2>
          </div>
          <p className="panelCopy">
            Nischint is a safety-support prototype for presentations and pilot
            testing. For real families, connect verified contacts, a secure
            database, authentication, emergency policies, and consent workflows
            before storing sensitive health or location data.
          </p>
        </article>

        <article id="privacy" className="caregiverPanel consentPanel">
          <div className="sectionHeading">
            <span>Privacy and safety</span>
            <h2>Consent-first design</h2>
          </div>
          <p className="panelCopy">
            Location sharing is permission-based, emergency info is shown only
            for care support, and the app is designed around consent, audit
            history, caregiver roles, and data export/delete requests.
          </p>
          <label className="switchRow">
            <input
              checked={locationConsent}
              type="checkbox"
              onChange={(event) => setLocationConsent(event.target.checked)}
            />
            <span>Location sharing consent</span>
          </label>
          <label className="switchRow">
            <input
              checked={emergencyConsent}
              type="checkbox"
              onChange={(event) => setEmergencyConsent(event.target.checked)}
            />
            <span>Emergency card consent</span>
          </label>
          <label>
            Caregiver access code
            <input
              inputMode="numeric"
              value={caregiverAccessCode}
              onChange={(event) => setCaregiverAccessCode(event.target.value)}
            />
          </label>
          <div className="escalationStack">
            <p><strong>0 min</strong> Primary caregiver alert</p>
            <p><strong>10 min</strong> Backup family contact</p>
            <p><strong>20 min</strong> Neighbor or doctor handoff</p>
          </div>
          <div className="toggleRow">
            <button className="softButton compact" type="button" onClick={() => void queuePrivacy("export")}>
              Export data
            </button>
            <button className="softButton compact" type="button" onClick={() => void queuePrivacy("delete")}>
              Delete request
            </button>
          </div>
          <p className="panelCopy">
            {privacyStatus}. Location: {locationConsent ? "allowed" : "off"}. Emergency card: {emergencyConsent ? "visible" : "hidden"}.
          </p>
        </article>
      </section>
    </main>
  );
}
