import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { getProfile } from "@/lib/content";
import { NavLinks } from "./NavLinks";

export function Header() {
  const { name } = getProfile();

  return (
    <header className="topnav">
      <nav aria-label="Main" className="shell nav-inner">
        <Link href="/" className="nav-mark">
          {name}
        </Link>
        <div className="nav-right">
          <NavLinks />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
