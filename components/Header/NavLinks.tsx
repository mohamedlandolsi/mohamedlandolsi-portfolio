"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/decisions", label: "Decisions" },
  { href: "/cv", label: "CV" },
  { href: "/#contact", label: "Contact" },
];

/** Mono links; the page you are on is filled in cyan. */
export function NavLinks() {
  const pathname = usePathname();
  return (
    <div className="nav-links">
      {NAV.map((item) => (
        <Link key={item.href} href={item.href} aria-current={item.href === pathname ? "page" : undefined}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}
