import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectFacts } from "@/components/mdx/ProjectFacts";
import { getCaseStudyMeta } from "@/lib/case-studies";
import { getProject, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import "./case-study.css";

// Every case study file is prerendered. Any other slug reaches notFound() below.
export function generateStaticParams() {
  return getProjects()
    .filter((project) => getCaseStudyMeta(project.slug))
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCaseStudyMeta(slug);
  if (!meta) return {};
  return pageMetadata({
    title: meta.pageTitle,
    description: getProject(slug).one_liner,
    path: `/work/${slug}`,
    // Drafts build so they can be reviewed, but are never indexed or linked.
    noindex: meta.status === "draft",
  });
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const meta = getCaseStudyMeta(slug);
  if (!meta) notFound();
  const project = getProject(slug);
  const { default: Body } = await import(`@/content/case-studies/${slug}.mdx`);

  return (
    <article className="shell">
      <header className="hero">
        <h1 className="type-h1 max-w-[18em] text-balance">{meta.title}</h1>
        <p className="thesis">{project.one_liner}</p>
        <div className="mt-10">
          <ProjectFacts slug={slug} />
        </div>
      </header>
      <div className="case-body">
        <Body />
      </div>
    </article>
  );
}
