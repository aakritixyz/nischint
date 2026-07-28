"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type CheckIn = "ok" | "help" | "medicine";
type Language = "en" | "hi";
type AppTab = "safety" | "location" | "reminders" | "circle" | "notes" | "privacy" | "settings";
type VoiceTone = "calm" | "standard" | "energetic";
type AuthMode = "login" | "signup";
type VoiceIntent = CheckIn | "lost";

type BrowserSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: {
    results: ArrayLike<{ 0: { transcript: string } }>;
  }) => void) | null;
  onerror: ((event?: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

type CareContact = {
  name: string;
  role: string;
  phone: string;
  tone: string;
  accessLevel: "owner" | "backup" | "clinical";
  canReceiveAlerts: boolean;
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
  consentLog: ConsentLog[];
  events: CareEvent[];
};

type ConsentLog = {
  id: number;
  scope: "location" | "emergency-card" | "caregiver-access";
  allowed: boolean;
  actor: string;
  createdAt: string;
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

type AiCapability = {
  id: string;
  label: string;
  model: string;
  provider: string;
  ready: boolean;
  env: string[];
};

type CaregiverSession = {
  patientId: string;
  caregiverName: string;
  role: string;
  accessLevel: "owner" | "backup" | "clinical";
  issuedAt: number;
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
    {
      name: "Asha",
      role: "Daughter",
      phone: "+91 92100 67119",
      tone: "Primary",
      accessLevel: "owner",
      canReceiveAlerts: true,
    },
    {
      name: "Ravi",
      role: "Neighbor",
      phone: "+91 98765 43211",
      tone: "Nearby",
      accessLevel: "backup",
      canReceiveAlerts: true,
    },
    {
      name: "Dr. Meera",
      role: "Doctor",
      phone: "+91 98765 43212",
      tone: "Care",
      accessLevel: "clinical",
      canReceiveAlerts: false,
    },
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
  consentLog: [
    {
      id: 1,
      scope: "location",
      allowed: true,
      actor: "Asha",
      createdAt: new Date().toISOString(),
    },
  ],
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
    personName: "Senior name",
    accessCode: "Family access code",
    voiceChoice: "Voice guidance",
    voiceChoiceOn: "Keep voice guidance on",
    voiceChoiceOff: "Use buttons only",
    startApp: "Continue",
    skipSetup: "Open Nischint",
    loginButton: "Login",
    codeError: "Use access code 2486 or open Nischint.",
    progressStep: "Step 1 of 3",
    demoMode: "Setup",
    loginTitle: "Start setup",
    loginMode: "Login",
    signupMode: "Create account",
    caregiverName: "Caregiver name",
    caregiverIdentifier: "Phone or email",
    caregiverPassword: "Password",
    signupButton: "Create caregiver account",
    returningUser: "Already set up?",
    privacyPromise: "Consent stays visible. Location is shared only after permission.",
    voiceTone: "Voice comfort",
    calmTone: "Calm",
    standardTone: "Standard",
    energeticTone: "Energetic",
    demoCodeHint: "Family access code: 2486",
    voiceOff: "Voice guidance is off. Button actions will still work.",
    recognized: (phrase: string) => `Heard: "${phrase}".`,
    commandNotFound: "I did not understand that. Try saying help, lost, okay, or medicine.",
    brandTag: "Elder safety & family care",
    heroDescription:
      "A calm mobile-first companion for seniors who may feel confused or lost, and for families who need quick, clear safety updates.",
    navCare: "Care",
    navDemo: "App",
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
    recording: "Speak now. I am listening for a few seconds.",
    processingVoice: "Understanding your voice command...",
    voiceReady: "Voice guidance is ready",
    voiceUnsupported: "Voice commands are not available on this browser. Read-aloud still works.",
    micPermission: "Microphone permission is blocked. Allow microphone access, then try Voice command again.",
    commandHelp: "Say: I feel lost, I need help, I am okay, or I took medicine.",
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
    personName: "वरिष्ठ का नाम",
    accessCode: "परिवार का एक्सेस कोड",
    voiceChoice: "आवाज की सहायता",
    voiceChoiceOn: "आवाज की सहायता चालू रखें",
    voiceChoiceOff: "सिर्फ बटन इस्तेमाल करें",
    startApp: "आगे बढ़ें",
    skipSetup: "निश्चिंत खोलें",
    loginButton: "लॉगिन",
    codeError: "एक्सेस कोड 2486 डालें या निश्चिंत खोलें।",
    progressStep: "चरण 1 / 3",
    demoMode: "सेटअप",
    loginTitle: "सेटअप शुरू करें",
    loginMode: "लॉगिन",
    signupMode: "अकाउंट बनाएं",
    caregiverName: "देखभालकर्ता का नाम",
    caregiverIdentifier: "फोन या ईमेल",
    caregiverPassword: "पासवर्ड",
    signupButton: "देखभालकर्ता अकाउंट बनाएं",
    returningUser: "पहले से सेटअप है?",
    privacyPromise: "सहमति हमेशा दिखेगी। स्थान केवल अनुमति के बाद साझा होगा।",
    voiceTone: "आवाज का तरीका",
    calmTone: "शांत",
    standardTone: "सामान्य",
    energeticTone: "ऊर्जावान",
    demoCodeHint: "परिवार एक्सेस कोड: 2486",
    voiceOff: "आवाज की सहायता बंद है। बटन फिर भी काम करेंगे।",
    recognized: (phrase: string) => `सुना गया: "${phrase}"।`,
    commandNotFound: "समझ नहीं आया। मदद, रास्ता, ठीक, या दवा बोलकर देखें।",
    brandTag: "वरिष्ठ सुरक्षा और परिवार की देखभाल",
    heroDescription:
      "वरिष्ठों के लिए एक सरल साथी, जो रास्ता भूलने या घबराहट के समय परिवार से जल्दी संपर्क कराता है।",
    navCare: "देखभाल",
    navDemo: "ऐप",
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
    recording: "अब बोलिए। मैं कुछ सेकंड तक सुन रही हूं।",
    processingVoice: "आपकी आवाज समझी जा रही है...",
    voiceReady: "आवाज से सहायता तैयार है",
    voiceUnsupported: "इस ब्राउजर में बोलकर आदेश देना उपलब्ध नहीं है। सुनने की सुविधा काम करेगी।",
    micPermission: "माइक्रोफोन की अनुमति बंद है। अनुमति चालू करके फिर से आवाज से बोलें।",
    commandHelp: "कहें: मुझे रास्ता नहीं मिल रहा, मुझे मदद चाहिए, मैं ठीक हूं, या मैंने दवा ले ली।",
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

const escalationSteps = [
  { time: "0 min", title: "Primary alert", detail: "Asha receives SMS, location, and emergency card." },
  { time: "10 min", title: "Backup contact", detail: "Ravi is notified if the alert is still unresolved." },
  { time: "20 min", title: "Care handoff", detail: "Doctor or neighbor handoff appears for the family." },
];

const appTabs: Array<{ id: AppTab; label: string; hint: string }> = [
  { id: "safety", label: "Safety", hint: "Help now" },
  { id: "location", label: "Location", hint: "Safe zone" },
  { id: "reminders", label: "Reminders", hint: "Medicine" },
  { id: "circle", label: "Care circle", hint: "Family" },
  { id: "notes", label: "Notes", hint: "Handoff" },
  { id: "privacy", label: "Privacy", hint: "Consent" },
  { id: "settings", label: "Settings", hint: "Profile" },
];

const routeLinks = [
  { href: "/care", label: "Care" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/about", label: "About" },
];

export default function Home() {
  const [careState, setCareState] = useState<CareState>(fallbackState);
  const [guidance, setGuidance] = useState<Guidance>(defaultGuidance);
  const [aiGuidance, setAiGuidance] = useState(
    "AI care guidance is ready to generate calm support once the app syncs."
  );
  const [aiCapabilities, setAiCapabilities] = useState<AiCapability[]>([]);
  const [hasEntered, setHasEntered] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>("safety");
  const [backendReady, setBackendReady] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [locationStatus, setLocationStatus] = useState("GPS has not been shared yet");
  const [notificationStatus, setNotificationStatus] = useState("Alerts are ready when provider keys and verified contacts are connected");
  const [actionBusy, setActionBusy] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
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
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [caregiverName, setCaregiverName] = useState("Asha");
  const [caregiverIdentifier, setCaregiverIdentifier] = useState("asha@example.com");
  const [caregiverPassword, setCaregiverPassword] = useState("");
  const [caregiverPhone, setCaregiverPhone] = useState("+91 92100 67119");
  const [language, setLanguage] = useState<Language>("en");
  const [voiceAssist, setVoiceAssist] = useState(true);
  const [onboardingVoiceAssist, setOnboardingVoiceAssist] = useState(true);
  const [voiceTone, setVoiceTone] = useState<VoiceTone>("calm");
  const [loginMessage, setLoginMessage] = useState("");
  const [caregiverSession, setCaregiverSession] = useState<CaregiverSession | null>(null);
  const [voiceStatus, setVoiceStatus] = useState<string>(languageCopy.en.voiceReady);
  const [isListening, setIsListening] = useState(false);
  const [isRecordingCommand, setIsRecordingCommand] = useState(false);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null);
  const copy = languageCopy[language];
  const activeGuidance = language === "hi" ? hindiGuidance : guidance;
  const formattedCurrentTime = currentTime.toLocaleTimeString("en-IN", {
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
      ? "Outside safe zone - alert chain active"
      : "Safe-zone ready - GPS not shared yet";
  }

  function stopSpeaking() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    recognitionRef.current?.stop();
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
    setIsRecordingCommand(false);
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
    const toneRate = voiceTone === "calm" ? 0.76 : voiceTone === "energetic" ? 0.94 : 0.84;
    utterance.rate = spokenLanguage === "hi" ? Math.max(0.72, toneRate - 0.04) : toneRate;
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

  async function loginCaregiver(bypassCode = false) {
    try {
      const payload = await callApi("/api/nischint/login", {
        accessCode: caregiverAccessCode,
        identifier: caregiverIdentifier,
        password: caregiverPassword,
        quickDemo: bypassCode,
      });
      if (!payload.authenticated || !payload.session) {
        setLoginMessage(payload.error ?? copy.codeError);
        setScreenAnnouncement(payload.error ?? copy.codeError);
        return false;
      }
      setCaregiverSession(payload.session);
      return true;
    } catch {
      const message = "Login is temporarily unavailable. Please try again.";
      setLoginMessage(message);
      setScreenAnnouncement(message);
      return false;
    }
  }

  async function enterNischint(nextTab: AppTab = "safety", requireCode = true) {
    const isLoggedIn = await loginCaregiver(!requireCode);
    if (!isLoggedIn) {
      return;
    }

    setVoiceAssist(onboardingVoiceAssist);
    window.localStorage.setItem("nischint-has-entered", "true");
    window.localStorage.setItem("nischint-voice-assist", String(onboardingVoiceAssist));
    window.localStorage.setItem("nischint-language", language);
    window.localStorage.setItem("nischint-voice-tone", voiceTone);
    setActiveTab(nextTab);
    setLoginMessage("");
    setHasEntered(true);

    if (onboardingVoiceAssist) {
      window.setTimeout(() => speakText(copy.languageSelected, language, true), 120);
    } else {
      setVoiceStatus(copy.voiceOff);
    }
  }

  async function signupCaregiver() {
    try {
      const payload = await callApi("/api/nischint/signup", {
        name: caregiverName,
        identifier: caregiverIdentifier,
        phone: caregiverPhone,
        password: caregiverPassword,
      });
      if (!payload.authenticated || !payload.session) {
        setLoginMessage(payload.error ?? "Could not create caregiver account.");
        setScreenAnnouncement(payload.error ?? "Could not create caregiver account.");
        return;
      }
      setCaregiverSession(payload.session);
      window.localStorage.setItem("nischint-has-entered", "true");
      window.localStorage.setItem("nischint-voice-assist", String(onboardingVoiceAssist));
      window.localStorage.setItem("nischint-language", language);
      window.localStorage.setItem("nischint-voice-tone", voiceTone);
      setLoginMessage("");
      setHasEntered(true);
      setActiveTab("safety");
      setScreenAnnouncement("Caregiver account created.");
    } catch {
      const message = "Signup is temporarily unavailable. Please try again.";
      setLoginMessage(message);
      setScreenAnnouncement(message);
    }
  }

  async function logoutCaregiver() {
    try {
      await callApi("/api/nischint/logout", {});
    } catch {
      // Local sign-out still clears sensitive state if the network is unavailable.
    }
    window.localStorage.removeItem("nischint-has-entered");
    setCaregiverSession(null);
    setHasEntered(false);
    setScreenAnnouncement("Signed out of Nischint.");
  }

  function normalizeCommand(phrase: string) {
    return phrase
      .toLocaleLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function commandIntent(transcript: string): VoiceIntent | null {
    const phrase = normalizeCommand(transcript);
    const lostWords = [
      "i feel lost",
      "i am lost",
      "im lost",
      "lost",
      "where am i",
      "take me home",
      "go home",
      "home",
      "ghar",
      "ghar jana",
      "ghar jaana",
      "mujhe ghar jana",
      "mujhe ghar jaana",
      "rasta nahi mil raha",
      "raasta nahi mil raha",
      "mujhe rasta nahi mil raha",
      "mujhe raasta nahi mil raha",
      "kho gaya",
      "kho gayi",
      "gum gaya",
      "gum gayi",
      "रास्ता",
      "घर",
      "खो",
      "गुम",
    ];
    const helpWords = [
      "help",
      "help me",
      "need help",
      "i need help",
      "emergency",
      "call family",
      "call asha",
      "madad",
      "mujhe madad chahiye",
      "मदद",
      "सहायता",
      "आपात",
    ];
    const medicineWords = [
      "medicine",
      "tablet",
      "pill",
      "took medicine",
      "i took medicine",
      "medicine done",
      "dawa",
      "dawai",
      "dava",
      "dawa le li",
      "dawai le li",
      "dawa kha li",
      "दवा",
      "गोली",
    ];
    const okayWords = [
      "okay",
      "ok",
      "i am okay",
      "i am safe",
      "safe",
      "fine",
      "theek",
      "theek hu",
      "theek hoon",
      "main theek",
      "mai theek",
      "sab theek",
      "ठीक",
      "सुरक्षित",
    ];

    if (lostWords.some((word) => phrase.includes(word))) return "lost";
    if (helpWords.some((word) => phrase.includes(word))) return "help";
    if (medicineWords.some((word) => phrase.includes(word))) return "medicine";
    if (okayWords.some((word) => phrase.includes(word))) return "ok";

    return null;
  }

  function handleVoiceIntent(intent: VoiceIntent | null, transcript?: string) {
    if (transcript) {
      setVoiceStatus(copy.recognized(transcript));
    }

    if (intent === "lost") {
      void activateLostMode();
      return;
    }

    if (intent === "medicine") {
      void completeCheckIn("medicine");
      return;
    }

    if (intent === "help") {
      void completeCheckIn("help");
      return;
    }

    if (intent === "ok") {
      void completeCheckIn("ok");
      return;
    }

    setVoiceStatus(transcript ? `${copy.commandNotFound} Heard: ${transcript}` : copy.commandNotFound);
    if (voiceAssist) speakText(copy.commandNotFound);
  }

  function blobToBase64(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = String(reader.result ?? "");
        resolve(result.includes(",") ? result.split(",")[1] : result);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  async function recordVoiceCommand() {
    const mediaDevices = navigator.mediaDevices;
    const Recorder = window.MediaRecorder;

    if (!mediaDevices?.getUserMedia || !Recorder) {
      setVoiceStatus(copy.voiceUnsupported);
      speakText(copy.commandHelp);
      return;
    }

    try {
      stopSpeaking();
      const stream = await mediaDevices.getUserMedia({ audio: true });
      const mimeType = Recorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : Recorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";
      const recorder = new Recorder(stream, mimeType ? { mimeType } : undefined);
      const chunks: BlobPart[] = [];

      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      recorder.onerror = () => {
        setIsRecordingCommand(false);
        setVoiceStatus(copy.micPermission);
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.onstop = async () => {
        setIsRecordingCommand(false);
        stream.getTracks().forEach((track) => track.stop());
        if (!chunks.length) {
          setVoiceStatus(copy.commandHelp);
          return;
        }

        setVoiceStatus(copy.processingVoice);
        try {
          const audio = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
          const payload = await callApi("/api/nischint/voice-command", {
            audioBase64: await blobToBase64(audio),
            mimeType: audio.type,
            language,
          });
          if (!payload.intent && !payload.transcript && payload.detail) {
            setVoiceStatus(payload.detail);
            speakText(copy.commandHelp);
            return;
          }
          handleVoiceIntent(payload.intent ?? null, payload.transcript);
        } catch {
          setVoiceStatus(copy.commandHelp);
          speakText(copy.commandHelp);
        }
      };

      setIsRecordingCommand(true);
      setVoiceStatus(copy.recording);
      recorder.start();
      window.setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 6500);
    } catch {
      setIsRecordingCommand(false);
      setVoiceStatus(copy.micPermission);
      speakText(copy.micPermission);
    }
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
    setScreenAnnouncement("Emergency flow started. Caregiver alert is active.");
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

  async function startAlertDrill() {
    setNotificationStatus("Alert drill: primary caregiver notified, backup timer started");
    setLocationStatus("Alert drill: using saved safe-zone location until GPS is allowed");
    await activateLostMode();
  }

  async function resetCareState() {
    stopSpeaking();
    setActionBusy("reset");
    setCareState(fallbackState);
    setGuidance(defaultGuidance);
    setLocationStatus("GPS has not been shared yet");
    setNotificationStatus("Alerts are ready when provider keys and verified contacts are connected");
    setPrivacyStatus("No privacy request queued");
    setScreenAnnouncement("Nischint state reset. Ready.");
    setNoteDraft("");
    setReminderTitle("Evening walk");
    setReminderTime("17:30");
    setActionBusy(null);
  }

  function toggleOfflineMode() {
    setCareState((state) => {
      const nextNetwork = state.location.networkStatus === "offline" ? "online" : "offline";
      setScreenAnnouncement(
        nextNetwork === "offline"
          ? "Offline mode is on. Emergency card remains visible."
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
      void recordVoiceCommand();
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
      handleVoiceIntent(intent, transcript);
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
        setVoiceStatus(copy.micPermission);
        speakText(copy.micPermission);
        return;
      }
      void recordVoiceCommand();
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
    return response.json() as Promise<{
      state?: CareState;
      guidance?: Guidance;
      ai?: string;
      capabilities?: AiCapability[];
      delivery?: string;
      intent?: VoiceIntent | null;
      transcript?: string;
      detail?: string;
      authenticated?: boolean;
      session?: CaregiverSession | null;
      error?: string;
    }>;
  }

  async function refreshGuidance() {
    try {
      const payload = await callApi("/api/nischint/guidance");
      if (payload.guidance) setGuidance(payload.guidance);
      if (payload.ai) setAiGuidance(payload.ai);
      if (payload.capabilities) setAiCapabilities(payload.capabilities);
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
        setLocationStatus("GPS permission was not granted. Saved safe-zone view is still available.");
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

  async function updateConsent(scope: "location" | "emergency-card", allowed: boolean) {
    if (scope === "location") setLocationConsent(allowed);
    if (scope === "emergency-card") setEmergencyConsent(allowed);
    setScreenAnnouncement(`${scope} consent ${allowed ? "allowed" : "paused"}.`);

    try {
      const payload = await callApi("/api/nischint/consent", {
        scope,
        allowed,
        actor: careState.contacts[0]?.name ?? "Asha",
      });
      if (payload.state) applyState(payload.state);
    } catch {
      setBackendReady(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    const initialHash = window.location.hash.replace("#", "");
    const savedLanguage = window.localStorage.getItem("nischint-language");
    const savedVoiceAssist = window.localStorage.getItem("nischint-voice-assist");
    const savedHasEntered = window.localStorage.getItem("nischint-has-entered");
    const savedVoiceTone = window.localStorage.getItem("nischint-voice-tone");
    const tick = window.setInterval(() => setCurrentTime(new Date()), 30000);

    const restorePreferences = window.setTimeout(() => {
      if (appTabs.some((tab) => tab.id === initialHash)) {
        setActiveTab(initialHash as AppTab);
      }
      if (savedLanguage === "hi" || savedLanguage === "en") {
        setLanguage(savedLanguage);
        setVoiceStatus(languageCopy[savedLanguage].voiceReady);
      }
      if (savedVoiceAssist === "false") {
        setVoiceAssist(false);
        setOnboardingVoiceAssist(false);
      }
      if (savedVoiceAssist === "true") setOnboardingVoiceAssist(true);
      if (savedVoiceTone === "calm" || savedVoiceTone === "standard" || savedVoiceTone === "energetic") {
        setVoiceTone(savedVoiceTone);
      }
      if (savedHasEntered === "true") setHasEntered(true);
    }, 0);

    async function loadCareState() {
      try {
        const payload = await callApi("/api/nischint/state");
        if (mounted && payload.state) applyState(payload.state);
        const me = await callApi("/api/nischint/me");
        if (mounted && me.session) {
          setCaregiverSession(me.session);
        }
        if (mounted && savedHasEntered === "true" && !me.authenticated) {
          setHasEntered(false);
          window.localStorage.removeItem("nischint-has-entered");
        }
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
          <div className="welcomeMeta">
            <span>{copy.progressStep}</span>
            <strong>{copy.demoMode}</strong>
          </div>

          <div className="welcomeBrand">
            <span aria-hidden="true">नि</span>
            <div>
              <p className="smallLabel">{copy.welcomeEyebrow}</p>
              <h1 className="heroWordmark" id="welcome-title">Nischint</h1>
            </div>
          </div>

          <div className="welcomeCopy">
            <p className="scriptName" aria-hidden="true">निश्चिंत</p>
            <div className="setupProgress" aria-label={copy.progressStep}>
              <span className="active">1</span>
              <span>2</span>
              <span>3</span>
            </div>
          </div>

          <div className="welcomeForm loginCard" aria-label="Nischint setup">
            <div className="loginHeader">
              <span aria-hidden="true">नि</span>
              <div>
                <h2>{copy.loginTitle}</h2>
              </div>
            </div>

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

            <div className="welcomeVoiceGroup comfortGroup" aria-label={copy.voiceTone}>
              <span>{copy.voiceTone}</span>
              {[
                { id: "calm", label: copy.calmTone },
                { id: "standard", label: copy.standardTone },
                { id: "energetic", label: copy.energeticTone },
              ].map((tone) => (
                <button
                  className={voiceTone === tone.id ? "active" : ""}
                  key={tone.id}
                  type="button"
                  aria-pressed={voiceTone === tone.id}
                  onClick={() => setVoiceTone(tone.id as VoiceTone)}
                >
                  {tone.label}
                </button>
              ))}
            </div>

            <div className="authModeSegment" role="group" aria-label="Caregiver account mode">
              <button
                className={authMode === "login" ? "active" : ""}
                type="button"
                aria-pressed={authMode === "login"}
                onClick={() => setAuthMode("login")}
              >
                {copy.loginMode}
              </button>
              <button
                className={authMode === "signup" ? "active" : ""}
                type="button"
                aria-pressed={authMode === "signup"}
                onClick={() => setAuthMode("signup")}
              >
                {copy.signupMode}
              </button>
            </div>

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

            {authMode === "signup" ? (
              <>
                <label>
                  {copy.caregiverName}
                  <input
                    value={caregiverName}
                    onChange={(event) => setCaregiverName(event.target.value)}
                  />
                </label>
                <label>
                  {copy.caregiverIdentifier}
                  <input
                    value={caregiverIdentifier}
                    onChange={(event) => setCaregiverIdentifier(event.target.value)}
                  />
                </label>
                <label>
                  Verified phone number
                  <input
                    inputMode="tel"
                    value={caregiverPhone}
                    onChange={(event) => setCaregiverPhone(event.target.value)}
                  />
                </label>
              </>
            ) : (
              <label>
                {copy.caregiverIdentifier}
                <input
                  value={caregiverIdentifier}
                  onChange={(event) => setCaregiverIdentifier(event.target.value)}
                />
              </label>
            )}

            <label>
              {copy.caregiverPassword}
              <input
                type="password"
                value={caregiverPassword}
                onChange={(event) => setCaregiverPassword(event.target.value)}
                placeholder={authMode === "signup" ? "8+ characters" : "Optional if using access code"}
              />
            </label>

            <label>
              {copy.accessCode}
              <input
                inputMode="numeric"
                type="password"
                value={caregiverAccessCode}
                onChange={(event) => setCaregiverAccessCode(event.target.value)}
              />
              <small>{copy.demoCodeHint}</small>
            </label>
            {loginMessage ? (
              <p className="loginError" role="alert">{loginMessage}</p>
            ) : null}

            <p className="privacyPromise">{copy.privacyPromise}</p>

            <div className="welcomeActions">
              {authMode === "signup" ? (
                <button className="primaryButton" type="button" onClick={() => void signupCaregiver()}>
                  {copy.signupButton}
                </button>
              ) : (
                <button className="primaryButton" type="button" onClick={() => void enterNischint("safety", true)}>
                  {copy.startApp}
                </button>
              )}
              <button className="softButton" type="button" onClick={() => void enterNischint("safety", false)}>
                {copy.skipSetup}
              </button>
            </div>

            <p className="returningHint">{copy.returningUser} {copy.skipSetup}</p>
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
        <Link className="brandLockup" href="/" aria-label="Nischint home">
          <span>नि</span>
          <strong>Nischint</strong>
        </Link>
        <nav aria-label="App sections">
          {routeLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => caregiverSession ? void logoutCaregiver() : setHasEntered(false)}
          >
            {caregiverSession ? "Logout" : copy.loginButton}
          </button>
        </nav>
      </header>
      {caregiverSession ? (
        <p className="sessionStrip">
          Signed in as {caregiverSession.caregiverName} · {caregiverSession.accessLevel} caregiver
        </p>
      ) : null}

      <p className="srOnly" role="status" aria-live="assertive">
        {screenAnnouncement}
      </p>

      <button
        className={`stickyEmergency ${careState.lostMode ? "active" : ""}`}
        type="button"
        onClick={() => void startAlertDrill()}
      >
        Emergency
      </button>

      <div className="tabRail" role="tablist" aria-label="Nischint category tabs">
        {appTabs.map((tab) => (
          <button
            className={activeTab === tab.id ? "active" : ""}
            id={`tab-${tab.id}`}
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.label}</span>
            <small>{tab.hint}</small>
          </button>
        ))}
      </div>

      <section
        className="tabPanel"
        id="panel-safety"
        role="tabpanel"
        aria-labelledby="tab-safety"
        hidden={activeTab !== "safety"}
      >
        <section className="hero appPanelHero" aria-labelledby="nischint-title">
          <div className="heroCopy">
            <div className="brandPill">
              <span aria-hidden="true">नि</span>
              {copy.brandTag}
            </div>
            <p className="scriptName" aria-hidden="true">निश्चिंत</p>
            <h1 className="heroWordmark" id="nischint-title">Safety first</h1>
            <p>{copy.heroDescription}</p>
            <div className="heroActions" aria-label="Primary safety actions">
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
            <div className="statusLegend" aria-label="Current safety status">
              <span className="stateChip safe"><i />Safe</span>
              <span className="stateChip caution"><i />Caution</span>
              <span className="stateChip danger"><i />Emergency</span>
              <span className={`stateChip ${networkClass}`}><i />{networkLabel}</span>
              <span className="stateChip neutral"><i />{formattedCurrentTime}</span>
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
              <button type="button" disabled={!voiceAssist || isListening || isRecordingCommand} onClick={listenForCommand}>
                {isListening ? copy.listening : isRecordingCommand ? copy.recording : copy.speak}
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
            <h2>{language === "hi" ? copy.nowTitle : `Today, ${formattedCurrentTime}`}</h2>
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
      </section>

      <section
        className="tabPanel"
        id="panel-location"
        role="tabpanel"
        aria-labelledby="tab-location"
        hidden={activeTab !== "location"}
      >
        <section className="workspaceGrid twoColumn" aria-label="Location and safe-zone tools">
          <article className="patientPanel">
            <div className="sectionHeading">
              <span>Live safety</span>
              <h2>GPS and alert actions</h2>
            </div>
            <p className="panelCopy">{locationStatus}</p>
            <button className="primaryButton" type="button" onClick={() => void shareLocation()}>
              {actionBusy === "location" ? "Requesting GPS..." : "Share live location"}
            </button>
            <div className="alertControlRow">
              <button className="dangerButton" type="button" onClick={() => void startAlertDrill()}>
                Run alert drill
              </button>
              <button className="softButton compact" type="button" onClick={toggleOfflineMode}>
                {careState.location.networkStatus === "offline" ? "Restore online" : "Offline mode"}
              </button>
              <button className="softButton compact" type="button" onClick={() => void resetCareState()}>
                {actionBusy === "reset" ? "Resetting..." : "Clear alert state"}
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

          <article className="caregiverPanel">
            <div className="sectionHeading">
              <span>Safe zone</span>
              <h2>Where is {careState.patient.name}?</h2>
            </div>
            <div className="mapCard appMapCard" aria-label="Safe zone map">
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
          </article>

          <article className="caregiverPanel fullSpan">
            <div className="sectionHeading">
              <span>Escalation</span>
              <h2>Family response ladder</h2>
            </div>
            <div className="timelineCard" aria-label="Caregiver escalation timeline">
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
          </article>
        </section>
      </section>

      <section
        className="tabPanel"
        id="panel-reminders"
        role="tabpanel"
        aria-labelledby="tab-reminders"
        hidden={activeTab !== "reminders"}
      >
        <section className="workspaceGrid twoColumn" aria-label="Reminders and check-ins">
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
              {careState.reminders.slice(0, 6).map((reminder) => (
                <p key={reminder.id}>
                  <strong>{reminder.time}</strong> {reminder.title}
                </p>
              ))}
            </div>
          </article>

          <article className="patientPanel">
            <div className="sectionHeading">
              <span>Daily check-in</span>
              <h2>Update family quickly</h2>
            </div>
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
            <div className={`statusBanner ${status.className}`}>
              <span><i aria-hidden="true">{status.icon}</i>{status.label}</span>
              <p>{status.detail}</p>
            </div>
          </article>
        </section>
      </section>

      <section
        className="tabPanel"
        id="panel-circle"
        role="tabpanel"
        aria-labelledby="tab-circle"
        hidden={activeTab !== "circle"}
      >
        <section className="workspaceGrid twoColumn" aria-label="Care circle">
          <article className="caregiverPanel">
            <div className="sectionHeading">
              <span>Care circle</span>
              <h2>Family and trusted contacts</h2>
            </div>
            <div className="contactList">
              {careState.contacts.map((contact) => (
                <article key={contact.name}>
                  <div className="contactMeta">
                    <strong>{contact.name}</strong>
                    <span>
                      {contact.role} · {contact.accessLevel}
                      {contact.canReceiveAlerts ? " · alerts on" : " · view only"}
                    </span>
                  </div>
                  <p className="contactPhone">{contact.phone}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="caregiverPanel">
            <div className="sectionHeading">
              <span>Invite</span>
              <h2>Add caregiver</h2>
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
              {careState.invites.slice(0, 4).map((invite) => (
                <p key={invite.id}>
                  <strong>{invite.status}</strong> {invite.name} · {invite.role}
                </p>
              ))}
            </div>
          </article>

          <article className={`alertCard fullSpan ${careState.lostMode ? "alertOn" : ""}`}>
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
              {careState.lostMode ? "Resolve" : "Start alert"}
            </button>
          </article>
        </section>
      </section>

      <section
        className="tabPanel"
        id="panel-notes"
        role="tabpanel"
        aria-labelledby="tab-notes"
        hidden={activeTab !== "notes"}
      >
        <section className="workspaceGrid twoColumn" aria-label="Notes and activity">
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
              {careState.events.slice(0, 8).map((event) => (
                <p key={event.id}>
                  <strong>{event.type}</strong> {event.message}
                </p>
              ))}
            </div>
          </article>
        </section>
      </section>

      <section
        className="tabPanel"
        id="panel-privacy"
        role="tabpanel"
        aria-labelledby="tab-privacy"
        hidden={activeTab !== "privacy"}
      >
        <section className="workspaceGrid twoColumn" aria-label="Privacy and consent">
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
                onChange={(event) => void updateConsent("location", event.target.checked)}
              />
              <span>Location sharing consent</span>
            </label>
            <label className="switchRow">
              <input
                checked={emergencyConsent}
                type="checkbox"
                onChange={(event) => void updateConsent("emergency-card", event.target.checked)}
              />
              <span>Emergency card consent</span>
            </label>
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

          <article className="caregiverPanel">
            <div className="sectionHeading">
              <span>Consent audit</span>
              <h2>Who changed what</h2>
            </div>
            <div className="consentAudit">
              {careState.consentLog.slice(0, 6).map((entry) => (
                <p key={entry.id}>
                  <strong>{entry.actor}</strong> {entry.allowed ? "allowed" : "paused"} {entry.scope}
                </p>
              ))}
            </div>
            <div className="consentFlow">
              <span className={locationConsent ? "complete" : ""}>Ask</span>
              <span className={locationConsent ? "complete" : ""}>Allow</span>
              <span className={careState.lostMode ? "active" : ""}>Share</span>
              <span className={privacyStatus.includes("queued") ? "active" : ""}>Audit</span>
            </div>
          </article>

          <section className="privacyControlBand fullSpan" aria-label="Privacy visibility summary">
            <div className="sectionHeading">
              <span>Your information</span>
              <h2>What family can see</h2>
            </div>
            <div className="privacySummaryGrid">
              <article className={locationConsent ? "allowed" : "paused"}>
                <span>{locationConsent ? "Allowed" : "Paused"}</span>
                <strong>Live location</strong>
                <p>
                  {locationConsent
                    ? "Caregivers can see location only after the senior shares it."
                    : "Caregivers cannot see live location until permission is turned on."}
                </p>
              </article>
              <article className={emergencyConsent ? "allowed" : "paused"}>
                <span>{emergencyConsent ? "Visible" : "Hidden"}</span>
                <strong>Emergency card</strong>
                <p>
                  {emergencyConsent
                    ? "Home address, medical note, and primary contact can be shown during help mode."
                    : "Emergency details stay hidden until this consent is restored."}
                </p>
              </article>
              <article className={caregiverSession ? "allowed" : "paused"}>
                <span>{caregiverSession ? "Signed in" : "Locked"}</span>
                <strong>Caregiver access</strong>
                <p>
                  {caregiverSession
                    ? `${caregiverSession.caregiverName} can view the care dashboard as ${caregiverSession.role}.`
                    : "Family dashboard access requires the caregiver code."}
                </p>
              </article>
            </div>
            <div className="privacyRequestList" aria-label="Privacy requests">
              <span className="smallLabel">Recent requests</span>
              {careState.privacyRequests.length ? (
                careState.privacyRequests.slice(0, 4).map((request) => (
                  <p key={request.id}>
                    <strong>{request.type === "export" ? "Data export" : "Delete request"}</strong>
                    <span>{request.status}</span>
                  </p>
                ))
              ) : (
                <p>No export or delete request has been made yet.</p>
              )}
            </div>
          </section>
        </section>
      </section>

      <section
        className="tabPanel"
        id="panel-settings"
        role="tabpanel"
        aria-labelledby="tab-settings"
        hidden={activeTab !== "settings"}
      >
        <section className="workspaceGrid twoColumn" aria-label="Settings and profile">
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
            <label>
              Caregiver access code
              <input
                inputMode="numeric"
                value={caregiverAccessCode}
                onChange={(event) => setCaregiverAccessCode(event.target.value)}
              />
            </label>
            <button className="softButton" type="button" onClick={() => setHasEntered(false)}>
              Reopen start setup
            </button>
          </article>

          <article className="patientPanel">
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

          <div className="aiCareCard" aria-label="AI Care Assistant">
            <div className="aiCareHeader">
              <span className="aiSpark" aria-hidden="true">AI</span>
              <div>
                <span className="smallLabel">AI Care Assistant</span>
                <h3>Generated calm support</h3>
              </div>
            </div>
            <p className="aiGuidanceText">&ldquo;{aiGuidance}&rdquo;</p>
            <div className="aiCapabilityRow" aria-label="Configured AI capabilities">
              {(aiCapabilities.length ? aiCapabilities : [
                { id: "guidance", label: "Guidance", model: "Groq/Gemini", provider: "AI", ready: true, env: [] },
              ]).map((capability) => (
                <span className={capability.ready ? "ready" : ""} key={capability.id}>
                  {capability.label}
                </span>
              ))}
            </div>
            <details className="aiWhy">
              <summary>Why this suggestion?</summary>
              <p>
                Nischint combines current care state, lost-mode status, location label, and safety rules.
                It asks the model for short, non-medical, calming language and falls back safely if AI fails.
              </p>
            </details>
            <div className="aiActionRow">
              <button className="softButton compact" type="button" onClick={() => void refreshGuidance()}>
                Regenerate guidance
              </button>
              <button className="softButton compact" type="button" onClick={() => speakText(aiGuidance)}>
                Read AI guidance
              </button>
            </div>
          </div>
          <div className="showcaseProofCard" aria-label="Project showcase proof">
            <span className="smallLabel">Showcase proof</span>
            <h3>Functional care flows, not static cards</h3>
            <p>
              Nischint includes working state updates for lost mode, check-ins,
              location sharing, reminders, caregiver notes, consent, privacy
              requests, read-aloud, voice commands, and alert provider hooks.
            </p>
          </div>
          </article>
        </section>
      </section>
    </main>
  );
}
