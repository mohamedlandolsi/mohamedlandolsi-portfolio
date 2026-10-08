import type { Claim } from "@/lib/content";
import { formatDate } from "@/lib/format";

const upperFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Where a number comes from, shown on hover or focus of the number. */
export function Source({ id, claim }: { id: string; claim: Claim }) {
  const status =
    claim.status === "target" ? " A goal, not a measured result." : claim.status === "self-reported" ? " Self-reported." : "";
  return (
    <span id={id} role="tooltip" className="tip">
      Source: {claim.source}. {upperFirst(formatDate(claim.date))}.{status}
    </span>
  );
}
