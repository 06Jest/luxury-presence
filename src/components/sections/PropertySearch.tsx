"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SelectField, TextField } from "@/components/ui/Field";
import {
  LISTINGS_ROUTE_ENABLED,
  bathroomOptions,
  bedroomOptions,
  buildListingsHref,
  describeFilters,
  emptyFilters,
  propertyTypes,
  sortOptions,
  type SearchFilters,
} from "@/lib/listings";
import { site } from "@/lib/site";

export function PropertySearch() {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>(emptyFilters);
  const [summary, setSummary] = useState<string | null>(null);

  const update =
    (key: keyof SearchFilters) =>
    (event: { target: { value: string } }) => {
      setFilters((current) => ({ ...current, [key]: event.target.value }));
      setSummary(null);
    };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (LISTINGS_ROUTE_ENABLED) {
      router.push(buildListingsHref(filters));
      return;
    }
    setSummary(describeFilters(filters));
  };

  const onReset = () => {
    setFilters(emptyFilters);
    setSummary(null);
  };

  return (
    <Section id="search" labelledBy="search-heading" className="bg-sand-50">
      <Reveal className="max-w-2xl" stagger>
        <Eyebrow>Find your dream home</Eyebrow>
        <h2
          id="search-heading"
          className="mt-6 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] tracking-tight text-ink-900"
        >
          Start with what matters to you.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-ink-500">
          Set your criteria and Marci will walk you through everything on the market that
          fits - including the homes that haven&rsquo;t hit the listing sites yet.
        </p>
      </Reveal>

      <Reveal className="mt-14">
        <form onSubmit={onSubmit} onReset={onReset} className="border-t border-clay-200 pt-10">
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            <TextField
              id="search-location"
              label="Location"
              placeholder="Pahrump, Mountain Falls…"
              value={filters.location}
              onChange={update("location")}
            />
            <SelectField
              id="search-type"
              label="Type"
              options={propertyTypes}
              value={filters.type}
              onChange={update("type")}
            />
            <SelectField
              id="search-sort"
              label="Sort by"
              options={sortOptions}
              value={filters.sort}
              onChange={update("sort")}
            />
            <SelectField
              id="search-bedrooms"
              label="Bedrooms"
              options={bedroomOptions}
              value={filters.bedrooms}
              onChange={update("bedrooms")}
            />
            <SelectField
              id="search-bathrooms"
              label="Baths"
              options={bathroomOptions}
              value={filters.bathrooms}
              onChange={update("bathrooms")}
            />
            <div className="grid grid-cols-2 gap-6">
              <TextField
                id="search-min-price"
                label="Min price"
                inputMode="numeric"
                placeholder="$"
                value={filters.minPrice}
                onChange={update("minPrice")}
              />
              <TextField
                id="search-max-price"
                label="Max price"
                inputMode="numeric"
                placeholder="$"
                value={filters.maxPrice}
                onChange={update("maxPrice")}
              />
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Button type="submit">Search now</Button>
            <button
              type="reset"
              className="text-[0.8125rem] uppercase tracking-[0.16em] text-ink-500 underline decoration-clay-400 underline-offset-8 transition-colors duration-300 hover:text-ink-900"
            >
              Clear
            </button>
          </div>

          <p aria-live="polite" className="mt-8 text-base leading-relaxed text-ink-500">
            {summary ? (
              <>
                Searching for {summary}. Listing results aren&rsquo;t connected to this site
                yet -{" "}
                <a
                  href={site.phone.href}
                  className="text-ink-900 underline decoration-clay-400 underline-offset-4 hover:text-terracotta-600"
                >
                  call {site.phone.display}
                </a>{" "}
                and Marci will send you everything that matches.
              </>
            ) : null}
          </p>
        </form>
      </Reveal>
    </Section>
  );
}
