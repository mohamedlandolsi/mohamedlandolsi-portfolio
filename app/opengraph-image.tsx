import { getProfile } from "@/lib/content";
import { ogCard, ogContentType, ogSize } from "@/lib/og";

const profile = getProfile();

export const size = ogSize;
export const contentType = ogContentType;
export const alt = `${profile.name}, ${profile.role}: ${profile.hero_headline_options[profile.hero_headline_default]}`;

export default function Image() {
  return ogCard({
    kicker: "Open to opportunities",
    status: profile.availability.status === "open",
    title: profile.name,
    titleFaint: profile.role,
    text: profile.hero_headline_options[profile.hero_headline_default],
    footer: profile.tools.join(", "),
  });
}
