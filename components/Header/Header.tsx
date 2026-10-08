import Link from "next/link";
import { getProfile } from "@/lib/content";

const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/decisions", label: "Decisions" },
  { href: "/cv", label: "CV" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const { name } = getProfile();

  return (
    <header className="shell flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pt-8 pb-2">
      <Link
        href="/"
        data-text={name}
        className="wordmark text-body font-[720] tracking-[-0.01em] [font-variation-settings:'wdth'_112]"
      >
        {name}
      </Link>
      <nav aria-label="Main">
        <ul className="-mx-2 flex flex-wrap gap-x-2">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="type-meta text-small text-ink inline-block px-2 py-1">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
