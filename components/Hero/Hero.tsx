import { Sieve } from "@/components/Sieve/Sieve";
import { getProfile, getProjects } from "@/lib/content";

/** Headline, role and tools, availability, then the sieve: the one bold thing on the site. */
export function Hero() {
  const profile = getProfile();
  const headline = profile.hero_headline_options[profile.hero_headline_default];
  const sieveProject = getProjects().find((project) => project.sieve);

  return (
    <section className="shell pt-12 lg:pt-16" aria-labelledby="hero-title">
      <h1 id="hero-title" className="type-display type-hero max-w-[17em] text-balance">
        {headline}
      </h1>
      <p className="type-lead mt-6 max-w-[56rem] text-balance">
        {profile.name}, {profile.role}. {profile.tools.join(", ")}.
      </p>
      <p className="text-ink-85 mt-2">{profile.availability.short}</p>
      {sieveProject && (
        <div className="mt-10">
          <Sieve slug={sieveProject.slug} />
        </div>
      )}
    </section>
  );
}
