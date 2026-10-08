// Redrawn from the end-of-studies report (Figure 2.13, federated architecture), via
// docs/reference/wavess-facts.md. No client names.
export const caption =
  "The platform as delivered: three product services on one shared core library and shared infrastructure. Redrawn from my end-of-studies report.";

const services = [
  { title: "Portal", body: "Identity, onboarding and workspaces for every tenant." },
  { title: "Tropicc", body: "LinkedIn content, with retrieval over each client's own material." },
  { title: "Oceanss", body: "GTM intelligence: hiring and market signals, anomaly detection, account scoring." },
];

const infrastructure = [
  { title: "Supabase PostgreSQL", body: "One database, a schema per service." },
  { title: "Redis and ARQ workers", body: "Background jobs: scraping, enrichment, scans." },
  { title: "LLM chain", body: "Groq, Cerebras, Gemini and NVIDIA NIM, with quota tracking." },
];

export function WavessArchitecture() {
  return (
    <div className="dg dg-layers">
      <ul className="dg-row">
        {services.map((box) => (
          <li key={box.title} className="dg-step">
            <span className="dg-title">{box.title}</span>
            <span className="dg-body">{box.body}</span>
          </li>
        ))}
      </ul>
      <p className="dg-step dg-core">
        <span className="dg-title">Wavess-Core, the shared library</span>
        <span className="dg-body">Token verification, tenant resolution, access gating, background jobs and LLM routing.</span>
      </p>
      <ul className="dg-row">
        {infrastructure.map((box) => (
          <li key={box.title} className="dg-step dg-infra">
            <span className="dg-title">{box.title}</span>
            <span className="dg-body">{box.body}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
