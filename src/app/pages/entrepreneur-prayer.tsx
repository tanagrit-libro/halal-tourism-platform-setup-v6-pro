import { EntrepreneurLayout } from "../components/entrepreneur-layout";
import { PrayerTimesCompass } from "../components/PrayerTimesCompass";

interface EntrepreneurPrayerProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function EntrepreneurPrayer({ onNavigate, onLogout }: EntrepreneurPrayerProps) {
  return (
    <EntrepreneurLayout activePage="prayer" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Prayer Times</h1>
        <p className="text-muted-foreground mt-2">
          Prayer schedule for your business planning.
        </p>
      </div>
      <PrayerTimesCompass />
    </EntrepreneurLayout>
  );
}
