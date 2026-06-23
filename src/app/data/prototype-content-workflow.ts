import { useEffect, useState } from "react";
import { addAuditEvent } from "./prototype-audit-workflow";

export type PrototypeContentStatus = "Draft" | "In Review" | "Scheduled" | "Published" | "Archived";
export type PrototypeContentType = "Article" | "News" | "Guide" | "Press Release";

export interface PrototypeContentRecord {
  id: string;
  title: string;
  slug: string;
  type: PrototypeContentType;
  category: string;
  excerpt: string;
  body: string;
  coverImage: string;
  author: string;
  status: PrototypeContentStatus;
  tags: string[];
  relatedPlaceIds: string[];
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  scheduledAt?: string;
  reviewerComment?: string;
  featured?: boolean;
}

const STORAGE_KEY = "halal-tourism-prototype-content-v1";
const SELECTED_KEY = "halal-tourism-selected-article-id";

export const CONTENT_CATEGORIES = [
  "Food & Dining",
  "Travel Guide",
  "Religious",
  "Accommodation",
  "Culture",
  "News",
];

export const CONTENT_TYPES: PrototypeContentType[] = ["Article", "News", "Guide", "Press Release"];
export const CONTENT_STATUSES: PrototypeContentStatus[] = ["Draft", "In Review", "Scheduled", "Published", "Archived"];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function createSlug(title: string) {
  return slugify(title) || `content-${Date.now().toString(36)}`;
}

export const DEFAULT_CONTENT: PrototypeContentRecord[] = [
  {
    id: "content-1",
    title: "Top 10 Halal Restaurants in Bangkok You Must Try",
    slug: "top-10-halal-restaurants-in-bangkok",
    type: "Article",
    category: "Food & Dining",
    excerpt: "Discover halal dining experiences in Thailand's capital with source notes, prayer-friendly stops, and transparent trust badges.",
    body: "Bangkok has a wide range of halal-friendly dining options for Muslim travelers, from long-standing neighborhood restaurants to hotel kitchens with documented certification.\n\nThis guide highlights places with clear source records, visible halal status, and practical travel context such as nearby prayer facilities, opening hours, and family-friendly amenities.\n\nGoSafar Thailand displays travel information from recognized agencies, partner datasets, and reviewed operator submissions. The platform does not issue halal certification. Certification decisions remain with the relevant certifying authority.",
    coverImage: "https://images.unsplash.com/photo-1600555379885-08a02224726d?w=1200",
    author: "Content Admin (Creator)",
    status: "Published",
    tags: ["Bangkok", "Restaurants", "Halal food"],
    relatedPlaceIds: ["demo-1"],
    seoTitle: "Top Halal Restaurants in Bangkok",
    seoDescription: "A traveler-friendly guide to halal restaurants in Bangkok with source transparency.",
    createdAt: "2026-02-01",
    updatedAt: "2026-02-07",
    publishedAt: "2026-02-07",
    featured: true,
  },
  {
    id: "content-2",
    title: "Halal-Friendly Travel Guide to Phuket",
    slug: "halal-friendly-travel-guide-to-phuket",
    type: "Guide",
    category: "Travel Guide",
    excerpt: "Plan a Phuket trip with halal dining, prayer access, family beaches, and hotel considerations in one practical guide.",
    body: "Phuket is a major destination for Muslim travelers because it combines beaches, family resorts, seafood dining, and access to local mosques.\n\nBefore booking, travelers should review certification source, distance to prayer facilities, and transport time between hotel zones.\n\nUse GoSafar Thailand as a planning layer and verify certification decisions with the relevant authority or operator when needed.",
    coverImage: "https://images.unsplash.com/photo-1761475051005-c22a463f1084?w=1200",
    author: "Travel Editor",
    status: "Published",
    tags: ["Phuket", "Family travel", "Guide"],
    relatedPlaceIds: ["demo-2"],
    seoTitle: "Halal-Friendly Phuket Travel Guide",
    seoDescription: "Halal-conscious planning guidance for Phuket travel.",
    createdAt: "2026-02-03",
    updatedAt: "2026-02-08",
    publishedAt: "2026-02-08",
  },
  {
    id: "content-3",
    title: "New Prayer Room at Airport",
    slug: "new-prayer-room-at-airport",
    type: "News",
    category: "Religious",
    excerpt: "A short update prepared for review before public release.",
    body: "Airport prayer facilities are important for Muslim travelers with connecting journeys. This draft news item should be reviewed for source accuracy before publication.",
    coverImage: "https://images.unsplash.com/photo-1768152860286-15fa04f4b1a1?w=1200",
    author: "Staff",
    status: "Draft",
    tags: ["Prayer room", "Airport"],
    relatedPlaceIds: ["demo-3"],
    seoTitle: "Airport Prayer Room Update",
    seoDescription: "Prayer room update for Muslim travelers.",
    createdAt: "2026-02-05",
    updatedAt: "2026-02-05",
  },
];

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadPrototypeContent(): PrototypeContentRecord[] {
  if (!isBrowser()) return DEFAULT_CONTENT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
      return DEFAULT_CONTENT;
    }
    const parsed = JSON.parse(raw) as PrototypeContentRecord[];
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function savePrototypeContent(records: PrototypeContentRecord[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  window.dispatchEvent(new CustomEvent("prototype-content-updated"));
}

export function upsertPrototypeContent(record: PrototypeContentRecord, auditAction?: string) {
  const records = loadPrototypeContent();
  const exists = records.some((item) => item.id === record.id);
  const next = exists ? records.map((item) => item.id === record.id ? record : item) : [record, ...records];
  savePrototypeContent(next);
  addAuditEvent({
    action: auditAction === "publish" ? "Publish" : auditAction === "review" ? "Submit for Review" : exists ? "Edit" : "Create Draft",
    entityId: record.id,
    entity: record.title,
    entityType: "Content",
    detail: `${exists ? "Updated" : "Created"} ${record.type.toLowerCase()} content with status ${record.status}.`,
    statusAfter: record.status,
  });
  return record;
}

export function updatePrototypeContent(id: string, patch: Partial<PrototypeContentRecord>, auditAction?: "Publish" | "Archive" | "Restore" | "Submit for Review" | "Schedule" | "Edit") {
  const records = loadPrototypeContent();
  const current = records.find((item) => item.id === id);
  const next = records.map((item) =>
    item.id === id
      ? {
          ...item,
          ...patch,
          updatedAt: today(),
          publishedAt: patch.status === "Published" ? today() : item.publishedAt,
        }
      : item
  );
  savePrototypeContent(next);
  const updated = next.find((item) => item.id === id);
  if (current && updated && auditAction) {
    addAuditEvent({
      action: auditAction,
      entityId: id,
      entity: updated.title,
      entityType: "Content",
      detail: `${auditAction} applied to content "${updated.title}".`,
      statusBefore: current.status,
      statusAfter: updated.status,
      reason: updated.reviewerComment,
    });
  }
  return next;
}

export function createContentRecord(input: Omit<PrototypeContentRecord, "id" | "createdAt" | "updatedAt"> & { id?: string }) {
  const record: PrototypeContentRecord = {
    ...input,
    id: input.id ?? `CNT-${Date.now().toString(36).toUpperCase()}`,
    slug: input.slug || createSlug(input.title),
    createdAt: today(),
    updatedAt: today(),
    publishedAt: input.status === "Published" ? today() : input.publishedAt,
  };
  return upsertPrototypeContent(record, record.status === "Published" ? "publish" : record.status === "In Review" ? "review" : undefined);
}

export function getPublishedContent(records = loadPrototypeContent()) {
  return records
    .filter((item) => item.status === "Published")
    .sort((a, b) => (b.publishedAt ?? b.updatedAt).localeCompare(a.publishedAt ?? a.updatedAt));
}

export function setSelectedArticleId(id: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(SELECTED_KEY, id);
}

export function getSelectedArticleId() {
  if (!isBrowser()) return "";
  return window.localStorage.getItem(SELECTED_KEY) ?? "";
}

export function usePrototypeContent() {
  const [content, setContent] = useState<PrototypeContentRecord[]>(() => loadPrototypeContent());

  useEffect(() => {
    const refresh = () => setContent(loadPrototypeContent());
    window.addEventListener("storage", refresh);
    window.addEventListener("prototype-content-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("prototype-content-updated", refresh);
    };
  }, []);

  return {
    content,
    setContent: savePrototypeContent,
    upsertContent: upsertPrototypeContent,
    updateContent: updatePrototypeContent,
  };
}
