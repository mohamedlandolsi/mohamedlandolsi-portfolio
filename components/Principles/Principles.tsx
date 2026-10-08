import Link from "next/link";
import { getDecision, getDecisions, getProfile } from "@/lib/content";

/** Four principles, each ending with the decision that shows it in practice. Not a sequence. */
export function Principles() {
  const { principles } = getProfile();
  const decisions = getDecisions();
  const projects = new Set(decisions.map((decision) => decision.project)).size;

  return (
    <section id="how-i-work" className="shell section" aria-labelledby="how-title">
      <h2 id="how-title" className="type-h2">
        How I work
      </h2>
      <ul className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-12">
        {principles.map((principle, index) => {
          const decision = getDecision(principle.decision);
          return (
            <li key={principle.title} className={index % 2 === 0 ? "lg:col-span-5" : "lg:col-span-5 lg:col-start-7"}>
              <h3 className="type-h3">{principle.title}</h3>
              <p className="mt-3">{principle.text}</p>
              <p className="type-meta text-ink mt-3">
                <Link href={`/decisions#${decision.id}`}>
                  {decision.id}: {decision.title}
                </Link>
              </p>
            </li>
          );
        })}
      </ul>
      <p className="type-lead measure mt-16 lg:mt-20">
        {decisions.length} decisions from {projects === 2 ? "two" : projects} projects are written down, each with its
        context, the choice and what it cost. <Link href="/decisions">Open the decision log</Link>
      </p>
    </section>
  );
}
