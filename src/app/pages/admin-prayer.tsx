import { AdminLayout } from "../components/admin-layout";
import { PrayerTimesCompass } from "../components/PrayerTimesCompass";

interface AdminPrayerProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function AdminPrayer({ onNavigate, onLogout }: AdminPrayerProps) {
  return (
    <AdminLayout activePage="prayer" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Prayer Times Utility</h1>
        <p className="text-muted-foreground mt-2">
          Check prayer times and direction.
        </p>
      </div>
      <PrayerTimesCompass />
    </AdminLayout>
  );
}
