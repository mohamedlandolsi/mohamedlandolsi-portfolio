import { SectionHead } from "@/components/SectionHead/SectionHead";
import { getProfile } from "@/lib/content";

export function About() {
  const { about, languages, education } = getProfile();

  return (
    <section id="about" className="shell section" aria-labelledby="about-title">
      <SectionHead id="about-title" title="About" tag="Background" />
      <div className="lead mb-10 space-y-4">
        {about.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
      <div className="cells reveal md:grid-cols-2">
        <div className="cell bg-panel">
          <h3 className="bg-kicker">Education</h3>
          {education.map((entry) => (
            <div key={entry.school} className="edu-item">
              <p className="edu-degree">{entry.degree}</p>
              <p className="edu-school">{entry.school}</p>
              <p className="edu-period">
                {entry.start} to {entry.end}
              </p>
            </div>
          ))}
        </div>
        <div className="cell bg-panel">
          <h3 className="bg-kicker">Languages</h3>
          <dl>
            {languages.map((language) => (
              <div key={language.name} className="lang-row">
                <dt className="lang-name">{language.name}</dt>
                <dd className="lang-level">{language.level}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
