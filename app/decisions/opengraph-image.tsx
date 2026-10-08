import { getDecisions, getProjects } from "@/lib/content";
import { ogCard, ogContentType, ogSize } from "@/lib/og";

const decisions = getDecisions();
const projects = getProjects().filter((project) => decisions.some((decision) => decision.project === project.slug));
const projectNames = new Intl.ListFormat("en", { type: "conjunction" }).format(projects.map((project) => project.title));

export const size = ogSize;
export const contentType = ogContentType;
export const alt = `Decision log: ${decisions.length} written decisions behind ${projectNames}.`;

export default function Image() {
  return ogCard({
    kicker: "Decisions",
    title: "Decision log",
    text: `${decisions.length} written decisions behind ${projectNames}: the context, the choice and the trade-offs of each one.`,
  });
}
