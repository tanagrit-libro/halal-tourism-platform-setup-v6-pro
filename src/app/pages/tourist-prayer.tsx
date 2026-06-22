import { TouristLayout } from "../components/tourist-layout";
import { PrayerTimesCompass } from "../components/PrayerTimesCompass";
import { TouristAuthProps } from "../types/tourist-auth";

interface TouristPrayerProps extends TouristAuthProps {
  onNavigate?: (page: string) => void;
}

export function TouristPrayer({ onNavigate, isTouristLoggedIn, onTouristLogout }: TouristPrayerProps) {
  return (
    <TouristLayout activePage="prayer" onNavigate={onNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={onTouristLogout}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Prayer Times & Qibla</h1>
        <p className="text-muted-foreground mt-2">
          Find accurate prayer times and Qibla direction for your current location.
        </p>
      </div>
      <PrayerTimesCompass />
    </TouristLayout>
  );
}
