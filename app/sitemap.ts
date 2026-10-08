import type { MetadataRoute } from "next";
import { getCaseStudyMeta } from "@/lib/case-studies";
import { getProjects } from "@/lib/content";
import { siteUrl } from "@/lib/metadata";
import { getScreenshots } from "@/lib/screenshots";

const absolute = (path: string) => new URL(path, siteUrl).href;

/**
 * Every indexable page. Draft case studies stay out until they are published. A case study also
 * lists its screenshots and the date of its last change, when its file states one.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = getProjects().flatMap((project) => {
    const meta = getCaseStudyMeta(project.slug);
    if (meta?.status !== "published") return [];
    const lastModified = meta.updated ?? meta.published;
    const images = getScreenshots(project.slug).map((shot) => absolute(shot.file));
    return [{ url: absolute(`/work/${project.slug}`), ...(lastModified && { lastModified }), ...(images.length > 0 && { images }) }];
  });

  return [{ url: absolute("/") }, ...caseStudies, { url: absolute("/decisions") }, { url: absolute("/cv") }];
}
