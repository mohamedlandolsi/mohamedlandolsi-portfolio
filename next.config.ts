import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import profile from "./content/profile.json";

// The .dev domain is attached to the same Vercel project. It must not serve a second copy of the site.
const RETIRED_HOSTS = ["www\\.mohamedlandolsi\\.dev", "mohamedlandolsi\\.dev"];

const nextConfig: NextConfig = {
  // The footer year is fixed at build time: the site is fully static.
  env: { BUILD_YEAR: String(new Date().getFullYear()) },
  cacheComponents: true,
  // The old site served its own copy of the CV at this path, and it is linked from old
  // applications. It now points at the hosted PDF. Temporary, because that address may change.
  async redirects() {
    return [
      // Every address on a retired host goes to the same path on the primary one.
      ...RETIRED_HOSTS.map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: `${profile.links.site}/:path*`,
        permanent: true,
      })),
      { source: "/Mohamed-Landolsi-CV.pdf", destination: profile.links.cv_pdf, permanent: false },
      // The old site was one index.html; search engines may still hold that address.
      { source: "/index.html", destination: "/", permanent: true },
    ];
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
