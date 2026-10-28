import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getProject, type Video } from "@/lib/content";

// The walkthrough listed in content/projects.json, with its length read from the file at build
// time, so the caption can show it without the player fetching the video first.

export interface VideoFile extends Video {
  /** "2 min 24 s" */
  length: string;
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

function formatLength(seconds: number): string {
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  return minutes > 0 ? `${minutes} min ${total % 60} s` : `${total} s`;
}

export function getVideo(slug: string): VideoFile {
  const video = getProject(slug).video;
  if (!video) throw new Error(`Project "${slug}" has no video (content/projects.json)`);
  return { ...video, length: formatLength(mp4Seconds(video.file)) };
}
