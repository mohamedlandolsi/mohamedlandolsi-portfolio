import type { MetadataRoute } from "next";
import { isPublished } from "@/lib/case-studies";
import { getProjects } from "@/lib/content";
import { siteUrl } from "@/lib/metadata";

/** Every indexable page. Draft case studies stay out until they are published. */
export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = getProjects()
    .filter((project) => isPublished(project.slug))
    .map((project) => `/work/${project.slug}`);

  return ["/", ...caseStudies, "/decisions", "/cv"].map((path) => ({ url: new URL(path, siteUrl).href }));
}
