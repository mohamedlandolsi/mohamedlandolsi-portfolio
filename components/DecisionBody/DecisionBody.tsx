import Link from "next/link";
import { RichText } from "@/components/RichText/RichText";
import { getDecision, type Decision } from "@/lib/content";

/** Context, decision and trade-offs of one decision, shared by case studies and the decision log. */
export function DecisionBody({ decision }: { decision: Decision }) {
  const replacement = decision.superseded_by ? getDecision(decision.superseded_by) : null;
  const rows = [
    ["Context", decision.context],
    ["Decision", decision.decision],
    ["Trade-offs", decision.tradeoffs],
  ];

  return (
    <>
      {replacement && (
        <p className="decision-superseded">
          Superseded by{" "}
          <Link href={`/decisions#${replacement.id}`}>
            {replacement.id}: {replacement.title}
          </Link>
        </p>
      )}
      <dl className="decision-fields">
        {rows.map(([label, text]) => (
          <div key={label}>
            <dt className="spec-label mb-1">{label}</dt>
            <dd>
              <RichText text={text} />
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
