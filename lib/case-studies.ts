import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Frontmatter of content/case-studies/*.mdx, read at build time. A draft case study builds
// (noindex) but is never linked and never listed in the sitemap.

export type CaseStudyStatus = "draft" | "published";

export interface CaseStudyMeta {
  slug: string;
  title: string;
  /** The page title in search results and tabs, more specific than the project name. */
  pageTitle: string;
  summary: string;
  status: CaseStudyStatus;
}

const DIR = join(process.cwd(), "content", "case-studies");

export function getCaseStudyMeta(slug: string): CaseStudyMeta | null {
  const path = join(DIR, `${slug}.mdx`);
  if (!existsSync(path)) return null;
  const block = readFileSync(path, "utf8").replaceAll("\r\n", "\n").match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "";
  const field = (key: string) => block.match(new RegExp(`^${key}:\\s*(.*)$`, "m"))?.[1]?.trim() ?? "";
  const status = field("status");
  if (status !== "draft" && status !== "published") {
    throw new Error(`content/case-studies/${slug}.mdx: status must be draft or published, found "${status}"`);
  }
  const title = field("title");
  return { slug, title, pageTitle: field("page_title") || title, summary: field("summary"), status };
}

export function isPublished(slug: string): boolean {
  return getCaseStudyMeta(slug)?.status === "published";
}
