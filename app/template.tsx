/**
 * A template is mounted again on every route change, so each page fades in as it opens. The
 * effect is one CSS animation: it needs no JavaScript and is off under reduced motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
