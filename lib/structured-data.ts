import type { CaseStudyMeta } from "@/lib/case-studies";
import { getProfile, isTodo, type Project } from "@/lib/content";
import { siteTitle, siteUrl } from "@/lib/metadata";
import { getScreenshots } from "@/lib/screenshots";

// schema.org nodes, built from content/ only. Each page renders the nodes it needs in one graph
// (components/JsonLd); the IDs let a case study point at the same person and site as the home page.

const profile = getProfile();
const absolute = (path: string) => new URL(path, siteUrl).href;

const PERSON_ID = absolute("/#person");
const WEBSITE_ID = absolute("/#website");

/** The full record, for the home page. */
export const person = {
  "@type": "Person",
  "@id": PERSON_ID,
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
};

/** The same person on other pages: enough for a search engine to join the two. */
const personRef = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: profile.name,
  url: profile.links.site,
  sameAs: person.sameAs,
};

/** Names the site in search results. */
const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: profile.links.site,
  name: profile.name,
  description: profile.positioning,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
};

export function homeGraph(): object[] {
  const page = {
    "@type": "ProfilePage",
    "@id": absolute("/#profile"),
    url: profile.links.site,
    name: siteTitle,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
  };
  return [website, page, person];
}

/** A case study as an article about a piece of software, with its repository when content/ names it. */
export function caseStudyGraph(meta: CaseStudyMeta, project: Project): object[] {
  const url = absolute(`/work/${project.slug}`);
  const softwareId = `${url}#software`;
  const images = getScreenshots(project.slug).map((shot) => absolute(shot.file));
  const article = {
    "@type": "TechArticle",
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: url,
    headline: meta.pageTitle,
    description: project.one_liner,
    inLanguage: "en",
    ...(meta.published && { datePublished: meta.published }),
    ...(meta.updated && { dateModified: meta.updated }),
    ...(images.length > 0 && { image: images }),
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": softwareId },
  };
  const software = {
    "@type": "SoftwareSourceCode",
    "@id": softwareId,
    name: project.title,
    description: project.one_liner,
    ...(!isTodo(project.links.repo) && { codeRepository: project.links.repo }),
    author: { "@id": PERSON_ID },
  };
  return [article, software, personRef, website];
}
