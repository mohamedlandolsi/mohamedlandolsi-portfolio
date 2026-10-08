import Link from "next/link";
import { isPublished } from "@/lib/case-studies";
import { getExperience, getProfile, getProjects, getSkills, isTodo } from "@/lib/content";
import { displayUrl, formatMonth } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import "./cv.css";

const profile = getProfile();
const experience = getExperience();
const skills = getSkills();
// Projects that are not already an experience entry (the Wavess internship is both).
const projects = getProjects().filter(
  (project) => project.featured && !experience.some((entry) => entry.case_study === project.slug),
);

export const metadata = pageMetadata({
  title: "CV",
  description: `${profile.name}'s CV on one page: experience, projects, skills, education and languages. It prints to one A4 page, and a PDF version is linked.`,
  path: "/cv",
});

export default function Cv() {
  const { name, role, positioning, location, timezone, availability, links, education, languages } = profile;
  const contact = [
    { href: `mailto:${links.email}`, label: links.email },
    { href: links.linkedin, label: displayUrl(links.linkedin) },
    { href: links.github, label: displayUrl(links.github) },
    // The site's own address only matters on paper.
    { href: links.site, label: displayUrl(links.site), printOnly: true },
  ];

  return (
    <article className="shell cv">
      <header className="hero cv-head">
        <h1 className="type-h1">{name}</h1>
        <p className="role-line">{role}</p>
        <p className="thesis">{positioning}</p>
        <ul className="cv-contact">
          <li>
            {location} ({timezone})
          </li>
          {contact.map((item) => (
            <li key={item.href} className={item.printOnly ? "cv-print-only" : undefined}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
        <p className="cv-availability">
          {availability.text} {availability.relocation}
        </p>
        <div className="cv-actions" data-print="hide">
          <a className="button button-primary" href={links.cv_pdf}>
            Download CV (PDF)
          </a>
        </div>
      </header>

      <section className="cv-section" aria-labelledby="cv-experience">
        <h2 id="cv-experience">Experience</h2>
        <div>
          {experience.map((entry) => {
            // Facts still marked TODO in content/ are never rendered, and neither are highlights
            // waiting for Mohamed to confirm his share of the work.
            const highlights = entry.highlights.filter((highlight) => !highlight.verify);
            return (
              <div key={entry.id} className="cv-entry">
                <div className="cv-entry-head">
                  <h3 className="cv-entry-title">
                    {isTodo(entry.title) ? (
                      entry.company
                    ) : (
                      <>
                        {entry.title}, <span className="cv-org">{entry.company}</span>
                      </>
                    )}
                  </h3>
                  <p className="cv-period">
                    {formatMonth(entry.start)} to {formatMonth(entry.end)}
                  </p>
                </div>
                <p className="cv-meta">
                  {entry.type}, {entry.location}
                </p>
                <p className="cv-text">{entry.summary}</p>
                {highlights.length > 0 && (
                  <ul className="cv-points">
                    {highlights.map((highlight) => (
                      <li key={highlight.text}>{highlight.text}</li>
                    ))}
                  </ul>
                )}
                {entry.stack.length > 0 && <p className="cv-stack">{entry.stack.join(", ")}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="cv-section" aria-labelledby="cv-projects">
        <h2 id="cv-projects">Projects</h2>
        <div>
          {projects.map((project) => {
            const href = isPublished(project.slug) ? `/work/${project.slug}` : null;
            return (
              <div key={project.slug} className="cv-entry">
                <div className="cv-entry-head">
                  <h3 className="cv-entry-title">{href ? <Link href={href}>{project.title}</Link> : project.title}</h3>
                  <p className="cv-period">{project.period}</p>
                </div>
                <p className="cv-meta">{project.role}</p>
                <p className="cv-text">{project.one_liner}</p>
                <p className="cv-stack">{project.stack.join(", ")}</p>
                {/* On paper the title is not a link, so the address is printed under it. */}
                {href && <p className="cv-print-only cv-print-url">{displayUrl(`${links.site}${href}`)}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="cv-section" aria-labelledby="cv-skills">
        <h2 id="cv-skills">Skills</h2>
        <dl className="cv-rows">
          {skills.groups.map((group) => (
            <div key={group.name} className="cv-row">
              <dt>{group.name}</dt>
              <dd>{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="cv-section" aria-labelledby="cv-education">
        <h2 id="cv-education">Education</h2>
        <div>
          {education.map((entry) => (
            <div key={entry.school} className="cv-entry cv-entry-tight">
              <div className="cv-entry-head">
                <h3 className="cv-entry-title">{entry.degree}</h3>
                <p className="cv-period">
                  {entry.start} to {entry.end}
                </p>
              </div>
              <p className="cv-meta">{entry.school}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cv-section" aria-labelledby="cv-languages">
        <h2 id="cv-languages">Languages</h2>
        <dl className="cv-rows cv-rows-inline">
          {languages.map((language) => (
            <div key={language.name} className="cv-row">
              <dt>{language.name}</dt>
              <dd>{language.level}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
