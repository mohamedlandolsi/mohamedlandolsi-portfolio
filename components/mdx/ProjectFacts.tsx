import { getProject, isTodo } from "@/lib/content";

/** Role, period, status, stack and links of a project, from content/projects.json, as a spec grid. */
export function ProjectFacts({ slug }: { slug: string }) {
  const project = getProject(slug);
  const links = [
    { label: "Repository", href: project.links.repo },
    { label: "Loom walkthrough", href: project.links.loom },
  ].filter((link): link is { label: string; href: string } => !isTodo(link.href));
  const rows = [
    { label: "Role", value: project.role },
    { label: "Period", value: project.period },
    { label: "Status", value: project.status },
    { label: "Stack", value: project.stack.join(", ") },
  ];

  return (
    <dl className="cells spec-grid project-facts" aria-label="Project facts">
      {rows.map((row) => (
        <div key={row.label} className="spec-cell">
          <dt className="spec-label">{row.label}</dt>
          <dd className="spec-value">{row.value}</dd>
        </div>
      ))}
      {links.length > 0 && (
        <div className="spec-cell">
          <dt className="spec-label">Links</dt>
          {links.map((link) => (
            <dd key={link.label} className="spec-value">
              <a href={link.href}>{link.label}</a>
            </dd>
          ))}
        </div>
      )}
    </dl>
  );
}
