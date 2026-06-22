export const PLACE_TYPES = [
  { value: "restaurant", label: "Restaurant", pluralLabel: "Restaurants" },
  { value: "cafe", label: "Cafe", pluralLabel: "Cafes" },
  { value: "hotel", label: "Hotel", pluralLabel: "Hotels" },
  { value: "resort", label: "Resort", pluralLabel: "Resorts" },
  { value: "mosque", label: "Mosque", pluralLabel: "Mosques" },
  { value: "prayer-facility", label: "Prayer Facility", pluralLabel: "Prayer Facilities" },
  { value: "attraction", label: "Attraction", pluralLabel: "Attractions" },
  { value: "shopping", label: "Shopping / Mall", pluralLabel: "Shopping / Malls" },
  { value: "spa-wellness", label: "Spa / Wellness", pluralLabel: "Spa / Wellness" },
  { value: "stopover", label: "Stopover", pluralLabel: "Stopovers" },
  { value: "other", label: "Other", pluralLabel: "Other" },
] as const;

export type PlaceTypeValue = (typeof PLACE_TYPES)[number]["value"];

export const PLACE_TYPE_LABELS = PLACE_TYPES.map((type) => type.label);

export function placeTypeLabel(value: string) {
  return PLACE_TYPES.find((type) => type.value === value)?.label ?? value;
}
