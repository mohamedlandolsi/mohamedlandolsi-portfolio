import { getProfile } from "@/lib/content";
import { ogCard, ogContentType, ogSize } from "@/lib/og";

const profile = getProfile();

export const size = ogSize;
export const contentType = ogContentType;
export const alt = `CV of ${profile.name}, ${profile.role}.`;

export default function Image() {
  return ogCard({
    kicker: "CV",
    title: profile.name,
    text: `${profile.role}. ${profile.availability.short}`,
    footer: profile.location,
  });
}
