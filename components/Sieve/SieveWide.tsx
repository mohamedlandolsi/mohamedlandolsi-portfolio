import type { Sieve } from "@/lib/content";
import { wideLayout } from "./geometry";
import { at, BinFills, BinLabel, Cluster, Defs, Field, Gate, Path, ReviewMark, vars } from "./parts";

const ID = "sieve-w";
/** Labels sit on one line above the drawing; numbers grow upward from it. */
const LABEL_LINE = 100;

const upperFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Desktop composition: field, gate, passed cluster and stages left to right, bins under the gate. */
export function SieveWide({ sieve, label }: { sieve: Sieve; label: string }) {
  const layout = wideLayout(sieve);
  const gateX = (layout.gate[0].x1 + layout.gate[1].x1) / 2;
  const firstBin = layout.bins[0].x;
  const slot = layout.bins.length > 1 ? layout.bins[1].x - firstBin : layout.bins[0].width;
  const rest = layout.width - firstBin - slot * layout.bins.length;
  const columns = `${firstBin}fr repeat(${layout.bins.length}, ${slot}fr) ${Math.max(rest, 0)}fr`;

  return (
    <div className="sieve-wide">
      <div className="relative" data-composition="wide">
        <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={label}>
          <Defs id={ID} layout={layout} />
          <Field id={ID} layout={layout} />
          <Gate layout={layout} />
          <Path layout={layout} />
          <Cluster layout={layout} />
        </svg>
        <BinFills layout={layout} axis="y" />
        <div aria-hidden="true">
          <span className="sieve-label sieve-number" style={at(layout, 0, LABEL_LINE, "bottom")}>
            <span className="type-metric">{sieve.input.value}</span>
            <span className="type-meta">{upperFirst(sieve.input.label)}</span>
          </span>
          <span className="sieve-label sieve-centered type-meta" style={at(layout, gateX, LABEL_LINE, "bottom")}>
            {sieve.gate_label}
          </span>
          <span
            className="sieve-label sieve-number sieve-late"
            style={at(layout, layout.cluster.x - layout.dot, LABEL_LINE, "bottom")}
          >
            <span className="type-metric">{sieve.passed.value}</span>
            <span className="type-meta">{upperFirst(sieve.passed.label)}</span>
          </span>
          {layout.stages.map((stage, index) => (
            <span
              key={stage.x}
              className="sieve-label sieve-stage-label type-meta"
              style={{ ...at(layout, stage.x, stage.y), maxWidth: `${(150 / layout.width) * 100}%`, ...vars({ "--t": `${stage.t}ms` }) }}
            >
              {sieve.next[index]}
            </span>
          ))}
          <ReviewMark label={sieve.next[sieve.next.length - 1]} style={{ right: 0, top: at(layout, 0, layout.mark.y).top }} />
        </div>
      </div>
      <ul className="sieve-bins-wide" style={{ gridTemplateColumns: columns }} aria-label="Rejected by rules">
        {sieve.rejected.map((bin, index) => (
          <BinLabel
            key={bin.reason}
            id={`${ID}-rule-${index}`}
            index={index}
            bin={bin}
            style={index === 0 ? { gridColumnStart: 2 } : undefined}
          />
        ))}
      </ul>
    </div>
  );
}
