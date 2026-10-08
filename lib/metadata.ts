import type { Metadata } from "next";
import { getProfile } from "@/lib/content";

const { name, role, positioning, links } = getProfile();

export const siteUrl = new URL(links.site);
export const siteTitle = `${name}, ${role}`;

/** Defaults for every route. Pages add their own title, description and canonical path. */
export const rootMetadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: siteTitle, template: `%s | ${name}` },
  description: positioning,
  applicationName: name,
  authors: [{ name, url: links.site }],
  creator: name,
  openGraph: { type: "website", siteName: name, locale: "en", title: siteTitle, description: positioning },
  twitter: { card: "summary_large_image", title: siteTitle, description: positioning },
};

interface PageMeta {
  /** Short page title; the root template adds the name. Omit for the home page. */
  title?: string;
  description: string;
  path: string;
  /** Drafts build so they can be reviewed, but are never indexed. */
  noindex?: boolean;
}

/** Title, description, canonical URL and the matching Open Graph and X fields for one page. */
export function pageMetadata({ title, description, path, noindex }: PageMeta): Metadata {
  const fullTitle = title ? `${title} | ${name}` : siteTitle;
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: name, locale: "en", url: path, title: fullTitle, description },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    ...(noindex && { robots: { index: false, follow: false } }),
  };
}
