"use client";

import { useEffect, useState } from "react";

interface CopyButtonProps {
  /** What goes on the clipboard. */
  text: string;
  /** "Copy e-mail", "Copy link". */
  label: string;
  /** Read out by screen readers once the copy worked. */
  status: string;
}

/**
 * Copies the text and confirms with "Copied" for two seconds. Both labels sit in the same
 * place, so the button keeps its width while one fades into the other.
 */
export function CopyButton({ text, label, status }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // No clipboard access: the link or address next to the button still works.
    }
  }

  return (
    <>
      <button type="button" className="button copy-button" onClick={copy} data-copied={copied ? "" : undefined} data-print="hide">
        <span className="label-swap">
          <span aria-hidden={copied}>{label}</span>
          <span aria-hidden={!copied}>Copied</span>
        </span>
      </button>
      <span role="status" className="sr-only">
        {copied ? status : ""}
      </span>
    </>
  );
}
