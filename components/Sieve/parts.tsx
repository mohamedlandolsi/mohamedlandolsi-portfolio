import type { CSSProperties } from "react";
import type { SieveBin } from "@/lib/content";
import type { Box, SieveLayout } from "./geometry";

/** Inline custom properties for the CSS animation. */
export function vars(values: Record<string, string | number>): CSSProperties {
  return values as CSSProperties;
}

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

/** Positions an HTML element over the SVG, in percent of the drawing, so it follows the scaling. */
export function at(layout: SieveLayout, x: number, y: number, edge: "top" | "bottom" = "top"): CSSProperties {
  return edge === "top"
    ? { left: pct(x, layout.width), top: pct(y, layout.height) }
    : { left: pct(x, layout.width), bottom: pct(layout.height - y, layout.height) };
}

function boxAt(layout: SieveLayout, box: Box): CSSProperties {
  return { ...at(layout, box.x, box.y), width: pct(box.width, layout.width), height: pct(box.height, layout.height) };
}

/** The pattern for the source field. `id` keeps the two compositions apart. */
export function Defs({ id, layout }: { id: string; layout: SieveLayout }) {
  const { field, dot } = layout;
  return (
    <defs>
      <pattern
        id={`${id}-field`}
        width={field.pitch}
        height={field.pitch}
        patternUnits="userSpaceOnUse"
        x={field.x - field.pitch / 2}
        y={field.y - field.pitch / 2}
      >
        <circle cx={field.pitch / 2} cy={field.pitch / 2} r={dot} />
      </pattern>
    </defs>
  );
}

/**
 * The companies of the run, as they arrived. In the final state they are in the light ink:
 * most were rejected, and the full ink belongs to the ones that passed.
 */
export function Field({ id, layout }: { id: string; layout: SieveLayout }) {
  const { field, dot } = layout;
  return (
    <g className="sieve-field">
      <rect
        x={field.x - field.pitch / 2}
        y={field.y - field.pitch / 2}
        width={field.cols * field.pitch}
        height={field.fullRows * field.pitch}
        fill={`url(#${id}-field)`}
      />
      {field.rest.map((point) => (
        <circle key={point.x} cx={point.x} cy={point.y} r={dot} />
      ))}
    </g>
  );
}

export function Gate({ layout }: { layout: SieveLayout }) {
  return (
    <g className="sieve-gate">
      {layout.gate.map((line) => (
        <line key={`${line.x1}-${line.y1}`} {...line} />
      ))}
    </g>
  );
}

/** The dotted line through the next stages, drawn dot by dot. */
export function Path({ layout }: { layout: SieveLayout }) {
  return (
    <g className="sieve-path">
      {layout.path.map((point) => (
        <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r="1.5" style={vars({ "--t": `${point.t}ms` })} />
      ))}
    </g>
  );
}

/** The companies that passed, at rest. While the animation plays they arrive on the canvas instead. */
export function Cluster({ layout }: { layout: SieveLayout }) {
  return (
    <g className="sieve-cluster">
      {layout.clusterDots.map((point) => (
        <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r={layout.dot} />
      ))}
    </g>
  );
}

/** Halftone bins in HTML, so the dot screen stays on whole pixels at every scale. */
export function BinFills({ layout, axis }: { layout: SieveLayout; axis: "x" | "y" }) {
  return (
    <div aria-hidden="true">
      {layout.bins.map((bin, index) => (
        <span key={index} data-bin-fill={index} className={`sieve-bin sieve-bin-${axis}`} style={boxAt(layout, bin)} />
      ))}
    </div>
  );
}

/** Count and reason of one bin. Focusable; shows the gate rule on hover or focus. */
export function BinLabel({
  id,
  index,
  bin,
  className,
  style,
}: {
  id: string;
  index: number;
  bin: SieveBin;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <li tabIndex={0} data-bin="" aria-describedby={id} className={`sieve-bin-label ${className ?? ""}`} style={style}>
      <span className="sieve-count" data-count={bin.count} data-index={index}>
        {bin.count}
      </span>{" "}
      <span className="sieve-reason">{bin.reason}</span>
      <span id={id} role="tooltip" className="sieve-rule">
        {bin.rule}
      </span>
    </li>
  );
}

export function ReviewMark({ label, style }: { label: string; style: CSSProperties }) {
  return (
    <span className="sieve-mark" style={style}>
      {label}
    </span>
  );
}
