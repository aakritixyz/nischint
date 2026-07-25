"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CheckIn = "ok" | "help" | "medicine";
type Language = "en" | "hi";

type BrowserSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: {
    results: ArrayLike<{ 0: { transcript: string } }>;
  }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

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

const hindiGuidance: Guidance = {
  title: "आप अभी सुरक्षित हैं",
  message: "आपके घर का पता और परिवार के संपर्क सुरक्षित हैं।",
  steps: ["धीरे-धीरे सांस लें।", "जहां हैं वहीं रुकें।", "जरूरत हो तो मदद वाला बटन दबाएं।"],
};

const languageCopy = {
  en: {
    welcomeEyebrow: "Welcome to Nischint",
    welcomeTitle: "Set up gentle support before entering",
    welcomeCopy:
      "Choose the language and voice comfort level first, so the app feels calm and personal from the very first screen.",
    personName: "Senior name",
    accessCode: "Family access code",
    voiceChoice: "Voice guidance",
    voiceChoiceOn: "Keep voice guidance on",
    voiceChoiceOff: "Use buttons only",
    startApp: "Enter Nischint",
    demoCodeHint: "Demo access code: 2486",
    voiceOff: "Voice guidance is off. Button actions will still work.",
    recognized: (phrase: string) => `Heard: "${phrase}".`,
    commandNotFound: "I did not understand that. Try saying help, lost, okay, or medicine.",
    brandTag: "Elder safety & family care",
    heroDescription:
      "A calm mobile-first companion for seniors who may feel confused or lost, and for families who need quick, clear safety updates.",
    navCare: "Care",
    navDemo: "Demo",
    navPrivacy: "Privacy",
    lost: "I feel lost",
    lostSubtitle: "Share location and alert family",
    safe: "I am safe",
    ready: "ready",
    guarded: "guarded",
    consentFirst: "first",
    seniorView: "Senior view",
    synced: "Care synced",
    offline: "Offline ready",
    helpMode: "Help mode",
    today: "Today",
    rightNow: "Right now",
    nowTitle: "Today, 8:30 AM",
    okay: "I am okay",
    needHelp: "I need help",
    medicine: "I took medicine",
    emergencyLabel: "Show if help is needed",
    needsSupport: "may need support",
    call: "Call",
    sendAlert: "Send alert",
    languageLabel: "Language",
    autoVoice: "Auto voice",
    listen: "Listen",
    stop: "Stop",
    speak: "Voice command",
    listening: "Listening...",
    voiceReady: "Voice guidance is ready",
    voiceUnsupported: "Voice commands are not available on this browser. Read-aloud still works.",
    commandHelp: "Say: I feel lost, I am okay, or I took medicine.",
    familyVoice: "Family reassurance",
    playingMessage: "Playing reassurance",
    familySays: (name: string) => `${name} says you are safe`,
    play: "Listen",
    statusAlert: "Caregiver alert active",
    statusAlertDetail: (name: string) => `${name} received location, home address, and emergency info.`,
    statusHelp: "Help request sent",
    statusHelpDetail: "Family sees that support is needed soon.",
    statusMedicine: "Medicine confirmed",
    statusMedicineDetail: "Morning tablet marked complete at 8:30 AM.",
    statusOkay: "All okay",
    statusOkayDetail: "Daily check-in complete. Safe zone is normal.",
    orientation: (name: string, location: string, home: string) =>
      `${name} is near ${location}. Home is saved as ${home}.`,
    voiceSummary: (name: string, location: string, home: string) =>
      `You are safe, ${name}. You are near ${location}. Your home is saved as ${home}. Press I feel lost if you need family help.`,
    lostVoice: "Stay calm. Your family is being alerted. Stay where you are and listen for the next step.",
    okayVoice: "Thank you. Your family can see that you are okay.",
    helpVoice: "Your help request has been shared with family.",
    medicineVoice: "Medicine has been marked as taken.",
    languageSelected: "English selected. Voice guidance is ready.",
    calmingMessage: "Hi Ma, I can see your location. Stay calm. I am coming to you.",
  },
  hi: {
    welcomeEyebrow: "निश्चिंत में आपका स्वागत है",
    welcomeTitle: "पहले अपनी सुविधा चुनें",
    welcomeCopy:
      "भाषा और आवाज की सुविधा पहले चुनें, ताकि ऐप शुरुआत से ही सरल और शांत लगे।",
    personName: "वरिष्ठ का नाम",
    accessCode: "परिवार का एक्सेस कोड",
    voiceChoice: "आवाज की सहायता",
    voiceChoiceOn: "आवाज की सहायता चालू रखें",
    voiceChoiceOff: "सिर्फ बटन इस्तेमाल करें",
    startApp: "निश्चिंत खोलें",
    demoCodeHint: "डेमो एक्सेस कोड: 2486",
    voiceOff: "आवाज की सहायता बंद है। बटन फिर भी काम करेंगे।",
    recognized: (phrase: string) => `सुना गया: "${phrase}"।`,
    commandNotFound: "समझ नहीं आया। मदद, रास्ता, ठीक, या दवा बोलकर देखें।",
    brandTag: "वरिष्ठ सुरक्षा और परिवार की देखभाल",
    heroDescription:
      "वरिष्ठों के लिए एक सरल साथी, जो रास्ता भूलने या घबराहट के समय परिवार से जल्दी संपर्क कराता है।",
    navCare: "देखभाल",
    navDemo: "डेमो",
    navPrivacy: "गोपनीयता",
    lost: "मुझे रास्ता नहीं मिल रहा",
    lostSubtitle: "स्थान साझा करें और परिवार को सूचना दें",
    safe: "मैं सुरक्षित हूं",
    ready: "तैयार",
    guarded: "सुरक्षित",
    consentFirst: "सहमति",
    seniorView: "वरिष्ठ स्क्रीन",
    synced: "परिवार जुड़ा है",
    offline: "ऑफलाइन तैयार",
    helpMode: "मदद चालू",
    today: "आज",
    rightNow: "अभी",
    nowTitle: "आज, सुबह 8:30 बजे",
    okay: "मैं ठीक हूं",
    needHelp: "मुझे मदद चाहिए",
    medicine: "मैंने दवा ले ली",
    emergencyLabel: "मदद की जरूरत हो तो दिखाएं",
    needsSupport: "को सहायता की जरूरत हो सकती है",
    call: "कॉल करें",
    sendAlert: "सूचना भेजें",
    languageLabel: "भाषा",
    autoVoice: "आवाज अपने आप",
    listen: "सुनें",
    stop: "रोकें",
    speak: "आवाज से बोलें",
    listening: "सुन रहे हैं...",
    voiceReady: "आवाज से सहायता तैयार है",
    voiceUnsupported: "इस ब्राउजर में बोलकर आदेश देना उपलब्ध नहीं है। सुनने की सुविधा काम करेगी।",
    commandHelp: "कहें: मुझे मदद चाहिए, मैं ठीक हूं, या मैंने दवा ले ली।",
    familyVoice: "परिवार का भरोसा",
    playingMessage: "परिवार का संदेश चल रहा है",
    familySays: (name: string) => `${name} कहती हैं कि आप सुरक्षित हैं`,
    play: "सुनें",
    statusAlert: "परिवार को सूचना भेजी गई",
    statusAlertDetail: (name: string) => `${name} को स्थान, घर का पता और जरूरी जानकारी मिल गई है।`,
    statusHelp: "मदद का संदेश भेजा गया",
    statusHelpDetail: "परिवार को पता है कि जल्द सहायता चाहिए।",
    statusMedicine: "दवा की पुष्टि हुई",
    statusMedicineDetail: "सुबह की दवा 8:30 बजे पूरी दिखाई गई है।",
    statusOkay: "सब ठीक है",
    statusOkayDetail: "आज की जानकारी पूरी है। सुरक्षित क्षेत्र सामान्य है।",
    orientation: (name: string, location: string, home: string) =>
      `${name}, आप ${location} के पास हैं। आपके घर का पता ${home} है।`,
    voiceSummary: (name: string, location: string, home: string) =>
      `${name}, आप सुरक्षित हैं। आप ${location} के पास हैं। आपके घर का पता ${home} है। परिवार की मदद चाहिए तो मदद वाला बटन दबाएं।`,
    lostVoice: "शांत रहें। परिवार को सूचना भेजी जा रही है। जहां हैं वहीं रुकें और अगला निर्देश सुनें।",
    okayVoice: "धन्यवाद। परिवार को पता चल गया है कि आप ठीक हैं।",
    helpVoice: "आपकी मदद की सूचना परिवार को भेज दी गई है।",
    medicineVoice: "दवा लेने की जानकारी दर्ज हो गई है।",
    languageSelected: "हिंदी चुनी गई है। आवाज से सहायता तैयार है।",
    calmingMessage: "मां, मुझे आपका स्थान दिख रहा है। शांत रहें। मैं आपके पास आ रही हूं।",
  },
} as const;

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
  "English + Hindi voice",
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

const howItWorks = [
  {
    step: "1",
    title: "Set preferences",
    detail: "Choose language, voice support, caregiver contact, and consent.",
  },
  {
    step: "2",
    title: "Use one clear action",
    detail: "Press lost, okay, help, or medicine with large senior-friendly buttons.",
  },
  {
    step: "3",
    title: "Family gets context",
    detail: "Caregivers see location status, home address, escalation, and notes.",
  },
];

const escalationSteps = [
  { time: "0 min", title: "Primary alert", detail: "Asha receives SMS, location, and emergency card." },
  { time: "10 min", title: "Backup contact", detail: "Ravi is notified if the alert is still unresolved." },
  { time: "20 min", title: "Care handoff", detail: "Doctor or neighbor handoff appears for the family." },
];

const trustSignals = [
  { label: "Consent-led", detail: "Location and emergency info are separate permissions." },
  { label: "Offline card", detail: "Key safety details remain visible during poor network." },
  { label: "Family use case", detail: "Built around check-ins, wandering risk, and medicine routines." },
];

const familyUseCases = [
  {
    quote: "My father can press one button instead of explaining where he is.",
    family: "Caregiver for a senior living independently",
  },
  {
    quote: "The medicine check-in makes the daily call calmer for everyone.",
    family: "Daughter coordinating morning care",
  },
];

const faqItems = [
  {
    question: "Is this an emergency service?",
    answer: "No. It is a care-support prototype and should be paired with real emergency plans.",
  },
  {
    question: "Does voice always work?",
    answer: "Read-aloud works in most modern browsers. Voice commands depend on browser support.",
  },
  {
    question: "Can families control privacy?",
    answer: "The demo separates location, emergency-card consent, export, and delete requests.",
  },
];

export default function Home() {
  const [careState, setCareState] = useState<CareState>(fallbackState);
  const [guidance, setGuidance] = useState<Guidance>(defaultGuidance);
  const [hasEntered, setHasEntered] = useState(false);
  const [backendReady, setBackendReady] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [locationStatus, setLocationStatus] = useState("Demo mode: GPS has not been shared yet");
  const [notificationStatus, setNotificationStatus] = useState("Demo mode: alerts are simulated until provider keys are added");
  const [actionBusy, setActionBusy] = useState<string | null>(null);
  const [demoTime, setDemoTime] = useState(new Date());
  const [screenAnnouncement, setScreenAnnouncement] = useState("Nischint is ready");
  const [noteDraft, setNoteDraft] = useState("");
  const [reminderTitle, setReminderTitle] = useState("Evening walk");
  const [reminderTime, setReminderTime] = useState("17:30");
  const [inviteName, setInviteName] = useState("Neha");
  const [inviteContact, setInviteContact] = useState("neha@example.com");
  const [privacyStatus, setPrivacyStatus] = useState("No privacy request queued");
  const [locationConsent, setLocationConsent] = useState(true);
  const [emergencyConsent, setEmergencyConsent] = useState(true);
  const [caregiverAccessCode, setCaregiverAccessCode] = useState("2486");
  const [language, setLanguage] = useState<Language>("en");
  const [voiceAssist, setVoiceAssist] = useState(true);
  const [onboardingVoiceAssist, setOnboardingVoiceAssist] = useState(true);
  const [voiceStatus, setVoiceStatus] = useState<string>(languageCopy.en.voiceReady);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null);
  const copy = languageCopy[language];
  const activeGuidance = language === "hi" ? hindiGuidance : guidance;
  const formattedDemoTime = demoTime.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
  const networkLabel =
    careState.location.networkStatus === "offline"
      ? "Offline mode"
      : careState.location.networkStatus === "weak"
        ? "Weak network"
        : "Online";
  const networkClass =
    careState.location.networkStatus === "offline"
      ? "offline"
      : careState.location.networkStatus === "weak"
        ? "caution"
        : "safe";
  const isSafeCheckIn = !careState.lostMode && careState.checkIn === "ok";

  const status = useMemo(() => {
    if (careState.lostMode) {
      return {
        label: copy.statusAlert,
        detail: copy.statusAlertDetail(careState.contacts[0]?.name ?? "Family"),
        className: "statusAlert",
        icon: "!",
      };
    }

    if (careState.checkIn === "help") {
      return {
        label: copy.statusHelp,
        detail: copy.statusHelpDetail,
        className: "statusWatch",
        icon: "?",
      };
    }

    if (careState.checkIn === "medicine") {
      return {
        label: copy.statusMedicine,
        detail: copy.statusMedicineDetail,
        className: "statusGood",
        icon: "✓",
      };
    }

    return {
      label: copy.statusOkay,
      detail: copy.statusOkayDetail,
      className: "statusGood",
      icon: "✓",
    };
  }, [careState, copy]);

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

  function stopSpeaking() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    recognitionRef.current?.stop();
    setIsListening(false);
    setVoicePlaying(false);
    setVoiceStatus(copy.voiceReady);
  }

  function speakText(text: string, spokenLanguage: Language = language, force = false) {
    if (!voiceAssist && !force) {
      setVoiceStatus(languageCopy[spokenLanguage].voiceOff);
      return;
    }

    if (!("speechSynthesis" in window)) {
      setVoiceStatus(languageCopy[spokenLanguage].voiceUnsupported);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const locale = spokenLanguage === "hi" ? "hi-IN" : "en-IN";
    const matchingVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang.toLowerCase().startsWith(spokenLanguage));

    utterance.lang = matchingVoice?.lang ?? locale;
    if (matchingVoice) utterance.voice = matchingVoice;
    utterance.rate = spokenLanguage === "hi" ? 0.78 : 0.82;
    utterance.pitch = 0.96;
    utterance.volume = 1;
    utterance.onstart = () => {
      setVoicePlaying(true);
      setVoiceStatus(languageCopy[spokenLanguage].playingMessage);
    };
    utterance.onend = () => {
      setVoicePlaying(false);
      setVoiceStatus(languageCopy[spokenLanguage].voiceReady);
    };
    utterance.onerror = () => {
      setVoicePlaying(false);
      setVoiceStatus(languageCopy[spokenLanguage].voiceUnsupported);
    };
    window.speechSynthesis.speak(utterance);
  }

  function readCurrentScreen() {
    if (voicePlaying) {
      stopSpeaking();
      return;
    }

    speakText(
      copy.voiceSummary(
        careState.patient.name,
        careState.location.label,
        careState.patient.homeAddress
      )
    );
  }

  function selectLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    setVoiceStatus(languageCopy[nextLanguage].voiceReady);
    setCareState((state) => ({
      ...state,
      patient: {
        ...state.patient,
        preferredLanguage: nextLanguage === "hi" ? "Hindi" : "English",
      },
    }));
    window.localStorage.setItem("nischint-language", nextLanguage);
    if (hasEntered && voiceAssist) {
      speakText(languageCopy[nextLanguage].languageSelected, nextLanguage);
    }
  }

  function setVoicePreference(enabled: boolean) {
    setVoiceAssist(enabled);
    setOnboardingVoiceAssist(enabled);
    window.localStorage.setItem("nischint-voice-assist", String(enabled));
    if (!enabled) {
      stopSpeaking();
      return;
    }
    speakText(copy.languageSelected);
  }

  function enterNischint() {
    setVoiceAssist(onboardingVoiceAssist);
    window.localStorage.setItem("nischint-has-entered", "true");
    window.localStorage.setItem("nischint-voice-assist", String(onboardingVoiceAssist));
    window.localStorage.setItem("nischint-language", language);
    setHasEntered(true);

    if (onboardingVoiceAssist) {
      window.setTimeout(() => speakText(copy.languageSelected, language, true), 120);
    } else {
      setVoiceStatus(copy.voiceOff);
    }
  }

  function normalizeCommand(phrase: string) {
    return phrase
      .toLocaleLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function commandIntent(transcript: string): CheckIn | "lost" | null {
    const phrase = normalizeCommand(transcript);
    const lostWords = [
      "i feel lost",
      "i am lost",
      "im lost",
      "lost",
      "help me",
      "need help",
      "emergency",
      "take me home",
      "home",
      "ghar",
      "madad",
      "mujhe madad chahiye",
      "rasta nahi mil raha",
      "raasta nahi mil raha",
      "मदद",
      "रास्ता",
      "घर",
      "खो",
    ];
    const medicineWords = ["medicine", "tablet", "pill", "took medicine", "dawa", "दवा", "गोली"];
    const okayWords = ["okay", "ok", "i am okay", "i am safe", "safe", "fine", "theek", "ठीक", "सुरक्षित"];

    if (lostWords.some((word) => phrase.includes(word))) return "lost";
    if (medicineWords.some((word) => phrase.includes(word))) return "medicine";
    if (okayWords.some((word) => phrase.includes(word))) return "ok";

    return null;
  }

  async function keepScreenAwake() {
    const wakeNavigator = navigator as Navigator & {
      wakeLock?: {
        request(type: "screen"): Promise<{ release: () => Promise<void> }>;
      };
    };

    try {
      wakeLockRef.current = await wakeNavigator.wakeLock?.request("screen") ?? null;
    } catch {
      wakeLockRef.current = null;
    }
  }

  async function activateLostMode() {
    setActionBusy("lost");
    setScreenAnnouncement("Emergency demo started. Caregiver alert is active.");
    navigator.vibrate?.([180, 90, 180]);
    void keepScreenAwake();
    if (voiceAssist) speakText(copy.lostVoice);
    await syncLostMode(true);
    if (locationConsent) void shareLocation();
    void notifyCaregiver("sms");
    setActionBusy(null);
  }

  async function completeCheckIn(checkIn: CheckIn) {
    setActionBusy(checkIn);
    setScreenAnnouncement(
      checkIn === "help"
        ? "Help request sent to caregiver."
        : checkIn === "medicine"
          ? "Medicine check-in recorded."
          : "Safe check-in recorded."
    );
    navigator.vibrate?.(80);
    if (voiceAssist) {
      const spokenMessage =
        checkIn === "medicine"
          ? copy.medicineVoice
          : checkIn === "help"
            ? copy.helpVoice
            : copy.okayVoice;
      speakText(spokenMessage);
    }
    await syncCheckIn(checkIn);
    if (checkIn === "help") void notifyCaregiver("sms");
    if (checkIn !== "help") {
      void wakeLockRef.current?.release();
      wakeLockRef.current = null;
    }
    setActionBusy(null);
  }

  async function simulateEmergencyFlow() {
    setNotificationStatus("Demo emergency: primary caregiver notified, backup timer started");
    setLocationStatus("Demo emergency: using saved safe-zone location until GPS is allowed");
    await activateLostMode();
  }

  async function resetDemo() {
    stopSpeaking();
    setActionBusy("reset");
    setCareState(fallbackState);
    setGuidance(defaultGuidance);
    setLocationStatus("Demo mode: GPS has not been shared yet");
    setNotificationStatus("Demo mode: alerts are simulated until provider keys are added");
    setPrivacyStatus("No privacy request queued");
    setScreenAnnouncement("Demo reset. Nischint is ready.");
    setNoteDraft("");
    setReminderTitle("Evening walk");
    setReminderTime("17:30");
    setActionBusy(null);
  }

  function toggleOfflineDemo() {
    setCareState((state) => {
      const nextNetwork = state.location.networkStatus === "offline" ? "online" : "offline";
      setScreenAnnouncement(
        nextNetwork === "offline"
          ? "Offline mode demo is on. Emergency card remains visible."
          : "Online mode restored."
      );
      return {
        ...state,
        location: {
          ...state.location,
          networkStatus: nextNetwork,
        },
      };
    });
  }

  function listenForCommand() {
    const speechWindow = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceStatus(copy.voiceUnsupported);
      speakText(copy.commandHelp);
      return;
    }

    stopSpeaking();
    const recognition = new Recognition();
    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      const intent = commandIntent(transcript);
      setVoiceStatus(transcript ? copy.recognized(transcript) : copy.commandHelp);

      if (intent === "lost") {
        void activateLostMode();
      } else if (intent === "medicine") {
        void completeCheckIn("medicine");
      } else if (intent === "ok") {
        void completeCheckIn("ok");
      } else {
        setVoiceStatus(copy.commandNotFound);
        if (voiceAssist) speakText(copy.commandNotFound);
      }
    };
    recognition.onerror = () => {
      setVoiceStatus(copy.commandHelp);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    setIsListening(true);
    setVoiceStatus(copy.listening);
    recognition.start();
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
    setActionBusy("profile");
    try {
      const payload = await callApi("/api/nischint/onboarding", {
        patient: careState.patient,
        contacts: careState.contacts,
      });
      if (payload.state) applyState(payload.state);
      setScreenAnnouncement("Care profile saved.");
    } catch {
      setBackendReady(false);
    } finally {
      setActionBusy(null);
    }
  }

  async function shareLocation() {
    if (!locationConsent) {
      setLocationStatus("Location consent is off");
      setScreenAnnouncement("Location consent is off.");
      return;
    }

    if (!("geolocation" in navigator)) {
      setLocationStatus("GPS is unavailable on this device");
      setScreenAnnouncement("GPS is unavailable on this device.");
      return;
    }

    setLocationStatus("Requesting GPS permission...");
    setActionBusy("location");
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
        setScreenAnnouncement("Live location shared with caregiver.");
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
        } finally {
          setActionBusy(null);
        }
      },
      () => {
        setLocationStatus("GPS permission was not granted. Demo safe-zone view is still available.");
        setScreenAnnouncement("GPS permission was not granted.");
        setActionBusy(null);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  async function notifyCaregiver(channel: "sms" | "whatsapp" | "push") {
    setActionBusy(channel);
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
      setScreenAnnouncement(`${channel} caregiver alert queued.`);
    } catch {
      setBackendReady(false);
    } finally {
      setActionBusy(null);
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
      setScreenAnnouncement("Caregiver note added.");
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
      setScreenAnnouncement("Reminder added.");
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
      setScreenAnnouncement("Caregiver invite created.");
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
      setScreenAnnouncement(type === "export" ? "Data export queued." : "Delete request queued.");
    } catch {
      setBackendReady(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    const savedLanguage = window.localStorage.getItem("nischint-language");
    const savedVoiceAssist = window.localStorage.getItem("nischint-voice-assist");
    const savedHasEntered = window.localStorage.getItem("nischint-has-entered");
    const tick = window.setInterval(() => setDemoTime(new Date()), 30000);

    const restorePreferences = window.setTimeout(() => {
      if (savedLanguage === "hi" || savedLanguage === "en") {
        setLanguage(savedLanguage);
        setVoiceStatus(languageCopy[savedLanguage].voiceReady);
      }
      if (savedVoiceAssist === "false") {
        setVoiceAssist(false);
        setOnboardingVoiceAssist(false);
      }
      if (savedVoiceAssist === "true") setOnboardingVoiceAssist(true);
      if (savedHasEntered === "true") setHasEntered(true);
    }, 0);

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
      window.clearTimeout(restorePreferences);
      window.clearInterval(tick);
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
      void wakeLockRef.current?.release();
    };
    // The initial API and browser preference sync intentionally runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const appClassName = `shell ${largeText ? "largeText" : ""} ${highContrast ? "highContrast" : ""}`;

  if (!hasEntered) {
    return (
      <main
        className={`${appClassName} welcomeShell`}
        lang={language === "hi" ? "hi" : "en"}
      >
        <section className="welcomeGate" aria-labelledby="welcome-title">
          <div className="welcomeBrand">
            <span aria-hidden="true">नि</span>
            <div>
              <p className="smallLabel">{copy.welcomeEyebrow}</p>
              <h1 className="heroWordmark" id="welcome-title">Nischint</h1>
            </div>
          </div>

          <div className="welcomeCopy">
            <p className="scriptName" aria-hidden="true">निश्चिंत</p>
            <h2>{copy.welcomeTitle}</h2>
            <p>{copy.welcomeCopy}</p>
          </div>

          <div className="welcomeForm" aria-label="Nischint start setup">
            <label>
              {copy.personName}
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
              {copy.accessCode}
              <input
                inputMode="numeric"
                value={caregiverAccessCode}
                onChange={(event) => setCaregiverAccessCode(event.target.value)}
              />
              <small>{copy.demoCodeHint}</small>
            </label>

            <div className="welcomeChoice">
              <span>{copy.languageLabel}</span>
              <div className="languageSegment" role="group" aria-label={copy.languageLabel}>
                <button
                  className={language === "en" ? "active" : ""}
                  type="button"
                  aria-pressed={language === "en"}
                  onClick={() => selectLanguage("en")}
                >
                  English
                </button>
                <button
                  className={language === "hi" ? "active" : ""}
                  type="button"
                  aria-pressed={language === "hi"}
                  onClick={() => selectLanguage("hi")}
                >
                  हिंदी
                </button>
              </div>
            </div>

            <div className="welcomeVoiceGroup" aria-label={copy.voiceChoice}>
              <span>{copy.voiceChoice}</span>
              <button
                className={onboardingVoiceAssist ? "active" : ""}
                type="button"
                aria-pressed={onboardingVoiceAssist}
                onClick={() => setOnboardingVoiceAssist(true)}
              >
                {copy.voiceChoiceOn}
              </button>
              <button
                className={!onboardingVoiceAssist ? "active" : ""}
                type="button"
                aria-pressed={!onboardingVoiceAssist}
                onClick={() => setOnboardingVoiceAssist(false)}
              >
                {copy.voiceChoiceOff}
              </button>
            </div>

            <button className="primaryButton" type="button" onClick={enterNischint}>
              {copy.startApp}
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main
      className={appClassName}
      lang={language === "hi" ? "hi" : "en"}
    >
      <header className="topBar" aria-label="Nischint navigation">
        <a className="brandLockup" href="#nischint-title" aria-label="Nischint home">
          <span>नि</span>
          <strong>Nischint</strong>
        </a>
        <nav aria-label="Page sections">
          <a href="#care-services">{copy.navCare}</a>
          <a href="#live-demo">{copy.navDemo}</a>
          <a href="#privacy">{copy.navPrivacy}</a>
          <a href="#help">Help</a>
        </nav>
      </header>

      <p className="srOnly" role="status" aria-live="assertive">
        {screenAnnouncement}
      </p>

      <button
        className={`stickyEmergency ${careState.lostMode ? "active" : ""}`}
        type="button"
        onClick={() => void simulateEmergencyFlow()}
      >
        Emergency
      </button>

      <section className="hero" aria-labelledby="nischint-title">
        <div className="heroCopy">
          <div className="brandPill">
            <span aria-hidden="true">नि</span>
            {copy.brandTag}
          </div>
          <p className="scriptName" aria-hidden="true">निश्चिंत</p>
          <h1 className="heroWordmark" id="nischint-title">Nischint</h1>
          <p>{copy.heroDescription}</p>
          <div className="heroActions" aria-label="Primary demo actions">
            <button
              className="primaryButton emergencyPrimary"
              type="button"
              onClick={() => void activateLostMode()}
            >
              {actionBusy === "lost" ? "Alerting family..." : copy.lost}
            </button>
            <button
              className="softButton"
              type="button"
              onClick={() => void completeCheckIn("ok")}
            >
              {copy.safe}
            </button>
          </div>
          <div className="trustStrip" aria-label="Safety highlights">
            <span><strong>24/7</strong> {copy.ready}</span>
            <span><strong>PIN</strong> {copy.guarded}</span>
            <span><strong>{language === "hi" ? "सहमति" : "Consent"}</strong> {copy.consentFirst}</span>
          </div>

          <div className="statusLegend" aria-label="Live demo status">
            <span className="stateChip safe"><i />Safe</span>
            <span className="stateChip caution"><i />Caution</span>
            <span className="stateChip danger"><i />Emergency</span>
            <span className={`stateChip ${networkClass}`}><i />{networkLabel}</span>
            <span className="stateChip neutral"><i />{formattedDemoTime}</span>
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
            <span>{copy.seniorView}</span>
            <span className={`syncPill ${backendReady ? "" : "localOnly"}`}>
              {backendReady ? copy.synced : copy.offline}
            </span>
            <strong>{careState.lostMode ? copy.helpMode : copy.today}</strong>
            <span className={`networkPill ${networkClass}`}>{networkLabel}</span>
          </div>

          <div className="assistPanel" aria-label={copy.languageLabel}>
            <div className="assistHeader">
              <div className="languageSegment" role="group" aria-label={copy.languageLabel}>
                <button
                  className={language === "en" ? "active" : ""}
                  type="button"
                  aria-pressed={language === "en"}
                  onClick={() => selectLanguage("en")}
                >
                  English
                </button>
                <button
                  className={language === "hi" ? "active" : ""}
                  type="button"
                  aria-pressed={language === "hi"}
                  onClick={() => selectLanguage("hi")}
                >
                  हिंदी
                </button>
              </div>
              <label className="voiceAssistToggle">
                <input
                  checked={voiceAssist}
                  type="checkbox"
                  onChange={(event) => setVoicePreference(event.target.checked)}
                />
                <span>{copy.autoVoice}</span>
              </label>
            </div>
            <div className={`voiceActions ${voiceAssist ? "" : "voiceActionsOff"}`}>
              <button type="button" onClick={readCurrentScreen}>
                {voicePlaying ? copy.stop : copy.listen}
              </button>
              <button type="button" disabled={!voiceAssist || isListening} onClick={listenForCommand}>
                {isListening ? copy.listening : copy.speak}
              </button>
            </div>
            <p className="voiceStatus" aria-live="polite">{voiceStatus}</p>
            <p className="voiceHint">{copy.commandHelp}</p>
          </div>

          <div className={`statusBanner ${status.className}`}>
            <span><i aria-hidden="true">{status.icon}</i>{status.label}</span>
            <p>{status.detail}</p>
          </div>

          <div className="orientationCard">
            <span className="smallLabel">{copy.rightNow}</span>
            <h2>{language === "hi" ? copy.nowTitle : `Today, ${formattedDemoTime}`}</h2>
            <p>
              {copy.orientation(
                careState.patient.name,
                careState.location.label,
                careState.patient.homeAddress
              )}
            </p>
          </div>

          <button
            className={`lostButton ${careState.lostMode ? "isActive" : ""} ${isSafeCheckIn ? "isSafe" : ""}`}
            type="button"
            onClick={() => void activateLostMode()}
          >
            <span>
              {actionBusy === "lost"
                ? "Alerting..."
                : isSafeCheckIn
                  ? copy.safe
                  : copy.lost}
            </span>
            <small>{isSafeCheckIn ? copy.statusOkayDetail : copy.lostSubtitle}</small>
          </button>

          <div className="quickGrid" aria-label="Daily check in">
            <button type="button" onClick={() => void completeCheckIn("ok")}>
              <span>{copy.okay}</span>
            </button>
            <button type="button" onClick={() => void completeCheckIn("help")}>
              <span>{copy.needHelp}</span>
            </button>
            <button type="button" onClick={() => void completeCheckIn("medicine")}>
              <span>{copy.medicine}</span>
            </button>
          </div>

          <div className="emergencyCard" aria-label="Emergency information card">
            <span className="smallLabel">{copy.emergencyLabel}</span>
            <h3>{careState.patient.name} {copy.needsSupport}</h3>
            <p>
              {language === "hi"
                ? "कभी-कभी भ्रम हो सकता है। पेनिसिलिन से एलर्जी है। सुबह की दवा 8:30 बजे है।"
                : careState.patient.emergencyInfo}
            </p>
            <div className="emergencyActions">
              <a href={caregiverDialHref()}>
                {copy.call} {careState.contacts[0]?.name ?? "caregiver"}
              </a>
              <button type="button" onClick={() => void notifyCaregiver("sms")}>
                {copy.sendAlert}
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

      <section className="howBand" aria-label="How Nischint works">
        <div className="sectionHeading">
          <span>How it works</span>
          <h2>Three calm steps for a stressful moment</h2>
        </div>
        <div className="howGrid">
          {howItWorks.map((item) => (
            <article key={item.step}>
              <strong>{item.step}</strong>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
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
          <div className="profilePreview" aria-label="Saved profile preview">
            <span>Saved profile</span>
            <p><strong>{careState.patient.name}</strong> · {careState.patient.preferredLanguage}</p>
            <p>{careState.patient.homeAddress}</p>
          </div>
          <button className="softButton" type="button" onClick={() => void saveOnboarding()}>
            {actionBusy === "profile" ? "Saving..." : "Save setup"}
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
            {actionBusy === "location" ? "Requesting GPS..." : "Share live location"}
          </button>
          <div className="demoControlRow">
            <button className="dangerButton" type="button" onClick={() => void simulateEmergencyFlow()}>
              Simulate emergency
            </button>
            <button className="softButton compact" type="button" onClick={toggleOfflineDemo}>
              {careState.location.networkStatus === "offline" ? "Restore online" : "Demo offline"}
            </button>
            <button className="softButton compact" type="button" onClick={() => void resetDemo()}>
              {actionBusy === "reset" ? "Resetting..." : "Reset demo"}
            </button>
          </div>
          <div className="toggleRow">
            <button className="softButton compact" type="button" onClick={() => void notifyCaregiver("sms")}>
              {actionBusy === "sms" ? "Sending..." : "SMS"}
            </button>
            <button className="softButton compact" type="button" onClick={() => void notifyCaregiver("whatsapp")}>
              {actionBusy === "whatsapp" ? "Sending..." : "WhatsApp"}
            </button>
            <button className="softButton compact" type="button" onClick={() => void notifyCaregiver("push")}>
              {actionBusy === "push" ? "Sending..." : "Push"}
            </button>
          </div>
          <p className="panelCopy">{notificationStatus}</p>
        </article>
      </section>

      <section className="dashboard" aria-label="Nischint feature demo">
        <div className="patientPanel">
          <div className="sectionHeading">
            <span>Calm guidance</span>
            <h2>{activeGuidance.title}</h2>
          </div>
          <p className="panelCopy">{activeGuidance.message}</p>

          <div className="stepList">
            {activeGuidance.steps.map((step, index) => (
              <div className="stepItem" key={step}>
                <strong>{index + 1}</strong>
                <p>{step}</p>
              </div>
            ))}
          </div>

          <div className="voiceCard">
            <div>
              <span className="smallLabel">{copy.familyVoice}</span>
              <h3>
                {voicePlaying
                  ? copy.playingMessage
                  : copy.familySays(careState.contacts[0]?.name ?? "Family")}
              </h3>
              <p>&ldquo;{language === "hi" ? copy.calmingMessage : careState.patient.calmingMessage}&rdquo;</p>
            </div>
            <button
              className="roundButton"
              type="button"
              aria-label={voicePlaying ? copy.stop : copy.play}
              onClick={() =>
                voicePlaying
                  ? stopSpeaking()
                  : speakText(
                      language === "hi" ? copy.calmingMessage : careState.patient.calmingMessage
                    )
              }
            >
              {voicePlaying ? copy.stop : copy.play}
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

          <div className="timelineCard" aria-label="Caregiver escalation timeline">
            <span className="smallLabel">Escalation timeline</span>
            {escalationSteps.map((step, index) => (
              <div
                className={`timelineItem ${
                  careState.lostMode && index === 0
                    ? "active"
                    : careState.lostMode && index === 1
                      ? "waiting"
                      : ""
                }`}
                key={step.time}
              >
                <strong>{step.time}</strong>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                </div>
              </div>
            ))}
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

      <section className="trustBand" aria-label="Trust and family use cases">
        <div className="sectionHeading">
          <span>Trust signals</span>
          <h2>Designed around consent, clarity, and family care</h2>
        </div>
        <div className="trustGrid">
          {trustSignals.map((item) => (
            <article key={item.label}>
              <span className="badgeMark" aria-hidden="true">नि</span>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
        <div className="useCaseGrid">
          {familyUseCases.map((item) => (
            <article key={item.quote}>
              <p>&ldquo;{item.quote}&rdquo;</p>
              <span>{item.family}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="toolGrid" aria-label="Caregiver history and privacy">
        <article className="caregiverPanel settingsPanel">
          <div className="sectionHeading">
            <span>Settings</span>
            <h2>Preferences</h2>
          </div>
          <label className="switchRow">
            <input
              checked={voiceAssist}
              type="checkbox"
              onChange={(event) => setVoicePreference(event.target.checked)}
            />
            <span>Voice guidance</span>
          </label>
          <label className="switchRow">
            <input
              checked={largeText}
              type="checkbox"
              onChange={(event) => setLargeText(event.target.checked)}
            />
            <span>Large text</span>
          </label>
          <label className="switchRow">
            <input
              checked={highContrast}
              type="checkbox"
              onChange={(event) => setHighContrast(event.target.checked)}
            />
            <span>High contrast</span>
          </label>
          <button className="softButton" type="button" onClick={() => setHasEntered(false)}>
            Reopen start setup
          </button>
        </article>

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
          <div className="consentFlow">
            <span className={locationConsent ? "complete" : ""}>Ask</span>
            <span className={locationConsent ? "complete" : ""}>Allow</span>
            <span className={careState.lostMode ? "active" : ""}>Share</span>
            <span className={privacyStatus.includes("queued") ? "active" : ""}>Audit</span>
          </div>
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

        <article id="help" className="caregiverPanel faqPanel">
          <div className="sectionHeading">
            <span>Help</span>
            <h2>Family FAQ</h2>
          </div>
          <div className="faqList">
            {faqItems.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
