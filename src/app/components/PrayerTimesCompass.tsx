import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, MapPin, Navigation, Sunrise, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { toast } from "sonner";
import { motion } from "motion/react";

interface PrayerTimeData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export function PrayerTimesCompass() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimeData | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [timeToNextPrayer, setTimeToNextPrayer] = useState<string | null>(null);

  useEffect(() => {
    // Get user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error(err);
          setError("Unable to retrieve your location. Please enable location services.");
          setLoading(false);
          toast.error("Location access denied");
          // Fallback to Bangkok
          setLocation({ lat: 13.7563, lng: 100.5018 });
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      // Fallback to Bangkok
      setLocation({ lat: 13.7563, lng: 100.5018 });
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchData(location);
    }
  }, [location]);

  const fetchData = async (loc: { lat: number; lng: number }) => {
    setLoading(true);
    try {
      // Fetch Prayer Times
      const date = new Date();
      const dateStr = format(date, "dd-MM-yyyy"); // API expects DD-MM-YYYY
      
      const timingsRes = await fetch(
        `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${loc.lat}&longitude=${loc.lng}&method=3` // Method 3: Muslim World League
      );
      const timingsData = await timingsRes.json();
      
      if (timingsData.code === 200) {
        setPrayerTimes(timingsData.data.timings);
        calculateNextPrayer(timingsData.data.timings);
      } else {
        throw new Error("Failed to fetch prayer times");
      }

      // Fetch Qibla
      const qiblaRes = await fetch(
        `https://api.aladhan.com/v1/qibla/${loc.lat}/${loc.lng}`
      );
      const qiblaData = await qiblaRes.json();
      
      if (qiblaData.code === 200) {
        setQiblaDirection(qiblaData.data.direction);
      }

    } catch (e) {
      console.error(e);
      toast.error("Error fetching prayer data");
    } finally {
      setLoading(false);
    }
  };

  const calculateNextPrayer = (timings: PrayerTimeData) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    let next: string | null = null;
    let nextTimeStr: string | null = null;

    for (const prayer of prayers) {
      const timeStr = timings[prayer]; // "HH:mm"
      const [hours, minutes] = timeStr.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;

      if (prayerTime > currentTime) {
        next = prayer;
        nextTimeStr = timeStr;
        break;
      }
    }

    // If no next prayer today, it's Fajr tomorrow
    if (!next) {
      next = "Fajr";
      nextTimeStr = timings["Fajr"]; 
      // Note: This logic assumes tomorrow's Fajr is roughly same time for display purposes
      // ideally we fetch tomorrow's data but this is acceptable for immediate feedback
    }

    setNextPrayer(next);

    if (nextTimeStr) {
      const [nextH, nextM] = nextTimeStr.split(':').map(Number);
      let diffMinutes = (nextH * 60 + nextM) - currentTime;
      if (diffMinutes < 0) diffMinutes += 24 * 60; // Add 24 hours if tomorrow

      const h = Math.floor(diffMinutes / 60);
      const m = diffMinutes % 60;
      setTimeToNextPrayer(`${h}h ${m}m`);
    }
  };

  const getPrayerIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "fajr": return <Sunrise className="size-5 text-emerald-500" />;
      case "sunrise": return <Sun className="size-5 text-yellow-500" />;
      case "dhuhr": return <Sun className="size-5 text-orange-500" />;
      case "asr": return <Sun className="size-5 text-orange-400" />;
      case "maghrib": return <Moon className="size-5 text-purple-500" />;
      case "isha": return <Moon className="size-5 text-indigo-500" />;
      default: return <Sun className="size-5" />;
    }
  };

  if (loading && !prayerTimes) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="size-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-muted-foreground">Locating and fetching data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {error && (
        <div className="bg-amber-50 text-amber-800 p-4 rounded-lg flex items-center gap-2 mb-4">
          <MapPin className="size-5" />
          <p>{error} Using default location (Bangkok).</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Next Prayer Highlight */}
        <Card className="md:col-span-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-none shadow-lg overflow-hidden relative">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
           <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="text-center md:text-left">
               <h2 className="text-2xl font-medium opacity-90 mb-1">Next Prayer</h2>
               <div className="text-5xl font-bold capitalize mb-2">{nextPrayer}</div>
               <p className="text-xl opacity-80">in {timeToNextPrayer}</p>
             </div>
             <div className="text-center md:text-right">
               <div className="text-3xl font-bold">{format(new Date(), "EEEE, d MMMM yyyy")}</div>
               <div className="text-xl opacity-80 mt-1 flex items-center justify-center md:justify-end gap-2">
                 <MapPin className="size-5" />
                 {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}
               </div>
             </div>
           </CardContent>
        </Card>

        {/* Prayer Times List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="size-5 text-emerald-600" />
              Prayer Times
            </CardTitle>
            <CardDescription>Daily prayer schedule for your location</CardDescription>
          </CardHeader>
          <CardContent>
            {prayerTimes ? (
              <div className="space-y-4">
                {["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map((prayer) => (
                  <div 
                    key={prayer} 
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      nextPrayer === prayer
                        ? "bg-emerald-50 border border-emerald-100" 
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getPrayerIcon(prayer)}
                      <span className={`font-medium ${nextPrayer === prayer ? "text-emerald-700" : ""}`}>
                        {prayer}
                      </span>
                    </div>
                    <span className="font-semibold font-mono text-lg">
                      {prayerTimes[prayer]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Fetching data...</p>
            )}
          </CardContent>
        </Card>

        {/* Qibla Compass */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="size-5 text-emerald-600" />
              Qibla Compass
            </CardTitle>
            <CardDescription>Direction towards Kaaba (Mecca)</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="relative size-64 flex items-center justify-center">
              {/* Compass Dial */}
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full flex items-center justify-center bg-slate-50">
                {/* Cardinal Points */}
                <span className="absolute top-2 text-xs font-bold text-slate-400">N</span>
                <span className="absolute bottom-2 text-xs font-bold text-slate-400">S</span>
                <span className="absolute left-2 text-xs font-bold text-slate-400">W</span>
                <span className="absolute right-2 text-xs font-bold text-slate-400">E</span>
                
                {/* Degree ticks would go here */}
              </div>

              {/* Kaaba Icon / Direction Indicator */}
              {qiblaDirection !== null && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: qiblaDirection }}
                  transition={{ type: "spring", stiffness: 50 }}
                >
                  <div className="relative h-full w-full">
                    {/* The pointer */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-emerald-600"></div>
                      <div className="w-1 h-24 bg-emerald-600/50 rounded-full mt-[-5px]"></div>
                    </div>
                    {/* Center point */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-4 bg-emerald-600 rounded-full border-2 border-white shadow-sm z-10"></div>
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="mt-8 text-center">
              <div className="text-3xl font-bold text-emerald-700">
                {qiblaDirection?.toFixed(1)}°
              </div>
              <p className="text-sm text-muted-foreground">
                from North
              </p>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg max-w-xs text-center">
              <p>Align your phone/device to North to use this compass accurately.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
