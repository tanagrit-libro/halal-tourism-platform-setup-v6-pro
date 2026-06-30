export interface SupportSatisfactionRating {
  ticketId: string;
  rating: number;
  comment: string;
  ratedBy: string;
  ratedAt: string;
}

const STORAGE_KEY = "halal-tourism-support-satisfaction-v7";

const DEFAULT_RATINGS: SupportSatisfactionRating[] = [
  {
    ticketId: "TKT-004",
    rating: 5,
    comment: "The admin updated our operating hours quickly.",
    ratedBy: "Sarah Nurul",
    ratedAt: "2026-05-22",
  },
  {
    ticketId: "TKT-001",
    rating: 4,
    comment: "Clear guidance about certificate scan quality.",
    ratedBy: "Yana Ali",
    ratedAt: "2026-06-16",
  },
];

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadSupportSatisfactionRatings(): SupportSatisfactionRating[] {
  if (!isBrowser()) return DEFAULT_RATINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RATINGS));
      return DEFAULT_RATINGS;
    }
    const parsed = JSON.parse(raw) as SupportSatisfactionRating[];
    return parsed.length ? parsed : DEFAULT_RATINGS;
  } catch {
    return DEFAULT_RATINGS;
  }
}

export function saveSupportSatisfactionRating(rating: SupportSatisfactionRating) {
  if (!isBrowser()) return;
  const ratings = loadSupportSatisfactionRatings();
  const next = ratings.some((item) => item.ticketId === rating.ticketId)
    ? ratings.map((item) => item.ticketId === rating.ticketId ? rating : item)
    : [rating, ...ratings];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("prototype-support-rating-updated"));
}

export function getSupportSatisfactionSummary() {
  const ratings = loadSupportSatisfactionRatings();
  const average = ratings.length ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length : 0;
  return {
    average,
    ratedTickets: ratings.length,
    latestRating: ratings[0],
  };
}
