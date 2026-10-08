import { Flow } from "./Flow";

// Redrawn from docs/reference/gtm-engine-architecture.md (first diagram and the run order table).
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
          body: "I approve, edit or reject each draft in the sheet, and send it myself.",
          human: true,
        },
      ]}
      base={{
        title: "One Google Sheet",
        body: "Holds config, accounts, every queue and the ops log the steps read and write.",
      }}
    />
  );
}
