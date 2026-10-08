import { Fragment } from "react";

/** Plain text from content/, where `backticks` mark a config key or field name. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/`([^`]+)`/).map((part, index) =>
        index % 2 === 1 ? <code key={index}>{part}</code> : <Fragment key={index}>{part}</Fragment>,
      )}
    </>
  );
}
