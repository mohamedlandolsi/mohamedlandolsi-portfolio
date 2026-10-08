import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="shell section">
      <h1 className="type-h1 max-w-[16ch] text-balance">This page did not pass the gates.</h1>
      <p className="type-lead -mx-2 mt-8 flex gap-2">
        <Link href="/" className="inline-block px-2 py-1">
          Home
        </Link>
        <Link href="/#work" className="inline-block px-2 py-1">
          Work
        </Link>
      </p>
    </div>
  );
}
