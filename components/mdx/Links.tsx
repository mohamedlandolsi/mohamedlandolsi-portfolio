import Link from "next/link";
import { getDecisions, getProject, isTodo } from "@/lib/content";

/** Repo, Loom and the project's decisions. Links still marked TODO in content/ are left out. */
export function Links({ slug }: { slug: string }) {
  const project = getProject(slug);
  const decisions = getDecisions().filter((decision) => decision.project === slug).length;
  const links = [
    { label: "Repository on GitHub", href: project.links.repo },
    { label: "Loom walkthrough", href: project.links.loom },
  ].filter((link): link is { label: string; href: string } => !isTodo(link.href));

  if (links.length === 0 && decisions === 0) return null;
  return (
    <ul className="project-links case-links">
      {links.map((link) => (
        <li key={link.label}>
          <a href={link.href} className="project-link-btn">
            {link.label}
          </a>
        </li>
      ))}
      {decisions > 0 && (
        <li>
          <Link href={`/decisions#${slug}`} className="project-link-btn">
            All {decisions} decisions for this project
          </Link>
        </li>
      )}
    </ul>
  );
}
