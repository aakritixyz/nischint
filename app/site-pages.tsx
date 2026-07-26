import Link from "next/link";

type Detail = {
  title: string;
  body: string;
};

export type SitePageConfig = {
  eyebrow: string;
  title: string;
  intro: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  highlights: Detail[];
  sections: Array<{
    title: string;
    body: string;
    items: Detail[];
  }>;
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/care", label: "Care" },
  { href: "/demo", label: "App" },
  { href: "/privacy", label: "Privacy" },
  { href: "/about", label: "About" },
];

export const sitePages = {
  care: {
    eyebrow: "For families",
    title: "Caregiver onboarding that explains exactly how Nischint helps.",
    intro:
      "Nischint keeps the senior screen calm while giving family members the context they need during check-ins, medicine reminders, and moments of confusion.",
    primaryCta: { label: "Open Nischint", href: "/#safety" },
    secondaryCta: { label: "Read privacy promise", href: "/privacy" },
    highlights: [
      {
        title: "Simple senior flow",
        body: "The senior can say they are okay, ask for help, confirm medicine, or enter lost mode with large touch targets.",
      },
      {
        title: "Clear caregiver roles",
        body: "Primary, backup, and clinical contacts can have different alert and viewing permissions.",
      },
      {
        title: "Escalation explained",
        body: "The app shows a 0, 10, and 20 minute alert ladder for family follow-up.",
      },
    ],
    sections: [
      {
        title: "Getting started",
        body: "A family member sets up the senior profile, safe-zone details, emergency notes, language, voice comfort, and caregiver contacts.",
        items: [
          { title: "Profile", body: "Save the senior name, home address, medical note, language, and calming message." },
          { title: "Contacts", body: "Add primary family, nearby backup, and clinical contacts with alert permissions." },
          { title: "Consent", body: "Keep location sharing, emergency-card visibility, and caregiver access visible and revocable." },
        ],
      },
      {
        title: "Caregiver responsibilities",
        body: "Nischint supports family coordination; it does not replace emergency services, medical advice, or human judgement.",
        items: [
          { title: "Respond quickly", body: "Treat lost-mode and help requests as real until confirmed safe." },
          { title: "Keep details updated", body: "Review phone numbers, medicine reminders, home address, and clinical notes regularly." },
          { title: "Respect privacy", body: "Use location and health context only for care support and keep consent current." },
        ],
      },
    ],
  },
  demo: {
    eyebrow: "Live workflow",
    title: "Try the senior safety flow and caregiver dashboard preview.",
    intro:
      "The app walkthrough shows lost mode, safe check-ins, reminders, location sharing, voice guidance, family alerts, and privacy actions.",
    primaryCta: { label: "Launch Nischint app", href: "/#safety" },
    secondaryCta: { label: "View caregiver guide", href: "/care" },
    highlights: [
      {
        title: "Senior interface",
        body: "Use the big I feel lost button, check-ins, language toggle, and read-aloud support.",
      },
      {
        title: "Emergency simulation",
        body: "Trigger lost mode and watch alert status, location messaging, and escalation context change.",
      },
      {
        title: "Family preview",
        body: "See safe-zone status, contacts, notes, reminders, AI guidance, and event history.",
      },
    ],
    sections: [
      {
        title: "Care scenarios",
        body: "Use these simple scenarios for a presentation or product walkthrough.",
        items: [
          { title: "Lost outside home", body: "Press I feel lost, share location, and show the caregiver alert card." },
          { title: "Medicine confirmed", body: "Tap I took medicine and show the daily timeline updating." },
          { title: "Voice support", body: "Turn voice on, tap Listen, or use Speak with a clear help/check-in phrase." },
        ],
      },
      {
        title: "Production boundaries",
        body: "Real emergency use needs verified caregivers, tested SMS delivery, legal review, monitoring, and field validation.",
        items: [
          { title: "Provider setup", body: "SMS, WhatsApp, AI, and database providers need production credentials." },
          { title: "Device permissions", body: "GPS, notifications, speech, and vibration depend on the browser and phone settings." },
          { title: "Safety disclaimer", body: "Nischint is care-support software, not a replacement for emergency services." },
        ],
      },
    ],
  },
  privacy: {
    eyebrow: "Consent first",
    title: "Privacy policy for a care app that handles sensitive moments.",
    intro:
      "Nischint is designed around visible consent, limited collection, caregiver transparency, and clear data rights before real-world use.",
    primaryCta: { label: "Open consent tools", href: "/#privacy" },
    secondaryCta: { label: "Contact privacy team", href: "/contact" },
    highlights: [
      {
        title: "Location with permission",
        body: "Location is shared only after browser permission and should remain visible to the senior and caregiver.",
      },
      {
        title: "Care data minimization",
        body: "Profiles, contacts, reminders, notes, and emergency details should be limited to what the safety flow needs.",
      },
      {
        title: "Audit trail",
        body: "Consent actions, privacy requests, and caregiver events are tracked in the care timeline.",
      },
    ],
    sections: [
      {
        title: "Data Nischint may collect",
        body: "The app stores care-state data. A production system needs a full privacy notice before collecting real personal or health data.",
        items: [
          { title: "Care profile", body: "Name, language, home address, emergency note, calming message, and safe-zone settings." },
          { title: "Care contacts", body: "Names, roles, phone numbers, alert permissions, and access levels." },
          { title: "Activity data", body: "Check-ins, reminders, location status, lost-mode events, notes, consent updates, and privacy requests." },
        ],
      },
      {
        title: "Rights and safeguards",
        body: "Production use should support privacy rights under GDPR, India's DPDP Act, and HIPAA-ready health-data controls where applicable.",
        items: [
          { title: "Consent withdrawal", body: "Families should be able to pause location sharing and emergency-card visibility." },
          { title: "Export and delete", body: "Users should be able to request data export and deletion with a clear fulfilment timeline." },
          { title: "Third parties", body: "Twilio, WhatsApp, Google Maps, AI providers, email, push, and analytics tools must be named in production notices." },
        ],
      },
      {
        title: "Security direction",
        body: "Production Nischint should use TLS, encryption at rest, strict keys, caregiver authentication, MFA, access logs, and incident response procedures.",
        items: [
          { title: "Encryption", body: "TLS 1.3 in transit and AES-256 at rest with managed key rotation." },
          { title: "Access control", body: "Role-based caregiver, backup, clinical, and admin access with session revocation." },
          { title: "Retention", body: "Detailed location history should expire or aggregate according to published retention rules." },
        ],
      },
    ],
  },
  about: {
    eyebrow: "Why Nischint",
    title: "A calm safety companion for older adults and the families who care for them.",
    intro:
      "Nischint means peace of mind. The project focuses on practical real-time support when someone is confused, lost, unwell, or unable to explain what they need.",
    primaryCta: { label: "Open the app", href: "/demo" },
    secondaryCta: { label: "See roadmap", href: "/api/nischint/architecture" },
    highlights: [
      {
        title: "Problem",
        body: "Families need faster context when a loved one misses medicine, wanders, or feels disoriented.",
      },
      {
        title: "Solution",
        body: "Reduce decisions for the senior and give caregivers actionable status, contacts, location, and calm guidance.",
      },
      {
        title: "Approach",
        body: "Mobile-first, bilingual, consent-first, accessible, and ready to grow into a production care platform.",
      },
    ],
    sections: [
      {
        title: "Mission",
        body: "Help older adults remain independent while giving families a gentler way to respond during vulnerable moments.",
        items: [
          { title: "Calm technology", body: "The senior screen avoids clutter and keeps important actions obvious." },
          { title: "Family clarity", body: "Caregivers get a structured picture instead of scattered calls and messages." },
          { title: "Meaningful project", body: "The app shows real-time help, not only static memory preservation." },
        ],
      },
      {
        title: "Roadmap",
        body: "The current Vercel app is the live MVP. The production roadmap splits senior, family, admin, and public experiences with stronger infrastructure.",
        items: [
          { title: "Next", body: "Finish verified alerts, caregiver accounts, normalized database tables, and privacy workflows." },
          { title: "Later", body: "Add native app support, WebSocket location, monitoring, stronger compliance, and health integrations." },
          { title: "Always", body: "Keep the senior experience simple, readable, forgiving, and consent-led." },
        ],
      },
    ],
  },
  contact: {
    eyebrow: "Support",
    title: "Contact and support paths for families evaluating Nischint.",
    intro:
      "Use this page as the public support surface for privacy questions, app help, partnership requests, and caregiver onboarding.",
    primaryCta: { label: "Email project team", href: "mailto:hello@nischint.app" },
    secondaryCta: { label: "Read FAQ", href: "/faq" },
    highlights: [
      { title: "Privacy questions", body: "Ask about consent, data export, deletion, retention, and third-party providers." },
      { title: "App help", body: "Get guidance for presenting the lost-mode, location, reminders, voice, and caregiver flows." },
      { title: "Partnerships", body: "Discuss elder care, healthcare, community, or safety pilot opportunities." },
    ],
    sections: [
      {
        title: "Before contacting",
        body: "For urgent real-life safety concerns, contact local emergency services or trusted family directly. Nischint must be paired with real safety plans.",
        items: [
          { title: "Access code", body: "Use 2486 for the family login." },
          { title: "Provider setup", body: "SMS, WhatsApp, AI, and database keys must be configured before production tests." },
          { title: "Feedback", body: "Note the device, browser, route, and exact action if something feels unclear." },
        ],
      },
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Common questions for families, judges, and caregivers.",
    intro:
      "Short answers for the app walkthrough, safety expectations, privacy model, and production readiness.",
    primaryCta: { label: "Open app", href: "/demo" },
    secondaryCta: { label: "Care guide", href: "/care" },
    highlights: [
      { title: "Is this live emergency software?", body: "Not yet. It is a production-minded MVP and must be paired with real emergency plans." },
      { title: "Can it help elderly users?", body: "Yes. The language is elder-safety focused, not limited to dementia." },
      { title: "Does AI make decisions?", body: "No. AI can draft calm guidance and summaries; escalation rules stay explicit." },
    ],
    sections: [
      {
        title: "Product FAQ",
        body: "Nischint should always be presented as care support, not a replacement for family judgement or emergency services.",
        items: [
          { title: "What happens when I feel lost is pressed?", body: "The app enters lost mode, shows guidance, can share location, and queues caregiver alerts." },
          { title: "Can someone use it without reading?", body: "The app includes read-aloud and voice command support when the browser supports it." },
          { title: "What is left for production?", body: "Real accounts, verified alert delivery, formal privacy/legal review, monitoring, and field testing." },
          { title: "Why separate pages?", body: "Families need clear privacy, care, app, and trust information without overloading the senior screen." },
        ],
      },
    ],
  },
} satisfies Record<string, SitePageConfig>;

export function SiteInfoPage({ page }: { page: SitePageConfig }) {
  return (
    <main className="shell routeShell">
      <header className="topBar routeTop" aria-label="Nischint pages">
        <Link className="brandLockup" href="/" aria-label="Nischint home">
          <span>नि</span>
          <strong>Nischint</strong>
        </Link>
        <nav aria-label="Site pages">
          {navLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="routeHero" aria-labelledby="route-title">
        <p className="smallLabel">{page.eyebrow}</p>
        <h1 id="route-title">{page.title}</h1>
        <p>{page.intro}</p>
        <div className="routeActions">
          {page.primaryCta ? (
            <Link className="primaryButton" href={page.primaryCta.href}>
              {page.primaryCta.label}
            </Link>
          ) : null}
          {page.secondaryCta ? (
            <Link className="softButton" href={page.secondaryCta.href}>
              {page.secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </section>

      <section className="routeHighlightGrid" aria-label="Page highlights">
        {page.highlights.map((item) => (
          <article className="featureTile" key={item.title}>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      {page.sections.map((section) => (
        <section className="routeSection" key={section.title}>
          <div className="sectionHeading">
            <span>{page.eyebrow}</span>
            <h2>{section.title}</h2>
          </div>
          <p>{section.body}</p>
          <div className="routeInfoGrid">
            {section.items.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
