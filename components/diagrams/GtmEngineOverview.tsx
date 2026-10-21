import { Flow } from "./Flow";

// Redrawn from docs/reference/gtm-engine-architecture.md (first diagram and the run order table),
// with the Sprint 10 move of config, drafts and review into Neon Postgres.
export const caption = "One cycle in run order.";

export function GtmEngineOverview() {
  return (
    <Flow
      steps={[
        { title: "Engine: find and filter", writes: "contacts_queue" },
        { title: "Contact finder", writes: "contact_results" },
        { title: "Engine: draft and check", writes: "outreach_queue" },
        { title: "Digest" },
        {
          title: "My review",
          body: "I approve, edit or reject each draft in the console, and send it myself.",
          human: true,
        },
      ]}
      base={{
        title: "Google Sheets and Neon Postgres",
        body: "Sheets holds accounts, contacts, the queues and the Clay hand-offs, mirrored into Postgres. Postgres holds config, drafts and every review decision.",
      }}
    />
  );
}
