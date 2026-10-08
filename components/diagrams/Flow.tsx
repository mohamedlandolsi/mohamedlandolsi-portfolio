// A left-to-right pipeline (top to bottom on narrow screens), drawn in the two-ink style:
// ink outlines, halftone fills, sunflower only on the step where a person decides.

export interface FlowStep {
  title: string;
  body: string;
  /** What this step hands to the next one (a sheet tab, a queue). */
  writes?: string;
  /** A person decides here. */
  human?: boolean;
}

export function Flow({ steps, base }: { steps: FlowStep[]; base?: { title: string; body: string } }) {
  return (
    <div className="dg">
      <ol className="dg-flow" style={{ ["--dg-steps" as string]: steps.length }}>
        {steps.map((step) => (
          <li key={step.title} className={step.human ? "dg-step dg-human" : "dg-step"}>
            <span className="dg-title">{step.title}</span>
            <span className="dg-body">{step.body}</span>
            {step.writes && <span className="dg-writes">Writes {step.writes}</span>}
          </li>
        ))}
      </ol>
      {base && (
        <p className="dg-base">
          <span className="dg-title">{base.title}</span>
          <span className="dg-body">{base.body}</span>
        </p>
      )}
    </div>
  );
}
