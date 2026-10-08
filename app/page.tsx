import { About } from "@/components/About/About";
import { Contact } from "@/components/Contact/Contact";
import { Hero } from "@/components/Hero/Hero";
import { Principles } from "@/components/Principles/Principles";
import { WorkRows } from "@/components/WorkRows/WorkRows";
import { getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const profile = getProfile();

export const metadata = pageMetadata({ description: profile.positioning, path: "/" });

/** schema.org Person, built from profile.json only. "<" is escaped so the JSON cannot close the script tag. */
const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description: profile.positioning,
  url: profile.links.site,
  email: `mailto:${profile.links.email}`,
  sameAs: [profile.links.linkedin, profile.links.github],
  homeLocation: { "@type": "Place", name: profile.location },
  knowsAbout: profile.tools,
  knowsLanguage: profile.languages.map((language) => language.name),
  alumniOf: profile.education.map((entry) => ({ "@type": "EducationalOrganization", name: entry.school })),
}).replace(/</g, "\\u003c");

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd }} />
      <Hero />
      <WorkRows />
      <Principles />
      <About />
      <Contact />
    </>
  );
}
