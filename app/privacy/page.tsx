import type { Metadata } from "next";
import { SiteInfoPage, sitePages } from "../site-pages";

export const metadata: Metadata = {
  title: "Privacy Policy | Nischint",
  description: "Nischint's consent-first privacy approach for location, care profiles, caregivers, data rights, and security.",
};

export default function PrivacyPage() {
  return <SiteInfoPage page={sitePages.privacy} />;
}
