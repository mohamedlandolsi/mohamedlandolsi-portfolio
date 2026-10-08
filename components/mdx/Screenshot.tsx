import Image from "next/image";
import { getScreenshot } from "@/lib/screenshots";

/**
 * A redacted screenshot from content/projects.json, as evidence next to the text it supports. The
 * file is small and served as it is, so its text stays sharp; the caption links to it at full
 * size. The image is a second way to that file for the mouse and is left out of the tab order.
 */
export function Screenshot({ project, id }: { project: string; id: string }) {
  const shot = getScreenshot(project, id);
  const portrait = shot.height > shot.width;
  return (
    <figure className={portrait ? "panel shot shot-narrow" : "panel shot"}>
      <a href={shot.file} tabIndex={-1}>
        <Image src={shot.file} alt={shot.alt} width={shot.width} height={shot.height} unoptimized />
      </a>
      <figcaption className="diagram-caption">
        {shot.caption} <a href={shot.file}>Open the full-size image</a>
      </figcaption>
    </figure>
  );
}
