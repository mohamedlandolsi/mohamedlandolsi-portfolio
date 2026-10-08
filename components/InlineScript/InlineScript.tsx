"use client";

/**
 * A script that runs while the browser parses the page, before the first paint. It only executes
 * on a full page load: rendered in the browser (a client-side navigation) it is inert text, so the
 * component that needs it must also handle that case itself.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
