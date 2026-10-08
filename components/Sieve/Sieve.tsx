import Link from "next/link";
import { getSieve, type Sieve as SieveData } from "@/lib/content";
import { SieveAnimator } from "./SieveAnimator";
import { SieveNarrow } from "./SieveNarrow";
import { SieveWide } from "./SieveWide";
import "./sieve.css";

const ID = "sieve";

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);
const upperFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** The whole result in one sentence, for the SVG's accessible name. */
function describe(sieve: SieveData): string {
  const rejected = sieve.rejected.reduce((sum, bin) => sum + bin.count, 0);
  const bins = sieve.rejected.map((bin) => `${bin.short} ${bin.count}`).join(", ");
  const next = sieve.next.map(lowerFirst);
  const stages = next.length > 1 ? `${next.slice(0, -1).join(", ")}, and ${next[next.length - 1]}` : next[0];
  return `${sieve.input.value} ${sieve.input.label}: ${rejected} rejected by rules before any AI call (${bins}), ${sieve.passed.value} ${sieve.passed.label}, then ${stages}.`;
}

/**
 * The hero visual: one real run of the GTM Engine falling through its rule gates.
 * Server-rendered in its final state; SieveAnimator plays the load animation once on top
 * (home page only: `animate={false}` keeps the final state, as in case studies).
 * getSieve fails the build if the counts do not add up.
 */
export function Sieve({ slug, animate = true }: { slug: string; animate?: boolean }) {
  const sieve = getSieve(slug);
  const label = describe(sieve);

  return (
    <>
      <figure id={ID} data-sieve="final" className="sieve" suppressHydrationWarning>
        <SieveWide sieve={sieve} label={label} />
        <SieveNarrow sieve={sieve} label={label} />
        {/* A table cannot shrink to sr-only size itself, so its wrapper does. */}
        <div className="sr-only">
          <table>
            <caption>Companies at each step of the run</caption>
            <thead>
              <tr>
                <th scope="col">Step</th>
                <th scope="col">Companies</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{upperFirst(sieve.input.label)}</th>
                <td>{sieve.input.value}</td>
              </tr>
              {sieve.rejected.map((bin) => (
                <tr key={bin.reason}>
                  <th scope="row">Rejected: {lowerFirst(bin.reason)}</th>
                  <td>{bin.count}</td>
                </tr>
              ))}
              <tr>
                <th scope="row">{upperFirst(sieve.passed.label)}</th>
                <td>{sieve.passed.value}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <figcaption className="type-meta measure mt-14 text-pretty">
          {sieve.caption}
          {/* On the home page the caption points to the case study; inside it, it does not need to. */}
          {animate && (
            <>
              {" "}
              <Link href={`/work/${slug}#what-i-built`}>How the gates work</Link>
            </>
          )}
        </figcaption>
      </figure>
      {animate && <SieveAnimator id={ID} sieve={sieve} />}
    </>
  );
}
