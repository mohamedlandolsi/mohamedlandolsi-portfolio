import Link from "next/link";
import "@/components/diagrams/diagrams.css";
import { getVideo } from "@/lib/videos";

/**
 * The project's narrated walkthrough from content/projects.json, in a panel like a screenshot. It
 * never plays on its own and loads only the poster until the reader presses play, so it costs the
 * page no script and no bandwidth. The caption gives its length, read from the file at build time.
 * Captions are on by default. Inside a case study the caption links to the video's own page, the
 * one to share; on that page it does not link to itself.
 */
export function Video({ project, standalone = false }: { project: string; standalone?: boolean }) {
  const video = getVideo(project);
  return (
    <figure id="walkthrough" className="panel shot">
      <video
        controls
        // The player's own menu offers no download: the walkthrough is shared by its page.
        controlsList="nodownload"
        preload="none"
        playsInline
        poster={video.poster}
        width={video.width}
        height={video.height}
        aria-label={video.title}
      >
        <source src={video.file} type="video/mp4" />
        <track kind="captions" src={video.captions} srcLang="en" label="English" default />
      </video>
      <figcaption className="diagram-caption">
        {video.length}. {video.caption}
        {!standalone && (
          <>
            {" "}
            To share it, use <Link href={video.path}>its own page</Link>.
          </>
        )}
      </figcaption>
    </figure>
  );
}
