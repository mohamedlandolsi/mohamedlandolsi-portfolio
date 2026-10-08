import { getProfile, isTodo } from "@/lib/content";

export function Footer() {
  const { name, links } = getProfile();

  return (
    <footer className="shell section pb-10">
      <p className="type-meta flex flex-wrap gap-x-6 gap-y-1">
        <span>
          {name}, {process.env.BUILD_YEAR}
        </span>
        <span>Built with Next.js, set in Archivo.</span>
        {!isTodo(links.site_repo) && <a href={links.site_repo}>Source of this site</a>}
      </p>
    </footer>
  );
}
