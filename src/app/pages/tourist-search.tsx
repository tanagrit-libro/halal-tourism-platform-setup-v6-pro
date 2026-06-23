import React, { useState, useMemo, useRef, useEffect } from "react";
import { TouristLayout } from "../components/tourist-layout";
import { TouristAuthProps } from "../types/tourist-auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Card, CardContent } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Slider } from "../components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { TrustBadge, TrustStatus } from "../components/halal-badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useLanguage } from "../context/LanguageContext";
import { PLACE_TYPE_LABELS } from "../data/place-types";
import {
  isPublishedToTourists,
  loadPrototypePlaces,
  PrototypePlaceRecord,
  statusToTrustStatus,
  usePrototypePlaces,
} from "../data/prototype-place-workflow";
import { AMENITIES, CERTIFYING_SOURCES } from "../data/prototype-options";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  Heart,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Place {
  id: string;
  name: string;
  category: string;
  province: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  trustStatus: TrustStatus;
  agency: string;
  source: string;
  priceRange: string;
  amenities: string[];
  openNow: boolean;
  porkFree: boolean;
  alcoholFree: boolean;
  hasPrayer: boolean;
}

// ─── Image map ────────────────────────────────────────────────────────────────

const IMAGE_MAP: Record<string, string> = {
  restaurant: "https://images.unsplash.com/photo-1769265114898-083ad50197f4?w=400",
  hotel: "https://images.unsplash.com/photo-1652024057080-77d76186ebf6?w=400",
  mosque: "https://images.unsplash.com/photo-1645334633515-4adec58e546a?w=400",
  attraction: "https://images.unsplash.com/photo-1678915554115-a5e2de853191?w=400",
  beach: "https://images.unsplash.com/photo-1706164240670-16aa535e252f?w=400",
  nature: "https://images.unsplash.com/photo-1713361060470-50510cc39729?w=400",
  cafe: "https://images.unsplash.com/photo-1523288926042-67186ad1ada0?w=400",
  market: "https://images.unsplash.com/photo-1631030576925-18b2ca443738?w=400",
};

function imgFor(category: string, name: string): string {
  const c = category.toLowerCase();
  const n = name.toLowerCase();
  if (c.includes("restaurant")) return IMAGE_MAP.restaurant;
  if (c.includes("hotel")) return IMAGE_MAP.hotel;
  if (c.includes("mosque") || c.includes("prayer")) return IMAGE_MAP.mosque;
  if (c.includes("cafe")) return IMAGE_MAP.cafe;
  if (n.includes("market")) return IMAGE_MAP.market;
  if (
    n.includes("island") ||
    n.includes("beach") ||
    n.includes("bay") ||
    n.includes("railay")
  )
    return IMAGE_MAP.beach;
  if (
    n.includes("park") ||
    n.includes("national") ||
    n.includes("doi") ||
    n.includes("khao") ||
    n.includes("tarutao")
  )
    return IMAGE_MAP.nature;
  return IMAGE_MAP.attraction;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const RAW_PLACES: Omit<Place, "image">[] = [
  // Bangkok / Ayutthaya
  { id: "1", name: "Yana Restaurant", category: "Restaurant", province: "Bangkok", location: "Silom, Bangkok", rating: 4.6, reviews: 318, trustStatus: "certified", agency: CERTIFYING_SOURCES[0], source: CERTIFYING_SOURCES[0], priceRange: "350", amenities: ["Prayer Room", "No Pork", "WiFi"], openNow: true, porkFree: true, alcoholFree: true, hasPrayer: true },
  { id: "2", name: "Shangri-La Bangkok", category: "Hotel", province: "Bangkok", location: "Charoen Krung Rd, Bangkok", rating: 4.9, reviews: 1024, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "6500", amenities: ["Prayer Room", "Halal Kitchen", "WiFi"], openNow: true, porkFree: true, alcoholFree: false, hasPrayer: true },
  { id: "3", name: "Ayutthaya Historical Park", category: "Attraction", province: "Ayutthaya", location: "Phra Nakhon Si Ayutthaya", rating: 4.8, reviews: 2415, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "100", amenities: ["Family Section", "Parking"], openNow: true, porkFree: false, alcoholFree: false, hasPrayer: false },
  { id: "4", name: "Al-Hussain Restaurant", category: "Restaurant", province: "Bangkok", location: "Bang Rak, Bangkok", rating: 4.2, reviews: 187, trustStatus: "certified", agency: CERTIFYING_SOURCES[0], source: CERTIFYING_SOURCES[0], priceRange: "180", amenities: ["No Pork", "No Alcohol", "Wudu Facility"], openNow: false, porkFree: true, alcoholFree: true, hasPrayer: true },
  { id: "5", name: "Mandarin Oriental Bangkok", category: "Hotel", province: "Bangkok", location: "Charoen Krung Rd, Bangkok", rating: 5.0, reviews: 876, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "8500", amenities: ["Prayer Room", "WiFi", "Family Section"], openNow: true, porkFree: true, alcoholFree: false, hasPrayer: true },

  // Chiang Mai / Chiang Rai
  { id: "6", name: "Shangri-La Chiang Mai", category: "Hotel", province: "Chiang Mai", location: "Chang Klan Rd, Chiang Mai", rating: 4.7, reviews: 654, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "4200", amenities: ["Prayer Room", "WiFi"], openNow: true, porkFree: true, alcoholFree: false, hasPrayer: true },
  { id: "7", name: "Chiang Mai Central Mosque", category: "Mosque", province: "Chiang Mai", location: "Charoen Prathet, Chiang Mai", rating: 5.0, reviews: 412, trustStatus: "certified", agency: CERTIFYING_SOURCES[0], source: CERTIFYING_SOURCES[0], priceRange: "0", amenities: ["Prayer Room", "Wudu Facility", "Qibla Direction"], openNow: true, porkFree: true, alcoholFree: true, hasPrayer: true },
  { id: "8", name: "Wat Rong Khun (White Temple)", category: "Attraction", province: "Chiang Rai", location: "Pa O Don Chai, Chiang Rai", rating: 4.8, reviews: 3201, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "100", amenities: ["Family Section", "Parking"], openNow: true, porkFree: false, alcoholFree: false, hasPrayer: false },
  { id: "9", name: "Doi Inthanon National Park", category: "Attraction", province: "Chiang Mai", location: "Chom Thong, Chiang Mai", rating: 4.8, reviews: 1892, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "300", amenities: ["Family Section", "Parking"], openNow: true, porkFree: false, alcoholFree: false, hasPrayer: false },

  // Phuket / Phang Nga
  { id: "10", name: "JW Marriott Phuket Resort", category: "Hotel", province: "Phuket", location: "Mai Khao, Phuket", rating: 4.8, reviews: 1102, trustStatus: "certified", agency: CERTIFYING_SOURCES[1], source: CERTIFYING_SOURCES[1], priceRange: "7800", amenities: ["Prayer Room", "Halal Kitchen", "WiFi"], openNow: true, porkFree: true, alcoholFree: false, hasPrayer: true },
  { id: "11", name: "Sri Panwa Phuket", category: "Hotel", province: "Phuket", location: "Cape Panwa, Phuket", rating: 4.8, reviews: 789, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "12000", amenities: ["WiFi", "Prayer Room"], openNow: true, porkFree: false, alcoholFree: false, hasPrayer: true },
  { id: "12", name: "James Bond Island", category: "Attraction", province: "Phang Nga", location: "Ao Phang Nga, Phang Nga", rating: 4.7, reviews: 2876, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "1200", amenities: ["Family Section", "Parking"], openNow: true, porkFree: false, alcoholFree: false, hasPrayer: false },
  { id: "13", name: "Similan Islands", category: "Attraction", province: "Phang Nga", location: "Similan Islands, Phang Nga", rating: 4.9, reviews: 1543, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "2500", amenities: ["Family Section", "Parking"], openNow: true, porkFree: false, alcoholFree: false, hasPrayer: false },

  // Krabi / Trang
  { id: "14", name: "Phi Phi Islands", category: "Attraction", province: "Krabi", location: "Ko Phi Phi, Krabi", rating: 4.9, reviews: 4102, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "900", amenities: ["Family Section", "Parking"], openNow: true, porkFree: false, alcoholFree: false, hasPrayer: false },
  { id: "15", name: "Railay Beach", category: "Attraction", province: "Krabi", location: "Railay, Krabi", rating: 4.8, reviews: 2931, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "200", amenities: ["Family Section", "Parking"], openNow: true, porkFree: false, alcoholFree: false, hasPrayer: false },
  { id: "16", name: "Trang Halal Seafood", category: "Restaurant", province: "Trang", location: "Mueang Trang", rating: 4.5, reviews: 143, trustStatus: "pending", agency: CERTIFYING_SOURCES[2], source: CERTIFYING_SOURCES[2], priceRange: "220", amenities: ["No Pork", "No Alcohol"], openNow: true, porkFree: true, alcoholFree: true, hasPrayer: false },
  { id: "17", name: "Maya Bay", category: "Attraction", province: "Krabi", location: "Ko Phi Phi Le, Krabi", rating: 4.9, reviews: 3654, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "400", amenities: ["Family Section", "Parking"], openNow: true, porkFree: false, alcoholFree: false, hasPrayer: false },

  // Songkhla / Satun / Phatthalung
  { id: "18", name: "Hat Yai Grand Central Mosque", category: "Mosque", province: "Songkhla", location: "Hat Yai, Songkhla", rating: 4.8, reviews: 567, trustStatus: "certified", agency: CERTIFYING_SOURCES[0], source: CERTIFYING_SOURCES[0], priceRange: "0", amenities: ["Prayer Room", "Wudu Facility"], openNow: true, porkFree: true, alcoholFree: true, hasPrayer: true },
  { id: "19", name: "Satun Tarutao Marine Park", category: "Attraction", province: "Satun", location: "Ko Tarutao, Satun", rating: 4.9, reviews: 987, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "200", amenities: ["Family Section", "Parking"], openNow: true, porkFree: false, alcoholFree: false, hasPrayer: false },
  { id: "20", name: "Phatthalung Muslim Kitchen", category: "Restaurant", province: "Phatthalung", location: "Mueang Phatthalung", rating: 4.3, reviews: 89, trustStatus: "owner-submitted", agency: CERTIFYING_SOURCES[4], source: CERTIFYING_SOURCES[4], priceRange: "150", amenities: ["No Pork"], openNow: false, porkFree: true, alcoholFree: true, hasPrayer: false },
  { id: "21", name: "Hat Yai Night Market (Halal Zone)", category: "Restaurant", province: "Songkhla", location: "Hat Yai, Songkhla", rating: 4.5, reviews: 321, trustStatus: "pending", agency: CERTIFYING_SOURCES[4], source: CERTIFYING_SOURCES[4], priceRange: "120", amenities: ["No Pork"], openNow: true, porkFree: true, alcoholFree: true, hasPrayer: false },

  // Surat Thani / Nakhon Si Thammarat
  { id: "22", name: "Khao Sok National Park", category: "Attraction", province: "Surat Thani", location: "Surat Thani", rating: 4.9, reviews: 1765, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "300", amenities: ["Family Section", "Parking"], openNow: true, porkFree: false, alcoholFree: false, hasPrayer: false },
  { id: "23", name: "Koh Samui Muslim Restaurant", category: "Restaurant", province: "Surat Thani", location: "Ko Samui, Surat Thani", rating: 4.4, reviews: 112, trustStatus: "owner-submitted", agency: CERTIFYING_SOURCES[4], source: CERTIFYING_SOURCES[4], priceRange: "240", amenities: ["No Pork", "No Alcohol"], openNow: true, porkFree: true, alcoholFree: true, hasPrayer: false },
  { id: "24", name: "Nakhon Si Muslim Bistro", category: "Restaurant", province: "Nakhon Si Thammarat", location: "Mueang Nakhon Si Thammarat", rating: 4.2, reviews: 74, trustStatus: "pending", agency: CERTIFYING_SOURCES[4], source: CERTIFYING_SOURCES[4], priceRange: "160", amenities: ["No Pork"], openNow: false, porkFree: true, alcoholFree: true, hasPrayer: false },

  // Narathiwat / Yala / Pattani
  { id: "25", name: "Pattani Central Mosque", category: "Mosque", province: "Pattani", location: "Mueang Pattani", rating: 4.9, reviews: 834, trustStatus: "certified", agency: CERTIFYING_SOURCES[0], source: CERTIFYING_SOURCES[0], priceRange: "0", amenities: ["Prayer Room", "Wudu Facility", "Qibla Direction"], openNow: true, porkFree: true, alcoholFree: true, hasPrayer: true },
  { id: "26", name: "Narathiwat Seafood", category: "Restaurant", province: "Narathiwat", location: "Mueang Narathiwat", rating: 4.5, reviews: 201, trustStatus: "certified", agency: CERTIFYING_SOURCES[0], source: CERTIFYING_SOURCES[0], priceRange: "260", amenities: ["No Pork", "No Alcohol", "Prayer Room"], openNow: true, porkFree: true, alcoholFree: true, hasPrayer: true },
  { id: "27", name: "Yala Night Market", category: "Restaurant", province: "Yala", location: "Mueang Yala", rating: 4.4, reviews: 156, trustStatus: "owner-submitted", agency: CERTIFYING_SOURCES[4], source: CERTIFYING_SOURCES[4], priceRange: "120", amenities: ["No Pork"], openNow: true, porkFree: true, alcoholFree: true, hasPrayer: false },
  { id: "28", name: "Takbai Riverside", category: "Attraction", province: "Narathiwat", location: "Takbai, Narathiwat", rating: 4.6, reviews: 298, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "80", amenities: ["Family Section", "Parking"], openNow: true, porkFree: false, alcoholFree: false, hasPrayer: false },

  // Chonburi / Rayong
  { id: "29", name: "Sanctuary of Truth", category: "Attraction", province: "Chonburi", location: "Pattaya, Chonburi", rating: 4.7, reviews: 2109, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "500", amenities: ["Family Section", "Parking"], openNow: true, porkFree: false, alcoholFree: false, hasPrayer: false },
  { id: "30", name: "Nong Nooch Tropical Garden", category: "Attraction", province: "Chonburi", location: "Sattahip, Chonburi", rating: 4.6, reviews: 1432, trustStatus: "source-verified", agency: CERTIFYING_SOURCES[3], source: CERTIFYING_SOURCES[3], priceRange: "600", amenities: ["Family Section", "Parking"], openNow: true, porkFree: false, alcoholFree: false, hasPrayer: false },
  { id: "31", name: "Rayong Halal Seafood", category: "Restaurant", province: "Rayong", location: "Mueang Rayong", rating: 4.3, reviews: 98, trustStatus: "pending", agency: CERTIFYING_SOURCES[4], source: CERTIFYING_SOURCES[4], priceRange: "220", amenities: ["No Pork"], openNow: false, porkFree: true, alcoholFree: true, hasPrayer: false },
];

const BASE_PLACES: Place[] = RAW_PLACES.map((p) => ({
  ...p,
  image: imgFor(p.category, p.name),
}));

function toTouristPlace(place: PrototypePlaceRecord): Place {
  return {
    id: place.id,
    name: place.name,
    category: place.type,
    province: place.province,
    location: place.address || `${place.province}, Thailand`,
    rating: place.rating || 4.2,
    reviews: place.reviews,
    image: place.image,
    trustStatus: statusToTrustStatus(place),
    agency: place.certAgency,
    source: place.certAgency || place.source,
    priceRange: place.priceRange,
    amenities: place.amenities,
    openNow: true,
    porkFree: place.porkFree,
    alcoholFree: place.alcoholFree,
    hasPrayer: place.hasPrayer,
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PLACE_TYPES = PLACE_TYPE_LABELS;
// All 77 Thai provinces (English names)
const ALL_THAI_PROVINCES = [
  "Amnat Charoen", "Ang Thong", "Ayutthaya", "Bangkok", "Bueng Kan",
  "Buriram", "Chachoengsao", "Chai Nat", "Chaiyaphum", "Chanthaburi",
  "Chiang Mai", "Chiang Rai", "Chonburi", "Chumphon", "Kalasin",
  "Kamphaeng Phet", "Kanchanaburi", "Khon Kaen", "Krabi", "Lampang",
  "Lamphun", "Loei", "Lop Buri", "Mae Hong Son", "Maha Sarakham",
  "Mukdahan", "Nakhon Nayok", "Nakhon Pathom", "Nakhon Phanom",
  "Nakhon Ratchasima", "Nakhon Sawan", "Nakhon Si Thammarat", "Nan",
  "Narathiwat", "Nong Bua Lam Phu", "Nong Khai", "Nonthaburi",
  "Pathum Thani", "Pattani", "Phang Nga", "Phatthalung", "Phayao",
  "Phetchabun", "Phetchaburi", "Phichit", "Phitsanulok", "Phrae",
  "Phuket", "Prachin Buri", "Prachuap Khiri Khan", "Ranong", "Ratchaburi",
  "Rayong", "Roi Et", "Sa Kaeo", "Sakon Nakhon", "Samut Prakan",
  "Samut Sakhon", "Samut Songkhram", "Saraburi", "Satun", "Sing Buri",
  "Sisaket", "Songkhla", "Sukhothai", "Suphan Buri", "Surat Thani",
  "Surin", "Tak", "Trang", "Trat", "Ubon Ratchathani", "Udon Thani",
  "Uthai Thani", "Uttaradit", "Yala", "Yasothon",
];
const OPENING_HOURS_OPTS = [
  "Open Now", "Open 24h", "Open on Fridays", "Late Night (after 21:00)",
];
const CERT_SOURCES = CERTIFYING_SOURCES;
const AMENITIES_LIST = AMENITIES;
const PRICE_RANGES = [
  { label: "0-250 Baht", min: 0, max: 250 },
  { label: "251-500 Baht", min: 251, max: 500 },
  { label: "501-1,500 Baht", min: 501, max: 1500 },
  { label: "1,501+ Baht", min: 1501, max: Infinity },
];
const SORT_OPTIONS = ["Highest Rating", "Most Reviews", "Name A-Z", "Newest"];

// ─── Province Select ──────────────────────────────────────────────────────────

function ProvinceSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const provincesInData = useMemo(
    () => {
      const publishedPrototypeProvinces = loadPrototypePlaces()
        .filter(isPublishedToTourists)
        .map((p) => p.province);
      return Array.from(new Set([...RAW_PLACES.map((p) => p.province), ...publishedPrototypeProvinces])).sort();
    },
    []
  );
  const otherProvinces = useMemo(
    () => ALL_THAI_PROVINCES.filter((p) => !provincesInData.includes(p)).sort(),
    [provincesInData]
  );

  const filterFn = (list: string[]) =>
    search.trim()
      ? list.filter((p) => p.toLowerCase().includes(search.toLowerCase()))
      : list;

  const inDataFiltered = filterFn(provincesInData);
  const otherFiltered = filterFn(otherProvinces);
  const showAll = !search.trim();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-border rounded-md bg-background hover:border-primary transition-colors"
      >
        <span className={value === "All Provinces" ? "text-muted-foreground" : "text-foreground"}>
          {value}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search province…"
                className="w-full pl-7 pr-2 py-1.5 text-sm bg-background border border-border rounded focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {/* All Provinces option */}
            {(!search.trim()) && (
              <button
                onClick={() => { onChange("All Provinces"); setOpen(false); setSearch(""); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${value === "All Provinces" ? "bg-primary/10 text-primary font-medium" : "text-foreground"}`}
              >
                All Provinces
              </button>
            )}

            {/* Provinces with data */}
            {inDataFiltered.length > 0 && (
              <>
                <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50 border-y border-border">
                  Available in our list ({inDataFiltered.length})
                </div>
                {inDataFiltered.map((p) => (
                  <button
                    key={p}
                    onClick={() => { onChange(p); setOpen(false); setSearch(""); }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-muted transition-colors ${value === p ? "bg-primary/10 text-primary font-medium" : "text-foreground"}`}
                  >
                    {p}
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  </button>
                ))}
              </>
            )}

            {/* Other Thai provinces */}
            {otherFiltered.length > 0 && (
              <>
                <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50 border-y border-border">
                  {showAll ? `All other provinces (${otherFiltered.length})` : `Other provinces (${otherFiltered.length})`}
                </div>
                {otherFiltered.map((p) => (
                  <button
                    key={p}
                    onClick={() => { onChange(p); setOpen(false); setSearch(""); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${value === p ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}
                  >
                    {p}
                  </button>
                ))}
              </>
            )}

            {inDataFiltered.length === 0 && otherFiltered.length === 0 && (
              <p className="px-3 py-4 text-sm text-muted-foreground text-center">No province found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Collapsible section ──────────────────────────────────────────────────────

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="pb-3 space-y-2">{children}</div>}
      <Separator />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface TouristSearchProps extends TouristAuthProps {
  onNavigate?: (page: string) => void;
}

export function TouristSearch({ onNavigate, isTouristLoggedIn, onTouristLogout, onRequireSignIn }: TouristSearchProps) {
  const { dir } = useLanguage();
  const isRtl = dir === 'rtl';
  const { places: prototypePlaces } = usePrototypePlaces();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("All Provinces");
  const [distance, setDistance] = useState([50]);
  const [openingHours, setOpeningHours] = useState<string[]>([]);
  const [certSources, setCertSources] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [porkFreeOnly, setPorkFreeOnly] = useState(false);
  const [alcoholFreeOnly, setAlcoholFreeOnly] = useState(false);
  const [hasPrayerOnly, setHasPrayerOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Highest Rating");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const allPlaces = useMemo(
    () => [
      ...BASE_PLACES,
      ...prototypePlaces.filter(isPublishedToTourists).map(toTouristPlace),
    ],
    [prototypePlaces]
  );

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let result = allPlaces;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.province.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (selectedTypes.length > 0)
      result = result.filter((p) => selectedTypes.includes(p.category));
    if (selectedProvince !== "All Provinces")
      result = result.filter((p) => p.province === selectedProvince);
    if (certSources.length > 0)
      result = result.filter((p) =>
        certSources.some((s) => p.source.includes(s) || p.agency.includes(s))
      );
    if (selectedAmenities.length > 0)
      result = result.filter((p) =>
        selectedAmenities.every((a) => p.amenities.includes(a))
      );
    if (priceRange.length > 0)
      result = result.filter((p) => {
        const value = Number(p.priceRange);
        return Number.isFinite(value) && PRICE_RANGES.some((range) =>
          priceRange.includes(range.label) && value >= range.min && value <= range.max
        );
      });
    if (porkFreeOnly) result = result.filter((p) => p.porkFree);
    if (alcoholFreeOnly) result = result.filter((p) => p.alcoholFree);
    if (hasPrayerOnly) result = result.filter((p) => p.hasPrayer);
    if (openingHours.includes("Open Now"))
      result = result.filter((p) => p.openNow);

    if (sortBy === "Highest Rating")
      return [...result].sort((a, b) => b.rating - a.rating);
    if (sortBy === "Most Reviews")
      return [...result].sort((a, b) => b.reviews - a.reviews);
    if (sortBy === "Name A-Z")
      return [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [
    allPlaces, searchQuery, selectedTypes, selectedProvince, certSources,
    selectedAmenities, priceRange, porkFreeOnly, alcoholFreeOnly,
    hasPrayerOnly, openingHours, sortBy,
  ]);

  const clearAll = () => {
    setSearchQuery("");
    setSelectedTypes([]);
    setSelectedProvince("All Provinces");
    setDistance([50]);
    setOpeningHours([]);
    setCertSources([]);
    setSelectedAmenities([]);
    setPriceRange([]);
    setPorkFreeOnly(false);
    setAlcoholFreeOnly(false);
    setHasPrayerOnly(false);
  };

  const toggleFavorite = (id: string, name: string) => {
    if (!isTouristLoggedIn) {
      onRequireSignIn?.();
      return;
    }
    setFavorites((prev) => {
      if (prev.includes(id)) {
        toast.info(`Removed ${name} from favorites`);
        return prev.filter((x) => x !== id);
      }
      toast.success(`Added ${name} to favorites`);
      return [...prev, id];
    });
  };

  // Active filter chips
  const activeChips: { label: string; clear: () => void }[] = [];
  if (selectedProvince !== "All Provinces")
    activeChips.push({ label: selectedProvince, clear: () => setSelectedProvince("All Provinces") });
  selectedTypes.forEach((t) =>
    activeChips.push({ label: t, clear: () => toggle(selectedTypes, t, setSelectedTypes) })
  );
  if (porkFreeOnly) activeChips.push({ label: "Pork-Free", clear: () => setPorkFreeOnly(false) });
  if (alcoholFreeOnly) activeChips.push({ label: "Alcohol-Free", clear: () => setAlcoholFreeOnly(false) });
  if (hasPrayerOnly) activeChips.push({ label: "Has Prayer", clear: () => setHasPrayerOnly(false) });
  priceRange.forEach((p) =>
    activeChips.push({ label: `Price ${p}`, clear: () => toggle(priceRange, p, setPriceRange) })
  );

  // ── Sidebar ──────────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-base flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </h2>
        <button
          onClick={clearAll}
          className="text-xs text-muted-foreground hover:text-primary underline"
        >
          Clear All
        </button>
      </div>

      {/* Place Type */}
      <FilterSection title="Place Type">
        {PLACE_TYPES.map((type) => (
          <div key={type} className="flex items-center gap-2">
            <Checkbox
              id={`type-${type}`}
              checked={selectedTypes.includes(type)}
              onCheckedChange={() => toggle(selectedTypes, type, setSelectedTypes)}
            />
            <Label htmlFor={`type-${type}`} className="text-sm cursor-pointer">{type}</Label>
          </div>
        ))}
      </FilterSection>

      {/* Province */}
      <FilterSection title="Province">
        <ProvinceSelect value={selectedProvince} onChange={setSelectedProvince} />
      </FilterSection>

      {/* Distance */}
      <FilterSection title="Distance" defaultOpen={false}>
        <p className="text-xs text-muted-foreground mb-2">
          Within {distance[0]} km{" "}
          <span className="italic">(requires location permission)</span>
        </p>
        <Slider
          min={1}
          max={100}
          step={1}
          value={distance}
          onValueChange={setDistance}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>1 km</span>
          <span>100 km</span>
        </div>
      </FilterSection>

      {/* Opening Hours */}
      <FilterSection title="Opening Hours" defaultOpen={false}>
        {OPENING_HOURS_OPTS.map((opt) => (
          <div key={opt} className="flex items-center gap-2">
            <Checkbox
              id={`oh-${opt}`}
              checked={openingHours.includes(opt)}
              onCheckedChange={() => toggle(openingHours, opt, setOpeningHours)}
            />
            <Label htmlFor={`oh-${opt}`} className="text-sm cursor-pointer">{opt}</Label>
          </div>
        ))}
      </FilterSection>

      {/* Certifying Source */}
      <FilterSection title="Certifying Source" defaultOpen={false}>
        {CERT_SOURCES.map((src) => (
          <div key={src} className="flex items-center gap-2">
            <Checkbox
              id={`cs-${src}`}
              checked={certSources.includes(src)}
              onCheckedChange={() => toggle(certSources, src, setCertSources)}
            />
            <Label htmlFor={`cs-${src}`} className="text-sm cursor-pointer">{src}</Label>
          </div>
        ))}
      </FilterSection>

      {/* Amenities */}
      <FilterSection title="Amenities" defaultOpen={false}>
        {AMENITIES_LIST.map((a) => (
          <div key={a} className="flex items-center gap-2">
            <Checkbox
              id={`am-${a}`}
              checked={selectedAmenities.includes(a)}
              onCheckedChange={() => toggle(selectedAmenities, a, setSelectedAmenities)}
            />
            <Label htmlFor={`am-${a}`} className="text-sm cursor-pointer">{a}</Label>
          </div>
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" defaultOpen={false}>
        <div className="flex gap-2 flex-wrap">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() => toggle(priceRange, range.label, setPriceRange)}
              className={`px-3 py-1 rounded border text-sm font-medium transition-colors ${
                priceRange.includes(range.label)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:border-primary"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Uses average place budget in Baht.
        </p>
      </FilterSection>

      {/* Pork / Alcohol Policy */}
      <FilterSection title="Pork / Alcohol Policy" defaultOpen={false}>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Pork Policy</p>
            <div className="flex gap-2">
              {[false, true].map((val) => (
                <button
                  key={String(val)}
                  onClick={() => setPorkFreeOnly(val)}
                  className={`flex-1 px-2 py-1 rounded border text-xs font-medium transition-colors ${
                    porkFreeOnly === val
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-primary"
                  }`}
                >
                  {val ? "Pork-Free Only" : "Any"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Alcohol Policy</p>
            <div className="flex gap-2">
              {[false, true].map((val) => (
                <button
                  key={String(val)}
                  onClick={() => setAlcoholFreeOnly(val)}
                  className={`flex-1 px-2 py-1 rounded border text-xs font-medium transition-colors ${
                    alcoholFreeOnly === val
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-primary"
                  }`}
                >
                  {val ? "Alcohol-Free Only" : "Any"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Prayer Facility */}
      <FilterSection title="Prayer Facility" defaultOpen={false}>
        <div className="flex items-center gap-2">
          <Checkbox
            id="prayer-hasPrayer"
            checked={hasPrayerOnly}
            onCheckedChange={(v) => setHasPrayerOnly(!!v)}
          />
          <Label htmlFor="prayer-hasPrayer" className="text-sm cursor-pointer">
            Has Prayer Room
          </Label>
        </div>
        {["Wudu Facility", "Qibla Direction"].map((label) => (
          <div key={label} className="flex items-center gap-2">
            <Checkbox
              id={`prayer-${label}`}
              checked={selectedAmenities.includes(label)}
              onCheckedChange={() => toggle(selectedAmenities, label, setSelectedAmenities)}
            />
            <Label htmlFor={`prayer-${label}`} className="text-sm cursor-pointer">{label}</Label>
          </div>
        ))}
      </FilterSection>

      {/* Bottom actions */}
      <div className="pt-4 space-y-2">
        <Button className="w-full" onClick={() => toast.success("Filters applied!")}>
          Apply Filters
        </Button>
        <Button variant="ghost" className="w-full" onClick={clearAll}>
          Clear All
        </Button>
      </div>
    </div>
  );

  return (
    <TouristLayout activePage="search" onNavigate={onNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={onTouristLogout}>
      {/* Search bar + mobile filter trigger */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
          <Input
            placeholder="Search places, provinces, categories…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'}
            dir={dir}
          />
        </div>
        {/* Mobile-only filter drawer trigger */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden flex-shrink-0 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden xs:inline">Filters</span>
              {activeChips.length > 0 && (
                <Badge variant="secondary" className="ml-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                  {activeChips.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side={isRtl ? 'right' : 'left'} className="w-[min(85vw,320px)] overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </SheetTitle>
            </SheetHeader>
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Active filter chips (mobile) */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3 md:hidden">
          {activeChips.map((chip, i) => (
            <Badge key={i} variant="secondary" className="flex items-center gap-1 pr-1 text-xs">
              {chip.label}
              <button onClick={chip.clear} className="ml-0.5 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className={`flex gap-6 items-start ${isRtl ? 'flex-row-reverse' : ''}`}>
        {/* Filter Sidebar — desktop only */}
        <aside className="w-64 flex-shrink-0 sticky top-20 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto pr-1 hidden md:block">
          <Card>
            <CardContent className="pt-4 pb-2 px-4">
              <Sidebar />
            </CardContent>
          </Card>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">
                Found{" "}
                <span className="text-foreground font-semibold">
                  {filtered.length}
                </span>{" "}
                places
              </p>
              {activeChips.length > 0 && (
                <div className="hidden md:flex flex-wrap gap-1.5">
                  {activeChips.map((chip, i) => (
                    <Badge key={i} variant="secondary" className="flex items-center gap-1 pr-1 text-xs">
                      {chip.label}
                      <button onClick={chip.clear} className="ml-0.5 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Label htmlFor="sort-select" className="text-sm whitespace-nowrap">Sort:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 text-sm" id="sort-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
              <Search className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-base font-medium">No places match your filters</p>
              <button onClick={clearAll} className="mt-2 text-sm text-primary underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filtered.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isFavorite={favorites.includes(place.id)}
                  onToggleFavorite={() => toggleFavorite(place.id, place.name)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </TouristLayout>
  );
}

// ─── Place Card ───────────────────────────────────────────────────────────────

function PlaceCard({
  place,
  isFavorite,
  onToggleFavorite,
}: {
  place: Place;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const sourceLabel =
    place.trustStatus === "certified" && place.agency
      ? `Source: ${place.agency}`
      : place.trustStatus === "source-verified" && place.source
      ? `Source: ${place.source}`
      : place.trustStatus === "owner-submitted"
      ? "Owner submitted"
      : place.source
      ? `Source: ${place.source}`
      : "Unverified";

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col w-full">
      {/* Image */}
      <div className="relative h-40 sm:h-48 flex-shrink-0 bg-muted">
        <ImageWithFallback
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        {/* Trust badge — top-left */}
        <div className="absolute top-2 left-2 max-w-[calc(100%-3.5rem)]">
          <TrustBadge
            status={place.trustStatus}
            agency={place.agency || undefined}
            source={place.source || undefined}
            size="sm"
          />
        </div>
        {/* Favorite — top-right */}
        <button
          onClick={onToggleFavorite}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-500"
            }`}
          />
        </button>
        {/* Open now — bottom-right */}
        {place.openNow && (
          <div className="absolute bottom-2 right-2 bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Open
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-1.5 flex-1 min-w-0">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2">
          {place.name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0 overflow-hidden">
          <span className="flex-shrink-0">{place.category}</span>
          <span className="flex-shrink-0">•</span>
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{place.province}</span>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="flex items-center gap-0.5 font-medium text-amber-500 flex-shrink-0">
            <Star className="h-3.5 w-3.5 fill-amber-500" />
            {place.rating.toFixed(1)}
          </span>
          <span className="text-muted-foreground flex-shrink-0">
            ({place.reviews.toLocaleString()})
          </span>
          <span className="ml-auto font-semibold text-foreground flex-shrink-0">
            {place.priceRange} Baht
          </span>
        </div>

        <p className="text-[10px] text-muted-foreground italic truncate">{sourceLabel}</p>

        {place.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {place.amenities.slice(0, 2).map((a) => (
              <Badge key={a} variant="secondary" className="text-[10px] px-1.5 py-0 max-w-[100px] truncate">
                {a}
              </Badge>
            ))}
            {place.amenities.length > 2 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground flex-shrink-0">
                +{place.amenities.length - 2}
              </Badge>
            )}
          </div>
        )}

        <div className="mt-auto pt-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs"
            onClick={() => toast.info(`Viewing ${place.name}`)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TouristSearch;
