import Image from "next/image";

import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { site } from "@/lib/site";

export function Intro() {
  return (
    <Section id="about" labelledBy="about-heading" className="bg-sand-50">
      <div className="grid items-center gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden">
            <Image
              src="/images/marci-metzger-portrait.jpg"
              alt="Portrait of Marci Metzger"
              fill
              sizes="(min-width: 1024px) 32vw, 90vw"
              className="object-cover object-top"
            />
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2" stagger>
          <Eyebrow>{site.agent}</Eyebrow>
          <h2
            id="about-heading"
            className="mt-6 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] tracking-tight text-ink-900"
          >
            Realtor for nearly three decades, in the valley she calls home.
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-800">
            Nobody knows the market like we do. Enjoy having a pro at your service — market
            analysis, upgrades lists, contractors on speed dial, &amp; more.
          </p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500">
            We live, work, and play in this community, and we&rsquo;re happy to help you find
            where to put your hard-earned dollars — whether you&rsquo;re buying your first
            place here or selling the one you&rsquo;ve loved for years.
          </p>
          <a
            href={site.phone.href}
            className="mt-10 inline-block font-serif text-2xl text-ink-900 underline decoration-clay-400 decoration-1 underline-offset-8 transition-colors duration-300 hover:text-terracotta-600"
          >
            {site.phone.display}
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
