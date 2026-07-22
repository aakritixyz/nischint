"use client";

import { useMemo, useState } from "react";

type CheckIn = "ok" | "help" | "medicine";

const contacts = [
  { name: "Asha", role: "Daughter", phone: "Calling now", tone: "Primary" },
  { name: "Ravi", role: "Neighbor", phone: "2 min away", tone: "Nearby" },
  { name: "Dr. Meera", role: "Doctor", phone: "On call", tone: "Care" },
];

const steps = [
  "Stay where you are if it feels safe.",
  "Press call Asha or show this screen to a kind person nearby.",
  "Take slow breaths while your family receives your location.",
];

export default function Home() {
  const [lostMode, setLostMode] = useState(false);
  const [checkIn, setCheckIn] = useState<CheckIn>("ok");
  const [voicePlaying, setVoicePlaying] = useState(false);

  const status = useMemo(() => {
    if (lostMode) {
      return {
        label: "Caregiver alert active",
        detail: "Asha received location, home address, and safety note.",
        className: "statusAlert",
      };
    }

    if (checkIn === "help") {
      return {
        label: "Help request sent",
        detail: "Family sees that support is needed soon.",
        className: "statusWatch",
      };
    }

    if (checkIn === "medicine") {
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
  }, [checkIn, lostMode]);

  return (
    <main className="shell">
      <section className="hero" aria-labelledby="careanchor-title">
        <div className="heroCopy">
          <div className="brandPill">
            <span aria-hidden="true">CA</span>
            Dementia safety companion
          </div>
          <h1 id="careanchor-title">CareAnchor</h1>
          <p>
            A gentle real-time support app that helps someone feel calm, know
            where they are, and reach family quickly when they feel confused or
            lost.
          </p>
          <div className="heroActions" aria-label="Primary demo actions">
            <button
              className="primaryButton"
              type="button"
              onClick={() => setLostMode(true)}
            >
              I feel lost
            </button>
            <button
              className="softButton"
              type="button"
              onClick={() => {
                setLostMode(false);
                setCheckIn("ok");
              }}
            >
              I am safe
            </button>
          </div>
        </div>

        <div className="phoneCard" aria-label="Patient safety screen">
          <div className="phoneTop">
            <span>Patient view</span>
            <strong>{lostMode ? "Help mode" : "Today"}</strong>
          </div>

          <div className={`statusBanner ${status.className}`}>
            <span>{status.label}</span>
            <p>{status.detail}</p>
          </div>

          <div className="orientationCard">
            <span className="smallLabel">Right now</span>
            <h2>Wednesday, 8:30 AM</h2>
            <p>You are near Rose Garden Park. Home is saved as 24 Willow Lane.</p>
          </div>

          <button
            className={`lostButton ${lostMode ? "isActive" : ""}`}
            type="button"
            onClick={() => setLostMode(true)}
          >
            <span>I feel lost</span>
            <small>Share location and alert family</small>
          </button>

          <div className="quickGrid" aria-label="Daily check in">
            <button type="button" onClick={() => setCheckIn("ok")}>
              <span>I am okay</span>
            </button>
            <button type="button" onClick={() => setCheckIn("help")}>
              <span>I need help</span>
            </button>
            <button type="button" onClick={() => setCheckIn("medicine")}>
              <span>I took medicine</span>
            </button>
          </div>
        </div>
      </section>

      <section className="dashboard" aria-label="CareAnchor feature demo">
        <div className="patientPanel">
          <div className="sectionHeading">
            <span>Calm guidance</span>
            <h2>Simple steps when confusion starts</h2>
          </div>

          <div className="stepList">
            {steps.map((step, index) => (
              <div className="stepItem" key={step}>
                <strong>{index + 1}</strong>
                <p>{step}</p>
              </div>
            ))}
          </div>

          <div className="voiceCard">
            <div>
              <span className="smallLabel">Family voice note</span>
              <h3>{voicePlaying ? "Playing Asha's message" : "Asha says you are safe"}</h3>
              <p>
                "Hi Ma, I can see your location. Stay calm. I am coming to you."
              </p>
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

          <div className={`alertCard ${lostMode ? "alertOn" : ""}`}>
            <div>
              <span className="smallLabel">Latest alert</span>
              <h3>{lostMode ? "Lost-mode alert from Meera" : "No emergency alerts"}</h3>
              <p>
                {lostMode
                  ? "Current location shared near Rose Garden Park. Safe-zone boundary was crossed 3 minutes ago."
                  : "Meera checked in as okay. Safe zone, medication, and routine are normal."}
              </p>
            </div>
            <button
              className="softButton compact"
              type="button"
              onClick={() => setLostMode((value) => !value)}
            >
              {lostMode ? "Resolve" : "Demo alert"}
            </button>
          </div>

          <div className="mapCard" aria-label="Safe zone map demo">
            <div className="mapSurface">
              <span className="homeDot">Home</span>
              <span className={`personDot ${lostMode ? "outside" : ""}`}>Meera</span>
              <div className="safeRing" />
            </div>
            <div>
              <span className="smallLabel">Safe zone</span>
              <h3>{lostMode ? "Outside usual area" : "Inside usual area"}</h3>
              <p>
                {lostMode
                  ? "SMS alert prepared with live location and home address."
                  : "Location sharing is active with family circle."}
              </p>
            </div>
          </div>

          <div className="contactList">
            {contacts.map((contact) => (
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
    </main>
  );
}
