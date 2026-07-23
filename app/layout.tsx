import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nischint-rho.vercel.app"),
  applicationName: "Nischint",
  title: "Nischint | Dementia Safety Companion",
  description:
    "A mobile-first dementia safety companion with lost-mode support, GPS sharing, caregiver alerts, reminders, and calming guidance.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Nischint | Dementia Safety Companion",
    description:
      "Simple real-time support for seniors during confusion, and clearer safety updates for families.",
    url: "https://nischint-rho.vercel.app",
    siteName: "Nischint",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Nischint | Dementia Safety Companion",
    description:
      "Lost-mode support, caregiver alerts, safe-zone status, and calming guidance for dementia care.",
  },
};

export const viewport: Viewport = {
  themeColor: "#d8627f",
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
