import { getVideo } from "@/lib/videos";

/**
 * The project's narrated walkthrough from content/projects.json, in a panel like a screenshot,
 * with nothing under it. It never plays on its own and loads only the poster until the reader
 * presses play, so it costs the page no script and no bandwidth. Captions are on by default.
 */
export function Video({ project }: { project: string }) {
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
    </figure>
  );
}
