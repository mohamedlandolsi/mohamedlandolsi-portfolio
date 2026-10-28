import type { MetadataRoute } from "next";
import { getCaseStudyMeta } from "@/lib/case-studies";
import { getProjects } from "@/lib/content";
import { siteUrl } from "@/lib/metadata";
import { getScreenshots } from "@/lib/screenshots";
import { getVideo } from "@/lib/videos";

const absolute = (path: string) => new URL(path, siteUrl).href;

/**
 * Every indexable page. Draft case studies stay out until they are published. A case study also
 * lists its screenshots and the date of its last change, when its file states one. A walkthrough
 * page follows its case study and lists its video.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = getProjects().flatMap((project) => {
    const meta = getCaseStudyMeta(project.slug);
    if (meta?.status !== "published") return [];
    const lastModified = meta.updated ?? meta.published;
    const images = getScreenshots(project.slug).map((shot) => absolute(shot.file));
    const page = { url: absolute(`/work/${project.slug}`), ...(lastModified && { lastModified }), ...(images.length > 0 && { images }) };
    if (!project.video) return [page];
    const video = getVideo(project.slug);
    const walkthrough = {
      url: absolute(video.path),
      lastModified: video.published,
      videos: [
        {
          title: video.title,
          description: video.description,
          thumbnail_loc: absolute(video.poster),
          content_loc: absolute(video.file),
          duration: video.seconds,
          publication_date: video.published,
        },
      ],
    };
    return [page, walkthrough];
  });

  return [{ url: absolute("/") }, ...caseStudies, { url: absolute("/decisions") }, { url: absolute("/cv") }];
}
