import React, { useState } from "react";
import { TouristLayout } from "../components/tourist-layout";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { TrustBadge, TrustStatus } from "../components/halal-badge";
import { TouristAuthProps } from "../types/tourist-auth";
import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Loader2,
  Clock,
  Trash2,
  MoveUp,
  MoveDown,
  Share2,
  Download,
  Save,
  Map,
  List,
  X,
  Navigation,
  LocateFixed,
  Hotel,
  Plane,
  Train,
  Target,
  Info,
  AlertCircle,
  Route,
  RefreshCw,
  BookOpen,
  Eye,
  Edit3,
  CheckCircle2,
  Star,
  Utensils,
  Moon,
} from "lucide-react";
import { toast } from "sonner";

interface TouristAITripPlannerProps extends TouristAuthProps {
  onNavigate?: (page: string) => void;
}

type StartPointMode = "location" | "hotel" | "airport" | "station" | "custom";

interface Activity {
  id: string;
  time: string;
  place: string;
  activity: string;
  type: string;
  trustStatus: TrustStatus;
  agency?: string;
  reasons: string[];
}

interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
}

interface RoutePreset {
  id: string;
  label: string;
  provinces: string[];
  duration: string;
  type: string;
  icon: React.ReactNode;
  destination: string;
}

const ROUTE_PRESETS: RoutePreset[] = [
  {
    id: "phuket-phangnga",
    label: "Phuket -> Phang Nga",
    provinces: ["Phuket", "Phang Nga"],
    duration: "2-3 days",
    type: "Beach + Nature",
    icon: <Star className="size-4 text-blue-500" />,
    destination: "Phuket, Phang Nga",
  },
  {
    id: "bangkok-ayutthaya",
    label: "Bangkok -> Ayutthaya",
    provinces: ["Bangkok", "Ayutthaya"],
    duration: "2 days",
    type: "Cultural",
    icon: <BookOpen className="size-4 text-amber-500" />,
    destination: "Bangkok, Ayutthaya",
  },
  {
    id: "krabi-trang",
    label: "Krabi -> Trang",
    provinces: ["Krabi", "Trang"],
    duration: "3 days",
    type: "Islands + Coast",
    icon: <Navigation className="size-4 text-teal-500" />,
    destination: "Krabi, Trang",
  },
  {
    id: "phuket-songkhla",
    label: "Phuket -> Songkhla",
    provinces: ["Phuket", "Songkhla"],
    duration: "4 days",
    type: "South Circuit",
    icon: <Route className="size-4 text-purple-500" />,
    destination: "Phuket, Songkhla",
  },
];

const MOCK_ITINERARY: DayPlan[] = [
  {
    day: 1,
    title: "Arrival & Bangkok Exploration",
    activities: [
      {
        id: "1-1",
        time: "09:00",
        place: "Grand Mosque Restaurant",
        activity: "Breakfast",
        type: "restaurant",
        trustStatus: "certified",
        agency: "CICOT",
        reasons: ["Certified by CICOT", "High review score (4.8)", "Near route"],
      },
      {
        id: "1-2",
        time: "12:00",
        place: "Central Prayer Room Siam",
        activity: "Prayer Time",
        type: "prayer",
        trustStatus: "source-verified",
        reasons: ["Suitable prayer timing", "Near route"],
      },
      {
        id: "1-3",
        time: "14:00",
        place: "Ayutthaya Historical Park",
        activity: "Cultural Visit",
        type: "attraction",
        trustStatus: "source-verified",
        agency: "TAT",
        reasons: ["Matches interests", "High review score (4.9)"],
      },
      {
        id: "1-4",
        time: "19:00",
        place: "Yana Restaurant",
        activity: "Dinner",
        type: "restaurant",
        trustStatus: "certified",
        agency: "CICOT",
        reasons: ["Certified by CICOT", "Muslim-friendly amenities"],
      },
    ],
  },
  {
    day: 2,
    title: "Cultural Immersion",
    activities: [
      {
        id: "2-1",
        time: "08:00",
        place: "Shangri-La Bangkok",
        activity: "Breakfast",
        type: "hotel",
        trustStatus: "source-verified",
        reasons: ["Near route", "Muslim-friendly amenities"],
      },
      {
        id: "2-2",
        time: "10:00",
        place: "Wat Arun",
        activity: "Attraction Visit",
        type: "attraction",
        trustStatus: "source-verified",
        reasons: ["Matches interests", "High review score (4.8)"],
      },
      {
        id: "2-3",
        time: "13:00",
        place: "Usman Thai Muslim Food",
        activity: "Lunch",
        type: "restaurant",
        trustStatus: "certified",
        agency: "CICOT",
        reasons: ["Certified by CICOT", "Near route"],
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
  const isRtl = dir === "rtl";
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [destination, setDestination] = useState("Bangkok");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [itinerary, setItinerary] = useState<DayPlan[]>([]);
  const [aiQuotaUsed, setAiQuotaUsed] = useState(1);
  const [showAiExplanation, setShowAiExplanation] = useState(false);
  const [startPointMode, setStartPointMode] = useState<StartPointMode>("location");
  const [customStartPoint, setCustomStartPoint] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showReasonFor, setShowReasonFor] = useState<string | null>(null);
  const [quotaDismissed, setQuotaDismissed] = useState(false);

  const AI_QUOTA_MAX = 5;
  const aiQuotaRemaining = AI_QUOTA_MAX - aiQuotaUsed;

  const handlePresetSelect = (preset: RoutePreset) => {
    setSelectedPreset(preset.id);
    setDestination(preset.destination);
  };

  const calculateRoute = () => {
    if (!isTouristLoggedIn) {
      onRequireSignIn?.();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setItinerary(MOCK_ITINERARY);
      setLoading(false);
      setShowResult(true);
      setShowAiExplanation(false);
      toast.success("Route calculated successfully!");
    }, 900);
  };

  const addAiExplanation = () => {
    if (!isTouristLoggedIn) {
      onRequireSignIn?.();
      return;
    }
    if (aiQuotaRemaining <= 0) {
      toast.error("No AI credits remaining today.");
      return;
    }
    setAiQuotaUsed((prev) => Math.min(prev + 1, AI_QUOTA_MAX));
    setShowAiExplanation(true);
    if (!showResult) {
      setItinerary(MOCK_ITINERARY);
      setShowResult(true);
    }
    toast.success("AI explanation added to your itinerary!");
  };

  const removeActivity = (dayIndex: number, actId: string) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities = newItinerary[dayIndex].activities.filter((a) => a.id !== actId);
    setItinerary(newItinerary);
    toast.success("Activity removed");
  };

  const moveActivity = (dayIndex: number, index: number, direction: "up" | "down") => {
    const newItinerary = [...itinerary];
    const activities = newItinerary[dayIndex].activities;
    if (direction === "up" && index > 0) {
      [activities[index], activities[index - 1]] = [activities[index - 1], activities[index]];
    } else if (direction === "down" && index < activities.length - 1) {
      [activities[index], activities[index + 1]] = [activities[index + 1], activities[index]];
    }
    setItinerary(newItinerary);
  };

  const handleSaveTrip = () => {
    if (!isTouristLoggedIn) {
      onRequireSignIn?.();
      return;
    }
    toast.success("Trip saved to My Trips!");
    setTimeout(() => onNavigate?.("my-trips"), 700);
  };

  const getExportData = () => JSON.stringify({ destination, itinerary }, null, 2);

  const handleCopyExport = () => {
    navigator.clipboard.writeText(getExportData());
    toast.success("Itinerary JSON copied to clipboard");
  };

  const startPointOptions: { mode: StartPointMode; label: string; icon: React.ReactNode }[] = [
    { mode: "location", label: "Current Location", icon: <LocateFixed className="size-4" /> },
    { mode: "hotel", label: "Hotel", icon: <Hotel className="size-4" /> },
    { mode: "airport", label: "Airport", icon: <Plane className="size-4" /> },
    { mode: "station", label: "Station", icon: <Train className="size-4" /> },
    { mode: "custom", label: "Custom Place", icon: <Target className="size-4" /> },
  ];

  return (
    <TouristLayout activePage="ai-planner" onNavigate={onNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={onTouristLogout}>
      <div className="max-w-4xl mx-auto relative" dir={dir}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 bg-purple-100 rounded-full mb-4">
            <Sparkles className="size-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">AI Trip Planner</h1>
          <p className="text-muted-foreground text-lg">Trusted Travel Information for Thailand</p>
        </div>

        {!showResult ? (
          <div className="space-y-6">
            {!isTouristLoggedIn && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-5 pb-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="size-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-900">
                          Sign in to use your daily AI Planner quota and save generated trips.
                        </p>
                        <p className="text-sm text-amber-800 mt-1">
                          You can keep browsing travel information without an account.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => onNavigate?.("login")}>Sign in</Button>
                      <Button size="sm" variant="outline" onClick={() => onNavigate?.("register")}>Create account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!quotaDismissed && (
              <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Info className="size-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-emerald-800 mb-2">
                          {isTouristLoggedIn
                            ? `AI Planner quota: ${aiQuotaRemaining}/${AI_QUOTA_MAX} remaining today`
                            : "AI Planner quota is available after sign-in"}
                        </p>
                        <div className="flex gap-1 mb-2">
                          {Array.from({ length: AI_QUOTA_MAX }).map((_, i) => (
                            <div key={i} className={`h-2 w-8 rounded-sm ${i < aiQuotaRemaining ? "bg-emerald-500" : "bg-gray-200"}`} />
                          ))}
                        </div>
                        <p className="text-xs text-emerald-700">
                          {isTouristLoggedIn
                            ? "Route generation, saving, and AI explanations use your daily account quota."
                            : "Sign in when you want to generate and save AI trip plans."}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-emerald-600" onClick={() => setQuotaDismissed(true)}>
                      <X className="size-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Route className="size-5 text-muted-foreground" />
                <h2 className="font-semibold text-lg">Route Presets</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ROUTE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      selectedPreset === preset.id ? "border-emerald-500 bg-emerald-50" : "border-border bg-card hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {preset.icon}
                        <span className="font-medium text-sm">{preset.label}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">{preset.duration}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {preset.provinces.map((p) => (
                        <Badge key={p} variant="outline" className="text-xs">
                          <MapPin className="size-2.5 mr-1" />
                          {p}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="text-xs text-muted-foreground">{preset.type}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Tell us about your trip</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Start Point</Label>
                  <div className="flex flex-wrap gap-2">
                    {startPointOptions.map((opt) => (
                      <button
                        key={opt.mode}
                        onClick={() => setStartPointMode(opt.mode)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                          startPointMode === opt.mode
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-border bg-background hover:border-emerald-300 text-muted-foreground"
                        }`}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {startPointMode === "custom" && (
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter your custom starting point..."
                        className="pl-10"
                        value={customStartPoint}
                        onChange={(e) => setCustomStartPoint(e.target.value)}
                      />
                    </div>
                  )}
                  {startPointMode === "location" && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <LocateFixed className="size-3" />
                      We'll use your current GPS location when generating the route.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Route / Destination</Label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger id="destination">
                      <MapPin className="size-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select destination or route" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bangkok">Bangkok</SelectItem>
                      <SelectItem value="Ayutthaya">Ayutthaya</SelectItem>
                      <SelectItem value="Chiang Mai">Chiang Mai</SelectItem>
                      <SelectItem value="Phuket">Phuket</SelectItem>
                      <SelectItem value="Phuket, Phang Nga">Multi-stop: Phuket to Phang Nga</SelectItem>
                      <SelectItem value="Bangkok, Ayutthaya">Multi-stop: Bangkok to Ayutthaya</SelectItem>
                      <SelectItem value="Krabi, Trang">Multi-stop: Krabi to Trang</SelectItem>
                      <SelectItem value="Phuket, Songkhla">Multi-stop: Phuket to Songkhla</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Trip Duration</Label>
                    <Select defaultValue="3">
                      <SelectTrigger id="duration"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="2">2 Days</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="7">1 Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelers">Number of Travelers</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input id="travelers" type="number" placeholder="2" className="pl-10" defaultValue="2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Start Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input id="date" type="date" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input id="start-time" type="time" className="pl-10" defaultValue="09:00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="daily-hours">Daily Travel Hours (Max 12h)</Label>
                    <Select defaultValue="8">
                      <SelectTrigger id="daily-hours"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 Hours</SelectItem>
                        <SelectItem value="8">8 Hours (Standard)</SelectItem>
                        <SelectItem value="12">12 Hours (Max)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="budget"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Budget-Friendly (THB 100-300)</SelectItem>
                        <SelectItem value="medium">Moderate (THB 300-1000)</SelectItem>
                        <SelectItem value="high">Luxury (THB 1000+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tourism-type">Tourism Type</Label>
                  <Select defaultValue="cultural">
                    <SelectTrigger id="tourism-type"><SelectValue placeholder="Select tourism type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beach">Beach</SelectItem>
                      <SelectItem value="cultural">Historical & Cultural</SelectItem>
                      <SelectItem value="natural">Natural</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="shopping">Shopping & Dining</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">Interests & Preferences</Label>
                  <Textarea id="interests" placeholder="Tell us about your interests..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements">Special Requirements</Label>
                  <Textarea id="requirements" placeholder="Any special requirements?" rows={2} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1" size="lg" onClick={calculateRoute} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="size-5 mr-2 animate-spin" />
                        Calculating Route...
                      </>
                    ) : (
                      <>
                        <Route className="size-5 mr-2" />
                        Calculate Route
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1" onClick={addAiExplanation} disabled={loading || aiQuotaRemaining <= 0}>
                    <Sparkles className="size-5 mr-2 text-purple-500" />
                    Add AI Explanation
                    <Badge variant="secondary" className="ml-2 text-xs bg-purple-100 text-purple-700">Uses 1 AI credit</Badge>
                  </Button>
                </div>
                {aiQuotaRemaining <= 0 && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    You've used all AI credits for today. Route calculation is still available.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-6">
                <div className={`flex flex-col md:flex-row items-start justify-between gap-4 ${isRtl ? "md:flex-row-reverse" : ""}`}>
                  <div className="flex items-start gap-4">
                    <div className="size-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="size-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Your Personalized Itinerary</h3>
                      <p className="text-muted-foreground text-sm mb-2">3-day trip to {destination}. Fully customizable.</p>
                      <div className="flex items-center gap-2">
                        {showAiExplanation ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
                            <CheckCircle2 className="size-3 mr-1" />
                            AI Explained
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm" className="text-xs h-7" onClick={addAiExplanation} disabled={aiQuotaRemaining <= 0}>
                            <Sparkles className="size-3 mr-1 text-purple-500" />
                            Route Only - Add AI Explanation
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" onClick={() => toast.info("Edit mode coming soon")}>
                      <Edit3 className="size-4 mr-2" />
                      Edit Route
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
                      <Share2 className="size-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" onClick={handleSaveTrip}>
                      <Save className="size-4 mr-2" />
                      Save Trip
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-3 px-1">
              <div className="flex gap-1">
                {Array.from({ length: AI_QUOTA_MAX }).map((_, i) => (
                  <div key={i} className={`h-2 w-6 rounded-sm ${i < aiQuotaRemaining ? "bg-emerald-500" : "bg-gray-200"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{aiQuotaRemaining}/{AI_QUOTA_MAX} AI credits remaining today</p>
            </div>

            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="timeline">
                  <List className="size-4 mr-2" />
                  Timeline View
                </TabsTrigger>
                <TabsTrigger value="map">
                  <Map className="size-4 mr-2" />
                  Route Map
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="mt-6 space-y-6">
                {itinerary.map((day, dayIndex) => (
                  <Card key={day.day}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700">{day.day}</div>
                        <div>
                          <h3 className="font-semibold text-lg">Day {day.day}</h3>
                          <p className="text-muted-foreground text-sm">{day.title}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {day.activities.map((activity, idx) => (
                          <div key={activity.id} className="flex flex-col gap-2 pb-4 border-b last:border-0 last:pb-0">
                            <div className={`flex flex-col gap-3 group sm:flex-row ${isRtl ? "sm:flex-row-reverse" : ""}`}>
                              <div className="font-semibold text-emerald-600 w-20 flex-shrink-0 pt-0.5">{activity.time}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <p className="font-medium">{activity.place}</p>
                                  <TrustBadge status={activity.trustStatus} agency={activity.agency} size="sm" />
                                </div>
                                <p className="text-sm text-muted-foreground capitalize">{activity.activity} &bull; {activity.type}</p>
                              </div>
                              <div className="flex gap-1 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={idx === 0} onClick={() => moveActivity(dayIndex, idx, "up")} title="Move up">
                                  <MoveUp className="size-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={idx === day.activities.length - 1} onClick={() => moveActivity(dayIndex, idx, "down")} title="Move down">
                                  <MoveDown className="size-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowReasonFor(showReasonFor === activity.id ? null : activity.id)} title="Why recommended">
                                  <Info className="size-3.5 text-blue-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info("Opening source record...")} title="View source">
                                  <Eye className="size-3.5 text-purple-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => removeActivity(dayIndex, activity.id)} title="Remove">
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </div>
                            {showReasonFor === activity.id && (
                              <div className="ml-0 sm:ml-[92px] bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
                                  <Info className="size-3" />
                                  Why recommended
                                </p>
                                <ul className="space-y-1">
                                  {activity.reasons.map((reason, ri) => (
                                    <li key={ri} className="text-xs text-blue-800 flex items-center gap-1.5">
                                      <CheckCircle2 className="size-3 text-blue-500 flex-shrink-0" />
                                      {reason}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="map" className="mt-6">
                <Card>
                  <CardContent className="p-0 overflow-hidden rounded-lg">
                    <div className="relative w-full h-[600px] bg-slate-100">
                      <iframe
                        src={`https://maps.google.com/maps?q=${destination}+tourist+attractions&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                      />
                      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
                        <h4 className="font-semibold mb-1">Route Information</h4>
                        <p className="text-sm text-muted-foreground">Showing suggested locations for your {destination} trip.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <Separator />
              <div className="flex items-center gap-2">
                <RefreshCw className="size-5 text-muted-foreground" />
                <h3 className="font-semibold text-lg">Alternative Options</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AlternativeCard icon={<Route className="size-4 text-blue-500" />} title="Shorter Route Variant" body="Same highlights with fewer stops and less transit time." />
                <AlternativeCard icon={<Utensils className="size-4 text-amber-500" />} title="Budget-Friendly Variant" body="Hotels replaced with halal-certified guesthouses." />
                <AlternativeCard icon={<Moon className="size-4 text-emerald-500" />} title="Prayer-Friendly Timing" body="Activity schedule aligned with daily prayer times." />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowResult(false);
                  setShowAiExplanation(false);
                  setSelectedPreset(null);
                }}
              >
                Start Over
              </Button>
            </div>
          </div>
        )}

        {showExportDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md relative animate-in fade-in zoom-in duration-200">
              <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => setShowExportDialog(false)}>
                <X className="size-4" />
              </Button>
              <CardHeader>
                <CardTitle>Export Itinerary</CardTitle>
                <CardDescription>Share your trip plan with others</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-24 flex-col gap-2" onClick={handleCopyExport}>
                    <div className="p-2 bg-slate-100 rounded-full">
                      <Download className="size-5" />
                    </div>
                    <span>Copy JSON</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => toast.success("Link copied!")}>
                    <div className="p-2 bg-slate-100 rounded-full">
                      <Share2 className="size-5" />
                    </div>
                    <span>Copy Link</span>
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>JSON Preview</Label>
                  <Textarea readOnly value={getExportData()} className="h-32 font-mono text-xs" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TouristLayout>
  );
}

function AlternativeCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <Card className="border-dashed">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <CardTitle className="text-sm">{title}</CardTitle>
        </div>
        <CardDescription className="text-xs">{body}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => toast.info(`Switching to ${title.toLowerCase()}...`)}>
          Switch to this
        </Button>
      </CardContent>
    </Card>
  );
}

export default TouristAITripPlanner;
