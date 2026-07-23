import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Lora } from "next/font/google";
import "./globals.css";

const interfaceFont = Instrument_Sans({
  variable: "--font-care",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Lora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nischint-rho.vercel.app"),
  applicationName: "Nischint",
  title: "Nischint | Elder Safety Companion",
  description:
    "A mobile-first elder safety and family care companion with lost-mode support, location sharing, reminders, and calming guidance.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Nischint | Elder Safety Companion",
    description:
      "Simple real-time safety support for older adults and clearer care updates for families.",
    url: "https://nischint-rho.vercel.app",
    siteName: "Nischint",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Nischint | Elder Safety Companion",
    description:
      "Lost-mode support, caregiver alerts, safe-zone status, reminders, and calming guidance for elder care.",
  },
};

export const viewport: Viewport = {
  themeColor: "#3e8b79",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${interfaceFont.variable} ${displayFont.variable}`}
      lang="en"
    >
      <body>{children}</body>
    </html>
  );
}
