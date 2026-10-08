import { Sieve } from "@/components/Sieve/Sieve";

/** The hero sieve inside a case study: final state only, no animation. */
export function SieveFigure({ project }: { project: string }) {
  return (
    <div className="case-wide case-sieve">
      <Sieve slug={project} animate={false} />
    </div>
  );
}
