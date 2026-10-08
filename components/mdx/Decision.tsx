import Link from "next/link";
import { DecisionBody } from "@/components/DecisionBody/DecisionBody";
import { getDecision } from "@/lib/content";

/** A decision from the log, collapsed to its ID and title. Plain details/summary: works without JS. */
export function Decision({ id }: { id: string }) {
  const decision = getDecision(id);
  return (
    <details className="decision">
      <summary>
        <span className="decision-id">{decision.id}</span>
        <span className="decision-title">{decision.title}</span>
      </summary>
      <div className="decision-content">
        <DecisionBody decision={decision} />
        <p className="type-meta mt-4">
          <Link href={`/decisions#${decision.id}`}>Open {decision.id} in the decision log</Link>
        </p>
      </div>
    </details>
  );
}
