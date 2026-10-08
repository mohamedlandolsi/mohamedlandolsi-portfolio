import { Flow } from "./Flow";

// Redrawn from docs/reference/gtm-engine-architecture.md (first diagram and the run order table).
export const caption =
  "One cycle in run order. Each step reads what the previous one wrote to the sheet, so every step can be checked and corrected by hand.";

export function GtmEngineOverview() {
  return (
    <Flow
      steps={[
        {
          title: "Engine: find and filter",
          body: "YC directory, Hacker News hiring threads and a seed list. Rules first: domain, size, industry, timezone, seen before. Then a score and one website fetch.",
          writes: "contacts_queue",
        },
        {
          title: "Contact finder",
          body: "Founders from the company's YC page, kept only when the page lists the same website. Others go to a search with company and location gates.",
          writes: "contact_results",
        },
        {
          title: "Engine: draft and check",
          body: "Pairs picked within caps. Drafts written from site facts by the model chain (Groq, then Gemini), checked by the validator, with a template as the last fallback.",
          writes: "outreach_queue",
        },
        {
          title: "Digest",
          body: "One Discord card per new draft, with a link to its row in the sheet.",
        },
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
