/**
 * The /listings route does not exist yet - flip this once a listings feed is wired up
 * and the search form will navigate instead of summarising the criteria in place.
 */
export const LISTINGS_ROUTE_ENABLED = false;

export const propertyTypes = [
  "Any type",
  "House",
  "Condo",
  "Townhouse",
  "Manufactured",
  "Land",
  "Commercial",
] as const;

export const sortOptions = [
  "Newest",
  "Oldest",
  "Least Expensive to Most",
  "Most Expensive to Least",
  "Bedrooms (Low to High)",
  "Bedrooms (High to Low)",
  "Bathrooms (Low to High)",
  "Bathrooms (High to Low)",
] as const;

export const bedroomOptions = [
  "Any Number",
  "Studio",
  "1+",
  "2+",
  "3+",
  "4+",
  "5+",
  "6+",
] as const;

export const bathroomOptions = ["Any Number", "1+", "2+", "3+", "4+", "5+", "6+"] as const;

export type SearchFilters = {
  location: string;
  type: string;
  sort: string;
  bedrooms: string;
  bathrooms: string;
  minPrice: string;
  maxPrice: string;
};

export const emptyFilters: SearchFilters = {
  location: "",
  type: propertyTypes[0],
  sort: sortOptions[0],
  bedrooms: bedroomOptions[0],
  bathrooms: bathroomOptions[0],
  minPrice: "",
  maxPrice: "",
};

const defaults: Partial<Record<keyof SearchFilters, string>> = {
  type: propertyTypes[0],
  bedrooms: bedroomOptions[0],
  bathrooms: bathroomOptions[0],
};

/** Serialise the filters into the query string `/listings` will read. */
export function buildListingsQuery(filters: SearchFilters): string {
  const params = new URLSearchParams();
  (Object.keys(filters) as (keyof SearchFilters)[]).forEach((key) => {
    const value = filters[key].trim();
    if (!value || value === defaults[key]) return;
    params.set(key, value);
  });
  return params.toString();
}

export function buildListingsHref(filters: SearchFilters): string {
  const query = buildListingsQuery(filters);
  return query ? `/listings?${query}` : "/listings";
}

function formatPrice(value: string): string | null {
  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  return numeric.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/** Plain-language echo of the chosen criteria - no results are implied. */
export function describeFilters(filters: SearchFilters): string {
  const qualifiers: string[] = [];
  if (filters.bedrooms !== bedroomOptions[0]) {
    qualifiers.push(
      filters.bedrooms === "Studio" ? "studio" : `${filters.bedrooms} bedroom`,
    );
  }
  if (filters.bathrooms !== bathroomOptions[0]) qualifiers.push(`${filters.bathrooms} bath`);

  const nouns: Record<string, string> = {
    House: "houses",
    Condo: "condos",
    Townhouse: "townhouses",
    Manufactured: "manufactured homes",
    Land: "land",
    Commercial: "commercial properties",
  };
  const noun = nouns[filters.type] ?? "properties";
  const parts = [...qualifiers, noun];

  if (filters.location.trim()) parts.push(`in ${filters.location.trim()}`);

  const min = formatPrice(filters.minPrice);
  const max = formatPrice(filters.maxPrice);
  if (min && max) parts.push(`between ${min} and ${max}`);
  else if (min) parts.push(`from ${min}`);
  else if (max) parts.push(`up to ${max}`);

  return parts.join(" ");
}
