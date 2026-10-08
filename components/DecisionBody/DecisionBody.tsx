import Link from "next/link";
import { RichText } from "@/components/RichText/RichText";
import type { Decision } from "@/lib/content";

export type DecisionText = Pick<Decision, "id" | "title" | "context" | "decision" | "tradeoffs">;
export type DecisionRef = Pick<Decision, "id" | "title">;

/**
 * Context, decision and trade-offs of one decision, shared by case studies and the decision log.
 * It takes plain data only: the log renders it in the browser, and no content file may follow it there.
 */
export function DecisionBody({
  decision,
  replacement,
  inLog = false,
}: {
  decision: DecisionText;
  replacement: DecisionRef | null;
  /** Inside the log a replacement is on the same page, so its link is a plain hash. */
  inLog?: boolean;
}) {
  const rows = [
    ["Context", decision.context],
    ["Decision", decision.decision],
    ["Trade-offs", decision.tradeoffs],
  ];
  const replacementLabel = replacement ? `${replacement.id}: ${replacement.title}` : "";

  return (
    <>
      {replacement && (
        <p className="decision-superseded">
          Superseded by{" "}
          {inLog ? (
            <a href={`#${replacement.id}`}>{replacementLabel}</a>
          ) : (
            <Link href={`/decisions#${replacement.id}`}>{replacementLabel}</Link>
          )}
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
