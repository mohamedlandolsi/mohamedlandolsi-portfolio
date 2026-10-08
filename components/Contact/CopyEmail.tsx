"use client";

import { useEffect, useState } from "react";

/** Copies the address and confirms with "Copied" for two seconds. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // No clipboard access: the mailto link next to the button still works.
    }
  }

  return (
    <>
      <button type="button" className="button" onClick={copy} data-print="hide">
        {copied ? "Copied" : "Copy e-mail"}
      </button>
      <span role="status" className="sr-only">
        {copied ? "E-mail address copied" : ""}
      </span>
    </>
  );
}
