import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

const TRUST_LOGOS = [
  {
    src: "/images/logos/ridge-realty.png",
    alt: "The Ridge Realty Group",
    title: "The Ridge Realty Group",
    description: "Local real estate expertise",
    href: "https://theridgerealty.com/",
  },
  {
    src: "/images/logos/equal-housing.png",
    alt: "Equal Housing Opportunity",
    title: "Equal Housing Opportunity",
    description: "Committed to fair housing",
    href: "https://www.hud.gov/stat/fheo/rights-obligations",
  },
  {
    src: "/images/logos/realtor.png",
    alt: "REALTOR",
    title: "REALTOR®",
    description: "Professional real estate standards",
    href: "https://www.nar.realtor/",
  },
  {
    src: "/images/logos/chamber.png",
    alt: "Pahrump Valley Chamber of Commerce",
    title: "Pahrump Valley Chamber",
    description: "Connected to the local community",
    href: "https://pahrumpchamber.com/",
  },
];

export function TrustLogos() {
  return (
    <Section className="border-y border-clay-200 bg-sand-50">
      <Reveal>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
          <div>
            <Eyebrow>Professional & Community Connections</Eyebrow>

            <h2 className="mt-6 max-w-lg font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] tracking-tight text-ink-900">
              Rooted in Pahrump.
              <br />
              Connected to the community.
            </h2>

            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-500 sm:text-lg">
              Real estate is about more than buying or selling a property.
              It is about knowing the community, building lasting relationships,
              and having the right professional network behind every
              transaction.
            </p>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-400">
              Marci works alongside established local and professional
              organizations while helping clients navigate the Pahrump real
              estate market.
            </p>
          </div>

          <div className="grid grid-cols-2 border-x border-clay-200">
            {TRUST_LOGOS.map((logo, index) => (
              <a
                key={logo.alt}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${logo.title}`}
                className={`group flex min-h-[190px] flex-col items-center justify-center px-6 py-8 text-center transition-colors duration-300 hover:bg-white focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-terracotta-600 sm:min-h-[210px] sm:px-8 ${
                  index < 2 ? "border-b border-clay-200" : ""
                } ${index % 2 === 0 ? "border-r border-clay-200" : ""}`}
              >
                <div className="flex h-24 w-full items-center justify-center">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={160}
                    height={100}
                    className="max-h-20 w-auto max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-700">
                  {logo.title}
                </p>

                <p className="mt-1 text-xs text-ink-400">
                  {logo.description}
                </p>

                <span className="mt-3 text-[10px] uppercase tracking-[0.16em] text-terracotta-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Visit website →
                </span>
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}