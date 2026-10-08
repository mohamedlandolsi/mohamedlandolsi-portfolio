import { useId } from "react";
import { MetricValue } from "@/components/MetricValue/MetricValue";
import { getClaim, getMetricLabel } from "@/lib/content";
import { Source } from "./Source";

function RowMetric({ id }: { id: string }) {
  const claim = getClaim(id);
  const sourceId = useId();
  return (
    <div className="cell proof-item metric-block flex flex-col-reverse justify-end" tabIndex={0} data-tip-host="" aria-describedby={sourceId}>
      <dt className="proof-label">{getMetricLabel(id)}</dt>
      <dd>
        <MetricValue claim={id} className="proof-num" />
        <Source id={sourceId} claim={claim} />
      </dd>
    </div>
  );
}

/** Two to five results in a number strip; it wraps to two columns on a phone. Hover or focus shows the source. */
export function MetricRow({ claims }: { claims: string }) {
  const ids = claims.split(",").map((id) => id.trim());
  return (
    <dl className="cells proof-strip metric-row">
      {ids.map((id) => (
        <RowMetric key={id} id={id} />
      ))}
    </dl>
  );
}
