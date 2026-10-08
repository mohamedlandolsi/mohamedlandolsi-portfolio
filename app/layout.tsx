import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { TooltipDismiss } from "@/components/TooltipDismiss/TooltipDismiss";
import { rootMetadata } from "@/lib/metadata";
import "./globals.css";

// No font is preloaded: on a slow phone network the preloads competed with the stylesheets and
// pushed the first paint (and LCP) past 2 s. Text paints in the size-adjusted fallback and swaps
// without layout shift. Measurements in docs/ADR.md (P-11).
const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-space-grotesk", display: "swap", preload: false });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-sans", display: "swap", preload: false });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap", preload: false });

// Every route must come out of the build fully static.
export const ensureStatic = "navigation";

export const metadata = rootMetadata;

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
