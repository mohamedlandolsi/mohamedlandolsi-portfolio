import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/content";
import { displayUrl } from "@/lib/format";

// Open Graph cards in the console style, rendered at build time by next/og. They use the dark
// palette from app/globals.css (next/og cannot read CSS custom properties, so the values are
// repeated here) and static TTF cuts of the site's fonts (next/og cannot read woff2).

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const color = {
  bg: "#0E1420",
  text: "#E8E6DE",
  dim: "#8D96AA",
  faint: "#838DA1",
  cyan: "#6FE3C9",
  amber: "#FFB300",
  line: "rgba(232, 230, 222, 0.06)",
  lineStrong: "rgba(232, 230, 222, 0.18)",
};

// A Node Buffer would come out of the cache as JSON, so each file is copied into a plain ArrayBuffer.
const font = async (file: string) => new Uint8Array(await readFile(join(process.cwd(), "assets/fonts", file))).buffer;

// Reading files is uncached I/O, which would make every card render on request. Cached, the
// cards are prerendered at build time like the pages.
async function loadFonts() {
  "use cache";
  cacheLife("max");
  return Promise.all([font("SpaceGrotesk-Bold.ttf"), font("IBMPlexSans-Regular.ttf"), font("IBMPlexMono-Regular.ttf")]);
}

interface Card {
  /** Mono label above the title, uppercased like the site's eyebrows. */
  kicker: string;
  /** Availability: the kicker gets the amber status dot, as on the hero eyebrow. */
  status?: boolean;
  title: string;
  /** A second title line in the faint grey, like the hero's role line. */
  titleFaint?: string;
  text?: string;
  /** Bottom line; the name unless the card already shows it. */
  footer?: string;
}

export async function ogCard({ kicker, status = false, title, titleFaint, text, footer }: Card) {
  const { name, links } = getProfile();
  const [display, sans, mono] = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          // 64px padding and a 64px grid: the text edges and the footer rule sit on grid lines.
          padding: 64,
          backgroundColor: color.bg,
          backgroundImage: `linear-gradient(${color.line} 1px, transparent 1px), linear-gradient(90deg, ${color.line} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          color: color.text,
          fontFamily: "Plex Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: "Plex Mono",
            fontSize: 26,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: color.faint,
          }}
        >
          {status && <div style={{ width: 13, height: 13, borderRadius: 7, backgroundColor: color.amber }} />}
          {kicker}
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Space Grotesk",
              fontSize: 68,
              lineHeight: 1.06,
              letterSpacing: -1.4,
            }}
          >
            <span>{title}</span>
            {titleFaint && <span style={{ color: color.faint }}>{titleFaint}</span>}
          </div>
          {text && (
            <div style={{ maxWidth: 900, marginTop: 28, fontSize: 29, lineHeight: 1.42, color: color.dim, textWrap: "balance" }}>
              {text}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            // 20 + 34 = 54px tall, so the rule lands on the grid line at y = 512.
            paddingTop: 20,
            borderTop: `1px solid ${color.lineStrong}`,
            fontFamily: "Plex Mono",
            fontSize: 26,
            lineHeight: "34px",
            color: color.faint,
          }}
        >
          <span>{footer ?? name}</span>
          <span style={{ color: color.cyan }}>{displayUrl(links.site)}</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Space Grotesk", data: display, weight: 700, style: "normal" },
        { name: "Plex Sans", data: sans, weight: 400, style: "normal" },
        { name: "Plex Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
