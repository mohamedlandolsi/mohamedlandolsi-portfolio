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
    <section id="contact" className="shell section" aria-labelledby="contact-title">
      <h2 id="contact-title" className="type-h2">
        Contact
      </h2>
      <p className="type-lead measure mt-12">
        {availability.text} {availability.relocation}
      </p>
      <p className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
        <a href={`mailto:${links.email}`} className="text-body font-[650] [overflow-wrap:anywhere] sm:text-h3">
          {links.email}
        </a>
        <CopyEmail email={links.email} />
      </p>
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
        {profiles.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
        <li>
          <Link href="/cv">CV</Link>
        </li>
      </ul>
    </section>
  );
}
