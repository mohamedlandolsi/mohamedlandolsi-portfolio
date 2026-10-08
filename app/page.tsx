import { About } from "@/components/About/About";
import { Contact } from "@/components/Contact/Contact";
import { Hero } from "@/components/Hero/Hero";
import { JsonLd } from "@/components/JsonLd/JsonLd";
import { Principles } from "@/components/Principles/Principles";
import { WorkRows } from "@/components/WorkRows/WorkRows";
import { getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { homeGraph } from "@/lib/structured-data";

const profile = getProfile();

export const metadata = pageMetadata({ description: profile.positioning, path: "/" });

export default function Home() {
  return (
    <>
      {/* schema.org: the site, this profile page and the person, from profile.json only. */}
      <JsonLd graph={homeGraph()} />
      <Hero />
      <WorkRows />
      <Principles />
      <About />
      <Contact />
    </>
  );
}
