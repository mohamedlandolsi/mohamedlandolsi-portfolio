import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { TooltipDismiss } from "@/components/TooltipDismiss/TooltipDismiss";
import { getProfile } from "@/lib/content";
import "./globals.css";

// Variable weight is included by default; the width axis must be requested.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// Every route must come out of the build fully static.
export const ensureStatic = "navigation";

const profile = getProfile();

export const metadata: Metadata = {
  title: `${profile.name}, ${profile.role}`,
  description: profile.positioning,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="flex min-h-dvh flex-col">
        <div className="shell relative">
          <a href="#main" className="skip-link">
            Skip to content
          </a>
        </div>
        <Header />
        <main id="main" tabIndex={-1} className="grow">
          {children}
        </main>
        <Footer />
        <TooltipDismiss />
      </body>
    </html>
  );
}
