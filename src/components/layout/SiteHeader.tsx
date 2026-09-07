"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout/Container";
import { navLinks, site } from "@/lib/site";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid
          ? "border-b border-clay-200 bg-sand-50/95 backdrop-blur-sm"
          : "border-b border-transparent"
      }`}
    >
      <Container className="flex h-20 items-center justify-between gap-4">
        <Link
          href="#top"
          className="flex items-center gap-3"
        >
          <img
            src="/images/marci-metzger-logo.png"
            alt="Marci Metzger"
            className="h-11 w-11 rounded-full object-cover"
          />

          <span
            className={`font-serif text-base leading-tight tracking-tight transition-colors duration-500 sm:text-lg ${
              solid ? "text-ink-900" : "text-sand-50"
            }`}
          >
            {site.agent}
            <span
              className={`eyebrow block text-[0.5625rem] ${
                solid ? "text-ink-500" : "text-sand-50/75"
              }`}
            >
              {site.brokerage}
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[0.8125rem] tracking-wide transition-colors duration-300 ${
                solid
                  ? "text-ink-800 hover:text-terracotta-600"
                  : "text-sand-50/90 hover:text-sand-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={site.phone.href}
            className={`hidden text-[0.8125rem] tracking-[0.08em] transition-colors duration-300 xl:inline ${
              solid ? "text-ink-800 hover:text-terracotta-600" : "text-sand-50"
            }`}
          >
            {site.phone.display}
          </a>
          <a
            href={site.phone.href}
            className="whitespace-nowrap bg-terracotta-600 px-4 py-3 text-[0.75rem] uppercase tracking-[0.16em] text-sand-50 transition-colors duration-300 hover:bg-terracotta-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta-600 sm:px-5"
          >
            Call<span className="hidden sm:inline"> Now</span>
          </a>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={`flex h-11 w-11 items-center justify-center lg:hidden ${
              solid ? "text-ink-900" : "text-sand-50"
            }`}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.25" />
              ) : (
                <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.25" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="h-[calc(100svh-5rem)] overflow-y-auto border-t border-clay-200 bg-sand-50 lg:hidden"
      >
        <Container className="flex flex-col gap-6 py-10">
          <nav aria-label="Mobile" className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-2xl text-ink-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-clay-200 pt-6 text-sm leading-relaxed text-ink-500">
            <p>{site.address.street}</p>
            <p>{site.address.cityStateZip}</p>
            <p className="mt-2">{site.hours.summary}</p>
          </div>
        </Container>
      </div>
    </header>
  );
}
