import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { site } from "@/lib/site";

export function ContactVisit() {
  return (
    <Section id="contact" labelledBy="contact-heading" className="bg-sand-50">
      <div className="grid gap-14 lg:grid-cols-[6fr_5fr] lg:gap-24">
        <Reveal stagger>
          <Eyebrow>Call or visit</Eyebrow>
          <h2
            id="contact-heading"
            className="mt-6 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] tracking-tight text-ink-900"
          >
            Come by the office, or just call.
          </h2>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink-500">
            {site.hours.note}
          </p>
          <a
            href={site.phone.href}
            className="mt-10 inline-block font-serif text-[clamp(2rem,5vw,3rem)] leading-none text-ink-900 transition-colors duration-300 hover:text-terracotta-600"
          >
            {site.phone.display}
          </a>
        </Reveal>

        <Reveal className="flex flex-col gap-10 border-t border-clay-200 pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
          <div>
            <Eyebrow>Office</Eyebrow>
            <p className="mt-4 text-lg leading-relaxed text-ink-800">
              {site.address.street}
              <br />
              {site.address.cityStateZip}
              <br />
              {site.address.country}
            </p>
          </div>

          <div>
            <Eyebrow>Hours</Eyebrow>
            <p className="mt-4 text-lg text-ink-800">{site.hours.summary}</p>
          </div>

          <div>
            <Eyebrow>Follow</Eyebrow>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-lg text-ink-800">
              {site.social.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline decoration-clay-400 underline-offset-8 transition-colors duration-300 hover:text-terracotta-600"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <ButtonLink
            href={site.address.directionsUrl}
            variant="outline"
            target="_blank"
            rel="noreferrer noopener"
            className="self-start"
          >
            Get directions
          </ButtonLink>
        </Reveal>
      </div>
    </Section>
  );
}
