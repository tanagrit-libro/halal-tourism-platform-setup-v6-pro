import { useEffect, useState } from "react";

export type PrototypeAuditAction =
  | "Create Draft"
  | "Edit"
  | "Submit for Review"
  | "Publish"
  | "Schedule"
  | "Archive"
  | "Restore"
  | "Approve"
  | "Reject"
  | "Return for Correction"
  | "Request Docs"
  | "Unpublish"
  | "Auto-hide Expired";

export interface PrototypeAuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: PrototypeAuditAction;
  entityId: string;
  entity: string;
  entityType: "Content" | "Place";
  detail: string;
  statusBefore?: string;
  statusAfter?: string;
  reason?: string;
  visibleToEntrepreneur?: boolean;
  status: "Success" | "Failed" | "Warning";
}

const STORAGE_KEY = "halal-tourism-prototype-audit-v1";

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadPrototypeAuditEvents(): PrototypeAuditEvent[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PrototypeAuditEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePrototypeAuditEvents(events: PrototypeAuditEvent[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  window.dispatchEvent(new CustomEvent("prototype-audit-updated"));
}

export function addAuditEvent(event: Omit<PrototypeAuditEvent, "id" | "timestamp" | "actor" | "role" | "status"> & Partial<Pick<PrototypeAuditEvent, "actor" | "role" | "status">>) {
  const nextEvent: PrototypeAuditEvent = {
    id: `AUD-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
    actor: event.actor ?? "admin@gosafar.th",
    role: event.role ?? "Super Admin",
    status: event.status ?? "Success",
    ...event,
  };
  const next = [nextEvent, ...loadPrototypeAuditEvents()].slice(0, 80);
  savePrototypeAuditEvents(next);
  return nextEvent;
}

export function usePrototypeAuditEvents() {
  const [events, setEvents] = useState<PrototypeAuditEvent[]>(() => loadPrototypeAuditEvents());

  useEffect(() => {
    const refresh = () => setEvents(loadPrototypeAuditEvents());
    window.addEventListener("storage", refresh);
    window.addEventListener("prototype-audit-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("prototype-audit-updated", refresh);
    };
  }, []);

  return { events, addAuditEvent };
}
