import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareAnchor | Dementia Safety Companion",
  description:
    "A gentle real-time support app for dementia safety, family alerts, safe-zone status, and calming guidance.",
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
