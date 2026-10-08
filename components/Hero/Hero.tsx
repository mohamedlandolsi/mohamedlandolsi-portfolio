import Link from "next/link";
import { SectionHead } from "@/components/SectionHead/SectionHead";
import { Sieve } from "@/components/Sieve/Sieve";
import { getProfile, getProjects } from "@/lib/content";
import { formatShortDate } from "@/lib/format";

/** Name and role, the one-line thesis, location and availability; then one real run of the engine. */
export function Hero() {
  const profile = getProfile();
  const headline = profile.hero_headline_options[profile.hero_headline_default];
  const sieveProject = getProjects().find((project) => project.sieve);

  return (
    <>
      <section className="shell hero" aria-labelledby="hero-title">
        <p className="eyebrow">
          <span className="dot" aria-hidden="true" />
          Open to opportunities
        </p>
        <h1 id="hero-title" className="type-display">
          {profile.name}
          <br />
          <span className="hero-faint">{profile.role}</span>
        </h1>
        <p className="role-line">{profile.tools.join(", ")}</p>
        <p className="thesis">{headline}</p>
        <div className="hero-meta">
          <span className="chip">
            {profile.location} ({profile.timezone})
          </span>
          <span className="chip chip-status">{profile.availability.short}</span>
        </div>
        <Link href="/cv" className="cv-link">
          View CV
        </Link>
      </section>
      {sieveProject?.sieve && (
        <section className="shell section" aria-labelledby="run-title">
          <SectionHead id="run-title" title="One real run" tag={`YC directory, ${formatShortDate(sieveProject.sieve.date)}`} />
          <Sieve slug={sieveProject.slug} />
        </section>
      )}
    </>
  );
}
