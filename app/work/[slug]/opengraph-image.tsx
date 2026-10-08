import { getCaseStudyMeta } from "@/lib/case-studies";
import { getProfile, getProject, getProjects } from "@/lib/content";
import { ogCard, ogContentType, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = `The case study's title and one-line summary, with ${getProfile().name}'s name and role.`;

export function generateStaticParams() {
  return getProjects()
    .filter((project) => getCaseStudyMeta(project.slug))
    .map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return ogCard({ kicker: "Case study", title: getCaseStudyMeta(slug)?.title ?? project.title, text: project.one_liner });
}
