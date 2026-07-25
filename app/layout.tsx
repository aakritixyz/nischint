import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nischint-rho.vercel.app"),
  applicationName: "Nischint",
  title: "Nischint | Elder Safety Companion",
  description:
    "A bilingual elder safety and family care companion with voice assistance, lost-mode support, location sharing, reminders, and calming guidance.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Nischint | Elder Safety Companion",
    description:
      "Bilingual, voice-assisted safety support for older adults and clear real-time care updates for families.",
    url: "https://nischint-rho.vercel.app",
    siteName: "Nischint",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Nischint | Elder Safety Companion",
    description:
      "English and Hindi voice assistance, lost-mode support, caregiver alerts, safe-zone status, reminders, and calming guidance.",
  },
};

export const viewport: Viewport = {
  themeColor: "#8f6f7d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
