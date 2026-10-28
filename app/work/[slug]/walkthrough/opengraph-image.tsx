import { getCaseStudyMeta } from "@/lib/case-studies";
import { getProfile } from "@/lib/content";
import { ogCard, ogContentType, ogSize } from "@/lib/og";
import { getVideo, getVideoSlugs } from "@/lib/videos";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = `The walkthrough's title and one-line summary, with ${getProfile().name}'s name and role.`;

export function generateStaticParams() {
  return getVideoSlugs()
    .filter((slug) => getCaseStudyMeta(slug))
    .map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = getVideo(slug);
  return ogCard({ kicker: "Narrated walkthrough", title: getCaseStudyMeta(slug)?.title ?? video.title, text: video.description });
}
