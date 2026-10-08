import { useId } from "react";
import { MetricValue } from "@/components/MetricValue/MetricValue";
import { getClaim } from "@/lib/content";
import { Source } from "./Source";

/**
 * A number from the claim ledger. Inline: the claim's own phrase inside a sentence. Block: the
 * value in the metric face with its label. Either way, hover or focus shows the source.
 */
export function Metric({ claim: id, inline }: { claim: string; inline?: boolean }) {
  const claim = getClaim(id);
  const sourceId = useId();

  if (inline) {
    return (
      <span className="metric-inline" tabIndex={0} data-tip-host="" aria-describedby={sourceId}>
        {claim.inline}
        <Source id={sourceId} claim={claim} />
      </span>
    );
  }

  return (
    <p className="panel proof-item metric-block inline-block min-w-[14rem]" tabIndex={0} data-tip-host="" aria-describedby={sourceId}>
      <MetricValue claim={id} className="proof-num" />
      <span className="proof-label max-w-[28ch]">{claim.label}</span>
      <Source id={sourceId} claim={claim} />
    </p>
  );
}
