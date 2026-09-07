import { Section } from "@/components/layout/Section";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { services } from "@/lib/site";

export function Services() {
  return (
    <Section id="services" labelledBy="services-heading" className="bg-sand-100">
      <Reveal className="max-w-2xl" stagger>
        <Eyebrow>Our services</Eyebrow>
        <h2
          id="services-heading"
          className="mt-6 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] tracking-tight text-ink-900"
        >
          Nervous about your property adventure? Don&rsquo;t be.
        </h2>
      </Reveal>

      <div className="mt-20 flex flex-col gap-20 lg:gap-32">
        {services.map((service, i) => (
          <Reveal
            key={service.title}
            className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <ParallaxImage
              src={service.image}
              alt={service.alt}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[4/3] w-full"
            />
            <div className="max-w-xl">
              <p className="eyebrow text-clay-400">0{i + 1}</p>
              <h3 className="mt-5 font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-tight text-ink-900">
                {service.title}
              </h3>
              <p className="mt-6 text-lg leading-relaxed text-ink-500">{service.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
