import { DecisionLog, type DecisionGroup } from "@/components/DecisionLog/DecisionLog";
import { InlineScript } from "@/components/InlineScript/InlineScript";
import { isPublished } from "@/lib/case-studies";
import { getDecision, getDecisions, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

/** Decisions grouped by project, in the order of content/projects.json (the newest project is first there). */
function getGroups(): DecisionGroup[] {
  const decisions = getDecisions();
  const projects = getProjects();
  const stray = decisions.find((decision) => !projects.some((project) => project.slug === decision.project));
  if (stray) throw new Error(`${stray.id} belongs to "${stray.project}", which is not in content/projects.json`);

  return projects
    .map((project) => ({
      slug: project.slug,
      title: project.title,
      caseStudy: isPublished(project.slug) ? `/work/${project.slug}` : null,
      // Only what the page shows goes to the browser (no internal source notes).
      decisions: decisions
        .filter((decision) => decision.project === project.slug)
        .map(({ id, title, status, context, decision, tradeoffs, superseded_by }) => {
          const replacement = superseded_by ? getDecision(superseded_by) : null;
          return {
            id,
            title,
            status,
            context,
            decision,
            tradeoffs,
            replacement: replacement && { id: replacement.id, title: replacement.title },
          };
        }),
    }))
    .filter((group) => group.decisions.length > 0);
}

const groups = getGroups();
const total = groups.reduce((sum, group) => sum + group.decisions.length, 0);
const projectNames = new Intl.ListFormat("en", { type: "conjunction" }).format(groups.map((group) => group.title));

export const metadata = pageMetadata({
  title: "Decision log",
  description: `${total} written decisions behind ${projectNames}: the context, the choice and the trade-offs of each one, searchable and linkable by ID.`,
  path: "/decisions",
});

// On a full page load, open the decision named in the URL hash before the first paint, so nothing
// shifts when the page hydrates. DecisionLog does the same for later hash changes.
const OPEN_LINKED_DECISION = `(function(){try{var id=decodeURIComponent(location.hash.slice(1));var row=id&&document.getElementById(id);if(row&&row.tagName==="DETAILS"){row.open=true;row.setAttribute("data-current","")}}catch(e){}})()`;

export default function Decisions() {
  return (
    <div className="shell">
      <header className="hero decision-hero">
        <h1 className="type-h1">Decision log</h1>
        <p className="thesis">
          {total} decisions from {groups.length === 2 ? "two" : groups.length} projects, each with its context, the
          choice and what it cost. A superseded decision stays in the log and links to what replaced it.
        </p>
      </header>
      {/* Search and filters need JavaScript. Without it the rows still open and close. */}
      <noscript>
        <style>{`.decision-tools{display:none}`}</style>
      </noscript>
      <DecisionLog groups={groups} />
      <InlineScript html={OPEN_LINKED_DECISION} />
    </div>
  );
}
