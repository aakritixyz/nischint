import type { Metadata } from "next";
import { SiteInfoPage, sitePages } from "../site-pages";

export const metadata: Metadata = {
  title: "App Walkthrough | Nischint",
  description: "Explore Nischint's senior safety flow, caregiver preview, emergency workflow, reminders, and voice assistance.",
};

export default function DemoPage() {
  return <SiteInfoPage page={sitePages.demo} />;
}
