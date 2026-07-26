import type { Metadata } from "next";
import { SiteInfoPage, sitePages } from "../site-pages";

export const metadata: Metadata = {
  title: "Caregiver Guide | Nischint",
  description: "How Nischint helps families set up profiles, contacts, consent, reminders, and emergency escalation.",
};

export default function CarePage() {
  return <SiteInfoPage page={sitePages.care} />;
}
