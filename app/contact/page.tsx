import type { Metadata } from "next";
import { SiteInfoPage, sitePages } from "../site-pages";

export const metadata: Metadata = {
  title: "Contact | Nischint",
  description: "Contact paths for Nischint privacy, demo, support, and partnership questions.",
};

export default function ContactPage() {
  return <SiteInfoPage page={sitePages.contact} />;
}
