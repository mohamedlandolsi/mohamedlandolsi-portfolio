import type { Metadata } from "next";
import { Sieve } from "@/components/Sieve/Sieve";

// Temporary page for phase 2. Removed when the home page is built.
export const metadata: Metadata = {
  title: "Sieve test",
  robots: { index: false, follow: false },
};

export default function SieveTest() {
  return (
    <div className="shell section">
      <h1 className="type-h2 mb-12">Sieve test</h1>
      <Sieve slug="personal-gtm-engine" />
    </div>
  );
}
