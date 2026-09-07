import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { navLinks, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-ink-900 py-16 text-sand-50 sm:py-20">
      <Container className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl">{site.agent}</p>
          <p className="eyebrow mt-2 text-sand-50/60">{site.brokerage}</p>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-sand-50/75">
            {site.address.street}
            <br />
            {site.address.cityStateZip}
          </p>
          <a
            href={site.phone.href}
            className="mt-4 inline-block font-serif text-xl transition-colors duration-300 hover:text-clay-400"
          >
            {site.phone.display}
          </a>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3 text-sm text-sand-50/75">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors duration-300 hover:text-sand-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3 text-sm text-sand-50/75">
          {site.social.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors duration-300 hover:text-sand-50"
            >
              {item.label}
            </a>
          ))}
        </div>
      </Container>

      <Container className="mt-14 border-t border-sand-50/15 pt-8">
        <p className="text-xs tracking-wide text-sand-50/50">
          Copyright © {new Date().getFullYear()} Marci Metzger - All Rights Reserved
        </p>
      </Container>
    </footer>
  );
}
