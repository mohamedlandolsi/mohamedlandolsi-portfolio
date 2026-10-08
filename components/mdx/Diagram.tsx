import { diagrams, type DiagramName } from "@/components/diagrams";
import "@/components/diagrams/diagrams.css";

/**
 * A redrawn diagram. It is presented as one image: the alt text is its accessible name, and the
 * caption under it says what to look at.
 */
export function Diagram({ name, alt }: { name: DiagramName; alt: string }) {
  const { Drawing, caption } = diagrams[name];
  return (
    <figure className="diagram">
      <div role="img" aria-label={alt}>
        <Drawing />
      </div>
      <figcaption className="diagram-caption">{caption}</figcaption>
    </figure>
  );
}
