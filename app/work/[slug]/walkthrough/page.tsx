import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/CopyButton/CopyButton";
import { JsonLd } from "@/components/JsonLd/JsonLd";
import { Video } from "@/components/mdx/Video";
import { getCaseStudyMeta } from "@/lib/case-studies";
import { getProject, isTodo } from "@/lib/content";
import { pageMetadata, siteUrl } from "@/lib/metadata";
import { walkthroughGraph } from "@/lib/structured-data";
import { getVideo, getVideoSlugs } from "@/lib/videos";
import "../case-study.css";

// A walkthrough on a page of its own, so it can be shared without the whole case study around it.
// Only projects with a video and a case study get one; any other slug reaches notFound() below.
export function generateStaticParams() {
  return getVideoSlugs()
    .filter((slug) => getCaseStudyMeta(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]/walkthrough">): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCaseStudyMeta(slug);
  if (!meta || !getProject(slug).video) return {};
  const video = getVideo(slug);
  return pageMetadata({
    title: video.title,
    description: video.description,
    path: video.path,
    // A walkthrough of a draft case study is not indexed either.
    noindex: meta.status === "draft",
    video: { url: video.file, width: video.width, height: video.height },
  });
}

export default async function Walkthrough({ params }: PageProps<"/work/[slug]/walkthrough">) {
  const { slug } = await params;
  if (!getCaseStudyMeta(slug) || !getProject(slug).video) notFound();
  const project = getProject(slug);
  const video = getVideo(slug);
  const repo = isTodo(project.links.repo) ? null : project.links.repo;

  return (
    <article className="shell">
      <JsonLd graph={walkthroughGraph(video, project)} />
      <header className="hero hero-video">
        <h1 className="type-h1 max-w-[18em] text-balance">{video.title}</h1>
        <p className="thesis">{video.description}</p>
      </header>
      <div className="case-body">
        <Video project={slug} standalone />
        <div className="button-row walkthrough-actions">
          <Link href={`/work/${slug}`} className="button">
            Read the case study
          </Link>
          {repo && (
            <a href={repo} className="button">
              Repository on GitHub
            </a>
          )}
          <CopyButton text={new URL(video.path, siteUrl).href} label="Copy link" status="Link to this video copied" />
        </div>
      </div>
    </article>
  );
}
