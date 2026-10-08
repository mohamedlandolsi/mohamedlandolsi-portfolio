import Link from "next/link";
import { MetricValue } from "@/components/MetricValue/MetricValue";
import { isPublished } from "@/lib/case-studies";
import { getFeaturedProjects, type Project } from "@/lib/content";

function WorkRow({ project }: { project: Project }) {
  const linked = isPublished(project.slug);
  return (
    <li className="work-row relative grid gap-x-6 gap-y-8 lg:grid-cols-12">
      <div className="lg:col-span-5 xl:col-span-4">
        <h3 className="type-h3">
          {linked ? (
            // The link covers the whole row (see .work-row in globals.css); its name stays the title.
            <Link href={`/work/${project.slug}`} className="work-row-link">
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>
        <p className="measure mt-3">{project.one_liner}</p>
        <p className="type-meta mt-4">{project.stack.join(", ")}</p>
      </div>
      <dl className="grid grid-cols-2 content-start gap-x-6 gap-y-7 md:grid-cols-4 lg:col-span-7 lg:grid-cols-2 lg:gap-x-8 xl:col-span-8 xl:grid-cols-4">
        {project.metrics.map((metric) => (
          <div key={metric.claim} className="flex flex-col-reverse justify-end gap-2">
            <dt className="type-meta text-balance">{metric.label}</dt>
            <dd>
              <MetricValue claim={metric.claim} className="type-metric work-metric" />
            </dd>
          </div>
        ))}
      </dl>
    </li>
  );
}

/** Three full-width rows, not cards. A row links to its case study once that is published. */
export function WorkRows() {
  return (
    <section id="work" className="shell section" aria-labelledby="work-title">
      <h2 id="work-title" className="type-h2">
        Work
      </h2>
      <ul className="mt-12 space-y-14">
        {getFeaturedProjects().map((project) => (
          <WorkRow key={project.slug} project={project} />
        ))}
      </ul>
    </section>
  );
}
