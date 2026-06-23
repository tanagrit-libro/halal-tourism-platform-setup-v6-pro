import { useState, useRef, useEffect } from "react";
import { TouristLayout } from "../components/tourist-layout";
import { TouristAuthProps } from "../types/tourist-auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PlaceCard } from "../components/place-card";
import { Search, MapPin, Sparkles, Info, ChevronDown, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useLanguage } from "../context/LanguageContext";
import { TrustStatus } from "../components/halal-badge";
import { CERTIFYING_SOURCES } from "../data/prototype-options";
import { toast } from "sonner";

// จังหวัดทั้งหมด 77 จังหวัดของไทย
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

// จังหวัดที่มีข้อมูลใน platform ของเรา
const PROVINCES_IN_DATA = [
  "Bangkok", "Ayutthaya", "Chiang Mai", "Chiang Rai", "Phuket",
  "Phang Nga", "Krabi", "Trang", "Songkhla", "Satun", "Phatthalung",
  "Surat Thani", "Nakhon Si Thammarat", "Narathiwat", "Yala",
  "Pattani", "Chonburi", "Rayong",
];

const OTHER_PROVINCES = ALL_THAI_PROVINCES.filter(
  (p) => !PROVINCES_IN_DATA.includes(p)
);

const PAGE_SIZE = 10;

function PaginatedList({
  items,
  value,
  onSelect,
  inData,
}: {
  items: string[];
  value: string;
  onSelect: (p: string) => void;
  inData: boolean;
}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const visible = items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <>
      {visible.map((p) => (
        <button
          key={p}
          onClick={() => onSelect(p)}
          className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors
            ${inData ? "hover:bg-emerald-50" : "hover:bg-gray-50"}
            ${value === p ? "text-emerald-600 font-semibold bg-emerald-50" : inData ? "text-gray-800" : "text-gray-500"}`}
        >
          {p}
          {inData && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />}
        </button>
      ))}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          <span className="text-[11px] text-gray-400">
            {page + 1} / {totalPages}
            <span className="ml-1 text-gray-300">({items.length})</span>
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}

function HeroProvinceSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
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

  const filter = (list: string[]) =>
    search.trim()
      ? list.filter((p) => p.toLowerCase().includes(search.toLowerCase()))
      : list;

  const inDataFiltered = filter(PROVINCES_IN_DATA);
  const otherFiltered = filter(OTHER_PROVINCES);
  const noResults = inDataFiltered.length === 0 && otherFiltered.length === 0;

  const handleSelect = (p: string) => {
    onChange(p);
    setOpen(false);
    setSearch("");
  };

  return (
    /* z-[60] so the dropdown floats above the hero image overlay */
    <div className="relative flex items-center gap-2 px-4 border-l min-w-0 z-[60]" ref={ref}>
      <MapPin className="size-5 text-gray-400 flex-shrink-0" />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm w-36 text-left focus:outline-none"
      >
        <span className={`truncate ${value ? "text-gray-800" : "text-gray-400"}`}>
          {value || "Province"}
        </span>
        <ChevronDown className={`size-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        /* Rendered outside overflow-hidden by using fixed positioning */
        <div
          className="absolute top-[calc(100%+12px)] left-0 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[200] overflow-hidden"
          style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18))" }}
        >
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search province…"
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-[420px]">
            {/* All Provinces */}
            {!search.trim() && (
              <button
                onClick={() => handleSelect("")}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${!value ? "text-emerald-600 font-medium bg-emerald-50" : "text-gray-700"}`}
              >
                All Provinces
              </button>
            )}

            {/* จังหวัดที่มีข้อมูลในระบบ */}
            {inDataFiltered.length > 0 && (
              <>
                <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border-y border-gray-100">
                  Available in our list ({inDataFiltered.length})
                </div>
                <PaginatedList
                  items={inDataFiltered}
                  value={value}
                  onSelect={handleSelect}
                  inData={true}
                />
              </>
            )}

            {/* จังหวัดอื่นๆ ทั้งหมด */}
            {otherFiltered.length > 0 && (
              <>
                <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border-y border-gray-100">
                  {search.trim() ? `Other provinces (${otherFiltered.length})` : `All other provinces (${otherFiltered.length})`}
                </div>
                <PaginatedList
                  items={otherFiltered}
                  value={value}
                  onSelect={handleSelect}
                  inData={false}
                />
              </>
            )}

            {noResults && (
              <p className="px-4 py-6 text-sm text-gray-400 text-center">No province found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface TouristHomeProps extends TouristAuthProps {
  onNavigate?: (page: string) => void;
}

export function TouristHome({ onNavigate, isTouristLoggedIn, onTouristLogout, onRequireSignIn }: TouristHomeProps) {
  const { t } = useLanguage();
  const [selectedProvince, setSelectedProvince] = useState("");

  const featuredPlaces: Array<{
    id: string;
    name: string;
    category: string;
    location: string;
    rating: number;
    reviews: number;
    image: string;
    trustStatus: TrustStatus;
    agency?: string;
    source?: string;
    expiryDate?: string;
  }> = [
    {
      id: '4',
      name: 'Yana Restaurant',
      category: 'Restaurant',
      location: 'Bangkok, Thailand',
      rating: 4.6,
      reviews: 120,
      image: 'https://images.unsplash.com/photo-1769265114898-083ad50197f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwcmVzdGF1cmFudCUyMG1vZGVybiUyMG1hbGx8ZW58MXx8fHwxNzcwNjY1ODgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      trustStatus: 'certified',
      agency: CERTIFYING_SOURCES[0],
    },
    {
      id: '14',
      name: 'Shangri-La Bangkok',
      category: 'Hotel',
      location: 'Bangkok, Thailand',
      rating: 4.9,
      reviews: 350,
      image: 'https://images.unsplash.com/photo-1652024057080-77d76186ebf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGJhbmdrb2slMjByaXZlciUyMHZpZXd8ZW58MXx8fHwxNzcwNjY1ODgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      trustStatus: 'source-verified',
      source: CERTIFYING_SOURCES[3],
    },
    {
      id: '36',
      name: 'Factory Coffee',
      category: 'Cafe',
      location: 'Bangkok, Thailand',
      rating: 4.7,
      reviews: 210,
      image: 'https://images.unsplash.com/photo-1523288926042-67186ad1ada0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXR0ZSUyMGFydCUyMGNvZmZlZSUyMHNob3AlMjBiYW5na29rfGVufDF8fHx8MTc3MDY2NTg4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      trustStatus: 'pending',
    },
    {
      id: '44',
      name: 'The Grand Palace',
      category: 'Attraction',
      location: 'Bangkok, Thailand',
      rating: 4.9,
      reviews: 1500,
      image: 'https://images.unsplash.com/photo-1678915554115-a5e2de853191?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGUlMjBHcmFuZCUyMFBhbGFjZSUyMEJhbmdrb2t8ZW58MXx8fHwxNzcwNjY1ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      trustStatus: 'source-verified',
      source: CERTIFYING_SOURCES[3],
    },
  ];

  return (
    <TouristLayout activePage="home" onNavigate={onNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={onTouristLogout}>
      {/* Hero Section — image + text in overflow-hidden, search bar sits outside */}
      <section className="relative rounded-2xl mb-4">
        {/* Background image layer (overflow-hidden ไม่กระทบ Search Bar) */}
        <div className="relative rounded-2xl overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1600383963284-91ef78fc9b6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3NxdWUlMjBpc2xhbWljJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MDI4NzM2Mnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Hero"
            className="w-full h-[420px] object-cover brightness-75"
          />
          {/* Text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 pb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              {t('tourist.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl drop-shadow-md">
              {t('tourist.hero.subtitle')}
            </p>
          </div>
        </div>

        {/* Search Bar — ลอยอยู่นอก overflow-hidden เพื่อให้ dropdown แสดงได้ */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-3xl px-4 z-50">
          <div className="bg-white rounded-full shadow-2xl p-2 flex gap-2 items-center">
            <div className="flex-1 flex items-center gap-2 px-4">
              <Search className="size-5 text-gray-400 flex-shrink-0" />
              <Input
                placeholder={t('tourist.search.placeholder')}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
              />
            </div>
            <HeroProvinceSelect value={selectedProvince} onChange={setSelectedProvince} />
            <Button size="lg" className="rounded-full px-8 flex-shrink-0">
              {t('tourist.search.button')}
            </Button>
          </div>
        </div>
      </section>

      {/* Spacer สำหรับ Search Bar ที่ลอยออกมาครึ่งหนึ่ง */}
      <div className="mb-16" />

      {/* Data Source & Trust Explanation */}
      <section className="mb-10 border border-blue-100 bg-blue-50 rounded-xl p-5 flex gap-3">
        <Info className="size-5 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-blue-800 mb-1">{t('landing.trust.title')}</p>
          <p className="text-sm text-blue-700 leading-relaxed">{t('landing.trust.body')}</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Button
          variant="outline"
          className="h-24 text-lg"
          onClick={() => onNavigate?.('ai-planner')}
        >
          <Sparkles className="size-6 mr-3 text-purple-500" />
          {t('tourist.action.planner')}
        </Button>
        <Button
          variant="outline"
          className="h-24 text-lg"
          onClick={() => onNavigate?.('map')}
        >
          <MapPin className="size-6 mr-3 text-blue-500" />
          {t('tourist.action.map')}
        </Button>
        <Button
          variant="outline"
          className="h-24 text-lg"
          onClick={() => onNavigate?.('search')}
        >
          <Search className="size-6 mr-3 text-emerald-500" />
          {t('tourist.action.search')}
        </Button>
      </section>

      {/* Featured Places */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">{t('tourist.featured.title')}</h2>
            <p className="text-muted-foreground">{t('tourist.featured.subtitle')}</p>
          </div>
          <Button variant="link" onClick={() => onNavigate?.('search')}>
            {t('tourist.featured.viewAll')} →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              {...place}
              onFavoriteToggle={() => {
                if (!isTouristLoggedIn) {
                  onRequireSignIn?.();
                  return;
                }
                toast.success(`${place.name} saved to favorites`);
              }}
              onClick={() => onNavigate?.('place-detail')}
            />
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="mt-12 bg-emerald-50 rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-emerald-600">2,500+</div>
            <div className="text-muted-foreground mt-2">{t('tourist.stats.verified')}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-emerald-600">15,000+</div>
            <div className="text-muted-foreground mt-2">{t('tourist.stats.travelers')}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-emerald-600">50+</div>
            <div className="text-muted-foreground mt-2">{t('tourist.stats.cities')}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-emerald-600">4.8/5</div>
            <div className="text-muted-foreground mt-2">{t('tourist.stats.rating')}</div>
          </div>
        </div>
      </section>
    </TouristLayout>
  );
}
