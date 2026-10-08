// Redrawn from the end-of-studies report (section 3.2.2 and Table 3.2, the routing strategy;
// Figure 2.18, the fallback chain), via docs/reference/wavess-facts.md. The report gives each
// provider's role on a path, not the order of the fallbacks, so the fallbacks are listed as a set.
export const caption = "The router's three paths. Redrawn from my end-of-studies report.";

const paths = [
  { title: "General", when: "Every other request.", primary: "Groq Scout", fallback: ["Groq Fast", "Gemini Flash-Lite"] },
  { title: "Classification", when: "Short classification tasks.", primary: "Cerebras", fallback: ["Groq Fast"] },
  { title: "Long context", when: "Requests with a long input.", primary: "Gemini Flash-Lite", fallback: ["Groq Scout", "Gemini Flash"] },
];

const LAST_RESORT = "NVIDIA NIM";

export function WavessLlmRouter() {
  return (
    <div className="dg dg-layers">
      <p className="dg-step dg-core">
        <span className="dg-title">One router in Wavess-Core</span>
        <span className="dg-body">
          Every model call from Portal, Tropicc and Oceanss, routed by task type and estimated size.
        </span>
      </p>
      <ul className="dg-paths">
        {paths.map((path) => (
          <li key={path.title} className="dg-step">
            <span className="dg-title">{path.title}</span>
            <span className="dg-body">{path.when}</span>
            <ul className="dg-chain">
              <li>
                <span className="dg-role">Primary</span>
                <span className="dg-model">{path.primary}</span>
              </li>
              <li>
                <span className="dg-role">Fallback</span>
                <span>
                  {path.fallback.map((model, index) => (
                    <span key={model} className="dg-model">
                      {model}
                      {index < path.fallback.length - 1 && ", "}
                    </span>
                  ))}
                </span>
              </li>
              <li>
                <span className="dg-role">Last resort</span>
                <span className="dg-model">{LAST_RESORT}</span>
              </li>
            </ul>
          </li>
        ))}
      </ul>
      <p className="dg-base">
        <span className="dg-title">Quota counters in Redis</span>
        <span className="dg-body">One per provider per day. A provider close to its daily cap is skipped before it starts refusing calls.</span>
      </p>
    </div>
  );
}
