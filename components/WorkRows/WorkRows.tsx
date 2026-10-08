import Link from "next/link";
import { MetricValue } from "@/components/MetricValue/MetricValue";
import { SectionHead } from "@/components/SectionHead/SectionHead";
import { isPublished } from "@/lib/case-studies";
import { getFeaturedProjects, isTodo, type Project } from "@/lib/content";

function ProjectCard({ project }: { project: Project }) {
  const href = isPublished(project.slug) ? `/work/${project.slug}` : null;
  const repo = isTodo(project.links.repo) ? null : project.links.repo;
  return (
    <article className="panel lift project-card reveal">
      <div className="project-top">
        <div>
          <h3 className="project-name">{href ? <Link href={href}>{project.title}</Link> : project.title}</h3>
          <p className="project-sub">{project.role}</p>
        </div>
        <span className="status-badge">{project.period}</span>
      </div>
      <p className="project-desc">{project.one_liner}</p>
      <dl className="cells proof-strip">
        {project.metrics.map((metric) => (
          <div key={metric.claim} className="cell proof-item flex flex-col-reverse justify-end">
            <dt className="proof-label">{metric.label}</dt>
            <dd>
              <MetricValue claim={metric.claim} className="proof-num" />
            </dd>
          </div>
        ))}
      </dl>
      <dl className="cells spec-grid">
        <div className="spec-cell">
          <dt className="spec-label">Status</dt>
          <dd className="spec-value">{project.status}</dd>
        </div>
        <div className="spec-cell">
          <dt className="spec-label">Stack</dt>
          <dd className="spec-value">{project.stack.join(", ")}</dd>
        </div>
      </dl>
      {(href || repo) && (
        <div className="project-links">
          {href && (
            <Link href={href} className="project-link-btn">
              Read the case study
            </Link>
          )}
          {repo && (
            <a href={repo} className="project-link-text">
              Repository on GitHub
            </a>
          )}
        </div>
      )}
    </article>
  );
}

/** One card per featured project. A card links to its case study once that is published, and to its repository once content/ names it. */
export function WorkRows() {
  return (
    <section id="work" className="shell section" aria-labelledby="work-title">
      <SectionHead id="work-title" title="Work" tag="Projects" />
      <div className="grid gap-6">
        {getFeaturedProjects().map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
