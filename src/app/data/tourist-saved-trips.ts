import { TrustStatus } from "../components/halal-badge";

export const SELECTED_SAVED_TRIP_KEY = "gosafar-selected-saved-trip";

export interface SavedTripActivity {
  id: string;
  time: string;
  place: string;
  activity: string;
  category: string;
  trustStatus: TrustStatus;
  agency?: string;
  reasons: string[];
}

export interface SavedTripDayPlan {
  day: number;
  title: string;
  activities: SavedTripActivity[];
}

export interface SavedTripItinerary {
  id: string;
  name: string;
  destination: string;
  date: string;
  duration: string;
  travelers: string;
  budget: string;
  status: "Upcoming" | "Completed";
  image: string;
  itinerary: SavedTripDayPlan[];
}

export const SAVED_TRIP_ITINERARIES: SavedTripItinerary[] = [
  {
    id: "bangkok-halal-adventure",
    name: "Bangkok Halal Adventure",
    destination: "Bangkok",
    date: "Feb 10 - Feb 12, 2026",
    duration: "3 Days",
    travelers: "2 Travelers",
    budget: "Moderate Budget",
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800",
    itinerary: [
      {
        day: 1,
        title: "Arrival & Bangkok Exploration",
        activities: [
          {
            id: "bkk-1-1",
            time: "09:00",
            place: "Grand Mosque Restaurant",
            activity: "Breakfast",
            category: "Restaurant",
            trustStatus: "certified",
            agency: "CICOT (Central Islamic Council of Thailand)",
            reasons: [
              "Halal-certified restaurant on the morning route",
              "Near central Bangkok prayer facilities",
              "Good fit for a moderate budget breakfast stop",
            ],
          },
          {
            id: "bkk-1-2",
            time: "11:30",
            place: "Bangkok Islamic Centre",
            activity: "Prayer Break",
            category: "Mosque",
            trustStatus: "source-verified",
            reasons: [
              "Scheduled near midday prayer time",
              "Source-verified prayer facility",
              "Reduces backtracking before the museum visit",
            ],
          },
          {
            id: "bkk-1-3",
            time: "14:00",
            place: "Bangkok National Museum",
            activity: "Cultural Visit",
            category: "Attraction",
            trustStatus: "source-verified",
            reasons: [
              "Matches historical and cultural interests",
              "Indoor stop during warmer afternoon hours",
              "Pairs naturally with nearby heritage areas",
            ],
          },
          {
            id: "bkk-1-4",
            time: "18:30",
            place: "Yana Restaurant",
            activity: "Dinner",
            category: "Restaurant",
            trustStatus: "certified",
            agency: "CICOT (Central Islamic Council of Thailand)",
            reasons: [
              "Reliable certified halal dinner option",
              "Easy access from major shopping and transit areas",
              "Strong tourist familiarity for first-day dining",
            ],
          },
        ],
      },
      {
        day: 2,
        title: "Riverfront Heritage & Local Food",
        activities: [
          {
            id: "bkk-2-1",
            time: "09:30",
            place: "The Grand Palace",
            activity: "Sightseeing",
            category: "Attraction",
            trustStatus: "source-verified",
            reasons: [
              "Iconic Bangkok cultural landmark",
              "Best visited earlier in the day",
              "Works well with nearby riverfront routing",
            ],
          },
          {
            id: "bkk-2-2",
            time: "12:45",
            place: "Usman Thai Muslim Food",
            activity: "Lunch",
            category: "Restaurant",
            trustStatus: "certified",
            agency: "CICOT (Central Islamic Council of Thailand)",
            reasons: [
              "Certified halal lunch stop",
              "Popular halal-friendly Thai menu",
              "Balanced travel time after morning sightseeing",
            ],
          },
          {
            id: "bkk-2-3",
            time: "15:30",
            place: "Riverfront Heritage Walk",
            activity: "Cultural Walk",
            category: "Attraction",
            trustStatus: "source-verified",
            reasons: [
              "Adds a relaxed outdoor activity",
              "Good photo opportunities near the river",
              "Keeps the day balanced and not too rushed",
            ],
          },
        ],
      },
      {
        day: 3,
        title: "Shopping, Cafe & Departure",
        activities: [
          {
            id: "bkk-3-1",
            time: "10:00",
            place: "Factory Coffee",
            activity: "Cafe Stop",
            category: "Cafe",
            trustStatus: "pending",
            reasons: [
              "Convenient light start before shopping",
              "Popular cafe near central transit",
              "Pending status is clearly shown for review transparency",
            ],
          },
          {
            id: "bkk-3-2",
            time: "12:30",
            place: "MBK Muslim Prayer Room",
            activity: "Prayer Break",
            category: "Prayer Facility",
            trustStatus: "source-verified",
            reasons: [
              "Located inside a major shopping area",
              "Supports prayer planning before departure",
              "Minimizes route changes on the final day",
            ],
          },
          {
            id: "bkk-3-3",
            time: "14:00",
            place: "Chatuchak Weekend Market Halal Zone",
            activity: "Shopping & Snacks",
            category: "Market",
            trustStatus: "owner-submitted",
            reasons: [
              "Good final-day shopping experience",
              "Includes halal-friendly food options",
              "Flexible timing before the trip ends",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "phuket-beach-retreat",
    name: "Phuket Beach Retreat",
    destination: "Phuket",
    date: "Jan 15 - Jan 20, 2026",
    duration: "5 Days",
    travelers: "2 Travelers",
    budget: "Premium Budget",
    status: "Completed",
    image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800",
    itinerary: [
      {
        day: 1,
        title: "Arrival, Check-in & Halal Dinner",
        activities: [
          {
            id: "phuket-1-1",
            time: "14:00",
            place: "JW Marriott Phuket Resort",
            activity: "Check-in",
            category: "Hotel",
            trustStatus: "certified",
            agency: "THSI (The Halal Standard Institute of Thailand)",
            reasons: [
              "Premium resort suitable for beach retreat",
              "Halal-friendly facilities and verified service notes",
              "Low travel pressure on arrival day",
            ],
          },
          {
            id: "phuket-1-2",
            time: "18:30",
            place: "Patong Halal Kitchen",
            activity: "Dinner",
            category: "Restaurant",
            trustStatus: "owner-submitted",
            reasons: [
              "Nearby halal-friendly dinner option",
              "Good first-night casual dining stop",
              "Keeps route short after arrival",
            ],
          },
        ],
      },
      {
        day: 2,
        title: "Beach Day & Prayer-Friendly Timing",
        activities: [
          {
            id: "phuket-2-1",
            time: "09:00",
            place: "Mai Khao Beach",
            activity: "Beach Relaxation",
            category: "Beach Attraction",
            trustStatus: "source-verified",
            reasons: [
              "Quiet beach experience near the hotel",
              "Best visited in the morning before peak heat",
              "Supports a relaxed travel style",
            ],
          },
          {
            id: "phuket-2-2",
            time: "12:15",
            place: "Mai Khao Prayer Facility",
            activity: "Prayer Break",
            category: "Prayer Facility",
            trustStatus: "source-verified",
            reasons: [
              "Added near midday prayer time",
              "Located close to the beach route",
              "Reduces unnecessary return travel",
            ],
          },
          {
            id: "phuket-2-3",
            time: "16:30",
            place: "Promthep Cape",
            activity: "Sunset Viewpoint",
            category: "Attraction",
            trustStatus: "source-verified",
            reasons: [
              "Signature Phuket viewpoint",
              "Timed for sunset experience",
              "Complements the beach retreat theme",
            ],
          },
        ],
      },
      {
        day: 3,
        title: "Island Route & Seafood",
        activities: [
          {
            id: "phuket-3-1",
            time: "08:30",
            place: "Phang Nga Bay Pier",
            activity: "Island Transfer",
            category: "Attraction",
            trustStatus: "source-verified",
            reasons: [
              "Efficient start for island route",
              "Supports multi-stop coastal travel",
              "Works well with a premium day tour",
            ],
          },
          {
            id: "phuket-3-2",
            time: "13:00",
            place: "Phuket Halal Seafood",
            activity: "Lunch",
            category: "Restaurant",
            trustStatus: "certified",
            agency: "สถาบันฮาลาล ม.อ. (Halal Inst. PSU)",
            reasons: [
              "Certified halal seafood option",
              "Matches beach and coastal dining preference",
              "Good midpoint break during island route",
            ],
          },
          {
            id: "phuket-3-3",
            time: "17:30",
            place: "Old Phuket Town",
            activity: "Cultural Walk",
            category: "Attraction",
            trustStatus: "source-verified",
            reasons: [
              "Adds cultural balance to the beach retreat",
              "Easy evening walking route",
              "Good access to cafes and local shops",
            ],
          },
        ],
      },
      {
        day: 4,
        title: "Wellness & Family-Friendly Stops",
        activities: [
          {
            id: "phuket-4-1",
            time: "10:00",
            place: "Phuket Wellness Spa",
            activity: "Wellness & Beauty",
            category: "Wellness Attraction",
            trustStatus: "source-verified",
            reasons: [
              "Matches wellness and relaxation theme",
              "Light activity after island day",
              "Good fit for a premium budget",
            ],
          },
          {
            id: "phuket-4-2",
            time: "13:30",
            place: "Phuket Central Mosque",
            activity: "Prayer Visit",
            category: "Mosque",
            trustStatus: "certified",
            agency: "CICOT (Central Islamic Council of Thailand)",
            reasons: [
              "Recognized Muslim community landmark",
              "Reliable prayer facility",
              "Adds local halal-friendly context",
            ],
          },
        ],
      },
      {
        day: 5,
        title: "Departure Day",
        activities: [
          {
            id: "phuket-5-1",
            time: "09:30",
            place: "Resort Breakfast",
            activity: "Breakfast",
            category: "Hotel",
            trustStatus: "certified",
            agency: "THSI (The Halal Standard Institute of Thailand)",
            reasons: [
              "Keeps departure morning simple",
              "Uses the verified hotel service flow",
              "Avoids unnecessary travel before checkout",
            ],
          },
          {
            id: "phuket-5-2",
            time: "11:30",
            place: "Phuket Airport Prayer Room",
            activity: "Prayer Break",
            category: "Prayer Facility",
            trustStatus: "source-verified",
            reasons: [
              "Useful before flight departure",
              "Located at the airport",
              "Supports prayer needs without extra stops",
            ],
          },
        ],
      },
    ],
  },
];

export function getSavedTripById(id: string | null) {
  if (!id) return undefined;
  return SAVED_TRIP_ITINERARIES.find((trip) => trip.id === id);
}

export function countSavedTripPlaces(trip: SavedTripItinerary) {
  return trip.itinerary.reduce((total, day) => total + day.activities.length, 0);
}
