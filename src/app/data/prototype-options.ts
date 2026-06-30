export interface CertifyingSourceRecord {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
  websiteUrl: string;
  isCustom?: boolean;
}

export const CERTIFYING_SOURCE_RECORDS: CertifyingSourceRecord[] = [
  {
    id: "cicot",
    name: "CICOT (Central Islamic Council of Thailand)",
    shortName: "CICOT",
    logoUrl: "/logos/cicot.webp",
    websiteUrl: "https://www.cicot.or.th/",
  },
  {
    id: "thsi",
    name: "THSI (The Halal Standard Institute of Thailand)",
    shortName: "THSI",
    logoUrl: "/logos/thsi.webp",
    websiteUrl: "https://www.halalstandard.or.th/",
  },
  {
    id: "halal-psu",
    name: "สถาบันฮาลาล ม.อ. (Halal Inst. PSU)",
    shortName: "Halal Inst. PSU",
    logoUrl: "/logos/halal-psu.webp",
    websiteUrl: "https://halalinst.psu.ac.th/th/",
  },
  {
    id: "tahta",
    name: "TAHTA (Thai-ASEAN Halal Trade and Tourism Association)",
    shortName: "TAHTA",
    logoUrl: "/logos/tahta.webp",
    websiteUrl: "https://www.facebook.com/TAHTAThailand/?locale=th_TH",
  },
  {
    id: "tmta",
    name: "TMTA (Thai Muslim Trade Association)",
    shortName: "TMTA",
    logoUrl: "/logos/tmta.webp",
    websiteUrl: "https://www.thaimuslimtrade.com/",
  },
];

export const CERTIFYING_SOURCES = CERTIFYING_SOURCE_RECORDS.map((source) => source.name);

export const AMENITIES = [
  "Prayer Room",
  "Wudu Facility",
  "Qibla Direction",
  "Halal Kitchen",
  "No Pork",
  "No Alcohol",
  "Family Section",
  "Women-Only Section",
  "Wheelchair Access",
  "Parking",
  "WiFi",
];

export const DEFAULT_CERTIFYING_SOURCE = CERTIFYING_SOURCES[0];

export function getCertifyingSourceRecord(sourceName: string): CertifyingSourceRecord {
  return CERTIFYING_SOURCE_RECORDS.find((source) => source.name === sourceName || source.shortName === sourceName) ?? {
    id: "custom",
    name: sourceName || "Other certifying source",
    shortName: sourceName || "Other",
    websiteUrl: "#",
    isCustom: true,
  };
}

export function formatPriceRange(priceMin?: number | string, priceMax?: number | string, fallback?: string) {
  const min = Number(priceMin);
  const max = Number(priceMax);
  if (Number.isFinite(min) && Number.isFinite(max)) {
    if (min === 0 && max === 0) return "Free";
    if (min === max) return `${min.toLocaleString()} Baht`;
    return `${min.toLocaleString()}-${max.toLocaleString()} Baht`;
  }
  const numericFallback = Number(fallback);
  if (Number.isFinite(numericFallback)) return `${numericFallback.toLocaleString()} Baht`;
  return fallback || "Price not specified";
}

export function averagePriceForAi(priceMin?: number | string, priceMax?: number | string, fallback?: string) {
  const min = Number(priceMin);
  const max = Number(priceMax);
  if (Number.isFinite(min) && Number.isFinite(max)) return Math.round((min + max) / 2);
  const numericFallback = Number(fallback);
  return Number.isFinite(numericFallback) ? numericFallback : 0;
}

export const CONSENT_CATEGORIES = [
  {
    id: "tourist-preferences",
    title: "Tourist profile, favorites, reviews",
    purpose: "Personalized trip planning, saved places, and review moderation.",
  },
  {
    id: "entrepreneur-documents",
    title: "Entrepreneur contact and certification documents",
    purpose: "Place verification, document review, renewal reminders, and audit evidence.",
  },
  {
    id: "support-messages",
    title: "Support Center conversations",
    purpose: "Case handling, service quality review, and dispute traceability.",
  },
  {
    id: "location-planning",
    title: "Location usage for AI Planner and Map",
    purpose: "Nearby recommendations, route feasibility, and current-location planning.",
  },
];
