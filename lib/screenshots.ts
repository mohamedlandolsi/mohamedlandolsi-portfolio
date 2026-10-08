import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getProject, type Screenshot } from "@/lib/content";

// Screenshots listed in content/projects.json, with the size of each file read at build time so
// the page reserves the space before the image loads.

export interface ScreenshotFile extends Screenshot {
  width: number;
  height: number;
}

/** Width and height from the header of a PNG in public/. */
function pngSize(file: string): { width: number; height: number } {
  const header = readFileSync(join(process.cwd(), "public", file)).subarray(0, 24);
  if (header.toString("latin1", 12, 16) !== "IHDR") throw new Error(`public${file} is not a PNG`);
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

export function getScreenshots(slug: string): ScreenshotFile[] {
  return (getProject(slug).screenshots ?? []).map((shot) => ({ ...shot, ...pngSize(shot.file) }));
}

export function getScreenshot(slug: string, id: string): ScreenshotFile {
  const shot = getScreenshots(slug).find((candidate) => candidate.id === id);
  if (!shot) throw new Error(`Project "${slug}" has no screenshot "${id}" (content/projects.json)`);
  return shot;
}
