import type { CSSProperties } from "react";

// A left-to-right pipeline (top to bottom on narrow screens) in the console style. Machine steps
// show a title and what they hand on; only the human step carries a sentence.

export interface FlowStep {
  title: string;
  /** Only for the human step: the numbered list under the diagram explains the machine steps. */
  body?: string;
  /** What this step hands to the next one (a sheet tab, a queue). */
  writes?: string;
  /** A person decides here. */
  human?: boolean;
}

export interface FlowBase {
  title: string;
  body: string;
  /** First and last step (1-based) that read this shared state; all steps if left out. */
  span?: [number, number];
}

export function Flow({ steps, base }: { steps: FlowStep[]; base?: FlowBase }) {
  const span = base?.span ?? [1, steps.length];
  return (
    <div className="dg" style={{ "--dg-steps": steps.length } as CSSProperties}>
      <ol className="dg-flow">
        {steps.map((step) => (
          <li key={step.title} className={step.human ? "dg-step dg-human" : "dg-step"}>
            <span className="dg-title">{step.title}</span>
            {step.body && <span className="dg-body">{step.body}</span>}
            {step.writes && <span className="dg-writes">Writes {step.writes}</span>}
          </li>
        ))}
      </ol>
      {base && (
        <div className="dg-base-row">
          <p className="dg-base" style={{ "--dg-from": span[0], "--dg-to": span[1] + 1 } as CSSProperties}>
            <span className="dg-title">{base.title}</span>
            <span className="dg-body">{base.body}</span>
          </p>
        </div>
      )}
    </div>
  );
}
