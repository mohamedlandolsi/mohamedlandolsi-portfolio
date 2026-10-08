import { Fragment } from "react";
import { getClaim } from "@/lib/content";

/**
 * A claim's value in the metric face, always read from content/claims.json by ID.
 * Joining words in ranges and ratios ("466 to 617", "8 of 8") stay at text size.
 */
export function MetricValue({ claim, className }: { claim: string; className?: string }) {
  const parts = getClaim(claim).value.split(/ (to|of) /);
  return (
    <span className={className}>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <Fragment key={index}>
            {" "}
            <span className="metric-word">{part}</span>{" "}
          </Fragment>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </span>
  );
}
