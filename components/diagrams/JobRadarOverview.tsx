import { Flow } from "./Flow";

// Redrawn from docs/reference/job-radar-spec.md, section 3 (as-built wiring) and section 7 (status column).
export const caption = "One workflow, run every morning.";

export function JobRadarOverview() {
  return (
    <Flow
      steps={[
        { title: "Sources" },
        { title: "Filter before the model" },
        { title: "Extract and score" },
        { title: "Deliver", writes: "matches, ops, Discord" },
        {
          title: "My review",
          body: "I give every match a verdict (good, false positive, applied). The verdicts drive the next tuning change.",
          human: true,
        },
      ]}
      base={{
        title: "Config tab",
        body: "Thresholds, keyword lists and weights, with a revision number for every change.",
        span: [2, 3],
      }}
    />
  );
}
