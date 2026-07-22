import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nischint | Peace-of-Mind Safety Companion",
  description:
    "A gentle real-time support app for dementia care, family alerts, safe-zone status, and calming guidance.",
  manifest: "/manifest.webmanifest",
  themeColor: "#ff7faa",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
