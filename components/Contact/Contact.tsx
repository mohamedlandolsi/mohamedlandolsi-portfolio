import Link from "next/link";
import { getProfile, isTodo } from "@/lib/content";
import { CopyEmail } from "./CopyEmail";

export function Contact() {
  const { availability, links } = getProfile();
  const profiles = [
    { label: "LinkedIn", href: links.linkedin },
    { label: "GitHub", href: links.github },
  ].filter((link) => !isTodo(link.href));

  return (
    <section id="contact" className="shell section section-last contact" aria-labelledby="contact-title">
      <h2 id="contact-title" className="contact-title">
        Contact
      </h2>
      <p className="contact-note">
        {availability.text} {availability.relocation}
      </p>
      <div className="button-row">
        <a href={`mailto:${links.email}`} className="button button-primary [overflow-wrap:anywhere]">
          {links.email}
        </a>
        <CopyEmail email={links.email} />
        {profiles.map((link) => (
          <a key={link.label} href={link.href} className="button">
            {link.label}
          </a>
        ))}
        <Link href="/cv" className="button">
          CV
        </Link>
      </div>
    </section>
  );
}
