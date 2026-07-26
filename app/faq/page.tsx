import type { Metadata } from "next";
import { SiteInfoPage, sitePages } from "../site-pages";

export const metadata: Metadata = {
  title: "FAQ | Nischint",
  description: "Frequently asked questions about Nischint's demo, privacy model, safety flow, AI, and production readiness.",
};

export default function FaqPage() {
  return <SiteInfoPage page={sitePages.faq} />;
}
