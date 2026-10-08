import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { TooltipDismiss } from "@/components/TooltipDismiss/TooltipDismiss";
import { getProfile } from "@/lib/content";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-space-grotesk", display: "swap" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

// Every route must come out of the build fully static.
export const ensureStatic = "navigation";

const profile = getProfile();

export const metadata: Metadata = {
  title: `${profile.name}, ${profile.role}`,
  description: profile.positioning,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The theme toggle sets data-theme on <html>; React must not undo it. data-scroll-behavior
    // tells Next that scrolling is smooth in CSS, so route changes still jump instead of gliding.
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <div className="bg-grid" aria-hidden="true" />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="relative z-[1] grow">
          {children}
        </main>
        <Footer />
        <TooltipDismiss />
      </body>
    </html>
  );
}
