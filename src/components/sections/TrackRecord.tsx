import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { trackRecord } from "@/lib/site";

export function TrackRecord() {
  return (
    <Section id="approach" labelledBy="approach-heading" className="bg-sand-100">
      <Reveal className="max-w-2xl" stagger>
        <Eyebrow>Get it sold</Eyebrow>
        <h2
          id="approach-heading"
          className="mt-6 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] tracking-tight text-ink-900"
        >
          What working with Marci looks like.
        </h2>
      </Reveal>

      <Reveal className="mt-16 grid gap-px border-t border-clay-200 md:grid-cols-3" stagger>
        {trackRecord.map((item) => (
          <div
            key={item.title}
            className="border-b border-clay-200 py-10 md:border-b-0 md:border-r md:px-8 md:py-12 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
          >
            <h3 className="font-serif text-2xl leading-snug text-ink-900">{item.title}</h3>
            <p className="mt-5 text-base leading-relaxed text-ink-500">{item.body}</p>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
