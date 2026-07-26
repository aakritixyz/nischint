import type { Metadata } from "next";
import { SiteInfoPage, sitePages } from "../site-pages";

export const metadata: Metadata = {
  title: "Interactive Demo | Nischint",
  description: "Try Nischint's senior safety flow, caregiver preview, emergency simulation, reminders, and voice assistance.",
};

export default function DemoPage() {
  return <SiteInfoPage page={sitePages.demo} />;
}
