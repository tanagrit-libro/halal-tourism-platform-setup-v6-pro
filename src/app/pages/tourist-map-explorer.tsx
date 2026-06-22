import React, { useState } from "react";
import { TouristLayout } from "../components/tourist-layout";
import { TouristAuthProps } from "../types/tourist-auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { TrustBadge, TrustStatus } from "../components/halal-badge";
import { PLACE_TYPES } from "../data/place-types";
import {
  Search,
  MapPin,
  Navigation,
  Layers,
  LocateFixed,
  Hotel,
  Plane,
  Train,
  Target,
  UtensilsCrossed,
  Coffee,
  Building2,
  Star,
  Shield,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
  Leaf,
  HelpCircle,
} from "lucide-react";

interface TouristMapExplorerProps extends TouristAuthProps {
  onNavigate?: (page: string) => void;
}

type StartMode = "location" | "hotel" | "airport" | "station" | "custom";

type LayerState = Record<string, boolean>;

interface NearbyPlace {
  id: string;
  name: string;
  category: string;
  province: string;
  distance: string;
  rating: number;
  trustStatus: TrustStatus;
}

const NEARBY_PLACES: NearbyPlace[] = [
  {
    id: "1",
    name: "Yana Restaurant",
    category: "Restaurant",
    province: "Bangkok",
    distance: "0.2 km",
    rating: 4.6,
    trustStatus: "certified",
  },
  {
    id: "2",
    name: "Shangri-La Bangkok",
    category: "Hotel",
    province: "Bangkok",
    distance: "0.5 km",
    rating: 4.9,
    trustStatus: "certified",
  },
  {
    id: "3",
    name: "Masjid Al-Falah",
    category: "Mosque",
    province: "Bangkok",
    distance: "0.7 km",
    rating: 4.8,
    trustStatus: "source-verified",
  },
  {
    id: "4",
    name: "The Grand Palace",
    category: "Attraction",
    province: "Bangkok",
    distance: "0.8 km",
    rating: 4.9,
    trustStatus: "source-verified",
  },
  {
    id: "5",
    name: "Patong Halal Kitchen",
    category: "Restaurant",
    province: "Phuket",
    distance: "1.1 km",
    rating: 4.4,
    trustStatus: "owner-submitted",
  },
  {
    id: "6",
    name: "Ristr8to Coffee",
    category: "Cafe",
    province: "Chiang Mai",
    distance: "1.3 km",
    rating: 4.7,
    trustStatus: "pending",
  },
  {
    id: "7",
    name: "Railay Beach Stopover",
    category: "Stopover",
    province: "Krabi",
    distance: "1.6 km",
    rating: 4.5,
    trustStatus: "source-verified",
  },
  {
    id: "8",
    name: "Hat Yai Night Market",
    category: "Attraction",
    province: "Songkhla",
    distance: "1.9 km",
    rating: 4.3,
    trustStatus: "certified",
  },
];

const LAYER_CONFIG: {
  key: string;
  label: string;
  icon: React.ElementType;
  color: string;
  dot: string;
}[] = [
  { key: "restaurant", label: "Restaurants", icon: UtensilsCrossed, color: "text-red-500", dot: "bg-red-500" },
  { key: "cafe", label: "Cafes", icon: Coffee, color: "text-amber-500", dot: "bg-amber-500" },
  { key: "hotel", label: "Hotels", icon: Hotel, color: "text-blue-500", dot: "bg-blue-500" },
  { key: "resort", label: "Resorts", icon: Hotel, color: "text-cyan-500", dot: "bg-cyan-500" },
  { key: "mosque", label: "Mosques", icon: Building2, color: "text-purple-500", dot: "bg-purple-500" },
  { key: "prayer-facility", label: "Prayer Facilities", icon: Building2, color: "text-violet-500", dot: "bg-violet-500" },
  { key: "attraction", label: "Attractions", icon: Star, color: "text-orange-500", dot: "bg-orange-500" },
  { key: "shopping", label: "Shopping / Malls", icon: ShoppingBag, color: "text-pink-500", dot: "bg-pink-500" },
  { key: "spa-wellness", label: "Spa / Wellness", icon: Leaf, color: "text-teal-500", dot: "bg-teal-500" },
  { key: "stopover", label: "Stopovers", icon: MapPin, color: "text-gray-500", dot: "bg-gray-500" },
  { key: "other", label: "Other", icon: HelpCircle, color: "text-slate-500", dot: "bg-slate-500" },
  { key: "amenities", label: "Amenities", icon: Shield, color: "text-teal-500", dot: "bg-teal-500" },
  { key: "certification", label: "Certification Status Overlay", icon: CheckCircle2, color: "text-emerald-500", dot: "bg-emerald-500" },
];

export function TouristMapExplorer({ onNavigate, isTouristLoggedIn, onTouristLogout }: TouristMapExplorerProps) {
  const [startMode, setStartMode] = useState<StartMode>("location");
  const [customPlace, setCustomPlace] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [layers, setLayers] = useState<LayerState>({
    ...Object.fromEntries(PLACE_TYPES.map((type) => [type.value, true])),
    amenities: true,
    certification: true,
  });
  const [showLayerDropdown, setShowLayerDropdown] = useState(false);
  const [legendCollapsed, setLegendCollapsed] = useState(false);

  const toggleLayer = (key: string) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const startModes: { mode: StartMode; icon: React.ElementType; label: string }[] = [
    { mode: "location", icon: LocateFixed, label: "Current Location" },
    { mode: "hotel", icon: Hotel, label: "Hotel" },
    { mode: "airport", icon: Plane, label: "Airport" },
    { mode: "station", icon: Train, label: "Station" },
    { mode: "custom", icon: Target, label: "Custom Place" },
  ];

  const filteredPlaces = NEARBY_PLACES.filter((p) => {
    if (!searchQuery) return true;
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.province.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <TouristLayout activePage="map" onNavigate={onNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={onTouristLogout}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 overflow-y-auto space-y-4 pr-1">
          {/* Start Mode Panel */}
          <Card>
            <CardHeader className="pb-2">
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Start From
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                {startModes.map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    title={label}
                    onClick={() => setStartMode(mode)}
                    className={`flex flex-col items-center gap-1 px-2.5 py-2 rounded-lg border text-xs transition-all ${
                      startMode === mode
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="leading-none whitespace-nowrap">{label}</span>
                  </button>
                ))}
              </div>
              {startMode === "custom" && (
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Enter a place name..."
                    value={customPlace}
                    onChange={(e) => setCustomPlace(e.target.value)}
                    className="pl-9 text-sm h-8"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search places on map..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Layer Toggles */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Map Layers</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {LAYER_CONFIG.map(({ key, label, icon: Icon, color }) => (
                <div key={key} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={`size-3.5 shrink-0 ${color}`} />
                    <Label htmlFor={`layer-${key}`} className="text-sm cursor-pointer truncate">
                      {label}
                    </Label>
                  </div>
                  <Switch
                    id={`layer-${key}`}
                    checked={layers[key]}
                    onCheckedChange={() => toggleLayer(key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Nearby Places */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Nearby Places</h3>
                <span className="text-xs text-muted-foreground">
                  {filteredPlaces.length} found
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredPlaces.map((place) => (
                  <button
                    key={place.id}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors group"
                    onClick={() => onNavigate?.("place-detail")}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-sm truncate">{place.name}</span>
                          <ChevronRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <span>{place.category}</span>
                          <span>·</span>
                          <span>{place.province}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <TrustBadge status={place.trustStatus} size="sm" />
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-0.5 text-xs text-amber-500">
                          <Star className="size-3 fill-amber-500" />
                          <span className="font-medium text-gray-700">{place.rating}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          <span>{place.distance}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-2 relative min-h-[600px] rounded-xl overflow-hidden border shadow-sm">
          <iframe
            src="https://maps.google.com/maps?q=Bangkok+Thailand&t=&z=12&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "600px", display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full absolute inset-0"
          />

          {/* Map Controls (right side) */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <Button
              size="icon"
              variant="secondary"
              className="bg-white/95 shadow-md hover:bg-white h-9 w-9 text-base font-bold"
              title="Zoom in"
            >
              +
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="bg-white/95 shadow-md hover:bg-white h-9 w-9 text-base font-bold"
              title="Zoom out"
            >
              −
            </Button>
            <div className="relative">
              <Button
                size="icon"
                variant="secondary"
                className={`bg-white/95 shadow-md h-9 w-9 ${showLayerDropdown ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "hover:bg-white"}`}
                title="Toggle layers"
                onClick={() => setShowLayerDropdown((v) => !v)}
              >
                <Layers className="size-4" />
              </Button>
              {showLayerDropdown && (
                <div className="absolute right-11 top-0 bg-white rounded-lg shadow-lg border p-3 w-60 space-y-2 max-h-80 overflow-y-auto">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Quick Layer Toggles
                  </p>
                  {LAYER_CONFIG.map(({ key, label, icon: Icon, color }) => (
                    <div key={key} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Icon className={`size-3 ${color}`} />
                        <span className="text-xs">{label}</span>
                      </div>
                      <Switch
                        checked={layers[key]}
                        onCheckedChange={() => toggleLayer(key)}
                        className="scale-75"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pin Legend (bottom left overlay) */}
          <div className="absolute bottom-4 left-4 bg-white/97 backdrop-blur-sm rounded-xl shadow-lg border z-10 max-w-[calc(100vw-90px)] sm:min-w-[180px]">
            <button
              className="flex items-center justify-between w-full px-3.5 py-2.5 text-xs font-bold text-gray-800 gap-2"
              onClick={() => setLegendCollapsed((v) => !v)}
            >
              <span>Map Legend</span>
              <ChevronRight className={`size-3.5 text-muted-foreground transition-transform ${legendCollapsed ? '' : 'rotate-90'}`} />
            </button>
            {!legendCollapsed && <div className="px-3.5 pb-3.5">

            {/* Place Types */}
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Place Type
            </p>
            <div className="space-y-1.5 mb-3">
              {LAYER_CONFIG.filter((item) => item.key !== "amenities" && item.key !== "certification").map((item) => (
                <div key={item.key} className="flex items-center gap-2">
                  <div className={`size-3 rounded-full shrink-0 ${item.dot}`} />
                  <span className="text-xs text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Trust Status (only when certification layer is ON) */}
            {layers.certification && (
              <>
                <Separator className="mb-2" />
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Trust Status
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-xs text-gray-700">Certified by Agency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full border-2 border-blue-500 bg-blue-100 shrink-0" />
                    <span className="text-xs text-gray-700">Source-Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-amber-400 shrink-0" />
                    <span className="text-xs text-gray-700">Pending Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-red-400 shrink-0" />
                    <span className="text-xs text-gray-700">Certificate Expired</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-gray-300 shrink-0" />
                    <span className="text-xs text-gray-700">Owner Submitted</span>
                  </div>
                </div>
              </>
            )}
            </div>}
          </div>
        </div>
      </div>
    </TouristLayout>
  );
}
