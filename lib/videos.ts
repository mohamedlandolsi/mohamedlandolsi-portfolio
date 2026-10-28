import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getProject, getProjects, type Video } from "@/lib/content";

// The walkthroughs listed in content/projects.json, with their length read from the file at build
// time, so the caption can show it without the player fetching the video first. Each one also has
// a page of its own, the link to share.

export interface VideoFile extends Video {
  slug: string;
  /** The video's own page. */
  path: string;
  seconds: number;
  /** "2 min 24 s" */
  length: string;
  /** "PT2M24S", for structured data. */
  isoDuration: string;
}

/** Seconds from the movie header of an MP4 in public/. The file must be faststart (moov first). */
function mp4Seconds(file: string): number {
  const head = readFileSync(join(process.cwd(), "public", file)).subarray(0, 1 << 20);
  const at = head.indexOf("mvhd", 0, "latin1");
  if (at < 0) throw new Error(`public${file} has no movie header in its first MB (encode with +faststart)`);
  const box = at + 4;
  if (head[box] === 1) {
    // version 1: 8-byte creation and modification times, 4-byte timescale, 8-byte duration
    return Number(head.readBigUInt64BE(box + 24)) / head.readUInt32BE(box + 20);
  }
  return head.readUInt32BE(box + 16) / head.readUInt32BE(box + 12);
}

export function walkthroughPath(slug: string): string {
  return `/work/${slug}/walkthrough`;
}

export function getVideo(slug: string): VideoFile {
  const video = getProject(slug).video;
  if (!video) throw new Error(`Project "${slug}" has no video (content/projects.json)`);
  const seconds = Math.round(mp4Seconds(video.file));
  const minutes = Math.floor(seconds / 60);
  return {
    ...video,
    slug,
    path: walkthroughPath(slug),
    seconds,
    length: minutes > 0 ? `${minutes} min ${seconds % 60} s` : `${seconds} s`,
    isoDuration: `PT${minutes > 0 ? `${minutes}M` : ""}${seconds % 60}S`,
  };
}

/** Slugs of the projects that have a walkthrough. */
export function getVideoSlugs(): string[] {
  return getProjects()
    .filter((project) => project.video)
    .map((project) => project.slug);
}
