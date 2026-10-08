import Link from "next/link";
import { SectionHead } from "@/components/SectionHead/SectionHead";
import { getDecision, getDecisions, getProfile } from "@/lib/content";

/** Four principles, each ending with the decision that shows it in practice. */
export function Principles() {
  const { principles } = getProfile();
  const decisions = getDecisions();
  const projects = new Set(decisions.map((decision) => decision.project)).size;

  return (
    <section id="how-i-work" className="shell section" aria-labelledby="how-title">
      <SectionHead id="how-title" title="How I work" tag="Principles" />
      <ul className="cells matrix reveal">
        {principles.map((principle) => {
          const decision = getDecision(principle.decision);
          return (
            <li key={principle.title} className="cell matrix-col">
              <h3 className="matrix-head">{principle.title}</h3>
              <p className="matrix-text">{principle.text}</p>
              <Link href={`/decisions#${decision.id}`} className="evidence-link">
                {decision.id}: {decision.title}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="lead mt-10 mb-0">
        {decisions.length} decisions from {projects === 2 ? "two" : projects} projects are written down, each with its
        context, the choice and what it cost.
      </p>
      <Link href="/decisions" className="cv-link mt-4">
        Open the decision log
      </Link>
    </section>
  );
}
