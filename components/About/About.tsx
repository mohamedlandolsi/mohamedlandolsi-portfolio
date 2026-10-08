import { getProfile } from "@/lib/content";

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

export function About() {
  const { about, languages, education } = getProfile();
  // The home page names the highest degree; /cv lists both.
  const degree = education[0];

  return (
    <section id="about" className="shell section" aria-labelledby="about-title">
      <h2 id="about-title" className="type-h2">
        About
      </h2>
      <div className="mt-12 grid gap-x-6 gap-y-10 lg:grid-cols-12">
        <div className="measure space-y-5 lg:col-span-7">
          {about.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
        <dl className="space-y-6 lg:col-span-4 lg:col-start-9">
          <div>
            <dt className="type-meta">Languages</dt>
            <dd className="mt-1">
              {languages.map((language) => `${language.name} (${lowerFirst(language.level)})`).join(", ")}
            </dd>
          </div>
          <div>
            <dt className="type-meta">Education</dt>
            <dd className="mt-1">
              {degree.degree}, {degree.school}, {degree.start} to {degree.end}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
