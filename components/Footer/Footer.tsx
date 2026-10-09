import { getProfile, isTodo } from "@/lib/content";

export function Footer() {
  const { name, links } = getProfile();

  return (
    <footer className="shell foot-note">
      {name}, {process.env.BUILD_YEAR}.
      {!isTodo(links.site_repo) && (
        <>
          {" "}
          <a href={links.site_repo}>Source of this site</a>
        </>
      )}
    </footer>
  );
}
