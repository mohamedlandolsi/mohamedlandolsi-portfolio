import type { Sieve } from "@/lib/content";
import { narrowLayout } from "./geometry";
import { at, BinFills, BinLabel, Cluster, Defs, Field, Gate, Path, ReviewMark, vars } from "./parts";

const ID = "sieve-n";
/** Bin labels start right of the longest bar. */
const LABEL_X = 136;

/** Mobile and tablet composition: the same run, flowing top to bottom. */
export function SieveNarrow({ sieve, label }: { sieve: Sieve; label: string }) {
  const layout = narrowLayout(sieve);
  const gateMiddle = (layout.gate[0].y1 + layout.gate[1].y1) / 2;
  const clusterRight = Math.max(...layout.clusterDots.map((dot) => dot.x)) + layout.dot;
  const clusterMiddle = (layout.clusterDots[0].y + layout.clusterDots[layout.clusterDots.length - 1].y) / 2;

  return (
    <div className="sieve-narrow">
      <div className="relative" data-composition="narrow">
        <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={label}>
          <Defs id={ID} layout={layout} />
          <Field id={ID} layout={layout} />
          <Gate layout={layout} />
          <Path layout={layout} />
          <Cluster layout={layout} />
        </svg>
        <BinFills layout={layout} axis="x" />
        <div aria-hidden="true">
          <span className="sieve-label sieve-number" style={at(layout, 0, 0)}>
            <span className="type-metric">{sieve.input.value}</span>
            <span className="type-meta">{sieve.input.label}</span>
          </span>
          <span className="sieve-label sieve-middle type-meta" style={at(layout, layout.gate[0].x2 + 10, gateMiddle)}>
            {sieve.gate_label}
          </span>
          <span className="sieve-label sieve-number sieve-middle sieve-late" style={at(layout, clusterRight + 14, clusterMiddle)}>
            <span className="type-metric">{sieve.passed.value}</span>
            <span className="type-meta">{sieve.passed.label}</span>
          </span>
          {layout.stages.map((stage, index) => (
            // Set into the dotted line: the label starts at the left edge and covers the line behind it.
            <span
              key={stage.y}
              className="sieve-label sieve-middle sieve-stage-label type-meta"
              style={{ ...at(layout, 0, stage.y), ...vars({ "--t": `${stage.t}ms` }) }}
            >
              {sieve.next[index]}
            </span>
          ))}
          <ReviewMark label={sieve.next[sieve.next.length - 1]} style={at(layout, layout.mark.x, layout.mark.y)} />
        </div>
        <ul aria-label="Rejected by rules">
          {sieve.rejected.map((bin, index) => (
            <BinLabel
              key={bin.reason}
              id={`${ID}-rule-${index}`}
              index={index}
              bin={bin}
              className="sieve-label"
              style={{ ...at(layout, LABEL_X, layout.bins[index].y - 4), width: `${((layout.width - LABEL_X) / layout.width) * 100}%` }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
