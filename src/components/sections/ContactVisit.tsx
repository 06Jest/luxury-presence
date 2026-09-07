"use client";

import { FormEvent, useState } from "react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { site } from "@/lib/site";

type Intent = "buying" | "selling" | "both" | "exploring";

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  intent: Intent | "";
  message: string;
}

type ContactFormErrors = Partial<Record<"name" | "email" | "message", string>>;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const EMPTY_VALUES: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  intent: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INTENT_OPTIONS: { value: Intent; label: string }[] = [
  { value: "buying", label: "Buying a home" },
  { value: "selling", label: "Selling a home" },
  { value: "both", label: "Both" },
  { value: "exploring", label: "Just exploring" },
];

const inputClasses =
  "w-full rounded-sm border border-clay-300 bg-white px-4 py-3 text-base text-ink-900 transition-colors duration-300 placeholder:text-ink-400 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-200";

const errorInputClasses =
  "border-terracotta-600 focus:border-terracotta-600 focus:ring-terracotta-200";

export function ContactVisit() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function updateField<K extends keyof ContactFormValues>(
    field: K,
    value: ContactFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(current: ContactFormValues): ContactFormErrors {
    const next: ContactFormErrors = {};

    if (!current.name.trim()) {
      next.name = "Please enter your name.";
    }

    if (!current.email.trim()) {
      next.email = "Please enter your email.";
    } else if (!EMAIL_PATTERN.test(current.email.trim())) {
      next.email = "Please enter a valid email address.";
    }

    if (!current.message.trim()) {
      next.message = "Please add a short message.";
    }

    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setStatus("submitting");

    try {
      // There is no backend in this build. This pause only mirrors the time
      // a real submission would take, so the interaction still feels
      // considered rather than instant - it does not send anything.
      await new Promise((resolve) => setTimeout(resolve, 600));
      setValues(EMPTY_VALUES);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section id="contact" labelledBy="contact-heading" className="bg-sand-50">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
        <div className="flex flex-col">
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

          <Reveal className="mt-14 flex flex-col gap-10 border-t border-clay-200 pt-10">
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

        <Reveal stagger className="lg:border-l lg:border-clay-200 lg:pl-16">
          <h3 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-tight tracking-tight text-ink-900">
            Let&apos;s talk about your next move.
          </h3>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-500">
            Whether you&apos;re buying, selling, or simply exploring your
            options, send a message and we&apos;ll get back to you.
          </p>

          {status === "success" ? (
            <div className="mt-10 max-w-md border border-clay-200 bg-white px-8 py-10">
              <p className="font-serif text-2xl leading-snug text-ink-900">
                Thanks. Your message is ready to be sent.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink-500">
                If it&apos;s urgent, call us directly at{" "}
                <a
                  href={site.phone.href}
                  className="text-ink-800 underline decoration-clay-400 underline-offset-4 hover:text-terracotta-600"
                >
                  {site.phone.display}
                </a>
                .
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-8 text-sm font-medium text-terracotta-600 underline underline-offset-4 hover:text-terracotta-700"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit}
              className="mt-10 flex max-w-md flex-col gap-6"
            >
              <p className="text-sm text-ink-500">
                Fields marked <span className="text-terracotta-600">*</span>{" "}
                are required.
              </p>

              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium text-ink-700"
                >
                  Name <span className="text-terracotta-600">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? "contact-name-error" : undefined
                  }
                  value={values.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className={`mt-2 ${inputClasses} ${
                    errors.name ? errorInputClasses : ""
                  }`}
                />
                {errors.name ? (
                  <p
                    id="contact-name-error"
                    role="alert"
                    className="mt-2 text-sm text-terracotta-700"
                  >
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-ink-700"
                >
                  Email <span className="text-terracotta-600">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "contact-email-error" : undefined
                  }
                  value={values.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className={`mt-2 ${inputClasses} ${
                    errors.email ? errorInputClasses : ""
                  }`}
                />
                {errors.email ? (
                  <p
                    id="contact-email-error"
                    role="alert"
                    className="mt-2 text-sm text-terracotta-700"
                  >
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="block text-sm font-medium text-ink-700"
                >
                  Phone <span className="text-ink-400">(optional)</span>
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className={`mt-2 ${inputClasses}`}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-intent"
                  className="block text-sm font-medium text-ink-700"
                >
                  I&apos;m interested in{" "}
                  <span className="text-ink-400">(optional)</span>
                </label>
                <select
                  id="contact-intent"
                  name="intent"
                  value={values.intent}
                  onChange={(event) =>
                    updateField("intent", event.target.value as Intent | "")
                  }
                  className={`mt-2 ${inputClasses}`}
                >
                  <option value="">Select an option</option>
                  {INTENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-ink-700"
                >
                  Message <span className="text-terracotta-600">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                  value={values.message}
                  onChange={(event) =>
                    updateField("message", event.target.value)
                  }
                  className={`mt-2 resize-none ${inputClasses} ${
                    errors.message ? errorInputClasses : ""
                  }`}
                />
                {errors.message ? (
                  <p
                    id="contact-message-error"
                    role="alert"
                    className="mt-2 text-sm text-terracotta-700"
                  >
                    {errors.message}
                  </p>
                ) : null}
              </div>

              {status === "error" ? (
                <p role="alert" className="text-sm text-terracotta-700">
                  Something went wrong on our end. Please try again, or call
                  us directly at {site.phone.display}.
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={status === "submitting"}
                className="self-start"
              >
                {status === "submitting" ? "Sending…" : "Send message"}
              </Button>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  );
}