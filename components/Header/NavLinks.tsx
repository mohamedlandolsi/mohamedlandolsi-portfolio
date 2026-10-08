"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Mono links; the page you are on is filled in cyan. The CV is the hosted PDF until /cv exists. */
export function NavLinks({ cv }: { cv: string }) {
  const NAV = [
    { href: "/#work", label: "Work" },
    { href: "/decisions", label: "Decisions" },
    { href: cv, label: "CV" },
    { href: "/#contact", label: "Contact" },
  ];
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
