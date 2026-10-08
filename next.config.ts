import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import profile from "./content/profile.json";

const nextConfig: NextConfig = {
  // The footer year is fixed at build time: the site is fully static.
  env: { BUILD_YEAR: String(new Date().getFullYear()) },
  cacheComponents: true,
  // The old site served its own copy of the CV at this path, and it is linked from old
  // applications. It now points at the hosted PDF. Temporary, because that address may change.
  async redirects() {
    return [{ source: "/Mohamed-Landolsi-CV.pdf", destination: profile.links.cv_pdf, permanent: false }];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Frontmatter is parsed so it stays out of the page (ADR P-09). Plugins are named as strings for Turbopack.
const withMDX = createMDX({
  options: { remarkPlugins: ["remark-frontmatter"] },
});

export default withMDX(nextConfig);
