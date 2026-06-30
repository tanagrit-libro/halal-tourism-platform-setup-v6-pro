import React, { useState } from "react";
import { TouristLayout } from "../components/tourist-layout";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { TrustBadge, TrustStatus } from "../components/halal-badge";
import { TouristAuthProps } from "../types/tourist-auth";
import {
  getSavedTripById,
  SAVED_TRIP_ITINERARIES,
  SELECTED_SAVED_TRIP_KEY,
  SavedTripItinerary,
} from "../data/tourist-saved-trips";
import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Clock,
  Save,
  Map,
  List,
  LocateFixed,
  Info,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  Brain,
  Wallet,
  MoveUp,
  MoveDown,
  Eye,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface TouristAITripPlannerProps extends TouristAuthProps {
  onNavigate?: (page: string) => void;
}

type PlannerView = "mode-selection" | "pre-trip" | "current-location" | "itinerary";
type PlannerMode = "pre-trip" | "current-location";

interface Activity {
  id: string;
  time: string;
  place: string;
  activity: string;
  category: string;
  trustStatus: TrustStatus;
  agency?: string;
  reasons: string[];
}

interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
}

function getInitialSavedTrip() {
  if (typeof window === "undefined") return undefined;
  return getSavedTripById(window.localStorage.getItem(SELECTED_SAVED_TRIP_KEY));
}

function summaryFromSavedTrip(trip: SavedTripItinerary) {
  return {
    title: trip.name,
    duration: trip.duration,
    dates: trip.date,
    travelers: trip.travelers,
    budget: trip.budget,
  };
}

const AI_QUOTA_MAX = 5;
const INITIAL_QUOTA_REMAINING = 3;

const TOURISM_TYPES = [
  "Historical/Cultural Attraction",
  "Mountain/Waterfall/Viewpoint Attraction",
  "Wellness & Beauty Attraction",
  "Beach Attraction",
  "Adventure Attraction",
  "Recreational Attraction",
];

const HALAL_REQUIREMENTS = ["Prayer Place", "Halal Restaurant"];

const MOCK_PRE_TRIP_ITINERARY: DayPlan[] = [
  {
    day: 1,
    title: "Arrival & Bangkok Exploration",
    activities: [
      {
        id: "pre-1-1",
        time: "09:00",
        place: "Grand Mosque Restaurant",
        activity: "Breakfast",
        category: "Restaurant",
        trustStatus: "certified",
        agency: "CICOT (Central Islamic Council of Thailand)",
        reasons: [
          "Near your route and easy to reach",
          "Matches your interest in culture and halal cuisine",
          "Halal-certified restaurant",
          "Close to a prayer room / mosque",
          "Fits your available time in the morning",
          "Included because you saved similar restaurant and mosque places",
          "Budget estimate uses the average of the displayed price range",
        ],
      },
      {
        id: "pre-1-2",
        time: "11:00",
        place: "Central Prayer Room",
        activity: "Prayer Time",
        category: "Mosque",
        trustStatus: "source-verified",
        reasons: [
          "Placed before the main afternoon attraction",
          "Verified as a nearby prayer facility",
          "Reduces route backtracking",
        ],
      },
      {
        id: "pre-1-3",
        time: "14:00",
        place: "Islamic Heritage Museum",
        activity: "Cultural Visit",
        category: "Attraction",
        trustStatus: "source-verified",
        reasons: [
          "Matches historical and cultural interests",
          "Good fit for a relaxed afternoon pace",
          "Located near the planned dinner area",
        ],
      },
      {
        id: "pre-1-4",
        time: "18:00",
        place: "Halal Night Market",
        activity: "Dinner & Shopping",
        category: "Restaurant",
        trustStatus: "owner-submitted",
        reasons: [
          "Adds a casual local food experience",
          "Budget-friendly dining option",
          "Convenient final stop before returning",
          "Similar to places in your favorites list",
        ],
      },
    ],
  },
  {
    day: 2,
    title: "Cultural Route & Riverfront",
    activities: [
      {
        id: "pre-2-1",
        time: "09:30",
        place: "Bangkok National Museum",
        activity: "Museum Visit",
        category: "Attraction",
        trustStatus: "source-verified",
        reasons: [
          "Strong match with cultural travel style",
          "Works well as a morning indoor activity",
          "Pairs naturally with nearby historic landmarks",
        ],
      },
      {
        id: "pre-2-2",
        time: "12:30",
        place: "Usman Thai Muslim Food",
        activity: "Lunch",
        category: "Restaurant",
        trustStatus: "certified",
        agency: "CICOT (Central Islamic Council of Thailand)",
        reasons: [
          "Halal-certified and highly reviewed",
          "Good lunch timing between attractions",
          "Keeps route compact",
        ],
      },
      {
        id: "pre-2-3",
        time: "15:00",
        place: "Riverfront Heritage Walk",
        activity: "Sightseeing",
        category: "Attraction",
        trustStatus: "source-verified",
        reasons: [
          "Adds a lighter outdoor stop",
          "Balanced travel time after lunch",
          "Good photo and rest opportunity",
        ],
      },
    ],
  },
];

const MOCK_CURRENT_DAY_ITINERARY: DayPlan[] = [
  {
    day: 1,
    title: "Nearby Halal-Friendly Day Plan",
    activities: [
      {
        id: "day-1-1",
        time: "10:00",
        place: "Nearby Halal Cafe",
        activity: "Coffee & Brunch",
        category: "Cafe",
        trustStatus: "owner-submitted",
        reasons: [
          "Closest suitable food stop from your current location",
          "Fits a short day plan",
          "Low travel time before the first attraction",
          "Recommended because your saved places favor cafe and halal dining stops",
        ],
      },
      {
        id: "day-1-2",
        time: "12:15",
        place: "Community Prayer Facility",
        activity: "Prayer Break",
        category: "Prayer Facility",
        trustStatus: "source-verified",
        reasons: [
          "Added near prayer time",
          "Located along the suggested route",
          "Avoids unnecessary detour",
          "Matches prayer facilities saved or viewed in your travel profile",
        ],
      },
      {
        id: "day-1-3",
        time: "14:00",
        place: "Old Town Cultural Street",
        activity: "Cultural Walk",
        category: "Attraction",
        trustStatus: "source-verified",
        reasons: [
          "Matches nearby culture interest",
          "Works within today's available time",
          "Easy to return from before evening",
        ],
      },
    ],
  },
];

export function TouristAITripPlanner({
  onNavigate,
  isTouristLoggedIn = false,
  onTouristLogout,
  onRequireSignIn,
}: TouristAITripPlannerProps) {
  const { dir } = useLanguage();
  const selectedSavedTrip = getInitialSavedTrip();
  const [view, setView] = useState<PlannerView>(selectedSavedTrip ? "itinerary" : "mode-selection");
  const [activeMode, setActiveMode] = useState<PlannerMode>("pre-trip");
  const [quotaRemaining, setQuotaRemaining] = useState(INITIAL_QUOTA_REMAINING);
  const [itinerary, setItinerary] = useState<DayPlan[]>(selectedSavedTrip?.itinerary || MOCK_PRE_TRIP_ITINERARY);
  const [expandedReason, setExpandedReason] = useState<string>(
    selectedSavedTrip?.itinerary[0]?.activities[0]?.id || MOCK_PRE_TRIP_ITINERARY[0].activities[0].id
  );
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied" | "unsupported">("idle");
  const [tripSummary, setTripSummary] = useState(selectedSavedTrip ? summaryFromSavedTrip(selectedSavedTrip) : {
    title: "Your Trip to Bangkok",
    duration: "2 Days",
    dates: "May 15 - May 17, 2026",
    travelers: "2 Travelers",
    budget: "Moderate Budget",
  });

  const requireSignInForAction = () => {
    if (!isTouristLoggedIn) {
      onRequireSignIn?.();
      return true;
    }
    return false;
  };

  const consumeQuota = () => {
    if (quotaRemaining <= 0) {
      toast.error("No AI Planner quota remaining today.");
      return false;
    }
    setQuotaRemaining((current) => Math.max(0, current - 1));
    return true;
  };

  const generatePreTrip = () => {
    if (requireSignInForAction()) return;
    if (!consumeQuota()) return;
    window.localStorage.removeItem(SELECTED_SAVED_TRIP_KEY);
    setActiveMode("pre-trip");
    setItinerary(MOCK_PRE_TRIP_ITINERARY);
    setExpandedReason(MOCK_PRE_TRIP_ITINERARY[0].activities[0].id);
    setTripSummary({
      title: "Your Trip to Bangkok",
      duration: "2 Days",
      dates: "May 15 - May 17, 2026",
      travelers: "2 Travelers",
      budget: "Moderate Budget",
    });
    setView("itinerary");
    toast.success("Mock itinerary generated.");
  };

  const planCurrentDay = () => {
    if (requireSignInForAction()) return;
    if (!consumeQuota()) return;
    window.localStorage.removeItem(SELECTED_SAVED_TRIP_KEY);
    setActiveMode("current-location");
    setItinerary(MOCK_CURRENT_DAY_ITINERARY);
    setExpandedReason(MOCK_CURRENT_DAY_ITINERARY[0].activities[0].id);
    setTripSummary({
      title: "Your Day Plan Near Current Location",
      duration: "Today",
      dates: "Current day",
      travelers: "1-2 Travelers",
      budget: "Flexible Budget",
    });
    setView("itinerary");
    toast.success("Mock day plan generated.");
  };

  const regenerateExplanation = () => {
    if (requireSignInForAction()) return;
    if (!consumeQuota()) return;
    toast.success("AI explanation regenerated.");
  };

  const saveTrip = () => {
    if (requireSignInForAction()) return;
    toast.success("Trip saved to My Trips.");
  };

  const openSavedTrip = (tripId: string) => {
    const trip = getSavedTripById(tripId);
    if (!trip) return;
    window.localStorage.setItem(SELECTED_SAVED_TRIP_KEY, trip.id);
    setActiveMode("pre-trip");
    setItinerary(trip.itinerary);
    setExpandedReason(trip.itinerary[0]?.activities[0]?.id || "");
    setTripSummary(summaryFromSavedTrip(trip));
    setView("itinerary");
  };

  const moveActivity = (dayIndex: number, activityIndex: number, direction: "up" | "down") => {
    setItinerary((current) => current.map((day, index) => {
      if (index !== dayIndex) return day;
      const activities = [...day.activities];
      const targetIndex = direction === "up" ? activityIndex - 1 : activityIndex + 1;
      if (targetIndex < 0 || targetIndex >= activities.length) return day;
      [activities[activityIndex], activities[targetIndex]] = [activities[targetIndex], activities[activityIndex]];
      return { ...day, activities };
    }));
  };

  const deleteActivity = (dayIndex: number, activityId: string) => {
    setItinerary((current) => current.map((day, index) => (
      index === dayIndex
        ? { ...day, activities: day.activities.filter((activity) => activity.id !== activityId) }
        : day
    )));
    if (expandedReason === activityId) setExpandedReason("");
    toast.success("Place removed from itinerary.");
  };

  const openSourceRecord = (activity: Activity) => {
    toast.info(`Opening source record for ${activity.place}.`);
  };

  const requestUserLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationStatus("unsupported");
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    setLocationStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus("granted");
        toast.success("Current location loaded for Route Map.");
      },
      () => {
        setLocationStatus("denied");
        toast.error("Location permission was denied or unavailable.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const quotaLabel = isTouristLoggedIn
    ? `${quotaRemaining} / ${AI_QUOTA_MAX} remaining`
    : "AI Planner quota is available after sign-in";

  return (
    <TouristLayout activePage="ai-planner" onNavigate={onNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={onTouristLogout}>
      <div className="max-w-6xl mx-auto space-y-5" dir={dir}>
        <PlannerHeader
          view={view}
          quotaLabel={quotaLabel}
          quotaRemaining={quotaRemaining}
          isTouristLoggedIn={isTouristLoggedIn}
          onSignIn={() => onNavigate?.("login")}
          onRegister={() => onNavigate?.("register")}
        />

        {view === "mode-selection" && (
          <ModeSelection
            onPreTrip={() => {
              window.localStorage.removeItem(SELECTED_SAVED_TRIP_KEY);
              setActiveMode("pre-trip");
              setView("pre-trip");
            }}
            onCurrentLocation={() => {
              window.localStorage.removeItem(SELECTED_SAVED_TRIP_KEY);
              setActiveMode("current-location");
              setView("current-location");
            }}
            onSavedTrip={openSavedTrip}
          />
        )}

        {view === "pre-trip" && (
          <PreTripPlanner
            onBack={() => setView("mode-selection")}
            onGenerate={generatePreTrip}
            onEstimate={() => toast.success("Feasibility estimate: balanced route with moderate travel time.")}
          />
        )}

        {view === "current-location" && (
          <CurrentLocationPlanner
            onBack={() => setView("mode-selection")}
            onPlan={planCurrentDay}
            userLocation={userLocation}
            locationStatus={locationStatus}
            onRequestLocation={requestUserLocation}
          />
        )}

        {view === "itinerary" && (
          <ItineraryView
            activeMode={activeMode}
            itinerary={itinerary}
            tripSummary={tripSummary}
            expandedReason={expandedReason}
            onToggleReason={(id) => setExpandedReason(expandedReason === id ? "" : id)}
            onMoveActivity={moveActivity}
            onDeleteActivity={deleteActivity}
            onOpenSourceRecord={openSourceRecord}
            onRegenerate={regenerateExplanation}
            onSave={saveTrip}
            onStartOver={() => {
              window.localStorage.removeItem(SELECTED_SAVED_TRIP_KEY);
              setView("mode-selection");
            }}
            userLocation={userLocation}
            locationStatus={locationStatus}
            onRequestLocation={requestUserLocation}
          />
        )}
      </div>
    </TouristLayout>
  );
}

function PlannerHeader({
  view,
  quotaLabel,
  quotaRemaining,
  isTouristLoggedIn,
  onSignIn,
  onRegister,
}: {
  view: PlannerView;
  quotaLabel: string;
  quotaRemaining: number;
  isTouristLoggedIn: boolean;
  onSignIn: () => void;
  onRegister: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-lg bg-purple-100 flex items-center justify-center">
              <Sparkles className="size-6 text-purple-600" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-1">{viewLabel(view)}</Badge>
              <h1 className="text-3xl font-bold">AI Trip Planner</h1>
            </div>
          </div>
          <p className="text-muted-foreground mt-2">
            Halal-friendly travel planning with AI explanations you can trust.
          </p>
        </div>
        <QuotaCard quotaLabel={quotaLabel} quotaRemaining={quotaRemaining} />
      </div>

      {!isTouristLoggedIn && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <Info className="size-5 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-900">
                  Sign in to use your daily AI Planner quota and save generated trips. You can keep browsing travel information without an account.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" onClick={onSignIn}>Sign in</Button>
                <Button size="sm" variant="outline" onClick={onRegister}>Create account</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function QuotaCard({ quotaLabel, quotaRemaining }: { quotaLabel: string; quotaRemaining: number }) {
  return (
    <Card className="lg:w-72">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-3">
          <Brain className="size-5 text-slate-700 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">AI Quota Today</p>
            <p className="font-bold mt-1">{quotaLabel}</p>
            <div className="flex gap-1 mt-2">
              {Array.from({ length: AI_QUOTA_MAX }).map((_, index) => (
                <span key={index} className={`h-2 w-7 rounded-sm ${index < quotaRemaining ? "bg-emerald-500" : "bg-slate-200"}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Route calculation is separate and does not use quota. Generating explanations uses your quota.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ModeSelection({
  onPreTrip,
  onCurrentLocation,
  onSavedTrip,
}: {
  onPreTrip: () => void;
  onCurrentLocation: () => void;
  onSavedTrip: (tripId: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <ModeCard
        icon={<Calendar className="size-7" />}
        title="Plan Your Trip Ahead"
        body="Plan your trip in advance by choosing destinations, dates, preferences, and halal requirements."
        onClick={onPreTrip}
      />
      <ModeCard
        icon={<LocateFixed className="size-7" />}
        title="Plan from Current Location / Adjust Today"
        body="Create a plan for today based on where you are right now."
        onClick={onCurrentLocation}
      />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Saved Trip Mockups</CardTitle>
          <CardDescription>Open a saved itinerary exactly as it appears from My Trips.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SAVED_TRIP_ITINERARIES.map((trip) => (
            <button
              key={trip.id}
              onClick={() => onSavedTrip(trip.id)}
              className="text-left rounded-lg border bg-white p-4 hover:border-emerald-400 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{trip.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{trip.date} • {trip.duration}</p>
                </div>
                <Badge variant="secondary">{trip.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-3">{trip.destination} • {trip.travelers} • {trip.budget}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-2 bg-slate-50">
        <CardContent className="pt-4 pb-4 flex items-center gap-3 text-sm text-muted-foreground">
          <Info className="size-4" />
          The system explains why each recommendation is made.
        </CardContent>
      </Card>
    </div>
  );
}

function ModeCard({
  icon,
  title,
  body,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-lg border bg-white p-6 min-h-64 hover:border-emerald-400 hover:shadow-md transition-all"
    >
      <div className="size-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-8">
        {icon}
      </div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{body}</p>
        </div>
        <ChevronRight className="size-6 text-muted-foreground shrink-0" />
      </div>
    </button>
  );
}

function PreTripPlanner({
  onBack,
  onGenerate,
  onEstimate,
}: {
  onBack: () => void;
  onGenerate: () => void;
  onEstimate: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5" />
              Pre-Trip Planner
            </CardTitle>
            <CardDescription>Plan your trip in advance. Multiple provinces / regions are supported.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Start From"><Input placeholder="City, Airport, or Address" /></Field>
          <Field label="Destinations / Provinces / Regions">
            <Select defaultValue="bangkok">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bangkok">Bangkok</SelectItem>
                <SelectItem value="phuket-phangnga">Phuket + Phang Nga</SelectItem>
                <SelectItem value="krabi-trang">Krabi + Trang</SelectItem>
                <SelectItem value="songkhla-satun">Songkhla + Satun</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="End Location"><Input placeholder="City, Airport, or Address" /></Field>
          <Field label="Trip Duration (days)"><Input type="number" min="1" defaultValue="2" /></Field>
          <Field label="Start Date"><Input type="date" /></Field>
          <Field label="Daily Start Time"><Input type="time" defaultValue="09:00" /></Field>
          <Field label="Daily Travel Hours">
            <Select defaultValue="6-10">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="4-6">4-6 hours</SelectItem>
                <SelectItem value="6-10">6-10 hours</SelectItem>
                <SelectItem value="10-12">10-12 hours</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Number of Travelers">
            <Select defaultValue="2">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 traveler</SelectItem>
                <SelectItem value="2">2 travelers</SelectItem>
                <SelectItem value="family">Family / group</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Budget Range">
            <Select defaultValue="moderate">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Budget is a rough estimate, mainly for attractions with entrance fees.</p>
          </Field>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CheckboxPanel title="Tourism Types / Interests" items={TOURISM_TYPES} />
          <CheckboxPanel title="Halal Requirements" items={HALAL_REQUIREMENTS} />
        </div>

        <Field label="Travel Style">
          <Select defaultValue="balanced">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="relaxed">Relaxed</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
              <SelectItem value="fast">Fast-Paced</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button onClick={onGenerate}>
            <Sparkles className="size-4 mr-2" />
            Generate Itinerary
          </Button>
          <Button variant="outline" onClick={onEstimate}>
            <List className="size-4 mr-2" />
            Estimate Feasibility
          </Button>
        </div>

        <InfoBar />
      </CardContent>
    </Card>
  );
}

function CurrentLocationPlanner({
  onBack,
  onPlan,
  userLocation,
  locationStatus,
  onRequestLocation,
}: {
  onBack: () => void;
  onPlan: () => void;
  userLocation: { lat: number; lng: number } | null;
  locationStatus: "idle" | "requesting" | "granted" | "denied" | "unsupported";
  onRequestLocation: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LocateFixed className="size-5" />
              Current Location Planner
            </CardTitle>
            <CardDescription>Plan your day based on where you are now.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={onRequestLocation} disabled={locationStatus === "requesting"}>
                <LocateFixed className="size-4 mr-2" />
                {locationStatus === "requesting"
                  ? "Requesting..."
                  : userLocation
                  ? "Refresh Location"
                  : "Use Current Location"}
              </Button>
              <Button variant="outline"><MapPin className="size-4 mr-2" /> Choose Starting Place</Button>
            </div>
            <Field label="Time Available Today">
              <Select defaultValue="4">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Return to Same Place?">
              <Select defaultValue="yes">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Nearby Interests"><Input placeholder="Select or search, e.g. culture, beach, history" /></Field>
            <CheckboxPanel title="Tourism Types / Interests" items={TOURISM_TYPES} />
            <CheckboxPanel title="Halal Requirements" items={HALAL_REQUIREMENTS} />
            <Field label="Budget">
              <Select defaultValue="moderate">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Button className="w-full" onClick={onPlan}>
              <Sparkles className="size-4 mr-2" />
              Plan My Day
            </Button>
          </div>
          <div className="space-y-4">
            <RouteMapPanel
              location={userLocation}
              locationStatus={locationStatus}
              onRequestLocation={onRequestLocation}
            />
            <Card className="bg-slate-50">
              <CardContent className="pt-4 pb-4 space-y-3 text-sm">
                <p className="font-semibold">Using your location helps us to:</p>
                {[
                  "Find nearby halal-friendly places",
                  "Suggest realistic routes and timing",
                  "Consider traffic and walking distance",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-5">
          <InfoBar />
        </div>
      </CardContent>
    </Card>
  );
}

function ItineraryView({
  activeMode,
  itinerary,
  tripSummary,
  expandedReason,
  onToggleReason,
  onMoveActivity,
  onDeleteActivity,
  onOpenSourceRecord,
  onRegenerate,
  onSave,
  onStartOver,
  userLocation,
  locationStatus,
  onRequestLocation,
}: {
  activeMode: PlannerMode;
  itinerary: DayPlan[];
  tripSummary: {
    title: string;
    duration: string;
    dates: string;
    travelers: string;
    budget: string;
  };
  expandedReason: string;
  onToggleReason: (id: string) => void;
  onMoveActivity: (dayIndex: number, activityIndex: number, direction: "up" | "down") => void;
  onDeleteActivity: (dayIndex: number, activityId: string) => void;
  onOpenSourceRecord: (activity: Activity) => void;
  onRegenerate: () => void;
  onSave: () => void;
  onStartOver: () => void;
  userLocation: { lat: number; lng: number } | null;
  locationStatus: "idle" | "requesting" | "granted" | "denied" | "unsupported";
  onRequestLocation: () => void;
}) {
  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <Badge variant="secondary" className="mb-2">{activeMode === "pre-trip" ? "Pre-Trip Planner" : "Current Location Planner"}</Badge>
              <h2 className="text-2xl font-bold">{tripSummary.title}</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Favorite places are used as a mock personalization signal. Budget estimation uses the average value from each place price range.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
                <SummaryItem icon={<Clock className="size-4" />} label="Duration" value={tripSummary.duration} />
                <SummaryItem icon={<Calendar className="size-4" />} label="Dates" value={tripSummary.dates} />
                <SummaryItem icon={<Users className="size-4" />} label="Travelers" value={tripSummary.travelers} />
                <SummaryItem icon={<Wallet className="size-4" />} label="Budget" value={tripSummary.budget} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={onRegenerate}>
                <RefreshCw className="size-4 mr-2" />
                Regenerate Explanation
              </Button>
              <Button onClick={onSave}>
                <Save className="size-4 mr-2" />
                Save Trip
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList>
          <TabsTrigger value="timeline"><List className="size-4 mr-2" /> Timeline View</TabsTrigger>
          <TabsTrigger value="map"><Map className="size-4 mr-2" /> Route Map</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline" className="mt-5">
          <Timeline
            itinerary={itinerary}
            expandedReason={expandedReason}
            onToggleReason={onToggleReason}
            onMoveActivity={onMoveActivity}
            onDeleteActivity={onDeleteActivity}
            onOpenSourceRecord={onOpenSourceRecord}
          />
        </TabsContent>
        <TabsContent value="map" className="mt-5">
          <RouteMapPanel
            location={userLocation}
            locationStatus={locationStatus}
            onRequestLocation={onRequestLocation}
          />
        </TabsContent>
      </Tabs>

      <Card className="bg-slate-50">
        <CardContent className="pt-4 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <InfoBar compact />
          <Button variant="outline" onClick={onStartOver}>Start Over</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Timeline({
  itinerary,
  expandedReason,
  onToggleReason,
  onMoveActivity,
  onDeleteActivity,
  onOpenSourceRecord,
}: {
  itinerary: DayPlan[];
  expandedReason: string;
  onToggleReason: (id: string) => void;
  onMoveActivity: (dayIndex: number, activityIndex: number, direction: "up" | "down") => void;
  onDeleteActivity: (dayIndex: number, activityId: string) => void;
  onOpenSourceRecord: (activity: Activity) => void;
}) {
  return (
    <div className="space-y-5">
      {itinerary.map((day, dayIndex) => (
        <Card key={day.day} className="rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="size-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">{day.day}</div>
              <div>
                <CardTitle className="text-2xl">Day {day.day}</CardTitle>
                <CardDescription className="text-lg">{day.title}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              {day.activities.map((activity, activityIndex) => (
                <div key={activity.id} className="grid grid-cols-1 gap-3 border-b py-6 first:pt-2 last:border-b-0 md:grid-cols-[110px_1fr_210px]">
                  <div className="text-2xl font-bold text-emerald-600">{activity.time}</div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold">{activity.place}</h3>
                      <TrustBadge status={activity.trustStatus} agency={activity.agency} size="sm" />
                    </div>
                    <p className="mt-2 text-base text-muted-foreground">{activity.activity} • {activity.category}</p>

                    {expandedReason === activity.id && (
                      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-800">
                        <p className="mb-3 flex items-center gap-2 font-semibold">
                          <Info className="size-4" />
                          Why recommended
                        </p>
                        <ul className="space-y-2">
                          {activity.reasons.map((reason) => (
                            <li key={reason} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-500" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex items-start justify-start gap-2 md:justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500"
                      disabled={activityIndex === 0}
                      title="Move place up"
                      onClick={() => onMoveActivity(dayIndex, activityIndex, "up")}
                    >
                      <MoveUp className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500"
                      disabled={activityIndex === day.activities.length - 1}
                      title="Move place down"
                      onClick={() => onMoveActivity(dayIndex, activityIndex, "down")}
                    >
                      <MoveDown className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={expandedReason === activity.id ? "text-blue-600" : "text-blue-400"}
                      title="Why this was recommended"
                      onClick={() => onToggleReason(activity.id)}
                    >
                      <Info className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-purple-400 hover:text-purple-600"
                      title="Opening source record"
                      onClick={() => onOpenSourceRecord(activity)}
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-600"
                      title="Delete place"
                      onClick={() => onDeleteActivity(dayIndex, activity.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {day.activities.length === 0 && (
                <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
                  No places remain for this day.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
function RouteMapPanel({
  location,
  locationStatus,
  onRequestLocation,
}: {
  location: { lat: number; lng: number } | null;
  locationStatus: "idle" | "requesting" | "granted" | "denied" | "unsupported";
  onRequestLocation: () => void;
}) {
  const mapSrc = location
    ? `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`
    : "https://maps.google.com/maps?q=Bangkok%20Thailand%20halal%20restaurant%20mosque&z=12&output=embed";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Map className="size-4" />
              Route Map
            </CardTitle>
            <CardDescription>
              {location
                ? "Google Maps is centered on your current location."
                : "Allow location access to center the route map on your current position."}
            </CardDescription>
          </div>
          <Button
            variant={location ? "outline" : "default"}
            size="sm"
            onClick={onRequestLocation}
            disabled={locationStatus === "requesting"}
          >
            <LocateFixed className="size-4 mr-2" />
            {locationStatus === "requesting"
              ? "Requesting Location..."
              : location
              ? "Refresh Current Location"
              : "Use Current Location"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {locationStatus === "denied" && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Location access was denied or unavailable. You can enable location permission in your browser settings and try again.
          </div>
        )}
        {locationStatus === "unsupported" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            This browser does not support geolocation. The map will show the default Bangkok route preview.
          </div>
        )}
        {location && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Latitude</p>
              <p className="font-mono text-sm">{location.lat.toFixed(6)}</p>
            </div>
            <div className="rounded-lg border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Longitude</p>
              <p className="font-mono text-sm">{location.lng.toFixed(6)}</p>
            </div>
            <div className="rounded-lg border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Map Source</p>
              <p className="text-sm font-medium">Google Maps</p>
            </div>
          </div>
        )}
        <div className="overflow-hidden rounded-lg border">
          <iframe
            title={location ? "Google Map centered on current location" : "Google Map default route preview"}
            src={mapSrc}
            width="100%"
            height="520"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <p className="text-xs text-muted-foreground flex items-start gap-2">
          <Info className="size-3.5 mt-0.5 shrink-0" />
          The browser will ask for location permission. Route calculation still remains a prototype mock; this map only centers the visual route context on the user's real current location.
        </p>
      </CardContent>
    </Card>
  );
}

function CheckboxPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-sm font-semibold mb-3">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="size-4 rounded border-slate-300" />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SummaryItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function InfoBar({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-start gap-2 text-sm text-muted-foreground ${compact ? "" : "rounded-lg border bg-slate-50 p-3"}`}>
      <Info className="size-4 mt-0.5 shrink-0" />
      <p>Route calculation does not consume AI quota. Generating explanations uses your quota.</p>
    </div>
  );
}

function viewLabel(view: PlannerView) {
  if (view === "pre-trip") return "Pre-Trip Planner";
  if (view === "current-location") return "Current Location Planner";
  if (view === "itinerary") return "Itinerary & Explanation";
  return "Mode Selection";
}

export default TouristAITripPlanner;
