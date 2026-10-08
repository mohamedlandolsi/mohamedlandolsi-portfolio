import { Flow } from "./Flow";

// Redrawn from docs/reference/job-radar-spec.md, section 3 (as-built wiring) and section 7 (status column).
export const caption =
  "One workflow, run every morning. Every threshold, keyword list and weight comes from the config tab, not from code.";

export function JobRadarOverview() {
  return (
    <Flow
      steps={[
        {
          title: "Sources",
          body: "Public APIs, RSS feeds and job boards. Each source has its own mapper and its own pre-filters.",
        },
        {
          title: "Filter before the model",
          body: "One merged stream, deduplicated by URL. Posting age, remote only, senior-title veto and banned phrases. Then a capped batch.",
        },
        {
          title: "Extract and score",
          body: "The LLM router (Groq, then Gemini) returns strict JSON for each posting. A weighted formula turns it into a score with reasons.",
        },
        {
          title: "Deliver",
          body: "Matches to the sheet, run telemetry to the ops tab, the best ones to a Discord digest.",
        },
        {
          title: "My review",
          body: "I give every match a verdict (good, false positive, applied). The verdicts drive the next tuning change.",
          human: true,
        },
      ]}
      base={{
        title: "Config tab",
        body: "Thresholds, keyword lists and weights, with a revision number for every change.",
      }}
    />
  );
}
