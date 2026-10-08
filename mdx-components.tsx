import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import { Decision } from "@/components/mdx/Decision";
import { Diagram } from "@/components/mdx/Diagram";
import { Links } from "@/components/mdx/Links";
import { Metric } from "@/components/mdx/Metric";
import { MetricRow } from "@/components/mdx/MetricRow";
import { Screenshot } from "@/components/mdx/Screenshot";
import { SieveFigure } from "@/components/mdx/SieveFigure";

/** "What broke, and what I changed" becomes "what-broke-and-what-i-changed", for deep links. */
function anchor(children: ReactNode): string | undefined {
  if (typeof children !== "string") return undefined;
  return children
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const components: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2 id={anchor(children)} className="type-h2" {...props}>
      {children}
    </h2>
  ),
  h3: (props) => <h3 className="type-h3" {...props} />,
  Decision,
  Diagram,
  Links,
  Metric,
  MetricRow,
  // The case study page renders the facts in its margin column (mobile: above the text).
  ProjectFacts: () => null,
  Screenshot,
  Sieve: SieveFigure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
