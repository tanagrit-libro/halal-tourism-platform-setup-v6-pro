import { useEffect, useState } from "react";
import { TrustStatus } from "../components/halal-badge";
import { addAuditEvent } from "./prototype-audit-workflow";
import { CERTIFYING_SOURCES } from "./prototype-options";

export type PrototypePlaceStatus =
  | "Pending Review"
  | "Under Review"
  | "Returned for Correction"
  | "Documents Requested"
  | "Approved"
  | "Rejected"
  | "Expiring Soon"
  | "Expired"
  | "Hidden";

export interface PrototypePlaceRecord {
  id: string;
  name: string;
  type: string;
  province: string;
  status: PrototypePlaceStatus;
  submittedDate: string;
  address: string;
  lat: string;
  lng: string;
  openingHours: string;
  phone: string;
  website: string;
  adminComment?: string;
  moderationHistory?: {
    date: string;
    event: string;
    actor: string;
    status: PrototypePlaceStatus;
  }[];
  docs: { license: boolean; halal: boolean; sha: boolean };
  certExpiry: string;
  certAgency: string;
  certNumber: string;
  images: number;
  image: string;
  source: string;
  priceRange: string;
  amenities: string[];
  porkFree: boolean;
  alcoholFree: boolean;
  hasPrayer: boolean;
  rating: number;
  reviews: number;
  views: number;
  trustStatus: TrustStatus;
}

const STORAGE_KEY = "halal-tourism-prototype-places-v1";

const TYPE_IMAGES: Record<string, string> = {
  Restaurant: "https://images.unsplash.com/photo-1769265114898-083ad50197f4?w=400",
  Cafe: "https://images.unsplash.com/photo-1523288926042-67186ad1ada0?w=400",
  Hotel: "https://images.unsplash.com/photo-1652024057080-77d76186ebf6?w=400",
  Resort: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
  Mosque: "https://images.unsplash.com/photo-1645334633515-4adec58e546a?w=400",
  "Prayer Facility": "https://images.unsplash.com/photo-1768152860286-15fa04f4b1a1?w=400",
  Attraction: "https://images.unsplash.com/photo-1678915554115-a5e2de853191?w=400",
};

export function imageForPlaceType(type: string) {
  return TYPE_IMAGES[type] ?? TYPE_IMAGES.Attraction;
}

export const DEFAULT_PROTOTYPE_PLACES: PrototypePlaceRecord[] = [
  {
    id: "demo-1",
    name: "Al-Baraka Restaurant",
    type: "Restaurant",
    province: "Bangkok",
    status: "Approved",
    submittedDate: "2026-01-10",
    address: "123 Sukhumvit Rd",
    lat: "13.7563",
    lng: "100.5018",
    openingHours: "08:00-22:00",
    phone: "+66 2 111 2222",
    website: "https://al-baraka.com",
    docs: { license: true, halal: true, sha: true },
    certExpiry: "2027-01-10",
    certAgency: CERTIFYING_SOURCES[0],
    certNumber: "CICOT-2026-0101",
    images: 5,
    image: imageForPlaceType("Restaurant"),
    source: CERTIFYING_SOURCES[0],
    priceRange: "350",
    amenities: ["Prayer Room", "No Pork", "No Alcohol", "WiFi"],
    porkFree: true,
    alcoholFree: true,
    hasPrayer: true,
    rating: 4.8,
    reviews: 234,
    views: 1245,
    trustStatus: "certified",
  },
  {
    id: "demo-2",
    name: "Phuket Muslim Hotel",
    type: "Hotel",
    province: "Phuket",
    status: "Pending Review",
    submittedDate: "2026-02-08",
    address: "45 Patong Beach",
    lat: "7.8804",
    lng: "98.3923",
    openingHours: "24 Hours",
    phone: "+66 76 222 333",
    website: "https://phukethotel.com",
    docs: { license: true, halal: false, sha: true },
    certExpiry: "2026-09-30",
    certAgency: CERTIFYING_SOURCES[1],
    certNumber: "THSI-2026-PENDING-0218",
    images: 3,
    image: imageForPlaceType("Hotel"),
    source: "Owner Submitted",
    priceRange: "2500",
    amenities: ["Prayer Room", "WiFi"],
    porkFree: true,
    alcoholFree: false,
    hasPrayer: true,
    rating: 0,
    reviews: 0,
    views: 54,
    trustStatus: "pending",
  },
  {
    id: "demo-3",
    name: "Chiang Mai Community Prayer Hall",
    type: "Mosque",
    province: "Chiang Mai",
    status: "Returned for Correction",
    submittedDate: "2026-02-05",
    address: "88 Charoen Prathet",
    lat: "18.7061",
    lng: "98.9817",
    openingHours: "05:00-20:00",
    phone: "+66 53 123 456",
    website: "https://chiangmai-prayerhall.org",
    adminComment: "Certificate scan is illegible. Please re-upload a high-resolution PDF.",
    docs: { license: true, halal: true, sha: false },
    certExpiry: "2025-12-31",
    certAgency: CERTIFYING_SOURCES[0],
    certNumber: "CICOT-2025-0182",
    images: 2,
    image: imageForPlaceType("Mosque"),
    source: CERTIFYING_SOURCES[0],
    priceRange: "0",
    amenities: ["Prayer Room", "Wudu Facility", "Qibla Direction"],
    porkFree: true,
    alcoholFree: true,
    hasPrayer: true,
    rating: 0,
    reviews: 0,
    views: 12,
    trustStatus: "owner-submitted",
  },
  {
    id: "demo-4",
    name: "Halal Seafood Paradise",
    type: "Restaurant",
    province: "Pattaya",
    status: "Expiring Soon",
    submittedDate: "2025-06-01",
    address: "55 Beach Rd",
    lat: "12.9354",
    lng: "100.8827",
    openingHours: "10:00-23:00",
    phone: "+66 38 333 444",
    website: "https://halalseafood.co.th",
    docs: { license: true, halal: true, sha: true },
    certExpiry: "2026-07-01",
    certAgency: CERTIFYING_SOURCES[0],
    certNumber: "CICOT-2025-0444",
    images: 4,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400",
    source: CERTIFYING_SOURCES[0],
    priceRange: "600",
    amenities: ["No Pork", "No Alcohol", "Prayer Room"],
    porkFree: true,
    alcoholFree: true,
    hasPrayer: true,
    rating: 4.5,
    reviews: 120,
    views: 800,
    trustStatus: "certified",
  },
  {
    id: "demo-5",
    name: "Old Town Kebab House",
    type: "Restaurant",
    province: "Ayutthaya",
    status: "Expired",
    submittedDate: "2024-01-01",
    address: "12 Naresuan Rd",
    lat: "14.3565",
    lng: "100.5709",
    openingHours: "11:00-21:00",
    phone: "+66 35 111 222",
    website: "https://oldtownkebabhouse.example.com",
    docs: { license: true, halal: true, sha: true },
    certExpiry: "2025-12-31",
    certAgency: CERTIFYING_SOURCES[0],
    certNumber: "CICOT-2024-0031",
    images: 1,
    image: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=400",
    source: CERTIFYING_SOURCES[0],
    priceRange: "180",
    amenities: ["No Pork"],
    porkFree: true,
    alcoholFree: true,
    hasPrayer: false,
    rating: 3.9,
    reviews: 45,
    views: 300,
    trustStatus: "expired",
  },
];

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadPrototypePlaces(): PrototypePlaceRecord[] {
  if (!isBrowser()) return DEFAULT_PROTOTYPE_PLACES;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROTOTYPE_PLACES));
      return DEFAULT_PROTOTYPE_PLACES;
    }
    const parsed = JSON.parse(raw) as PrototypePlaceRecord[];
    const migrated = parsed.map((place) =>
      place.id === "demo-3" && place.name === "Chiang Mai Central Mosque"
        ? { ...place, name: "Chiang Mai Community Prayer Hall", address: "88 Charoen Prathet" }
        : place
    );
    if (JSON.stringify(parsed) !== JSON.stringify(migrated)) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    }
    return migrated.length ? migrated : DEFAULT_PROTOTYPE_PLACES;
  } catch {
    return DEFAULT_PROTOTYPE_PLACES;
  }
}

export function savePrototypePlaces(places: PrototypePlaceRecord[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
  window.dispatchEvent(new CustomEvent("prototype-places-updated"));
}

export function upsertPrototypePlace(place: PrototypePlaceRecord) {
  const places = loadPrototypePlaces();
  const next = places.some((p) => p.id === place.id)
    ? places.map((p) => (p.id === place.id ? place : p))
    : [place, ...places];
  savePrototypePlaces(next);
  return place;
}

export function updatePrototypePlace(id: string, patch: Partial<PrototypePlaceRecord>) {
  const next = loadPrototypePlaces().map((place) =>
    place.id === id
      ? {
          ...place,
          ...patch,
          moderationHistory: patch.status
            ? [
                ...(place.moderationHistory ?? []),
                {
                  date: new Date().toISOString().slice(0, 10),
                  event: `${place.status} -> ${patch.status}`,
                  actor: "admin@gosafar.th",
                  status: patch.status,
                },
              ]
            : place.moderationHistory,
        }
      : place
  );
  savePrototypePlaces(next);
  return next;
}

export function usePrototypePlaces() {
  const [places, setPlaces] = useState<PrototypePlaceRecord[]>(() => loadPrototypePlaces());

  useEffect(() => {
    const refresh = () => setPlaces(loadPrototypePlaces());
    window.addEventListener("storage", refresh);
    window.addEventListener("prototype-places-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("prototype-places-updated", refresh);
    };
  }, []);

  const updatePlace = (id: string, patch: Partial<PrototypePlaceRecord>) => {
    setPlaces(updatePrototypePlace(id, patch));
  };

  return { places, setPlaces: savePrototypePlaces, updatePlace };
}

export function createSubmittedPlace(input: {
  name: string;
  type: string;
  province: string;
  address: string;
  lat: string;
  lng: string;
  openingHours: string;
  phone: string;
  website: string;
  certAgency: string;
  certNumber: string;
  certExpiry: string;
  priceRange: string;
  amenities: string[];
  porkFree: boolean;
  alcoholFree: boolean;
  hasPrayer: boolean;
  images: number;
}) {
  const id = `SUB-${Date.now().toString(36).toUpperCase()}`;
  const place: PrototypePlaceRecord = {
    id,
    name: input.name,
    type: input.type,
    province: input.province,
    status: "Pending Review",
    submittedDate: new Date().toISOString().slice(0, 10),
    address: input.address,
    lat: input.lat,
    lng: input.lng,
    openingHours: input.openingHours,
    phone: input.phone,
    website: input.website,
    docs: { license: true, halal: true, sha: false },
    certExpiry: input.certExpiry,
    certAgency: input.certAgency,
    certNumber: input.certNumber,
    images: input.images,
    image: imageForPlaceType(input.type),
    source: "Owner Submitted",
    priceRange: input.priceRange,
    amenities: input.amenities,
    porkFree: input.porkFree,
    alcoholFree: input.alcoholFree,
    hasPrayer: input.hasPrayer,
    rating: 0,
    reviews: 0,
    views: 0,
    trustStatus: "pending",
    moderationHistory: [
      {
        date: new Date().toISOString().slice(0, 10),
        event: "Submission received",
        actor: "Demo Entrepreneur",
        status: "Pending Review",
      },
    ],
  };

  const submitted = upsertPrototypePlace(place);
  addAuditEvent({
    actor: "demo-entrepreneur@gosafar.th",
    role: "Business",
    action: "Create Draft",
    entityId: submitted.id,
    entity: submitted.name,
    entityType: "Place",
    detail: "Owner submitted a new place for moderation.",
    statusAfter: "Pending Review",
    visibleToEntrepreneur: true,
  });
  return submitted;
}

export function statusToTrustStatus(place: PrototypePlaceRecord): TrustStatus {
  if (place.status === "Expired") return "expired";
  if (place.status === "Approved" || place.status === "Expiring Soon") {
    return place.certAgency ? "certified" : "source-verified";
  }
  if (place.status === "Pending Review" || place.status === "Under Review" || place.status === "Documents Requested") return "pending";
  if (place.status === "Returned for Correction" || place.status === "Rejected" || place.status === "Hidden") return "owner-submitted";
  return place.trustStatus;
}

export function isPublishedToTourists(place: PrototypePlaceRecord) {
  return place.status === "Approved" || place.status === "Expiring Soon";
}
