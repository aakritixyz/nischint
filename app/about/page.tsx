import type { Metadata } from "next";
import { SiteInfoPage, sitePages } from "../site-pages";

export const metadata: Metadata = {
  title: "About | Nischint",
  description: "The mission, care problem, product approach, and roadmap behind Nischint.",
};

export default function AboutPage() {
  return <SiteInfoPage page={sitePages.about} />;
}
