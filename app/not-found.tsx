import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="shell py-24 text-center sm:py-32">
      <p className="eyebrow justify-center">
        <span className="dot" aria-hidden="true" />
        Error 404
      </p>
      <h1 className="type-h1 mx-auto max-w-[16ch] text-balance">This page did not pass the gates.</h1>
      <div className="button-row mt-9">
        <Link href="/" className="button button-primary">
          Home
        </Link>
        <Link href="/#work" className="button">
          Work
        </Link>
      </div>
    </div>
  );
}
